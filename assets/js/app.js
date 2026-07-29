(function () {
  'use strict';

  const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const SINIFLAR = ['1', '2', '3', '4'];

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
    const body = `
      <div class="dash">
        <header class="dash-hero">
          <p class="brand-kicker">MiniBilge</p>
          <h1>Ana sayfa yüklenemedi</h1>
          <p class="dash-date">${esc(msg)}</p>
        </header>
      </div>`;
    mount(window.MiniBilgeNav ? MiniBilgeNav.renderLayout('home', body) : body);
  }

  function withSinif(href, sinif) {
    if (!href || href === '#' || /yakinda/i.test(href)) return href;
    const sep = href.includes('?') ? '&' : '?';
    if (/[?&]sinif=/.test(href)) return href.replace(/([?&]sinif=)[^&]*/, `$1${encodeURIComponent(sinif)}`);
    return `${href}${sep}sinif=${encodeURIComponent(sinif)}`;
  }

  function setupIncomplete(profile, school) {
    return !profile.adSoyad || !(school.okulAdi || school.ad) || !school.il;
  }

  /** MB-UI-003 / MD-026 — Sonraki nesil ana ekran */
  async function initDashboard() {
    try {
      if (!window.MiniBilgeNav || !window.MiniBilgeStorage || !window.MiniBilgeHub) {
        throw new Error('Gerekli betikler yüklenemedi.');
      }

      const profile = MiniBilgeStorage.getProfile();
      const school = MiniBilgeStorage.getSchool();
      const plans = MiniBilgeStorage.getPlans();
      const settings = MiniBilgeStorage.getSettings();
      const egitimYili = school.egitimYili || '2025-2026';
      const sinif = String(settings.varsayilanSinif || '1');
      const sube = settings.sube || 'A';
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
      const pipeline = MiniBilgeHub.PIPELINE || [];

      const content = `
      <div class="dash">
        <header class="dash-hero dash-hero--os">
          <p class="brand-kicker">MiniBilge Öğretmen</p>
          <h1>Eğitim İşletim Sistemi</h1>
          <p class="dash-date">Sınıfı seçin — menü değil, motorlar çalışır.</p>

          <div class="profile-strip" aria-label="Öğretmen bağlamı">
            <div class="profile-cell">
              <span class="profile-label">Öğretmen</span>
              <strong>${esc(ad)}</strong>
            </div>
            <div class="profile-cell">
              <span class="profile-label">Okul</span>
              <strong>${esc(okulAdi)}</strong>
            </div>
            <div class="profile-cell">
              <span class="profile-label">Eğitim Öğretim Yılı</span>
              <strong>${esc(egitimYili)}</strong>
            </div>
            <div class="profile-cell">
              <span class="profile-label">Aktif</span>
              <strong>${esc(sinif)}. Sınıf / ${esc(sube)}</strong>
            </div>
          </div>

          ${needsSetup ? `
            <div class="setup-nudge">
              <span>İlk kurulum eksik — okul ve öğretmen bilgisi bir kez kaydedilir, belgelerde tekrar sorulmaz.</span>
              <a class="quick-btn primary compact" href="modules/hesabim.html">Kurulumu tamamla</a>
            </div>` : ''}

          <p class="grade-prompt">Hangi sınıf için çalışıyorsunuz?</p>
          ${renderGradeTabs(sinif)}

          <div class="hero-meta">
            <span class="hero-chip">${esc(sinif)}. Sınıf aktif — sistem yeniden yapılandı</span>
            ${currentWeek ? `<span class="hero-chip warm">Hafta ${currentWeek.hafta}</span>` : ''}
            <span class="hero-chip sky">${gunAdi}, ${fmtToday(today)}</span>
          </div>
        </header>

        <section class="mb-section">
          <h2>${esc(sinif)}. Sınıf Dersleri</h2>
          <p class="section-lead">TTKB’ye göre otomatik yüklendi — belge seçmeden önce sınıf bağlamı sabit.</p>
          <div class="lesson-strip">
            ${dersler.map(d => {
              const saat = hours[d.id];
              const meta = saat != null ? `${saat} saat / hafta` : 'Program dersi';
              return `
              <div class="lesson-row">
                <div>
                  <div class="lesson-name">${esc(d.ad)}</div>
                  <div class="lesson-meta">${esc(meta)} · ${esc(sinif)}. sınıf</div>
                </div>
                <div class="quick-actions" style="gap:0.35rem;">
                  <a class="quick-btn compact" href="${withSinif(`modules/gunluk-kazanimlar.html?ders=${encodeURIComponent(d.id)}`, sinif)}">Kazanımlar</a>
                  <a class="quick-btn primary compact" href="${withSinif(`modules/gunluk-plan.html?ders=${encodeURIComponent(d.id)}`, sinif)}">Günlük Plan</a>
                </div>
              </div>`;
            }).join('')}
          </div>
        </section>

        <section class="mb-section hub-section">
          <h2>Çalışma Alanı</h2>
          <p class="section-lead">ÖğretmenEvrak sadeliği + MiniBilge motorları. Her madde bir motora açılır.</p>
          <div class="data-pipeline" aria-label="Veri hattı">
            ${pipeline.map((step, i) =>
              `<span class="pipeline-step">${esc(step)}</span>${i < pipeline.length - 1 ? '<span class="pipeline-arrow" aria-hidden="true">→</span>' : ''}`
            ).join('')}
          </div>
          <div class="hub-grid hub-grid--five">
            ${MiniBilgeHub.HUB.map(cat => renderHubCategory(cat, sinif)).join('')}
          </div>
        </section>

        <section class="mb-section">
          <h2>Bugün — ${esc(sinif)}. Sınıf</h2>
          <p class="section-lead">Aynı veri hattından devam eden kısa görevler.</p>
          <div class="task-list">
            ${renderTweTasks(hasYillik, currentWeek, sinif)}
          </div>
        </section>
      </div>`;

      mount(MiniBilgeNav.renderLayout('home', content));
      bindGradeTabs();
    } catch (err) {
      console.error(err);
      showBootError(err);
    }
  }

  function renderGradeTabs(active) {
    if (window.MiniBilgeComponents && MiniBilgeComponents.ClassTabs) {
      return MiniBilgeComponents.ClassTabs({ active: active }).html;
    }
    return `
      <div class="grade-tabs" role="tablist" aria-label="Sınıf seçici">
        ${SINIFLAR.map(s => `
          <button type="button" class="grade-tab${s === active ? ' active' : ''}" role="tab"
            aria-selected="${s === active ? 'true' : 'false'}" data-sinif="${s}">${s}. Sınıf</button>`).join('')}
      </div>`;
  }

  function bindGradeTabs() {
    const root = document.querySelector('.mbc-grade-tabs, .grade-tabs');
    if (!root) return;
    root.querySelectorAll('.mbc-grade-tab, .grade-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-sinif');
        if (!next) return;
        MiniBilgeStorage.saveSettings({ varsayilanSinif: next });
        if (window.MiniBilgeComponents && MiniBilgeComponents.notify) {
          MiniBilgeComponents.notify.success(next + '. sınıf — sistem yeniden yapılandı');
        }
        initDashboard();
      });
    });
  }

  function renderHubCategory(cat, sinif) {
    return `
      <article class="hub-block" data-hub="${esc(cat.id)}">
        <header class="hub-block-head">
          <h3>${esc(cat.ad)}</h3>
          <p>${esc(cat.lead || '')}</p>
        </header>
        <ul class="hub-links">
          ${(cat.items || []).map(item => {
            if (item.yakinda) {
              return `<li><span class="hub-link soon">${esc(item.ad)}<em>yakında</em></span></li>`;
            }
            const href = withSinif(item.href, sinif);
            const motor = item.motor ? `<span class="hub-motor">${esc(item.motor)}</span>` : '';
            return `<li><a class="hub-link" href="${esc(href)}"><span>${esc(item.ad)}</span>${motor}</a></li>`;
          }).join('')}
        </ul>
      </article>`;
  }

  function renderTweTasks(hasYillik, week, sinif) {
    const tasks = [
      { done: hasYillik, text: `${sinif}. sınıf yıllık planı (YPM motoru)`, href: withSinif('modules/yillik-plan.html', sinif) },
      { done: false, text: `Hafta ${week?.hafta || '—'} günlük plan (GPM)`, href: withSinif('modules/gunluk-plan.html', sinif) },
      { done: false, text: 'Günlük kazanımlar / sınıf defteri', href: withSinif('modules/gunluk-kazanimlar.html', sinif) },
      { done: false, text: 'Evraklar — tek merkez', href: withSinif('documents/index.html', sinif) },
      { done: false, text: 'AI ile plan / materyal iste', href: withSinif('modules/ai.html', sinif) }
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
