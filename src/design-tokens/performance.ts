/**
 * LS-011 prep — performans sözleşmesi.
 * Idle animasyonlar GPU-dostu; idle loop sırasında sıfır yeni allocation.
 */

export const LS011_PERF = {
  /** Hedef kare hızı. */
  targetFps: 60 as const,
  /** Dropped frame kabul edilmez (sözleşme). */
  noDroppedFrames: true as const,
  /** Idle animasyonlar native driver / reanimated UI thread. */
  idleGpuFriendly: true as const,
  /** Bellek: loop cancel + unmount cleanup zorunlu. */
  memorySafe: true as const,
  /**
   * Idle loop sırasında yeni heap allocation yok.
   * withRepeat/withSequence bir kez kurulur; tick’te alloc yok.
   */
  zeroAllocationsDuringIdleLoop: true as const,
  /** Soft bounce / breath — düşük maliyetli transform. */
  preferredProps: ['transform', 'opacity'] as const,
} as const;

export type Ls011PerfContract = typeof LS011_PERF;

/** Performans sözleşmesi sağlam mı? */
export function assertLs011PerfContract(): boolean {
  return (
    LS011_PERF.targetFps === 60 &&
    LS011_PERF.noDroppedFrames &&
    LS011_PERF.idleGpuFriendly &&
    LS011_PERF.memorySafe &&
    LS011_PERF.zeroAllocationsDuringIdleLoop
  );
}
