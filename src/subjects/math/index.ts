import type { Grade, GradeCurriculum, SubjectModule } from '@/core/types';
import {
  grade1Curriculum,
  grade2Curriculum,
  grade3Curriculum,
  grade4Curriculum,
} from '@/content/grades';

/**
 * İlkokul Matematik ders modülü.
 *
 * Eğitim OS'in ilk ve şu an tek etkin dersidir (Ürün Anayasası kapsam kuralı).
 * Diğer dersler aynı SubjectModule sözleşmesini implement ederek eklenir;
 * oyun motorlarında hiçbir değişiklik gerekmez.
 */
const curriculaByGrade: Record<Grade, GradeCurriculum> = {
  1: grade1Curriculum,
  2: grade2Curriculum,
  3: grade3Curriculum,
  4: grade4Curriculum,
};

export const mathSubject: SubjectModule = {
  meta: {
    id: 'math',
    title: 'İlkokul Matematik',
    shortTitle: 'Matematik',
    icon: '🔢',
    color: '#6C63FF',
    grades: [1, 2, 3, 4],
    enabled: true,
  },
  getCurriculum(grade: Grade) {
    return curriculaByGrade[grade];
  },
};

export const mathCurricula = Object.values(curriculaByGrade);
