(function () {
  'use strict';

  /**
   * MB-DS-007 — Universal Component Library (MD-046)
   * Standart Mb* API · MiniBilgeLib + MiniBilgeComponents
   */

  const C = window.MiniBilgeComponents || {};
  function esc(s) {
    return (C.esc || function (x) {
      return String(x == null ? '' : x)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    })(s);
  }
  function component(html, afterMount) {
    if (C.component) return C.component(html, afterMount);
    return {
      html,
      mount(target) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return null;
        el.innerHTML = html;
        if (typeof afterMount === 'function') afterMount(el);
        return el;
      }
    };
  }

  function wrapExisting(fn, mapOpts) {
    return function (opts) {
      if (typeof fn === 'function') {
        const r = fn(mapOpts ? mapOpts(opts || {}) : (opts || {}));
        if (r && r.html != null) return r;
      }
      return component('<div class="mb-lib-fallback"></div>');
    };
  }

  /* ========== Core ========== */

  function MbButton(opts) {
    const o = opts || {};
    const variant = o.variant || (o.primary ? 'primary' : 'default');
    const dominant = o.dominant ? ' txa-dominant' : '';
    const cls = 'mb-lib-btn mb-lib-btn--' + variant + dominant + (o.compact ? ' is-compact' : '');
    const tag = o.href ? 'a' : 'button';
    const attrs = o.href
      ? `href="${esc(o.href)}"`
      : `type="${esc(o.type || 'button')}"`;
    const html = `<${tag} class="${cls}" ${attrs} ${o.disabled ? 'disabled' : ''} data-mb="button">${esc(o.label || 'Buton')}</${tag}>`;
    return component(html, function (root) {
      const el = root.querySelector('[data-mb="button"]') || root.firstElementChild;
      if (el && typeof o.onClick === 'function') el.addEventListener('click', o.onClick);
    });
  }

  function MbCard(opts) {
    const o = opts || {};
    const html = `
      <article class="mb-lib-card" data-mb="card">
        ${o.title ? `<header class="mb-lib-card-head"><h3>${esc(o.title)}</h3></header>` : ''}
        <div class="mb-lib-card-body">${o.bodyHtml || esc(o.body || '')}</div>
        ${o.footerHtml ? `<footer class="mb-lib-card-foot">${o.footerHtml}</footer>` : ''}
      </article>`;
    return component(html);
  }

  function MbInput(opts) {
    const o = opts || {};
    const id = o.id || ('mb-in-' + Math.random().toString(36).slice(2, 7));
    if (C.FormField) {
      return C.FormField({
        id, label: o.label, value: o.value, type: o.type, placeholder: o.placeholder, hint: o.hint
      });
    }
    const html = `
      <label class="mb-lib-field" for="${esc(id)}">
        ${o.label ? `<span class="mb-lib-label">${esc(o.label)}</span>` : ''}
        <input class="mb-lib-input mbc-input" id="${esc(id)}" name="${esc(o.name || id)}"
          type="${esc(o.type || 'text')}" value="${esc(o.value || '')}"
          placeholder="${esc(o.placeholder || '')}" ${o.disabled ? 'disabled' : ''}>
      </label>`;
    return component(html);
  }

  function MbDropdown(opts) {
    const o = opts || {};
    const id = o.id || ('mb-dd-' + Math.random().toString(36).slice(2, 7));
    const options = (o.options || []).map(function (opt) {
      const v = typeof opt === 'string' ? opt : opt.value;
      const lab = typeof opt === 'string' ? opt : (opt.label || opt.value);
      const sel = String(v) === String(o.value) ? ' selected' : '';
      return `<option value="${esc(v)}"${sel}>${esc(lab)}</option>`;
    }).join('');
    const html = `
      <label class="mb-lib-field" for="${esc(id)}">
        ${o.label ? `<span class="mb-lib-label">${esc(o.label)}</span>` : ''}
        <select class="mb-lib-input mbc-input" id="${esc(id)}" name="${esc(o.name || id)}">${options}</select>
      </label>`;
    return component(html, function (root) {
      const sel = root.querySelector('select');
      if (sel && typeof o.onChange === 'function') {
        sel.addEventListener('change', function () { o.onChange(sel.value); });
      }
    });
  }

  function MbSearch(opts) {
    const o = opts || {};
    const id = o.id || 'mb-search';
    const debounceMs = (window.MiniBilgeInteraction && MiniBilgeInteraction.TIMINGS.search) || 300;
    const html = `
      <div class="mb-lib-search" data-mb="search">
        <label class="mb-sr-only" for="${esc(id)}">Ara</label>
        <input class="mb-lib-input mbc-input" id="${esc(id)}" type="search"
          placeholder="${esc(o.placeholder || 'Ara…')}" value="${esc(o.value || '')}">
      </div>`;
    return component(html, function (root) {
      const input = root.querySelector('input');
      if (!input || typeof o.onSearch !== 'function') return;
      const run = window.MiniBilgeInteraction && MiniBilgeInteraction.debounce
        ? MiniBilgeInteraction.debounce(function (e) { o.onSearch(e.target.value); }, debounceMs)
        : function (e) { o.onSearch(e.target.value); };
      input.addEventListener('input', run);
    });
  }

  function MbTable(opts) {
    if (C.UniversalTable) return C.UniversalTable(opts || {});
    const o = opts || {};
    const cols = o.columns || [];
    const rows = o.rows || [];
    const head = cols.map(function (c) { return `<th>${esc(c.label || c.id)}</th>`; }).join('');
    const body = rows.map(function (r) {
      return `<tr>${cols.map(function (c) { return `<td>${esc(r[c.id])}</td>`; }).join('')}</tr>`;
    }).join('');
    return component(`<div class="mb-lib-table-wrap"><table class="mb-lib-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`);
  }

  function MbBadge(opts) {
    const o = opts || {};
    if (o.confidence && window.MiniBilgeTxs) {
      return MiniBilgeTxs.AiConfidence({ level: o.confidence, label: o.label });
    }
    const tone = o.tone || 'mid';
    const html = `<span class="mb-lib-badge mb-lib-badge--${esc(tone)}">${esc(o.label || '')}</span>`;
    return component(html);
  }

  function MbAvatar(opts) {
    const o = opts || {};
    const name = o.name || 'Öğretmen';
    const initials = (o.initials || name.split(/\s+/).map(function (p) { return p[0]; }).join('').slice(0, 2)).toUpperCase();
    const html = `<span class="mb-lib-avatar" title="${esc(name)}" aria-label="${esc(name)}">${esc(initials)}</span>`;
    return component(html);
  }

  function MbStepper(opts) {
    const o = opts || {};
    const steps = o.steps || [];
    const active = Math.max(0, (o.active || 1) - 1);
    const html = `
      <ol class="mb-lib-stepper" data-mb="stepper">
        ${steps.map(function (s, i) {
          const cls = i < active ? 'is-done' : (i === active ? 'is-current' : '');
          return `<li class="${cls}"><span>${i + 1}</span>${esc(typeof s === 'string' ? s : s.label)}</li>`;
        }).join('')}
      </ol>`;
    return component(html);
  }

  function MbTimeline(opts) {
    const o = opts || {};
    const items = o.items || [];
    const html = `
      <ul class="mb-lib-timeline" data-mb="timeline">
        ${items.map(function (it) {
          return `<li>
            <div class="mb-lib-tl-dot"></div>
            <div>
              <strong>${esc(it.title || '')}</strong>
              ${it.meta ? `<span class="mb-lib-tl-meta">${esc(it.meta)}</span>` : ''}
              ${it.body ? `<p>${esc(it.body)}</p>` : ''}
            </div>
          </li>`;
        }).join('')}
      </ul>`;
    return component(html);
  }

  function MbCalendar(opts) {
    const o = opts || {};
    const html = `
      <div class="mb-lib-calendar" data-mb="calendar">
        <header class="mb-lib-cal-head">
          <strong>${esc(o.title || 'Takvim')}</strong>
          ${o.week != null ? `<span>Hafta ${esc(o.week)}</span>` : ''}
        </header>
        <div class="mb-lib-cal-grid">
          ${(o.days || ['Pzt', 'Sal', 'Çar', 'Per', 'Cum']).map(function (d) {
            return `<div class="mb-lib-cal-day"><em>${esc(d)}</em><span>${esc((o.slots && o.slots[d]) || '—')}</span></div>`;
          }).join('')}
        </div>
      </div>`;
    return component(html);
  }

  function MbPreview(opts) {
    const o = opts || {};
    const html = `
      <div class="mb-lib-preview" data-mb="preview">
        <header class="mb-lib-preview-head">
          <strong>${esc(o.title || 'Önizleme')}</strong>
          ${o.status ? MbDocumentStatus({ status: o.status }).html : ''}
        </header>
        <div class="mb-lib-preview-body">${o.bodyHtml || esc(o.body || 'Önizleme alanı')}</div>
      </div>`;
    return component(html);
  }

  function MbWizard(opts) {
    const o = opts || {};
    const step = o.step || 1;
    const html = `
      <div class="mb-lib-wizard" data-mb="wizard">
        ${MbStepper({ steps: o.steps || ['Bilgi', 'Doğrula', 'Üret'], active: step }).html}
        <div class="mb-lib-wizard-body">${o.bodyHtml || ''}</div>
        <div class="mb-lib-wizard-actions">
          ${o.showBack ? MbButton({ label: 'Geri', variant: 'default', onClick: o.onBack }).html : ''}
          ${MbButton({ label: o.nextLabel || 'İleri', primary: true, dominant: true, onClick: o.onNext }).html}
        </div>
      </div>`;
    return component(html, function (root) {
      const btns = root.querySelectorAll('[data-mb="button"]');
      // remount buttons lose handlers if nested as html strings — rebind
      if (o.showBack && btns[0] && o.onBack) btns[0].addEventListener('click', o.onBack);
      const next = btns[btns.length - 1];
      if (next && o.onNext) next.addEventListener('click', o.onNext);
    });
  }

  function MbProgress(opts) {
    const o = opts || {};
    const c = Math.max(0, Math.min(100, Number(o.complete != null ? o.complete : o.value) || 0));
    if (window.MiniBilgeProgress && MiniBilgeProgress.headingBlock && o.title) {
      return component(MiniBilgeProgress.headingBlock(o.title, c, o.tag || 'h3'));
    }
    const r = 100 - c;
    const html = `
      <div class="mb-lib-progress" role="group" aria-label="${c}% tamam, ${r}% kaldı">
        ${o.label ? `<div class="mb-lib-progress-label">${esc(o.label)} · %${c} tamam · %${r} kaldı</div>` : ''}
        <div class="mb-progress-bar"><span class="mb-progress-fill" style="width:${c}%"></span></div>
      </div>`;
    return component(html);
  }

  function MbTabs(opts) {
    if (C.ClassTabs && (opts || {}).mode === 'class') return C.ClassTabs(opts);
    const o = opts || {};
    const tabs = o.tabs || [];
    const active = o.active || (tabs[0] && (tabs[0].id || tabs[0]));
    const html = `
      <div class="mb-lib-tabs" role="tablist">
        ${tabs.map(function (t) {
          const id = typeof t === 'string' ? t : t.id;
          const lab = typeof t === 'string' ? t : t.label;
          const on = String(id) === String(active);
          return `<button type="button" class="mb-lib-tab${on ? ' is-active' : ''}" role="tab" aria-selected="${on}" data-tab="${esc(id)}">${esc(lab)}</button>`;
        }).join('')}
      </div>`;
    return component(html, function (root) {
      root.querySelectorAll('[data-tab]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (typeof o.onChange === 'function') o.onChange(btn.getAttribute('data-tab'));
        });
      });
    });
  }

  function MbContextBar(opts) {
    const o = opts || {};
    let ctx = o.context;
    if (!ctx && window.ContextCacheService && ContextCacheService.isLoaded()) ctx = ContextCacheService.get();
    if (!ctx && window.MiniBilgeStorage && MiniBilgeStorage.getClassContext) {
      const c = MiniBilgeStorage.getClassContext();
      const school = MiniBilgeStorage.getSchool();
      ctx = { label: c.label, sinif: c.sinif, sube: c.sube, okul: school, egitimYili: school.egitimYili };
    }
    ctx = ctx || {};
    const html = `
      <div class="mb-lib-context" data-mb="context-bar" aria-label="Bağlam">
        <span>${esc((ctx.okul && (ctx.okul.ad || ctx.okul.okulAdi)) || o.okul || 'Okul')}</span>
        <span>${esc(ctx.egitimYili || (ctx.okul && ctx.okul.egitimYili) || o.year || '2025-2026')}</span>
        <strong>${esc(ctx.label || ((ctx.sinif || '') + '/' + (ctx.sube || '')) || '1/A')}</strong>
      </div>`;
    return component(html);
  }

  function MbClassSelector(opts) {
    if (C.ClassContext) return C.ClassContext(opts || {});
    const o = opts || {};
    const classes = o.classes || [
      { sinif: '1', sube: 'A', label: '1/A' },
      { sinif: '2', sube: 'A', label: '2/A' },
      { sinif: '3', sube: 'A', label: '3/A' },
      { sinif: '4', sube: 'A', label: '4/A' }
    ];
    const html = `
      <div class="mb-lib-class-sel grade-tabs" role="tablist" aria-label="Sınıfını seç">
        ${classes.map(function (c) {
          const on = String(c.sinif) === String(o.activeSinif || '1') && String(c.sube || 'A') === String(o.activeSube || 'A');
          return `<button type="button" class="grade-tab${on ? ' active' : ''}" data-sinif="${esc(c.sinif)}" data-sube="${esc(c.sube || 'A')}">${esc(c.label || (c.sinif + '/' + (c.sube || 'A')))}</button>`;
        }).join('')}
      </div>`;
    return component(html, function (root) {
      root.querySelectorAll('[data-sinif]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (typeof o.onChange === 'function') {
            o.onChange(btn.getAttribute('data-sinif'), btn.getAttribute('data-sube'));
          }
        });
      });
    });
  }

  function MbFloatingAI(opts) {
    if (window.MiniBilgeTxs) {
      const screen = (opts && opts.screen) || (MiniBilgeTxs.detectScreen && MiniBilgeTxs.detectScreen());
      MiniBilgeTxs.attach({ screen: screen });
      return component('<div class="mb-lib-fab-host" data-mb="floating-ai" aria-hidden="true"></div>');
    }
    return component(`<a class="txs-fab" href="${esc((opts && opts.href) || 'modules/ai.html')}"><span class="txs-fab-mark">AI</span><span class="txs-fab-label">Yardım</span></a>`);
  }

  function MbNotificationCenter(opts) {
    const o = opts || {};
    const html = `
      <div class="mb-lib-notify" data-mb="notifications">
        <strong>Bildirimler</strong>
        <div class="mb-lib-notify-actions">
          ${['info', 'success', 'warn'].map(function (t) {
            return `<button type="button" class="mbc-btn-ghost" data-n="${t}">${t}</button>`;
          }).join('')}
        </div>
      </div>`;
    return component(html, function (root) {
      root.querySelectorAll('[data-n]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const t = btn.getAttribute('data-n');
          if (C.notify && C.notify[t]) C.notify[t](o.message || 'Örnek bildirim', 'MbNotificationCenter');
        });
      });
    });
  }

  function MbCommandPalette(opts) {
    const o = opts || {};
    const commands = o.commands || [
      { id: 'yp', label: 'Yıllık plan', href: 'modules/yillik-plan.html' },
      { id: 'gp', label: 'Günlük plan', href: 'modules/gunluk-plan.html' },
      { id: 'lee', label: 'Dersi başlat', href: 'modules/ders-yurutme.html' },
      { id: 'ai', label: 'MiniBilge AI', href: 'modules/ai.html' }
    ];
    const html = `
      <div class="mb-lib-cmd" data-mb="command-palette" hidden>
        <input class="mb-lib-input" type="search" placeholder="Komut yazın…" data-cmd-input>
        <ul class="mb-lib-cmd-list">
          ${commands.map(function (c) {
            return `<li><a href="${esc(c.href || '#')}" data-cmd="${esc(c.id)}">${esc(c.label)}</a></li>`;
          }).join('')}
        </ul>
      </div>`;
    return component(html, function (root) {
      const panel = root.querySelector('.mb-lib-cmd') || root;
      function open() { panel.hidden = false; const i = panel.querySelector('[data-cmd-input]'); if (i) i.focus(); }
      function close() { panel.hidden = true; }
      document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          panel.hidden ? open() : close();
        }
        if (e.key === 'Escape') close();
      });
      if (o.open) open();
    });
  }

  function MbQuickActions(opts) {
    if (window.MiniBilgeTxa) return MiniBilgeTxa.QuickActions((opts && opts.items) || []);
    const items = (opts && opts.items) || [];
    return component(`<div class="txa-quick">${items.map(function (it) {
      return `<a class="txa-quick-btn" href="${esc(it.href || '#')}">${esc(it.label)}</a>`;
    }).join('')}</div>`);
  }

  function MbRecentDocuments(opts) {
    const o = opts || {};
    let docs = o.documents;
    if (!docs && window.MiniBilgeStorage) docs = MiniBilgeStorage.getDocuments();
    docs = (docs || []).slice(0, o.limit || 5);
    const html = `
      <div class="mb-lib-recent" data-mb="recent-docs">
        <header><strong>Son belgeler</strong></header>
        ${docs.length ? `<ul>${docs.map(function (d) {
          return `<li><span>${esc(d.title || d.tur || d.id)}</span><em>${esc((d.downloadedAt || d.createdAt || '').slice(0, 10))}</em></li>`;
        }).join('')}</ul>` : MbEmptyState({ title: 'Henüz belge yok', message: 'Üretim sonrası burada listelenir.' }).html}
      </div>`;
    return component(html);
  }

  function MbDocumentStatus(opts) {
    const o = opts || {};
    const status = o.status || 'draft';
    if (C.StatusBadge) return C.StatusBadge({ status: status });
    const map = { draft: 'Taslak', ready: 'Hazır', editing: 'Düzenleniyor', locked: 'Kilitli', official: 'Resmi' };
    return component(`<span class="mb-lib-badge mb-lib-badge--mid">${esc(o.label || map[status] || status)}</span>`);
  }

  function MbAutosaveIndicator(opts) {
    const o = opts || {};
    const state = o.state || 'idle'; // idle | saving | saved | error
    const labels = { idle: 'Autosave hazır', saving: 'Kaydediliyor…', saved: 'Kaydedildi', error: 'Kayıt hatası' };
    const html = `<span class="mb-lib-autosave is-${esc(state)}" data-mb="autosave" aria-live="polite">${esc(o.label || labels[state] || state)}</span>`;
    return component(html);
  }

  function MbVersionHistory(opts) {
    const o = opts || {};
    if (window.MiniBilgeTxa && o.docId) return MiniBilgeTxa.VersionHistory.render(o.docId);
    return component('<div class="txa-versions"><strong>Sürüm geçmişi</strong><p class="section-lead">Belge kaydı sonrası görünür.</p></div>');
  }

  function MbTeacherDashboard(opts) {
    const o = opts || {};
    const tasks = o.tasks || [
      { text: 'Günlük plan hazırla', href: 'modules/gunluk-plan.html' },
      { text: 'Dersi başlat', href: 'modules/ders-yurutme.html' },
      { text: 'Yoklama al', href: 'documents/olustur.html?id=devamsizlik-takip' }
    ];
    const html = `
      <section class="mb-lib-dash" data-mb="teacher-dashboard">
        <header class="mb-heading-with-pct">
          <h2 class="mb-heading-text">${esc(o.title || 'Bugün')}</h2>
          ${window.MiniBilgeProgress ? MiniBilgeProgress.badge(o.complete != null ? o.complete : 90) : ''}
        </header>
        <div class="task-list">
          ${tasks.map(function (t) {
            return `<div class="task-row">
              <span class="task-check"></span>
              <span class="task-text">${esc(t.text)}</span>
              <a class="quick-btn primary compact" href="${esc(t.href || '#')}">Yap</a>
            </div>`;
          }).join('')}
        </div>
      </section>`;
    return component(html);
  }

  function MbWorkflowStepper(opts) {
    const o = opts || {};
    const stages = o.stages || ['Hazırlık', 'Uygulama', 'Ölçme', 'Rapor'];
    return MbStepper({ steps: stages, active: o.active || 1 });
  }

  function MbLessonTimeline(opts) {
    const o = opts || {};
    return MbTimeline({
      items: o.items || [
        { title: 'Giriş', meta: '5 dk', body: 'Dikkat çekme' },
        { title: 'Gelişme', meta: '25 dk', body: 'Etkinlik / kazanım' },
        { title: 'Sonuç', meta: '10 dk', body: 'Özet / yansıtma' }
      ]
    });
  }

  function MbLessonExecution(opts) {
    const o = opts || {};
    const status = o.status || 'READY';
    const html = `
      <div class="mb-lib-lee" data-mb="lesson-execution">
        <header>
          <strong>${esc(o.title || 'Ders Yürütme')}</strong>
          ${MbBadge({ label: status, tone: status === 'COMPLETED' ? 'hi' : 'mid' }).html}
        </header>
        <p class="section-lead">${esc(o.lead || 'LEE — Ders Defteri projeksiyonudur (MD-040).')}</p>
        <div class="txa-primary-actions">
          ${MbButton({ label: o.cta || 'Dersi Başlat', primary: true, dominant: true, href: o.href || 'modules/ders-yurutme.html' }).html}
        </div>
      </div>`;
    return component(html);
  }

  function MbAttendanceBar(opts) {
    const o = opts || {};
    const present = Number(o.present || 0);
    const absent = Number(o.absent || 0);
    const late = Number(o.late || 0);
    const total = present + absent + late || 1;
    const html = `
      <div class="mb-lib-attendance" data-mb="attendance" aria-label="Yoklama">
        <div class="mb-lib-att-bar">
          <span class="is-present" style="width:${(present / total) * 100}%"></span>
          <span class="is-late" style="width:${(late / total) * 100}%"></span>
          <span class="is-absent" style="width:${(absent / total) * 100}%"></span>
        </div>
        <div class="mb-lib-att-legend">
          <span>Var ${present}</span><span>Geç ${late}</span><span>Yok ${absent}</span>
        </div>
      </div>`;
    return component(html);
  }

  function MbReflectionCard(opts) {
    const o = opts || {};
    return MbCard({
      title: o.title || 'Yansıtma',
      bodyHtml: `<p>${esc(o.text || 'Ders sonrası kısa yansıtma…')}</p>
        <textarea class="mb-lib-input" rows="3" placeholder="${esc(o.placeholder || 'Ne iyi gitti?')}">${esc(o.value || '')}</textarea>`
    });
  }

  function MbAssessmentPanel(opts) {
    const o = opts || {};
    const items = o.items || [
      { label: 'Rubrik', href: 'modules/olcme.html' },
      { label: 'Kontrol listesi', href: 'modules/olcme.html' },
      { label: 'Gözlem', href: 'modules/olcme.html' }
    ];
    return MbCard({
      title: o.title || 'Ölçme',
      bodyHtml: `<div class="txa-quick-list">${items.map(function (it) {
        return `<a class="txa-quick-btn" href="${esc(it.href)}">${esc(it.label)}</a>`;
      }).join('')}</div>`
    });
  }

  function MbAnalyticsCard(opts) {
    const o = opts || {};
    const metrics = o.metrics || [
      { label: 'Plan', value: '%82' },
      { label: 'LEE', value: '%80' },
      { label: 'Ölçme', value: '%55' }
    ];
    const html = `
      <div class="mb-lib-analytics" data-mb="analytics">
        <strong>${esc(o.title || 'Analitik')}</strong>
        <div class="mb-lib-metrics">
          ${metrics.map(function (m) {
            return `<div><em>${esc(m.label)}</em><strong>${esc(m.value)}</strong></div>`;
          }).join('')}
        </div>
      </div>`;
    return component(html);
  }

  function MbEmptyState(opts) {
    if (window.MiniBilgeTxs) return MiniBilgeTxs.EmptyState(opts || {});
    const o = opts || {};
    return component(`<div class="txs-empty"><strong>${esc(o.title || 'Buradan başlayın')}</strong><p>${esc(o.message || '')}</p></div>`);
  }

  function MbSkeletonLoader(opts) {
    if (window.MiniBilgeInteraction) return MiniBilgeInteraction.Skeleton(opts || {});
    const lines = Math.max(1, (opts && opts.lines) || 3);
    return component(`<div class="mb-is-skeleton">${Array.from({ length: lines }, function () {
      return '<span class="mb-is-skel-line"></span>';
    }).join('')}</div>`);
  }

  function MbOfflineBanner(opts) {
    if (window.MiniBilgeOffline) {
      MiniBilgeOffline.renderBanner();
      return component('<div data-mb="offline-banner-host"></div>');
    }
    const o = opts || {};
    return component(`<div class="mb-offline-banner" role="status">${esc(o.message || 'Çevrimdışı — değişiklikler yerelde saklanır.')}</div>`);
  }

  function MbSyncIndicator(opts) {
    const o = opts || {};
    const state = o.state || (window.MiniBilgeOffline && !MiniBilgeOffline.isOnline() ? 'offline' : 'synced');
    const labels = { synced: 'Senkron', syncing: 'Senkronize ediliyor…', offline: 'Çevrimdışı', pending: 'Kuyrukta' };
    const q = window.MiniBilgeOffline ? MiniBilgeOffline.readQueue().length : 0;
    const html = `<span class="mb-lib-sync is-${esc(state)}" data-mb="sync">${esc(o.label || labels[state] || state)}${q ? ' · ' + q : ''}</span>`;
    return component(html);
  }

  const LIB = {
    version: '1.0',
    decision: 'MD-046',
    catalog: [
      'MbButton', 'MbCard', 'MbInput', 'MbDropdown', 'MbSearch', 'MbTable', 'MbBadge', 'MbAvatar',
      'MbStepper', 'MbTimeline', 'MbCalendar', 'MbPreview', 'MbWizard', 'MbProgress', 'MbTabs',
      'MbContextBar', 'MbClassSelector', 'MbFloatingAI', 'MbNotificationCenter', 'MbCommandPalette',
      'MbQuickActions', 'MbRecentDocuments', 'MbDocumentStatus', 'MbAutosaveIndicator', 'MbVersionHistory',
      'MbTeacherDashboard', 'MbWorkflowStepper', 'MbLessonTimeline', 'MbLessonExecution', 'MbAttendanceBar',
      'MbReflectionCard', 'MbAssessmentPanel', 'MbAnalyticsCard', 'MbEmptyState', 'MbSkeletonLoader',
      'MbOfflineBanner', 'MbSyncIndicator'
    ],
    MbButton, MbCard, MbInput, MbDropdown, MbSearch, MbTable, MbBadge, MbAvatar,
    MbStepper, MbTimeline, MbCalendar, MbPreview, MbWizard, MbProgress, MbTabs,
    MbContextBar, MbClassSelector, MbFloatingAI, MbNotificationCenter, MbCommandPalette,
    MbQuickActions, MbRecentDocuments, MbDocumentStatus, MbAutosaveIndicator, MbVersionHistory,
    MbTeacherDashboard, MbWorkflowStepper, MbLessonTimeline, MbLessonExecution, MbAttendanceBar,
    MbReflectionCard, MbAssessmentPanel, MbAnalyticsCard, MbEmptyState, MbSkeletonLoader,
    MbOfflineBanner, MbSyncIndicator
  };

  window.MiniBilgeLib = LIB;
  if (window.MiniBilgeComponents) {
    Object.keys(LIB).forEach(function (k) {
      if (k.indexOf('Mb') === 0) MiniBilgeComponents[k] = LIB[k];
    });
    MiniBilgeComponents.Lib = LIB;
    MiniBilgeComponents.version = '1.0.0-ds-007';
  }
})();
