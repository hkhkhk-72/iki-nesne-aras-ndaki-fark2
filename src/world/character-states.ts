/**
 * Character DNA — durum / poz / animasyon kimlikleri.
 * LS-006 Trust paketi (GRP-001 APPROVED).
 */

export type CharacterEmotionState =
  | 'emotion.trust'
  | 'emotion.curious'
  | 'emotion.calm'
  | 'emotion.observe';
export type CharacterPose = 'pose.smile_small' | 'pose.idle' | 'pose.look' | 'pose.think';
export type CharacterAnim =
  | 'anim.nod_small'
  | 'anim.eyeWarm'
  | 'anim.wave'
  | 'anim.none'
  | 'anim.observe';

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

export const CHARACTER_STATE_LABELS: Record<string, string> = {
  'emotion.trust': 'Güven',
  'emotion.observe': 'Gözlem',
  'pose.smile_small': 'Küçük gülümseme',
  'pose.think': 'Düşünme',
  'anim.nod_small': 'Hafif baş sallama',
  'anim.eyeWarm': 'Sıcak bakış',
  'anim.observe': 'Gözlem duruşu',
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
};
