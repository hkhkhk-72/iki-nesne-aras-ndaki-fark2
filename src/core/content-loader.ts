import type { GradeCurriculum } from './types';
import grade1Curriculum from '../content/grade1/curriculum.json';

const curriculumMap: Record<number, GradeCurriculum> = {
  1: grade1Curriculum as GradeCurriculum,
};

export function getCurriculum(grade: number): GradeCurriculum | undefined {
  return curriculumMap[grade];
}

export function getOutcome(grade: number, outcomeId: string) {
  const curriculum = getCurriculum(grade);
  return curriculum?.outcomes.find((o) => o.id === outcomeId);
}

export function getUnit(grade: number, unitId: string) {
  const curriculum = getCurriculum(grade);
  return curriculum?.units.find((u) => u.id === unitId);
}

export function getActivity(grade: number, outcomeId: string, activityId: string) {
  const outcome = getOutcome(grade, outcomeId);
  return outcome?.activities.find((a) => a.id === activityId);
}

export function getAllGrades(): number[] {
  return Object.keys(curriculumMap).map(Number);
}
