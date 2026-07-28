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

/** MES-002 kalite kontrolü: süre, dokunuş, kompozisyon, ses bütçesi. */
export function validateExperience(exp: MicroExperience): { ok: boolean; issues: string[] } {
  const issues: string[] = [];

  exp.scenes.forEach((s) => {
    const isBondOrCelebrate =
      s.interaction.kind === 'narrative' || s.interaction.kind === 'celebrate';
    const minSec = isBondOrCelebrate ? 15 : 20;
    if (s.estimatedSeconds < minSec || s.estimatedSeconds > 60) {
      issues.push(`${s.id}: süre ${minSec}-60 sn dışında (${s.estimatedSeconds})`);
    }
    if (s.maxTouches > 3) {
      issues.push(`${s.id}: 3 dokunuş kuralı aşılmış (${s.maxTouches})`);
    }
    if (!s.pedagogicalGoal) issues.push(`${s.id}: pedagojik amaç eksik`);
    if (!s.accessibilityLabel) issues.push(`${s.id}: erişilebilirlik etiketi eksik`);

    // Karar 234 — Dünya önce: kompozisyon varsa 70/20/10'a yakın olmalı
    if (s.visualComposition) {
      const { world, interaction, ui } = s.visualComposition;
      if (world + interaction + ui !== 100) {
        issues.push(`${s.id}: görsel kompozisyon toplamı 100 olmalı`);
      }
      if (world < 60 || ui > 15) {
        issues.push(`${s.id}: dünya önce kuralı zayıf (world=${world}, ui=${ui})`);
      }
    }

    // Ses bütçesi: en fazla 4 katman, hepsi dolu olmalı
    if (s.soundBudget) {
      const layers = Object.values(s.soundBudget).filter(Boolean);
      if (layers.length !== 4) {
        issues.push(`${s.id}: ses bütçesi 4 katman olmalı (ortam/karakter/etkileşim/başarı)`);
      }
    }
  });

  // 60 saniye kuralı: ilk deneyimde çocuk hızlı başarmalı
  const firstThree = exp.scenes.slice(0, 3).reduce((s, x) => s + x.estimatedSeconds, 0);
  if (firstThree > 90) {
    issues.push(`İlk üç sahne çok uzun (${firstThree} sn); çocuk erken başarmalı`);
  }

  // Karar 235 — İlk dakikada matematik kelimesi kullanılmaz
  const firstMinuteScenes = exp.scenes.filter(
    (_, idx, arr) =>
      arr.slice(0, idx + 1).reduce((sum, x) => sum + x.estimatedSeconds, 0) <= 60,
  );
  const MATH_WORDS = [
    'matematik',
    'sayı',
    'say ',
    'say,',
    'kaç tane',
    'kaç ',
    'toplama',
    'çıkarma',
    'doğru cevap',
    'puan',
  ];
  for (const s of firstMinuteScenes) {
    const blob = [
      s.opening.line,
      s.feedback.positive,
      s.interaction.kind === 'narrative' ? s.interaction.lines.join(' ') : '',
      s.interaction.kind === 'choose' ? s.interaction.prompt : '',
    ]
      .join(' ')
      .toLocaleLowerCase('tr');
    for (const w of MATH_WORDS) {
      if (blob.includes(w)) {
        issues.push(`${s.id}: Karar 235 ihlali — ilk 60 sn'de "${w.trim()}" geçiyor`);
      }
    }
  }

  return { ok: issues.length === 0, issues };
}
