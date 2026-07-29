/**
 * MB-AI-001 — Öğrenme Gözlem ve Karar Motoru v1.0
 *
 * AI öğretmenin yerini almaz. Çocuğun ritmine saygı duyan,
 * şefkatli bir rehberlik motorudur.
 *
 * Bu katman: ne izlenir, hangi eşikte Bilge konuşur / susar,
 * hangi veri öğretmene gider, hangisi yalnızca kişiselleştirmede kalır.
 *
 * Ses ve dil MB-CHAR-002'ye aittir; bu motor yalnızca KARAR verir.
 */

import type { SceneBehavior } from './observer';
import { hasHesitation, HESITATION_THRESHOLD_MS, IDLE_THRESHOLD_MS } from './observer';
import {
  type BilgeAiHandoff,
  type HelpLevel,
  HELP_LADDER,
  BILGE_SPEAK_POLICY,
  EFFORT_PRAISE,
  lineForHelpLevel,
  BILGE_LAB_APPEAR_AFTER_MS,
} from '@/world/bilge-guidance';

// ─── İzlenen davranışlar ─────────────────────────────────────
export type TrackedBehavior =
  | 'wait_time'
  | 'error_type'
  | 'attention_span'
  | 'retry_count'
  | 'help_request'
  | 'effort_history'
  | 'first_choice'
  | 'touch_latency'
  | 'drag_active'
  | 'explore_active'
  /** Karar 273 — birincil metrik. */
  | 'reflection_time';

/** Her sinyalin pedagojik anlamı. */
export const TRACKED_BEHAVIOR_MEANING: Record<TrackedBehavior, string> = {
  wait_time: 'Kararsızlık veya düşünme süresi',
  error_type: 'Kavram yanılgısı türü',
  attention_span: 'Sahne içi dikkat / idle',
  retry_count: 'Deneme ısrarı veya takılma',
  help_request: 'Çocuğun açık yardım isteği',
  effort_history: 'Süreç övgüsü ve yolculuk hafızası',
  first_choice: 'Kavramın ilk anda oturup oturmadığı',
  touch_latency: 'İlk bakış / bağ telemetrisi',
  drag_active: 'Sürükleme sırasında sus (Karar 237)',
  explore_active: 'Keşif sırasında sus (Karar 237)',
  reflection_time: 'Düşünme süresi — hızdan değerli (Karar 273)',
};

/** Karar 273 — AI birincil izleme sırası. */
export const PRIMARY_AI_METRICS: TrackedBehavior[] = [
  'reflection_time',
  'wait_time',
  'effort_history',
  'first_choice',
];

// ─── Veri sınıflandırması ────────────────────────────────────
export type DataAudience = 'teacher_panel' | 'personalization_only' | 'both' | 'never_leave_device';

/**
 * Öğretmen paneline giden vs yalnızca kişiselleştirmede kalan veri.
 * Kişisel tanımlayıcılar (PII) panelle paylaşılmaz.
 */
export const DATA_ROUTING: Record<TrackedBehavior, DataAudience> = {
  wait_time: 'both',
  error_type: 'teacher_panel',
  attention_span: 'teacher_panel',
  retry_count: 'both',
  help_request: 'personalization_only',
  effort_history: 'personalization_only',
  first_choice: 'teacher_panel',
  touch_latency: 'personalization_only',
  drag_active: 'never_leave_device',
  explore_active: 'never_leave_device',
  reflection_time: 'both',
};

export function teacherVisible(signal: TrackedBehavior): boolean {
  const r = DATA_ROUTING[signal];
  return r === 'teacher_panel' || r === 'both';
}

export function personalizationOnly(signal: TrackedBehavior): boolean {
  return DATA_ROUTING[signal] === 'personalization_only';
}

// ─── Eşikler ─────────────────────────────────────────────────
export interface InterventionThresholds {
  /** Düşünüyor: bu sürenin altında SUS. */
  thinkingSilenceMaxMs: number;
  /** Seviye 1 bakış (sessiz işaret). */
  gazeHintAfterMs: number;
  /** Seviye 2 küçük ipucu. */
  softHintAfterMs: number;
  /** Seviye 3 yönlendirme. */
  guideHintAfterMs: number;
  /** Idle sonrası sakin müdahale. */
  idleInterveneMs: number;
  /** Bu kadar tekrardan sonra seviye yükselt. */
  retriesForLevel2: number;
  retriesForLevel3: number;
}

export const DEFAULT_THRESHOLDS: InterventionThresholds = {
  thinkingSilenceMaxMs: HESITATION_THRESHOLD_MS,
  gazeHintAfterMs: 5000,
  softHintAfterMs: 8000,
  guideHintAfterMs: 14000,
  idleInterveneMs: IDLE_THRESHOLD_MS + 2000,
  retriesForLevel2: 1,
  retriesForLevel3: 2,
};

// ─── Karar çıktısı ───────────────────────────────────────────
export type InterventionKind =
  | 'silence'
  | 'gaze'
  | 'speak'
  | 'effort_praise'
  | 'morale_support';

export interface InterventionDecision {
  kind: InterventionKind;
  helpLevel: HelpLevel | null;
  reason: string;
  /** MB-CHAR-002 handoff — ses katmanına iletilir. */
  bilge: BilgeAiHandoff;
  /** Öğretmen paneline yansıyacak kısa not (puan yok). */
  teacherNote?: string;
}

export interface DecisionContext {
  behavior: SceneBehavior;
  /** Çocuk yardım istedi mi? */
  helpRequested?: boolean;
  /** Sürükleme / keşif aktif mi? → zorunlu sessizlik */
  dragActive?: boolean;
  exploreActive?: boolean;
  /** Sahne içinde son dokunuştan beri geçen ms */
  msSinceLastTouch?: number;
  /** Moral düşüşü sinyali (çoklu retry + idle) */
  moraleLow?: boolean;
  thresholds?: InterventionThresholds;
}

/**
 * Ana karar fonksiyonu.
 * Rastgele konuşmaz. Eşik aşılmadan Bilge sessiz kalır.
 */
export function decideIntervention(ctx: DecisionContext): InterventionDecision {
  const t = ctx.thresholds ?? DEFAULT_THRESHOLDS;
  const b = ctx.behavior;

  // ── Karar 237: zorunlu sessizlik ──
  if (ctx.dragActive) {
    return silence('child_is_dragging', 'Sürükleme sırasında müdahale yok.');
  }
  if (ctx.exploreActive) {
    return silence('child_is_exploring', 'Keşif sırasında müdahale yok.');
  }

  // MB-LAB-001: Bilge yalnızca uzun zorlanmada / yardım isteğinde konuşur
  const waited = ctx.msSinceLastTouch ?? b.firstTouchLatencyMs ?? 0;
  const bilgeMaySpeak =
    Boolean(ctx.helpRequested) ||
    Math.max(waited, b.durationMs) >= BILGE_LAB_APPEAR_AFTER_MS ||
    b.retries >= t.retriesForLevel3;

  // ── Çocuk açıkça yardım istedi → seviye 2+ (cevap yok) ──
  if (ctx.helpRequested) {
    const level: HelpLevel = b.retries >= t.retriesForLevel3 ? 4 : 3;
    const handoff = lineForHelpLevel(level);
    return {
      kind: 'speak',
      helpLevel: level,
      reason: 'Çocuk yardım istedi; basamaklı yardım (Karar 238).',
      bilge: { ...handoff, trigger: level === 4 ? 'hint_level_4' : 'hint_level_3' },
      // help_request → personalization_only; öğretmen paneline ham yansımaz
    };
  }

  // ── Moral ──
  if (ctx.moraleLow || (b.retries >= 3 && b.idleEvents > 0)) {
    if (!bilgeMaySpeak) {
      return {
        kind: 'gaze',
        helpLevel: 1,
        reason: 'Moral sinyali var; Bilge henüz konuşmaz (MB-LAB-001).',
        bilge: {
          trigger: 'silence',
          silenceReason: 'child_is_thinking',
          helpLevel: 1,
          gazeOnly: true,
        },
      };
    }
    return {
      kind: 'morale_support',
      helpLevel: 2,
      reason: 'Moral düşüşü sinyali.',
      bilge: {
        trigger: 'morale_low',
        helpLevel: 2,
        motivation: 'bag',
        line: BILGE_SPEAK_POLICY.morale_low.examples[0],
      },
      teacherNote: 'Dikkat/moral desteği gerekebilir; baskısız tekrar önerilir.',
    };
  }

  // ── Çaba övgüsü (Karar 239 + 273) — hız değil; düşünme süresi değerli ──
  if (b.firstChoiceCorrect === true && b.retries === 0) {
    const reflectedWell = (b.reflectionTimeMs ?? 0) >= 2000;
    return {
      kind: 'effort_praise',
      helpLevel: null,
      reason: reflectedWell
        ? 'Reflection Time güçlü; düşünme süresi övülür (Karar 273).'
        : 'Akıcı ilerleme; süreç övgüsü.',
      bilge: {
        trigger: 'after_effort',
        motivation: 'cabaya',
        line: reflectedWell
          ? 'Dikkatlice düşündün.'
          : EFFORT_PRAISE[b.totalTouches % EFFORT_PRAISE.length],
      },
    };
  }

  // ── Tekrar → yardım basamağı ──
  if (b.retries >= t.retriesForLevel3) {
    return fromHelpLevel(3, 'Tekrar eşiği — düşünmeyi yönlendir.', b);
  }
  if (b.retries >= t.retriesForLevel2) {
    if (!bilgeMaySpeak) {
      return {
        kind: 'gaze',
        helpLevel: 1,
        reason: 'Takılma var; Bilge önce sessiz bakış (Karar 271).',
        bilge: {
          trigger: 'silence',
          silenceReason: 'child_is_thinking',
          helpLevel: 1,
          gazeOnly: true,
        },
      };
    }
    return fromHelpLevel(2, 'İlk takılma — küçük ipucu.', b);
  }

  // ── Bekleme / idle — Karar 271: sessizlik de geri bildirim ──
  const wait = ctx.msSinceLastTouch ?? b.firstTouchLatencyMs ?? 0;

  if (b.idleEvents > 0 || (b.durationMs > t.idleInterveneMs && b.totalTouches === 0)) {
    if (!bilgeMaySpeak) {
      return {
        kind: 'gaze',
        helpLevel: 1,
        reason: 'Bekleme; sessizlik geri bildirimdir (Karar 271).',
        bilge: {
          trigger: 'silence',
          silenceReason: 'child_is_thinking',
          helpLevel: 1,
          gazeOnly: true,
        },
      };
    }
    return fromHelpLevel(2, 'Uzun bekleme — sakin yönlendirme.', b);
  }

  if (wait >= t.guideHintAfterMs && hasHesitation(b)) {
    if (!bilgeMaySpeak) {
      return {
        kind: 'gaze',
        helpLevel: 1,
        reason: 'Uzun kararsızlık; önce bakış.',
        bilge: {
          trigger: 'silence',
          silenceReason: 'child_is_thinking',
          helpLevel: 1,
          gazeOnly: true,
        },
      };
    }
    return fromHelpLevel(3, 'Uzun kararsızlık — yönlendirici ipucu.', b);
  }
  if (wait >= t.softHintAfterMs && hasHesitation(b)) {
    if (!bilgeMaySpeak) {
      return {
        kind: 'gaze',
        helpLevel: 1,
        reason: 'Kararsızlık; Bilge konuşmadan bakış.',
        bilge: {
          trigger: 'silence',
          silenceReason: 'child_is_thinking',
          helpLevel: 1,
          gazeOnly: true,
        },
      };
    }
    return fromHelpLevel(2, 'Kararsızlık — küçük ipucu.', b);
  }
  if (wait >= t.gazeHintAfterMs && hasHesitation(b)) {
    return {
      kind: 'gaze',
      helpLevel: 1,
      reason: 'Düşünüyor; yalnızca bakış (Konuşmaz).',
      bilge: {
        trigger: 'silence',
        silenceReason: 'child_is_thinking',
        helpLevel: 1,
        gazeOnly: true,
      },
    };
  }

  // ── Düşünme penceresi: SUS ──
  if (hasHesitation(b) && b.totalTouches === 0 && wait < t.gazeHintAfterMs) {
    return silence('child_is_thinking', 'Düşünme penceresi; sessizlik öğretmendir.');
  }

  return silence('no_need', 'Eşik aşılmadı; müdahale yok.');
}

function silence(
  reason: BilgeAiHandoff['silenceReason'],
  message: string,
): InterventionDecision {
  return {
    kind: 'silence',
    helpLevel: null,
    reason: message,
    bilge: { trigger: 'silence', silenceReason: reason ?? 'no_need' },
  };
}

function fromHelpLevel(
  level: HelpLevel,
  reason: string,
  b: SceneBehavior,
): InterventionDecision {
  const handoff = lineForHelpLevel(level);
  const spec = HELP_LADDER[level];
  return {
    kind: spec.speaks ? 'speak' : 'gaze',
    helpLevel: level,
    reason,
    bilge: handoff,
    teacherNote:
      b.misconceptions.length > 0
        ? `Kavram yanılgısı izleri: ${b.misconceptions.join(', ')}`
        : level >= 3
          ? 'Yönlendirici destek uygulandı; sınıf içi somut materyal düşünülebilir.'
          : undefined,
  };
}

/** Öğretmen paneline güvenli özet — puan/yüzde yok. */
export interface TeacherSafeSummary {
  concept: string;
  qualitative: 'guclu' | 'gelisiyor' | 'destek_gerekli';
  notes: string[];
  /** Kişiselleştirme-only alanlar burada YOKTUR. */
}

export function toTeacherSafeSummary(b: SceneBehavior): TeacherSafeSummary {
  const notes: string[] = [];
  if (hasHesitation(b)) notes.push('Karar vermeden önce bekliyor');
  if (b.retries >= 2) notes.push('Birden fazla deneme');
  if (b.misconceptions.length) notes.push(`Yanılgı: ${b.misconceptions.join(', ')}`);
  if (b.idleEvents > 0) notes.push('Dikkat dağınıklığı gözlendi');

  const qualitative =
    b.retries >= 2 || b.misconceptions.length > 0
      ? 'destek_gerekli'
      : b.firstChoiceCorrect === true && b.retries === 0
        ? 'guclu'
        : 'gelisiyor';

  return { concept: b.concept, qualitative, notes };
}
