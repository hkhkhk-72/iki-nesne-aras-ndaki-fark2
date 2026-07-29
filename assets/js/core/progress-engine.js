(function () {
  'use strict';

  /**
   * MB-WFE-001 — ProgressEngine
   * Modül tamamlanma yüzdesi + dashboard kartları
   */

  const MODULES = [
    { id: 'planlar', ad: 'Planlar' },
    { id: 'sinif-yonetimi', ad: 'Sınıf Yönetimi' },
    { id: 'olcme', ad: 'Ölçme' },
    { id: 'resmi-evraklar', ad: 'Resmî Evraklar' },
    { id: 'takvim', ad: 'Takvim' },
    { id: 'etkinlikler', ad: 'Etkinlikler' },
    { id: 'raporlar', ad: 'Raporlar' },
    { id: 'ai', ad: 'MiniBilge AI' }
  ];

  function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function compute(opts) {
    const o = opts || {};
    const plans = o.plans || [];
    const docs = o.documents || [];
    const tasks = o.tasks || [];
    const sinif = o.sinif ? String(o.sinif) : null;

    const yillik = plans.some(p => p.tur === 'yillik' && (!sinif || String(p.sinif) === sinif));
    const gunluk = plans.some(p => p.tur === 'gunluk' && (!sinif || String(p.sinif) === sinif));
    const doneTasks = tasks.filter(t => t.done).length;
    const taskRatio = tasks.length ? (doneTasks / tasks.length) * 100 : 0;
    const docCount = (docs || []).length;

    const byModule = {
      planlar: clamp((yillik ? 50 : 0) + (gunluk ? 30 : 0) + taskRatio * 0.2),
      'sinif-yonetimi': clamp(docCount > 0 ? 35 : 10),
      olcme: clamp(docCount > 2 ? 40 : 15),
      'resmi-evraklar': clamp(Math.min(80, docCount * 12)),
      takvim: 60,
      etkinlikler: clamp(docCount > 1 ? 30 : 10),
      raporlar: clamp(taskRatio * 0.5),
      ai: 20
    };

    const modules = MODULES.map(m => ({
      id: m.id,
      ad: m.ad,
      percent: byModule[m.id] != null ? byModule[m.id] : 0
    }));

    const overall = clamp(
      modules.reduce((s, m) => s + m.percent, 0) / modules.length
    );

    return {
      overall,
      modules,
      flags: { hasYillik: yillik, hasGunluk: gunluk, documentCount: docCount },
      teacherPanel: {
        label: o.label || '',
        overall,
        openTasks: tasks.filter(t => !t.done).length,
        overdue: (o.overdueCount || 0)
      }
    };
  }

  window.ProgressEngine = {
    MODULES,
    compute
  };
})();
