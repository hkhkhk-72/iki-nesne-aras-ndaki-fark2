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

  /** MB-UI-001 Dashboard — kart ızgarası yok */
  async function initDashboard() {
    try {
      if (!window.MiniBilgeNav || !window.MiniBilgeStorage) {
        throw new Error('Gerekli betikler yüklenemedi.');
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
      let upcoming = [];
      try {
        currentWeek = CalendarEngine.getCurrentWeek(cal, today);
        upcoming = CalendarEngine.getUpcomingEvents(cal, new Date(today), 5);
      } catch (e) {
        console.warn(e);
      }

      const hours = (cal.haftalikDersSaati && cal.haftalikDersSaati[String(sinif)]) || FALLBACK_CAL.haftalikDersSaati['1'];
      const hasYillik = (plans || []).some(p => p.tur === 'yillik');

      const content = `
      <div class="dash">
        <header class="dash-hero">
          <p class="brand-kicker">MiniBilge Öğretmen</p>
          <h1>Merhaba ${esc(ad)}</h1>
          <p class="dash-date">Bugün ${gunAdi}, ${fmtToday(today)} · ${esc(sinif)}. Sınıf · ${esc(egitimYili)}${currentWeek ? ' · Hafta ' + currentWeek.hafta : ''}</p>
        </header>

        <section class="mb-section">
          <h2>Bugünkü Dersler</h2>
          <p class="section-lead">Ders programınıza göre bugün işlenecek dersler.</p>
          <div class="lesson-strip">
            ${Object.keys(hours).map(id => `
              <div class="lesson-row">
                <div>
                  <div class="lesson-name">${dersAdi(id, sinif)}</div>
                  <div class="lesson-meta">${hours[id]} saat / hafta · ${esc(sinif)}. sınıf</div>
                </div>
                <a class="quick-btn primary compact" href="modules/gunluk-plan.html?ders=${encodeURIComponent(id)}">Oluştur</a>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="mb-section">
          <h2>Bugünkü Görevler</h2>
          <p class="section-lead">MB-TWE — bugün tamamlanması gereken adımlar.</p>
          <div class="task-list">
            ${renderTweTasks(hasYillik, currentWeek)}
          </div>
        </section>

        <section class="mb-section">
          <h2>Yaklaşan İşler</h2>
          <p class="section-lead">Takvimden gelen resmî günler ve hatırlatmalar.</p>
          ${upcoming.length ? `
            <div class="timeline">
              ${upcoming.map(e => `
                <div class="timeline-item">
                  <span class="timeline-dot"></span>
                  <div>
                    <div class="t-title">${esc(e.ad)}</div>
                    <div class="t-meta">${esc(e.tur || 'takvim')}</div>
                  </div>
                  <div class="t-when">${esc(e.tarih || '')}</div>
                </div>
              `).join('')}
            </div>` : '<p class="empty-state">Yaklaşan kayıt yok. <a class="text-link" href="modules/takvim.html">Takvimi aç</a></p>'}
        </section>

        <section class="mb-section">
          <h2>Son Belgeler</h2>
          <p class="section-lead">En son ürettiğiniz plan ve evraklar.</p>
          ${renderRecent(plans, docs)}
        </section>
      </div>`;

      mount(MiniBilgeNav.renderLayout('home', content));
    } catch (err) {
      console.error(err);
      showBootError(err);
    }
  }

  function renderTweTasks(hasYillik, week) {
    const tasks = [
      { done: hasYillik, text: 'Yıllık planı kontrol et / oluştur', href: 'modules/yillik-plan.html' },
      { done: false, text: `Hafta ${week?.hafta || '—'} günlük planları hazırla`, href: 'modules/gunluk-plan.html' },
      { done: false, text: 'Rehberlik etkinliğini gözden geçir', href: 'modules/rehberlik.html' },
      { done: false, text: 'Kulüp / belirli gün hazırlığı', href: 'modules/belirli-gun.html' },
      { done: false, text: 'Yoklama ve sınıf evrakları', href: 'documents/index.html' }
    ];
    return tasks.map(t => `
      <div class="task-row">
        <span class="task-check${t.done ? ' done' : ''}">${t.done ? '✓' : ''}</span>
        <span class="task-text${t.done ? ' done' : ''}">${esc(t.text)}</span>
        <a class="text-link" href="${t.href}">Aç</a>
      </div>`).join('');
  }

  function renderRecent(plans, docs) {
    const rows = [];
    (plans || []).slice(0, 4).forEach(p => {
      rows.push(`<div class="doc-row">
        <span>${p.tur === 'yillik' ? 'Yıllık plan' : 'Günlük plan'} · ${esc(p.ders || p.title)} · ${esc(String(p.sinif))}. sınıf</span>
        <span class="meta">${fmtRelative(p.createdAt)}</span>
      </div>`);
    });
    (docs || []).slice(0, 3).forEach(d => {
      rows.push(`<div class="doc-row"><span>${esc(d.title)}</span><span class="meta">${fmtRelative(d.downloadedAt)}</span></div>`);
    });
    if (!rows.length) {
      return '<p class="empty-state">Henüz belge yok. <a class="text-link" href="modules/gunluk-plan.html">Günlük plan ile başlayın</a>.</p>';
    }
    return rows.join('');
  }

  function dersAdi(id, sinif) {
    const map = {
      turkce: 'Türkçe', matematik: 'Matematik', hayatBilgisi: 'Hayat Bilgisi',
      fen: 'Fen Bilimleri', sosyal: 'Sosyal Bilgiler', gorselSanatlar: 'Görsel Sanatlar',
      muzik: 'Müzik', bedenEgitimi: 'Oyun ve Fiziki Etkinlikler',
      ingilizce: 'Yabancı Dil (İngilizce)',
      dinKulturu: 'Din Kültürü ve Ahlak Bilgisi', serbestEtkinlikler: 'Serbest Etkinlikler',
      trafikGuvenligi: 'Trafik Güvenliği',
      insanHaklari: 'İnsan Hakları, Vatandaşlık ve Demokrasi'
    };
    const bySinif = {
      1: { bedenEgitimi: 'Beden Eğitimi ve Oyun (Oyun ve Fiziki Etkinlikler)' },
      2: { bedenEgitimi: 'Oyun ve Fiziki Etkinlikler (Beden Eğitimi)' }
    };
    const g = String(sinif || '');
    return (bySinif[g] && bySinif[g][id]) || map[id] || id;
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
