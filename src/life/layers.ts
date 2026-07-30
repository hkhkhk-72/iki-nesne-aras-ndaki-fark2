/**
 * MBA-LIFE-001 — Layered idle animation engine (prep).
 *
 * Layers work simultaneously. Subtle motion, not constant animation.
 * No gameplay binding yet.
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
  /** 0–1 intensity; life tokens keep this low. */
  intensity: number;
  /** Token driving this layer (if any). */
  tokenId: LifeTokenId | null;
}

/** Create independent layer slots — all may be active together. */
export function createLifeLayerStack(): Record<LifeLayerId, LifeLayerRuntime> {
  const stack = {} as Record<LifeLayerId, LifeLayerRuntime>;
  for (const id of LIFE_LAYERS) {
    stack[id] = {
      id,
      state: 'idle',
      intensity: 0,
      tokenId: null,
    };
  }
  return stack;
}

/**
 * Apply a life token across its layers without stopping other layers.
 * Simultaneous = true contract.
 */
export function applyLifeTokenToLayers(
  stack: Record<LifeLayerId, LifeLayerRuntime>,
  tokenId: LifeTokenId,
  intensity = 0.25,
): Record<LifeLayerId, LifeLayerRuntime> {
  const token = lifeTokens[tokenId];
  const next = { ...stack };
  for (const layerId of token.layers) {
    next[layerId] = {
      ...next[layerId],
      state: 'active',
      intensity: Math.min(intensity, token.amplitude === 'micro' ? 0.2 : 0.35),
      tokenId,
    };
  }
  return next;
}

/** Active layer count — for perf / QA. */
export function countActiveLayers(stack: Record<LifeLayerId, LifeLayerRuntime>): number {
  return LIFE_LAYERS.filter((id) => stack[id].state === 'active').length;
}

/** All 8 layers registered and independent. */
export function assertLayeredIdleSupport(): boolean {
  return (
    LIFE_LAYERS.length === 8 &&
    LIFE_LAYERS.includes('breath') &&
    LIFE_LAYERS.includes('eyes') &&
    LIFE_LAYERS.includes('blink') &&
    LIFE_LAYERS.includes('face') &&
    LIFE_LAYERS.includes('tail') &&
    LIFE_LAYERS.includes('ears') &&
    LIFE_LAYERS.includes('basket') &&
    LIFE_LAYERS.includes('leaves') &&
    assertLifePerfContract() &&
    LIFE_PERF.layersSimultaneous
  );
}
