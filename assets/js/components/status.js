(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  const LABELS = {
    ready: 'Hazır',
    editing: 'Düzenleniyor',
    updated: 'Güncellendi',
    missing: 'Eksik'
  };

  C.StatusBadge = function StatusBadge(opts) {
    const o = opts || {};
    const status = o.status || 'ready';
    const label = o.label || LABELS[status] || status;
    return component(
      `<span class="mbc-status mbc-status--${esc(status)}" role="status">${esc(label)}</span>`
    );
  };

  C.STATUS = LABELS;
})();
