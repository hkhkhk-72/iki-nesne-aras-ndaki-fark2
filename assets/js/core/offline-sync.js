(function () {
  'use strict';

  /**
   * MB-DS-004 A11Y-008 — Offline Mode
   * Yerel kuyruk; online olunca senkronize.
   */

  const QUEUE_KEY = 'minibilgeOfflineQueue';
  const META_KEY = 'minibilgeOfflineMeta';

  function readQueue() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function writeQueue(list) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(list.slice(-200)));
  }

  function isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
  }

  function enqueue(item) {
    const list = readQueue();
    list.push({
      id: 'off_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      at: new Date().toISOString(),
      ...item
    });
    writeQueue(list);
    renderBanner();
    return list[list.length - 1];
  }

  /**
   * Kayıt işlemini online ise hemen, değilse kuyruğa alır.
   * opts: { type, payload, apply(payload) }
   */
  function runOrQueue(opts) {
    const o = opts || {};
    if (isOnline()) {
      if (typeof o.apply === 'function') o.apply(o.payload);
      return { queued: false };
    }
    enqueue({ type: o.type || 'mutation', payload: o.payload || null, applyKey: o.applyKey || null });
    if (typeof o.onQueued === 'function') o.onQueued();
    return { queued: true };
  }

  async function flush() {
    if (!isOnline()) return { synced: 0, remaining: readQueue().length };
    const list = readQueue();
    if (!list.length) {
      localStorage.setItem(META_KEY, JSON.stringify({ lastSync: new Date().toISOString() }));
      renderBanner();
      return { synced: 0, remaining: 0 };
    }

    const remaining = [];
    let synced = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      try {
        if (typeof window.__minibilgeOfflineApply === 'function') {
          await window.__minibilgeOfflineApply(item);
        } else if (item.type === 'settings' && window.MiniBilgeStorage) {
          MiniBilgeStorage.saveSettings(item.payload || {});
        } else if (item.type === 'profile' && window.MiniBilgeStorage) {
          MiniBilgeStorage.saveProfile(item.payload || {});
        } else if (item.type === 'school' && window.MiniBilgeStorage) {
          MiniBilgeStorage.saveSchool(item.payload || {});
        }
        // Bilinmeyen tipler de “teslim” sayılır (yerel prototip)
        synced += 1;
      } catch (e) {
        remaining.push(item);
      }
    }
    writeQueue(remaining);
    localStorage.setItem(META_KEY, JSON.stringify({ lastSync: new Date().toISOString(), synced }));
    renderBanner();
    if (synced && window.MiniBilgeComponents && MiniBilgeComponents.notify) {
      MiniBilgeComponents.notify.success(synced + ' değişiklik senkronize edildi', 'Çevrimiçi');
    }
    return { synced, remaining: remaining.length };
  }

  function ensureBanner() {
    if (!document.body) return null;
    let el = document.getElementById('mb-offline-banner');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'mb-offline-banner';
    el.className = 'mb-offline-banner';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.hidden = true;
    document.body.appendChild(el);
    return el;
  }

  function renderBanner() {
    if (!document.body) return;
    const el = ensureBanner();
    if (!el) return;
    const online = isOnline();
    const q = readQueue().length;
    if (online && q === 0) {
      el.hidden = true;
      el.textContent = '';
      document.documentElement.removeAttribute('data-offline');
      return;
    }
    document.documentElement.setAttribute('data-offline', online ? 'syncing' : '1');
    el.hidden = false;
    if (!online) {
      el.textContent = q
        ? 'Çevrimdışı — ' + q + ' değişiklik kuyrukta. Bağlantı gelince senkronize edilecek.'
        : 'Çevrimdışı çalışıyorsunuz. Değişiklikler yerelde saklanır.';
    } else {
      el.textContent = 'Bağlantı var — ' + q + ' değişiklik senkronize ediliyor…';
      flush();
    }
  }

  function boot() {
    renderBanner();
    window.addEventListener('online', function () {
      renderBanner();
      flush();
    });
    window.addEventListener('offline', renderBanner);
  }

  window.MiniBilgeOffline = {
    version: '1.0',
    isOnline,
    enqueue,
    runOrQueue,
    flush,
    readQueue,
    renderBanner,
    boot
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
