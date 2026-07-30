/**
 * MBA-TOKEN-001 — Token Registry (LS-011 prep exposure).
 * Yeni anayasa icat etmez; mevcut design-token’ları kayıt altına alır.
 */

import { storyTokens, type StoryTokenId } from '@/design-tokens/story';
import { motionTokens, type MotionTokenId } from '@/design-tokens/motion';
import { aiTokens, type AiTokenId } from '@/design-tokens/ai';
import { FX_soft_bounce, ASSETS } from '@/world/assets';

export const MBA_TOKEN_001 = 'MBA-TOKEN-001' as const;

/** LS-011 Preparation — kayıtlı token kimlikleri. */
export const LS011_REGISTERED_TOKENS = {
  story: 'story.thinking.deep' satisfies StoryTokenId,
  motion: 'motion.look_back_child' satisfies MotionTokenId,
  anim: 'anim.deep_breath' as const,
  fx: 'FX_soft_bounce' as const,
  ai: 'ai.observe_compare_v2' satisfies AiTokenId,
} as const;

export function resolveStoryToken(id: StoryTokenId) {
  return storyTokens[id];
}

export function resolveMotionToken(id: MotionTokenId) {
  return motionTokens[id];
}

export function resolveAiToken(id: AiTokenId) {
  return aiTokens[id];
}

export function resolveFxSoftBounce() {
  return { ...FX_soft_bounce, asset: ASSETS.FX011 };
}

/** Tüm LS-011 prep token’ları kayıtlı ve çözülebilir mi? */
export function assertMbaToken001Registry(): boolean {
  const s = LS011_REGISTERED_TOKENS;
  return (
    s.story in storyTokens &&
    s.motion in motionTokens &&
    s.ai in aiTokens &&
    FX_soft_bounce.alias === s.fx &&
    ASSETS.AN008.alias === s.anim
  );
}
