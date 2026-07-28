import type { MicroExperience } from '@/mes/types';
import { MB_MAT_1_1_01 } from './unit1/MB-MAT-1.1.01';

/**
 * Matematik mikro deneyim kataloğu.
 *
 * Klasör yapısı MES-002 standardını izler:
 *   modules/math/unit1/MB-MAT-1.1.01/scenes.ts
 *
 * Her yeni ders kendi klasöründe bağımsız yaşar ve buraya kaydedilir.
 */
export const MATH_EXPERIENCES: MicroExperience[] = [MB_MAT_1_1_01];

export { MB_MAT_1_1_01 };
