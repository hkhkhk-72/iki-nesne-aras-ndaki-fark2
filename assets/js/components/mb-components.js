(function (global) {
  'use strict';

  function esc(s) {
    return s == null ? '' : String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function mount(el, html) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return null;
    el.innerHTML = html;
    return el;
  }

  function component(html, afterMount) {
    return {
      html,
      mount(target) {
        const node = mount(target, html);
        if (node && typeof afterMount === 'function') afterMount(node);
        return node;
      }
    };
  }

  global.MiniBilgeComponents = global.MiniBilgeComponents || {};
  Object.assign(global.MiniBilgeComponents, {
    esc,
    mount,
    component,
    version: '1.0.0-comp-001'
  });
})(typeof window !== 'undefined' ? window : globalThis);
