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
 * Karşılaştırma stratejisi (anonim nitel etiket).
 * Çocuk yüzüne "yanlış" yazılmaz (MB-269); telemetri alanı ürün adıdır.
 */
export type ComparisonStrategy =
  | 'scan_both'
  | 'touch_first_seen'
  | 'touch_larger_guess'
  | 'touch_smaller_guess'
  | 'hesitate_then_choose'
  | 'unknown';

/**
 * ai.observe_compare_v2 — karşılaştırma gözlemi (LS-011 prep).
 * Anonim: çocuk kimliği / PII yok; yalnızca davranış alanları.
 */
export interface ObserveCompareV2Payload {
  /** firstViewedGroup — ilk bakılan grup. */
  firstViewedGroup: string | null;
  /** firstTouchedGroup — ilk dokunulan grup. */
  firstTouchedGroup: string | null;
  /** decisionTime — karar süresi (ms). */
  decisionTime: number | null;
  /**
   * wrongTouchCount — ürün telemetri adı.
   * Çocuk yüzünde "yanlış" yok; keşif / hizasız dokunuş sayısı.
   */
  wrongTouchCount: number;
  /** idleTime — bekleme süresi (ms). */
  idleTime: number | null;
  /** comparisonStrategy — karşılaştırma stratejisi. */
  comparisonStrategy: ComparisonStrategy;
}

/** Payload → anonim detay dizesi (PII yok). */
export function serializeObserveCompareV2(p: ObserveCompareV2Payload): string {
  return [
    `firstViewedGroup=${p.firstViewedGroup ?? '-'}`,
    `firstTouchedGroup=${p.firstTouchedGroup ?? '-'}`,
    `decisionTime=${p.decisionTime ?? '-'}`,
    `wrongTouchCount=${p.wrongTouchCount}`,
    `idleTime=${p.idleTime ?? '-'}`,
    `comparisonStrategy=${p.comparisonStrategy}`,
  ].join('|');
}

export function registerObserveCompareV2(
  observer: ExperienceObserver,
  sceneId: string,
  payload: ObserveCompareV2Payload,
): void {
  observer.record(sceneId, 'observe_compare_v2', serializeObserveCompareV2(payload));
}
