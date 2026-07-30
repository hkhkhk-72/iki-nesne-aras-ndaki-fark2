/**
 * MB-DOS-002 / MD-047 — IDocumentRepository (localStorage adapter)
 * Flutter: Isar implementasyonu ARCH-002'de.
 */
(function () {
  'use strict';

  const STORE_KEY = 'minibilgeDocumentEntities';
  const VERSION_KEY = 'minibilgeDocumentVersions';

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function all() {
    return read(STORE_KEY, []);
  }

  function saveAll(list) {
    write(STORE_KEY, list.slice(0, 500));
  }

  const IDocumentRepository = {
    get: function (id) {
      return all().find(function (d) { return d.id === id; }) || null;
    },

    list: function (filter) {
      let rows = all();
      if (!filter) return rows.slice();
      if (filter.status) rows = rows.filter(function (d) { return d.status === filter.status; });
      if (filter.documentType) {
        rows = rows.filter(function (d) { return d.documentType === filter.documentType; });
      }
      if (filter.grade) rows = rows.filter(function (d) { return String(d.grade) === String(filter.grade); });
      if (filter.branch) rows = rows.filter(function (d) { return String(d.branch) === String(filter.branch); });
      if (filter.tag) {
        rows = rows.filter(function (d) {
          return Array.isArray(d.tags) && d.tags.indexOf(filter.tag) >= 0;
        });
      }
      if (filter.excludeDeleted !== false) {
        rows = rows.filter(function (d) { return d.status !== 'Deleted'; });
      }
      return rows;
    },

    save: function (doc) {
      const list = all();
      const i = list.findIndex(function (d) { return d.id === doc.id; });
      const row = Object.assign({}, doc, { updatedAt: new Date().toISOString() });
      if (i >= 0) list[i] = row;
      else list.unshift(row);
      saveAll(list);
      return row;
    },

    delete: function (id, hard) {
      if (hard) {
        saveAll(all().filter(function (d) { return d.id !== id; }));
        return true;
      }
      const doc = this.get(id);
      if (!doc) return false;
      doc.status = 'Deleted';
      doc.updatedAt = new Date().toISOString();
      return this.save(doc);
    },

    findByType: function (documentType) {
      return this.list({ documentType: documentType });
    },

    findDependents: function (documentId) {
      return all().filter(function (d) {
        const deps = d.dependencies || [];
        return deps.some(function (x) {
          const id = typeof x === 'string' ? x : (x && x.id);
          return id === documentId;
        });
      });
    },

    saveVersionSnapshot: function (documentId, snapshot) {
      const map = read(VERSION_KEY, {});
      if (!map[documentId]) map[documentId] = [];
      map[documentId].unshift(snapshot);
      map[documentId] = map[documentId].slice(0, 50);
      write(VERSION_KEY, map);
      return map[documentId];
    },

    listVersions: function (documentId) {
      const map = read(VERSION_KEY, {});
      return (map[documentId] || []).slice();
    }
  };

  window.IDocumentRepository = IDocumentRepository;
  window.DocumentRepository = IDocumentRepository;
})();
