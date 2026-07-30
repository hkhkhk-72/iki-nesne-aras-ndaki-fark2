(function () {
  'use strict';

  function validatePlanContext(ctx) {
    const errors = [];
    const warnings = [];
    ctx = ctx || {};
    ctx.okul = ctx.okul || {};
    ctx.ogretmen = ctx.ogretmen || {};

    if (!ctx.sinif) errors.push('Sınıf seçilmemiş.');
    if (!ctx.dersId) errors.push('Ders seçilmemiş.');

    if (!String(ctx.okul.okulAdi || '').trim()) {
      warnings.push('Okul adı boş — belgede “Okul adı girilmedi” yazılacak. Hesabım’dan kalıcı kaydedin.');
      ctx.okul.okulAdi = 'Okul adı girilmedi';
    }
    if (!String(ctx.ogretmen.adSoyad || '').trim()) {
      warnings.push('Öğretmen adı boş — belgede “Öğretmen” yazılacak. Hesabım’dan kalıcı kaydedin.');
      ctx.ogretmen.adSoyad = 'Öğretmen';
    }

    if (!ctx.okul.mudurAdi) warnings.push('Müdür adı eksik — resmî belgelerde gerekebilir.');
    if (!ctx.ogretmen.imza) warnings.push('İmza bilgisi eksik.');
    if (!ctx.kaynakId) warnings.push('Kaynak seçilmedi — varsayılan müfredat kullanılacak.');

    return { valid: errors.length === 0, errors, warnings, ctx };
  }

  function validateAnnualPlan(plan) {
    const errors = [];
    if (!plan.satirlar || plan.satirlar.length === 0) {
      errors.push('Plan satırları oluşturulamadı.');
    }
    plan.satirlar?.forEach((row, i) => {
      if (!row.tema) errors.push(`Hafta ${i + 1}: Tema atanmamış.`);
      if (!row.ogrenmeCiktilari) errors.push(`Hafta ${i + 1}: Öğrenme çıktısı eksik.`);
    });
    return { valid: errors.length === 0, errors };
  }

  function validateDailyPlan(plan) {
    const errors = [];
    if (!plan.tema) errors.push('Tema bilgisi eksik.');
    if (!plan.kazanimlar || plan.kazanimlar.length === 0) errors.push('Öğrenme çıktıları bulunamadı.');
    if (!plan.tarih) errors.push('Tarih belirtilmemiş.');
    return { valid: errors.length === 0, errors };
  }

  window.ValidationEngine = {
    validatePlanContext,
    validateAnnualPlan,
    validateDailyPlan
  };
})();
