(function () {
  'use strict';

  const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  async function initDashboard() {
    const profile = MiniBilgeStorage.getProfile();
    const school = MiniBilgeStorage.getSchool();
    const plans = MiniBilgeStorage.getPlans();
    const docs = MiniBilgeStorage.getDocuments();
    const egitimYili = school.egitimYili || '2025-2026';
    CalendarEngine.setYear(egitimYili);
    const cal = await CalendarEngine.loadCalendar();
    const envanter = await loadEnvanter();
    const today = new Date();
    const currentWeek = CalendarEngine.getCurrentWeek(cal, today);
    const upcoming = CalendarEngine.getUpcomingEvents(cal, today, 5);
    const gunAdi = GUNLER[today.getDay()];
    const pct = envanter ? Math.round((envanter.ozet.aktif / envanter.ozet.toplam) * 100) : 0;

    const content = `
      <div class="dashboard-header">
        <h1>Merhaba${profile.adSoyad ? ', ' + esc(profile.adSoyad) : ''} 👋</h1>
        <p>${gunAdi}, ${fmtToday(today)} · ${egitimYili} · Hafta ${currentWeek?.hafta || '—'}</p>
        <p class="philosophy-quote">"Önce Güvenilir Bilgi Motoru, Sonra Akıllı Algoritma, En Son Arayüz."</p>
        <input type="search" class="search-global" id="globalSearch" placeholder="Plan, belge veya modül ara...">
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card" style="grid-column: 1 / -1;">
          <h3>Hızlı İşlemler — Sınıf → Ders → Bilgiler → Üret</h3>
          <div class="quick-actions">
            <a href="modules/yillik-plan.html" class="quick-btn primary">📆 Yıllık Plan</a>
            <a href="modules/gunluk-plan.html" class="quick-btn primary">📖 Günlük Plan</a>
            <a href="documents/index.html" class="quick-btn">📁 Okul Evrakları</a>
            <a href="modules/envanter.html" class="quick-btn">📋 Evrak Envanteri</a>
            <a href="modules/hesabim.html" class="quick-btn">👤 Profilim</a>
          </div>
        </div>

        <div class="dashboard-card">
          <h3>4 Ana Motor Durumu</h3>
          <div class="list-item"><span>📚 Öğretim Programı</span><span class="status-badge kismi">1. Sınıf 3 Ders</span></div>
          <div class="list-item"><span>📅 Takvim</span><span class="status-badge aktif">2025-26 / 2026-27</span></div>
          <div class="list-item"><span>🧠 Plan Motoru</span><span class="status-badge aktif">Aktif</span></div>
          <div class="list-item"><span>📄 Evrak Motoru</span><span class="status-badge kismi">HTML/Word</span></div>
        </div>

        <div class="dashboard-card">
          <h3>Evrak Envanteri İlerlemesi</h3>
          <p style="font-size:1.4rem;font-weight:800;">${envanter ? envanter.ozet.aktif : 22} / ${envanter ? envanter.ozet.toplam : 38} aktif</p>
          <div class="roadmap-bar"><div class="roadmap-fill" style="width:${pct}%"></div></div>
          <p class="empty-state" style="text-align:left;margin-top:8px;">${pct}% tamamlandı · <a href="modules/envanter.html" style="text-decoration:underline">Tüm envanteri gör</a></p>
        </div>

        <div class="dashboard-card">
          <h3>Bugünkü Ders Programı</h3>
          ${renderTodaySchedule(cal)}
        </div>

        <div class="dashboard-card">
          <h3>Bugünkü Günlük Plan</h3>
          ${renderTodayPlan(plans, currentWeek)}
        </div>

        <div class="dashboard-card">
          <h3>Yaklaşan Belirli Gün ve Haftalar</h3>
          ${upcoming.length ? upcoming.map(e => `
            <div class="list-item"><span>${esc(e.ad)}</span><span class="meta">${esc(e.tarih)}</span></div>`).join('') : '<p class="empty-state">Yaklaşan etkinlik yok.</p>'}
        </div>

        <div class="dashboard-card">
          <h3>Son Oluşturulan Planlar</h3>
          ${plans.length ? plans.slice(0, 5).map(p => `
            <div class="list-item">
              <span>${p.tur === 'yillik' ? '📆' : '📖'} ${esc(p.ders || p.title)} — ${esc(p.sinif)}. Sınıf</span>
              <span class="meta">${fmtRelative(p.createdAt)}</span>
            </div>`).join('') : '<p class="empty-state">Henüz plan yok. <a href="modules/yillik-plan.html" style="text-decoration:underline">Yıllık plan oluşturun</a>.</p>'}
        </div>

        <div class="dashboard-card">
          <h3>Son İndirilen Belgeler</h3>
          ${docs.length ? docs.slice(0, 5).map(d => `
            <div class="list-item"><span>📄 ${esc(d.title)}</span><span class="meta">${fmtRelative(d.downloadedAt)}</span></div>`).join('') : '<p class="empty-state">Henüz belge indirilmedi.</p>'}
        </div>

        <div class="dashboard-card">
          <h3>Yol Haritası</h3>
          <div class="announcement">1️⃣ Ders veri tabanı — 1-4. sınıf tüm dersler</div>
          <div class="announcement">2️⃣ Takvim algoritması — 2026-2027 senkronizasyonu</div>
          <div class="announcement">3️⃣ Evrak Motoru — Word/PDF MEB formatı</div>
          <div class="announcement">4️⃣ Sahada test ve kalite kontrol</div>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = MiniBilgeNav.renderLayout('home', content);
    bindSearch();
  }

  async function loadEnvanter() {
    try {
      const res = await fetch((window.MINIBILGE_BASE || '') + 'assets/data/evrak-envanteri.json');
      return await res.json();
    } catch { return null; }
  }

  function bindSearch() {
    document.getElementById('globalSearch')?.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;
      const routes = {
        'yıllık': 'modules/yillik-plan.html', 'yillik': 'modules/yillik-plan.html',
        'günlük': 'modules/gunluk-plan.html', 'gunluk': 'modules/gunluk-plan.html',
        'belge': 'documents/index.html', 'evrak': 'documents/index.html',
        'envanter': 'modules/envanter.html', 'bep': 'modules/destek-egitim.html',
        'zümre': 'modules/zumre.html', 'profil': 'modules/hesabim.html'
      };
      for (const [key, href] of Object.entries(routes)) {
        if (q.includes(key)) { window.location.href = href; return; }
      }
      window.location.href = 'documents/index.html?q=' + encodeURIComponent(q);
    });
  }

  function renderTodaySchedule(cal) {
    const sinif = MiniBilgeStorage.getSettings().varsayilanSinif || '1';
    const hours = CalendarEngine.getWeeklyHours(cal, sinif);
    const entries = Object.entries(hours);
    if (!entries.length) return '<p class="empty-state">Ders programı tanımlı değil.</p>';
    return entries.map(([id, saat]) => `
      <div class="list-item"><span>${dersAdi(id)}</span><span class="meta">${saat} saat/hafta</span></div>`).join('');
  }

  function renderTodayPlan(plans, week) {
    const latest = plans.find(p => p.tur === 'yillik');
    if (!latest) return '<p class="empty-state">Önce yıllık plan oluşturun.</p>';
    return `<div class="list-item">
      <span>Hafta ${week?.hafta || '—'} · ${esc(latest.ders)}</span>
      <a href="modules/gunluk-plan.html" class="quick-btn" style="padding:6px 10px;font-size:0.75rem;">Üret</a>
    </div>`;
  }

  function dersAdi(id) {
    const map = { turkce: 'Türkçe', matematik: 'Matematik', hayatBilgisi: 'Hayat Bilgisi', fen: 'Fen', sosyal: 'Sosyal', gorselSanatlar: 'Görsel Sanatlar', muzik: 'Müzik', bedenEgitimi: 'Beden Eğitimi', ingilizce: 'İngilizce', rehberlik: 'Rehberlik' };
    return map[id] || id;
  }

  function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;') : ''; }
  function fmtToday(d) {
    const m = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
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
