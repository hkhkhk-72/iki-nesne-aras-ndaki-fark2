(function () {
  'use strict';

  const MENU = [
    { id: 'home', label: 'Ana Sayfa', icon: '🏠', path: 'index.html' },
    { id: 'yillik-plan', label: 'Yıllık Plan', icon: '📆', path: 'modules/yillik-plan.html' },
    { id: 'gunluk-plan', label: 'Günlük Plan', icon: '📖', path: 'modules/gunluk-plan.html' },
    { id: 'okul-evraklari', label: 'Okul Evrakları', icon: '📁', path: 'documents/index.html' },
    { id: 'belirli-gun', label: 'Belirli Gün ve Haftalar', icon: '🎉', path: 'modules/belirli-gun.html' },
    { id: 'kulup', label: 'Kulüp Evrakları', icon: '🎭', path: 'modules/kulup.html' },
    { id: 'destek-egitim', label: 'Destek Eğitim', icon: '🤝', path: 'modules/destek-egitim.html' },
    { id: 'iyep', label: 'İYEP', icon: '📚', path: 'modules/iyep.html' },
    { id: 'egzersiz', label: 'Egzersiz Planları', icon: '🏃', path: 'modules/egzersiz.html' },
    { id: 'zumre', label: 'Zümre Evrakları', icon: '👥', path: 'modules/zumre.html' },
    { id: 'rehberlik', label: 'Rehberlik Evrakları', icon: '🧭', path: 'modules/rehberlik.html' },
    { id: 'olcme', label: 'Ölçme ve Değerlendirme', icon: '📊', path: 'modules/olcme.html' },
    { id: 'hesabim', label: 'Hesabım', icon: '👤', path: 'modules/hesabim.html' },
    { id: 'ayarlar', label: 'Ayarlar', icon: '⚙️', path: 'modules/ayarlar.html' }
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
          <span class="brand-icon">🎓</span>
          <div>
            <strong>MiniBilge</strong>
            <small>Öğretmen</small>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${MENU.map(item => {
            const href = resolveHref(item.path);
            const active = activeId === item.id || path.endsWith(item.path.split('/').pop());
            return `<a href="${href}" class="nav-item${active ? ' active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
            </a>`;
          }).join('')}
        </nav>
        <div class="sidebar-footer">
          <small>Türkiye Yüzyılı Maarif Modeli</small>
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

  window.MiniBilgeNav = { MENU, renderSidebar, renderLayout };
})();
