(function () {
  'use strict';

  function generateDailyPlan(options) {
    const { annualPlan, hafta, gun, dersSaati, tarih } = options;
    if (!annualPlan || !annualPlan.satirlar) {
      throw new Error('Yıllık plan bulunamadı');
    }

    const weekRow = annualPlan.satirlar.find(r => r.hafta === parseInt(hafta, 10))
      || annualPlan.satirlar[0];

    const outcomes = weekRow.ogrenmeCiktilari.split(';').filter(Boolean);

    return {
      tur: 'gunluk',
      sinif: annualPlan.sinif,
      ders: annualPlan.ders,
      egitimYili: annualPlan.egitimYili,
      okulAdi: annualPlan.okulAdi,
      ogretmenAdi: annualPlan.ogretmenAdi,
      tarih: tarih || new Date().toISOString().slice(0, 10),
      gun: gun || 'Pazartesi',
      hafta: weekRow.hafta,
      dersSaati: dersSaati || 1,
      tema: weekRow.tema,
      kazanimlar: outcomes,
      icerikCercevesi: weekRow.icerikCercevesi,
      surecBilesenleri: weekRow.surecBilesenleri,
      etkinlikler: '',
      materyaller: '',
      olcmeDegerlendirme: weekRow.olcmeDegerlendirme,
      olusturmaTarihi: new Date().toISOString()
    };
  }

  function renderDailyPlanHTML(plan) {
    const kazanimList = plan.kazanimlar.map(k => `<li>${esc(k.trim())}</li>`).join('');
    return `
      <div class="doc-letterhead">
        <div class="letterhead-top">
          <div>
            <p class="school-name">${esc(plan.okulAdi) || 'OKUL ADI'}</p>
            <p class="school-sub">${esc(plan.egitimYili)} · ${esc(plan.gun)} · Hafta ${plan.hafta}</p>
          </div>
          <div class="letterhead-right">
            <p>Sınıf: <strong>${esc(plan.sinif)}. Sınıf</strong></p>
            <p>Ders: <strong>${esc(plan.ders)}</strong> (${plan.dersSaati}. saat)</p>
            <p>Tarih: ${fmtDate(plan.tarih)}</p>
          </div>
        </div>
        <h1 class="doc-title">GÜNLÜK DERS PLANI</h1>
      </div>
      <table class="doc-table">
        <tr><th style="width:25%">Tema</th><td>${esc(plan.tema)}</td></tr>
        <tr><th>Öğrenme Çıktıları</th><td><ul class="rules-list">${kazanimList}</ul></td></tr>
        <tr><th>İçerik Çerçevesi</th><td>${esc(plan.icerikCercevesi)}</td></tr>
        <tr><th>Süreç Bileşenleri</th><td>${esc(plan.surecBilesenleri)}</td></tr>
        <tr><th>Etkinlikler</th><td><div class="line tall"></div></td></tr>
        <tr><th>Materyaller</th><td><div class="line"></div></td></tr>
        <tr><th>Ölçme ve Değerlendirme</th><td>${esc(plan.olcmeDegerlendirme)}</td></tr>
      </table>
      <p class="doc-footer">Öğretmen: ${esc(plan.ogretmenAdi)} &nbsp;|&nbsp; İmza: _______________</p>`;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function fmtDate(d) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    return `${parseInt(day,10)} ${months[parseInt(m,10)-1]} ${y}`;
  }

  window.DailyPlanEngine = {
    generateDailyPlan,
    renderDailyPlanHTML
  };
})();
