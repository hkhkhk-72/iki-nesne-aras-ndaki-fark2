(function () {
  'use strict';

  /**
   * MB-DOS-003 — LessonReplay
   * Geçmiş LessonExecution özeti / yeniden oynatma görünümü
   */

  function replay(execution) {
    if (!execution) return null;
    return {
      id: execution.id,
      title: `${execution.classId} · ${execution.lessonId} · ${execution.date}`,
      status: execution.executionStatus,
      timeline: [
        { at: execution.startTime, label: 'Başladı' },
        { at: execution.endTime, label: 'Bitti' }
      ].filter(x => x.at),
      reflection: execution.teacherReflection || '',
      aiRecommendation: execution.aiRecommendation || '',
      nextLessonAction: execution.nextLessonAction || '',
      evidenceCount: (execution.evidenceIds || []).length,
      assessmentCount: (execution.assessmentIds || []).length,
      attendanceId: execution.attendanceId,
      classLogReady: execution.executionStatus === 'COMPLETED'
    };
  }

  function listRecent(limit) {
    const list = (window.MiniBilgeStorage && MiniBilgeStorage.getLessonExecutions)
      ? MiniBilgeStorage.getLessonExecutions()
      : [];
    return list.slice(0, limit || 10).map(replay);
  }

  window.LessonReplay = { replay, listRecent };
})();
