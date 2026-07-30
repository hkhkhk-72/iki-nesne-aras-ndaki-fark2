(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  const PRESETS = {
    create: 'AI ile Oluştur',
    suggest: 'AI’dan Öneri Al',
    fix: 'AI Düzelt',
    update: 'AI Güncelle',
    check: 'AI Kontrol Et'
  };

  function aiButton(kind, opts) {
    const o = opts || {};
    const label = o.label || PRESETS[kind] || kind;
    const size = o.size === 'sm' ? ' mbc-ai--sm' : '';
    const busy = o.busy ? ' is-busy' : '';
    const disabled = o.disabled || o.busy ? ' disabled' : '';
    const html = `
      <button type="button" class="mbc-ai mbc-ai--${esc(kind)}${size}${busy}"${disabled}
        data-ai-action="${esc(kind)}">
        <span class="mbc-ai-mark" aria-hidden="true">AI</span>
        <span>${esc(label)}</span>
      </button>`;
    return component(html, (root) => {
      const btn = root.matches('button') ? root : root.querySelector('button');
      if (btn && typeof o.onClick === 'function') {
        btn.addEventListener('click', (e) => o.onClick(e, kind));
      }
    });
  }

  C.AiCreate = (o) => aiButton('create', o);
  C.AiSuggest = (o) => aiButton('suggest', o);
  C.AiFix = (o) => aiButton('fix', o);
  C.AiUpdate = (o) => aiButton('update', o);
  C.AiCheck = (o) => aiButton('check', o);
  C.AiActions = { PRESETS, button: aiButton };
})();
