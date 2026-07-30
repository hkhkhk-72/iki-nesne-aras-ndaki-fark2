/**
 * MB-DOS-002 / MD-047 — Document Engine + Use Cases
 * Hard-coded belge yok. Workflow → Document Engine.
 */
(function () {
  'use strict';

  const STATUS = function () {
    return window.DocumentStatus || {
      Draft: 'Draft',
      Generating: 'Generating',
      WaitingApproval: 'WaitingApproval',
      Approved: 'Approved',
      Rejected: 'Rejected',
      Archived: 'Archived',
      Expired: 'Expired',
      Deleted: 'Deleted'
    };
  };

  function uid(prefix) {
    return (prefix || 'doc') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function contextDefaults() {
    const storage = window.MiniBilgeStorage;
    const school = storage ? storage.getSchool() : {};
    const cls = storage ? storage.getClassContext() : { sinif: '1', sube: 'A', label: '1/A' };
    const profile = storage ? storage.getProfile() : {};
    let contextId = 'ctx-local';
    const cache = window.ContextCacheService;
    if (cache && cache.isLoaded && cache.isLoaded()) {
      const c = cache.get();
      contextId = (c && (c.id || c.contextId || c.label)) || contextId;
    }
    return {
      createdBy: profile.adSoyad || 'Öğretmen',
      contextId: contextId,
      schoolYear: school.egitimYili || '2025-2026',
      grade: cls.sinif,
      classroom: cls.label,
      branch: cls.sube
    };
  }

  function createEntity(input) {
    const o = input || {};
    const ctx = contextDefaults();
    const now = new Date().toISOString();
    const type = o.documentType || o.type || o.docId;
    let title = o.title;
    if (!title && window.DocumentDNA && type) {
      const dna = window.DocumentDNA.get(type);
      if (dna) title = dna.name || dna.code || type;
    }
    return {
      id: o.id || uid('doc'),
      documentType: type,
      title: title || 'Adsız belge',
      status: o.status || STATUS().Draft,
      version: o.version || 1,
      createdAt: o.createdAt || now,
      updatedAt: now,
      createdBy: o.createdBy || ctx.createdBy,
      contextId: o.contextId || ctx.contextId,
      schoolYear: o.schoolYear || ctx.schoolYear,
      grade: o.grade != null ? String(o.grade) : ctx.grade,
      classroom: o.classroom || ctx.classroom,
      branch: o.branch || ctx.branch,
      dependencies: o.dependencies || [],
      events: o.events || [],
      metadata: Object.assign({ workflowSource: o.workflowSource || null }, o.metadata || {}),
      tags: o.tags || []
    };
  }

  /** Use case: CreateDocument — yalnızca Engine / Workflow üzerinden */
  function CreateDocument(input) {
    const doc = createEntity(input);
    if (!doc.documentType) {
      throw new Error('CreateDocument: documentType zorunlu (DNA id)');
    }
    if (oDependenciesNull(input) && window.DocumentDNA) {
      const dna = window.DocumentDNA.get(doc.documentType);
      if (dna && Array.isArray(dna.related) && dna.related.length) {
        doc.dependencies = dna.related.map(function (r) {
          return typeof r === 'string' ? { type: r } : r;
        });
      } else if (dna && Array.isArray(dna.dependencies)) {
        doc.tags = doc.tags.concat(
          dna.dependencies.map(function (d) { return 'dep:' + (d.id || d); })
        );
      }
    }
    doc.events = [{ type: 'DocumentCreated', at: doc.createdAt, detail: null }];
    const saved = window.IDocumentRepository.save(doc);
    window.DocumentEventBus.emit('DocumentCreated', {
      documentId: saved.id,
      documentType: saved.documentType
    });
    if (window.MiniBilgeStorage && window.MiniBilgeStorage.addDocument) {
      try {
        window.MiniBilgeStorage.addDocument({
          id: saved.id,
          tur: saved.documentType,
          title: saved.title,
          status: saved.status,
          version: saved.version
        });
      } catch (e) { /* ignore */ }
    }
    return saved;
  }

  function oDependenciesNull(input) {
    return !input || input.dependencies == null;
  }

  function UpdateDocument(id, patch) {
    const doc = window.IDocumentRepository.get(id);
    if (!doc) throw new Error('Belge bulunamadı: ' + id);
    const next = Object.assign({}, doc, patch || {}, { id: doc.id, updatedAt: new Date().toISOString() });
    if (!next.events) next.events = [];
    next.events.unshift({ type: 'DocumentUpdated', at: next.updatedAt, detail: patch || null });
    const saved = window.IDocumentRepository.save(next);
    window.DocumentEventBus.emit('DocumentUpdated', { documentId: saved.id, patch: patch });
    return saved;
  }

  function ValidateDocument(id) {
    const doc = window.IDocumentRepository.get(id);
    if (!doc) throw new Error('Belge bulunamadı: ' + id);
    return window.DocumentValidationService.validate(doc);
  }

  function GenerateDocument(id, opts) {
    const doc = window.IDocumentRepository.get(id);
    if (!doc) throw new Error('Belge bulunamadı: ' + id);
    window.DocumentLifecycleService.transition(doc, STATUS().Generating, { via: 'GenerateDocument' });

    const pack = window.ContextEngine && window.ContextEngine.buildDocumentContext
      ? window.ContextEngine.buildDocumentContext({ docId: doc.documentType })
      : null;

    doc.metadata = Object.assign({}, doc.metadata, {
      generatedAt: new Date().toISOString(),
      contextPack: pack ? { cacheLoaded: !!pack.cacheLoaded, userInputs: pack.userInputs } : null,
      previewHtml: (opts && opts.previewHtml) || (
        '<article class="mb-doc-preview"><h1>' + String(doc.title).replace(/</g, '&lt;') +
        '</h1><p>Document Engine üretimi · v' + doc.version + '</p></article>'
      ),
      options: opts || null
    });
    doc.events.unshift({ type: 'DocumentGenerated', at: new Date().toISOString(), detail: null });
    window.DocumentEventBus.emit('DocumentGenerated', { documentId: doc.id });

    const validation = window.DocumentValidationService.validate(doc);
    if (validation.ok) {
      window.DocumentLifecycleService.transition(doc, STATUS().WaitingApproval, { via: 'GenerateDocument' });
    } else {
      window.DocumentLifecycleService.transition(doc, STATUS().Draft, { via: 'GenerateDocument', errors: validation.errors });
    }
    window.DocumentVersionService.bump(doc, 'generate');
    return { document: window.IDocumentRepository.get(id), validation: validation };
  }

  function ArchiveDocument(id) {
    const doc = window.IDocumentRepository.get(id);
    if (!doc) throw new Error('Belge bulunamadı: ' + id);
    return window.DocumentArchiveService.archive(doc);
  }

  function ExportDocument(id, format) {
    const doc = window.IDocumentRepository.get(id);
    if (!doc) throw new Error('Belge bulunamadı: ' + id);
    return window.DocumentExportService.export(doc, format);
  }

  function PreviewDocument(id) {
    const doc = window.IDocumentRepository.get(id);
    if (!doc) throw new Error('Belge bulunamadı: ' + id);
    doc.events = doc.events || [];
    doc.events.unshift({ type: 'DocumentPreviewed', at: new Date().toISOString(), detail: null });
    window.DocumentEventBus.emit('DocumentPreviewed', { documentId: doc.id });
    window.IDocumentRepository.save(doc);
    return {
      document: doc,
      html: (doc.metadata && doc.metadata.previewHtml) || ''
    };
  }

  /**
   * Workflow Engine köprüsü — Rule-003
   * Hard-coded create yasak; buradan geçilir.
   */
  function createFromWorkflow(task) {
    const t = task || {};
    if (!t.documentType && !t.docId) {
      throw new Error('Workflow görevinde documentType yok');
    }
    return CreateDocument({
      documentType: t.documentType || t.docId,
      title: t.title,
      workflowSource: t.id || t.workflowId || 'workflow',
      metadata: { task: t },
      dependencies: t.dependencies || [],
      tags: ['workflow'].concat(t.tags || [])
    });
  }

  const DocumentEngine = {
    decision: 'MD-047',
    code: 'MB-DOS-002',
    STATUS: STATUS(),
    WORKFLOW: window.DocumentWorkflowSteps,
    createEntity: createEntity,
    CreateDocument: CreateDocument,
    UpdateDocument: UpdateDocument,
    ValidateDocument: ValidateDocument,
    GenerateDocument: GenerateDocument,
    ArchiveDocument: ArchiveDocument,
    ExportDocument: ExportDocument,
    PreviewDocument: PreviewDocument,
    createFromWorkflow: createFromWorkflow,
    get: function (id) { return window.IDocumentRepository.get(id); },
    list: function (filter) { return window.IDocumentRepository.list(filter); },
    dependencyGraph: function (id) { return window.DocumentDependencyService.graph(id); },
    versions: function (id) { return window.DocumentVersionService.list(id); }
  };

  window.DocumentEngine = DocumentEngine;
  window.DocumentUseCases = {
    CreateDocument: CreateDocument,
    UpdateDocument: UpdateDocument,
    GenerateDocument: GenerateDocument,
    ArchiveDocument: ArchiveDocument,
    ExportDocument: ExportDocument,
    ValidateDocument: ValidateDocument
  };
})();
