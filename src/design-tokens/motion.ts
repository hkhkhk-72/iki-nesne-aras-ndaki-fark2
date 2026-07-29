/**
 * Motion Tokens — varlık için hareket; gürültü değil.
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
  | 'motion.observe';

export interface MotionToken {
  id: MotionTokenId;
  durationMs: number;
  easing: string;
  reduceMotionFallback: 'none' | 'instant';
}

export const motionTokens: Record<MotionTokenId, MotionToken> = {
  'motion.gentle': {
    id: 'motion.gentle',
    durationMs: 600,
    easing: 'ease-in-out',
    reduceMotionFallback: 'none',
  },
  'motion.rise': {
    id: 'motion.rise',
    durationMs: 500,
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
    durationMs: 400,
    easing: 'linear',
    reduceMotionFallback: 'none',
  },
  'motion.none': {
    id: 'motion.none',
    durationMs: 0,
    easing: 'linear',
    reduceMotionFallback: 'none',
  },
  /** LS-006 — güven tepkisi: yavaş, sıcak, baskısız. */
  'motion.trust': {
    id: 'motion.trust',
    durationMs: 900,
    easing: 'ease-in-out',
    reduceMotionFallback: 'instant',
  },
  'motion.deepBreath': {
    id: 'motion.deepBreath',
    durationMs: 1400,
    easing: 'ease-in-out',
    reduceMotionFallback: 'none',
  },
  'motion.softBounce': {
    id: 'motion.softBounce',
    durationMs: 520,
    easing: 'ease-out',
    reduceMotionFallback: 'instant',
  },
  'motion.observe': {
    id: 'motion.observe',
    durationMs: 1100,
    easing: 'linear',
    reduceMotionFallback: 'none',
  },
};
