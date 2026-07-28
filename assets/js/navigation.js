(function () {
  'use strict';

  /**
   * MB-ARCH-001 Freeze Menü — 8 üst seviye.
   * Zümre / kulüp / İYEP vb. Evrak Merkezi altındadır.
   */
  const MENU = [
    { id: 'home', label: 'Ana Sayfa', icon: '⌂', path: 'index.html' },
    { id: 'yillik-plan', label: 'Yıllık Plan', icon: '☰', path: 'modules/yillik-plan.html' },
    { id: 'gunluk-plan', label: 'Günlük Plan', icon: '✎', path: 'modules/gunluk-plan.html' },
    { id: 'evrak-merkezi', label: 'Evrak Merkezi', icon: '▤', path: 'documents/index.html' },
    { id: 'ogretim-programi', label: 'Öğretim Programı', icon: '◎', path: 'modules/ogretim-programi.html' },
    { id: 'takvim', label: 'Takvim', icon: '▦', path: 'modules/takvim.html' },
    { id: 'hesabim', label: 'Hesabım', icon: '☺', path: 'modules/hesabim.html' },
    { id: 'ayarlar', label: 'Ayarlar', icon: '⚙', path: 'modules/ayarlar.html' }
  ];

  /** Evrak Merkezi alt grupları (ARCH-001) — deep-link hedefleri */
  const EVRAK_ALT = [
    { id: 'planlar', label: 'Planlar', path: 'documents/index.html?grup=planlar' },
    { id: 'zumre', label: 'Zümre Evrakları', path: 'modules/zumre.html' },
    { id: 'rehberlik', label: 'Rehberlik', path: 'modules/rehberlik.html' },
    { id: 'kulup', label: 'Kulüpler', path: 'modules/kulup.html' },
    { id: 'belirli-gun', label: 'Belirli Gün ve Haftalar', path: 'modules/belirli-gun.html' },
    { id: 'olcme', label: 'Ölçme Değerlendirme', path: 'modules/olcme.html' },
    { id: 'destek', label: 'Destek Eğitim / İYEP', path: 'modules/destek-egitim.html' },
    { id: 'envanter', label: 'Evrak Envanteri', path: 'modules/envanter.html' }
  ];

  function resolveHref(path) {
    const inModules = /\/modules\//.test(window.location.pathname) || window.location.pathname.endsWith('/modules');
    const inDocs = /\/documents\//.test(window.location.pathname);
    if (inModules) {
      if (path === 'index.html') return '../index.html';
      if (path.startsWith('modules/')) return path.replace('modules/', '');
      if (path.startsWith('documents/')) return '../' + path;
      return '../' + path;
    }
    if (inDocs) {
      if (path === 'index.html') return '../index.html';
      if (path.startsWith('documents/')) return path.replace('documents/', '');
      return '../' + path;
    }
    return path;
  }

  function renderSidebar(activeId) {
    const path = window.location.pathname;
    return `
      <aside class="sidebar no-print">
        <div class="sidebar-brand">
          <span class="brand-mark">MB</span>
          <div>
            <strong>MiniBilge</strong>
            <small>Öğretmen</small>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${MENU.map(item => {
            const href = resolveHref(item.path);
            const file = item.path.split('?')[0].split('/').pop();
            const active = activeId === item.id || path.endsWith(file);
            return `<a href="${href}" class="nav-item${active ? ' active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
            </a>`;
          }).join('')}
        </nav>
        <div class="sidebar-footer">
          <small>TYMM · Eğitim İşletim Sistemi</small>
        </div>
      </aside>`;
  }

  function renderLayout(activeId, content) {
    return `
      <div class="app-layout">
        ${renderSidebar(activeId)}
        <main class="main-content">${content}</main>
      </div>`;
  }

  window.MiniBilgeNav = { MENU, EVRAK_ALT, renderSidebar, renderLayout, resolveHref };
})();
