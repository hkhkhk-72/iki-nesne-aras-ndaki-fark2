import type { MicroExperience } from './types';
import type { SubjectId } from '@/core/types';
import { MATH_EXPERIENCES } from '@/modules/math';

/**
 * Mikro deneyim kaydı.
 *
 * Mevcut kazanım/etkinlik sistemi (genişlik) ile MES-002 deneyimleri (derinlik)
 * birlikte yaşar. Bir kazanımın MES deneyimi varsa öğrenme merkezinde öne çıkar.
 */
const registry = new Map<string, MicroExperience>();

let initialized = false;

export function initializeExperiences(): void {
  if (initialized) return;
  for (const exp of MATH_EXPERIENCES) {
    registry.set(exp.code, exp);
  }
  initialized = true;
}

export function getExperience(code: string): MicroExperience | undefined {
  initializeExperiences();
  return registry.get(code);
}

export function getAllExperiences(): MicroExperience[] {
  initializeExperiences();
  return Array.from(registry.values());
}

/** Bir kazanıma bağlı mikro deneyimler. */
export function getExperiencesForOutcome(
  outcomeId: string,
  subject: SubjectId = 'math',
): MicroExperience[] {
  return getAllExperiences().filter(
    (e) => e.outcomeId === outcomeId && e.subject === subject,
  );
}

export function hasExperience(outcomeId: string, subject: SubjectId = 'math'): boolean {
  return getExperiencesForOutcome(outcomeId, subject).length > 0;
}

/** MES-002 kalite kontrolü: 60 saniye ve 3 dokunuş kuralları. */
export function validateExperience(exp: MicroExperience): { ok: boolean; issues: string[] } {
  const issues: string[] = [];

  exp.scenes.forEach((s) => {
    if (s.estimatedSeconds < 20 || s.estimatedSeconds > 60) {
      issues.push(`${s.id}: süre 20-60 sn dışında (${s.estimatedSeconds})`);
    }
    if (s.maxTouches > 3) {
      issues.push(`${s.id}: 3 dokunuş kuralı aşılmış (${s.maxTouches})`);
    }
    if (!s.pedagogicalGoal) issues.push(`${s.id}: pedagojik amaç eksik`);
    if (!s.accessibilityLabel) issues.push(`${s.id}: erişilebilirlik etiketi eksik`);
  });

  // 60 saniye kuralı: ilk deneyimde çocuk hızlı başarmalı
  const firstThree = exp.scenes.slice(0, 3).reduce((s, x) => s + x.estimatedSeconds, 0);
  if (firstThree > 90) {
    issues.push(`İlk üç sahne çok uzun (${firstThree} sn); çocuk erken başarmalı`);
  }

  return { ok: issues.length === 0, issues };
}
