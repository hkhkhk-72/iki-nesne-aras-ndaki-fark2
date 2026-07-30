/**
 * Character DNA — durum / poz / animasyon kimlikleri.
 * LS-006 Trust + LS-011 prep (GRP-001).
 */

export type CharacterEmotionState =
  | 'emotion.trust'
  | 'emotion.curious'
  | 'emotion.calm'
  | 'emotion.observe'
  | 'emotion.thinking';
export type CharacterPose =
  | 'pose.smile_small'
  | 'pose.idle'
  | 'pose.look'
  | 'pose.think'
  | 'pose.look_back';
export type CharacterAnim =
  | 'anim.nod_small'
  | 'anim.eyeWarm'
  | 'anim.wave'
  | 'anim.none'
  | 'anim.observe'
  /** LS-011 prep — idle derin nefes (5 sn sonra). */
  | 'anim.deep_breath';

export interface CharacterStateBundle {
  emotion: CharacterEmotionState;
  pose: CharacterPose;
  anims: CharacterAnim[];
}

/** LS-006 — Fındık güven durumu. */
export const FINDIK_TRUST_STATE: CharacterStateBundle = {
  emotion: 'emotion.trust',
  pose: 'pose.smile_small',
  anims: ['anim.nod_small', 'anim.eyeWarm'],
};

/** LS-011 prep — derin düşünme: Fındık bekler, Bilge susar. */
export const FINDIK_DEEP_THINKING_STATE: CharacterStateBundle = {
  emotion: 'emotion.thinking',
  pose: 'pose.look_back',
  anims: ['anim.deep_breath', 'anim.observe'],
};

export const CHARACTER_STATE_LABELS: Record<string, string> = {
  'emotion.trust': 'Güven',
  'emotion.observe': 'Gözlem',
  'emotion.thinking': 'Derin düşünme',
  'pose.smile_small': 'Küçük gülümseme',
  'pose.think': 'Düşünme',
  'pose.look_back': 'Çocuğa bakıp palamutlara dönüş',
  'anim.nod_small': 'Hafif baş sallama',
  'anim.eyeWarm': 'Sıcak bakış',
  'anim.observe': 'Gözlem duruşu',
  'anim.deep_breath': 'Derin nefes (idle)',
};

/** FN Observe → Think → Smile → Invite (MB-LAB-001). */
export const FINDIK_LAB_BEHAVIOUR = {
  observe: {
    emotion: 'emotion.observe' as const,
    pose: 'pose.look' as const,
    anims: ['anim.observe' as const],
  },
  think: {
    emotion: 'emotion.curious' as const,
    pose: 'pose.think' as const,
    anims: ['anim.none' as const],
  },
  smile: {
    emotion: 'emotion.trust' as const,
    pose: 'pose.smile_small' as const,
    anims: ['anim.nod_small' as const, 'anim.eyeWarm' as const],
  },
  invite: {
    emotion: 'emotion.curious' as const,
    pose: 'pose.smile_small' as const,
    anims: ['anim.wave' as const],
  },
  /** LS-011 prep — uzun düşünme. */
  deepThink: {
    emotion: 'emotion.thinking' as const,
    pose: 'pose.look_back' as const,
    anims: ['anim.deep_breath' as const],
  },
};
