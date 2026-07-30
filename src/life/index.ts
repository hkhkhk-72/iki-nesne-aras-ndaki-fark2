/**
 * Character Life System — engine prep (MBA-LIFE-001).
 */

export {
  createLifeLayerStack,
  applyLifeTokenToLayers,
  countActiveLayers,
  assertLayeredIdleSupport,
  type LifeLayerRuntime,
  type LayerState,
} from './layers';

export {
  createRandomSchedulerState,
  setAiOverride,
  pickWeightedLifeClip,
  assertRandomSchedulerContract,
  type WeightedLifeClip,
  type RandomSchedulerState,
  type RandomSchedulerOptions,
} from './random-scheduler';

export {
  LIFE_PERF,
  assertLifePerfContract,
  type LifePerfContract,
} from './performance';
