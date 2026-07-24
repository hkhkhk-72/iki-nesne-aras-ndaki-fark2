import type { ActivityConfig, LearningOutcome, StudentProgress } from './types';

const LESSON_ACTIVITY_SUFFIX = '-learn';

export function isLessonActivity(activityId: string): boolean {
  return activityId.endsWith(LESSON_ACTIVITY_SUFFIX);
}

export function isLessonCompleted(outcomeId: string, progress: StudentProgress[]): boolean {
  return progress.some(
    (p) => p.outcomeId === outcomeId && isLessonActivity(p.activityId) && p.completed,
  );
}

export function isPlayCompleted(outcomeId: string, progress: StudentProgress[]): boolean {
  return progress.some(
    (p) =>
      p.outcomeId === outcomeId &&
      p.activityId.includes('-play') &&
      p.completed,
  );
}

/** Challenge unlocks after lesson + play mode completed */
export function resolveActivityUnlock(
  activity: ActivityConfig,
  outcomeId: string,
  progress: StudentProgress[],
): boolean {
  if (activity.unlocked && activity.mode !== 'challenge') return true;
  if (activity.mode === 'challenge') {
    return isLessonCompleted(outcomeId, progress) && isPlayCompleted(outcomeId, progress);
  }
  return activity.unlocked;
}

export function getUnlockedActivities(
  outcome: LearningOutcome,
  progress: StudentProgress[],
): ActivityConfig[] {
  return outcome.activities.map((a) => ({
    ...a,
    unlocked: resolveActivityUnlock(a, outcome.id, progress),
  }));
}

export function calculateOutcomeProgress(
  outcome: LearningOutcome,
  progress: StudentProgress[],
): number {
  const activityIds = outcome.activities.map((a) => a.id);
  if (activityIds.length === 0) return 0;
  const completed = activityIds.filter((id) =>
    progress.some((p) => p.outcomeId === outcome.id && p.activityId === id && p.completed),
  ).length;
  return Math.round((completed / activityIds.length) * 100);
}

export function countCompletedLessons(progress: StudentProgress[]): number {
  return progress.filter((p) => isLessonActivity(p.activityId) && p.completed).length;
}
