(function () {
  'use strict';

  /**
   * Üretim Sihirbazı — UX: Sınıf → Ders → Bilgiler → Üret
   */
  function renderWizard(steps, activeStep) {
    return `<div class="wizard-steps no-print">
      ${steps.map((s, i) => {
        const num = i + 1;
        const cls = num < activeStep ? 'done' : num === activeStep ? 'active' : '';
        return `<div class="wizard-step ${cls}">
          <span class="wizard-num">${num}</span>
          <span class="wizard-label">${s}</span>
        </div>${i < steps.length - 1 ? '<div class="wizard-line"></div>' : ''}`;
      }).join('')}
    </div>`;
  }

  const STEPS = ['Sınıf', 'Ders', 'Bilgiler', 'Üret'];

  window.UretimWizard = {
    STEPS,
    render: (active) => renderWizard(STEPS, active)
  };
})();
