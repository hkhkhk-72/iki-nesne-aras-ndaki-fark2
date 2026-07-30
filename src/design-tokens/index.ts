/**
 * GRS-001C — Design Token Foundation (kod köprüsü)
 *
 * Figma `01 Tokens` klasörünün Expo/RN karşılığı.
 * Yeni sistem icat etmez; kurucu Design System’i üretime açar.
 */

export {
  color,
  spacing,
  radius,
  typography,
  shadow,
  touchTarget,
  composition,
} from './visual';

export { storyTokens, type StoryToken, type StoryTokenId } from './story';
export { eduTokens, type EduToken, type EduTokenId } from './educational';
export { aiTokens, type AiToken, type AiTokenId } from './ai';
export {
  motionTokens,
  LOOK_BACK_CHILD_SEQUENCE,
  LOOK_BACK_CHILD_TOTAL_MS,
  type MotionToken,
  type MotionTokenId,
  type MotionKind,
  type LookBackStep,
} from './motion';
export { audioGrs001, audioLayerLimit, type AudioBudget, type AudioLayer } from './audio';
export {
  LS011_PERF,
  assertLs011PerfContract,
  type Ls011PerfContract,
} from './performance';
export {
  lifeTokens,
  LIFE_LAYERS,
  LIFE_TOKEN_GROUPS,
  LIFE_TOKEN_NAMESPACE,
  isLifeTokenId,
  lifeTokensInGroup,
  type LifeToken,
  type LifeTokenId,
  type LifeTokenGroup,
  type LifeLayerId,
} from './life';

/** @deprecated Geriye dönük not — ekran stilleri için `@/theme` kullanın. */
