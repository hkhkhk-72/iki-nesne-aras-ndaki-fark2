import type { AISignal } from '@/mes/types';

/**
 * AI Gözlem Motoru.
 *
 * Bu motor puan vermez. Yalnızca davranış sinyali toplar:
 * dokunma süresi, kararsızlık, bekleme, tekrar, ilk seçim, yanlış türü.
 * Yorum ve yönlendirme insights.ts katmanında üretilir.
 */

export type ObservationType =
  | 'scene_enter'
  | 'scene_exit'
  | 'touch'
  | 'first_choice'
  | 'retry'
  | 'misconception'
  | 'idle'
  | 'hint_shown'
  | 'first_success'
  | 'decision_confidence';

export interface Observation {
  sceneId: string;
  type: ObservationType;
  at: number;
  /** Sahneye girişten bu olaya kadar geçen süre. */
  latencyMs?: number;
  /** Kavram yanılgısı etiketi veya seçim kimliği. */
  detail?: string;
}

export interface SceneBehavior {
  sceneId: string;
  concept: string;
  /** İlk anlamlı dokunuşa kadar geçen süre — kararsızlık göstergesi. */
  firstTouchLatencyMs: number | null;
  totalTouches: number;
  retries: number;
  hintsShown: number;
  idleEvents: number;
  /** İlk seçim doğru muydu? Kavramın oturup oturmadığını gösterir. */
  firstChoiceCorrect: boolean | null;
  /** Modüldeki ilk anlamlı başarı kaydedildi mi? */
  firstSuccess: boolean;
  /** Karar güveni: high | medium | low (puan değil, nitel). */
  decisionConfidence: 'high' | 'medium' | 'low' | null;
  misconceptions: string[];
  durationMs: number;
}

const HESITATION_THRESHOLD_MS = 4000;
const IDLE_THRESHOLD_MS = 8000;

/**
 * Tek bir mikro deneyim oturumunun gözlemcisi.
 * Bellekte çalışır; oturum sonunda özet üretir.
 */
export class ExperienceObserver {
  private observations: Observation[] = [];
  private sceneStart = new Map<string, number>();
  private sceneConcept = new Map<string, string>();
  private readonly startedAt = Date.now();

  enterScene(sceneId: string, concept: string): void {
    const at = Date.now();
    this.sceneStart.set(sceneId, at);
    this.sceneConcept.set(sceneId, concept);
    this.observations.push({ sceneId, type: 'scene_enter', at });
  }

  record(sceneId: string, type: ObservationType, detail?: string): void {
    const at = Date.now();
    const start = this.sceneStart.get(sceneId) ?? at;
    this.observations.push({ sceneId, type, at, latencyMs: at - start, detail });
  }

  exitScene(sceneId: string): void {
    this.record(sceneId, 'scene_exit');
  }

  /** Sahne bazlı davranış özeti — öğretmen paneli ve AI önerileri için. */
  summarize(): SceneBehavior[] {
    const sceneIds = Array.from(this.sceneStart.keys());
    return sceneIds.map((sceneId) => {
      const events = this.observations.filter((o) => o.sceneId === sceneId);
      const touches = events.filter((e) => e.type === 'touch');
      const firstChoice = events.find((e) => e.type === 'first_choice');
      const exit = events.find((e) => e.type === 'scene_exit');
      const start = this.sceneStart.get(sceneId) ?? this.startedAt;

      const confidence = events.find((e) => e.type === 'decision_confidence');
      const confDetail = confidence?.detail;
      const decisionConfidence =
        confDetail === 'high' || confDetail === 'medium' || confDetail === 'low'
          ? confDetail
          : null;

      return {
        sceneId,
        concept: this.sceneConcept.get(sceneId) ?? '',
        firstTouchLatencyMs: touches[0]?.latencyMs ?? null,
        totalTouches: touches.length,
        retries: events.filter((e) => e.type === 'retry').length,
        hintsShown: events.filter((e) => e.type === 'hint_shown').length,
        idleEvents: events.filter((e) => e.type === 'idle').length,
        firstChoiceCorrect: firstChoice ? firstChoice.detail === 'correct' : null,
        firstSuccess: events.some((e) => e.type === 'first_success'),
        decisionConfidence,
        misconceptions: events
          .filter((e) => e.type === 'misconception' && e.detail)
          .map((e) => e.detail as string),
        durationMs: (exit?.at ?? Date.now()) - start,
      };
    });
  }

  getObservations(): Observation[] {
    return [...this.observations];
  }

  getTotalDurationMs(): number {
    return Date.now() - this.startedAt;
  }

  reset(): void {
    this.observations = [];
    this.sceneStart.clear();
    this.sceneConcept.clear();
  }
}

/** Bir sahnede kararsızlık yaşandı mı? */
export function hasHesitation(behavior: SceneBehavior): boolean {
  return (
    behavior.firstTouchLatencyMs !== null &&
    behavior.firstTouchLatencyMs > HESITATION_THRESHOLD_MS
  );
}

export function isIdlePattern(behavior: SceneBehavior): boolean {
  return behavior.idleEvents > 0 || behavior.durationMs > IDLE_THRESHOLD_MS * 4;
}

export { HESITATION_THRESHOLD_MS, IDLE_THRESHOLD_MS };

/** Sahnenin bildirdiği sinyaller gerçekten toplandı mı? Kalite kontrolü. */
export function coversSignals(behavior: SceneBehavior, signals: AISignal[]): boolean {
  return signals.every((s) => {
    switch (s) {
      case 'touch_latency':
        return behavior.firstTouchLatencyMs !== null;
      case 'retry_count':
        return behavior.retries >= 0;
      case 'first_choice':
        return behavior.firstChoiceCorrect !== null;
      case 'hesitation':
      case 'wait_time':
      case 'screen_dwell':
      case 'audio_listen':
      case 'error_type':
      case 'success_trend':
      case 'first_success':
      case 'decision_confidence':
        return true;
      default:
        return true;
    }
  });
}
