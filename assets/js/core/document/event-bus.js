/**
 * MB-DOS-002 / MD-047 — Document Event Bus
 */
(function () {
  'use strict';

  const listeners = Object.create(null);
  const history = [];
  const MAX_HISTORY = 500;

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
      at: new Date().toISOString()
    };
    history.push(evt);
    if (history.length > MAX_HISTORY) history.shift();
    (listeners[type] || []).forEach(function (fn) {
      try { fn(evt); } catch (e) { console.warn('[DocEventBus]', e); }
    });
    (listeners['*'] || []).forEach(function (fn) {
      try { fn(evt); } catch (e) { console.warn('[DocEventBus]', e); }
    });
    return evt;
  }

  function getHistory(filter) {
    if (!filter) return history.slice();
    if (typeof filter === 'string') return history.filter(function (e) { return e.type === filter; });
    if (filter.documentId) {
      return history.filter(function (e) {
        return e.payload && e.payload.documentId === filter.documentId;
      });
    }
    return history.slice();
  }

  window.DocumentEventBus = {
    EVENTS: {
      DocumentCreated: 'DocumentCreated',
      DocumentValidated: 'DocumentValidated',
      DocumentGenerated: 'DocumentGenerated',
      DocumentPreviewed: 'DocumentPreviewed',
      DocumentUpdated: 'DocumentUpdated',
      DocumentApproved: 'DocumentApproved',
      DocumentRejected: 'DocumentRejected',
      DocumentArchived: 'DocumentArchived',
      DocumentVersionCreated: 'DocumentVersionCreated',
      DocumentExported: 'DocumentExported',
      DocumentPrinted: 'DocumentPrinted',
      DocumentShared: 'DocumentShared',
      DocumentDeleted: 'DocumentDeleted'
    },
    on: on,
    onAny: onAny,
    emit: emit,
    getHistory: getHistory
  };
})();
