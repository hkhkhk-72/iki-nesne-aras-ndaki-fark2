import type { GradeCurriculum } from './types';
import {
  allCurricula,
  grade1Curriculum,
  grade2Curriculum,
  grade3Curriculum,
  grade4Curriculum,
  getCurriculumStats,
} from '../content/grades';

const curriculumMap: Record<number, GradeCurriculum> = {
  1: grade1Curriculum,
  2: grade2Curriculum,
  3: grade3Curriculum,
  4: grade4Curriculum,
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

export function getAllCurricula(): GradeCurriculum[] {
  return allCurricula;
}

export function getTotalStats() {
  const stats = getCurriculumStats();
  return {
    grades: stats.length,
    units: stats.reduce((s, g) => s + g.units, 0),
    outcomes: stats.reduce((s, g) => s + g.outcomes, 0),
    activities: stats.reduce((s, g) => s + g.activities, 0),
    byGrade: stats,
  };
}

export { getCurriculumStats };
