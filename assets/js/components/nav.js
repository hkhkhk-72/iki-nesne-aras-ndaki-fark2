(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  C.ClassTabs = function ClassTabs(opts) {
    const o = opts || {};
    const grades = o.grades || ['1', '2', '3', '4'];
    const active = String(o.active || '1');
    const html = `
      <div class="mbc-grade-tabs" role="tablist" aria-label="${esc(o.ariaLabel || 'Sınıf seçici')}">
        ${grades.map(g => `
          <button type="button"
            class="mbc-grade-tab${String(g) === active ? ' is-active' : ''}"
            role="tab"
            aria-selected="${String(g) === active ? 'true' : 'false'}"
            data-sinif="${esc(g)}">${esc(g)}. Sınıf</button>`).join('')}
      </div>`;
    return component(html, (root) => {
      root.querySelectorAll('.mbc-grade-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const sinif = btn.getAttribute('data-sinif');
          if (typeof o.onChange === 'function') o.onChange(sinif);
        });
      });
    });
  };

  C.Breadcrumb = function Breadcrumb(opts) {
    const crumbs = (opts && opts.crumbs) || [];
    const html = `
      <nav class="mbc-breadcrumb" aria-label="Sayfa yolu">
        ${crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          if (last || !c.href) return `<span class="mbc-crumb is-current">${esc(c.label)}</span>`;
          return `<a class="mbc-crumb" href="${esc(c.href)}">${esc(c.label)}</a><span class="mbc-crumb-sep" aria-hidden="true">/</span>`;
        }).join('')}
      </nav>`;
    return component(html);
  };

  C.BackButton = function BackButton(opts) {
    const o = opts || {};
    const href = o.href || '../index.html';
    const label = o.label || 'Geri';
    return component(`<a class="mbc-back" href="${esc(href)}">← ${esc(label)}</a>`);
  };

  C.TopBar = function TopBar(opts) {
    const o = opts || {};
    const actions = (o.actions || []).map(a =>
      `<a class="mbc-topbar-action" href="${esc(a.href || '#')}">${esc(a.label)}</a>`
    ).join('');
    const html = `
      <div class="mbc-topbar">
        <div>
          ${o.back ? C.BackButton(o.back).html : ''}
          <h1 class="mbc-topbar-title">${esc(o.title || '')}</h1>
        </div>
        <div class="mbc-topbar-actions">${actions}</div>
      </div>`;
    return component(html);
  };
})();
