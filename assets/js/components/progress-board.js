(function () {
  'use strict';

  /**
   * İlerleme panosu — Tamam% / Kaldı%
   * Kaynak: assets/data/progress.json · docs/ILERLEME.md
   */

  let cache = null;

  function resolveUrl() {
    const base = window.MINIBILGE_BASE != null ? window.MINIBILGE_BASE : '';
    if (base) return base + 'assets/data/progress.json';
    const inModules = /\/modules\//.test(location.pathname);
    const inDocs = /\/documents\//.test(location.pathname);
    if (inModules || inDocs) return '../assets/data/progress.json';
    return 'assets/data/progress.json';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function clampPct(n) {
    const c = Math.round(Number(n) || 0);
    return Math.max(0, Math.min(100, c));
  }

  /** Renk bandı: yüksek teal → orta gökyüzü → düşük kehribar → kritik */
  function tone(complete) {
    const c = clampPct(complete);
    if (c >= 90) return 'hi';
    if (c >= 70) return 'mid';
    if (c >= 40) return 'low';
    return 'crit';
  }

  function bar(complete) {
    const c = clampPct(complete);
    const r = 100 - c;
    return `
      <div class="mb-progress-row" role="group" aria-label="${c}% tamam, ${r}% kaldı">
        <div class="mb-progress-bar" aria-hidden="true">
          <span class="mb-progress-fill mb-pct-tone--${tone(c)}" style="width:${c}%"></span>
        </div>
        <span class="mb-progress-meta"><strong>%${c}</strong> tamam · <em>%${r}</em> kaldı</span>
      </div>`;
  }

  /** Başlık yanı renkli yüzde rozeti + mini bar */
  function badge(complete, opts) {
    const o = opts || {};
    const c = clampPct(complete);
    const r = 100 - c;
    const t = tone(c);
    const showLeft = o.showRemaining !== false;
    const label = showLeft ? `%${c} tamam · %${r} kaldı` : `%${c}`;
    return `<span class="mb-pct mb-pct--${t}" title="${c}% tamamlandı, ${r}% kaldı" aria-label="${c}% tamam, ${r}% kaldı">
      <span class="mb-pct-ring" aria-hidden="true" style="--mb-pct:${c}"></span>
      <span class="mb-pct-label">${label}</span>
    </span>`;
  }

  /** Başlık + rozet + renkli şerit (ana sayfa bölümleri) */
  function headingBlock(title, complete, tag) {
    const Tag = tag || 'h2';
    const c = clampPct(complete);
    const t = tone(c);
    return `<div class="mb-heading-block">
      <${Tag} class="mb-heading-with-pct">
        <span class="mb-heading-text">${esc(title)}</span>
        ${badge(c)}
      </${Tag}>
      <div class="mb-heading-track" aria-hidden="true">
        <span class="mb-heading-fill mb-pct-tone--${t}" style="width:${c}%"></span>
      </div>
    </div>`;
  }

  function hubPctFromItems(cat, override) {
    if (override != null && override !== '') return clampPct(override);
    const items = (cat && cat.items) || [];
    if (!items.length) return 0;
    const ready = items.filter(function (it) { return !it.yakinda; }).length;
    return clampPct((ready / items.length) * 100);
  }

  function renderDesignSystem(data) {
    const ds = data.designSystem || {};
    const items = ds.items || [];
    const rows = items.map(it => `
      <div class="mb-progress-item">
        <div class="mb-progress-head">
          <strong>${esc(it.id)}</strong>
          <span>${esc(it.title || '')}</span>
          ${badge(it.complete)}
        </div>
        ${bar(it.complete)}
        <p class="mb-progress-left">${esc(it.left || '—')}</p>
      </div>`).join('');
    return `
      <div class="mb-progress-board">
        <header class="mb-progress-board-head">
          <h3 class="mb-heading-with-pct">
            <span class="mb-heading-text">Tasarım sistemi ilerlemesi</span>
            ${badge(ds.averageComplete)}
          </h3>
          <p>Paket: <strong>%${ds.averageComplete ?? '—'} tamam</strong> · <em>%${ds.averageRemaining ?? '—'} kaldı</em></p>
        </header>
        ${rows}
        ${data.nextPriority ? `
          <p class="mb-progress-next">Sonraki öncelik: <strong>${esc(data.nextPriority.id)}</strong>
          ${badge(data.nextPriority.complete)}
          (${esc(data.nextPriority.title || '')})</p>` : ''}
      </div>`;
  }

  async function load(force) {
    if (cache && !force) return cache;
    const res = await fetch(resolveUrl(), { cache: 'no-store' });
    if (!res.ok) throw new Error('progress.json yüklenemedi');
    cache = await res.json();
    return cache;
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

  function homePct(data, key, fallback) {
    const home = (data && data.home) || {};
    if (home[key] && home[key].complete != null) return clampPct(home[key].complete);
    if (typeof home[key] === 'number') return clampPct(home[key]);
    return clampPct(fallback == null ? 0 : fallback);
  }

  function hubPct(data, hubId, cat) {
    const hubs = ((data && data.home) || {}).hubs || {};
    return hubPctFromItems(cat, hubs[hubId]);
  }

  window.MiniBilgeProgress = {
    load,
    mount,
    renderDesignSystem,
    bar,
    badge,
    headingHtml: headingBlock,
    headingBlock,
    tone,
    homePct,
    hubPct,
    hubPctFromItems,
    getCache() { return cache; }
  };
})();
