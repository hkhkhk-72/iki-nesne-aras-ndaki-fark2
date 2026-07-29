(function () {
  'use strict';

  /**
   * MB-UI-002 — Derin rotalar (bağlam sınıf sekmelerinden gelir)
   * Ana ekran hub: Planlar · Sınıf · Ders · Evrak · Rapor · Ayarlar
   */
  const MENU = [
    { id: 'home', label: 'Ana Sayfa', icon: 'AS', path: 'index.html' },
    { id: 'ogretim-programi', label: 'Öğretim Programı', icon: 'OP', path: 'modules/ogretim-programi.html' },
    { id: 'yillik-plan', label: 'Yıllık Planlar', icon: 'YP', path: 'modules/yillik-plan.html' },
    { id: 'gunluk-plan', label: 'Günlük Planlar', icon: 'GP', path: 'modules/gunluk-plan.html' },
    { id: 'evrak-merkezi', label: 'Evrak Merkezi', icon: 'EM', path: 'documents/index.html' },
    { id: 'takvim', label: 'Akademik Takvim', icon: 'AT', path: 'modules/takvim.html' },
    { id: 'ai', label: 'MiniBilge AI', icon: 'AI', path: 'modules/ai.html' },
    { id: 'raporlar', label: 'Raporlar', icon: 'RP', path: 'modules/raporlar.html' },
    { id: 'hesabim', label: 'Hesabım', icon: 'HS', path: 'modules/hesabim.html' },
    { id: 'ayarlar', label: 'Ayarlar', icon: 'AY', path: 'modules/ayarlar.html' }
  ];

  const EVRAK_ALT = [
    { id: 'planlar', label: 'Planlar', path: 'documents/index.html?grup=planlar' },
    { id: 'gunluk-kazanimlar', label: 'Günlük Kazanımlar', path: 'modules/gunluk-kazanimlar.html' },
    { id: 'zumre', label: 'Zümre', path: 'modules/zumre.html' },
    { id: 'rehberlik', label: 'Rehberlik', path: 'modules/rehberlik.html' },
    { id: 'kulup', label: 'Kulüpler', path: 'modules/kulup.html' },
    { id: 'belirli-gun', label: 'Belirli Gün ve Haftalar', path: 'modules/belirli-gun.html' },
    { id: 'olcme', label: 'Ölçme', path: 'modules/olcme.html' },
    { id: 'destek', label: 'Destek / İYEP', path: 'modules/destek-egitim.html' },
    { id: 'envanter', label: 'Envanter', path: 'modules/envanter.html' }
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

  function activeSinif() {
    try {
      if (window.MiniBilgeStorage) {
        return String(MiniBilgeStorage.getSettings().varsayilanSinif || '1');
      }
    } catch (e) { /* ignore */ }
    return '1';
  }

  function renderSidebar(activeId) {
    const path = window.location.pathname;
    const sinif = activeSinif();
    return `
      <aside class="sidebar no-print">
        <div class="sidebar-brand">
          <span class="brand-mark">MB</span>
          <div>
            <strong>MiniBilge</strong>
            <small>Öğretmen · ${sinif}. Sınıf</small>
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
        <div class="sidebar-footer">TYMM · ${sinif}. Sınıf bağlamı</div>
      </aside>`;
  }

  function renderLayout(activeId, content) {
    return `
      <div class="app-layout">
        ${renderSidebar(activeId)}
        <main class="main-content">${content}</main>
      </div>`;
  }

  window.MiniBilgeNav = { MENU, EVRAK_ALT, renderSidebar, renderLayout, resolveHref, activeSinif };
})();
