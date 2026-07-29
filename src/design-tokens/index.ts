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
export { motionTokens, type MotionToken, type MotionTokenId } from './motion';
export { audioGrs001, audioLayerLimit, type AudioBudget, type AudioLayer } from './audio';

/** @deprecated Geriye dönük not — ekran stilleri için `@/theme` kullanın. */
