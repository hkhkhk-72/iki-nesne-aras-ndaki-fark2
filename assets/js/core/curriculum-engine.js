(function () {
  'use strict';

  const cache = {};
  let manifest = null;

  function getBase() {
    return window.MINIBILGE_BASE || '';
  }

  async function loadManifest() {
    if (manifest) return manifest;
    const res = await fetch(getBase() + 'assets/data/curriculum/index.json');
    manifest = await res.json();
    return manifest;
  }

  async function loadCurriculum(dersId, sinif) {
    const key = `${sinif}_${dersId}`;
    if (cache[key]) return cache[key];

    const m = await loadManifest();
    const sinifKey = String(sinif);
    const dosya = m.siniflar[sinifKey]?.[dersId];
    if (!dosya) throw new Error(`${sinifKey}. sınıf için ders bulunamadı: ${dersId}`);

    const res = await fetch(getBase() + `assets/data/curriculum/${dosya}`);
    const data = await res.json();
    cache[key] = data;
    return data;
  }

  function getAllLearningOutcomes(curriculum) {
    const outcomes = [];
    curriculum.temalar.forEach(tema => {
      tema.ogrenmeCiktilari.forEach(oc => {
        outcomes.push({ ...oc, tema: tema.ad, temaId: tema.id });
      });
    });
    return outcomes;
  }

  function distributeThemesToWeeks(curriculum, totalWeeks) {
    const temalar = curriculum.temalar;
    const temaWeeks = temalar.reduce((s, t) => s + t.hafta, 0);
    const scale = totalWeeks / temaWeeks;

    const plan = [];
    let week = 1;
    temalar.forEach(tema => {
      const hafta = Math.max(1, Math.round(tema.hafta * scale));
      for (let i = 0; i < hafta && week <= totalWeeks; i++) {
        plan.push({
          hafta: week,
          temaId: tema.id,
          temaAd: tema.ad,
          ogrenmeCiktilari: tema.ogrenmeCiktilari,
          icerikCercevesi: tema.icerikCercevesi,
          surecBilesenleri: tema.surecBilesenleri,
          olcmeDegerlendirme: tema.olcmeDegerlendirme || '',
          alanBecerileri: tema.alanBecerileri || [],
          kavramsalBeceriler: tema.kavramsalBeceriler || [],
          egilimler: tema.egilimler || [],
          farklilastirma: tema.farklilastirma || ''
        });
        week++;
      }
    });
    while (week <= totalWeeks) {
      const last = plan[plan.length - 1];
      plan.push({ ...last, hafta: week });
      week++;
    }
    return plan;
  }

  async function listAvailableCourses(sinif) {
    const m = await loadManifest();
    const sinifKey = String(sinif);
    const dersler = m.siniflar[sinifKey];
    if (!dersler) return [];
    return Object.keys(dersler).map(id => ({
      id,
      ad: m.dersAdlari[id] || id
    }));
  }

  async function listAvailableGrades() {
    const m = await loadManifest();
    return Object.keys(m.siniflar).sort();
  }

  function getDersAdi(dersId) {
    return manifest?.dersAdlari?.[dersId] || dersId;
  }

  window.CurriculumEngine = {
    loadManifest,
    loadCurriculum,
    getAllLearningOutcomes,
    distributeThemesToWeeks,
    listAvailableCourses,
    listAvailableGrades,
    getDersAdi
  };
})();
