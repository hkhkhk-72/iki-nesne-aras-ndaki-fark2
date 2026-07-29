(function () {
  'use strict';

  /**
   * MB-WFE-001 — Teacher Workflow Engine v2.0
   * MD-039 Workflow First
   *
   * Teacher Context → Calendar → Workflow → Task → Document → Assessment → Archive
   */

  const EVENTS = {
    TeacherDayStarted: 'TeacherDayStarted',
    TeacherWeekStarted: 'TeacherWeekStarted',
    LessonStarted: 'LessonStarted',
    LessonCompleted: 'LessonCompleted',
    LessonPostponed: 'LessonPostponed',
    LessonCancelled: 'LessonCancelled',
    DocumentGenerated: 'DocumentGenerated',
    DocumentApproved: 'DocumentApproved',
    AssessmentCompleted: 'AssessmentCompleted',
    ArchiveCreated: 'ArchiveCreated'
  };

  const RULES = {
    'Rule-001': 'Görevler öğretmene zamanında gösterilir.',
    'Rule-002': 'Aynı bilgi ikinci kez istenmez.',
    'Rule-003': 'Belge üretimi manuel değil, workflow tarafından tetiklenir.',
    'Rule-004': 'Tamamlanan görevler ilgili belgeleri otomatik günceller.',
    'Rule-005': 'Tüm süreçler Calendar Engine ile senkron çalışır.'
  };

  const STAGES = [
    { id: 'year-prep', ad: 'Eğitim yılı hazırlığı' },
    { id: 'weekly-plan', ad: 'Haftalık planlama' },
    { id: 'daily-flow', ad: 'Günlük ders akışı' },
    { id: 'post-lesson', ad: 'Ders sonrası kayıt' },
    { id: 'term-end', ad: 'Dönem sonu işlemleri' },
    { id: 'year-archive', ad: 'Yıl sonu arşivleme' }
  ];

  const listeners = Object.create(null);
  let lastWeekKey = null;
  let snapshot = null;

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = (listeners[event] || []).filter(x => x !== fn);
    };
  }

  function emit(event, payload) {
    const detail = Object.assign({ type: event, at: new Date().toISOString() }, payload || {});
    (listeners[event] || []).forEach(fn => {
      try { fn(detail); } catch (e) { console.warn(e); }
    });
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('mb:' + event, { detail }));
      }
    } catch (e) { /* ignore */ }
    return detail;
  }

  function resolveStage(cal, today, opts) {
    const o = opts || {};
    const t = today || new Date();
    if (o.forceStage) return o.forceStage;

    // Basit sezgisel: yıllık plan yoksa year-prep; dönem sonuna yakınsa term-end
    if (!o.hasYillik) return 'year-prep';

    try {
      const donemler = (cal && cal.donemler) || [];
      for (let i = 0; i < donemler.length; i++) {
        const d = donemler[i];
        const end = d.bitis ? new Date(d.bitis) : null;
        if (end) {
          const days = Math.floor((end - t) / 86400000);
          if (days >= 0 && days <= 21) return 'term-end';
        }
      }
      const last = donemler[donemler.length - 1];
      if (last && last.bitis && t > new Date(last.bitis)) return 'year-archive';
    } catch (e) { /* ignore */ }

    const day = t.getDay();
    if (day === 1) return 'weekly-plan'; // Pazartesi
    return 'daily-flow';
  }

  function contextLabel() {
    if (window.ContextCacheService && ContextCacheService.isLoaded()) {
      const a = ContextCacheService.get();
      return { sinif: a.sinif, sube: a.sube, label: a.label, egitimYili: a.okul.egitimYili };
    }
    if (window.MiniBilgeStorage && MiniBilgeStorage.getClassContext) {
      const c = MiniBilgeStorage.getClassContext();
      const school = MiniBilgeStorage.getSchool();
      return {
        sinif: c.sinif,
        sube: c.sube,
        label: c.label,
        egitimYili: school.egitimYili || '2025-2026'
      };
    }
    return { sinif: '1', sube: 'A', label: '1/A', egitimYili: '2025-2026' };
  }

  /**
   * Ana orkestrasyon — dashboard / gün başı
   */
  async function bootstrap(opts) {
    const o = opts || {};
    const today = o.today || new Date();

    // Rule-002 / MD-038
    if (window.ContextCacheService && !ContextCacheService.isLoaded()) {
      await ContextCacheService.load({ cal: o.cal, force: false });
    }

    const ctx = contextLabel();
    const cal = o.cal || null;
    const plans = o.plans || (window.MiniBilgeStorage ? MiniBilgeStorage.getPlans() : []);
    const documents = o.documents || (window.MiniBilgeStorage ? MiniBilgeStorage.getDocuments() : []);
    const hasYillik = plans.some(p => p.tur === 'yillik' && String(p.sinif) === String(ctx.sinif));

    let week = o.week || null;
    if (!week && window.CalendarEngine && cal) {
      try { week = CalendarEngine.getCurrentWeek(cal, today); } catch (e) { /* ignore */ }
    }

    const stage = resolveStage(cal, today, { hasYillik });
    const stageMeta = STAGES.find(s => s.id === stage) || STAGES[2];

    // Rule-001 / Rule-005 — görevler takvimle
    const tasks = (window.SmartTaskEngine
      ? SmartTaskEngine.generate({
          ctx,
          week,
          stage,
          today,
          hasYillik
        })
      : []).map(t => enrichHref(t, ctx));

    const deadlines = window.DeadlineEngine
      ? DeadlineEngine.track(tasks.filter(t => t.dueDate), { cal, today })
      : { all: [], soon: [], overdue: [], upcoming: [] };

    const progress = window.ProgressEngine
      ? ProgressEngine.compute({
          plans,
          documents,
          tasks,
          sinif: ctx.sinif,
          label: ctx.label,
          overdueCount: deadlines.overdue.length
        })
      : { overall: 0, modules: [], teacherPanel: {} };

    // Önerilen belgeler — Workflow First (Rule-003)
    const suggestions = tasks
      .filter(t => !t.done && t.docHint)
      .slice(0, 4)
      .map(t => ({
        taskId: t.id,
        docHint: t.docHint,
        text: t.text,
        href: t.href,
        trigger: 'workflow'
      }));

    snapshot = {
      version: '2.0',
      decision: 'MD-039',
      rules: RULES,
      stage: stageMeta,
      ctx,
      week,
      tasks,
      deadlines,
      progress,
      suggestions,
      at: today.toISOString()
    };

    emit(EVENTS.TeacherDayStarted, { ctx, stage: stageMeta.id, taskCount: tasks.length });

    const weekKey = week ? `${ctx.egitimYili}|${week.hafta}` : null;
    if (weekKey && weekKey !== lastWeekKey) {
      lastWeekKey = weekKey;
      emit(EVENTS.TeacherWeekStarted, { ctx, week });
    }

    return snapshot;
  }

  function enrichHref(task, ctx) {
    let href = task.href || '#';
    if (href !== '#' && ctx) {
      const sep = href.includes('?') ? '&' : '?';
      if (!/[?&]sinif=/.test(href)) href += `${sep}sinif=${encodeURIComponent(ctx.sinif)}`;
      if (!/[?&]sube=/.test(href)) href += `&sube=${encodeURIComponent(ctx.sube)}`;
    }
    return Object.assign({}, task, { href });
  }

  /** Rule-003 — belge üretimini workflow tetikler */
  function triggerDocument(docHint, meta) {
    const detail = emit(EVENTS.DocumentGenerated, {
      docHint,
      meta: meta || {},
      source: 'WorkflowEngine'
    });
    return detail;
  }

  function completeTask(taskId) {
    if (!snapshot) return null;
    const task = snapshot.tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.done = true;
    // Rule-004
    if (task.docHint) {
      emit(EVENTS.DocumentGenerated, {
        docHint: task.docHint,
        taskId,
        source: 'task-complete',
        updated: true
      });
    }
    return task;
  }

  function getSnapshot() {
    return snapshot;
  }

  window.WorkflowEngine = {
    EVENTS,
    RULES,
    STAGES,
    bootstrap,
    emit,
    on,
    triggerDocument,
    completeTask,
    getSnapshot,
    resolveStage,
    version: '2.0'
  };
})();
