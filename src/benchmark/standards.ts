/**
 * MBA-BENCHMARK-001 — Global Standards v1.1
 *
 * Ölçülebilir üretim eşiği. Yeni mimari icat etmez.
 */

export const BENCHMARK_ID = 'MBA-BENCHMARK-001' as const;
export const BENCHMARK_VERSION = '1.1' as const;

// ─── Cognitive ───────────────────────────────────────────────
export const COGNITIVE_STANDARDS = [
  'perceptual_subitizing',
  'conceptual_subitizing',
  'ips_number_sense',
  'cpa',
] as const;

export type CognitiveStandard = (typeof COGNITIVE_STANDARDS)[number];

// ─── UX ──────────────────────────────────────────────────────
/** Minimum dokunma hedefi (px). */
export const TOUCH_TARGET_MIN_PX = 64;

/** Mikro etkileşim animasyon süresi (ms). */
export const ANIMATION_DURATION_MS = { min: 250, max: 450 } as const;

/** Öğrenme mikro sahne süresi (sn). */
export const MICRO_SCENE_SECONDS = { min: 20, max: 45 } as const;

/** Etkileşim gecikme hedefi (ms). */
export const INTERACTION_LATENCY_MAX_MS = 50;

export function isMicroAnimationDuration(ms: number): boolean {
  if (ms === 0) return true; // motion.none / reduce-motion
  return ms >= ANIMATION_DURATION_MS.min && ms <= ANIMATION_DURATION_MS.max;
}

export function isMicroSceneLength(seconds: number): boolean {
  return seconds >= MICRO_SCENE_SECONDS.min && seconds <= MICRO_SCENE_SECONDS.max;
}

// ─── Audio ───────────────────────────────────────────────────
export const ALLOWED_AMBIENT_NATURE = ['wind', 'birds', 'leaves', 'soft_wood'] as const;

export const FORBIDDEN_AUDIO = [
  'buzzer',
  'error alarm',
  'error_alarm',
  'loud reward',
  'loud_reward',
  'alarm',
  'siren',
  'fail_buzzer',
] as const;

/** Sahne ambient etiketlerini izinli doğa seslerine eşler. */
export const AMBIENT_NATURE_HINTS = [
  'ruzgar',
  'yaprak',
  'kus',
  'kuş',
  'orman',
  'bahce',
  'bahçe',
  'wood',
  'ahsap',
  'ahşap',
  'wind',
  'bird',
  'leaf',
  'sessiz',
  'hafif',
  'kis',
  'kış',
  'isik',
  'ışık',
] as const;

// ─── Motivation ──────────────────────────────────────────────
export const PRIMARY_MOTIVATION = 'curiosity' as const;
export const SECONDARY_MOTIVATION = 'helping_characters' as const;

export const FORBIDDEN_MOTIVATION = [
  'leaderboard',
  'liderlik',
  'lives',
  'can hakkı',
  'heart system',
  'kalp sistemi',
  'countdown',
  'geri sayım',
  'timer',
  'punishment',
  'ceza',
  'streak',
  'loot',
] as const;

// ─── Error philosophy ────────────────────────────────────────
export const FORBIDDEN_ERROR_LANGUAGE = [
  'wrong',
  'yanlış',
  'yanlis',
  'hata yaptın',
  'hata yaptin',
  'incorrect',
  'fail',
  'başarısız',
  'basarisiz',
] as const;

// ─── Child safety ────────────────────────────────────────────
export const CHILD_SAFETY_RULES = [
  'no_anxiety',
  'no_time_pressure',
  'no_comparison',
  'no_punishment',
  'no_manipulation',
] as const;

export const FORBIDDEN_SAFETY_LANGUAGE = [
  'acele et!',
  'acele edin',
  'hızlı ol',
  'hizli ol',
  'süre doldu',
  'sure doldu',
  'en hızlı',
  'en hizli',
  'rakiplerini geç',
  'kaybettin',
  'cezalandır',
  'cezalandir',
] as const;

// ─── Story ───────────────────────────────────────────────────
export const STORY_RULES = {
  storyBeforeMath: true,
  mathIsDiscovered: true,
  mathNeverAnnounced: true,
} as const;

/** İlk sahnelerde / duyuru dilinde yasak matematik kelimeleri (Karar 235 + Benchmark). */
export const FORBIDDEN_MATH_ANNOUNCE = [
  'matematik',
  'toplama',
  'çıkarma',
  'cikarma',
  'çarpma',
  'carpma',
  'bölme',
  'bolme',
  'denklem',
  'alıştırma',
  'alistirma',
  'test sorusu',
] as const;
