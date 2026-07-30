/**
 * LifeScheduler — weighted idle variation (max identical sequence = 1).
 */

import type { LifeTokenId } from '@/design-tokens/life';
import {
  createRandomSchedulerState,
  pickWeightedLifeClip,
  type RandomSchedulerState,
  type WeightedLifeClip,
  type RandomSchedulerOptions,
} from '@/life/random-scheduler';
import { applyAiLifeWeights, type AiLifeContext } from './AIWeightController';
import { lifeWeightsForStory } from './StoryTokenBridge';
import type { StoryTokenId } from '@/design-tokens/story';

export const DEFAULT_IDLE_CLIPS: WeightedLifeClip[] = [
  { id: 'life.breath.idle', weight: 3, cooldownMs: 2000 },
  { id: 'life.eye.blink', weight: 3, cooldownMs: 1500 },
  { id: 'life.tail.soft', weight: 2, cooldownMs: 3000 },
  { id: 'life.eye.saccade', weight: 2, cooldownMs: 2000 },
  { id: 'life.nothing', weight: 2, cooldownMs: 1000 },
  { id: 'life.ear.listen', weight: 1.5, cooldownMs: 2500 },
  { id: 'life.face.micro_smile', weight: 1, cooldownMs: 4000 },
  { id: 'life.focus.child', weight: 1, cooldownMs: 5000 },
  { id: 'life.focus.object', weight: 1.5, cooldownMs: 3000 },
];

export class LifeScheduler {
  private state: RandomSchedulerState = createRandomSchedulerState();
  private clips: WeightedLifeClip[];

  constructor(clips: WeightedLifeClip[] = DEFAULT_IDLE_CLIPS) {
    this.clips = clips.map((c) => ({ ...c }));
  }

  getState(): RandomSchedulerState {
    return this.state;
  }

  /** Story influence merges into AI multipliers (probabilities only). */
  applyStory(storyId: StoryTokenId | undefined): void {
    const w = lifeWeightsForStory(storyId);
    const asRecord: Record<string, number> = { ...this.state.aiWeightMultipliers };
    for (const [id, mult] of Object.entries(w)) {
      if (typeof mult === 'number') {
        asRecord[id] = (asRecord[id] ?? 1) * mult;
      }
    }
    this.state = { ...this.state, aiWeightMultipliers: asRecord };
  }

  applyAiContext(ctx: AiLifeContext): void {
    this.state = applyAiLifeWeights(this.state, ctx);
  }

  next(opts: RandomSchedulerOptions = {}): LifeTokenId | 'life.nothing' | null {
    const picked = pickWeightedLifeClip(this.clips, this.state, opts);
    if (!picked) return null;
    this.state = picked.nextState;
    return picked.clip.id as LifeTokenId | 'life.nothing';
  }
}
