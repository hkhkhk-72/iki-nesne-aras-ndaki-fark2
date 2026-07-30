(function () {
  'use strict';

  /**
   * MB-WFE-001 — SmartTaskEngine
   * Günlük / haftalık / dönemlik görev + öncelik puanı
   */

  function priorityScore(task, today) {
    let p = task.basePriority || 50;
    if (task.dueDate) {
      const due = new Date(task.dueDate);
      const days = Math.floor((due - today) / 86400000);
      if (days < 0) p += 40;
      else if (days === 0) p += 30;
      else if (days <= 3) p += 20;
      else if (days <= 7) p += 10;
    }
    if (task.stage === 'year-prep' && !task.done) p += 15;
    if (task.kind === 'daily') p += 5;
    return Math.min(100, p);
  }

  function buildDaily(ctx, week, opts) {
    const o = opts || {};
    const label = (ctx && ctx.label) || '1/A';
    const hafta = week && week.hafta;
    const tasks = [
      {
        id: 'daily-plan',
        kind: 'daily',
        stage: 'daily-flow',
        text: `${label} — bugünkü günlük plan`,
        href: 'modules/gunluk-plan.html',
        docHint: 'DOC-PLN-002',
        basePriority: 70,
        done: !!o.hasGunlukToday
      },
      {
        id: 'daily-kazanim',
        kind: 'daily',
        stage: 'post-lesson',
        text: 'Ders sonrası — günlük kazanımlar / sınıf defteri',
        href: 'modules/gunluk-kazanimlar.html',
        docHint: 'DOC-SNF-001',
        basePriority: 65,
        done: false
      },
      {
        id: 'daily-yoklama',
        kind: 'daily',
        stage: 'post-lesson',
        text: 'Yoklama kaydı',
        href: 'documents/olustur.html?id=devamsizlik-takip',
        basePriority: 55,
        done: false
      }
    ];
    if (hafta) {
      tasks.push({
        id: 'weekly-review',
        kind: 'weekly',
        stage: 'weekly-plan',
        text: `Hafta ${hafta} planını kontrol et`,
        href: 'modules/gunluk-plan.html',
        basePriority: 60,
        done: false
      });
    }
    return tasks;
  }

  function buildWeekly(ctx, week) {
    const label = (ctx && ctx.label) || '1/A';
    return [
      {
        id: 'weekly-plans',
        kind: 'weekly',
        stage: 'weekly-plan',
        text: `${label} — haftalık planlama turu`,
        href: 'modules/gunluk-plan.html',
        basePriority: 58,
        done: false
      },
      {
        id: 'weekly-rehberlik',
        kind: 'weekly',
        stage: 'weekly-plan',
        text: 'Haftalık rehberlik / etkinlik kontrolü',
        href: 'modules/rehberlik.html',
        basePriority: 40,
        done: false
      }
    ];
  }

  function buildTerm(ctx, stage, opts) {
    const o = opts || {};
    const tasks = [];
    if (stage === 'year-prep' || !o.hasYillik) {
      tasks.push({
        id: 'term-yillik',
        kind: 'term',
        stage: 'year-prep',
        text: 'Eğitim yılı hazırlığı — yıllık plan',
        href: 'modules/yillik-plan.html',
        docHint: 'DOC-PLN-001',
        basePriority: 85,
        done: !!o.hasYillik,
        dueDate: o.yillikDue || null
      });
    }
    if (stage === 'term-end') {
      tasks.push({
        id: 'term-zumre',
        kind: 'term',
        stage: 'term-end',
        text: 'Dönem sonu — zümre / ölçme raporları',
        href: 'modules/zumre.html',
        docHint: 'DOC-RSM-001',
        basePriority: 75,
        done: false
      });
    }
    if (stage === 'year-archive') {
      tasks.push({
        id: 'year-archive',
        kind: 'term',
        stage: 'year-archive',
        text: 'Yıl sonu arşivleme',
        href: 'modules/raporlar.html',
        basePriority: 80,
        done: false
      });
    }
    return tasks;
  }

  function generate(opts) {
    const o = opts || {};
    const today = o.today || new Date();
    const ctx = o.ctx || { label: '1/A' };
    const week = o.week;
    const stage = o.stage || 'daily-flow';
    const all = []
      .concat(buildDaily(ctx, week, o))
      .concat(buildWeekly(ctx, week))
      .concat(buildTerm(ctx, stage, o));

    return all
      .map(t => Object.assign({}, t, { priority: priorityScore(t, today) }))
      .sort((a, b) => b.priority - a.priority);
  }

  window.SmartTaskEngine = {
    generate,
    priorityScore,
    buildDaily,
    buildWeekly,
    buildTerm
  };
})();
