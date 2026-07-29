(function () {
  'use strict';

  const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  /** Takvim yüklenemezse bile ana ekran görünsün */
  const FALLBACK_CAL = {
    egitimYili: '2025-2026',
    donemler: [
      { ad: '1. Dönem', baslangic: '2025-09-08', bitis: '2026-01-16' },
      { ad: '2. Dönem', baslangic: '2026-02-02', bitis: '2026-06-19' }
    ],
    tatiller: [],
    belirliGunler: [],
    haftalikDersSaati: {
      '1': { turkce: 10, matematik: 5, hayatBilgisi: 4, gorselSanatlar: 2, muzik: 2, bedenEgitimi: 2, rehberlik: 1 },
      '2': { turkce: 10, matematik: 5, hayatBilgisi: 4, gorselSanatlar: 2, muzik: 2, bedenEgitimi: 2, ingilizce: 2, rehberlik: 1 },
      '3': { turkce: 8, matematik: 5, fen: 3, hayatBilgisi: 3, gorselSanatlar: 2, muzik: 2, bedenEgitimi: 2, ingilizce: 2, rehberlik: 1 },
      '4': { turkce: 8, matematik: 5, fen: 3, sosyal: 3, gorselSanatlar: 2, muzik: 2, bedenEgitimi: 2, ingilizce: 2, rehberlik: 1 }
    }
  };

  function mount(html) {
    const root = document.getElementById('app');
    if (!root) return;
    root.innerHTML = html;
  }

  function showBootError(err) {
    const msg = (err && err.message) ? err.message : String(err || 'Bilinmeyen hata');
    const body = `
      <div class="dashboard-header">
        <p class="brand-kicker">MiniBilge Öğretmen</p>
        <h1>Ana Sayfa yüklenemedi</h1>
        <p>${esc(msg)}</p>
      </div>
      <section class="dashboard-card">
        <h3>Hızlı İşlemler</h3>
        <div class="quick-actions">
          <a href="modules/yillik-plan.html" class="quick-btn primary">Yıllık Plan</a>
          <a href="modules/gunluk-plan.html" class="quick-btn primary">Günlük Plan</a>
          <a href="documents/index.html" class="quick-btn">Evrak Merkezi</a>
          <a href="modules/hesabim.html" class="quick-btn">Hesabım</a>
        </div>
      </section>`;
    if (window.MiniBilgeNav) mount(MiniBilgeNav.renderLayout('home', body));
    else mount(`<main class="main-content">${body}</main>`);
  }

  /** MB-ARCH-001 Ana Sayfa — 7 bileşen */
  async function initDashboard() {
    try {
      if (!window.MiniBilgeNav || !window.MiniBilgeStorage) {
        throw new Error('Gerekli betikler yüklenemedi (navigation/storage).');
      }

      const profile = MiniBilgeStorage.getProfile();
      const school = MiniBilgeStorage.getSchool();
      const plans = MiniBilgeStorage.getPlans();
      const docs = MiniBilgeStorage.getDocuments();
      const settings = MiniBilgeStorage.getSettings();
      const egitimYili = school.egitimYili || '2025-2026';
      const sinif = settings.varsayilanSinif || '1';
      const today = new Date();
      const gunAdi = GUNLER[today.getDay()];

      let cal = FALLBACK_CAL;
      let calWarning = '';
      try {
        if (window.CalendarEngine) {
          CalendarEngine.setYear(egitimYili);
          cal = await CalendarEngine.loadCalendar();
          if (!cal || !cal.haftalikDersSaati) {
            cal = FALLBACK_CAL;
            calWarning = 'Takvim verisi eksik; varsayılan ders saatleri kullanılıyor.';
          }
        } else {
          calWarning = 'Takvim motoru yüklenemedi; varsayılan veri kullanılıyor.';
        }
      } catch (calErr) {
        console.warn('Takvim yükleme hatası:', calErr);
        cal = FALLBACK_CAL;
        calWarning = 'Takvim dosyası okunamadı; varsayılan veri ile devam ediliyor.';
      }

      let currentWeek = null;
      let upcoming = [];
      try {
        currentWeek = CalendarEngine.getCurrentWeek(cal, today);
        upcoming = CalendarEngine.getUpcomingEvents(cal, new Date(today), 6);
      } catch (e) {
        console.warn('Takvim hesaplama hatası:', e);
      }

      const content = `
      <div class="dashboard-header">
        <p class="brand-kicker">MiniBilge Öğretmen</p>
        <h1>Merhaba${profile.adSoyad ? ', ' + esc(profile.adSoyad) : ''}</h1>
        <p>${gunAdi}, ${fmtToday(today)} · ${esc(egitimYili)} · Hafta ${currentWeek?.hafta || '—'} · ${esc(sinif)}. Sınıf</p>
        ${calWarning ? `<p class="meta" style="margin-top:8px">${esc(calWarning)}</p>` : ''}
      </div>

      <div class="dashboard-grid home-arch">
        <section class="dashboard-card" data-block="bugunku-dersler">
          <h3>1. Bugünkü Dersler</h3>
          ${renderTodaySchedule(cal, sinif)}
        </section>

        <section class="dashboard-card" data-block="bugunku-gorevler">
          <h3>2. Bugünkü Görevler</h3>
          ${renderTasks(plans, currentWeek)}
        </section>

        <section class="dashboard-card" data-block="yaklasan">
          <h3>3. Yaklaşan Tarihler</h3>
          ${upcoming.length ? upcoming.map(e => `
            <div class="list-item"><span>${esc(e.ad)}</span><span class="meta">${esc(e.tarih || e.baslangic || '')}</span></div>
          `).join('') : '<p class="empty-state">Yaklaşan kayıt yok.</p>'}
          <p style="margin-top:8px"><a href="modules/takvim.html" class="text-link">Takvimi aç</a></p>
        </section>

        <section class="dashboard-card" data-block="son-calismalar">
          <h3>4. Son Çalışmalar</h3>
          ${renderRecentWork(plans, docs)}
        </section>

        <section class="dashboard-card" data-block="hizli" style="grid-column: 1 / -1;">
          <h3>5. Hızlı İşlemler</h3>
          <div class="quick-actions">
            <a href="modules/gunluk-plan.html" class="quick-btn primary">Yeni Günlük Plan</a>
            <a href="modules/yillik-plan.html" class="quick-btn primary">Yeni Yıllık Plan</a>
            <a href="documents/olustur.html" class="quick-btn">Yeni Evrak</a>
            <a href="documents/index.html" class="quick-btn">Belgelerim</a>
          </div>
        </section>

        <section class="dashboard-card" data-block="uyarilar">
          <h3>6. Akıllı Uyarılar</h3>
          ${renderAlerts(plans, sinif)}
        </section>

        <section class="dashboard-card" data-block="ai">
          <h3>7. Yapay Zekâ Asistanı</h3>
          <p class="meta">Motorlar (MB-TPM / MB-YPM) hazır olunca doğal dil komutları burada çalışacak.</p>
          <form id="aiStubForm" class="ai-stub">
            <input type="text" id="aiPrompt" placeholder="1. sınıf matematik günlük plan oluştur" autocomplete="off">
            <button type="submit" class="quick-btn">Gönder</button>
          </form>
          <p id="aiStubMsg" class="empty-state" style="text-align:left;margin-top:8px;"></p>
        </section>
      </div>`;

      mount(MiniBilgeNav.renderLayout('home', content));

      document.getElementById('aiStubForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = document.getElementById('aiPrompt').value.trim();
        const msg = document.getElementById('aiStubMsg');
        if (!q) return;
        msg.textContent = 'Asistan henüz MB-AI katmanına bağlı değil. İlgili modüle yönlendiriliyorsunuz.';
        if (/günlük|gunluk/i.test(q)) setTimeout(() => { location.href = 'modules/gunluk-plan.html'; }, 700);
        else if (/yıllık|yillik/i.test(q)) setTimeout(() => { location.href = 'modules/yillik-plan.html'; }, 700);
        else if (/evrak|belge|zümre|zumre/i.test(q)) setTimeout(() => { location.href = 'documents/index.html'; }, 700);
      });
    } catch (err) {
      console.error('Ana sayfa hatası:', err);
      showBootError(err);
    }
  }

  function renderTodaySchedule(cal, sinif) {
    const hours = (cal && cal.haftalikDersSaati && cal.haftalikDersSaati[String(sinif)]) || FALLBACK_CAL.haftalikDersSaati['1'];
    const entries = Object.entries(hours);
    if (!entries.length) return '<p class="empty-state">Ders programı Hesabım’da tanımlanacak.</p>';
    return entries.map(([id]) => `
      <div class="list-item">
        <span>${dersAdi(id)}</span>
        <a href="modules/gunluk-plan.html?ders=${encodeURIComponent(id)}" class="quick-btn compact">Günlük Planı Aç</a>
      </div>`).join('');
  }

  function renderTasks(plans, week) {
    const list = Array.isArray(plans) ? plans : [];
    const hasYillik = list.some(p => p.tur === 'yillik');
    const items = [
      { ok: hasYillik, text: hasYillik ? 'Yıllık plan mevcut' : 'Yıllık plan oluştur', href: 'modules/yillik-plan.html' },
      { ok: false, text: `Hafta ${week?.hafta || '—'} günlük planı hazırla`, href: 'modules/gunluk-plan.html' },
      { ok: false, text: 'Yaklaşan belirli gün hazırlığı', href: 'modules/belirli-gun.html' },
      { ok: false, text: 'Evrak Merkezi’ni gözden geçir', href: 'documents/index.html' }
    ];
    return items.map(i => `
      <div class="list-item">
        <span>${i.ok ? '✓' : '○'} ${i.text}</span>
        <a href="${i.href}" class="text-link">Aç</a>
      </div>`).join('');
  }

  function renderRecentWork(plans, docs) {
    const rows = [];
    (plans || []).slice(0, 4).forEach(p => {
      rows.push(`<div class="list-item">
        <span>${p.tur === 'yillik' ? 'Yıllık' : 'Günlük'} · ${esc(p.ders || p.title)} · ${esc(String(p.sinif))}. sınıf</span>
        <span class="meta">${fmtRelative(p.createdAt)}</span>
      </div>`);
    });
    (docs || []).slice(0, 2).forEach(d => {
      rows.push(`<div class="list-item"><span>Evrak · ${esc(d.title)}</span><span class="meta">${fmtRelative(d.downloadedAt)}</span></div>`);
    });
    if (!rows.length) {
      return '<p class="empty-state">Henüz çalışma yok. <a href="modules/yillik-plan.html" class="text-link">Yıllık plan ile başlayın</a>.</p>';
    }
    return rows.join('');
  }

  function renderAlerts(plans, sinif) {
    const alerts = [];
    if (!(plans || []).some(p => p.tur === 'yillik')) {
      alerts.push(`${sinif}. sınıf için yıllık plan henüz üretilmedi.`);
    }
    alerts.push('Öğretim Programı ekranı domain modeline (MB-DM) bağlanacak.');
    alerts.push('Program veya takvim değişince ilgili planlar yenilenebilir (SSOT).');
    return alerts.map(a => `<div class="announcement">${esc(a)}</div>`).join('');
  }

  function dersAdi(id) {
    const map = {
      turkce: 'Türkçe', matematik: 'Matematik', hayatBilgisi: 'Hayat Bilgisi',
      fen: 'Fen Bilimleri', sosyal: 'Sosyal Bilgiler', gorselSanatlar: 'Görsel Sanatlar',
      muzik: 'Müzik', bedenEgitimi: 'Beden Eğitimi', ingilizce: 'İngilizce', rehberlik: 'Rehberlik'
    };
    return map[id] || id;
  }

  function esc(s) { return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') : ''; }
  function fmtToday(d) {
    const m = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  }
  function fmtRelative(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dk önce`;
    const h = Math.floor(mins / 60);
    return h < 24 ? `${h} saat önce` : new Date(iso).toLocaleDateString('tr-TR');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDashboard);
  else initDashboard();
})();
