/**
 * MBA-CHAR-DNA-001 — Character DNA Registry (LS-011 prep exposure).
 * FN-001 / BO-001 kimliklerini Character DNA durumlarına bağlar.
 */

import { getCharacter } from '@/world/characters';
import {
  FINDIK_DEEP_THINKING_STATE,
  FINDIK_TRUST_STATE,
  type CharacterAnim,
} from '@/world/character-states';
import { DEEP_BREATH_SPEC, DEEP_BREATH_IDLE_AFTER_MS } from '@/world/assets';

export const MBA_CHAR_DNA_001 = 'MBA-CHAR-DNA-001' as const;

/** GRP kimlik → runtime karakter. */
export const CHAR_DNA_IDS = {
  'FN-001': 'findik',
  'BO-001': 'bilge',
} as const;

export const LS011_CHAR_DNA = {
  /** FN-001 waits calmly during deep thinking. */
  fn001: {
    code: 'FN-001' as const,
    characterId: CHAR_DNA_IDS['FN-001'],
    state: FINDIK_DEEP_THINKING_STATE,
    anim: 'anim.deep_breath' as CharacterAnim,
    deepBreath: DEEP_BREATH_SPEC,
    idleTriggerMs: DEEP_BREATH_IDLE_AFTER_MS,
    /** Amplitude extremely small — never exaggerated. */
    amplitudeRule: 'extremely_small' as const,
  },
  /** BO-001 remains completely silent — no hints. */
  bo001: {
    code: 'BO-001' as const,
    characterId: CHAR_DNA_IDS['BO-001'],
    speaksDuringDeepThink: false as const,
    hintsAllowed: false as const,
  },
  trustReference: FINDIK_TRUST_STATE,
} as const;

export function resolveFn001() {
  return getCharacter(CHAR_DNA_IDS['FN-001']);
}

export function resolveBo001() {
  return getCharacter(CHAR_DNA_IDS['BO-001']);
}

export function assertMbaCharDna001Registry(): boolean {
  const fn = resolveFn001();
  const bo = resolveBo001();
  return (
    fn.id === 'findik' &&
    bo.id === 'bilge' &&
    LS011_CHAR_DNA.fn001.anim === 'anim.deep_breath' &&
    LS011_CHAR_DNA.bo001.speaksDuringDeepThink === false &&
    LS011_CHAR_DNA.fn001.amplitudeRule === 'extremely_small' &&
    LS011_CHAR_DNA.fn001.idleTriggerMs === 5000
  );
}
