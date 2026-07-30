/**
 * MB-AOS-001 / MD-048 — Automation Kernel
 * Trigger → Rules → Actions → Events → Notifications → Logs
 */
(function () {
  'use strict';

  const rules = [];
  const logs = [];
  const MAX_LOG = 200;

  function addRule(rule) {
    const r = Object.assign({
      id: 'rule_' + Date.now().toString(36),
      enabled: true,
      trigger: null,
      when: null,
      actions: []
    }, rule || {});
    rules.push(r);
    return r;
  }

  function listRules() {
    return rules.slice();
  }

  function log(entry) {
    logs.unshift(Object.assign({ at: new Date().toISOString() }, entry));
    if (logs.length > MAX_LOG) logs.pop();
  }

  function getLogs() {
    return logs.slice();
  }

  function runActions(actions, evt) {
    (actions || []).forEach(function (action) {
      const type = action.type || action;
      if (type === 'notify' && window.MiniBilgeComponents && MiniBilgeComponents.notify) {
        const t = action.level || 'info';
        const fn = MiniBilgeComponents.notify[t] || MiniBilgeComponents.notify.info;
        fn(action.message || ('Automation: ' + (evt && evt.type)), 'AOS');
      }
      if (type === 'emit' && window.AosEventBus) {
        window.AosEventBus.emit(action.event || 'AutomationFired', {
          from: evt && evt.type,
          source: 'AutomationKernel'
        });
      }
      if (type === 'document' && window.DocumentEngine && action.documentType) {
        try {
          window.DocumentEngine.createFromWorkflow({
            documentType: action.documentType,
            title: action.title,
            tags: ['automation']
          });
        } catch (e) {
          console.warn('[Automation]', e);
        }
      }
      if (typeof action.run === 'function') {
        try { action.run(evt); } catch (e) { console.warn('[Automation]', e); }
      }
      log({ type: 'action', action: type, trigger: evt && evt.type });
    });
  }

  function handle(evt) {
    rules.forEach(function (rule) {
      if (!rule.enabled) return;
      if (rule.trigger && rule.trigger !== evt.type && rule.trigger !== '*') return;
      if (typeof rule.when === 'function' && !rule.when(evt)) return;
      runActions(rule.actions, evt);
      if (window.AosEventBus) {
        window.AosEventBus.emit('AutomationFired', {
          ruleId: rule.id,
          trigger: evt.type,
          source: 'AutomationKernel'
        });
      }
      log({ type: 'fired', ruleId: rule.id, trigger: evt.type });
    });
  }

  function attach(bus) {
    const b = bus || window.AosEventBus;
    if (!b) return function () {};
    return b.onAny(handle);
  }

  /** Varsayılan kurallar */
  function installDefaults() {
    addRule({
      id: 'sync-notify',
      trigger: 'SyncCompleted',
      actions: [{ type: 'notify', level: 'success', message: 'Senkron tamamlandı' }]
    });
    addRule({
      id: 'lesson-complete-archive-hint',
      trigger: 'LessonCompleted',
      actions: [{ type: 'notify', level: 'info', message: 'Ders tamam — kayıtlar Document Kernel’e aktarılır' }]
    });
    addRule({
      id: 'export-finished',
      trigger: 'ExportFinished',
      actions: [{ type: 'notify', level: 'success', message: 'Dışa aktarma bitti' }]
    });
  }

  window.AosAutomation = {
    addRule: addRule,
    listRules: listRules,
    getLogs: getLogs,
    handle: handle,
    attach: attach,
    installDefaults: installDefaults
  };
})();
