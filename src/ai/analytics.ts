/**
 * LS-006 / LS-011 / AI analytics — puan üretmez.
 * Olaylar ExperienceObserver üzerinden kaydedilir.
 * observe_compare_v2 verileri anonim tutulur.
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

/**
 * ai.observe_compare_v2 — karşılaştırma gözlemi (LS-011 prep).
 * Anonim: çocuk kimliği / PII yok; yalnızca davranış alanları.
 */
export interface ObserveCompareV2Payload {
  /** İlk bakılan grup kimliği. */
  firstLookedGroupId: string | null;
  /** İlk dokunulan grup kimliği. */
  firstTouchedGroupId: string | null;
  /** Karar süresi (ms). */
  decisionMs: number | null;
  /** Keşif dokunuşları (yanlış etiket yok — MB-269). */
  exploreTouchCount: number;
  /** Bekleme süresi (ms). */
  waitMs: number | null;
}

/** Payload → anonim detay dizesi (PII yok). */
export function serializeObserveCompareV2(p: ObserveCompareV2Payload): string {
  return [
    `look=${p.firstLookedGroupId ?? '-'}`,
    `touch=${p.firstTouchedGroupId ?? '-'}`,
    `decisionMs=${p.decisionMs ?? '-'}`,
    `explore=${p.exploreTouchCount}`,
    `waitMs=${p.waitMs ?? '-'}`,
  ].join('|');
}

export function registerObserveCompareV2(
  observer: ExperienceObserver,
  sceneId: string,
  payload: ObserveCompareV2Payload,
): void {
  observer.record(sceneId, 'observe_compare_v2', serializeObserveCompareV2(payload));
}
