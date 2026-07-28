(function () {
  'use strict';

  function validatePlanContext(ctx) {
    const errors = [];
    const warnings = [];

    if (!ctx.okul?.okulAdi) errors.push('Okul adı girilmemiş.');
    if (!ctx.ogretmen?.adSoyad) errors.push('Öğretmen adı soyadı girilmemiş.');
    if (!ctx.sinif) errors.push('Sınıf seçilmemiş.');
    if (!ctx.dersId) errors.push('Ders seçilmemiş.');

    if (!ctx.okul?.mudurAdi) warnings.push('Müdür adı eksik — resmî belgelerde gerekebilir.');
    if (!ctx.ogretmen?.imza) warnings.push('İmza bilgisi eksik.');

    return { valid: errors.length === 0, errors, warnings };
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
