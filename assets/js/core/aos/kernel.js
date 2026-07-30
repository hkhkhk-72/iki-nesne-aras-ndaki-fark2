/**
 * MB-AOS-001 / MD-048 — Academic Kernel
 * En üst mimari runtime: katmanlar · DI · Event Bus · köprüler
 */
(function () {
  'use strict';

  const LAYERS = [
    'ContextKernel',
    'WorkflowKernel',
    'EngineKernel',
    'DocumentKernel',
    'AssessmentKernel',
    'TeacherWorkflowKernel',
    'AIKernel',
    'AutomationKernel',
    'SyncKernel',
    'SecurityKernel'
  ];

  const ENGINES = {
    TPM: 'TeachingProgramEngine',
    PM: 'PlanningEngine',
    TWE: 'TeacherWorkflowEngine',
    DOE: 'DocumentOrchestrator',
    DRE: 'DependencyResolver',
    TRE: 'TemplateRenderingEngine',
    AIE: 'AssessmentIntelligenceEngine',
    Calendar: 'CalendarEngine',
    Notification: 'NotificationEngine',
    AI: 'AIEngine'
  };

  const NAVIGATION = [
    'Dashboard', 'Workflow', 'Task', 'Document', 'Execution', 'Assessment', 'Archive'
  ];

  let booted = false;
  let unsubscribers = [];
  const layerStatus = Object.create(null);

  function bus() {
    return window.AosEventBus || window.GlobalEventBus;
  }

  function di() {
    return window.AosContainer;
  }

  function setLayer(name, status, meta) {
    layerStatus[name] = {
      name: name,
      status: status,
      meta: meta || null,
      at: new Date().toISOString()
    };
  }

  function readContext() {
    const storage = window.MiniBilgeStorage;
    const school = storage ? storage.getSchool() : {};
    const profile = storage ? storage.getProfile() : {};
    const cls = storage ? storage.getClassContext() : { sinif: '1', sube: 'A', label: '1/A' };
    const settings = storage ? storage.getSettings() : {};
    let cache = null;
    if (window.ContextCacheService && window.ContextCacheService.isLoaded && window.ContextCacheService.isLoaded()) {
      cache = window.ContextCacheService.get();
    }
    return {
      school: school.okulAdi || school.ad || (cache && cache.okul && cache.okul.ad) || 'Okul',
      academicYear: school.egitimYili || (cache && cache.okul && cache.okul.egitimYili) || '2025-2026',
      teacher: profile.adSoyad || (cache && cache.teacherName) || 'Öğretmen',
      grade: cls.sinif,
      class: cls.label,
      branch: cls.sube,
      course: settings.varsayilanDers || settings.aktifDers || null,
      student: null,
      theme: settings.tema || 'default',
      week: settings.aktifHafta || null,
      lesson: settings.aktifDers || settings.varsayilanDers || null,
      cacheLoaded: !!cache
    };
  }

  function registerEngines() {
    const c = di();
    if (!c) return;

    c.register('EventBus', bus());
    c.register('Container', c);

    if (window.IDocumentRepository) c.register('IDocumentRepository', window.IDocumentRepository);
    if (window.DocumentEngine) {
      c.register('DocumentEngine', window.DocumentEngine);
      c.register(ENGINES.DOE, window.DocumentEngine);
    }
    if (window.DocumentDependencyService) {
      c.register(ENGINES.DRE, window.DocumentDependencyService);
    }
    if (window.WorkflowEngine) {
      c.register(ENGINES.TWE, window.WorkflowEngine);
      c.register('WorkflowEngine', window.WorkflowEngine);
    }
    if (window.CalendarEngine) c.register(ENGINES.Calendar, window.CalendarEngine);
    if (window.LessonExecutionEngine) c.register('LessonExecutionEngine', window.LessonExecutionEngine);
    if (window.MiniBilgeOffline) c.register('OfflineSync', window.MiniBilgeOffline);
    if (window.ContextCacheService) c.register('ContextCache', window.ContextCacheService);
    if (window.MiniBilgeTxs) c.register(ENGINES.AI, window.MiniBilgeTxs);
    if (window.MiniBilgeComponents && window.MiniBilgeComponents.notify) {
      c.register(ENGINES.Notification, window.MiniBilgeComponents.notify);
    }
    if (window.DocumentDNA) c.register('DocumentDNA', window.DocumentDNA);
    if (window.AosAutomation) c.register('Automation', window.AosAutomation);

    // Soft adapters for engines not yet split
    c.factory(ENGINES.TPM, function () {
      return window.TpmEngine || window.CurriculumEngine || { status: 'planned' };
    });
    c.factory(ENGINES.PM, function () {
      return window.PlanEngine || window.AnnualPlanEngine || { status: 'planned' };
    });
    c.factory(ENGINES.TRE, function () {
      return window.EvrakEngine || { status: 'partial', render: function () { return ''; } };
    });
    c.factory(ENGINES.AIE, function () {
      return window.AssessmentIntelligence || { status: 'planned' };
    });
  }

  function bridgeDocumentBus() {
    if (!window.DocumentEventBus || !bus()) return;
    const map = {
      DocumentCreated: 'DocumentCreated',
      DocumentExported: 'ExportFinished',
      DocumentArchived: 'ArchiveCompleted',
      DocumentGenerated: 'DocumentCreated'
    };
    const off = window.DocumentEventBus.onAny(function (evt) {
      const target = map[evt.type];
      if (target) {
        bus().emit(target, Object.assign({}, evt.payload, {
          documentEvent: evt.type,
          source: 'DocumentKernel'
        }));
      }
    });
    unsubscribers.push(off);
  }

  function bridgeContext() {
    const b = bus();
    if (!b) return;

    function emitContext(reason) {
      b.emit('ContextChanged', {
        context: readContext(),
        reason: reason || 'update',
        source: 'ContextKernel'
      });
    }

    if (window.ContextCacheService && window.ContextCacheService.on) {
      unsubscribers.push(window.ContextCacheService.on('TeacherContextLoaded', function () {
        emitContext('cache-loaded');
      }));
      unsubscribers.push(window.ContextCacheService.on('TeacherContextInvalidated', function () {
        emitContext('cache-invalidated');
      }));
    }

    if (window.MiniBilgeStorage && window.MiniBilgeStorage.setClassContext) {
      const original = window.MiniBilgeStorage.setClassContext.bind(window.MiniBilgeStorage);
      window.MiniBilgeStorage.setClassContext = function (sinif, sube) {
        const result = original(sinif, sube);
        emitContext('class-switch');
        return result;
      };
    }

    // DOM custom events from cache
    function onMb(e) {
      emitContext((e && e.type) || 'mb-event');
    }
    window.addEventListener('mb:TeacherContextLoaded', onMb);
    unsubscribers.push(function () {
      window.removeEventListener('mb:TeacherContextLoaded', onMb);
    });
  }

  function bridgeLesson() {
    const b = bus();
    if (!b || !window.LessonExecutionEngine) return;
    const lee = window.LessonExecutionEngine;
    if (typeof lee.on === 'function') {
      unsubscribers.push(lee.on('started', function (p) {
        b.emit('LessonStarted', Object.assign({}, p, { source: 'EngineKernel' }));
      }));
      unsubscribers.push(lee.on('completed', function (p) {
        b.emit('LessonCompleted', Object.assign({}, p, { source: 'EngineKernel' }));
      }));
    }
  }

  function bridgeSync() {
    const b = bus();
    if (!b || !window.MiniBilgeOffline) return;
    if (typeof window.MiniBilgeOffline.onSync === 'function') {
      unsubscribers.push(window.MiniBilgeOffline.onSync(function (info) {
        b.emit('SyncCompleted', Object.assign({}, info, { source: 'SyncKernel' }));
      }));
    }
  }

  function bridgeWorkflow() {
    const b = bus();
    if (!b || !window.WorkflowEngine || typeof window.WorkflowEngine.on !== 'function') return;
    unsubscribers.push(window.WorkflowEngine.on(
      (window.WorkflowEngine.EVENTS && window.WorkflowEngine.EVENTS.TaskCompleted) || 'TaskCompleted',
      function (p) {
        b.emit('WorkflowCompleted', Object.assign({}, p, { source: 'TeacherWorkflowKernel' }));
      }
    ));
  }

  function bootAI(screen) {
    setLayer('AIKernel', 'active', { screen: screen || null });
    if (window.MiniBilgeTxs && window.MiniBilgeTxs.attach) {
      window.MiniBilgeTxs.attach({
        screen: screen || (window.MiniBilgeTxs.detectScreen && window.MiniBilgeTxs.detectScreen())
      });
    }
    if (bus()) {
      bus().emit('AICompleted', {
        action: 'attach',
        screen: screen || null,
        context: readContext(),
        source: 'AIKernel'
      });
    }
  }

  function markLayers() {
    setLayer('ContextKernel', window.ContextCacheService || window.MiniBilgeStorage ? 'active' : 'degraded');
    setLayer('WorkflowKernel', window.WorkflowEngine ? 'active' : 'planned');
    setLayer('EngineKernel', 'active', { engines: Object.keys(ENGINES) });
    setLayer('DocumentKernel', window.DocumentEngine ? 'active' : 'planned');
    setLayer('AssessmentKernel', 'partial');
    setLayer('TeacherWorkflowKernel', window.WorkflowEngine ? 'active' : 'planned');
    setLayer('AIKernel', window.MiniBilgeTxs ? 'active' : 'partial');
    setLayer('AutomationKernel', window.AosAutomation ? 'active' : 'planned');
    setLayer('SyncKernel', window.MiniBilgeOffline ? 'active' : 'partial');
    setLayer('SecurityKernel', 'partial', { officialLock: true });
  }

  function boot(opts) {
    opts = opts || {};
    if (booted && !opts.force) {
      if (opts.screen) bootAI(opts.screen);
      return getStatus();
    }

    unsubscribers.forEach(function (off) { try { off(); } catch (e) { /* */ } });
    unsubscribers = [];

    registerEngines();
    markLayers();

    if (window.AosAutomation) {
      if (!opts.skipDefaultRules) window.AosAutomation.installDefaults();
      unsubscribers.push(window.AosAutomation.attach(bus()));
    }

    bridgeDocumentBus();
    bridgeContext();
    bridgeLesson();
    bridgeSync();
    bridgeWorkflow();

    if (opts.ai !== false) bootAI(opts.screen);

    booted = true;
    if (bus()) {
      bus().emit('KernelBooted', {
        layers: LAYERS.slice(),
        context: readContext(),
        di: di() ? di().keys() : [],
        source: 'AcademicKernel'
      });
    }
    return getStatus();
  }

  function getStatus() {
    return {
      decision: 'MD-048',
      code: 'MB-AOS-001',
      booted: booted,
      layers: LAYERS.map(function (name) {
        return layerStatus[name] || { name: name, status: 'unknown' };
      }),
      engines: ENGINES,
      navigation: NAVIGATION,
      context: readContext(),
      diKeys: di() ? di().keys() : [],
      eventCount: bus() ? bus().getHistory().length : 0
    };
  }

  function resolve(name) {
    if (!di()) throw new Error('DI yok — AcademicKernel.boot() çağırın');
    return di().resolve(name);
  }

  /** Context Driven UI — aktif navigasyon aşaması */
  function navigationStage(hint) {
    if (hint) return hint;
    if (window.LessonExecutionEngine && window.LessonExecutionEngine.getActive && window.LessonExecutionEngine.getActive()) {
      return 'Execution';
    }
    if (window.WorkflowEngine && window.WorkflowEngine.getSnapshot) {
      const snap = window.WorkflowEngine.getSnapshot();
      if (snap && snap.tasks && snap.tasks.some(function (t) { return !t.done; })) return 'Workflow';
    }
    return 'Dashboard';
  }

  window.AcademicKernel = {
    decision: 'MD-048',
    code: 'MB-AOS-001',
    LAYERS: LAYERS,
    ENGINES: ENGINES,
    NAVIGATION: NAVIGATION,
    boot: boot,
    getStatus: getStatus,
    resolve: resolve,
    context: readContext,
    navigationStage: navigationStage,
    bootAI: bootAI,
    bus: bus,
    di: di,
    isBooted: function () { return booted; }
  };
})();
