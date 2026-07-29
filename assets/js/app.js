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
    /* TTKB 09.05.2025 İlkokul haftalık ders çizelgesi — her sınıf 30 saat */
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
        <section class="mb-section">
          <div class="quick-actions">
            <a href="modules/yillik-plan.html" class="quick-btn primary">Yıllık Planlar</a>
            <a href="modules/gunluk-plan.html" class="quick-btn primary">Günlük Planlar</a>
            <a href="documents/index.html" class="quick-btn">Evrak Merkezi</a>
          </div>
        </section>
      </div>`;
    mount(window.MiniBilgeNav ? MiniBilgeNav.renderLayout('home', body) : body);
  }

  function withSinif(href, sinif) {
    if (!href || href === '#' || /yakinda/i.test(href)) return href;
    const sep = href.includes('?') ? '&' : '?';
    if (/[?&]sinif=/.test(href)) return href.replace(/([?&]sinif=)[^&]*/, `$1${encodeURIComponent(sinif)}`);
    return `${href}${sep}sinif=${encodeURIComponent(sinif)}`;
  }

  /** MB-UI-002 — Sınıf odaklı ana ekran */
  async function initDashboard() {
    try {
      if (!window.MiniBilgeNav || !window.MiniBilgeStorage) {
        throw new Error('Gerekli betikler yüklenemedi.');
      }
      if (!window.MiniBilgeHub) {
        throw new Error('Hub yapılandırması yüklenemedi (hub-config.js).');
      }

      const profile = MiniBilgeStorage.getProfile();
      const school = MiniBilgeStorage.getSchool();
      const plans = MiniBilgeStorage.getPlans();
      const settings = MiniBilgeStorage.getSettings();
      const egitimYili = school.egitimYili || '2025-2026';
      const sinif = String(settings.varsayilanSinif || '1');
      const today = new Date();
      const gunAdi = GUNLER[today.getDay()];
      const ad = profile.adSoyad ? profile.adSoyad : 'Öğretmen';

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

      const content = `
      <div class="dash">
        <header class="dash-hero">
          <p class="brand-kicker">MiniBilge Öğretmen</p>
          <h1>Merhaba ${esc(ad)}</h1>
          <p class="dash-date">Önce sınıfı seçin — platform o sınıfa göre yeniden yapılanır.</p>
          ${renderGradeTabs(sinif)}
          <div class="hero-meta">
            <span class="hero-chip">${esc(sinif)}. Sınıf aktif</span>
            <span class="hero-chip sky">${esc(egitimYili)}</span>
            ${currentWeek ? `<span class="hero-chip warm">Hafta ${currentWeek.hafta}</span>` : ''}
            <span class="hero-chip">${gunAdi}, ${fmtToday(today)}</span>
          </div>
        </header>

        <section class="mb-section">
          <h2>${esc(sinif)}. Sınıf Dersleri</h2>
          <p class="section-lead">TTKB / TYMM program dersleri — belge seçmeden önce sınıf bağlamı sabitlendi.</p>
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
          <p class="section-lead">Her modül kendi motorunu açar; yalnızca gerekli alanları sorar.</p>
          <div class="hub-grid">
            ${MiniBilgeHub.HUB.map(cat => renderHubCategory(cat, sinif)).join('')}
          </div>
        </section>

        <section class="mb-section">
          <h2>Bugün İçin</h2>
          <p class="section-lead">Seçili sınıf bağlamında kısa hatırlatmalar.</p>
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
    return `
      <div class="grade-tabs" role="tablist" aria-label="Sınıf seçici">
        ${SINIFLAR.map(s => `
          <button type="button"
            class="grade-tab${s === active ? ' active' : ''}"
            role="tab"
            aria-selected="${s === active ? 'true' : 'false'}"
            data-sinif="${s}">
            ${s}. Sınıf
          </button>`).join('')}
      </div>`;
  }

  function bindGradeTabs() {
    document.querySelectorAll('.grade-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-sinif');
        if (!next) return;
        MiniBilgeStorage.saveSettings({ varsayilanSinif: next });
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
              return `<li><span class="hub-link soon" title="Yakında">${esc(item.ad)}<em>yakında</em></span></li>`;
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
      { done: hasYillik, text: `${sinif}. sınıf yıllık planı kontrol et`, href: withSinif('modules/yillik-plan.html', sinif) },
      { done: false, text: `Hafta ${week?.hafta || '—'} günlük planları hazırla`, href: withSinif('modules/gunluk-plan.html', sinif) },
      { done: false, text: 'Sınıf defteri — günlük kazanımlar', href: withSinif('modules/gunluk-kazanimlar.html', sinif) },
      { done: false, text: 'Öğretim programını gözden geçir', href: withSinif('modules/ogretim-programi.html', sinif) },
      { done: false, text: 'Evrak Merkezi', href: withSinif('documents/index.html', sinif) }
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
