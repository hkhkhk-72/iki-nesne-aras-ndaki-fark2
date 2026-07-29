(function () {
  'use strict';

  /**
   * MB-DOS-003 — DynamicShiftEngine
   * Rule-004: POSTPONED → Workflow + Calendar tetikleme
   */

  function shift(execution, reason) {
    const payload = {
      lessonExecutionId: execution.id,
      classId: execution.classId,
      lessonId: execution.lessonId,
      date: execution.date,
      reason: reason || 'postponed',
      at: new Date().toISOString()
    };

    if (window.WorkflowEngine && WorkflowEngine.emit) {
      WorkflowEngine.emit(WorkflowEngine.EVENTS.LessonStarted ? 'LessonPostponed' : 'LessonPostponed', payload);
      // WFE bilinen event yoksa generic DocumentGenerated yerine özel emit
      if (typeof WorkflowEngine.on === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('mb:LessonPostponed', { detail: payload }));
          window.dispatchEvent(new CustomEvent('mb:CalendarShiftRequested', { detail: payload }));
        } catch (e) { /* ignore */ }
      }
    } else {
      try {
        window.dispatchEvent(new CustomEvent('mb:LessonPostponed', { detail: payload }));
        window.dispatchEvent(new CustomEvent('mb:CalendarShiftRequested', { detail: payload }));
      } catch (e) { /* ignore */ }
    }

    return {
      shifted: true,
      calendarNotified: true,
      workflowNotified: true,
      suggestion: 'Bu ders sonraki uygun saate kaydırılmalı; haftalık plan güncellensin.',
      payload
    };
  }

  window.DynamicShiftEngine = { shift };
})();
