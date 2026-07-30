import type { Grade, GradeCurriculum, SubjectId } from './types';
import {
  DEFAULT_SUBJECT,
  getEnabledSubjects,
  getSubject,
  getSubjectCurriculum,
} from './subject-registry';
import { initializeSubjects } from '@/subjects';

/**
 * İçerik erişim katmanı.
 *
 * Tüm sorgular ders (subject) boyutunu taşır; varsayılan matematiktir, bu
 * sayede mevcut ekranlar ve route'lar değişmeden çalışır. Yeni bir ders
 * eklendiğinde aynı fonksiyonlar subject parametresiyle kullanılır.
 */

/** Registry'nin dolu olmasını garanti eder (idempotent). */
function ensureReady(): void {
  initializeSubjects();
}

export function getCurriculum(
  grade: number,
  subject: SubjectId = DEFAULT_SUBJECT,
): GradeCurriculum | undefined {
  ensureReady();
  return getSubjectCurriculum(subject, grade as Grade);
}

export function getOutcome(
  grade: number,
  outcomeId: string,
  subject: SubjectId = DEFAULT_SUBJECT,
) {
  return getCurriculum(grade, subject)?.outcomes.find((o) => o.id === outcomeId);
}

export function getUnit(
  grade: number,
  unitId: string,
  subject: SubjectId = DEFAULT_SUBJECT,
) {
  return getCurriculum(grade, subject)?.units.find((u) => u.id === unitId);
}

export function getActivity(
  grade: number,
  outcomeId: string,
  activityId: string,
  subject: SubjectId = DEFAULT_SUBJECT,
) {
  return getOutcome(grade, outcomeId, subject)?.activities.find((a) => a.id === activityId);
}

export function getAllGrades(subject: SubjectId = DEFAULT_SUBJECT): number[] {
  ensureReady();
  return getSubject(subject)?.meta.grades ?? [];
}

export function getAllCurricula(subject: SubjectId = DEFAULT_SUBJECT): GradeCurriculum[] {
  ensureReady();
  const module = getSubject(subject);
  if (!module) return [];
  return module.meta.grades
    .map((g) => module.getCurriculum(g))
    .filter((c): c is GradeCurriculum => Boolean(c));
}

export function getCurriculumStats(subject: SubjectId = DEFAULT_SUBJECT) {
  return getAllCurricula(subject).map((c) => ({
    subject: c.subject,
    grade: c.grade,
    title: c.title,
    units: c.units.length,
    outcomes: c.outcomes.length,
    activities: c.outcomes.reduce((sum, o) => sum + o.activities.length, 0),
  }));
}

export function getTotalStats(subject: SubjectId = DEFAULT_SUBJECT) {
  const stats = getCurriculumStats(subject);
  return {
    grades: stats.length,
    units: stats.reduce((s, g) => s + g.units, 0),
    outcomes: stats.reduce((s, g) => s + g.outcomes, 0),
    activities: stats.reduce((s, g) => s + g.activities, 0),
    byGrade: stats,
  };
}

/** Tüm etkin derslerin toplamı — Eğitim OS genel görünümü. */
export function getPlatformStats() {
  ensureReady();
  return getEnabledSubjects().map((s) => ({
    ...s.meta,
    ...getTotalStats(s.meta.id),
  }));
}
