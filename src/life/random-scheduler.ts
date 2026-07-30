/**
 * MBA-LIFE-001 — Weighted random scheduler (prep).
 *
 * Requirements:
 * - No immediate repetition
 * - Cooldown support
 * - Probability weights
 * - Memory of previous animation
 * - AI overridable
 */

export interface WeightedLifeClip {
  id: string;
  weight: number;
  /** Cooldown after play (ms). */
  cooldownMs: number;
}

export interface RandomSchedulerState {
  /** Previous clip id (memory). */
  previousId: string | null;
  /** clipId → earliest next allowed time (ms epoch or relative). */
  cooldowns: Record<string, number>;
  /** AI force next clip; clears after use. */
  aiOverrideId: string | null;
}

export interface RandomSchedulerOptions {
  /** Now in ms (injectable for tests). */
  now?: number;
}

export function createRandomSchedulerState(): RandomSchedulerState {
  return {
    previousId: null,
    cooldowns: {},
    aiOverrideId: null,
  };
}

/** AI may override next selection. */
export function setAiOverride(
  state: RandomSchedulerState,
  clipId: string | null,
): RandomSchedulerState {
  return { ...state, aiOverrideId: clipId };
}

function isCoolingDown(
  state: RandomSchedulerState,
  clipId: string,
  now: number,
): boolean {
  const until = state.cooldowns[clipId];
  return typeof until === 'number' && until > now;
}

/**
 * Pick next clip: AI override → weighted among eligible (not previous, not cooling).
 * Returns null if nothing eligible.
 */
export function pickWeightedLifeClip(
  clips: readonly WeightedLifeClip[],
  state: RandomSchedulerState,
  opts: RandomSchedulerOptions = {},
  random: () => number = Math.random,
): { clip: WeightedLifeClip; nextState: RandomSchedulerState } | null {
  const now = opts.now ?? Date.now();

  if (state.aiOverrideId) {
    const forced = clips.find((c) => c.id === state.aiOverrideId);
    if (forced) {
      return {
        clip: forced,
        nextState: rememberPlay(state, forced, now),
      };
    }
  }

  const eligible = clips.filter(
    (c) => c.id !== state.previousId && !isCoolingDown(state, c.id, now) && c.weight > 0,
  );

  if (eligible.length === 0) {
    // Soft fallback: allow cooled clips except immediate previous
    const soft = clips.filter((c) => c.id !== state.previousId && c.weight > 0);
    if (soft.length === 0) return null;
    return pickFromWeighted(soft, state, now, random);
  }

  return pickFromWeighted(eligible, state, now, random);
}

function pickFromWeighted(
  eligible: readonly WeightedLifeClip[],
  state: RandomSchedulerState,
  now: number,
  random: () => number,
): { clip: WeightedLifeClip; nextState: RandomSchedulerState } {
  const total = eligible.reduce((s, c) => s + c.weight, 0);
  let r = random() * total;
  for (const clip of eligible) {
    r -= clip.weight;
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
    aiOverrideId: null,
    cooldowns: {
      ...state.cooldowns,
      [clip.id]: now + clip.cooldownMs,
    },
  };
}

/** Contract checks for prep QA. */
export function assertRandomSchedulerContract(): boolean {
  const clips: WeightedLifeClip[] = [
    { id: 'a', weight: 1, cooldownMs: 1000 },
    { id: 'b', weight: 1, cooldownMs: 1000 },
    { id: 'c', weight: 1, cooldownMs: 1000 },
  ];
  let state = createRandomSchedulerState();
  const first = pickWeightedLifeClip(clips, state, { now: 0 }, () => 0);
  if (!first) return false;
  state = first.nextState;
  // No immediate repetition
  const second = pickWeightedLifeClip(clips, state, { now: 0 }, () => 0);
  if (!second || second.clip.id === first.clip.id) return false;
  // AI override
  state = setAiOverride(second.nextState, 'c');
  const forced = pickWeightedLifeClip(clips, state, { now: 5000 }, () => 0.99);
  return forced?.clip.id === 'c';
}
