(function () {
  'use strict';

  const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  async function initDashboard() {
    const profile = MiniBilgeStorage.getProfile();
    const school = MiniBilgeStorage.getSchool();
    const plans = MiniBilgeStorage.getPlans();
    const docs = MiniBilgeStorage.getDocuments();
    const cal = await CalendarEngine.loadCalendar();
    const today = new Date();
    const currentWeek = CalendarEngine.getCurrentWeek(cal, today);
    const upcoming = CalendarEngine.getUpcomingEvents(cal, today, 5);
    const gunAdi = GUNLER[today.getDay()];

    const content = `
      <div class="dashboard-header">
        <h1>Merhaba${profile.adSoyad ? ', ' + esc(profile.adSoyad) : ''} 👋</h1>
        <p>${gunAdi}, ${fmtToday(today)} · ${school.egitimYili || cal.egitimYili} · Hafta ${currentWeek?.hafta || '—'}</p>
        <input type="search" class="search-global" id="globalSearch" placeholder="Plan, belge veya modül ara...">
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card" style="grid-column: 1 / -1;">
          <h3>Hızlı İşlemler</h3>
          <div class="quick-actions">
            <a href="modules/yillik-plan.html" class="quick-btn primary">📆 Yıllık Plan Oluştur</a>
            <a href="modules/gunluk-plan.html" class="quick-btn primary">📖 Günlük Plan Oluştur</a>
            <a href="documents/index.html" class="quick-btn">📁 Belge Merkezi</a>
            <a href="modules/belirli-gun.html" class="quick-btn">🎉 Belirli Günler</a>
            <a href="modules/hesabim.html" class="quick-btn">👤 Profilim</a>
          </div>
        </div>

        <div class="dashboard-card">
          <h3>Bugünkü Ders Programı</h3>
          ${renderTodaySchedule(school, cal)}
        </div>

        <div class="dashboard-card">
          <h3>Bugünkü Günlük Plan</h3>
          ${renderTodayPlan(plans, currentWeek)}
        </div>

        <div class="dashboard-card">
          <h3>Yaklaşan Belirli Gün ve Haftalar</h3>
          ${upcoming.length ? upcoming.map(e => `
            <div class="list-item">
              <span>${esc(e.ad)}</span>
              <span class="meta">${esc(e.tarih)}</span>
            </div>`).join('') : '<p class="empty-state">Yaklaşan etkinlik yok.</p>'}
        </div>

        <div class="dashboard-card">
          <h3>Son Oluşturulan Planlar</h3>
          ${plans.length ? plans.slice(0, 5).map(p => `
            <div class="list-item">
              <span>${p.tur === 'yillik' ? '📆' : '📖'} ${esc(p.ders || p.title)} — ${esc(p.sinif)}. Sınıf</span>
              <span class="meta">${fmtRelative(p.createdAt)}</span>
            </div>`).join('') : '<p class="empty-state">Henüz plan oluşturulmadı. <a href="modules/yillik-plan.html" style="text-decoration:underline">Yıllık plan oluşturun</a>.</p>'}
        </div>

        <div class="dashboard-card">
          <h3>Son İndirilen Belgeler</h3>
          ${docs.length ? docs.slice(0, 5).map(d => `
            <div class="list-item">
              <span>📄 ${esc(d.title)}</span>
              <span class="meta">${fmtRelative(d.downloadedAt)}</span>
            </div>`).join('') : '<p class="empty-state">Henüz belge indirilmedi.</p>'}
        </div>

        <div class="dashboard-card">
          <h3>Güncel Duyurular</h3>
          <div class="announcement">🌱 <strong>1. Sınıf Türkçe</strong> yıllık plan motoru aktif — TYMM uyumlu otomatik plan üretimi.</div>
          <div class="announcement">📅 <strong>2025-2026</strong> MEB çalışma takvimi entegre edildi.</div>
          <div class="announcement">📁 <strong>31 belge şablonu</strong> Okul Evrakları modülünde kullanıma hazır.</div>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = MiniBilgeNav.renderLayout('home', content);

    document.getElementById('globalSearch')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = e.target.value.toLowerCase().trim();
        if (!q) return;
        const routes = {
          'yıllık': 'modules/yillik-plan.html',
          'yillik': 'modules/yillik-plan.html',
          'günlük': 'modules/gunluk-plan.html',
          'gunluk': 'modules/gunluk-plan.html',
          'belge': 'documents/index.html',
          'evrak': 'documents/index.html',
          'veli': 'documents/index.html',
          'sınav': 'documents/index.html',
          'profil': 'modules/hesabim.html',
          'hesap': 'modules/hesabim.html',
          'ayar': 'modules/ayarlar.html',
          'kulüp': 'modules/kulup.html',
          'zümre': 'modules/zumre.html',
          'rehberlik': 'modules/rehberlik.html'
        };
        for (const [key, href] of Object.entries(routes)) {
          if (q.includes(key)) { window.location.href = href; return; }
        }
        window.location.href = 'documents/index.html?q=' + encodeURIComponent(q);
      }
    });
  }

  function renderTodaySchedule(school, cal) {
    const sinif = MiniBilgeStorage.getSettings().varsayilanSinif || '1';
    const hours = CalendarEngine.getWeeklyHours(cal, sinif);
    const entries = Object.entries(hours);
    if (!entries.length) return '<p class="empty-state">Ders programı tanımlı değil.</p>';
    return entries.map(([id, saat]) => `
      <div class="list-item">
        <span>${dersAdi(id)}</span>
        <span class="meta">${saat} saat/hafta</span>
      </div>`).join('');
  }

  function renderTodayPlan(plans, week) {
    const latest = plans.find(p => p.tur === 'yillik');
    if (!latest) {
      return '<p class="empty-state">Önce yıllık plan oluşturun, ardından günlük plan üretilebilir.</p>';
    }
    return `
      <div class="list-item">
        <span>Hafta ${week?.hafta || '—'} · ${esc(latest.ders)}</span>
        <a href="modules/gunluk-plan.html" class="quick-btn" style="padding:6px 10px;font-size:0.75rem;">Oluştur</a>
      </div>
      <p class="empty-state" style="text-align:left;margin-top:8px;">Yıllık plandan otomatik günlük plan üretilir.</p>`;
  }

  function dersAdi(id) {
    const map = { turkce: 'Türkçe', matematik: 'Matematik', hayatBilgisi: 'Hayat Bilgisi', fen: 'Fen', sosyal: 'Sosyal', gorselSanatlar: 'Görsel Sanatlar', muzik: 'Müzik', bedenEgitimi: 'Beden Eğitimi', ingilizce: 'İngilizce', rehberlik: 'Rehberlik' };
    return map[id] || id;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  }

  function fmtToday(d) {
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function fmtRelative(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    return new Date(iso).toLocaleDateString('tr-TR');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
