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
      const ctx = MiniBilgeStorage.getClassContext();
      const siniflar = MiniBilgeStorage.getSiniflar();
      const sinif = ctx.sinif;
      const sube = ctx.sube;
      const egitimYili = school.egitimYili || '2025-2026';
      const today = new Date();
      const gunAdi = GUNLER[today.getDay()];
      const ad = profile.adSoyad || 'Öğretmen';
      const okulAdi = school.okulAdi || school.ad || 'Okul bilgisi girilmedi';
      const needsSetup = setupIncomplete(profile, school);

      let cal = FALLBACK_CAL;
      try {
        if (window.CalendarEngine) {
          CalendarEngine.setYear(egitimYili);
          const loaded = await CalendarEngine.loadCalendar();
          if (loaded && loaded.haftalikDersSaati) cal = loaded;
        }
      } catch (e) {
        console.warn(e);
      }

      let currentWeek = null;
      try {
        currentWeek = CalendarEngine.getCurrentWeek(cal, today);
      } catch (e) {
        console.warn(e);
      }

      const hours = (cal.haftalikDersSaati && cal.haftalikDersSaati[sinif]) || FALLBACK_CAL.haftalikDersSaati['1'];
      const dersler = MiniBilgeHub.derslerForSinif(sinif);
      const hasYillik = (plans || []).some(p => p.tur === 'yillik' && String(p.sinif) === sinif);
      const motorFlow = MiniBilgeHub.MOTOR_FLOW || [];

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
          <p class="section-lead" style="margin-top:4px;margin-bottom:0;">Belge aramayın — işi seçin. Belge kendiliğinden oluşur.</p>
          ${renderClassContext(siniflar, sinif, sube)}

          <div class="hero-meta">
            <span class="hero-chip">${esc(ctx.label)} aktif — bağlam yüklendi</span>
            ${currentWeek ? `<span class="hero-chip warm">Hafta ${currentWeek.hafta}</span>` : ''}
            <span class="hero-chip sky">${gunAdi}, ${fmtToday(today)}</span>
          </div>

          <div class="context-loaded" aria-label="Otomatik yüklenen bağlam">
            <span>Ders çizelgesi</span>
            <span>Öğretim programı</span>
            <span>Takvim</span>
            <span>Okul / öğretmen</span>
            <span>Ders saatleri</span>
          </div>
        </header>

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
                  <a class="quick-btn primary compact" href="${withSinif(`modules/gunluk-plan.html?ders=${encodeURIComponent(d.id)}`, sinif, sube)}">Günlük Plan</a>
                </div>
              </div>`;
            }).join('')}
          </div>
        </section>

        <section class="mb-section hub-section">
          <h2>Ana Modüller</h2>
          <p class="section-lead">Sekiz iş alanı — her madde bir motor zinciri başlatır.</p>
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

        <section class="mb-section">
          <h2>Bugün — ${esc(ctx.label)}</h2>
          <p class="section-lead">Aynı merkezî veriden devam eden işler.</p>
          <div class="task-list">
            ${renderTweTasks(hasYillik, currentWeek, sinif, sube)}
          </div>
        </section>
      </div>`;

      mount(MiniBilgeNav.renderLayout('home', content));
      bindClassContext();
    } catch (err) {
      console.error(err);
      showBootError(err);
    }
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
      btn.addEventListener('click', () => {
        const s = btn.getAttribute('data-sinif');
        const sub = btn.getAttribute('data-sube') || 'A';
        MiniBilgeStorage.setClassContext(s, sub);
        if (window.MiniBilgeComponents && MiniBilgeComponents.notify) {
          MiniBilgeComponents.notify.success(`${s}/${sub} — sistem yeniden yapılandı`);
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

  function renderTweTasks(hasYillik, week, sinif, sube) {
    const tasks = [
      { done: hasYillik, text: `${sinif}/${sube} yıllık planı`, href: withSinif('modules/yillik-plan.html', sinif, sube) },
      { done: false, text: `Hafta ${week?.hafta || '—'} günlük plan`, href: withSinif('modules/gunluk-plan.html', sinif, sube) },
      { done: false, text: 'Sınıf yönetimi — yoklama / öğrenciler', href: withSinif('documents/olustur.html?id=sinif-listesi', sinif, sube) },
      { done: false, text: 'Resmî evraklar', href: withSinif('documents/index.html', sinif, sube) },
      { done: false, text: 'AI ile iş başlat', href: withSinif('modules/ai.html', sinif, sube) }
    ];
    return tasks.map(t => `
      <div class="task-row">
        <span class="task-check${t.done ? ' done' : ''}">${t.done ? '✓' : ''}</span>
        <span class="task-text${t.done ? ' done' : ''}">${esc(t.text)}</span>
        <a class="text-link" href="${t.href}">Aç</a>
      </div>`).join('');
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
