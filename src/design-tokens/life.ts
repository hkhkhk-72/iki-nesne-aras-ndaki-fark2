/**
 * life.* — Character Life Token namespace (MBA-LIFE-001 Foundation).
 *
 * Characters must never appear static. Life emerges through tiny,
 * almost invisible behaviors — organic, not scripted.
 *
 * Infrastructure integrated — no gameplay.
 */

export type LifeTokenGroup =
  | 'life.eye'
  | 'life.face'
  | 'life.breath'
  | 'life.tail'
  | 'life.ear'
  | 'life.idle'
  | 'life.random'
  | 'life.motion'
  | 'life.focus'
  | 'life.emotion';

/**
 * Layer 01–09 — independent; never block each other.
 */
export type LifeLayerId =
  | 'breath' // 01
  | 'blink' // 02
  | 'eye_movement' // 03
  | 'facial_expression' // 04
  | 'head_motion' // 05
  | 'ear_motion' // 06
  | 'tail_motion' // 07
  | 'basket_reaction' // 08
  | 'leaf_reaction'; // 09

export const LIFE_LAYERS: readonly LifeLayerId[] = [
  'breath',
  'blink',
  'eye_movement',
  'facial_expression',
  'head_motion',
  'ear_motion',
  'tail_motion',
  'basket_reaction',
  'leaf_reaction',
] as const;

export const LIFE_LAYER_INDEX: Record<LifeLayerId, number> = {
  breath: 1,
  blink: 2,
  eye_movement: 3,
  facial_expression: 4,
  head_motion: 5,
  ear_motion: 6,
  tail_motion: 7,
  basket_reaction: 8,
  leaf_reaction: 9,
};

export type LifeTokenId =
  | 'life.eye.soft_gaze'
  | 'life.eye.blink'
  | 'life.eye.saccade'
  | 'life.eye.contact'
  | 'life.face.micro_smile'
  | 'life.face.thinking'
  | 'life.breath.calm'
  | 'life.breath.idle'
  | 'life.tail.soft'
  | 'life.ear.listen'
  | 'life.focus.child'
  | 'life.focus.object'
  | 'life.idle.presence'
  | 'life.random.scheduler'
  | 'life.motion.subtle'
  | 'life.emotion.bridge';

export interface LifeToken {
  id: LifeTokenId;
  group: LifeTokenGroup;
  feel: string;
  amplitude: 'subtle' | 'micro';
  layers: LifeLayerId[];
  /** Optional timing contract (ms). */
  timing?: {
    intervalMinMs?: number;
    intervalMaxMs?: number;
    maxDurationMs?: number;
    cycleMs?: number;
  };
}

export const LIFE_TOKEN_NAMESPACE = 'life.' as const;

export const LIFE_TOKEN_GROUPS: readonly LifeTokenGroup[] = [
  'life.eye',
  'life.face',
  'life.breath',
  'life.tail',
  'life.ear',
  'life.idle',
  'life.random',
  'life.motion',
  'life.focus',
  'life.emotion',
] as const;

export const lifeTokens: Record<LifeTokenId, LifeToken> = {
  'life.eye.soft_gaze': {
    id: 'life.eye.soft_gaze',
    group: 'life.eye',
    feel: 'Gözler canlı; bakış baskısız.',
    amplitude: 'micro',
    layers: ['eye_movement'],
  },
  'life.eye.blink': {
    id: 'life.eye.blink',
    group: 'life.eye',
    feel: 'Doğal kırpma — asla senkron robotik değil.',
    amplitude: 'micro',
    layers: ['blink'],
  },
  'life.eye.saccade': {
    id: 'life.eye.saccade',
    group: 'life.eye',
    feel: 'Küçük göz hareketi.',
    amplitude: 'micro',
    layers: ['eye_movement'],
    timing: { intervalMinMs: 2000, intervalMaxMs: 5000 },
  },
  'life.eye.contact': {
    id: 'life.eye.contact',
    group: 'life.eye',
    feel: 'Doğal göz teması — kısa.',
    amplitude: 'micro',
    layers: ['eye_movement'],
    timing: { maxDurationMs: 1200 },
  },
  'life.face.micro_smile': {
    id: 'life.face.micro_smile',
    group: 'life.face',
    feel: 'Çok hafif gülümseme — rastgele, sürekli değil.',
    amplitude: 'micro',
    layers: ['facial_expression'],
  },
  'life.face.thinking': {
    id: 'life.face.thinking',
    group: 'life.face',
    feel: 'Minik kaş hareketi.',
    amplitude: 'micro',
    layers: ['facial_expression', 'head_motion'],
  },
  'life.breath.calm': {
    id: 'life.breath.calm',
    group: 'life.breath',
    feel: 'Sakin nefes.',
    amplitude: 'subtle',
    layers: ['breath'],
  },
  'life.breath.idle': {
    id: 'life.breath.idle',
    group: 'life.breath',
    feel: 'Yavaş nefes — 5 sn döngü.',
    amplitude: 'subtle',
    layers: ['breath'],
    timing: { cycleMs: 5000 },
  },
  'life.tail.soft': {
    id: 'life.tail.soft',
    group: 'life.tail',
    feel: 'Kuyruk bağımsız, yumuşak süzülüş.',
    amplitude: 'subtle',
    layers: ['tail_motion'],
  },
  'life.ear.listen': {
    id: 'life.ear.listen',
    group: 'life.ear',
    feel: 'Kulakta minik ayar — rastgele.',
    amplitude: 'micro',
    layers: ['ear_motion'],
  },
  'life.focus.child': {
    id: 'life.focus.child',
    group: 'life.focus',
    feel: 'Kısa süre çocuğa bakar.',
    amplitude: 'micro',
    layers: ['eye_movement', 'head_motion'],
    timing: { maxDurationMs: 1200 },
  },
  'life.focus.object': {
    id: 'life.focus.object',
    group: 'life.focus',
    feel: 'Dikkat nesneye döner.',
    amplitude: 'micro',
    layers: ['eye_movement', 'head_motion'],
  },
  'life.idle.presence': {
    id: 'life.idle.presence',
    group: 'life.idle',
    feel: 'Hiçbir şey yapmasa da canlı.',
    amplitude: 'subtle',
    layers: ['breath', 'blink', 'eye_movement', 'facial_expression'],
  },
  'life.random.scheduler': {
    id: 'life.random.scheduler',
    group: 'life.random',
    feel: 'Ağırlıklı rastgele yaşam — özdeş döngü yok.',
    amplitude: 'micro',
    layers: ['blink', 'eye_movement', 'facial_expression', 'tail_motion', 'ear_motion'],
  },
  'life.motion.subtle': {
    id: 'life.motion.subtle',
    group: 'life.motion',
    feel: 'Sepet / yaprak ince kıpırtı.',
    amplitude: 'subtle',
    layers: ['basket_reaction', 'leaf_reaction', 'tail_motion', 'ear_motion'],
  },
  'life.emotion.bridge': {
    id: 'life.emotion.bridge',
    group: 'life.emotion',
    feel: 'Story token → life ağırlıkları.',
    amplitude: 'micro',
    layers: ['breath', 'blink', 'facial_expression', 'head_motion'],
  },
};

export function isLifeTokenId(id: string): id is LifeTokenId {
  return id.startsWith(LIFE_TOKEN_NAMESPACE) && id in lifeTokens;
}

export function lifeTokensInGroup(group: LifeTokenGroup): LifeToken[] {
  return Object.values(lifeTokens).filter((t) => t.group === group);
}

/** Idle must never loop identically — max identical sequence = 1. */
export const IDLE_VARIATION_RULES = {
  maxIdenticalSequence: 1 as const,
  exampleFlow: ['breath', 'blink', 'tail', 'eye', 'nothing', 'breath'] as const,
} as const;
