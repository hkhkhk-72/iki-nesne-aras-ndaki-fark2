/**
 * MBA-LIFE-001 — Layered idle animation engine (Foundation).
 * 9 independent layers; never block each other.
 */

import {
  LIFE_LAYERS,
  type LifeLayerId,
  type LifeTokenId,
  lifeTokens,
} from '@/design-tokens/life';
import { LIFE_PERF, assertLifePerfContract } from './performance';

export type LayerState = 'idle' | 'active' | 'cooldown' | 'ai_held';

export interface LifeLayerRuntime {
  id: LifeLayerId;
  state: LayerState;
  intensity: number;
  tokenId: LifeTokenId | null;
}

export function createLifeLayerStack(): Record<LifeLayerId, LifeLayerRuntime> {
  const stack = {} as Record<LifeLayerId, LifeLayerRuntime>;
  for (const id of LIFE_LAYERS) {
    stack[id] = { id, state: 'idle', intensity: 0, tokenId: null };
  }
  return stack;
}

/** Apply token without stopping other layers. */
export function applyLifeTokenToLayers(
  stack: Record<LifeLayerId, LifeLayerRuntime>,
  tokenId: LifeTokenId,
  intensity = 0.25,
): Record<LifeLayerId, LifeLayerRuntime> {
  const token = lifeTokens[tokenId];
  const next = { ...stack };
  const cap = token.amplitude === 'micro' ? 0.2 : 0.35;
  for (const layerId of token.layers) {
    next[layerId] = {
      ...next[layerId],
      state: 'active',
      intensity: Math.min(intensity, cap),
      tokenId,
    };
  }
  return next;
}

export function countActiveLayers(stack: Record<LifeLayerId, LifeLayerRuntime>): number {
  return LIFE_LAYERS.filter((id) => stack[id].state === 'active').length;
}

/** Layers never block — activating A leaves B untouched. */
export function assertLayersNonBlocking(): boolean {
  let stack = createLifeLayerStack();
  stack = applyLifeTokenToLayers(stack, 'life.breath.idle');
  stack = applyLifeTokenToLayers(stack, 'life.tail.soft');
  return (
    stack.breath.state === 'active' &&
    stack.tail_motion.state === 'active' &&
    stack.blink.state === 'idle'
  );
}

export function assertLayeredIdleSupport(): boolean {
  return (
    LIFE_LAYERS.length === 9 &&
    LIFE_PERF.maxSimultaneousAnimations === 9 &&
    assertLayersNonBlocking() &&
    assertLifePerfContract() &&
    LIFE_PERF.layersSimultaneous
  );
}
