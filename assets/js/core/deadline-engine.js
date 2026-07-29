(function () {
  'use strict';

  /**
   * MB-WFE-001 — DeadlineEngine
   * Resmî teslim, yaklaşan / geciken görevler
   */

  function daysUntil(dateStr, today) {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    if (Number.isNaN(due.getTime())) return null;
    return Math.floor((due.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86400000);
  }

  function classify(task, today) {
    const d = daysUntil(task.dueDate, new Date(today.getTime()));
    if (d == null) {
      return Object.assign({}, task, { deadlineStatus: 'none', daysLeft: null });
    }
    if (d < 0) {
      return Object.assign({}, task, { deadlineStatus: 'overdue', daysLeft: d });
    }
    if (d <= 3) {
      return Object.assign({}, task, { deadlineStatus: 'soon', daysLeft: d });
    }
    return Object.assign({}, task, { deadlineStatus: 'ok', daysLeft: d });
  }

  function fromCalendar(cal, today) {
    const items = [];
    const t = today || new Date();
    const upcoming = (window.CalendarEngine && CalendarEngine.getUpcomingEvents)
      ? CalendarEngine.getUpcomingEvents(cal, t, 8)
      : [];
    upcoming.forEach((e, i) => {
      items.push({
        id: 'cal-' + i + '-' + (e.tarih || i),
        text: e.ad || 'Takvim maddesi',
        dueDate: e.tarih,
        kind: 'calendar',
        href: 'modules/takvim.html',
        basePriority: 50
      });
    });
    return items;
  }

  function track(tasks, opts) {
    const o = opts || {};
    const today = o.today || new Date();
    const calItems = o.cal ? fromCalendar(o.cal, today) : [];
    const merged = (tasks || []).concat(calItems);
    const tracked = merged.map(t => classify(t, today));
    return {
      all: tracked,
      soon: tracked.filter(t => t.deadlineStatus === 'soon'),
      overdue: tracked.filter(t => t.deadlineStatus === 'overdue'),
      upcoming: tracked
        .filter(t => t.deadlineStatus === 'soon' || t.deadlineStatus === 'ok')
        .slice(0, 6)
    };
  }

  window.DeadlineEngine = {
    track,
    classify,
    fromCalendar,
    daysUntil
  };
})();
