(function () {
  'use strict';

  /**
   * İlerleme panosu — Tamam% / Kaldı%
   * Kaynak: assets/data/progress.json · docs/ILERLEME.md
   */

  function resolveUrl() {
    const base = window.MINIBILGE_BASE != null ? window.MINIBILGE_BASE : '';
    if (base) return base + 'assets/data/progress.json';
    const inModules = /\/modules\//.test(location.pathname);
    const inDocs = /\/documents\//.test(location.pathname);
    if (inModules || inDocs) return '../assets/data/progress.json';
    return 'assets/data/progress.json';
  }

  function bar(complete) {
    const c = Math.max(0, Math.min(100, Number(complete) || 0));
    const r = 100 - c;
    return `
      <div class="mb-progress-row" role="group" aria-label="${c}% tamam, ${r}% kaldı">
        <div class="mb-progress-bar" aria-hidden="true">
          <span style="width:${c}%"></span>
        </div>
        <span class="mb-progress-meta"><strong>%${c}</strong> tamam · <em>%${r}</em> kaldı</span>
      </div>`;
  }

  function renderDesignSystem(data) {
    const ds = data.designSystem || {};
    const items = ds.items || [];
    const rows = items.map(it => `
      <div class="mb-progress-item">
        <div class="mb-progress-head">
          <strong>${esc(it.id)}</strong>
          <span>${esc(it.title || '')}</span>
        </div>
        ${bar(it.complete)}
        <p class="mb-progress-left">${esc(it.left || '—')}</p>
      </div>`).join('');
    return `
      <div class="mb-progress-board">
        <header class="mb-progress-board-head">
          <h3>Tasarım sistemi ilerlemesi</h3>
          <p>Paket: <strong>%${ds.averageComplete ?? '—'} tamam</strong> · <em>%${ds.averageRemaining ?? '—'} kaldı</em></p>
        </header>
        ${rows}
        ${data.nextPriority ? `
          <p class="mb-progress-next">Sonraki öncelik: <strong>${esc(data.nextPriority.id)}</strong>
          — %${data.nextPriority.complete} tamam · %${data.nextPriority.remaining} kaldı
          (${esc(data.nextPriority.title || '')})</p>` : ''}
      </div>`;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  async function load() {
    const res = await fetch(resolveUrl(), { cache: 'no-store' });
    if (!res.ok) throw new Error('progress.json yüklenemedi');
    return res.json();
  }

  async function mount(target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    el.innerHTML = '<div class="mb-is-skeleton" aria-busy="true"><span class="mb-is-skel-line"></span><span class="mb-is-skel-line" style="width:70%"></span></div>';
    try {
      const data = await load();
      el.innerHTML = renderDesignSystem(data);
      return data;
    } catch (e) {
      el.innerHTML = `<p class="section-lead">İlerleme panosu yüklenemedi: ${esc(e.message)}</p>`;
      return null;
    }
  }

  window.MiniBilgeProgress = { load, mount, renderDesignSystem, bar };
})();
