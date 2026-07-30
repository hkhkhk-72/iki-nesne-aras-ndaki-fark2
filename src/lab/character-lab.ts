/**
 * MB-LAB-001 — Laboratuvar karakter davranışları.
 *
 * FN-001: Observe → Think → Smile → Invite
 * BO-001: Yalnızca çocuk uzun süre zorlanırsa ortaya çıkar.
 */

export type FindikBehaviourPhase = 'observe' | 'think' | 'smile' | 'invite';

export const FINDIK_OBSERVE_CYCLE: FindikBehaviourPhase[] = [
  'observe',
  'think',
  'smile',
  'invite',
];

/** Bilge’nin sahneye girmesi için minimum zorlanma süresi (ms). */
export const BILGE_APPEAR_ONLY_AFTER_MS = 12_000;

export const FINDIK_PHASE_CUES: Record<FindikBehaviourPhase, string> = {
  observe: 'story.observe — Fındık bakar, konuşmaz',
  think: 'story.notice — hafif düşünme duruşu',
  smile: 'pose.smile_small — küçük gülümseme',
  invite: 'story.discover — çocuğu davet eder',
};

/** LS-011 prep — uzun düşünme (Observe döngüsüne ek; gameplay bağlama sonra). */
export const FINDIK_DEEP_THINK_CUE =
  'story.thinking.deep — dünya sakin; Fındık bekler; Bilge konuşmaz';
