(function () {
  'use strict';

  /**
   * Evrak Motoru — Plan verilerini resmî belge formatına dönüştürür.
   * Word (.docx) entegrasyonu yol haritasında; şu an HTML/PDF yazdırma aktif.
   */
  const PRINT_STYLES = `
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; margin: 20mm; color: #1a1a1a; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
    th, td { border: 1px solid #333; padding: 6px 8px; }
    th { background: #f0f0f0; }
    .doc-title { text-align: center; font-size: 16pt; font-weight: 700; margin: 16px 0; text-transform: uppercase; }
    .doc-letterhead { border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 20px; }
    .letterhead-top { display: flex; justify-content: space-between; }
    .school-name { font-size: 14pt; font-weight: 700; text-transform: uppercase; }
    .doc-footer { margin-top: 24px; font-size: 10pt; color: #555; border-top: 1px solid #ccc; padding-top: 8px; }
    @media print { body { margin: 15mm; } }
  `;

  function htmlBelge(html, title) {
    return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${esc(title)}</title>
      <style>${PRINT_STYLES}</style></head><body>${html}</body></html>`;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function yazdir(html, title) {
    const w = window.open('', '_blank');
    w.document.write(htmlBelge(html, title || 'MiniBilge Belge'));
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 350);
  }

  function indirHtml(html, filename, title) {
    const blob = new Blob([htmlBelge(html, title || filename)], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename.endsWith('.html') ? filename : filename + '.html';
    a.click();
    URL.revokeObjectURL(a.href);
    if (window.MiniBilgeStorage) {
      MiniBilgeStorage.addDocument({ title: title || filename, type: 'html' });
    }
  }

  function indirPdf(html, title) {
    yazdir(html, title);
    return { format: 'pdf', note: 'Tarayıcı yazdır penceresinden "PDF olarak kaydet" seçin.' };
  }

  function indirWord(html, filename, title) {
    const wordHtml = htmlBelge(html, title).replace(
      '<html lang="tr">',
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="tr">'
    );
    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (filename || 'belge') + '.doc';
    a.click();
    URL.revokeObjectURL(a.href);
    if (window.MiniBilgeStorage) {
      MiniBilgeStorage.addDocument({ title: title || filename, type: 'word' });
    }
    return { format: 'doc', note: 'Word uyumlu .doc formatında indirildi.' };
  }

  function planToEvrak(plan, tur) {
    if (tur === 'yillik') return PlanEngine.renderYillikPlan(plan);
    if (tur === 'gunluk') return PlanEngine.renderGunlukPlan(plan);
    return '';
  }

  window.EvrakEngine = {
    yazdir,
    indirHtml,
    indirPdf,
    indirWord,
    planToEvrak,
    htmlBelge
  };
})();
