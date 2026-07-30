(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  C.DocumentCard = function DocumentCard(opts) {
    const o = opts || {};
    const status = C.StatusBadge
      ? C.StatusBadge({ status: o.status || 'ready' }).html
      : '';
    const html = `
      <article class="mbc-doc-card">
        <div class="mbc-doc-card-top">
          <h3>${esc(o.title || 'Belge')}</h3>
          ${status}
        </div>
        <p class="mbc-doc-meta">${esc(o.meta || '')}</p>
        ${o.href ? `<a class="mbc-doc-link" href="${esc(o.href)}">Aç</a>` : ''}
      </article>`;
    return component(html);
  };

  C.ExportMenu = function ExportMenu(opts) {
    const o = opts || {};
    const formats = o.formats || ['html', 'word', 'pdf', 'print'];
    const labels = { html: 'HTML', word: 'Word', pdf: 'PDF', print: 'Yazdır' };
    const html = `
      <div class="mbc-export" role="group" aria-label="Dışa aktar">
        ${formats.map(f =>
          `<button type="button" class="mbc-export-btn" data-format="${esc(f)}">${esc(labels[f] || f)}</button>`
        ).join('')}
      </div>`;
    return component(html, (root) => {
      root.querySelectorAll('[data-format]').forEach(btn => {
        btn.addEventListener('click', () => {
          const format = btn.getAttribute('data-format');
          if (format === 'print') window.print();
          if (typeof o.onExport === 'function') o.onExport(format);
        });
      });
    });
  };

  C.DocumentBuilder = function DocumentBuilder(opts) {
    const o = opts || {};
    const blocks = o.blocks || [];
    const statusHtml = C.StatusBadge
      ? C.StatusBadge({ status: o.status || 'editing' }).html
      : '';
    const body = blocks.map(b => {
      if (b.type === 'heading') return `<h${b.level || 2} class="mbc-db-h">${esc(b.text || '')}</h${b.level || 2}>`;
      if (b.type === 'paragraph') return `<p class="mbc-db-p">${esc(b.text || '')}</p>`;
      if (b.type === 'meta') {
        return `<dl class="mbc-db-meta">${(b.items || []).map(it =>
          `<div><dt>${esc(it.label)}</dt><dd>${esc(it.value)}</dd></div>`
        ).join('')}</dl>`;
      }
      if (b.type === 'signature') {
        return `<div class="mbc-db-sign">${(b.roles || []).map(r =>
          `<div><span>${esc(r)}</span><em>İmza</em></div>`
        ).join('')}</div>`;
      }
      return '';
    }).join('');

    const html = `
      <section class="mbc-doc-builder" data-type="${esc(o.documentType || '')}">
        <header class="mbc-db-head">
          <div>
            <p class="mbc-db-kicker">${esc(o.motorId || 'MB-BM')}</p>
            <h2>${esc(o.title || 'Belge')}</h2>
          </div>
          ${statusHtml}
        </header>
        <div class="mbc-db-body">${body || '<p class="mbc-db-p">Blok yok — motor içerik üretecek.</p>'}</div>
        <footer class="mbc-db-foot">
          ${(C.ExportMenu({ onExport: o.onExport }).html)}
        </footer>
      </section>`;
    return component(html);
  };
})();
