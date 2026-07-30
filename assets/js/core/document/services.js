/**
 * MB-DOS-002 / MD-047 — Document services
 */
(function () {
  'use strict';

  const Bus = function () { return window.DocumentEventBus; };
  const Repo = function () { return window.IDocumentRepository; };

  const STATUS = {
    Draft: 'Draft',
    Generating: 'Generating',
    WaitingApproval: 'WaitingApproval',
    Approved: 'Approved',
    Rejected: 'Rejected',
    Archived: 'Archived',
    Expired: 'Expired',
    Deleted: 'Deleted'
  };

  const WORKFLOW = [
    'Create', 'Validate', 'Preview', 'Customize', 'Generate',
    'Export', 'Print', 'Share', 'Archive', 'Sync', 'Version'
  ];

  const TRANSITIONS = {
    Draft: ['Generating', 'WaitingApproval', 'Approved', 'Deleted', 'Archived'],
    Generating: ['Draft', 'WaitingApproval', 'Approved', 'Rejected'],
    WaitingApproval: ['Approved', 'Rejected', 'Draft', 'Archived'],
    Approved: ['Archived', 'Expired', 'Draft', 'WaitingApproval'],
    Rejected: ['Draft', 'Deleted', 'Archived'],
    Archived: ['Draft'],
    Expired: ['Archived', 'Deleted'],
    Deleted: []
  };

  function appendEvent(doc, type, detail) {
    if (!doc.events) doc.events = [];
    doc.events.unshift({
      type: type,
      at: new Date().toISOString(),
      detail: detail || null
    });
    doc.events = doc.events.slice(0, 100);
    return doc;
  }

  const DocumentLifecycleService = {
    STATUS: STATUS,
    WORKFLOW: WORKFLOW,
    canTransition: function (from, to) {
      return (TRANSITIONS[from] || []).indexOf(to) >= 0;
    },
    transition: function (doc, toStatus, detail) {
      if (!doc) throw new Error('document required');
      if (!this.canTransition(doc.status, toStatus) && doc.status !== toStatus) {
        throw new Error('Geçersiz durum: ' + doc.status + ' → ' + toStatus);
      }
      doc.status = toStatus;
      doc.updatedAt = new Date().toISOString();
      const map = {
        Approved: 'DocumentApproved',
        Rejected: 'DocumentRejected',
        Archived: 'DocumentArchived',
        Deleted: 'DocumentDeleted'
      };
      const evt = map[toStatus] || 'DocumentUpdated';
      appendEvent(doc, evt, detail);
      if (Bus()) Bus().emit(evt, { documentId: doc.id, status: toStatus, detail: detail });
      return Repo().save(doc);
    }
  };

  const DocumentValidationService = {
    validate: function (doc) {
      const errors = [];
      if (!doc) return { ok: false, errors: ['Belge yok'] };
      if (!doc.documentType) errors.push('documentType zorunlu');
      if (!doc.title) errors.push('title zorunlu');
      if (!doc.schoolYear) errors.push('schoolYear zorunlu');
      if (!doc.grade && !doc.classroom) errors.push('grade veya classroom zorunlu');

      if (window.DocumentDNA && doc.documentType) {
        const dna = window.DocumentDNA.get(doc.documentType);
        if (dna && Array.isArray(dna.userInputs)) {
          dna.userInputs.forEach(function (field) {
            const key = field.id || field.key || field;
            const meta = (doc.metadata && doc.metadata.inputs) || {};
            if (field.required && (meta[key] == null || meta[key] === '')) {
              errors.push('Eksik alan: ' + (field.label || key));
            }
          });
        }
      }

      const deps = DocumentDependencyService.resolve(doc);
      if (deps.missing.length) {
        errors.push('Eksik bağımlılık: ' + deps.missing.join(', '));
      }

      const result = { ok: errors.length === 0, errors: errors };
      if (result.ok) {
        appendEvent(doc, 'DocumentValidated', null);
        if (Bus()) Bus().emit('DocumentValidated', { documentId: doc.id });
        Repo().save(doc);
      }
      return result;
    }
  };

  const DocumentDependencyService = {
    /** Dependency Graph — hiçbir belge bağımsız değildir */
    resolve: function (doc) {
      const deps = (doc && doc.dependencies) || [];
      const resolved = [];
      const missing = [];
      deps.forEach(function (d) {
        const id = typeof d === 'string' ? d : (d && d.id);
        const type = typeof d === 'object' && d.type ? d.type : null;
        if (!id && type && window.DocumentDNA) {
          const found = Repo().findByType(type).filter(function (x) {
            return x.status !== 'Deleted' && x.status !== 'Archived';
          })[0];
          if (found) resolved.push(found);
          else missing.push(type);
          return;
        }
        if (!id) return;
        const hit = Repo().get(id);
        if (hit) resolved.push(hit);
        else missing.push(id);
      });
      return { resolved: resolved, missing: missing };
    },

    graph: function (rootId) {
      const nodes = {};
      const edges = [];
      function walk(id, depth) {
        if (nodes[id] || depth > 8) return;
        const doc = Repo().get(id);
        if (!doc) return;
        nodes[id] = {
          id: doc.id,
          title: doc.title,
          type: doc.documentType,
          status: doc.status
        };
        (doc.dependencies || []).forEach(function (d) {
          const depId = typeof d === 'string' ? d : (d && d.id);
          if (!depId) return;
          edges.push({ from: id, to: depId });
          walk(depId, depth + 1);
        });
        Repo().findDependents(id).forEach(function (dep) {
          edges.push({ from: dep.id, to: id });
          if (!nodes[dep.id]) {
            nodes[dep.id] = {
              id: dep.id,
              title: dep.title,
              type: dep.documentType,
              status: dep.status
            };
          }
        });
      }
      walk(rootId, 0);
      return {
        nodes: Object.keys(nodes).map(function (k) { return nodes[k]; }),
        edges: edges
      };
    },

    ensureRelated: function (doc, relatedIds) {
      doc.dependencies = Array.from(new Set([].concat(doc.dependencies || [], relatedIds || [])));
      return doc;
    }
  };

  const DocumentVersionService = {
    bump: function (doc, reason) {
      const prev = Object.assign({}, doc);
      doc.version = Number(doc.version || 1) + 1;
      doc.updatedAt = new Date().toISOString();
      appendEvent(doc, 'DocumentVersionCreated', { version: doc.version, reason: reason || null });
      Repo().saveVersionSnapshot(doc.id, {
        version: doc.version,
        at: doc.updatedAt,
        reason: reason || null,
        status: doc.status,
        title: doc.title,
        snapshot: prev
      });
      if (Bus()) {
        Bus().emit('DocumentVersionCreated', {
          documentId: doc.id,
          version: doc.version,
          reason: reason
        });
      }
      return Repo().save(doc);
    },
    list: function (documentId) {
      return Repo().listVersions(documentId);
    }
  };

  const DocumentArchiveService = {
    archive: function (doc) {
      return DocumentLifecycleService.transition(doc, STATUS.Archived, { via: 'ArchiveService' });
    }
  };

  const DocumentExportService = {
    export: function (doc, format) {
      const fmt = (format || 'html').toLowerCase();
      appendEvent(doc, 'DocumentExported', { format: fmt });
      if (Bus()) Bus().emit('DocumentExported', { documentId: doc.id, format: fmt });
      Repo().save(doc);
      if (window.MiniBilgeOffline && MiniBilgeOffline.enqueue) {
        MiniBilgeOffline.enqueue({
          type: 'document.export',
          documentId: doc.id,
          format: fmt
        });
      }
      return {
        ok: true,
        format: fmt,
        documentId: doc.id,
        title: doc.title,
        content: (doc.metadata && doc.metadata.previewHtml) || ('<!-- ' + doc.title + ' -->')
      };
    },
    print: function (doc) {
      appendEvent(doc, 'DocumentPrinted', null);
      if (Bus()) Bus().emit('DocumentPrinted', { documentId: doc.id });
      Repo().save(doc);
      return { ok: true, documentId: doc.id };
    },
    share: function (doc, target) {
      appendEvent(doc, 'DocumentShared', { target: target || null });
      if (Bus()) Bus().emit('DocumentShared', { documentId: doc.id, target: target });
      Repo().save(doc);
      return { ok: true, documentId: doc.id, target: target };
    }
  };

  window.DocumentLifecycleService = DocumentLifecycleService;
  window.DocumentValidationService = DocumentValidationService;
  window.DocumentDependencyService = DocumentDependencyService;
  window.DocumentVersionService = DocumentVersionService;
  window.DocumentArchiveService = DocumentArchiveService;
  window.DocumentExportService = DocumentExportService;
  window.DocumentStatus = STATUS;
  window.DocumentWorkflowSteps = WORKFLOW;
})();
