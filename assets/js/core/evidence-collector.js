(function () {
  'use strict';

  /**
   * MB-DOS-003 — EvidenceCollector
   * LessonExecution tamamlanınca kanıt kayıtları
   */

  function collect(execution, opts) {
    const o = opts || {};
    const id = 'evd_' + Date.now();
    const record = {
      id,
      lessonExecutionId: execution.id,
      classId: execution.classId,
      lessonId: execution.lessonId,
      date: execution.date,
      type: o.type || 'learning-evidence',
      summary: o.summary || `Kanıt — ${execution.lessonId} / ${execution.classId}`,
      linkedOutcomes: o.outcomes || [],
      createdAt: new Date().toISOString()
    };

    if (window.MiniBilgeStorage && MiniBilgeStorage.addDocument) {
      MiniBilgeStorage.addDocument({
        title: 'Öğrenme Kanıtı — ' + execution.classId,
        tur: 'evidence',
        lessonExecutionId: execution.id,
        evidenceId: id
      });
    }

    return record;
  }

  window.EvidenceCollector = { collect };
})();
