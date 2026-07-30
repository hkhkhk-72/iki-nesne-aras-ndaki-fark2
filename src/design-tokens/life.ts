/**
 * life.* — Character Life Token namespace (MBA-LIFE-001 prep).
 *
 * Reserved groups:
 * life.eye.* · life.face.* · life.breath.* · life.idle.* · life.random.* · life.motion.*
 *
 * Life is created through subtle motion, not constant animation.
 * No gameplay — infrastructure registration only.
 */

export type LifeTokenGroup =
  | 'life.eye'
  | 'life.face'
  | 'life.breath'
  | 'life.idle'
  | 'life.random'
  | 'life.motion';

export type LifeTokenId =
  | 'life.eye.soft_gaze'
  | 'life.eye.blink'
  | 'life.face.micro_smile'
  | 'life.breath.calm'
  | 'life.idle.presence'
  | 'life.random.scheduler'
  | 'life.motion.subtle';

export interface LifeToken {
  id: LifeTokenId;
  group: LifeTokenGroup;
  /** Çocuk / gözlemci hissi — abartısız. */
  feel: string;
  /** Amplitude: life = subtle, never exaggerated. */
  amplitude: 'subtle' | 'micro';
  /** Bağımsız katman(lar). */
  layers: LifeLayerId[];
}

/** Independent idle layers — may run simultaneously. */
export type LifeLayerId =
  | 'breath'
  | 'eyes'
  | 'blink'
  | 'face'
  | 'tail'
  | 'ears'
  | 'basket'
  | 'leaves';

export const LIFE_LAYERS: readonly LifeLayerId[] = [
  'breath',
  'eyes',
  'blink',
  'face',
  'tail',
  'ears',
  'basket',
  'leaves',
] as const;

/** Reserved namespace prefixes (MBA-LIFE-001). */
export const LIFE_TOKEN_NAMESPACE = 'life.' as const;

export const LIFE_TOKEN_GROUPS: readonly LifeTokenGroup[] = [
  'life.eye',
  'life.face',
  'life.breath',
  'life.idle',
  'life.random',
  'life.motion',
] as const;

export const lifeTokens: Record<LifeTokenId, LifeToken> = {
  'life.eye.soft_gaze': {
    id: 'life.eye.soft_gaze',
    group: 'life.eye',
    feel: 'Gözler canlı; bakış baskısız.',
    amplitude: 'micro',
    layers: ['eyes'],
  },
  'life.eye.blink': {
    id: 'life.eye.blink',
    group: 'life.eye',
    feel: 'Doğal kırpma.',
    amplitude: 'micro',
    layers: ['blink'],
  },
  'life.face.micro_smile': {
    id: 'life.face.micro_smile',
    group: 'life.face',
    feel: 'Çok hafif yüz ifadesi.',
    amplitude: 'micro',
    layers: ['face'],
  },
  'life.breath.calm': {
    id: 'life.breath.calm',
    group: 'life.breath',
    feel: 'Sakin nefes; abartısız.',
    amplitude: 'subtle',
    layers: ['breath'],
  },
  'life.idle.presence': {
    id: 'life.idle.presence',
    group: 'life.idle',
    feel: 'Hiçbir şey yapmasa da canlı.',
    amplitude: 'subtle',
    layers: ['breath', 'eyes', 'blink', 'face'],
  },
  'life.random.scheduler': {
    id: 'life.random.scheduler',
    group: 'life.random',
    feel: 'Tekrar etmeyen, ağırlıklı rastgele yaşam.',
    amplitude: 'micro',
    layers: ['eyes', 'blink', 'face', 'tail', 'ears'],
  },
  'life.motion.subtle': {
    id: 'life.motion.subtle',
    group: 'life.motion',
    feel: 'Dünya / sepet / yaprak — ince kıpırtı.',
    amplitude: 'subtle',
    layers: ['basket', 'leaves', 'tail', 'ears'],
  },
};

export function isLifeTokenId(id: string): id is LifeTokenId {
  return id.startsWith(LIFE_TOKEN_NAMESPACE) && id in lifeTokens;
}

export function lifeTokensInGroup(group: LifeTokenGroup): LifeToken[] {
  return Object.values(lifeTokens).filter((t) => t.group === group);
}
