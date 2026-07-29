(function () {
  'use strict';

  /**
   * MB-IA-003 / MD-035 — Document DNA
   * Katalog: assets/data/document-catalog.json
   */

  let cache = null;
  let loadPromise = null;

  function catalogUrl() {
    const base = (typeof window !== 'undefined' && window.MINIBILGE_BASE) ? window.MINIBILGE_BASE : '';
    const inModules = /\/modules\//.test(window.location.pathname);
    const inDocs = /\/documents\//.test(window.location.pathname);
    if (inModules || inDocs) return '../assets/data/document-catalog.json';
    return (base || '') + 'assets/data/document-catalog.json';
  }

  async function load(force) {
    if (cache && !force) return cache;
    if (loadPromise && !force) return loadPromise;
    loadPromise = fetch(catalogUrl())
      .then(r => {
        if (!r.ok) throw new Error('Document catalog yüklenemedi');
        return r.json();
      })
      .then(data => {
        cache = data;
        return data;
      })
      .catch(err => {
        console.warn(err);
        cache = { versiyon: '0', belgeler: [] };
        return cache;
      });
    return loadPromise;
  }

  function all() {
    return (cache && cache.belgeler) || [];
  }

  function get(idOrCode) {
    const list = all();
    return list.find(d => d.id === idOrCode || d.code === idOrCode) || null;
  }

  function byCategory(category) {
    return all().filter(d => d.category === category);
  }

  function byModule(iaModule) {
    return all().filter(d => d.iaModule === iaModule);
  }

  function isOfficialLocked(dna, fieldId) {
    if (!dna) return false;
    return (dna.officialLocked || []).indexOf(fieldId) !== -1;
  }

  function isEditable(dna, fieldId) {
    if (!dna) return true;
    if (isOfficialLocked(dna, fieldId)) return false;
    const ed = dna.editable || [];
    if (!ed.length) return !isOfficialLocked(dna, fieldId);
    return ed.indexOf(fieldId) !== -1;
  }

  function splitLayers(dna, payload) {
    const data = payload || {};
    const official = {};
    const editable = {};
    Object.keys(data).forEach(key => {
      if (isOfficialLocked(dna, key)) official[key] = data[key];
      else editable[key] = data[key];
    });
    return { official, editable };
  }

  window.DocumentDNA = {
    load,
    all,
    get,
    byCategory,
    byModule,
    isOfficialLocked,
    isEditable,
    splitLayers,
    get cache() { return cache; }
  };
})();
