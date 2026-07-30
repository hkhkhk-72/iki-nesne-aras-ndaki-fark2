/**
 * AI modifies life.* probabilities only — never triggers animation directly.
 *
 * Example: child waits → ↑ eye contact · ↓ idle randomness · ↑ breathing calmness
 */

import type { LifeTokenId } from '@/design-tokens/life';
import type { RandomSchedulerState } from '@/life/random-scheduler';
import { setAiWeightMultipliers } from '@/life/random-scheduler';

export type AiLifeContext = {
  childWaiting?: boolean;
  waitMs?: number;
};

export function aiLifeWeightAdjustments(ctx: AiLifeContext): Partial<Record<LifeTokenId, number>> {
  if (!ctx.childWaiting && (ctx.waitMs ?? 0) < 4000) return {};
  return {
    'life.eye.contact': 1.8,
    'life.focus.child': 1.5,
    'life.breath.calm': 1.6,
    'life.breath.idle': 1.5,
    'life.random.scheduler': 0.5,
    'life.eye.saccade': 0.7,
    'life.face.micro_smile': 0.8,
  };
}

/** Apply AI probability mods onto scheduler state (no direct clip force). */
export function applyAiLifeWeights(
  state: RandomSchedulerState,
  ctx: AiLifeContext,
): RandomSchedulerState {
  const adj = aiLifeWeightAdjustments(ctx);
  const asRecord: Record<string, number> = {};
  for (const [k, v] of Object.entries(adj)) {
    if (typeof v === 'number') asRecord[k] = v;
  }
  return setAiWeightMultipliers(state, asRecord);
}

export function assertAiWeightController(): boolean {
  const mods = aiLifeWeightAdjustments({ childWaiting: true, waitMs: 8000 });
  return (
    (mods['life.eye.contact'] ?? 0) > 1 &&
    (mods['life.breath.calm'] ?? 0) > 1 &&
    (mods['life.random.scheduler'] ?? 1) < 1
  );
}
