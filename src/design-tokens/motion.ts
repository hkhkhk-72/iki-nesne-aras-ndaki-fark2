/**
 * Motion Tokens — varlık için hareket; gürültü değil.
 * MBA-BENCHMARK-001: mikro etkileşim 250–450 ms.
 */

export type MotionTokenId =
  | 'motion.gentle'
  | 'motion.rise'
  | 'motion.pop'
  | 'motion.fade'
  | 'motion.none'
  | 'motion.trust'
  | 'motion.deepBreath'
  | 'motion.softBounce'
  | 'motion.observe'
  /** LS-011 prep — Fındık çocuğa bakar, palamutlara döner (6s loop). */
  | 'motion.look_back_child';

export type MotionKind = 'micro' | 'character_loop';

export interface MotionToken {
  id: MotionTokenId;
  durationMs: number;
  easing: string;
  reduceMotionFallback: 'none' | 'instant';
  /**
   * micro = UX 250–450ms (MBA-BENCHMARK).
   * character_loop = karakter döngüsü; mikro süre kuralı uygulanmaz.
   */
  kind?: MotionKind;
  /** Karakter döngüsü toplam süresi (ms). */
  loopMs?: number;
}

export const motionTokens: Record<MotionTokenId, MotionToken> = {
  'motion.gentle': {
    id: 'motion.gentle',
    durationMs: 400,
    easing: 'ease-in-out',
    reduceMotionFallback: 'none',
  },
  'motion.rise': {
    id: 'motion.rise',
    durationMs: 400,
    easing: 'ease-out',
    reduceMotionFallback: 'instant',
  },
  'motion.pop': {
    id: 'motion.pop',
    durationMs: 280,
    easing: 'ease-out',
    reduceMotionFallback: 'instant',
  },
  'motion.fade': {
    id: 'motion.fade',
    durationMs: 350,
    easing: 'linear',
    reduceMotionFallback: 'none',
  },
  'motion.none': {
    id: 'motion.none',
    durationMs: 0,
    easing: 'linear',
    reduceMotionFallback: 'none',
  },
  /** LS-006 — güven tepkisi: sıcak, baskısız (benchmark mikro aralık). */
  'motion.trust': {
    id: 'motion.trust',
    durationMs: 450,
    easing: 'ease-in-out',
    reduceMotionFallback: 'instant',
  },
  'motion.deepBreath': {
    id: 'motion.deepBreath',
    durationMs: 450,
    easing: 'ease-in-out',
    reduceMotionFallback: 'none',
  },
  'motion.softBounce': {
    id: 'motion.softBounce',
    durationMs: 400,
    easing: 'ease-out',
    reduceMotionFallback: 'instant',
  },
  'motion.observe': {
    id: 'motion.observe',
    durationMs: 420,
    easing: 'linear',
    reduceMotionFallback: 'none',
  },
  /** LS-011 prep — bakış: çocuk → palamutlar; 6 sn loop. */
  'motion.look_back_child': {
    id: 'motion.look_back_child',
    durationMs: 6000,
    easing: 'ease-in-out',
    reduceMotionFallback: 'none',
    kind: 'character_loop',
    loopMs: 6000,
  },
};
