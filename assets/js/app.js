(function () {
  'use strict';

  const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  const FALLBACK_CAL = {
    egitimYili: '2025-2026',
    donemler: [
      { ad: '1. Dönem', baslangic: '2025-09-08', bitis: '2026-01-16' },
      { ad: '2. Dönem', baslangic: '2026-02-02', bitis: '2026-06-19' }
    ],
    tatiller: [],
    belirliGunler: [],
    haftalikDersSaati: {
      '1': { turkce: 10, matematik: 5, hayatBilgisi: 4, bedenEgitimi: 5, gorselSanatlar: 1, muzik: 1, serbestEtkinlikler: 4 },
      '2': { turkce: 10, matematik: 5, hayatBilgisi: 4, ingilizce: 2, bedenEgitimi: 5, gorselSanatlar: 1, muzik: 1, serbestEtkinlikler: 2 },
      '3': { turkce: 8, matematik: 5, fen: 3, hayatBilgisi: 3, ingilizce: 2, bedenEgitimi: 5, gorselSanatlar: 1, muzik: 1, serbestEtkinlikler: 2 },
      '4': { turkce: 8, matematik: 5, fen: 3, sosyal: 3, ingilizce: 2, dinKulturu: 2, insanHaklari: 2, trafikGuvenligi: 1, bedenEgitimi: 2, gorselSanatlar: 1, muzik: 1 }
    }
  };

  function mount(html) {
    const root = document.getElementById('app');
    if (root) root.innerHTML = html;
  }

  function showBootError(err) {
    const msg = (err && err.message) ? err.message : String(err || 'Bilinmeyen hata');
    mount(window.MiniBilgeNav ? MiniBilgeNav.renderLayout('home', `
      <div class="dash"><header class="dash-hero">
        <p class="brand-kicker">MiniBilge</p>
        <h1>Ana sayfa yüklenemedi</h1>
        <p class="dash-date">${esc(msg)}</p>
      </header></div>`) : `<p>${esc(msg)}</p>`);
  }

  function withSinif(href, sinif, sube) {
    if (!href || href === '#' || /yakinda/i.test(href)) return href;
    let out = href;
    if (/[?&]sinif=/.test(out)) out = out.replace(/([?&]sinif=)[^&]*/, `$1${encodeURIComponent(sinif)}`);
    else out += (out.includes('?') ? '&' : '?') + `sinif=${encodeURIComponent(sinif)}`;
    if (sube) {
      if (/[?&]sube=/.test(out)) out = out.replace(/([?&]sube=)[^&]*/, `$1${encodeURIComponent(sube)}`);
      else out += `&sube=${encodeURIComponent(sube)}`;
    }
    return out;
  }

  function setupIncomplete(profile, school) {
    return !profile.adSoyad || !(school.okulAdi || school.ad) || !school.il;
  }

  /** MB-IA-001 — İş akışı merkezli ana ekran */
  async function initDashboard() {
    try {
      if (!window.MiniBilgeNav || !window.MiniBilgeStorage || !window.MiniBilgeHub) {
        throw new Error('Gerekli betikler yüklenemedi.');
      }

      const profile = MiniBilgeStorage.getProfile();
      const school = MiniBilgeStorage.getSchool();
      const plans = MiniBilgeStorage.getPlans();
      const egitimYiliHint = school.egitimYili || '2025-2026';
      const today = new Date();
      const gunAdi = GUNLER[today.getDay()];

      let cal = FALLBACK_CAL;
      try {
        if (window.CalendarEngine) {
          CalendarEngine.setYear(egitimYiliHint);
          const loaded = await CalendarEngine.loadCalendar();
          if (loaded && loaded.haftalikDersSaati) cal = loaded;
        }
      } catch (e) {
        console.warn(e);
      }

      // MD-038 — Load Once (takvim saatleriyle)
      let cacheAgg = null;
      if (window.ContextCacheService) {
        const needHours = !ContextCacheService.isLoaded()
          || !(ContextCacheService.get() && ContextCacheService.get().haftalikDersSaatleri);
        cacheAgg = await ContextCacheService.load({ cal, force: needHours });
      }

      const ctx = cacheAgg
        ? { sinif: cacheAgg.sinif, sube: cacheAgg.sube, label: cacheAgg.label }
        : MiniBilgeStorage.getClassContext();
      const siniflar = MiniBilgeStorage.getSiniflar();
      const sinif = ctx.sinif;
      const sube = ctx.sube;
      const egitimYili = (cacheAgg && cacheAgg.okul.egitimYili) || egitimYiliHint;
      const ad = (cacheAgg && cacheAgg.ogretmen.adSoyad) || profile.adSoyad || 'Öğretmen';
      const okulAdi = (cacheAgg && cacheAgg.okul.ad) || school.okulAdi || school.ad || 'Okul bilgisi girilmedi';
      const needsSetup = setupIncomplete(profile, school);

      let currentWeek = null;
      try {
        currentWeek = CalendarEngine.getCurrentWeek(cal, today);
      } catch (e) {
        console.warn(e);
      }

      const hours = (cacheAgg && cacheAgg.haftalikDersSaatleri)
        || (cal.haftalikDersSaati && cal.haftalikDersSaati[sinif])
        || FALLBACK_CAL.haftalikDersSaati['1'];
      const dersler = (cacheAgg && cacheAgg.dersProgrami && cacheAgg.dersProgrami.length)
        ? cacheAgg.dersProgrami
        : MiniBilgeHub.derslerForSinif(sinif);
      const motorFlow = MiniBilgeHub.MOTOR_FLOW || [];

      let wf = null;
      if (window.WorkflowEngine) {
        wf = await WorkflowEngine.bootstrap({
          cal,
          week: currentWeek,
          plans,
          documents: MiniBilgeStorage.getDocuments(),
          today
        });
      }

      const content = `
      <div class="dash">
        <header class="dash-hero dash-hero--os">
          <p class="brand-kicker">MiniBilge Öğretmen</p>
          <h1>${esc(ad)}</h1>
          <p class="dash-date">${esc(egitimYili)} Eğitim Öğretim Yılı · ${esc(okulAdi)}</p>

          ${needsSetup ? `
            <div class="setup-nudge">
              <span>İlk kurulum eksik — bir kez kaydedin; belgeler aynı veriden üretilir.</span>
              <a class="quick-btn primary compact" href="modules/hesabim.html">Kurulumu tamamla</a>
            </div>` : ''}

          <p class="grade-prompt">Sınıfını Seç</p>
          <p class="section-lead" style="margin-top:4px;margin-bottom:0;">TXS — bağlam seçilir; sistem yönlendirir. Belge menüsü değil, bugünkü iş.</p>
          ${renderClassContext(siniflar, sinif, sube)}

          <div class="hero-meta">
            <span class="hero-chip">${esc(ctx.label)} aktif</span>
            ${currentWeek ? `<span class="hero-chip warm">Hafta ${currentWeek.hafta}</span>` : ''}
            ${wf && wf.stage ? `<span class="hero-chip sky">${esc(wf.stage.ad)}</span>` : ''}
            <span class="hero-chip">${gunAdi}, ${fmtToday(today)}</span>
          </div>
        </header>

        ${renderWorkflowBoard(wf)}

        <section class="mb-section">
          <h2>${esc(ctx.label)} Dersleri</h2>
          <p class="section-lead">Seçilen sınıf/şube için TTKB dersleri otomatik yüklendi.</p>
          <div class="lesson-strip">
            ${dersler.map(d => {
              const saat = hours[d.id];
              const meta = saat != null ? `${saat} saat / hafta` : 'Program dersi';
              return `
              <div class="lesson-row">
                <div>
                  <div class="lesson-name">${esc(d.ad)}</div>
                  <div class="lesson-meta">${esc(meta)} · ${esc(ctx.label)}</div>
                </div>
                <div class="quick-actions" style="gap:0.35rem;">
                  <a class="quick-btn compact" href="${withSinif(`modules/gunluk-kazanimlar.html?ders=${encodeURIComponent(d.id)}`, sinif, sube)}">Kazanımlar</a>
                  <a class="quick-btn primary compact" href="${withSinif(`modules/ders-yurutme.html?ders=${encodeURIComponent(d.id)}`, sinif, sube)}">Dersi Başlat</a>
                  <a class="quick-btn compact" href="${withSinif(`modules/gunluk-plan.html?ders=${encodeURIComponent(d.id)}`, sinif, sube)}">Plan</a>
                </div>
              </div>`;
            }).join('')}
          </div>
        </section>

        <section class="mb-section hub-section">
          <h2>Ana Modüller</h2>
          <p class="section-lead">Derin rotalar — birincil yönlendirme Workflow görevleridir.</p>
          <div class="data-pipeline motor-flow" aria-label="Motor akışı">
            <span class="pipeline-step">İş</span>
            <span class="pipeline-arrow">→</span>
            ${motorFlow.map((step, i) =>
              `<span class="pipeline-step">${esc(step)}</span>${i < motorFlow.length - 1 ? '<span class="pipeline-arrow" aria-hidden="true">→</span>' : ''}`
            ).join('')}
          </div>
          <div class="hub-grid hub-grid--eight">
            ${MiniBilgeHub.HUB.map(cat => renderHubCategory(cat, sinif, sube)).join('')}
          </div>
        </section>
      </div>`;

      mount(MiniBilgeNav.renderLayout('home', content));
      bindClassContext();
      if (window.MiniBilgeProgress) {
        const host = document.getElementById('ds-progress-host');
        if (host) MiniBilgeProgress.mount(host);
      }
    } catch (err) {
      console.error(err);
      showBootError(err);
    }
  }

  function renderWorkflowBoard(wf) {
    const T = window.MiniBilgeTxs;
    if (!wf) {
      const empty = T && T.EmptyState
        ? T.EmptyState({
            title: 'Bugün buradan başlayın',
            message: 'Örnek görevler ve yardım hazır. Workflow Engine bağlandığında işler otomatik gelir.',
            hint: 'TXS-007 Never Empty · TXS-008 Action Dashboard',
            actions: [
              { label: 'Dersi Başlat', href: 'modules/ders-yurutme.html', primary: true },
              { label: 'Yıllık Plan', href: 'modules/yillik-plan.html' }
            ]
          }).html
        : '<p class="section-lead">Workflow Engine yüklenemedi.</p>';
      return `<section class="mb-section"><h2>Bugün</h2>${empty}</section>`;
    }
    const tasks = (wf.tasks || []).slice(0, 7);
    const overdue = (wf.deadlines && wf.deadlines.overdue) || [];
    const soon = (wf.deadlines && wf.deadlines.soon) || [];
    const suggestions = wf.suggestions || [];
    const progress = wf.progress || { overall: 0, modules: [] };
    const confOneri = T && T.AiConfidence ? T.AiConfidence({ level: 'oneri' }).html : '';
    const confTaslak = T && T.AiConfidence ? T.AiConfidence({ level: 'taslak' }).html : '';

    const taskBlock = tasks.length
      ? `<div class="task-list">
          ${tasks.map(t => `
            <div class="task-row">
              <span class="task-check${t.done ? ' done' : ''}">${t.done ? '✓' : ''}</span>
              <span class="task-text${t.done ? ' done' : ''}">${esc(t.text)}</span>
              <a class="quick-btn primary compact" href="${t.href}">Yap</a>
            </div>`).join('')}
        </div>`
      : (T && T.EmptyState
        ? T.EmptyState({
            title: 'Bugün için önerilen işler',
            message: 'Örnek akış: günlük plan → yoklama → ders yürütme → veli / rehberlik.',
            hint: 'TXS-007 · örnek görevlerle başlayın',
            actions: [
              { label: 'Günlük Plan', href: 'modules/gunluk-plan.html', primary: true },
              { label: 'Dersi Başlat', href: 'modules/ders-yurutme.html' }
            ]
          }).html
        : '');

    const advancedBody = `
      <div class="wf-progress-head">
        <div class="wf-progress-label">İş akışı ilerlemesi</div>
        <div class="wf-progress-bar" aria-valuenow="${progress.overall}" aria-valuemin="0" aria-valuemax="100">
          <span style="width:${progress.overall}%"></span>
        </div>
        <strong>${progress.overall}% tamam · ${100 - (progress.overall || 0)}% kaldı</strong>
      </div>
      <div class="wf-module-progress">
        ${(progress.modules || []).slice(0, 8).map(m => `
          <div class="wf-mod">
            <span>${esc(m.ad)}</span>
            <div class="wf-progress-bar slim"><span style="width:${m.percent}%"></span></div>
            <em>${m.percent}% · kaldı ${100 - (m.percent || 0)}%</em>
          </div>`).join('')}
      </div>
      <div id="ds-progress-host" style="margin-top:12px;"></div>`;

    const advanced = T && T.AdvancedPanel
      ? T.AdvancedPanel({ id: 'wf-advanced', bodyHtml: advancedBody }).html
      : advancedBody;

    return `
      <section class="mb-section wf-board">
        <h2>Bugün</h2>
        <p class="section-lead">${esc(wf.stage.ad)} · TXS-008 iş yaptırır — belgeyi workflow üretir.</p>

        ${overdue.length || soon.length ? `
          <div class="wf-deadlines">
            ${overdue.map(d => `<span class="wf-pill overdue">Geciken: ${esc(d.text)}</span>`).join('')}
            ${soon.map(d => `<span class="wf-pill soon">Yaklaşan: ${esc(d.text)}</span>`).join('')}
          </div>` : ''}

        ${taskBlock}

        ${suggestions.length ? `
          <h3 class="wf-subhead">Sonraki adım önerileri ${confOneri}</h3>
          <div class="wf-suggestions">
            ${suggestions.map(s => `
              <a class="wf-suggest" href="${s.href}">
                <strong>${esc(s.docHint || 'İş')} ${confTaslak}</strong>
                <span>${esc(s.text)}</span>
              </a>`).join('')}
          </div>` : ''}

        ${advanced}
      </section>`;
  }

  function renderClassContext(siniflar, activeSinif, activeSube) {
    if (window.MiniBilgeComponents && MiniBilgeComponents.ClassContext) {
      return MiniBilgeComponents.ClassContext({
        classes: siniflar,
        activeSinif,
        activeSube
      }).html;
    }
    return `
      <div class="grade-tabs mbc-class-context" role="tablist" aria-label="Sınıfını seç">
        ${siniflar.map(c => {
          const on = c.sinif === activeSinif && c.sube === activeSube;
          return `<button type="button" class="grade-tab${on ? ' active' : ''}" data-sinif="${esc(c.sinif)}" data-sube="${esc(c.sube)}">${esc(c.label)}</button>`;
        }).join('')}
      </div>`;
  }

  function bindClassContext() {
    const root = document.querySelector('.mbc-class-context, .grade-tabs');
    if (!root) return;
    root.querySelectorAll('[data-sinif]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const s = btn.getAttribute('data-sinif');
        const sub = btn.getAttribute('data-sube') || 'A';
        if (window.ContextCacheService) {
          await ContextCacheService.switchClass(s, sub);
        } else {
          MiniBilgeStorage.setClassContext(s, sub);
        }
        if (window.MiniBilgeComponents && MiniBilgeComponents.notify) {
          MiniBilgeComponents.notify.success(`${s}/${sub} — Context Cache yenilendi`);
        }
        initDashboard();
      });
    });
  }

  function renderHubCategory(cat, sinif, sube) {
    return `
      <article class="hub-block hub-block--module" data-hub="${esc(cat.id)}">
        <header class="hub-block-head">
          <h3>${esc(cat.ad)}</h3>
          <p>${esc(cat.lead || '')}</p>
        </header>
        <ul class="hub-links">
          ${(cat.items || []).map(item => {
            if (item.yakinda) {
              return `<li><span class="hub-link soon">${esc(item.ad)}<em>yakında</em></span></li>`;
            }
            const href = withSinif(item.href, sinif, sube);
            const motor = item.motor ? `<span class="hub-motor">${esc(item.motor)}</span>` : '';
            return `<li><a class="hub-link" href="${esc(href)}"><span>${esc(item.ad)}</span>${motor}</a></li>`;
          }).join('')}
        </ul>
      </article>`;
  }

  function esc(s) {
    return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;') : '';
  }
  function fmtToday(d) {
    const m = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDashboard);
  else initDashboard();
})();
