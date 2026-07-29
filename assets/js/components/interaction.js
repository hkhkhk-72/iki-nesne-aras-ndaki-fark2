(function () {
  'use strict';

  /**
   * MB-DS-003 — Interaction Standards
   * Hover · Click · Page · Drawer · Dialog · Snackbar · Skeleton
   * Search debounce · Infinite scroll · Undo · Autosave
   */

  const C = window.MiniBilgeComponents;

  const TIMINGS = {
    hover: 180,
    click: 100,
    page: 250,
    drawer: 300,
    dialog: 200,
    snackbar: 3000,
    search: 300,
    undo: 5000,
    autosave: 30000
  };

  function esc(s) {
    return (C && C.esc) ? C.esc(s) : String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  /** IS-008 */
  function debounce(fn, wait) {
    const ms = wait == null ? TIMINGS.search : wait;
    let t = null;
    function wrapped() {
      const ctx = this;
      const args = arguments;
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        t = null;
        fn.apply(ctx, args);
      }, ms);
    }
    wrapped.cancel = function () {
      if (t) clearTimeout(t);
      t = null;
    };
    return wrapped;
  }

  /** IS-007 — Skeleton (spinner değil) */
  function Skeleton(opts) {
    const o = opts || {};
    const lines = Math.max(1, o.lines || 3);
    const rows = Array.from({ length: lines }, (_, i) =>
      `<span class="mb-is-skel-line" style="width:${esc(o.widths && o.widths[i] || (i === lines - 1 ? '62%' : '100%'))}"></span>`
    ).join('');
    const html = `<div class="mb-is-skeleton" role="status" aria-busy="true" aria-label="${esc(o.label || 'Yükleniyor')}">${rows}</div>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  /** Zorunlu durumda spinner */
  function Spinner(opts) {
    const o = opts || {};
    const html = `<div class="mb-is-spinner" role="status" aria-live="polite" aria-label="${esc(o.label || 'İşlem sürüyor')}"></div>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  /**
   * IS-010 — Silme 5 sn geri alınabilir
   * opts: { message, onCommit, onUndo, timeout }
   */
  function undoable(opts) {
    const o = opts || {};
    const timeout = o.timeout == null ? TIMINGS.undo : o.timeout;
    let committed = false;
    let undone = false;
    let timer = null;

    function commit() {
      if (committed || undone) return;
      committed = true;
      if (typeof o.onCommit === 'function') o.onCommit();
    }

    function undo() {
      if (committed || undone) return;
      undone = true;
      if (timer) clearTimeout(timer);
      if (typeof o.onUndo === 'function') o.onUndo();
      if (C && C.notify) C.notify.info('İşlem geri alındı', 'Geri al');
    }

    timer = setTimeout(commit, timeout);

    if (C && C.Toast) {
      const toast = C.Toast({
        type: 'warn',
        title: 'Silindi',
        message: o.message || '5 sn içinde geri alınabilir',
        timeout: timeout
      });
      const node = toast.show();
      if (node) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mb-is-undo-btn';
        btn.textContent = 'Geri al';
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          undo();
          node.classList.add('is-leaving');
          setTimeout(function () { node.remove(); }, TIMINGS.dialog);
        });
        node.appendChild(btn);
      }
    } else if (C && C.notify) {
      C.notify.warn(o.message || '5 sn içinde geri alınabilir', 'Silindi');
    }

    return { undo, commit, cancel: undo };
  }

  /**
   * IS-011 — Form autosave 30 sn
   * opts: { root, key, save(data), serialize(root), interval }
   */
  function autosave(opts) {
    const o = opts || {};
    const root = typeof o.root === 'string' ? document.querySelector(o.root) : o.root;
    if (!root) return { stop() {}, flush() {} };
    const interval = o.interval == null ? TIMINGS.autosave : o.interval;
    const key = o.key || ('mb-autosave:' + (location.pathname || 'form'));
    let dirty = false;
    let timer = null;

    function serialize() {
      if (typeof o.serialize === 'function') return o.serialize(root);
      const data = {};
      root.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (!el.name && !el.id) return;
        const k = el.name || el.id;
        data[k] = el.type === 'checkbox' ? !!el.checked : el.value;
      });
      return data;
    }

    function markDirty() { dirty = true; }

    function flush() {
      if (!dirty) return null;
      const data = serialize();
      dirty = false;
      try {
        sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
      } catch (e) { /* ignore quota */ }
      if (typeof o.save === 'function') o.save(data);
      if (C && C.notify && o.notify !== false) {
        C.notify.info('Otomatik kaydedildi', 'Autosave');
      }
      return data;
    }

    function tick() {
      if (document.hidden) return;
      flush();
    }

    root.addEventListener('input', markDirty);
    root.addEventListener('change', markDirty);
    timer = setInterval(tick, interval);

    // restore draft
    if (o.restore !== false) {
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.data && typeof o.onRestore === 'function') {
            o.onRestore(parsed.data);
          }
        }
      } catch (e) { /* ignore */ }
    }

    return {
      flush,
      markDirty,
      stop() {
        if (timer) clearInterval(timer);
        timer = null;
        root.removeEventListener('input', markDirty);
        root.removeEventListener('change', markDirty);
      }
    };
  }

  /**
   * IS-009 — Infinite scroll (sayfa numarası yok)
   * opts: { root, onLoadMore(): Promise|void, threshold }
   */
  function InfiniteScroll(opts) {
    const o = opts || {};
    const root = typeof o.root === 'string' ? document.querySelector(o.root) : (o.root || window);
    let loading = false;
    let done = false;
    const threshold = o.threshold == null ? 240 : o.threshold;

    function check() {
      if (loading || done) return;
      let near = false;
      if (root === window) {
        const el = document.documentElement;
        near = (el.scrollHeight - (window.scrollY + window.innerHeight)) < threshold;
      } else if (root) {
        near = (root.scrollHeight - (root.scrollTop + root.clientHeight)) < threshold;
      }
      if (!near) return;
      loading = true;
      Promise.resolve(typeof o.onLoadMore === 'function' ? o.onLoadMore() : null)
        .then(function (result) {
          if (result === false || (result && result.done)) done = true;
        })
        .finally(function () { loading = false; });
    }

    const onScroll = debounce(check, 80);
    const target = root === window ? window : root;
    if (target) target.addEventListener('scroll', onScroll, { passive: true });
    check();

    return {
      stop() {
        if (target) target.removeEventListener('scroll', onScroll);
        onScroll.cancel && onScroll.cancel();
      },
      complete() { done = true; },
      reset() { done = false; loading = false; }
    };
  }

  /** IS-003 — sayfa içeriğine giriş animasyonu */
  function markPageEnter(el) {
    const node = typeof el === 'string' ? document.querySelector(el) : el;
    if (!node) return;
    node.classList.add('mb-is-page-enter');
  }

  /** Dialog / Drawer sınıf yardımcıları */
  function openOverlay(kind, el) {
    const node = typeof el === 'string' ? document.querySelector(el) : el;
    if (!node) return;
    node.hidden = false;
    node.classList.add(kind === 'drawer' ? 'mb-is-drawer-open' : 'mb-is-dialog-open');
  }

  function closeOverlay(kind, el) {
    const node = typeof el === 'string' ? document.querySelector(el) : el;
    if (!node) return;
    node.classList.remove(kind === 'drawer' ? 'mb-is-drawer-open' : 'mb-is-dialog-open');
    node.classList.add(kind === 'drawer' ? 'mb-is-drawer-leave' : 'mb-is-dialog-leave');
    setTimeout(function () {
      node.hidden = true;
      node.classList.remove('mb-is-drawer-leave', 'mb-is-dialog-leave');
    }, kind === 'drawer' ? TIMINGS.drawer : TIMINGS.dialog);
  }

  const api = {
    version: '1.0',
    TIMINGS,
    debounce,
    Skeleton,
    Spinner,
    undoable,
    autosave,
    InfiniteScroll,
    markPageEnter,
    openOverlay,
    closeOverlay
  };

  window.MiniBilgeInteraction = api;

  if (C) {
    C.Interaction = api;
    C.Skeleton = Skeleton;
    C.Spinner = Spinner;
    C.debounce = debounce;
    C.undoable = undoable;
    C.autosave = autosave;
  }
})();
