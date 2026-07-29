(function () {
  'use strict';

  /**
   * MB-DS-002 — Teacher Experience System (TXS)
   * TXS-005 AI Everywhere · TXS-006 Progressive Disclosure
   * TXS-007 Never Empty · TXS-010 AI Confidence
   */

  const C = window.MiniBilgeComponents;

  const SCREEN_HELP = {
    home: [
      { label: 'Bugünkü işlerimi özetle', q: 'Bugün hangi görevleri yapmalıyım?' },
      { label: 'Yıllık planı başlat', q: 'Yıllık plan oluşturmama yardım et' },
      { label: 'Dersi başlat (LEE)', q: 'Ders yürütme nasıl çalışır?' }
    ],
    'yillik-plan': [
      { label: 'Kazanımı açıkla', q: 'Seçili kazanımları sade dilde açıkla' },
      { label: 'Dersi sadeleştir', q: 'Bu yıllık planı sadeleştir' },
      { label: 'Etkinlik öner', q: 'Ünitelere etkinlik öner' }
    ],
    'gunluk-plan': [
      { label: 'Etkinlik öner', q: 'Bugünkü derse etkinlik öner' },
      { label: 'Materyal öner', q: 'Materyal listesi öner' },
      { label: 'Sadeleştir', q: 'Günlük planı kısalt' }
    ],
    'ders-yurutme': [
      { label: 'Yansıtma yaz', q: 'Ders yansıtması için sorular sor' },
      { label: 'Sonraki ders', q: 'Sonraki ders için ne yapmalıyım?' }
    ],
    default: [
      { label: 'Bu ekranı açıkla', q: 'Bu ekranda ne yapabilirim?' },
      { label: 'Sonraki adım', q: 'Sırada ne var?' },
      { label: 'Belge üretimi', q: 'Belge nasıl otomatik oluşur?' }
    ]
  };

  function esc(s) {
    return (C && C.esc) ? C.esc(s) : String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function detectScreen(activeId) {
    if (activeId) return activeId;
    const path = (window.location.pathname || '').split('/').pop() || '';
    if (path === '' || path === 'index.html') return 'home';
    return path.replace(/\.html$/i, '') || 'default';
  }

  /** TXS-010 */
  function AiConfidence(opts) {
    const o = opts || {};
    const level = o.level || 'oneri'; // resmi | oneri | taslak
    const map = {
      resmi: { cls: 'txs-conf--resmi', label: o.label || 'Resmi' },
      oneri: { cls: 'txs-conf--oneri', label: o.label || 'Öneri' },
      taslak: { cls: 'txs-conf--taslak', label: o.label || 'Taslak' }
    };
    const m = map[level] || map.oneri;
    const html = `<span class="txs-conf ${m.cls}" title="AI çıktısı MEB belgesi değildir">${esc(m.label)}</span>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  /** TXS-007 */
  function EmptyState(opts) {
    const o = opts || {};
    const actions = (o.actions || []).map(a =>
      `<a class="quick-btn${a.primary ? ' primary' : ''} compact" href="${esc(a.href || '#')}">${esc(a.label)}</a>`
    ).join('');
    const html = `
      <div class="txs-empty">
        <strong>${esc(o.title || 'Buradan başlayın')}</strong>
        <p>${esc(o.message || 'Örnek veri ve öneriler hazır. Sistem sizi yönlendirecek.')}</p>
        ${o.hint ? `<p class="txs-empty-hint">${esc(o.hint)}</p>` : ''}
        <div class="quick-actions" style="margin-top:10px;">${actions}</div>
      </div>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  /** TXS-006 */
  function AdvancedPanel(opts) {
    const o = opts || {};
    const id = o.id || ('adv-' + Math.random().toString(36).slice(2, 7));
    const html = `
      <details class="txs-advanced" id="${esc(id)}">
        <summary>Gelişmiş</summary>
        <div class="txs-advanced-body">${o.bodyHtml || ''}</div>
      </details>`;
    return C ? C.component(html) : { html, mount() {} };
  }

  function helpFor(screen) {
    return SCREEN_HELP[screen] || SCREEN_HELP.default;
  }

  function buildFab(screen) {
    const items = helpFor(screen);
    return `
      <div id="mb-txs-root" class="txs-root" data-screen="${esc(screen)}">
        <div id="mb-txs-panel" class="txs-panel" hidden>
          <header class="txs-panel-head">
            <div>
              <strong>MiniBilge AI</strong>
              ${AiConfidence({ level: 'oneri' }).html}
            </div>
            <button type="button" class="txs-panel-close" aria-label="Kapat">×</button>
          </header>
          <p class="txs-panel-lead">Bu ekrana özel yardım · TXS-005</p>
          <ul class="txs-panel-list">
            ${items.map(it => `
              <li><button type="button" class="txs-help-btn" data-q="${esc(it.q)}">${esc(it.label)}</button></li>
            `).join('')}
          </ul>
          <a class="txs-panel-link" href="${esc(resolveAiHref())}">AI Asistan’ı aç</a>
        </div>
        <button type="button" id="mb-txs-fab" class="txs-fab" aria-expanded="false" aria-controls="mb-txs-panel">
          <span class="txs-fab-mark">AI</span>
          <span class="txs-fab-label">Yardım</span>
        </button>
      </div>`;
  }

  function resolveAiHref() {
    const inModules = /\/modules\//.test(window.location.pathname);
    const inDocs = /\/documents\//.test(window.location.pathname);
    if (inModules) return 'ai.html';
    if (inDocs) return '../modules/ai.html';
    return 'modules/ai.html';
  }

  function bindFab(root) {
    const fab = root.querySelector('#mb-txs-fab');
    const panel = root.querySelector('#mb-txs-panel');
    if (!fab || !panel) return;

    function setOpen(open) {
      if (open) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(panel.hasAttribute('hidden'));
    });

    const close = root.querySelector('.txs-panel-close');
    if (close) {
      close.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(false);
      });
    }

    document.addEventListener('click', function (e) {
      if (!panel.hasAttribute('hidden') && !root.contains(e.target)) setOpen(false);
    });

    root.querySelectorAll('.txs-help-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const q = btn.getAttribute('data-q') || '';
        if (window.MiniBilgeComponents && MiniBilgeComponents.notify) {
          MiniBilgeComponents.notify.info(q, 'AI Öneri');
        }
        const href = resolveAiHref() + '?q=' + encodeURIComponent(q);
        btn.classList.add('is-used');
        window.setTimeout(function () { window.location.href = href; }, 350);
      });
    });
  }

  function attach(opts) {
    const o = opts || {};
    const screen = detectScreen(o.screen);
    const layout = document.querySelector('.app-layout') || document.body;
    let root = document.getElementById('mb-txs-root');
    if (root) {
      root.setAttribute('data-screen', screen);
      root.remove();
    }
    const wrap = document.createElement('div');
    wrap.innerHTML = buildFab(screen);
    root = wrap.firstElementChild;
    layout.appendChild(root);
    bindFab(root);
    return root;
  }

  window.MiniBilgeTxs = {
    version: '1.0',
    principles: [
      'TXS-001', 'TXS-002', 'TXS-003', 'TXS-004', 'TXS-005',
      'TXS-006', 'TXS-007', 'TXS-008', 'TXS-009', 'TXS-010'
    ],
    AiConfidence,
    EmptyState,
    AdvancedPanel,
    attach,
    helpFor,
    detectScreen
  };

  if (C) {
    C.AiConfidence = AiConfidence;
    C.EmptyState = EmptyState;
    C.AdvancedPanel = AdvancedPanel;
  }
})();
