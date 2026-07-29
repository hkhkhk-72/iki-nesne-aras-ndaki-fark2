/**
 * Character DNA — durum / poz / animasyon kimlikleri.
 * LS-006 Trust paketi (GRP-001 APPROVED).
 */

export type CharacterEmotionState = 'emotion.trust' | 'emotion.curious' | 'emotion.calm';
export type CharacterPose = 'pose.smile_small' | 'pose.idle' | 'pose.look';
export type CharacterAnim =
  | 'anim.nod_small'
  | 'anim.eyeWarm'
  | 'anim.wave'
  | 'anim.none';

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
  'pose.smile_small': 'Küçük gülümseme',
  'anim.nod_small': 'Hafif baş sallama',
  'anim.eyeWarm': 'Sıcak bakış',
};
