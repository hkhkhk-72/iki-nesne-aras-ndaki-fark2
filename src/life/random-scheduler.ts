/**
 * MBA-LIFE-001 — Weighted random scheduler (Foundation).
 *
 * weighted · cooldown · previous memory · no immediate repetition ·
 * AI weight override (probabilities only) · deterministic seed (tests)
 */

import { IDLE_VARIATION_RULES } from '@/design-tokens/life';

export interface WeightedLifeClip {
  id: string;
  weight: number;
  cooldownMs: number;
}

export interface RandomSchedulerState {
  previousId: string | null;
  cooldowns: Record<string, number>;
  /**
   * AI never directly triggers animation — only multiplies weights.
   * clipId → multiplier (default 1).
   */
  aiWeightMultipliers: Record<string, number>;
}

export interface RandomSchedulerOptions {
  now?: number;
  /** Deterministic seed for testing. */
  seed?: number;
}

/** Mulberry32 — deterministic [0,1) for tests. */
export function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRandomSchedulerState(): RandomSchedulerState {
  return {
    previousId: null,
    cooldowns: {},
    aiWeightMultipliers: {},
  };
}

/** AI modifies probabilities only — never forces a clip id. */
export function setAiWeightMultipliers(
  state: RandomSchedulerState,
  multipliers: Record<string, number>,
): RandomSchedulerState {
  return {
    ...state,
    aiWeightMultipliers: { ...state.aiWeightMultipliers, ...multipliers },
  };
}

function effectiveWeight(clip: WeightedLifeClip, state: RandomSchedulerState): number {
  const m = state.aiWeightMultipliers[clip.id] ?? 1;
  return Math.max(0, clip.weight * m);
}

function isCoolingDown(state: RandomSchedulerState, clipId: string, now: number): boolean {
  const until = state.cooldowns[clipId];
  return typeof until === 'number' && until > now;
}

export function pickWeightedLifeClip(
  clips: readonly WeightedLifeClip[],
  state: RandomSchedulerState,
  opts: RandomSchedulerOptions = {},
  random?: () => number,
): { clip: WeightedLifeClip; nextState: RandomSchedulerState } | null {
  const now = opts.now ?? Date.now();
  const rnd =
    random ?? (opts.seed !== undefined ? createSeededRandom(opts.seed) : Math.random);

  // Max identical sequence = 1 → never pick previous immediately
  const eligible = clips.filter(
    (c) =>
      c.id !== state.previousId &&
      !isCoolingDown(state, c.id, now) &&
      effectiveWeight(c, state) > 0,
  );

  if (eligible.length === 0) {
    const soft = clips.filter(
      (c) => c.id !== state.previousId && effectiveWeight(c, state) > 0,
    );
    if (soft.length === 0) return null;
    return pickFromWeighted(soft, state, now, rnd);
  }

  return pickFromWeighted(eligible, state, now, rnd);
}

function pickFromWeighted(
  eligible: readonly WeightedLifeClip[],
  state: RandomSchedulerState,
  now: number,
  random: () => number,
): { clip: WeightedLifeClip; nextState: RandomSchedulerState } {
  const total = eligible.reduce((s, c) => s + effectiveWeight(c, state), 0);
  let r = random() * total;
  for (const clip of eligible) {
    r -= effectiveWeight(clip, state);
    if (r <= 0) {
      return { clip, nextState: rememberPlay(state, clip, now) };
    }
  }
  const last = eligible[eligible.length - 1];
  return { clip: last, nextState: rememberPlay(state, last, now) };
}

function rememberPlay(
  state: RandomSchedulerState,
  clip: WeightedLifeClip,
  now: number,
): RandomSchedulerState {
  return {
    previousId: clip.id,
    aiWeightMultipliers: state.aiWeightMultipliers,
    cooldowns: {
      ...state.cooldowns,
      [clip.id]: now + clip.cooldownMs,
    },
  };
}

export function assertRandomSchedulerContract(): boolean {
  if (IDLE_VARIATION_RULES.maxIdenticalSequence !== 1) return false;

  const clips: WeightedLifeClip[] = [
    { id: 'a', weight: 1, cooldownMs: 1000 },
    { id: 'b', weight: 1, cooldownMs: 1000 },
    { id: 'c', weight: 1, cooldownMs: 1000 },
  ];

  // Deterministic seed: same seed → same first pick
  const s1 = pickWeightedLifeClip(clips, createRandomSchedulerState(), { now: 0, seed: 42 });
  const s2 = pickWeightedLifeClip(clips, createRandomSchedulerState(), { now: 0, seed: 42 });
  if (!s1 || !s2 || s1.clip.id !== s2.clip.id) return false;

  let state = s1.nextState;
  const second = pickWeightedLifeClip(clips, state, { now: 0, seed: 42 });
  if (!second || second.clip.id === s1.clip.id) return false;

  // AI weight boost (probabilities only — never forces a clip id)
  // previous = second.clip; boost a different eligible id
  const boostTarget = clips.find((c) => c.id !== second.clip.id)?.id ?? 'a';
  state = setAiWeightMultipliers(second.nextState, {
    [boostTarget]: 1000,
    a: boostTarget === 'a' ? 1000 : 0.01,
    b: boostTarget === 'b' ? 1000 : 0.01,
    c: boostTarget === 'c' ? 1000 : 0.01,
  });
  const boosted = pickWeightedLifeClip(clips, state, { now: 10_000, seed: 7 });
  return boosted?.clip.id === boostTarget;
}
