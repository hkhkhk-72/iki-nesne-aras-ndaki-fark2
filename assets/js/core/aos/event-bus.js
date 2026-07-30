/**
 * MB-AOS-001 / MD-048 — Global Event Bus
 * Tüm modüller yalnızca bu bus üzerinden haberleşir.
 */
(function () {
  'use strict';

  const listeners = Object.create(null);
  const history = [];
  const MAX = 800;

  const EVENTS = {
    ContextChanged: 'ContextChanged',
    DocumentCreated: 'DocumentCreated',
    LessonStarted: 'LessonStarted',
    LessonCompleted: 'LessonCompleted',
    AttendanceTaken: 'AttendanceTaken',
    AssessmentCreated: 'AssessmentCreated',
    WorkflowCompleted: 'WorkflowCompleted',
    NotificationSent: 'NotificationSent',
    AICompleted: 'AICompleted',
    ExportFinished: 'ExportFinished',
    ArchiveCompleted: 'ArchiveCompleted',
    SyncCompleted: 'SyncCompleted',
    KernelBooted: 'KernelBooted',
    AutomationFired: 'AutomationFired'
  };

  function on(type, fn) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(fn);
    return function off() {
      listeners[type] = (listeners[type] || []).filter(function (x) { return x !== fn; });
    };
  }

  function onAny(fn) {
    return on('*', fn);
  }

  function emit(type, payload) {
    const evt = {
      type: type,
      payload: payload || {},
      at: new Date().toISOString(),
      source: (payload && payload.source) || 'AcademicKernel'
    };
    history.push(evt);
    if (history.length > MAX) history.shift();
    (listeners[type] || []).forEach(function (fn) {
      try { fn(evt); } catch (e) { console.warn('[AosBus]', e); }
    });
    (listeners['*'] || []).forEach(function (fn) {
      try { fn(evt); } catch (e) { console.warn('[AosBus]', e); }
    });
    try {
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('mb:aos:' + type, { detail: evt }));
      }
    } catch (e) { /* ignore */ }
    return evt;
  }

  function getHistory(filter) {
    if (!filter) return history.slice();
    if (typeof filter === 'string') {
      return history.filter(function (e) { return e.type === filter; });
    }
    return history.slice();
  }

  function clearHistory() {
    history.length = 0;
  }

  window.AosEventBus = {
    EVENTS: EVENTS,
    on: on,
    onAny: onAny,
    emit: emit,
    getHistory: getHistory,
    clearHistory: clearHistory
  };
  window.GlobalEventBus = window.AosEventBus;
})();
