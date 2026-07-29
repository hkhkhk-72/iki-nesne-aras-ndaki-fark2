(function () {
  'use strict';

  /**
   * MB-DS-005 — Motion Language
   * Yalnızca: success · error · loading · transition
   * Max 300 ms — öğretmeni bekletmez
   */

  const C = window.MiniBilgeComponents;
  const MAX = 300;

  const DURATIONS = {
    success: 240,
    error: 240,
    loading: 300,
    transition: 250
  };

  function clamp(ms) {
    const n = Number(ms);
    if (!isFinite(n) || n < 0) return MAX;
    return Math.min(n, MAX);
  }

  function elOf(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  function prefersReduced() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }

  /**
   * Kısa durum animasyonu — await etmeye gerek yok; UI bloklanmaz.
   * @returns {Promise<void>} settled after duration (for optional chaining)
   */
  function play(kind, target, opts) {
    const o = opts || {};
    const node = elOf(target);
    const ms = clamp(o.duration != null ? o.duration : DURATIONS[kind] || MAX);
    if (!node || prefersReduced()) {
      return Promise.resolve();
    }
    const cls = 'mb-motion-' + kind;
    node.classList.remove('mb-motion-success', 'mb-motion-error', 'mb-motion-loading', 'mb-motion-transition');
    // reflow for re-trigger
    void node.offsetWidth;
    node.classList.add(cls);
    node.style.setProperty('--mb-motion-play', ms + 'ms');
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        if (!o.persist) node.classList.remove(cls);
        resolve();
      }, ms);
    });
  }

  function success(target, opts) { return play('success', target, opts); }
  function error(target, opts) { return play('error', target, opts); }
  function loading(target, opts) {
    const o = Object.assign({ persist: true }, opts || {});
    return play('loading', target, o);
  }
  function stopLoading(target) {
    const node = elOf(target);
    if (node) node.classList.remove('mb-motion-loading');
  }
  function transition(target, opts) { return play('transition', target, opts); }

  /** Geçiş: ana içerik — bloklamaz */
  function pageEnter(target) {
    const node = elOf(target) || document.querySelector('.main-content');
    if (window.MiniBilgeInteraction && MiniBilgeInteraction.markPageEnter && node) {
      MiniBilgeInteraction.markPageEnter(node);
    }
    return transition(node, { duration: DURATIONS.transition });
  }

  const api = {
    version: '1.0',
    MAX,
    DURATIONS,
    clamp,
    play,
    success,
    error,
    loading,
    stopLoading,
    transition,
    pageEnter,
    prefersReduced
  };

  window.MiniBilgeMotion = api;

  if (C) {
    C.Motion = api;
    C.motionSuccess = success;
    C.motionError = error;
  }
})();
