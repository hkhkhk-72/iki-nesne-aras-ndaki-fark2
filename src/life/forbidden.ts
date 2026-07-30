/**
 * MBA-LIFE-001 — Forbidden rules (Foundation).
 */

export const LIFE_FORBIDDEN = {
  roboticLoops: false,
  synchronizedBlinking: false,
  constantSmiling: false,
  exaggeratedSquash: false,
  suddenMovements: false,
  horrorTiming: false,
  /** Staring longer than 2 sec forbidden; contact max 1.2s. */
  stareLongerThanMs: 2000,
  hyperactiveIdle: false,
} as const;

export const LIFE_STARE_HARD_CAP_MS = 2000;
export const LIFE_EYE_CONTACT_MAX_MS = 1200;

export function assertLifeForbiddenRules(): boolean {
  return (
    LIFE_FORBIDDEN.roboticLoops === false &&
    LIFE_FORBIDDEN.synchronizedBlinking === false &&
    LIFE_FORBIDDEN.constantSmiling === false &&
    LIFE_FORBIDDEN.exaggeratedSquash === false &&
    LIFE_FORBIDDEN.suddenMovements === false &&
    LIFE_FORBIDDEN.horrorTiming === false &&
    LIFE_FORBIDDEN.hyperactiveIdle === false &&
    LIFE_FORBIDDEN.stareLongerThanMs === LIFE_STARE_HARD_CAP_MS &&
    LIFE_EYE_CONTACT_MAX_MS <= LIFE_STARE_HARD_CAP_MS
  );
}

export function isStareDurationAllowed(ms: number): boolean {
  return ms <= LIFE_EYE_CONTACT_MAX_MS && ms <= LIFE_STARE_HARD_CAP_MS;
}
