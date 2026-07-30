(function () {
  'use strict';

  /**
   * MB-DS-006 — Teacher Experience Architecture (TXA)
   * Workflow-first screens · MD-045 (not MD-025 — collision)
   */

  const C = window.MiniBilgeComponents;
  const VERSION_KEY = 'minibilgeDocVersions';
  const PURPOSE_KEY = 'minibilgeTxaPurpose';

  function esc(s) {
    return (C && C.esc) ? C.esc(s) : String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function readVersions() {
    try { return JSON.parse(localStorage.getItem(VERSION_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function writeVersions(map) {
    localStorage.setItem(VERSION_KEY, JSON.stringify(map));
  }

  /** TXA-001 — ekranın tek amacı */
  function declarePurpose(opts) {
    const o = opts || {};
    const payload = {
      id: o.id || 'screen',
      purpose: o.purpose || '',
      steps: Array.isArray(o.steps) ? o.steps : [],
      at: new Date().toISOString()
    };
    try { sessionStorage.setItem(PURPOSE_KEY, JSON.stringify(payload)); } catch (e) { /* ignore */ }
    const steps = payload.steps.map(function (s, i) {
      return `<li class="txa-step${i === 0 ? ' is-current' : ''}"><span>${i + 1}</span>${esc(s)}</li>`;
    }).join('');
    const html = `
      <div class="txa-purpose" data-txa="purpose" data-screen="${esc(payload.id)}">
        <p class="txa-purpose-label">Bu ekranın amacı</p>
        <strong class="txa-purpose-text">${esc(payload.purpose)}</strong>
        ${payload.steps.length ? `<ol class="txa-steps">${steps}</ol>` : ''}
      </div>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  /** TXA-002 — context ile formu doldur */
  function fillFromContext(root, map) {
    const el = typeof root === 'string' ? document.querySelector(root) : root;
    if (!el) return false;
    let ctx = null;
    if (window.ContextCacheService && ContextCacheService.isLoaded()) {
      ctx = ContextCacheService.get();
    } else if (window.ContextEngine && ContextEngine.getContext) {
      try { ctx = ContextEngine.getContext(); } catch (e) { /* ignore */ }
    }
    if (!ctx) return false;
    const defaults = {
      okul: ctx.okul && (ctx.okul.ad || ctx.okul.okulAdi),
      il: ctx.okul && ctx.okul.il,
      ilce: ctx.okul && ctx.okul.ilce,
      ogretmen: ctx.ogretmen && ctx.ogretmen.adSoyad,
      sinif: ctx.sinif,
      sube: ctx.sube,
      egitimYili: ctx.okul && ctx.okul.egitimYili,
      ders: ctx.varsayilanDers
    };
    const mapping = Object.assign({}, defaults, map || {});
    Object.keys(mapping).forEach(function (key) {
      const val = mapping[key];
      if (val == null || val === '') return;
      const nodes = el.querySelectorAll('[data-txa-field="' + key + '"], [name="' + key + '"], #' + key);
      nodes.forEach(function (n) {
        if (n.value === '' || n.hasAttribute('data-txa-autofill')) {
          n.value = val;
          n.setAttribute('data-txa-autofill', '1');
        }
      });
    });
    return true;
  }

  /** TXA-004 — max 3 primary actions */
  function PrimaryActions(items, opts) {
    const o = opts || {};
    const list = (items || []).slice(0, 3);
    const extra = (items || []).slice(3);
    const html = `
      <div class="txa-primary-actions" data-txa="primary">
        ${list.map(function (it, i) {
          const dominant = i === 0 || it.dominant;
          const cls = 'quick-btn' + (dominant ? ' primary txa-dominant' : ' compact');
          if (it.href) {
            return `<a class="${cls}" href="${esc(it.href)}">${esc(it.label)}</a>`;
          }
          return `<button type="button" class="${cls}" data-txa-action="${esc(it.id || it.label)}">${esc(it.label)}</button>`;
        }).join('')}
      </div>
      ${extra.length && window.MiniBilgeTxs ? MiniBilgeTxs.AdvancedPanel({
        bodyHtml: extra.map(function (it) {
          return it.href
            ? `<a class="text-link" href="${esc(it.href)}">${esc(it.label)}</a>`
            : `<button type="button" class="mbc-btn-ghost" data-txa-action="${esc(it.id || it.label)}">${esc(it.label)}</button>`;
        }).join(' · ')
      }).html : ''}`;
    return C ? C.component(html, function (root) {
      if (typeof o.onAction === 'function') {
        root.querySelectorAll('[data-txa-action]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            o.onAction(btn.getAttribute('data-txa-action'), btn);
          });
        });
      }
    }) : { html, mount() {} };
  }

  /** TXA-009 — Quick Action strip */
  function QuickActions(items) {
    const list = items || [];
    const html = `
      <div class="txa-quick" data-txa="quick" aria-label="Hızlı işlemler">
        <span class="txa-quick-label">Hızlı</span>
        <div class="txa-quick-list">
          ${list.map(function (it) {
            return it.href
              ? `<a class="txa-quick-btn" href="${esc(it.href)}">${esc(it.label)}</a>`
              : `<button type="button" class="txa-quick-btn" data-txa-quick="${esc(it.id || it.label)}">${esc(it.label)}</button>`;
          }).join('')}
        </div>
      </div>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  /** TXA-007 — Preview · Word · PDF · Yazdır · AI Kontrol */
  function DocumentActions(opts) {
    const o = opts || {};
    const actions = [
      { id: 'preview', label: 'Önizle', fn: o.onPreview },
      { id: 'word', label: 'Word', fn: o.onWord },
      { id: 'pdf', label: 'PDF', fn: o.onPdf },
      { id: 'print', label: 'Yazdır', fn: o.onPrint },
      { id: 'ai', label: 'AI Kontrol', fn: o.onAiCheck }
    ];
    const html = `
      <div class="txa-doc-actions" data-txa="document-actions" role="toolbar" aria-label="Belge çıktıları">
        ${actions.map(function (a, i) {
          const primary = i === 0 ? ' primary txa-dominant' : ' compact';
          return `<button type="button" class="quick-btn${primary}" data-txa-doc="${a.id}">${esc(a.label)}</button>`;
        }).join('')}
      </div>`;
    return C ? C.component(html, function (root) {
      root.querySelectorAll('[data-txa-doc]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-txa-doc');
          const found = actions.find(function (a) { return a.id === id; });
          if (found && typeof found.fn === 'function') found.fn();
          else if (id === 'print') window.print();
          else if (id === 'ai' && window.MiniBilgeTxs) {
            location.href = (MiniBilgeTxs.detectScreen ? '' : '') ||
              ((/\/modules\//.test(location.pathname) ? 'ai.html' : 'modules/ai.html') +
                '?q=' + encodeURIComponent('Bu belgeyi kontrol et'));
          } else if (C && C.notify) {
            C.notify.info(id + ' — motor bağlanınca çalışır', 'TXA-007');
          }
        });
      });
    }) : { html, mount() {} };
  }

  /** TXA-008 — Version History */
  const VersionHistory = {
    list(docId) {
      const map = readVersions();
      return (map[docId] || []).slice().sort(function (a, b) {
        return (b.at || '').localeCompare(a.at || '');
      });
    },
    push(docId, snapshot, meta) {
      const map = readVersions();
      const list = map[docId] || [];
      list.unshift({
        id: 'v_' + Date.now(),
        at: new Date().toISOString(),
        meta: meta || {},
        snapshot: snapshot
      });
      map[docId] = list.slice(0, 30);
      writeVersions(map);
      return map[docId][0];
    },
    render(docId) {
      const list = VersionHistory.list(docId);
      const conf = window.MiniBilgeTxs ? MiniBilgeTxs.AiConfidence({ level: 'resmi' }).html : '';
      const html = `
        <div class="txa-versions" data-txa="versions">
          <header class="txa-versions-head">
            <strong>Sürüm geçmişi</strong> ${conf}
          </header>
          ${list.length ? `<ul class="txa-version-list">
            ${list.map(function (v) {
              return `<li>
                <time datetime="${esc(v.at)}">${esc((v.at || '').replace('T', ' ').slice(0, 16))}</time>
                <span>${esc((v.meta && v.meta.label) || v.id)}</span>
              </li>`;
            }).join('')}
          </ul>` : `<p class="section-lead">Henüz sürüm yok — ilk kayıt otomatik oluşur.</p>`}
        </div>`;
      return C ? C.component(html) : { html, mount() {} };
    }
  };

  /** TXA-006 */
  function autosave(opts) {
    if (window.MiniBilgeInteraction && MiniBilgeInteraction.autosave) {
      return MiniBilgeInteraction.autosave(opts);
    }
    return { stop() {}, flush() {}, markDirty() {} };
  }

  /** TXA-010 — sınıf değişince yenile */
  function watchContext(opts) {
    const o = opts || {};
    let last = '';
    try {
      if (window.MiniBilgeStorage && MiniBilgeStorage.getClassContext) {
        const c = MiniBilgeStorage.getClassContext();
        last = c.label || (c.sinif + '/' + c.sube);
      }
    } catch (e) { /* ignore */ }

    function currentLabel() {
      try {
        if (window.ContextCacheService && ContextCacheService.isLoaded()) {
          return ContextCacheService.get().label;
        }
        if (window.MiniBilgeStorage && MiniBilgeStorage.getClassContext) {
          return MiniBilgeStorage.getClassContext().label;
        }
      } catch (e) { /* ignore */ }
      return last;
    }

    function check() {
      const now = currentLabel();
      if (now && last && now !== last) {
        const prev = last;
        last = now;
        if (typeof o.onChange === 'function') o.onChange(now, prev);
        else if (o.reload !== false) location.reload();
      } else if (now) last = now;
    }

    window.addEventListener('storage', check);
    document.addEventListener('minibilge:context-changed', check);
    const timer = setInterval(check, o.interval || 1500);
    // class tab clicks
    document.addEventListener('click', function (e) {
      const t = e.target && e.target.closest && e.target.closest('[data-sinif]');
      if (t) setTimeout(check, 50);
    });

    return {
      stop() {
        clearInterval(timer);
        window.removeEventListener('storage', check);
      },
      check
    };
  }

  function emitContextChanged() {
    try {
      document.dispatchEvent(new CustomEvent('minibilge:context-changed'));
    } catch (e) { /* ignore */ }
  }

  function boot(opts) {
    const o = opts || {};
    if (o.purpose) declarePurpose(o.purpose).mount && null;
    watchContext({ reload: o.reload !== false, onChange: o.onContextChange });
    // TXA-003 — AI FAB already via MiniBilgeTxs; ensure screen hint
    if (window.MiniBilgeTxs && o.screen) {
      MiniBilgeTxs.attach({ screen: o.screen });
    }
  }

  const api = {
    version: '1.0',
    decision: 'MD-045',
    principles: [
      'TXA-001', 'TXA-002', 'TXA-003', 'TXA-004', 'TXA-005',
      'TXA-006', 'TXA-007', 'TXA-008', 'TXA-009', 'TXA-010'
    ],
    declarePurpose,
    fillFromContext,
    PrimaryActions,
    QuickActions,
    DocumentActions,
    VersionHistory,
    autosave,
    watchContext,
    emitContextChanged,
    boot
  };

  window.MiniBilgeTxa = api;
  if (C) C.Txa = api;
})();
