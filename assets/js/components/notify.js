(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  let host;

  function ensureHost() {
    if (host && document.body.contains(host)) return host;
    host = document.createElement('div');
    host.className = 'mbc-toast-host';
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
    return host;
  }

  C.Toast = function Toast(opts) {
    const o = opts || {};
    const type = o.type || 'info';
    const timeout = o.timeout == null ? 3200 : o.timeout;
    const html = `
      <div class="mbc-toast mbc-toast--${esc(type)}" role="status">
        <strong>${esc(o.title || typeLabel(type))}</strong>
        <span>${esc(o.message || '')}</span>
      </div>`;
    const api = component(html);
    api.show = function show() {
      const h = ensureHost();
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      const node = wrap.firstElementChild;
      h.appendChild(node);
      if (timeout > 0) {
        setTimeout(() => {
          node.classList.add('is-leaving');
          setTimeout(() => node.remove(), 220);
        }, timeout);
      }
      return node;
    };
    return api;
  };

  C.Banner = function Banner(opts) {
    const o = opts || {};
    const type = o.type || 'info';
    const dismiss = o.dismissible !== false
      ? `<button type="button" class="mbc-banner-close" aria-label="Kapat">×</button>`
      : '';
    const html = `
      <div class="mbc-banner mbc-banner--${esc(type)}" role="alert">
        <div>${esc(o.message || '')}</div>
        ${dismiss}
      </div>`;
    return component(html, (root) => {
      const btn = root.querySelector('.mbc-banner-close');
      if (btn) btn.addEventListener('click', () => root.remove());
    });
  };

  C.notify = {
    info: (message, title) => C.Toast({ type: 'info', message, title }).show(),
    success: (message, title) => C.Toast({ type: 'success', message, title }).show(),
    warn: (message, title) => C.Toast({ type: 'warn', message, title }).show(),
    critical: (message, title) => C.Toast({ type: 'critical', message, title }).show()
  };

  function typeLabel(t) {
    return ({ info: 'Bilgi', success: 'Başarı', warn: 'Uyarı', critical: 'Kritik' })[t] || 'Bilgi';
  }
})();
