/**
 * Curriculum Engine — TYMM / MEB program yükleyici
 * Ders + Kaynak seçimi: listSourcesForDers → loadCurriculum(dersId, sinif, { kaynakId })
 */
(function () {
  'use strict';

  const cache = {};
  let manifest = null;
  let sourcesRegistry = null;

  function getBase() {
    return window.MINIBILGE_BASE || '';
  }

  async function loadManifest() {
    if (manifest) return manifest;
    const res = await fetch(getBase() + 'assets/data/curriculum/index.json');
    manifest = await res.json();
    return manifest;
  }

  async function loadSourcesRegistry() {
    if (sourcesRegistry) return sourcesRegistry;
    try {
      const res = await fetch(getBase() + 'assets/data/curriculum/sources.json');
      sourcesRegistry = await res.json();
    } catch (e) {
      sourcesRegistry = { sources: [] };
    }
    return sourcesRegistry;
  }

  /**
   * Aynı ders için tüm MEB/TYMM kaynakları (sınıfa uygun olanlar).
   * @returns {Promise<Array<{id,ad,shortLabel,model,onayYili,durum,kaynakUrl,kind,grades}>>}
   */
  async function listSourcesForDers(dersId, sinif) {
    const reg = await loadSourcesRegistry();
    const sinifKey = String(sinif);
    const list = (reg.sources || []).filter(function (s) {
      if (s.dersId !== dersId) return false;
      if (!sinifKey) return true;
      return !!(s.grades && s.grades[sinifKey]);
    });

    // Registry boşsa manifest’ten tek kaynak üret
    if (!list.length) {
      const m = await loadManifest();
      const file = m.siniflar[sinifKey] && m.siniflar[sinifKey][dersId];
      if (!file) return [];
      return [{
        id: 'cur:' + dersId + ':manifest',
        dersId: dersId,
        ad: resolveDersAdi(m, dersId, sinifKey) + ' — katalog',
        shortLabel: 'Katalog',
        model: 'Türkiye Yüzyılı Maarif Modeli',
        onayYili: '2024',
        durum: 'ACTIVE',
        kaynakUrl: null,
        kind: 'manifest',
        grades: { [sinifKey]: { type: 'curriculum', file: file } }
      }];
    }

    return list.slice().sort(function (a, b) {
      const rank = { ACTIVE: 0, PARTIAL: 1, DRAFT: 2, ARCHIVED: 3 };
      return (rank[a.durum] || 9) - (rank[b.durum] || 9);
    });
  }

  async function getSource(kaynakId) {
    const reg = await loadSourcesRegistry();
    return (reg.sources || []).find(function (s) { return s.id === kaynakId; }) || null;
  }

  async function resolveDefaultKaynakId(dersId, sinif) {
    const list = await listSourcesForDers(dersId, sinif);
    const active = list.find(function (s) { return s.durum === 'ACTIVE'; });
    return (active || list[0] || {}).id || null;
  }

  async function loadFromPack(packName) {
    if (!window.TpmEngine) throw new Error('TpmEngine yok');
    const pack = await TpmEngine.loadDomainPack(packName);
    return TpmEngine.asLegacyCurriculum(pack);
  }

  async function loadFromFile(file) {
    const res = await fetch(getBase() + 'assets/data/curriculum/' + file);
    return res.json();
  }

  /**
   * @param {string} dersId
   * @param {string|number} sinif
   * @param {{ kaynakId?: string }|string} [opts] — kaynakId veya legacy 3. arg yok
   */
  async function loadCurriculum(dersId, sinif, opts) {
    const options = typeof opts === 'string' ? { kaynakId: opts } : (opts || {});
    let kaynakId = options.kaynakId || options.curriculumId || null;

    if (!kaynakId) {
      // Geriye dönük: 1. sınıf Türkçe varsayılanı TPM pack (eski davranış)
      if (String(sinif) === '1' && dersId === 'turkce') {
        kaynakId = 'cur:turkce:tpm-001';
      } else {
        kaynakId = await resolveDefaultKaynakId(dersId, sinif);
      }
    }

    const key = sinif + '_' + dersId + '_' + (kaynakId || 'default');
    if (cache[key]) return cache[key];

    const source = kaynakId ? await getSource(kaynakId) : null;
    const gradeEntry = source && source.grades && source.grades[String(sinif)];

    let data;
    if (gradeEntry && gradeEntry.type === 'domain' && gradeEntry.pack) {
      try {
        data = await loadFromPack(gradeEntry.pack);
      } catch (e) {
        console.warn('Domain pack yüklenemedi, curriculum dosyasına düşülüyor', e);
        const m = await loadManifest();
        const file = m.siniflar[String(sinif)] && m.siniflar[String(sinif)][dersId];
        if (!file) throw e;
        data = await loadFromFile(file);
      }
    } else if (gradeEntry && gradeEntry.type === 'curriculum' && gradeEntry.file) {
      data = await loadFromFile(gradeEntry.file);
    } else {
      // Legacy path
      if (String(sinif) === '1' && dersId === 'turkce' && window.TpmEngine && !options.forceManifest) {
        try {
          data = await loadFromPack('tpm-001-sinif1-turkce');
        } catch (e) {
          const m = await loadManifest();
          const dosya = m.siniflar[String(sinif)]?.[dersId];
          if (!dosya) throw new Error(sinif + '. sınıf için ders bulunamadı: ' + dersId);
          data = await loadFromFile(dosya);
        }
      } else {
        const m = await loadManifest();
        const dosya = m.siniflar[String(sinif)]?.[dersId];
        if (!dosya) throw new Error(sinif + '. sınıf için ders bulunamadı: ' + dersId);
        data = await loadFromFile(dosya);
      }
    }

    data = Object.assign({}, data, {
      kaynakId: kaynakId || null,
      kaynakMeta: source ? {
        id: source.id,
        ad: source.ad,
        shortLabel: source.shortLabel,
        model: source.model,
        onayYili: source.onayYili,
        durum: source.durum,
        kaynakUrl: source.kaynakUrl,
        kind: source.kind
      } : null
    });

    cache[key] = data;
    return data;
  }

  function getAllLearningOutcomes(curriculum) {
    const outcomes = [];
    (curriculum.temalar || []).forEach(function (tema) {
      (tema.ogrenmeCiktilari || []).forEach(function (oc) {
        outcomes.push(Object.assign({}, oc, { tema: tema.ad, temaId: tema.id }));
      });
    });
    return outcomes;
  }

  function distributeThemesToWeeks(curriculum, totalWeeks) {
    const temalar = curriculum.temalar || [];
    const temaWeeks = temalar.reduce(function (s, t) { return s + t.hafta; }, 0) || 1;
    const scale = totalWeeks / temaWeeks;

    const plan = [];
    let week = 1;
    temalar.forEach(function (tema) {
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
      const last = plan[plan.length - 1] || { temaAd: '—', ogrenmeCiktilari: [] };
      plan.push(Object.assign({}, last, { hafta: week }));
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
    const courses = [];
    for (let i = 0; i < ordered.length; i++) {
      const id = ordered[i];
      if (!(m.siniflar[sinifKey] && m.siniflar[sinifKey][id])) continue;
      const sources = await listSourcesForDers(id, sinifKey);
      courses.push({
        id: id,
        ad: resolveDersAdi(m, id, sinifKey),
        sourceCount: sources.length,
        sources: sources
      });
    }
    return courses;
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
    loadSourcesRegistry,
    loadCurriculum,
    listSourcesForDers,
    getSource,
    resolveDefaultKaynakId,
    getAllLearningOutcomes,
    distributeThemesToWeeks,
    listAvailableCourses,
    listAvailableGrades,
    getDersAdi
  };
})();
