/**
 * Per-layer controllers — infrastructure specs (MBA-LIFE-001).
 * Drive Reanimated later; no scene gameplay wiring.
 */

import { lifeTokens, type LifeLayerId, type LifeTokenId } from '@/design-tokens/life';
import {
  LIFE_EYE_CONTACT_MAX_MS,
  isStareDurationAllowed,
} from '@/life/forbidden';

export interface LayerControllerSpec {
  layer: LifeLayerId;
  activeToken: LifeTokenId | null;
  intensity: number;
}

export class LifeLayerController {
  protected spec: LayerControllerSpec;

  constructor(layer: LifeLayerId) {
    this.spec = { layer, activeToken: null, intensity: 0 };
  }

  getSpec(): LayerControllerSpec {
    return this.spec;
  }

  activate(tokenId: LifeTokenId, intensity = 0.2): void {
    const token = lifeTokens[tokenId];
    if (!token.layers.includes(this.spec.layer)) return;
    this.spec = { ...this.spec, activeToken: tokenId, intensity };
  }

  release(): void {
    this.spec = { ...this.spec, activeToken: null, intensity: 0 };
  }
}

export class BreathController extends LifeLayerController {
  constructor() {
    super('breath');
  }

  cycleMs(): number {
    return lifeTokens['life.breath.idle'].timing?.cycleMs ?? 5000;
  }
}

export class BlinkController extends LifeLayerController {
  constructor() {
    super('blink');
  }
}

export class EyeController extends LifeLayerController {
  constructor() {
    super('eye_movement');
  }

  /** Enforces contact ≤ 1.2s / stare hard cap. */
  contactDurationMs(requested: number): number {
    const max = lifeTokens['life.eye.contact'].timing?.maxDurationMs ?? LIFE_EYE_CONTACT_MAX_MS;
    const clamped = Math.min(requested, max);
    return isStareDurationAllowed(clamped) ? clamped : max;
  }

  saccadeIntervalMs(random01: number): number {
    const t = lifeTokens['life.eye.saccade'].timing;
    const min = t?.intervalMinMs ?? 2000;
    const max = t?.intervalMaxMs ?? 5000;
    return Math.round(min + random01 * (max - min));
  }
}

export class TailController extends LifeLayerController {
  constructor() {
    super('tail_motion');
  }
}

export class EarController extends LifeLayerController {
  constructor() {
    super('ear_motion');
  }
}

export class FocusController extends LifeLayerController {
  constructor() {
    super('head_motion');
  }

  focusChild(): void {
    this.activate('life.focus.child', 0.18);
  }

  focusObject(): void {
    this.activate('life.focus.object', 0.18);
  }
}

export class FaceController extends LifeLayerController {
  constructor() {
    super('facial_expression');
  }
}
