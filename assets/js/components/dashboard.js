(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  C.TodaysLessons = function TodaysLessons(opts) {
    const o = opts || {};
    const items = o.items || [];
    const html = `
      <div class="mbc-dash-block">
        <h3>${esc(o.title || 'Bugünkü Dersler')}</h3>
        <p class="mbc-dash-lead">${esc(o.lead || '')}</p>
        <div class="lesson-strip">
          ${items.map(it => `
            <div class="lesson-row">
              <div>
                <div class="lesson-name">${esc(it.ad)}</div>
                <div class="lesson-meta">${esc(it.meta || '')}</div>
              </div>
              <div class="quick-actions" style="gap:0.35rem;">
                ${(it.actions || []).map(a =>
                  `<a class="quick-btn${a.primary ? ' primary' : ''} compact" href="${esc(a.href)}">${esc(a.label)}</a>`
                ).join('')}
              </div>
            </div>`).join('') || '<p class="empty-state">Ders yok</p>'}
        </div>
      </div>`;
    return component(html);
  };

  C.TodaysTasks = function TodaysTasks(opts) {
    const o = opts || {};
    const tasks = o.tasks || [];
    const html = `
      <div class="mbc-dash-block">
        <h3>${esc(o.title || 'Bugünkü Görevler')}</h3>
        <div class="task-list">
          ${tasks.map(t => `
            <div class="task-row">
              <span class="task-check${t.done ? ' done' : ''}">${t.done ? '✓' : ''}</span>
              <span class="task-text${t.done ? ' done' : ''}">${esc(t.text)}</span>
              ${t.href ? `<a class="text-link" href="${esc(t.href)}">Aç</a>` : ''}
            </div>`).join('')}
        </div>
      </div>`;
    return component(html);
  };

  C.QuickActions = function QuickActions(opts) {
    const actions = (opts && opts.actions) || [];
    const html = `
      <div class="quick-actions">
        ${actions.map(a =>
          `<a class="quick-btn${a.primary ? ' primary' : ''}" href="${esc(a.href)}">${esc(a.label)}</a>`
        ).join('')}
      </div>`;
    return component(html);
  };
})();
