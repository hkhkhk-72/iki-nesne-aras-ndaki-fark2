(function () {
  'use strict';
  const C = window.MiniBilgeComponents;
  if (!C) return;
  const { esc, component } = C;

  C.UniversalTable = function UniversalTable(opts) {
    const o = opts || {};
    const columns = o.columns || [];
    const rows = (o.rows || []).slice();
    const rowKey = o.rowKey || 'id';
    const selectable = !!o.selectable;
    const searchable = o.searchable !== false;
    const uid = `tbl-${Math.random().toString(36).slice(2, 7)}`;

    function keyOf(row, i) {
      return typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] != null ? row[rowKey] : String(i));
    }

    function renderRows(list) {
      if (!list.length) {
        return `<tr><td colspan="${columns.length + (selectable ? 1 : 0)}" class="mbc-table-empty">${esc(o.emptyText || 'Kayıt yok')}</td></tr>`;
      }
      return list.map((row, i) => {
        const id = keyOf(row, i);
        const cells = columns.map(col => {
          const val = typeof col.render === 'function' ? col.render(row) : (row[col.id] != null ? row[col.id] : '');
          return `<td>${typeof val === 'string' && val.indexOf('<') === 0 ? val : esc(val)}</td>`;
        }).join('');
        const check = selectable
          ? `<td><input type="checkbox" data-row-id="${esc(id)}" ${(o.selectedIds || []).includes(String(id)) ? 'checked' : ''}></td>`
          : '';
        return `<tr data-row-id="${esc(id)}">${check}${cells}</tr>`;
      }).join('');
    }

    const head = columns.map(col =>
      `<th data-col="${esc(col.id)}" class="${col.sortable === false ? '' : 'is-sortable'}">${esc(col.label)}</th>`
    ).join('');

    const html = `
      <div class="mbc-table-wrap" id="${uid}">
        <div class="mbc-table-toolbar">
          ${searchable ? `<input type="search" class="mbc-input mbc-table-search" placeholder="${esc(o.searchPlaceholder || 'Ara…')}" aria-label="Tabloda ara">` : ''}
          <div class="mbc-table-actions">
            <button type="button" class="mbc-btn-ghost" data-act="print">Yazdır</button>
            <button type="button" class="mbc-btn-ghost" data-act="export-html">HTML</button>
          </div>
        </div>
        <div class="mbc-table-scroll">
          <table class="mbc-table">
            <thead>
              <tr>
                ${selectable ? '<th class="mbc-th-check"></th>' : ''}
                ${head}
              </tr>
            </thead>
            <tbody>${renderRows(rows)}</tbody>
          </table>
        </div>
      </div>`;

    return component(html, (root) => {
      let sortCol = null;
      let sortDir = 'asc';
      let filtered = rows.slice();

      const tbody = root.querySelector('tbody');
      const search = root.querySelector('.mbc-table-search');

      function apply() {
        let list = filtered.slice();
        if (sortCol) {
          list.sort((a, b) => {
            const av = a[sortCol]; const bv = b[sortCol];
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = String(av).localeCompare(String(bv), 'tr', { numeric: true });
            return sortDir === 'asc' ? cmp : -cmp;
          });
        }
        tbody.innerHTML = renderRows(list);
        bindChecks();
      }

      function bindChecks() {
        if (!selectable) return;
        root.querySelectorAll('input[data-row-id]').forEach(cb => {
          cb.addEventListener('change', () => {
            const ids = [...root.querySelectorAll('input[data-row-id]:checked')].map(x => x.getAttribute('data-row-id'));
            if (typeof o.onSelect === 'function') o.onSelect(ids);
          });
        });
      }

      if (search) {
        search.addEventListener('input', () => {
          const q = search.value.trim().toLocaleLowerCase('tr');
          filtered = !q ? rows.slice() : rows.filter(r =>
            columns.some(c => String(r[c.id] == null ? '' : r[c.id]).toLocaleLowerCase('tr').includes(q))
          );
          apply();
        });
      }

      root.querySelectorAll('th.is-sortable').forEach(th => {
        th.addEventListener('click', () => {
          const col = th.getAttribute('data-col');
          if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
          else { sortCol = col; sortDir = 'asc'; }
          if (typeof o.onSort === 'function') o.onSort(sortCol, sortDir);
          apply();
        });
      });

      root.querySelector('[data-act="print"]')?.addEventListener('click', () => window.print());
      root.querySelector('[data-act="export-html"]')?.addEventListener('click', () => {
        const blob = new Blob([`<html><body>${root.querySelector('table').outerHTML}</body></html>`], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${o.exportName || 'minibolge-tablo'}.html`;
        a.click();
      });

      bindChecks();
    });
  };
})();
