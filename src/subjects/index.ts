import { registerSubject } from '@/core/subject-registry';
import { mathSubject } from './math';

let initialized = false;

/**
 * Ders modüllerini OS'e kaydeder.
 *
 * Ürün Anayasası: matematik tamamlanmadan başka ders etkinleştirilmez.
 * Yeni bir ders hazır olduğunda tek satır eklenir:
 *   registerSubject(turkishSubject);
 */
export function initializeSubjects(): void {
  if (initialized) return;
  registerSubject(mathSubject);
  initialized = true;
}

export { mathSubject };
