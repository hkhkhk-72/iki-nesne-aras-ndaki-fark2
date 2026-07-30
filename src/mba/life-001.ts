/**
 * MBA-LIFE-001 — Character Life System (Foundation / Infrastructure Integrated).
 *
 * Characters must never appear static.
 * Life emerges through tiny, almost invisible behaviors.
 * Organic, not scripted. No gameplay.
 */

import {
  LIFE_LAYERS,
  LIFE_TOKEN_GROUPS,
  LIFE_TOKEN_NAMESPACE,
  IDLE_VARIATION_RULES,
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
import { assertLifeForbiddenRules } from '@/life/forbidden';
import { createCharacterLifeEngine } from '@/life/engine/CharacterLifeEngine';
import { assertEmotionBridge } from '@/life/engine/EmotionBridge';
import { assertAiWeightController } from '@/life/engine/AIWeightController';

export const MBA_LIFE_001 = 'MBA-LIFE-001' as const;

export const LS_LIFE_REGISTERED: readonly LifeTokenId[] = [
  'life.eye.saccade',
  'life.eye.contact',
  'life.face.micro_smile',
  'life.face.thinking',
  'life.breath.idle',
  'life.tail.soft',
  'life.ear.listen',
  'life.focus.child',
  'life.focus.object',
] as const;

export const MBA_LIFE_001_PURPOSE =
  'Characters must never appear static. Life emerges through tiny, ' +
  'almost invisible behaviors. Animation should feel organic, not scripted.';

export function assertMbaLife001Registry(): boolean {
  const namespaceOk = LIFE_TOKEN_NAMESPACE === 'life.';
  const groupsOk = LIFE_TOKEN_GROUPS.length === 10;
  const tokensOk = LS_LIFE_REGISTERED.every((id) => id in lifeTokens);
  const layersOk = assertLayeredIdleSupport() && LIFE_LAYERS.length === 9;
  const randomOk = assertRandomSchedulerContract();
  const perfOk =
    assertLifePerfContract() &&
    LIFE_PERF.maxSimultaneousAnimations === 9 &&
    LIFE_PERF.animationPoolingEnabled;
  const forbiddenOk = assertLifeForbiddenRules();
  const idleOk = IDLE_VARIATION_RULES.maxIdenticalSequence === 1;
  const emotionOk = assertEmotionBridge();
  const aiOk = assertAiWeightController();
  const engineOk = createCharacterLifeEngine().assertInfrastructure();

  let stack = createLifeLayerStack();
  stack = applyLifeTokenToLayers(stack, 'life.breath.idle');
  stack = applyLifeTokenToLayers(stack, 'life.tail.soft');
  stack = applyLifeTokenToLayers(stack, 'life.eye.blink');
  const simultaneous = countActiveLayers(stack) >= 3;

  return (
    namespaceOk &&
    groupsOk &&
    tokensOk &&
    layersOk &&
    randomOk &&
    perfOk &&
    forbiddenOk &&
    idleOk &&
    emotionOk &&
    aiOk &&
    engineOk &&
    simultaneous
  );
}
