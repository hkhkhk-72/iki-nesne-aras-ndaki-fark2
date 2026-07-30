(function () {
  'use strict';

  /**
   * MD-038 — Context Cache Engine
   * Rule: Load Once — Use Everywhere
   *
   * ContextCacheService · TeacherContextAggregate · TeacherContextLoaded
   */

  const EVENT_LOADED = 'TeacherContextLoaded';
  const EVENT_INVALIDATED = 'TeacherContextInvalidated';

  /** @type {TeacherContextAggregate|null} */
  let aggregate = null;
  let loadedAt = null;
  const listeners = Object.create(null);

  function emit(event, payload) {
    (listeners[event] || []).forEach(fn => {
      try { fn(payload); } catch (e) { console.warn(e); }
    });
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('mb:' + event, { detail: payload }));
      }
    } catch (e) { /* ignore */ }
  }

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = (listeners[event] || []).filter(x => x !== fn);
    };
  }

  function readStorageSlices() {
    const profile = (window.MiniBilgeStorage && MiniBilgeStorage.getProfile()) || {};
    const school = (window.MiniBilgeStorage && MiniBilgeStorage.getSchool()) || {};
    const settings = (window.MiniBilgeStorage && MiniBilgeStorage.getSettings()) || {};
    const cls = (window.MiniBilgeStorage && MiniBilgeStorage.getClassContext)
      ? MiniBilgeStorage.getClassContext()
      : {
          sinif: String(settings.varsayilanSinif || settings.aktifSinif || '1'),
          sube: String(settings.sube || settings.aktifSube || 'A'),
          label: ''
        };
    if (!cls.label) cls.label = `${cls.sinif}/${cls.sube}`;
    return { profile, school, settings, cls };
  }

  function weeklyHoursFromCal(cal, sinif) {
    const map = (cal && cal.haftalikDersSaati) || {};
    return map[String(sinif)] || map['1'] || null;
  }

  function dersProgramiForSinif(sinif) {
    if (window.MiniBilgeHub && MiniBilgeHub.derslerForSinif) {
      return MiniBilgeHub.derslerForSinif(sinif);
    }
    return [];
  }

  /**
   * TeacherContextAggregate — tutarlı bağlam kökü
   */
  function createAggregate(opts) {
    const o = opts || {};
    const { profile, school, settings, cls } = readStorageSlices();
    const sinif = String(o.sinif || cls.sinif);
    const sube = String(o.sube || cls.sube);
    const cal = o.cal || null;
    const hours = weeklyHoursFromCal(cal, sinif);
    const program = dersProgramiForSinif(sinif);

    const agg = {
      id: `tc:${sinif}/${sube}:${school.egitimYili || '2025-2026'}`,
      loadedAt: new Date().toISOString(),
      rule: 'Load Once — Use Everywhere',
      decision: 'MD-038',

      ogretmen: {
        adSoyad: profile.adSoyad || '',
        brans: profile.brans || 'Sınıf Öğretmeni',
        imza: profile.imza || '',
        eposta: profile.eposta || '',
        telefon: profile.telefon || ''
      },
      okul: {
        ad: school.okulAdi || school.ad || '',
        il: school.il || '',
        ilce: school.ilce || '',
        mudur: school.mudurAdi || school.mudur || '',
        mudurYardimcisi: school.mudurYardimcisi || '',
        egitimYili: school.egitimYili || '2025-2026'
      },
      sinif: sinif,
      sube: sube,
      label: `${sinif}/${sube}`,
      dersProgrami: program,
      haftalikDersSaatleri: hours,
      varsayilanDers: settings.varsayilanDers || 'turkce',
      calendarRef: cal ? { egitimYili: cal.egitimYili || school.egitimYili } : null,

      /** Motorların beklediği düz görünüm */
      toEngineContext() {
        return {
          teacher: {
            adSoyad: agg.ogretmen.adSoyad,
            brans: agg.ogretmen.brans,
            imza: agg.ogretmen.imza,
            eposta: agg.ogretmen.eposta
          },
          school: {
            okulAdi: agg.okul.ad,
            il: agg.okul.il,
            ilce: agg.okul.ilce,
            mudurAdi: agg.okul.mudur,
            mudurYardimcisi: agg.okul.mudurYardimcisi,
            egitimYili: agg.okul.egitimYili
          },
          class: { sinif: agg.sinif, sube: agg.sube, label: agg.label },
          ders: agg.varsayilanDers,
          dersProgrami: agg.dersProgrami,
          haftalikDersSaatleri: agg.haftalikDersSaatleri,
          week: null
        };
      },

      /** Zero-input: bu alanlar belgede tekrar sorulmaz */
      cachedFieldIds() {
        return [
          'ogretmen', 'okul', 'il', 'ilce', 'mudur', 'mudurYardimcisi',
          'egitimYili', 'sinif', 'sube', 'dersProgrami', 'haftalikDersSaatleri'
        ];
      }
    };

    return agg;
  }

  function isLoaded() {
    return !!aggregate;
  }

  function get() {
    return aggregate;
  }

  function getOrThrow() {
    if (!aggregate) {
      throw new Error('MD-038: TeacherContext henüz yüklenmedi. ContextCacheService.load() çağırın.');
    }
    return aggregate;
  }

  /**
   * Load Once — zaten yüklüyse ve force değilse mevcut aggregate döner.
   */
  async function load(opts) {
    const o = opts || {};
    if (aggregate && !o.force) {
      return aggregate;
    }

    let cal = o.cal || null;
    if (!cal && window.CalendarEngine) {
      try {
        const school = (window.MiniBilgeStorage && MiniBilgeStorage.getSchool()) || {};
        CalendarEngine.setYear(school.egitimYili || '2025-2026');
        cal = await CalendarEngine.loadCalendar();
      } catch (e) {
        console.warn(e);
      }
    }

    aggregate = createAggregate({ cal, sinif: o.sinif, sube: o.sube });
    loadedAt = aggregate.loadedAt;

    const event = {
      type: EVENT_LOADED,
      at: loadedAt,
      aggregateId: aggregate.id,
      label: aggregate.label,
      egitimYili: aggregate.okul.egitimYili
    };
    emit(EVENT_LOADED, event);
    return aggregate;
  }

  function invalidate(reason) {
    const prev = aggregate;
    aggregate = null;
    loadedAt = null;
    emit(EVENT_INVALIDATED, { type: EVENT_INVALIDATED, reason: reason || 'manual', previousId: prev && prev.id });
  }

  /** Sınıf/şube değişince: invalidate + load */
  async function switchClass(sinif, sube, opts) {
    invalidate('class-switch');
    if (window.MiniBilgeStorage && MiniBilgeStorage.setClassContext) {
      MiniBilgeStorage.setClassContext(sinif, sube);
    }
    return load(Object.assign({}, opts || {}, { force: true, sinif, sube }));
  }

  /** Belge formları için: cache alanları soru listesinden çıkar */
  function stripCachedInputs(userInputs) {
    const cached = new Set([
      'ogretmen', 'okul', 'il', 'ilce', 'mudur', 'mudurYardimcisi', 'egitimYili',
      'sinif', 'sube', 'dersProgrami', 'haftalikDersSaatleri',
      'okulAdi', 'mudurAdi', 'adSoyad', 'teacher', 'school'
    ]);
    return (userInputs || []).filter(f => f && !cached.has(f.id));
  }

  const ContextCacheService = {
    EVENT_LOADED,
    EVENT_INVALIDATED,
    load,
    get,
    getOrThrow,
    isLoaded,
    invalidate,
    switchClass,
    stripCachedInputs,
    on,
    createAggregate,
    /** @deprecated alias */
    getAggregate: get
  };

  window.ContextCacheService = ContextCacheService;
  window.TeacherContextAggregate = { create: createAggregate };
})();
