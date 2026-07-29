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

    // TPM-001: 1. sınıf Türkçe domain paketi varsa onu tercih et
    if (String(sinif) === '1' && dersId === 'turkce' && window.TpmEngine) {
      try {
        const pack = await TpmEngine.loadDomainPack('tpm-001-sinif1-turkce');
        const data = TpmEngine.asLegacyCurriculum(pack);
        cache[key] = data;
        return data;
      } catch (e) {
        console.warn('TPM domain pack yok, keşif JSON kullanılıyor', e);
      }
    }

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

  function resolveDersAdi(m, dersId, sinif) {
    const g = String(sinif || '');
    const by = m.dersAdlariBySinif && m.dersAdlariBySinif[g];
    if (by && by[dersId]) return by[dersId];
    return (m.dersAdlari && m.dersAdlari[dersId]) || dersId;
  }

  async function listAvailableCourses(sinif, opts) {
    const m = await loadManifest();
    const sinifKey = String(sinif);
    const onlyProgram = opts && opts.onlyProgram;
    const ordered = onlyProgram && m.programDersleri && m.programDersleri[sinifKey]
      ? m.programDersleri[sinifKey]
      : Object.keys(m.siniflar[sinifKey] || {});
    return ordered
      .filter(id => m.siniflar[sinifKey] && m.siniflar[sinifKey][id])
      .map(id => ({ id, ad: resolveDersAdi(m, id, sinifKey) }));
  }

  async function listAvailableGrades() {
    const m = await loadManifest();
    return Object.keys(m.siniflar).sort();
  }

  function getDersAdi(dersId, sinif) {
    if (!manifest) return dersId;
    return resolveDersAdi(manifest, dersId, sinif);
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
