(function () {
  'use strict';

  /**
   * Plan Motoru — Sistemin Beyni
   * Öğretim Programı + Takvim + Öğretmen bilgilerini harmanlar.
   */
  async function uretYillikPlan(ctx) {
    const validation = ValidationEngine.validatePlanContext(ctx);
    if (!validation.valid) {
      return { success: false, errors: validation.errors, warnings: validation.warnings };
    }
    try {
      const cleanCtx = validation.ctx || ctx;
      const plan = await AnnualPlanEngine.generateAnnualPlan(cleanCtx);
      const planCheck = ValidationEngine.validateAnnualPlan(plan);
      if (!planCheck.valid) {
        return { success: false, errors: planCheck.errors, warnings: validation.warnings };
      }
      return { success: true, plan, warnings: validation.warnings || [] };
    } catch (err) {
      return { success: false, errors: [err.message || String(err)], warnings: validation.warnings || [] };
    }
  }

  function uretGunlukPlan(ctx) {
    const { annualPlan, hafta, gun, dersSaati, tarih } = ctx;
    const plan = DailyPlanEngine.generateDailyPlan({ annualPlan, hafta, gun, dersSaati, tarih });
    const check = ValidationEngine.validateDailyPlan(plan);
    if (!check.valid) {
      return { success: false, errors: check.errors };
    }
    return { success: true, plan };
  }

  function renderYillikPlan(plan) {
    return AnnualPlanEngine.renderAnnualPlanHTML(plan);
  }

  function renderGunlukPlan(plan) {
    return DailyPlanEngine.renderDailyPlanHTML(plan);
  }

  window.PlanEngine = {
    uretYillikPlan,
    uretGunlukPlan,
    renderYillikPlan,
    renderGunlukPlan
  };
})();
