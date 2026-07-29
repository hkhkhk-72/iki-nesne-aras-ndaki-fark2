(function () {
  'use strict';

  /**
   * MB-DS-004 — Accessibility
   * Theme · Large text · Skip link · Prefs boot
   */

  const STORAGE_KEY = 'minibilgeA11y';

  const DEFAULTS = {
    theme: 'system', // system | light | dark
    textScale: '100' // 100 | 125 | 150 | 200
  };

  function readPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function writePrefs( partial ) {
    const next = { ...readPrefs(), ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function resolveTheme(theme) {
    if (theme === 'light' || theme === 'dark') return theme;
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  function apply(prefs) {
    const p = prefs || readPrefs();
    const root = document.documentElement;
    const theme = resolveTheme(p.theme);
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-text-scale', String(p.textScale || '100'));
    const scale = Number(p.textScale || 100) / 100;
    root.style.setProperty('--mb-text-scale', String(scale));
    // Base 16px * scale, but never below 14px effective body floor via CSS
    root.style.fontSize = (16 * scale) + 'px';
    return { ...p, resolvedTheme: theme };
  }

  function ensureSkipLink() {
    if (!document.body || document.getElementById('mb-skip-link')) return;
    const a = document.createElement('a');
    a.id = 'mb-skip-link';
    a.className = 'mb-skip-link';
    a.href = '#mb-main';
    a.textContent = 'İçeriğe atla';
    document.body.insertBefore(a, document.body.firstChild);
  }

  function ensureMainId() {
    const main = document.querySelector('main.main-content, main');
    if (main && !main.id) main.id = 'mb-main';
    if (main) {
      if (!main.getAttribute('tabindex')) main.setAttribute('tabindex', '-1');
      main.setAttribute('role', 'main');
    }
    const nav = document.querySelector('.sidebar-nav, nav');
    if (nav && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Ana menü');
    }
    const aside = document.querySelector('aside.sidebar');
    if (aside) aside.setAttribute('role', 'complementary');
  }

  function boot() {
    apply(readPrefs());
    ensureSkipLink();
    ensureMainId();

    // System theme değişikliklerini dinle
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = function () {
        const p = readPrefs();
        if (p.theme === 'system') apply(p);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    } catch (e) { /* ignore */ }

    return readPrefs();
  }

  function setTheme(theme) {
    return apply(writePrefs({ theme: theme || 'system' }));
  }

  function setTextScale(scale) {
    const allowed = ['100', '125', '150', '200'];
    const s = String(scale);
    return apply(writePrefs({ textScale: allowed.indexOf(s) >= 0 ? s : '100' }));
  }

  /** Basit odak tuzağı (dialog) */
  function trapFocus(container) {
    const root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return function () {};
    const sel = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    function handler(e) {
      if (e.key !== 'Tab') return;
      const list = Array.prototype.slice.call(root.querySelectorAll(sel))
        .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    root.addEventListener('keydown', handler);
    const focusable = root.querySelector(sel);
    if (focusable) focusable.focus();
    return function release() {
      root.removeEventListener('keydown', handler);
    };
  }

  window.MiniBilgeA11y = {
    version: '1.0',
    DEFAULTS,
    readPrefs,
    writePrefs,
    apply,
    boot,
    setTheme,
    setTextScale,
    trapFocus,
    ensureMainId,
    ensureSkipLink
  };

  // Erken boot — FOUC azalt
  if (document.documentElement) {
    apply(readPrefs());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
