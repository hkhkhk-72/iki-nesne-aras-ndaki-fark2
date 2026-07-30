(function () {
  'use strict';

  /**
   * MB-IA-003 — Context Builder Engine
   * MD-031 Context First · MD-032 Zero Input · MD-038 Context Cache
   *
   * Rule: Load Once — Use Everywhere (ContextCacheService)
   */

  function buildTeacherContext() {
    if (window.ContextCacheService && ContextCacheService.isLoaded()) {
      return ContextCacheService.get().toEngineContext();
    }
    // Cache yoksa senkron fallback (load henüz çağrılmadı)
    const profile = (window.MiniBilgeStorage && MiniBilgeStorage.getProfile()) || {};
    const school = (window.MiniBilgeStorage && MiniBilgeStorage.getSchool()) || {};
    const settings = (window.MiniBilgeStorage && MiniBilgeStorage.getSettings()) || {};
    const cls = (window.MiniBilgeStorage && MiniBilgeStorage.getClassContext)
      ? MiniBilgeStorage.getClassContext()
      : { sinif: settings.varsayilanSinif || '1', sube: settings.sube || 'A', label: '1/A' };

    return {
      teacher: {
        adSoyad: profile.adSoyad || '',
        brans: profile.brans || 'Sınıf Öğretmeni',
        imza: profile.imza || '',
        eposta: profile.eposta || ''
      },
      school: {
        okulAdi: school.okulAdi || school.ad || '',
        il: school.il || '',
        ilce: school.ilce || '',
        mudurAdi: school.mudurAdi || school.mudur || '',
        mudurYardimcisi: school.mudurYardimcisi || '',
        egitimYili: school.egitimYili || '2025-2026'
      },
      class: cls,
      ders: settings.varsayilanDers || 'turkce',
      dersProgrami: (window.MiniBilgeHub && MiniBilgeHub.derslerForSinif)
        ? MiniBilgeHub.derslerForSinif(cls.sinif) : [],
      haftalikDersSaatleri: null,
      week: null
    };
  }

  function attachWeek(ctx, cal, date) {
    const out = Object.assign({}, ctx);
    try {
      if (window.CalendarEngine && cal) {
        const w = CalendarEngine.getCurrentWeek(cal, date || new Date());
        out.week = w ? { hafta: w.hafta, baslangic: w.baslangic, bitis: w.bitis } : null;
      }
    } catch (e) {
      out.week = null;
    }
    return out;
  }

  function missingZeroInputFields(ctx) {
    const miss = [];
    if (!ctx.teacher.adSoyad) miss.push('öğretmen');
    if (!ctx.school.okulAdi) miss.push('okul');
    if (!ctx.school.il) miss.push('il');
    if (!ctx.school.ilce) miss.push('ilçe');
    if (!ctx.class || !ctx.class.sinif) miss.push('sınıf');
    return miss;
  }

  function resolveUserInputs(dna, ctx) {
    let inputs = (dna && dna.userInputs) || [];
    if (window.ContextCacheService) {
      inputs = ContextCacheService.stripCachedInputs(inputs);
    }
    return inputs.filter(field => {
      if (!field || !field.id) return false;
      if (field.id === 'sinif' && ctx.class && ctx.class.sinif) return false;
      if (field.id === 'sube' && ctx.class && ctx.class.sube) return false;
      if (field.id === 'ders' && ctx.ders) return false;
      if (field.id === 'hafta' && ctx.week && ctx.week.hafta) return false;
      if (field.id === 'okul' && ctx.school.okulAdi) return false;
      if (field.id === 'ogretmen' && ctx.teacher.adSoyad) return false;
      return true;
    });
  }

  function buildDocumentContext(opts) {
    const o = opts || {};
    let ctx = buildTeacherContext();
    if (o.ders) ctx.ders = o.ders;
    if (o.sinif || o.sube) {
      ctx.class = {
        sinif: String(o.sinif || ctx.class.sinif),
        sube: String(o.sube || ctx.class.sube),
        label: `${o.sinif || ctx.class.sinif}/${o.sube || ctx.class.sube}`
      };
    }
    if (o.cal) ctx = attachWeek(ctx, o.cal, o.date);

    const dna = o.dna || (window.DocumentDNA && o.docId ? DocumentDNA.get(o.docId) : null);
    const userInputs = resolveUserInputs(dna, ctx);
    const zeroMissing = missingZeroInputFields(ctx);

    return {
      ctx,
      dna,
      userInputs,
      zeroMissing,
      readyToGenerate: zeroMissing.length === 0 && userInputs.filter(u => u.required).length === 0,
      principle: 'MD-031/032/033/038',
      cacheLoaded: !!(window.ContextCacheService && ContextCacheService.isLoaded())
    };
  }

  window.ContextEngine = {
    buildTeacherContext,
    attachWeek,
    missingZeroInputFields,
    resolveUserInputs,
    buildDocumentContext
  };
})();
