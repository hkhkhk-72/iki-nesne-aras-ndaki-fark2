(function () {
  'use strict';

  /**
   * Günlük Kazanım Motoru — Sınıf defteri için
   * Sınıf + ders + tarih → o güne düşen öğrenme çıktıları
   * Kaynak önceliği: Yıllık plan satırı → Curriculum tema dağılımı
   */

  function parseOutcomeText(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map(item => {
        if (typeof item === 'string') {
          const m = item.match(/^([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9.]+)\s*[—\-–:]?\s*(.*)$/i);
          if (m) return { kod: m[1], aciklama: m[2] || item };
          return { kod: '', aciklama: item };
        }
        return { kod: item.kod || '', aciklama: item.aciklama || String(item) };
      }).filter(o => o.aciklama || o.kod);
    }
    return String(raw).split(';').map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/^([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9.]+)\s*[—\-–:]?\s*(.*)$/i);
      if (m) return { kod: m[1], aciklama: m[2] || s };
      return { kod: '', aciklama: s };
    });
  }

  function findAnnualPlan(plans, dersId, sinif) {
    const list = plans || [];
    return list.find(p =>
      p.tur === 'yillik' && p.data &&
      String(p.data.sinif || p.sinif) === String(sinif) &&
      (p.dersId === dersId || p.data.dersId === dersId)
    ) || list.find(p =>
      p.tur === 'yillik' && p.data &&
      (p.dersId === dersId || p.data.dersId === dersId)
    ) || null;
  }

  async function resolveGunlukKazanımlar(opts) {
    const {
      sinif,
      dersId,
      tarih,
      cal,
      plans,
      sube
    } = opts;

    if (!window.CalendarEngine || !window.CurriculumEngine) {
      throw new Error('Takvim veya öğretim programı motoru yüklenmedi');
    }

    await CurriculumEngine.loadManifest();

    const date = CalendarEngine.parseDate(tarih);
    const gunAdlari = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const gunAdi = gunAdlari[date.getDay()];
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const holiday = CalendarEngine.isHoliday(date, cal);

    const dersAd = CurriculumEngine.getDersAdi(dersId, sinif);

    const base = {
      sinif: String(sinif),
      sube: sube || 'A',
      dersId,
      dersAd,
      tarih,
      gunAdi,
      weekend,
      holiday: holiday ? holiday.ad : null,
      hafta: null,
      tema: '',
      kaynak: null,
      kazanimlar: [],
      uyari: null
    };

    if (weekend) {
      return { ...base, uyari: 'Seçilen tarih hafta sonu — öğretim günü değil.' };
    }
    if (holiday) {
      return { ...base, uyari: `Seçilen tarih tatil: ${holiday.ad}` };
    }

    const week = CalendarEngine.getCurrentWeek(cal, date);
    base.hafta = week ? week.hafta : null;

    const annualWrap = findAnnualPlan(plans, dersId, sinif);
    if (annualWrap && annualWrap.data && annualWrap.data.satirlar) {
      const row = annualWrap.data.satirlar.find(r => Number(r.hafta) === Number(week.hafta))
        || annualWrap.data.satirlar[0];
      const kazanimlar = parseOutcomeText(row.ogrenmeCiktilari);
      return {
        ...base,
        tema: row.tema || row.temaAd || '',
        kaynak: 'yillik-plan',
        kazanimlar,
        icerikCercevesi: row.icerikCercevesi || '',
        annualPlanId: annualWrap.id
      };
    }

    // Curriculum dağılımı (yıllık plan yoksa)
    try {
      await CurriculumEngine.loadManifest();
      const curriculum = await CurriculumEngine.loadCurriculum(dersId, sinif);
      const weeks = CalendarEngine.getTeachingWeeks(cal);
      const dist = CurriculumEngine.distributeThemesToWeeks(curriculum, weeks.length || 36);
      const row = dist.find(r => Number(r.hafta) === Number(week.hafta)) || dist[0];
      const kazanimlar = (row.ogrenmeCiktilari || []).map(oc => ({
        kod: oc.kod || '',
        aciklama: oc.aciklama || ''
      }));
      return {
        ...base,
        tema: row.temaAd || '',
        kaynak: 'curriculum',
        kazanimlar,
        icerikCercevesi: row.icerikCercevesi || '',
        uyari: 'Yıllık plan bulunamadı — kazanımlar öğretim programı tema dağılımından üretildi.'
      };
    } catch (err) {
      return {
        ...base,
        uyari: err.message || 'Bu ders için program verisi yüklenemedi.',
        kazanimlar: []
      };
    }
  }

  async function resolveGunlukTumDersler(opts) {
    const { sinif, tarih, cal, plans, sube } = opts;
    await CurriculumEngine.loadManifest();
    const courses = await CurriculumEngine.listAvailableCourses(sinif, { onlyProgram: true });
    const results = [];
    for (const c of courses) {
      results.push(await resolveGunlukKazanımlar({
        sinif, dersId: c.id, tarih, cal, plans, sube
      }));
    }
    return results;
  }

  function renderDefterHTML(entry, meta) {
    const school = meta.okulAdi || 'OKUL ADI';
    const teacher = meta.ogretmenAdi || '';
    const egitimYili = meta.egitimYili || '';
    const list = (entry.kazanimlar || []).map((k, i) => {
      const line = k.kod ? `<strong>${esc(k.kod)}</strong> — ${esc(k.aciklama)}` : esc(k.aciklama);
      return `<li>${line}</li>`;
    }).join('');

    return `
      <div class="doc-letterhead">
        <div class="letterhead-top">
          <div>
            <p class="school-name">${esc(school)}</p>
            <p class="school-sub">${esc(egitimYili)} · Sınıf Defteri</p>
          </div>
          <div class="letterhead-right">
            <p>Sınıf: <strong>${esc(entry.sinif)} / ${esc(entry.sube)}</strong></p>
            <p>Ders: <strong>${esc(entry.dersAd)}</strong></p>
            <p>Tarih: ${esc(fmtTr(entry.tarih))} (${esc(entry.gunAdi)})</p>
            <p>Hafta: <strong>${entry.hafta != null ? entry.hafta : '—'}</strong></p>
          </div>
        </div>
        <h1 class="doc-title">Günlük Kazanımlar</h1>
      </div>
      <table class="doc-table">
        <tr><th style="width:28%">Tema / Birim</th><td>${esc(entry.tema) || '—'}</td></tr>
        <tr><th>Öğrenme Çıktıları</th><td>
          ${list ? `<ul class="rules-list">${list}</ul>` : '<em>Bu tarih için kazanım bulunamadı.</em>'}
        </td></tr>
        ${entry.icerikCercevesi ? `<tr><th>İçerik Çerçevesi</th><td>${esc(entry.icerikCercevesi)}</td></tr>` : ''}
        <tr><th>Kaynak</th><td>${entry.kaynak === 'yillik-plan' ? 'Yıllık plan' : entry.kaynak === 'curriculum' ? 'Öğretim programı' : '—'}</td></tr>
      </table>
      <p class="doc-footer">Öğretmen: ${esc(teacher)} &nbsp;|&nbsp; İmza: _______________</p>`;
  }

  function renderDefterGunHTML(entries, meta) {
    const blocks = entries
      .filter(e => !e.weekend && !e.holiday && e.kazanimlar && e.kazanimlar.length)
      .map(e => renderDefterHTML(e, meta))
      .join('<div style="page-break-after:always"></div>');
    if (!blocks) {
      return `<p>Seçilen tarihte yazdırılacak kazanım bulunamadı.</p>`;
    }
    return blocks;
  }

  function toPlainText(entry) {
    const lines = [
      `Günlük Kazanımlar — ${fmtTr(entry.tarih)} (${entry.gunAdi})`,
      `Sınıf: ${entry.sinif}/${entry.sube} · Ders: ${entry.dersAd} · Hafta: ${entry.hafta ?? '—'}`,
      entry.tema ? `Tema: ${entry.tema}` : '',
      '',
      'Öğrenme çıktıları:'
    ];
    (entry.kazanimlar || []).forEach((k, i) => {
      lines.push(`${i + 1}. ${k.kod ? k.kod + ' — ' : ''}${k.aciklama}`);
    });
    return lines.filter(Boolean).join('\n');
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtTr(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
  }

  window.KazanimEngine = {
    resolveGunlukKazanımlar,
    resolveGunlukTumDersler,
    renderDefterHTML,
    renderDefterGunHTML,
    toPlainText,
    parseOutcomeText,
    findAnnualPlan
  };
})();
