(function () {
  'use strict';

  let calendarData = null;

  function getBase() {
    return window.MINIBILGE_BASE || '';
  }

  async function loadCalendar() {
    if (calendarData) return calendarData;
    const res = await fetch(getBase() + 'assets/data/calendar-2025-2026.json');
    calendarData = await res.json();
    return calendarData;
  }

  function parseDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function fmtDate(d) {
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function isWeekend(d) {
    const day = d.getDay();
    return day === 0 || day === 6;
  }

  function isHoliday(date, cal) {
    const t = date.getTime();
    for (const h of cal.tatiller) {
      const start = parseDate(h.baslangic).getTime();
      const end = parseDate(h.bitis).getTime();
      if (t >= start && t <= end) return h;
    }
    return null;
  }

  function getSchoolDays(cal, start, end) {
    const days = [];
    const cur = new Date(start);
    while (cur <= end) {
      if (!isWeekend(cur) && !isHoliday(cur, cal)) {
        days.push(new Date(cur));
      }
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }

  function getTeachingWeeks(cal) {
    const donem1Start = parseDate(cal.donemler[0].baslangic);
    const donem1End = parseDate(cal.donemler[0].bitis);
    const donem2Start = parseDate(cal.donemler[1].baslangic);
    const donem2End = parseDate(cal.donemler[1].bitis);

    const d1 = getSchoolDays(cal, donem1Start, donem1End);
    const d2 = getSchoolDays(cal, donem2Start, donem2End);
    const all = [...d1, ...d2];

    const weeks = [];
    let weekNum = 1;
    let i = 0;
    while (i < all.length) {
      const weekDays = all.slice(i, i + 5);
      if (weekDays.length > 0) {
        weeks.push({
          hafta: weekNum,
          baslangic: weekDays[0],
          bitis: weekDays[weekDays.length - 1],
          gunSayisi: weekDays.length,
          donem: weekNum <= Math.ceil(d1.length / 5) ? 1 : 2
        });
        weekNum++;
      }
      i += 5;
    }
    return weeks;
  }

  function getUpcomingEvents(cal, fromDate, limit = 5) {
    const today = fromDate || new Date();
    today.setHours(0, 0, 0, 0);
    const events = [];

    cal.belirliGunler.forEach(e => {
      const start = e.tarih ? parseDate(e.tarih) : parseDate(e.baslangic);
      const end = e.bitis ? parseDate(e.bitis) : start;
      if (end >= today) {
        events.push({ ...e, start, end });
      }
    });

    cal.tatiller.forEach(t => {
      const start = parseDate(t.baslangic);
      if (start >= today) {
        events.push({ ad: t.ad, start, end: parseDate(t.bitis), tur: t.tur });
      }
    });

    return events
      .sort((a, b) => a.start - b.start)
      .slice(0, limit)
      .map(e => ({
        ad: e.ad,
        tarih: e.tarih ? fmtDate(e.start) : `${fmtDate(e.start)} – ${fmtDate(e.end)}`,
        tur: e.tur,
        start: e.start
      }));
  }

  function getCurrentWeek(cal, date) {
    const weeks = getTeachingWeeks(cal);
    const d = date || new Date();
    return weeks.find(w => d >= w.baslangic && d <= w.bitis) || weeks[0];
  }

  function getWeeklyHours(cal, sinif) {
    return cal.haftalikDersSaati[String(sinif)] || {};
  }

  window.CalendarEngine = {
    loadCalendar,
    parseDate,
    fmtDate,
    getTeachingWeeks,
    getUpcomingEvents,
    getCurrentWeek,
    getWeeklyHours,
    isHoliday,
    getSchoolDays
  };
})();
