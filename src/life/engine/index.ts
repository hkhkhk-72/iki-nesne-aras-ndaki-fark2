/**
 * MBA-LIFE-001 Foundation — React Native / engine module barrel.
 */

export { CharacterLifeEngine, createCharacterLifeEngine } from './CharacterLifeEngine';
export { LifeScheduler, DEFAULT_IDLE_CLIPS } from './LifeScheduler';
export {
  LifeLayerController,
  BreathController,
  BlinkController,
  EyeController,
  TailController,
  EarController,
  FocusController,
  FaceController,
} from './controllers';
export { resolveEmotionProfile, assertEmotionBridge } from './EmotionBridge';
export {
  STORY_LIFE_INFLUENCE,
  lifeWeightsForStory,
  type LifeWeightMap,
} from './StoryTokenBridge';
export {
  aiLifeWeightAdjustments,
  applyAiLifeWeights,
  assertAiWeightController,
  type AiLifeContext,
} from './AIWeightController';
