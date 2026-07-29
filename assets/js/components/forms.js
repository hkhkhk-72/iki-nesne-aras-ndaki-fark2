(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  C.FormField = function FormField(opts) {
    const o = opts || {};
    const id = o.id || `f-${Math.random().toString(36).slice(2, 8)}`;
    const html = `
      <label class="mbc-field" for="${esc(id)}">
        <span class="mbc-field-label">${esc(o.label || '')}</span>
        ${o.hint ? `<span class="mbc-field-hint">${esc(o.hint)}</span>` : ''}
        ${o.controlHtml || `<input id="${esc(id)}" class="mbc-input" type="${esc(o.type || 'text')}" value="${esc(o.value || '')}" placeholder="${esc(o.placeholder || '')}">`}
      </label>`;
    return component(html);
  };

  C.SchoolSelector = function SchoolSelector(opts) {
    const o = opts || {};
    const school = o.school || (window.MiniBilgeStorage && MiniBilgeStorage.getSchool()) || {};
    const profile = o.profile || (window.MiniBilgeStorage && MiniBilgeStorage.getProfile()) || {};
    const settings = o.settings || (window.MiniBilgeStorage && MiniBilgeStorage.getSettings()) || {};
    const html = `
      <div class="mbc-smart-form" data-form="school">
        <p class="mbc-smart-lead">Okul bağlamı — kayıtlıysa otomatik dolar.</p>
        <div class="mbc-smart-grid">
          ${C.FormField({ id: 'mbc-okul', label: 'Okul', value: school.ad || school.okulAdi || '' }).html}
          ${C.FormField({ id: 'mbc-il', label: 'İl', value: school.il || '' }).html}
          ${C.FormField({ id: 'mbc-ilce', label: 'İlçe', value: school.ilce || '' }).html}
          ${C.FormField({ id: 'mbc-mudur', label: 'Müdür', value: school.mudur || school.mudurAdi || '' }).html}
          ${C.FormField({ id: 'mbc-ogretmen', label: 'Öğretmen', value: profile.adSoyad || '' }).html}
          ${C.FormField({ id: 'mbc-sube', label: 'Şube', value: settings.sube || 'A' }).html}
        </div>
      </div>`;
    return component(html);
  };

  C.LessonSelector = function LessonSelector(opts) {
    const o = opts || {};
    const sinif = String(o.sinif || '1');
    const dersler = (window.MiniBilgeHub && MiniBilgeHub.derslerForSinif(sinif)) || [];
    const options = dersler.map(d =>
      `<option value="${esc(d.id)}"${d.id === o.ders ? ' selected' : ''}>${esc(d.ad)}</option>`
    ).join('');
    const html = `
      <div class="mbc-smart-form" data-form="lesson">
        <p class="mbc-smart-lead">Sınıf → Ders → (ünite / çıktı / tema motorla bağlanır)</p>
        <div class="mbc-smart-grid">
          <label class="mbc-field">
            <span class="mbc-field-label">Sınıf</span>
            <select class="mbc-input" data-role="sinif">
              ${['1','2','3','4'].map(s => `<option value="${s}"${s===sinif?' selected':''}>${s}. Sınıf</option>`).join('')}
            </select>
          </label>
          <label class="mbc-field">
            <span class="mbc-field-label">Ders</span>
            <select class="mbc-input" data-role="ders">${options}</select>
          </label>
          ${C.FormField({ id: 'mbc-unite', label: 'Ünite / Tema', value: o.unite || '', placeholder: 'Motor doldurur' }).html}
          ${C.FormField({ id: 'mbc-cikti', label: 'Öğrenme Çıktısı', value: o.cikti || '', placeholder: 'TPM' }).html}
          ${C.FormField({ id: 'mbc-hafta', label: 'Hafta', value: o.hafta || '', type: 'number' }).html}
        </div>
      </div>`;
    return component(html, (root) => {
      const sinifEl = root.querySelector('[data-role="sinif"]');
      const dersEl = root.querySelector('[data-role="ders"]');
      if (sinifEl && dersEl && window.MiniBilgeHub) {
        sinifEl.addEventListener('change', () => {
          const list = MiniBilgeHub.derslerForSinif(sinifEl.value);
          dersEl.innerHTML = list.map(d =>
            `<option value="${esc(d.id)}">${esc(d.ad)}</option>`
          ).join('');
          if (typeof o.onChange === 'function') o.onChange({ sinif: sinifEl.value, ders: dersEl.value });
        });
      }
    });
  };

  C.DateSelector = function DateSelector(opts) {
    const o = opts || {};
    const value = o.value || new Date().toISOString().slice(0, 10);
    const html = `
      <div class="mbc-smart-form" data-form="date">
        <p class="mbc-smart-lead">Takvim Motoru’na bağlı tarih — tatil/belirli gün farkındalığı.</p>
        ${C.FormField({ id: 'mbc-date', label: 'Tarih', type: 'date', value }).html}
        <div class="mbc-date-hint" data-role="hint">Takvim yüklendiğinde ipucu burada görünür.</div>
      </div>`;
    return component(html, async (root) => {
      const hint = root.querySelector('[data-role="hint"]');
      const input = root.querySelector('#mbc-date');
      async function refresh() {
        if (!window.CalendarEngine || !hint) return;
        try {
          const cal = await CalendarEngine.loadCalendar();
          const events = (CalendarEngine.getUpcomingEvents
            ? CalendarEngine.getUpcomingEvents(cal, new Date(input.value), 3)
            : []) || [];
          if (!events.length) {
            hint.textContent = 'Yakın tarihli özel gün yok.';
            return;
          }
          hint.textContent = 'Yaklaşan: ' + events.map(e => e.ad).join(' · ');
        } catch (e) {
          hint.textContent = 'Takvim ipucu alınamadı.';
        }
      }
      if (input) input.addEventListener('change', refresh);
      refresh();
    });
  };

  C.StudentSelector = function StudentSelector(opts) {
    const o = opts || {};
    const students = o.students || [
      { id: '1', ad: 'Örnek Öğrenci 1' },
      { id: '2', ad: 'Örnek Öğrenci 2' }
    ];
    const html = `
      <div class="mbc-smart-form" data-form="student">
        <p class="mbc-smart-lead">BEP · İYEP · Destek · RAM ortak öğrenci seçici.</p>
        <label class="mbc-field">
          <span class="mbc-field-label">Öğrenci</span>
          <select class="mbc-input" data-role="student">
            ${students.map(s => `<option value="${esc(s.id)}">${esc(s.ad)}</option>`).join('')}
          </select>
        </label>
      </div>`;
    return component(html);
  };
})();
