/**
 * Character Life System — MBA-LIFE-001 Foundation.
 */

export {
  createLifeLayerStack,
  applyLifeTokenToLayers,
  countActiveLayers,
  assertLayeredIdleSupport,
  assertLayersNonBlocking,
  type LifeLayerRuntime,
  type LayerState,
} from './layers';

export {
  createRandomSchedulerState,
  setAiWeightMultipliers,
  pickWeightedLifeClip,
  createSeededRandom,
  assertRandomSchedulerContract,
  type WeightedLifeClip,
  type RandomSchedulerState,
  type RandomSchedulerOptions,
} from './random-scheduler';

export {
  LIFE_PERF,
  assertLifePerfContract,
  createAnimationPool,
  acquirePoolSlot,
  releasePoolSlot,
  type LifePerfContract,
  type AnimationPoolSlot,
} from './performance';

export {
  LIFE_FORBIDDEN,
  LIFE_STARE_HARD_CAP_MS,
  LIFE_EYE_CONTACT_MAX_MS,
  assertLifeForbiddenRules,
  isStareDurationAllowed,
} from './forbidden';

export * from './engine';
