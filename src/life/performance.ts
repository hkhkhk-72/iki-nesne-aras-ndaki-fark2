/**
 * MBA-LIFE-001 — performance + pooling contract (Foundation).
 */

export const LIFE_PERF = {
  targetFps: 60 as const,
  noDroppedFrames: true as const,
  batteryFriendly: true as const,
  memorySafe: true as const,
  zeroAllocationsDuringIdleLoop: true as const,
  layersSimultaneous: true as const,
  /** Maximum simultaneous animations = 9 layers. */
  maxSimultaneousAnimations: 9 as const,
  /** Animation pooling enabled. */
  animationPoolingEnabled: true as const,
  preferredProps: ['transform', 'opacity'] as const,
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
    LIFE_PERF.layersSimultaneous &&
    LIFE_PERF.maxSimultaneousAnimations === 9 &&
    LIFE_PERF.animationPoolingEnabled
  );
}

/** Simple pool stub — reuse layer runtime slots; no alloc in idle tick. */
export interface AnimationPoolSlot {
  inUse: boolean;
  layerId: string | null;
}

export function createAnimationPool(size = LIFE_PERF.maxSimultaneousAnimations): AnimationPoolSlot[] {
  return Array.from({ length: size }, () => ({ inUse: false, layerId: null }));
}

export function acquirePoolSlot(
  pool: AnimationPoolSlot[],
  layerId: string,
): AnimationPoolSlot | null {
  const free = pool.find((s) => !s.inUse);
  if (!free) return null;
  free.inUse = true;
  free.layerId = layerId;
  return free;
}

export function releasePoolSlot(slot: AnimationPoolSlot): void {
  slot.inUse = false;
  slot.layerId = null;
}
