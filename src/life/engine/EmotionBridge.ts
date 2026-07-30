/**
 * Emotion compatibility — maps story mood to life feel (MBA-LIFE-001).
 * Emotion readable without audio (movement primary).
 */

import type { StoryTokenId } from '@/design-tokens/story';
import { lifeWeightsForStory, type LifeWeightMap } from './StoryTokenBridge';
import { SILENT_MODE_POLICY } from '@/core/accessibility';

export interface EmotionLifeProfile {
  storyId: StoryTokenId;
  weights: LifeWeightMap;
  movementPrimary: boolean;
  audioOptional: boolean;
}

export function resolveEmotionProfile(storyId: StoryTokenId): EmotionLifeProfile {
  return {
    storyId,
    weights: lifeWeightsForStory(storyId),
    movementPrimary: SILENT_MODE_POLICY.animationIsPrimaryChannel,
    audioOptional: SILENT_MODE_POLICY.audioOptional,
  };
}

export function assertEmotionBridge(): boolean {
  const safe = resolveEmotionProfile('story.safe');
  const curious = resolveEmotionProfile('story.curious');
  const deep = resolveEmotionProfile('story.thinking.deep');
  return (
    (safe.weights['life.breath.idle'] ?? 0) > 1 &&
    (curious.weights['life.eye.saccade'] ?? 0) > 1 &&
    (deep.weights['life.eye.saccade'] ?? 1) < 1 &&
    safe.movementPrimary &&
    deep.audioOptional
  );
}
