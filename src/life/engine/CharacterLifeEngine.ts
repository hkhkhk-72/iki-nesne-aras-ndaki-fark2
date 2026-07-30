/**
 * CharacterLifeEngine — MBA-LIFE-001 Foundation orchestrator.
 * Infrastructure only — not wired to gameplay scenes.
 */

import type { StoryTokenId } from '@/design-tokens/story';
import {
  LIFE_LAYERS,
  isLifeTokenId,
  type LifeLayerId,
  type LifeTokenId,
} from '@/design-tokens/life';
import {
  createLifeLayerStack,
  applyLifeTokenToLayers,
  type LifeLayerRuntime,
} from '@/life/layers';
import { LIFE_PERF, createAnimationPool, type AnimationPoolSlot } from '@/life/performance';
import { LifeScheduler } from './LifeScheduler';
import {
  BreathController,
  BlinkController,
  EyeController,
  TailController,
  EarController,
  FocusController,
  FaceController,
  LifeLayerController,
} from './controllers';
import { resolveEmotionProfile } from './EmotionBridge';
import type { AiLifeContext } from './AIWeightController';
import type { RandomSchedulerOptions } from '@/life/random-scheduler';

export class CharacterLifeEngine {
  readonly scheduler = new LifeScheduler();
  readonly breath = new BreathController();
  readonly blink = new BlinkController();
  readonly eye = new EyeController();
  readonly face = new FaceController();
  readonly tail = new TailController();
  readonly ear = new EarController();
  readonly focus = new FocusController();

  private stack = createLifeLayerStack();
  private pool: AnimationPoolSlot[] = createAnimationPool();
  private storyId: StoryTokenId | undefined;

  setStory(storyId: StoryTokenId): void {
    this.storyId = storyId;
    this.scheduler.applyStory(storyId);
    resolveEmotionProfile(storyId);
  }

  setAiContext(ctx: AiLifeContext): void {
    this.scheduler.applyAiContext(ctx);
  }

  /** Advance idle variation — organic, never identical loop. */
  tickIdle(opts: RandomSchedulerOptions = {}): string | null {
    const next = this.scheduler.next(opts);
    if (!next || next === 'life.nothing') return next;
    if (isLifeTokenId(next)) this.activateToken(next);
    return next;
  }

  activateToken(tokenId: LifeTokenId): void {
    this.stack = applyLifeTokenToLayers(this.stack, tokenId);
    const map: Partial<Record<LifeTokenId, LifeLayerController>> = {
      'life.breath.idle': this.breath,
      'life.breath.calm': this.breath,
      'life.eye.blink': this.blink,
      'life.eye.saccade': this.eye,
      'life.eye.contact': this.eye,
      'life.eye.soft_gaze': this.eye,
      'life.face.micro_smile': this.face,
      'life.face.thinking': this.face,
      'life.tail.soft': this.tail,
      'life.ear.listen': this.ear,
      'life.focus.child': this.focus,
      'life.focus.object': this.focus,
    };
    map[tokenId]?.activate(tokenId);
  }

  getLayerStack(): Record<LifeLayerId, LifeLayerRuntime> {
    return this.stack;
  }

  getPool(): AnimationPoolSlot[] {
    return this.pool;
  }

  getPerfContract() {
    return LIFE_PERF;
  }

  getStoryId(): StoryTokenId | undefined {
    return this.storyId;
  }

  layerControllers(): LifeLayerController[] {
    return [this.breath, this.blink, this.eye, this.face, this.tail, this.ear, this.focus];
  }

  assertInfrastructure(): boolean {
    return (
      LIFE_LAYERS.length === 9 &&
      this.pool.length === 9 &&
      this.getPerfContract().animationPoolingEnabled &&
      this.breath.cycleMs() === 5000 &&
      this.eye.contactDurationMs(5000) === 1200
    );
  }
}

export function createCharacterLifeEngine(): CharacterLifeEngine {
  return new CharacterLifeEngine();
}
