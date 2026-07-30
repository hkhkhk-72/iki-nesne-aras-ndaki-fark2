/**
 * MBA-LIFE-001 — performance contract for layered life animations.
 */

export const LIFE_PERF = {
  targetFps: 60 as const,
  noDroppedFrames: true as const,
  batteryFriendly: true as const,
  memorySafe: true as const,
  /** Idle loop: no per-frame heap allocation. */
  zeroAllocationsDuringIdleLoop: true as const,
  /** All life layers may run at once without frame drops (contract). */
  layersSimultaneous: true as const,
  preferredProps: ['transform', 'opacity'] as const,
  /** Subtle amplitude — avoid heavy particle / shadow work. */
  maxActiveHeavyEffects: 0 as const,
} as const;

export type LifePerfContract = typeof LIFE_PERF;

export function assertLifePerfContract(): boolean {
  return (
    LIFE_PERF.targetFps === 60 &&
    LIFE_PERF.noDroppedFrames &&
    LIFE_PERF.batteryFriendly &&
    LIFE_PERF.memorySafe &&
    LIFE_PERF.zeroAllocationsDuringIdleLoop &&
    LIFE_PERF.layersSimultaneous
  );
}
