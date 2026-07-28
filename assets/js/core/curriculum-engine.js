(function () {
  'use strict';

  const cache = {};

  function getBase() {
    return window.MINIBILGE_BASE || '';
  }

  const DERSLER = {
    turkce: { ad: 'Türkçe', dosya: 'sinif1-turkce.json' },
    matematik: { ad: 'Matematik', dosya: 'sinif1-matematik.json' },
    hayatBilgisi: { ad: 'Hayat Bilgisi', dosya: 'sinif1-hayat-bilgisi.json' }
  };

  async function loadCurriculum(dersId, sinif) {
    const key = `${sinif}_${dersId}`;
    if (cache[key]) return cache[key];

    const meta = DERSLER[dersId];
    if (!meta) throw new Error('Ders bulunamadı: ' + dersId);

    const res = await fetch(getBase() + `assets/data/curriculum/${meta.dosya}`);
    const data = await res.json();
    if (data.sinif !== parseInt(sinif, 10)) {
      throw new Error('Sınıf uyumsuz');
    }
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
          olcmeDegerlendirme: tema.olcmeDegerlendirme
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

  function listAvailableCourses(sinif) {
    if (sinif === '1' || sinif === 1) {
      return Object.entries(DERSLER).map(([id, m]) => ({ id, ad: m.ad }));
    }
    return [];
  }

  window.CurriculumEngine = {
    DERSLER,
    loadCurriculum,
    getAllLearningOutcomes,
    distributeThemesToWeeks,
    listAvailableCourses
  };
})();
