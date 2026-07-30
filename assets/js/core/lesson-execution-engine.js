(function () {
  'use strict';

  /**
   * MB-DOS-003 — LessonExecutionEngine (LEE)
   * MD-040 — LessonExecution is SSOT
   *
   * Ders Defteri bağımsız belge değildir; COMPLETED LessonExecution'dan türer.
   */

  const STATUS = {
    PLANNED: 'PLANNED',
    STARTED: 'STARTED',
    COMPLETED: 'COMPLETED',
    PARTIAL: 'PARTIAL',
    POSTPONED: 'POSTPONED',
    CANCELLED: 'CANCELLED'
  };

  const EVENTS = {
    LessonStarted: 'LessonStarted',
    LessonCompleted: 'LessonCompleted',
    LessonPostponed: 'LessonPostponed',
    LessonCancelled: 'LessonCancelled',
    ReflectionSaved: 'ReflectionSaved',
    EvidenceGenerated: 'EvidenceGenerated',
    AssessmentUpdated: 'AssessmentUpdated',
    LessonArchived: 'LessonArchived'
  };

  const RULES = {
    'Rule-001': 'LessonExecution sistemin tek doğruluk kaynağıdır.',
    'Rule-002': 'Hiçbir belge manuel oluşturulmaz.',
    'Rule-003': 'LessonExecution tamamlanmadan Ders Defteri oluşturulamaz.',
    'Rule-004': 'POSTPONED durumunda Workflow Engine ve Calendar Engine otomatik tetiklenir.',
    'Rule-005': 'ReflectionAI sonraki ders planını optimize etmek için öğretmen geri bildirimlerini analiz eder.'
  };

  const listeners = Object.create(null);

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
      window.dispatchEvent(new CustomEvent('mb:' + event, { detail }));
    } catch (e) { /* ignore */ }
    // WFE ile paylaş
    if (window.WorkflowEngine && WorkflowEngine.emit) {
      if (event === EVENTS.LessonStarted || event === EVENTS.LessonCompleted) {
        WorkflowEngine.emit(event, detail);
      }
    }
    return detail;
  }

  function teacherId() {
    if (window.ContextCacheService && ContextCacheService.isLoaded()) {
      const a = ContextCacheService.get();
      return a.ogretmen.adSoyad || 'teacher';
    }
    const p = window.MiniBilgeStorage ? MiniBilgeStorage.getProfile() : {};
    return p.adSoyad || 'teacher';
  }

  function classId() {
    if (window.ContextCacheService && ContextCacheService.isLoaded()) {
      return ContextCacheService.get().label;
    }
    if (window.MiniBilgeStorage && MiniBilgeStorage.getClassContext) {
      return MiniBilgeStorage.getClassContext().label;
    }
    return '1/A';
  }

  function createPlanned(opts) {
    const o = opts || {};
    const now = new Date();
    const exec = {
      id: 'lex_' + Date.now(),
      teacherId: o.teacherId || teacherId(),
      classId: o.classId || classId(),
      lessonId: o.lessonId || 'turkce',
      dailyPlanId: o.dailyPlanId || null,
      workflowId: o.workflowId || null,
      date: o.date || now.toISOString().slice(0, 10),
      startTime: null,
      endTime: null,
      executionStatus: STATUS.PLANNED,
      attendanceId: null,
      evidenceIds: [],
      assessmentIds: [],
      teacherReflection: '',
      aiRecommendation: '',
      nextLessonAction: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    persist(exec);
    return exec;
  }

  function persist(exec) {
    if (!window.MiniBilgeStorage || !MiniBilgeStorage.saveLessonExecution) return exec;
    return MiniBilgeStorage.saveLessonExecution(exec);
  }

  function get(id) {
    if (!window.MiniBilgeStorage) return null;
    return MiniBilgeStorage.getLessonExecution(id);
  }

  function list(filter) {
    if (!window.MiniBilgeStorage) return [];
    let list = MiniBilgeStorage.getLessonExecutions();
    if (filter && filter.date) list = list.filter(x => x.date === filter.date);
    if (filter && filter.classId) list = list.filter(x => x.classId === filter.classId);
    if (filter && filter.status) list = list.filter(x => x.executionStatus === filter.status);
    return list;
  }

  /** Start lesson — Daily Plan + Attendance bağlantısı hazırlanır */
  function start(idOrOpts) {
    let exec = typeof idOrOpts === 'string' ? get(idOrOpts) : null;
    if (!exec && typeof idOrOpts === 'object') exec = createPlanned(idOrOpts);
    if (!exec) throw new Error('LessonExecution bulunamadı');

    exec.executionStatus = STATUS.STARTED;
    exec.startTime = new Date().toISOString();
    exec.updatedAt = exec.startTime;
    // Connect Daily Plan (varsa)
    if (!exec.dailyPlanId && window.MiniBilgeStorage) {
      const plans = MiniBilgeStorage.getPlans() || [];
      const hit = plans.find(p =>
        p.tur === 'gunluk' &&
        String(p.ders || p.dersId) === String(exec.lessonId) &&
        String(p.sinif) === String(exec.classId).split('/')[0]
      );
      if (hit) exec.dailyPlanId = hit.id;
    }
    persist(exec);
    emit(EVENTS.LessonStarted, { lessonExecution: exec });
    return exec;
  }

  /**
   * Complete — Rule-002/003: otomatik Class Log, Attendance, Evidence, Assessment, Reflection, WFE
   */
  function complete(id, opts) {
    const o = opts || {};
    let exec = get(id);
    if (!exec) throw new Error('LessonExecution bulunamadı');
    if (exec.executionStatus === STATUS.PLANNED) {
      exec = start(id);
    }
    if (exec.executionStatus !== STATUS.STARTED && exec.executionStatus !== STATUS.PARTIAL) {
      throw new Error('LessonExecution bu durumda tamamlanamaz: ' + exec.executionStatus);
    }

    exec.executionStatus = o.partial ? STATUS.PARTIAL : STATUS.COMPLETED;
    exec.endTime = new Date().toISOString();
    exec.updatedAt = exec.endTime;
    if (o.reflection) exec.teacherReflection = o.reflection;

    exec.attendanceId = 'att_' + Date.now();
    if (window.EvidenceCollector) {
      const ev = EvidenceCollector.collect(exec, { summary: o.evidenceSummary });
      exec.evidenceIds = (exec.evidenceIds || []).concat([ev.id]);
      emit(EVENTS.EvidenceGenerated, { evidence: ev, lessonExecutionId: exec.id });
    }
    const assessId = 'as_' + Date.now();
    exec.assessmentIds = (exec.assessmentIds || []).concat([assessId]);
    emit(EVENTS.AssessmentUpdated, { assessmentId: assessId, lessonExecutionId: exec.id });

    if (window.ReflectionAI) {
      const ai = ReflectionAI.analyze(exec.teacherReflection, exec);
      exec.aiRecommendation = ai.aiRecommendation;
      exec.nextLessonAction = ai.nextLessonAction;
      emit(EVENTS.ReflectionSaved, { lessonExecutionId: exec.id, ai });
    }

    if (exec.executionStatus === STATUS.COMPLETED) {
      createClassLog(exec);
    }

    persist(exec);

    if (exec.executionStatus === STATUS.COMPLETED) {
      emit(EVENTS.LessonCompleted, {
        lessonExecution: exec,
        workflowCompletion: true,
        outputs: ['classLog', 'attendance', 'evidence', 'assessment', 'reflection']
      });
      if (window.WorkflowEngine && WorkflowEngine.completeTask) {
        WorkflowEngine.completeTask('daily-kazanim');
        WorkflowEngine.completeTask('daily-plan');
      }
    }

    return exec;
  }

  function createClassLog(execution) {
    // Rule-002/003 — manuel yok; LEE üretir
    if (window.MiniBilgeStorage && MiniBilgeStorage.addDocument) {
      MiniBilgeStorage.addDocument({
        title: `Ders Defteri — ${execution.classId} — ${execution.lessonId}`,
        tur: 'class-log',
        lessonExecutionId: execution.id,
        date: execution.date,
        source: 'LessonExecutionEngine'
      });
    }
    return {
      id: 'clog_' + execution.id,
      lessonExecutionId: execution.id,
      classId: execution.classId,
      lessonId: execution.lessonId,
      date: execution.date,
      reflection: execution.teacherReflection,
      aiRecommendation: execution.aiRecommendation
    };
  }

  /** Rule-003 gate */
  function canCreateClassLog(executionId) {
    const exec = get(executionId);
    return !!(exec && exec.executionStatus === STATUS.COMPLETED);
  }

  function postpone(id, reason) {
    const exec = get(id);
    if (!exec) throw new Error('LessonExecution bulunamadı');
    exec.executionStatus = STATUS.POSTPONED;
    exec.endTime = new Date().toISOString();
    exec.updatedAt = exec.endTime;
    persist(exec);

    let shift = null;
    if (window.DynamicShiftEngine) {
      shift = DynamicShiftEngine.shift(exec, reason);
    }
    emit(EVENTS.LessonPostponed, { lessonExecution: exec, shift, reason });
    return exec;
  }

  function cancel(id, reason) {
    const exec = get(id);
    if (!exec) throw new Error('LessonExecution bulunamadı');
    exec.executionStatus = STATUS.CANCELLED;
    exec.endTime = new Date().toISOString();
    exec.updatedAt = exec.endTime;
    persist(exec);
    emit(EVENTS.LessonCancelled, { lessonExecution: exec, reason });
    return exec;
  }

  function archive(id) {
    const exec = get(id);
    if (!exec) throw new Error('LessonExecution bulunamadı');
    exec.archived = true;
    exec.updatedAt = new Date().toISOString();
    persist(exec);
    emit(EVENTS.LessonArchived, { lessonExecution: exec });
    return exec;
  }

  window.LessonExecutionEngine = {
    STATUS,
    EVENTS,
    RULES,
    createPlanned,
    start,
    complete,
    postpone,
    cancel,
    archive,
    get,
    list,
    canCreateClassLog,
    createClassLog,
    on,
    emit,
    version: '1.0'
  };
})();
