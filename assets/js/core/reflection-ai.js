(function () {
  'use strict';

  /**
   * MB-DOS-003 — ReflectionAI
   * Rule-005: öğretmen geri bildirimi → sonraki ders optimizasyonu
   */

  function analyze(reflection, execution) {
    const text = (reflection || '').trim();
    const lesson = (execution && execution.lessonId) || 'ders';
    if (!text) {
      return {
        aiRecommendation: 'Yansıtma girilmedi. Sonraki derste kazanım tekrarı ve kısa kontrol önerilir.',
        nextLessonAction: 'review-outcomes',
        confidence: 0.4
      };
    }
    const lower = text.toLocaleLowerCase('tr');
    let nextLessonAction = 'continue-plan';
    let aiRecommendation = 'Yansıtma kaydedildi. Günlük plan sıradaki kazanıma geçilebilir.';

    if (/anlamad|zorland|eksik|tekrar/.test(lower)) {
      nextLessonAction = 'reteach';
      aiRecommendation = 'Öğrencilerde zorlanma sinyali var. Sonraki derste aynı kazanımın pekiştirilmesi ve farklılaştırılmış etkinlik önerilir.';
    } else if (/hızlı|erken bit|kolay/.test(lower)) {
      nextLessonAction = 'enrich';
      aiRecommendation = 'Tempo yüksek. Sonraki derste zenginleştirme / derinleştirme etkinliği eklenebilir.';
    } else if (/davranış|disiplin|gürültü/.test(lower)) {
      nextLessonAction = 'classroom-climate';
      aiRecommendation = 'Sınıf iklimi notu alındı. Sonraki derse kısa düzen / geçiş rutini eklenmesi önerilir.';
    }

    return {
      aiRecommendation,
      nextLessonAction,
      confidence: 0.72,
      lessonId: lesson,
      source: 'ReflectionAI'
    };
  }

  window.ReflectionAI = { analyze };
})();
