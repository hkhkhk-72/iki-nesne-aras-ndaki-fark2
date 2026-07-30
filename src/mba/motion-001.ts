/**
 * MBA-MOTION-001 — Motion Registry (LS-011 prep exposure).
 */

import {
  motionTokens,
  LOOK_BACK_CHILD_SEQUENCE,
  LOOK_BACK_CHILD_TOTAL_MS,
  type MotionTokenId,
} from '@/design-tokens/motion';
import { FX_SOFT_BOUNCE_SPEC, FX_soft_bounce } from '@/world/assets';
import { LS011_PERF, assertLs011PerfContract } from '@/design-tokens/performance';

export const MBA_MOTION_001 = 'MBA-MOTION-001' as const;

export const LS011_MOTION_REGISTRY = {
  lookBackChild: {
    id: 'motion.look_back_child' as MotionTokenId,
    durationMs: 6000,
    purpose: 'Maintain emotional connection.',
    sequence: LOOK_BACK_CHILD_SEQUENCE,
    totalMs: LOOK_BACK_CHILD_TOTAL_MS,
    loopSeamless: true as const,
    noVisibleJump: true as const,
  },
  softBounce: {
    id: FX_soft_bounce.alias ?? 'FX_soft_bounce',
    assetId: FX_soft_bounce.id,
    spec: FX_SOFT_BOUNCE_SPEC,
    purpose: 'Provide tactile feedback.',
    trigger: 'touch_collectible_object' as const,
  },
  perf: LS011_PERF,
} as const;

export function resolveLookBackChildMotion() {
  return motionTokens['motion.look_back_child'];
}

export function assertMbaMotion001Registry(): boolean {
  const m = resolveLookBackChildMotion();
  return (
    m.kind === 'character_loop' &&
    m.durationMs === 6000 &&
    LOOK_BACK_CHILD_TOTAL_MS === 6000 &&
    LOOK_BACK_CHILD_SEQUENCE.length === 5 &&
    LOOK_BACK_CHILD_SEQUENCE[3].target === 'smile' &&
    FX_SOFT_BOUNCE_SPEC.easing === 'easeOutQuad' &&
    FX_SOFT_BOUNCE_SPEC.durationMs === 200 &&
    assertLs011PerfContract() &&
    LS011_MOTION_REGISTRY.lookBackChild.noVisibleJump
  );
}
