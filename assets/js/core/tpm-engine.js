(function () {
  'use strict';

  /**
   * MB-TPM — Öğretim Programı Motoru (domain pack okuyucu)
   * TPM-001: 1. sınıf Türkçe domain örneği
   */

  const cache = {};

  function getBase() {
    return window.MINIBILGE_BASE || '';
  }

  async function loadDomainPack(name) {
    const key = name || 'tpm-001-sinif1-turkce';
    if (cache[key]) return cache[key];
    const res = await fetch(getBase() + `assets/data/domain/${key}.json`);
    if (!res.ok) throw new Error('Domain paketi yüklenemedi: ' + key);
    const data = await res.json();
    cache[key] = data;
    return data;
  }

  function listProgramUnits(pack, opts) {
    const onlyThemes = opts && opts.onlyThemes;
    return (pack.programUnits || []).filter(u => {
      if (onlyThemes) return u.kind === 'THEME';
      return true;
    }).sort((a, b) => a.sira - b.sira);
  }

  function getUnit(pack, unitId) {
    return (pack.programUnits || []).find(u => u.id === unitId) || null;
  }

  function outcomesForUnit(pack, unitId) {
    const links = (pack.programUnitOutcomes || [])
      .filter(l => l.programUnitId === unitId)
      .sort((a, b) => a.siraInUnit - b.siraInUnit);
    const byId = Object.fromEntries((pack.learningOutcomes || []).map(o => [o.kod || o.id, o]));
    return links.map(l => ({
      ...byId[l.outcomeId],
      siraInUnit: l.siraInUnit
    })).filter(o => o && o.kod);
  }

  function getOutcome(pack, kod) {
    return (pack.learningOutcomes || []).find(o => o.kod === kod || o.id === kod) || null;
  }

  function skillsForOutcome(pack, kod) {
    const ids = (pack.outcomeSkills || [])
      .filter(x => x.outcomeId === kod)
      .map(x => x.skillId);
    return (pack.skills || []).filter(s => ids.includes(s.id));
  }

  function processComponentsForOutcome(pack, kod) {
    return (pack.processComponents || [])
      .filter(p => p.outcomeId === kod)
      .sort((a, b) => a.sira - b.sira);
  }

  function stats(pack) {
    return pack.istatistik || {
      programUnitSayisi: (pack.programUnits || []).length,
      uniqueOutcomeSayisi: (pack.learningOutcomes || []).length,
      unitOutcomeBagSayisi: (pack.programUnitOutcomes || []).length
    };
  }

  /** Keşif JSON → haftalık dağıtıma yardımcı: domain pack temalarından legacy uyumlu yapı */
  function asLegacyCurriculum(pack) {
    const themes = listProgramUnits(pack, { onlyThemes: true }).map(u => ({
      id: u.legacyTemaId || u.id,
      ad: u.ad,
      dersSaati: u.dersSaati,
      hafta: u.onerilenHafta || 1,
      ogrenmeCiktilari: outcomesForUnit(pack, u.id).map(o => ({
        kod: o.kod,
        aciklama: o.aciklama
      })),
      icerikCercevesi: u.ozet || '',
      surecBilesenleri: ['Dinleme/İzleme', 'Konuşma', 'Okuma', 'Yazma'],
      alanBecerileri: ['TAB1', 'TAB2', 'TAB3', 'TAB4'],
      olcmeDegerlendirme: 'Öğrenme kanıtları'
    }));
    return {
      ders: pack.course && pack.course.ad,
      dersId: pack.course && pack.course.dersId,
      sinif: 1,
      model: pack.curriculum && pack.curriculum.model,
      programYili: pack.curriculum && pack.curriculum.onayYili,
      haftalikDersSaati: pack.course && pack.course.haftalikDersSaati
        ? pack.course.haftalikDersSaati['1']
        : 10,
      domainPack: pack.meta && pack.meta.spec,
      temalar: themes,
      ilkOkumaYazma: pack.curriculum && pack.curriculum.ilkOkumaYazma
    };
  }

  window.TpmEngine = {
    loadDomainPack,
    listProgramUnits,
    getUnit,
    outcomesForUnit,
    getOutcome,
    skillsForOutcome,
    processComponentsForOutcome,
    stats,
    asLegacyCurriculum
  };
})();
