(function () {
  'use strict';

  async function generateAnnualPlan(options) {
    const { sinif, dersId, okul, ogretmen, egitimYili } = options;

    const cal = await CalendarEngine.loadCalendar();
    const curriculum = await CurriculumEngine.loadCurriculum(dersId, sinif);
    const weeks = CalendarEngine.getTeachingWeeks(cal);
    const weekPlan = CurriculumEngine.distributeThemesToWeeks(curriculum, weeks.length);

    const rows = weeks.map((w, idx) => {
      const wp = weekPlan[idx] || weekPlan[weekPlan.length - 1];
      return {
        hafta: w.hafta,
        tarihAraligi: `${CalendarEngine.fmtDate(w.baslangic)} – ${CalendarEngine.fmtDate(w.bitis)}`,
        donem: w.donem,
        tema: wp.temaAd,
        ogrenmeCiktilari: wp.ogrenmeCiktilari.map(o => o.kod + ': ' + o.aciklama).join('; '),
        icerikCercevesi: wp.icerikCercevesi,
        surecBilesenleri: (wp.surecBilesenleri || []).join(', '),
        olcmeDegerlendirme: wp.olcmeDegerlendirme || '',
        etkinlik: '',
        materyal: ''
      };
    });

    const plan = {
      tur: 'yillik',
      sinif,
      ders: curriculum.ders,
      dersId,
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
        <p class="doc-meta">${esc(plan.model)} · Otomatik üretilmiştir · ${new Date(plan.olusturmaTarihi).toLocaleDateString('tr-TR')}</p>
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

  window.AnnualPlanEngine = {
    generateAnnualPlan,
    renderAnnualPlanHTML
  };
})();
