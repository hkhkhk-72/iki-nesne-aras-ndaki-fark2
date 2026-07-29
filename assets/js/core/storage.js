(function () {
  'use strict';

  const KEYS = {
    profile: 'minibilgeProfile',
    school: 'minibilgeSchool',
    plans: 'minibilgePlans',
    documents: 'minibilgeDocuments',
    settings: 'minibilgeSettings'
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (fallback ?? null);
    } catch {
      return fallback ?? null;
    }
  }

  function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getProfile() {
    return read(KEYS.profile, {
      adSoyad: '',
      brans: 'Sınıf Öğretmeni',
      imza: '',
      eposta: '',
      telefon: ''
    });
  }

  function saveProfile(data) {
    write(KEYS.profile, { ...getProfile(), ...data });
  }

  function getSchool() {
    return read(KEYS.school, {
      okulAdi: '',
      il: '',
      ilce: '',
      mudurAdi: '',
      mudurYardimcisi: '',
      egitimYili: '2025-2026'
    });
  }

  function saveSchool(data) {
    write(KEYS.school, { ...getSchool(), ...data });
  }

  function getPlans() {
    return read(KEYS.plans, []);
  }

  function addPlan(plan) {
    const plans = getPlans();
    plans.unshift({
      id: 'plan_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...plan
    });
    write(KEYS.plans, plans.slice(0, 50));
    return plans[0];
  }

  function getDocuments() {
    return read(KEYS.documents, []);
  }

  function addDocument(doc) {
    const docs = getDocuments();
    docs.unshift({
      id: 'doc_' + Date.now(),
      downloadedAt: new Date().toISOString(),
      ...doc
    });
    write(KEYS.documents, docs.slice(0, 30));
  }

  function getSettings() {
    return read(KEYS.settings, {
      varsayilanSinif: '1',
      varsayilanDers: 'turkce',
      sube: 'A',
      tema: 'default'
    });
  }

  function saveSettings(data) {
    write(KEYS.settings, { ...getSettings(), ...data });
  }

  window.MiniBilgeStorage = {
    KEYS,
    getProfile,
    saveProfile,
    getSchool,
    saveSchool,
    getPlans,
    addPlan,
    getDocuments,
    addDocument,
    getSettings,
    saveSettings
  };
})();
