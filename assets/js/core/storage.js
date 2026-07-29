(function () {
  'use strict';

  const KEYS = {
    profile: 'minibilgeProfile',
    school: 'minibilgeSchool',
    plans: 'minibilgePlans',
    documents: 'minibilgeDocuments',
    settings: 'minibilgeSettings',
    favorites: 'minibilgeFavorites',
    weekNotes: 'minibilgeWeekNotes'
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
      aktifSinif: '1',
      aktifSube: 'A',
      siniflar: [
        { sinif: '1', sube: 'A' },
        { sinif: '2', sube: 'A' },
        { sinif: '3', sube: 'A' },
        { sinif: '4', sube: 'A' }
      ],
      tema: 'default'
    });
  }

  function saveSettings(data) {
    const next = { ...getSettings(), ...data };
    if (next.aktifSinif != null) next.varsayilanSinif = String(next.aktifSinif);
    if (next.aktifSube != null) next.sube = String(next.aktifSube);
    if (next.varsayilanSinif != null && data.aktifSinif == null) next.aktifSinif = String(next.varsayilanSinif);
    if (next.sube != null && data.aktifSube == null) next.aktifSube = String(next.sube);
    write(KEYS.settings, next);
  }

  /** MB-IA-001 — aktif sınıf/şube bağlamı */
  function getClassContext() {
    const s = getSettings();
    const sinif = String(s.aktifSinif || s.varsayilanSinif || '1');
    const sube = String(s.aktifSube || s.sube || 'A');
    return { sinif, sube, label: `${sinif}/${sube}` };
  }

  function setClassContext(sinif, sube) {
    saveSettings({
      aktifSinif: String(sinif),
      aktifSube: String(sube || 'A'),
      varsayilanSinif: String(sinif),
      sube: String(sube || 'A')
    });
    return getClassContext();
  }

  function getSiniflar() {
    const s = getSettings();
    if (Array.isArray(s.siniflar) && s.siniflar.length) {
      return s.siniflar.map(x => ({
        sinif: String(x.sinif),
        sube: String(x.sube || 'A'),
        label: `${x.sinif}/${x.sube || 'A'}`
      }));
    }
    return ['1', '2', '3', '4'].map(n => ({ sinif: n, sube: 'A', label: `${n}/A` }));
  }

  /** Favori sınıf+ders çiftleri (Kazanım Cepte esini) */
  function getFavorites() {
    return read(KEYS.favorites, []);
  }

  function saveFavorites(list) {
    write(KEYS.favorites, list.slice(0, 20));
  }

  function toggleFavorite(sinif, dersId) {
    const key = `${sinif}:${dersId}`;
    let list = getFavorites();
    if (list.some(f => f.key === key)) {
      list = list.filter(f => f.key !== key);
    } else {
      list.unshift({ key, sinif: String(sinif), dersId, addedAt: new Date().toISOString() });
    }
    saveFavorites(list);
    return list;
  }

  function isFavorite(sinif, dersId) {
    return getFavorites().some(f => f.key === `${sinif}:${dersId}`);
  }

  /** Haftalık öğretmen notu: key = egitimYili|sinif|dersId|hafta */
  function getWeekNotes() {
    return read(KEYS.weekNotes, {});
  }

  function getWeekNote(egitimYili, sinif, dersId, hafta) {
    const map = getWeekNotes();
    return map[`${egitimYili}|${sinif}|${dersId}|${hafta}`] || '';
  }

  function saveWeekNote(egitimYili, sinif, dersId, hafta, text) {
    const map = getWeekNotes();
    const key = `${egitimYili}|${sinif}|${dersId}|${hafta}`;
    if (!text) delete map[key];
    else map[key] = text;
    write(KEYS.weekNotes, map);
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
    saveSettings,
    getClassContext,
    setClassContext,
    getSiniflar,
    getFavorites,
    saveFavorites,
    toggleFavorite,
    isFavorite,
    getWeekNotes,
    getWeekNote,
    saveWeekNote
  };
})();
