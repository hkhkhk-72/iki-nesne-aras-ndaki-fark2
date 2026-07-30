/**
 * MBA-LIFE-001 — Character Life System (preparation registry).
 *
 * Characters must feel alive even while doing nothing.
 * Life = subtle motion, not constant animation.
 * Infrastructure only — no gameplay.
 */

import {
  LIFE_LAYERS,
  LIFE_TOKEN_GROUPS,
  LIFE_TOKEN_NAMESPACE,
  lifeTokens,
  type LifeTokenId,
} from '@/design-tokens/life';
import {
  assertLayeredIdleSupport,
  createLifeLayerStack,
  applyLifeTokenToLayers,
  countActiveLayers,
} from '@/life/layers';
import { assertRandomSchedulerContract } from '@/life/random-scheduler';
import { assertLifePerfContract, LIFE_PERF } from '@/life/performance';

export const MBA_LIFE_001 = 'MBA-LIFE-001' as const;

export const LS_LIFE_REGISTERED: readonly LifeTokenId[] = [
  'life.eye.soft_gaze',
  'life.eye.blink',
  'life.face.micro_smile',
  'life.breath.calm',
  'life.idle.presence',
  'life.random.scheduler',
  'life.motion.subtle',
] as const;

export const MBA_LIFE_001_PURPOSE =
  'Characters must feel alive even while doing nothing. ' +
  'Life is created through subtle motion, not constant animation.';

export function assertMbaLife001Registry(): boolean {
  const namespaceOk = LIFE_TOKEN_NAMESPACE === 'life.';
  const groupsOk = LIFE_TOKEN_GROUPS.length === 6;
  const tokensOk = LS_LIFE_REGISTERED.every((id) => id in lifeTokens);
  const layersOk = assertLayeredIdleSupport() && LIFE_LAYERS.length === 8;
  const randomOk = assertRandomSchedulerContract();
  const perfOk = assertLifePerfContract() && LIFE_PERF.targetFps === 60;

  // Simultaneous layers smoke: idle.presence activates multiple without clearing others
  let stack = createLifeLayerStack();
  stack = applyLifeTokenToLayers(stack, 'life.breath.calm');
  stack = applyLifeTokenToLayers(stack, 'life.eye.blink');
  const simultaneous = countActiveLayers(stack) >= 2;

  return namespaceOk && groupsOk && tokensOk && layersOk && randomOk && perfOk && simultaneous;
}
