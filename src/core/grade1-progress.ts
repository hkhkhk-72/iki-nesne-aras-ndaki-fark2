/**
 * 1. Sınıf öğrenci yolu — hangi etkinlikler "bitirme" sayılır.
 * Akıllı tahta sınıf/öğretmen modudur; çocuğun %100'ünü kilitlemez.
 * Kazanıma bağlı MES macerası varsa öğrenci yolunda zorunludur.
 */

import type { ActivityConfig, ActivityMode, LearningOutcome, StudentProgress } from './types';
import { DEFAULT_SUBJECT } from './subject-registry';

export const GRADE1_STUDENT_MODES: ReadonlySet<ActivityMode> = new Set([
  'learn',
  'play',
  'explore',
  'experiment',
  'home',
  'real_life',
  'challenge',
]);

export function isStudentTrackActivity(activity: ActivityConfig): boolean {
  return GRADE1_STUDENT_MODES.has(activity.mode);
}

export function studentTrackActivities(outcome: LearningOutcome): ActivityConfig[] {
  return outcome.activities.filter(isStudentTrackActivity);
}

function matchesOutcome(
  p: StudentProgress,
  outcomeId: string,
  subject = DEFAULT_SUBJECT,
): boolean {
  return (p.subject ?? subject) === subject && p.outcomeId === outcomeId;
}

function completedExperienceIds(
  outcome: LearningOutcome,
  progress: StudentProgress[],
): Set<string> {
  return new Set(
    progress
      .filter(
        (p) =>
          matchesOutcome(p, outcome.id, outcome.subject) &&
          p.completed &&
          p.activityId.startsWith('exp-'),
      )
      .map((p) => p.activityId),
  );
}

/** Kazanım öğrenci yolu yüzdesi (smartboard hariç; macera varsa zorunlu). */
export function calculateStudentOutcomeProgress(
  outcome: LearningOutcome,
  progress: StudentProgress[],
  requiredExperienceCodes: readonly string[] = [],
): number {
  const track = studentTrackActivities(outcome);
  const doneExps = completedExperienceIds(outcome, progress);
  const expTotal = requiredExperienceCodes.length;
  const expDone =
    expTotal > 0
      ? requiredExperienceCodes.filter((code) => doneExps.has(`exp-${code}`)).length
      : 0;

  const total = track.length + expTotal;
  if (total === 0) return 0;

  const doneActs = track.filter((a) =>
    progress.some(
      (p) =>
        matchesOutcome(p, outcome.id, outcome.subject) &&
        p.activityId === a.id &&
        p.completed,
    ),
  ).length;

  return Math.min(100, Math.round(((doneActs + expDone) / total) * 100));
}

/** Sınıf genel öğrenci yolu ilerlemesi. */
export function calculateGradeStudentProgress(
  outcomes: LearningOutcome[],
  progress: StudentProgress[],
  experiencesByOutcome: ReadonlyMap<string, readonly string[]> = new Map(),
): { percent: number; completedOutcomes: number; totalOutcomes: number } {
  if (outcomes.length === 0) {
    return { percent: 0, completedOutcomes: 0, totalOutcomes: 0 };
  }
  let sum = 0;
  let completedOutcomes = 0;
  for (const o of outcomes) {
    const pct = calculateStudentOutcomeProgress(
      o,
      progress,
      experiencesByOutcome.get(o.id) ?? [],
    );
    sum += pct;
    if (pct >= 100) completedOutcomes += 1;
  }
  return {
    percent: Math.round(sum / outcomes.length),
    completedOutcomes,
    totalOutcomes: outcomes.length,
  };
}

/** İlk tamamlanmamış öğrenci kazanımı. */
export function nextIncompleteOutcome(
  outcomes: LearningOutcome[],
  progress: StudentProgress[],
  experiencesByOutcome: ReadonlyMap<string, readonly string[]> = new Map(),
): LearningOutcome | null {
  return (
    outcomes.find(
      (o) =>
        calculateStudentOutcomeProgress(
          o,
          progress,
          experiencesByOutcome.get(o.id) ?? [],
        ) < 100,
    ) ?? null
  );
}

/** Kazanımda sonraki açık öğrenci etkinliği (macera ayrı CTA). */
export function nextStudentActivity(
  outcome: LearningOutcome,
  progress: StudentProgress[],
): ActivityConfig | null {
  return (
    studentTrackActivities(outcome).find(
      (a) =>
        !progress.some(
          (p) =>
            matchesOutcome(p, outcome.id, outcome.subject) &&
            p.activityId === a.id &&
            p.completed,
        ),
    ) ?? null
  );
}
