(function () {
  'use strict';

  async function generateAnnualPlan(options) {
    const { sinif, dersId, okul, ogretmen, kaynakId, sube } = options;
    const egitimYili = options.egitimYili || okul?.egitimYili;

    if (egitimYili && typeof CalendarEngine.setYear === 'function') {
      CalendarEngine.setYear(egitimYili);
    }
    const cal = await CalendarEngine.loadCalendar();
    const curriculum = await CurriculumEngine.loadCurriculum(dersId, sinif, { kaynakId: kaynakId });
    const weeks = CalendarEngine.getTeachingWeeks(cal);
    if (!weeks.length) {
      throw new Error('Öğretim haftası bulunamadı. Takvim dosyasını kontrol edin.');
    }
    const weekPlan = CurriculumEngine.distributeThemesToWeeks(curriculum, weeks.length);

    const rows = weeks.map((w, idx) => {
      const wp = weekPlan[idx] || weekPlan[weekPlan.length - 1] || {};
      const ciktilar = Array.isArray(wp.ogrenmeCiktilari) ? wp.ogrenmeCiktilari : [];
      return {
        hafta: w.hafta,
        tarihAraligi: `${CalendarEngine.fmtDate(w.baslangic)} – ${CalendarEngine.fmtDate(w.bitis)}`,
        donem: w.donem,
        tema: wp.temaAd || wp.tema || 'Tema atanacak',
        ogrenmeCiktilari: ciktilar.length
          ? ciktilar.map(o => (o.kod ? o.kod + ': ' : '') + (o.aciklama || '')).join('; ')
          : (wp.icerikCercevesi || 'Öğrenme çıktısı atanacak'),
        icerikCercevesi: wp.icerikCercevesi || '',
        surecBilesenleri: (wp.surecBilesenleri || []).join(', '),
        olcmeDegerlendirme: wp.olcmeDegerlendirme || '',
        alanBecerileri: (wp.alanBecerileri || []).join(', '),
        farklilastirma: wp.farklilastirma || '',
        etkinlik: '',
        materyal: ''
      };
    });

    const plan = {
      tur: 'yillik',
      sinif,
      ders: curriculum.ders,
      dersId,
      sube: sube || options.sube || 'A',
      kaynakId: curriculum.kaynakId || kaynakId || null,
      kaynak: (curriculum.kaynakMeta && curriculum.kaynakMeta.ad) || curriculum.kaynak || null,
      kaynakUrl: (curriculum.kaynakMeta && curriculum.kaynakMeta.kaynakUrl) || curriculum.kaynakUrl || null,
      kaynakShort: (curriculum.kaynakMeta && curriculum.kaynakMeta.shortLabel) || null,
      model: curriculum.model,
      egitimYili: egitimYili || cal.egitimYili,
      okulAdi: okul?.okulAdi || '',
      ogretmenAdi: ogretmen?.adSoyad || '',
      toplamHafta: weeks.length,
      olusturmaTarihi: new Date().toISOString(),
      satirlar: rows
    };

    return plan;
  }

  function renderAnnualPlanHTML(plan) {
    const rows = plan.satirlar.map(r => `
      <tr>
        <td>${r.hafta}</td>
        <td>${esc(r.tarihAraligi)}</td>
        <td>${esc(r.tema)}</td>
        <td style="font-size:9pt">${esc(r.ogrenmeCiktilari)}</td>
        <td>${esc(r.icerikCercevesi)}</td>
        <td>${esc(r.surecBilesenleri)}</td>
        <td>${esc(r.olcmeDegerlendirme)}</td>
      </tr>`).join('');

    return `
      <div class="doc-letterhead">
        <div class="letterhead-top">
          <div>
            <p class="school-name">${esc(plan.okulAdi) || 'OKUL ADI'}</p>
            <p class="school-sub">${esc(plan.egitimYili)} Eğitim-Öğretim Yılı</p>
          </div>
          <div class="letterhead-right">
            <p>Sınıf: <strong>${esc(plan.sinif)}. Sınıf</strong></p>
            <p>Ders: <strong>${esc(plan.ders)}</strong></p>
          </div>
        </div>
        <h1 class="doc-title">YILLIK PLAN</h1>
        <p class="doc-meta">${esc(plan.model)} · ${esc(plan.kaynakShort || plan.kaynak || '')} · ${new Date(plan.olusturmaTarihi).toLocaleDateString('tr-TR')}</p>
        ${plan.sube ? `<p class="doc-meta">Şube: <strong>${esc(plan.sube)}</strong></p>` : ''}
      </div>
      <table class="doc-table compact">
        <thead><tr>
          <th>Hafta</th><th>Tarih</th><th>Tema</th><th>Öğrenme Çıktıları</th>
          <th>İçerik</th><th>Süreç</th><th>Ölçme</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
        <p class="doc-footer">Öğretmen: ${esc(plan.ogretmenAdi)} &nbsp;|&nbsp; İmza: _______________</p>`;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderAnnualPlanHTMLExtended(plan) {
    const base = renderAnnualPlanHTML(plan);
    const hasExtra = plan.satirlar.some(r => r.alanBecerileri || r.farklilastirma);
    if (!hasExtra) return base;
    const rows = plan.satirlar.map(r => `
      <tr>
        <td>${r.hafta}</td><td>${esc(r.tarihAraligi)}</td><td>${esc(r.tema)}</td>
        <td style="font-size:8pt">${esc(r.ogrenmeCiktilari)}</td>
        <td>${esc(r.alanBecerileri)}</td><td style="font-size:8pt">${esc(r.farklilastirma)}</td>
      </tr>`).join('');
    return base.replace(/<table class="doc-table compact">[\s\S]*<\/table>/,
      `<table class="doc-table compact"><thead><tr>
        <th>Hafta</th><th>Tarih</th><th>Tema</th><th>Öğrenme Çıktıları</th><th>Alan Becerileri</th><th>Farklılaştırma</th>
      </tr></thead><tbody>${rows}</tbody></table>`);
  }

  window.AnnualPlanEngine = {
    generateAnnualPlan,
    renderAnnualPlanHTML: renderAnnualPlanHTMLExtended
  };
})();
