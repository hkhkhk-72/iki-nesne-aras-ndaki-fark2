/**
 * Story Token → Life Token weight influence (MBA-LIFE-001).
 */

import type { StoryTokenId } from '@/design-tokens/story';
import type { LifeTokenId } from '@/design-tokens/life';

/** Relative weight multipliers for life clips under a story mood. */
export type LifeWeightMap = Partial<Record<LifeTokenId, number>>;

/**
 * story.safe → slow blink · deep breath · soft smile
 * story.curious → faster eye · head tilt · focus object
 * story.thinking.deep → reduced movement · slow breath · long observation
 */
export const STORY_LIFE_INFLUENCE: Partial<Record<StoryTokenId, LifeWeightMap>> = {
  'story.safe': {
    'life.eye.blink': 1.4,
    'life.breath.idle': 1.5,
    'life.breath.calm': 1.4,
    'life.face.micro_smile': 1.3,
    'life.eye.saccade': 0.7,
  },
  'story.curious': {
    'life.eye.saccade': 1.6,
    'life.face.thinking': 1.3,
    'life.focus.object': 1.5,
    'life.ear.listen': 1.2,
  },
  'story.thinking.deep': {
    'life.breath.idle': 1.6,
    'life.breath.calm': 1.5,
    'life.eye.saccade': 0.4,
    'life.tail.soft': 0.5,
    'life.face.micro_smile': 0.3,
    'life.focus.object': 1.2,
    'life.eye.contact': 0.6,
  },
};

export function lifeWeightsForStory(storyId: StoryTokenId | undefined): LifeWeightMap {
  if (!storyId) return {};
  return STORY_LIFE_INFLUENCE[storyId] ?? {};
}
