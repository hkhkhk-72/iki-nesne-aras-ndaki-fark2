/**
 * LS-006 / AI analytics — puan üretmez.
 * Olaylar ExperienceObserver üzerinden kaydedilir.
 */

import type { ExperienceObserver } from '@/ai/observer';
import { HESITATION_THRESHOLD_MS } from '@/ai/observer';

export type DecisionConfidence = 'high' | 'medium' | 'low';

/** İlk dokunuş gecikmesinden nitel karar güveni. */
export function confidenceFromLatency(latencyMs: number | null): DecisionConfidence {
  if (latencyMs === null) return 'medium';
  if (latencyMs < 2000) return 'high';
  if (latencyMs > HESITATION_THRESHOLD_MS) return 'low';
  return 'medium';
}

/**
 * ai.first_success + ai.decision_confidence kaydı.
 * Skor / ödül üretmez.
 */
export function registerFirstSuccess(
  observer: ExperienceObserver,
  sceneId: string,
  latencyMs: number | null,
): void {
  const confidence = confidenceFromLatency(latencyMs);
  observer.record(sceneId, 'first_success', 'ls006_trust');
  observer.record(sceneId, 'decision_confidence', confidence);
}

/** MB-LAB-001 AI olayları — puan üretmez. */
export function registerLabObservation(
  observer: ExperienceObserver,
  sceneId: string,
  event:
    | 'observe_pattern'
    | 'subitize_attempt'
    | 'grouping_strategy'
    | 'visual_focus',
  detail?: string,
): void {
  observer.record(sceneId, event, detail);
}
