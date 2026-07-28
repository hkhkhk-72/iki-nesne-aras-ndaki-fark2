import type {
  ActivityConfig,
  LearningOutcome,
  StudentProgress,
  SubjectId,
} from './types';
import { DEFAULT_SUBJECT } from './subject-registry';

const LESSON_ACTIVITY_SUFFIX = '-learn';

export function isLessonActivity(activityId: string): boolean {
  return activityId.endsWith(LESSON_ACTIVITY_SUFFIX);
}

/**
 * Kazanım kimlikleri dersler arasında tekrar edebileceği için (örn. hem
 * matematik hem Türkçe'de out-1-2-1) eşleşme her zaman ders + kazanım
 * ikilisi üzerinden yapılır.
 */
function matchesOutcome(
  p: StudentProgress,
  outcomeId: string,
  subject: SubjectId,
): boolean {
  return p.subject === subject && p.outcomeId === outcomeId;
}

export function isLessonCompleted(
  outcomeId: string,
  progress: StudentProgress[],
  subject: SubjectId = DEFAULT_SUBJECT,
): boolean {
  return progress.some(
    (p) => matchesOutcome(p, outcomeId, subject) && isLessonActivity(p.activityId) && p.completed,
  );
}

export function isPlayCompleted(
  outcomeId: string,
  progress: StudentProgress[],
  subject: SubjectId = DEFAULT_SUBJECT,
): boolean {
  return progress.some(
    (p) => matchesOutcome(p, outcomeId, subject) && p.activityId.includes('-play') && p.completed,
  );
}

/** Meydan okuma, konu anlatımı ve oyna modu tamamlanınca açılır. */
export function resolveActivityUnlock(
  activity: ActivityConfig,
  outcomeId: string,
  progress: StudentProgress[],
  subject: SubjectId = DEFAULT_SUBJECT,
): boolean {
  if (activity.mode === 'challenge') {
    return (
      isLessonCompleted(outcomeId, progress, subject) &&
      isPlayCompleted(outcomeId, progress, subject)
    );
  }
  return activity.unlocked;
}

export function getUnlockedActivities(
  outcome: LearningOutcome,
  progress: StudentProgress[],
): ActivityConfig[] {
  return outcome.activities.map((a) => ({
    ...a,
    unlocked: resolveActivityUnlock(a, outcome.id, progress, outcome.subject),
  }));
}

export function calculateOutcomeProgress(
  outcome: LearningOutcome,
  progress: StudentProgress[],
): number {
  const activityIds = outcome.activities.map((a) => a.id);
  if (activityIds.length === 0) return 0;
  const completed = activityIds.filter((id) =>
    progress.some(
      (p) => matchesOutcome(p, outcome.id, outcome.subject) && p.activityId === id && p.completed,
    ),
  ).length;
  return Math.round((completed / activityIds.length) * 100);
}

export function countCompletedLessons(
  progress: StudentProgress[],
  subject?: SubjectId,
): number {
  return progress.filter(
    (p) =>
      isLessonActivity(p.activityId) &&
      p.completed &&
      (subject ? p.subject === subject : true),
  ).length;
}
