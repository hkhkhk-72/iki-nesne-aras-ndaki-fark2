import type { Grade, GradeCurriculum, SubjectId, SubjectMeta, SubjectModule } from './types';

/**
 * Eğitim OS ders çekirdeği.
 *
 * Oyun motorları (engine-registry) içerikten bağımsızdır; bu registry de
 * dersleri birer eklenti gibi tutar. Yeni bir ders eklemek için tek gereken
 * SubjectModule implement edip registerSubject ile kaydetmektir.
 */
const registry = new Map<SubjectId, SubjectModule>();

export const DEFAULT_SUBJECT: SubjectId = 'math';

export function registerSubject(module: SubjectModule): void {
  registry.set(module.meta.id, module);
}

export function getSubject(id: SubjectId): SubjectModule | undefined {
  return registry.get(id);
}

export function hasSubject(id: SubjectId): boolean {
  return registry.has(id);
}

/** Kayıtlı tüm dersler (kapsam kilidi dahil). */
export function getAllSubjects(): SubjectModule[] {
  return Array.from(registry.values());
}

/** Yalnızca anayasa gereği açık olan dersler. */
export function getEnabledSubjects(): SubjectModule[] {
  return getAllSubjects().filter((s) => s.meta.enabled);
}

export function getSubjectMeta(id: SubjectId): SubjectMeta | undefined {
  return registry.get(id)?.meta;
}

export function getSubjectCurriculum(
  subject: SubjectId,
  grade: Grade,
): GradeCurriculum | undefined {
  return registry.get(subject)?.getCurriculum(grade);
}

/**
 * Bir dersin planlanan ama henüz açılmamış olduğunu bildirir.
 * UI'da "yakında" durumunu göstermek için kullanılır.
 */
export const PLANNED_SUBJECTS: SubjectMeta[] = [
  { id: 'turkish', title: 'İlkokul Türkçe', shortTitle: 'Türkçe', icon: '📚', color: '#E74C3C', grades: [1, 2, 3, 4], enabled: false },
  { id: 'life_studies', title: 'Hayat Bilgisi', shortTitle: 'Hayat Bilgisi', icon: '🌱', color: '#27AE60', grades: [1, 2, 3], enabled: false },
  { id: 'science', title: 'Fen Bilimleri', shortTitle: 'Fen', icon: '🔬', color: '#8E44AD', grades: [3, 4], enabled: false },
  { id: 'english', title: 'İlkokul İngilizce', shortTitle: 'İngilizce', icon: '🌍', color: '#2980B9', grades: [2, 3, 4], enabled: false },
];
