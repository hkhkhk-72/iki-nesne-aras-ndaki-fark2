/**
 * MES-002 — Mikro Deneyim Standardı
 *
 * Bu katmanda ekran tasarlanmaz; 20-60 saniye süren mikro deneyimler tasarlanır.
 * Her sahne MES-002'nin zorunlu başlıklarını taşımak zorundadır:
 * pedagojik amaç, hedef duygu, sinematik açılış, etkileşim, AI gözlemi,
 * geri bildirim, yeniden oynanabilirlik, erişilebilirlik, öğretmen verisi.
 */

import type { Grade, SubjectId } from '@/core/types';

// ─── Karakterler ─────────────────────────────────────────────
export type CharacterId = 'bilge' | 'findik' | 'narrator';

// ─── Duygu hedefleri ─────────────────────────────────────────
/** Her sahnenin tek bir hedef duygusu olur; ölçüt çocuğun ne hissettiğidir. */
export type TargetEmotion =
  | 'merak'
  | 'sicaklik'
  | 'kesif'
  | 'basari'
  | 'guven'
  | 'nese'
  | 'sakinlik';

// ─── Sinematik açılış ────────────────────────────────────────
export interface CinematicOpening {
  /** Sahne açılırken görünen ana görsel/karakter. */
  visual: string;
  /** Kısa, çocuk diline uygun açılış cümlesi. */
  line: string;
  speaker: CharacterId;
  /** Düşük performans modunda atlanabilir. */
  animation?: 'fade' | 'rise' | 'pop' | 'none';
}

// ─── Sahne nesneleri ─────────────────────────────────────────
export interface SceneItem {
  id: string;
  emoji: string;
  label?: string;
}

export interface SceneGroup {
  id: string;
  label: string;
  emoji: string;
  count: number;
}

export interface ChooseOption {
  id: string;
  label: string;
  /** Görsel ipucu; sembol değil, çocuk dili. */
  visual: string;
}

// ─── Etkileşim türleri ───────────────────────────────────────
/**
 * Etkileşim türleri pedagojik amaca göre ayrılmıştır.
 * `narrative` ve `celebrate` dokunuş bütçesine dahil edilmez.
 */
export type SceneInteraction =
  | {
      kind: 'narrative';
      speaker: CharacterId;
      lines: string[];
      continueLabel: string;
      /**
       * true ise satırlar tek CTA ile birlikte gösterilir;
       * "Devam" ile adım adım ilerlenmez (İlk Bakış).
       */
      singleCta?: boolean;
      /**
       * CTA sonrası bağ anı: kutlama animasyonu + feedback.speaker repliği
       * (genelde Bilge'nin ilk konuşması).
       */
      bondMoment?: boolean;
    }
  | {
      kind: 'discover';
      prompt: string;
      items: SceneItem[];
      /** Çocuk her nesneye dokundukça sayım görünür hale gelir. */
      revealCount: boolean;
    }
  | {
      kind: 'observe';
      prompt: string;
      groups: [SceneGroup, SceneGroup];
      /** Gözlem sahnesinde doğru/yanlış yoktur; yalnızca inceleme vardır. */
      continueLabel: string;
    }
  | {
      kind: 'pair';
      prompt: string;
      groups: [SceneGroup, SceneGroup];
      /** Birebir eşleştirme; artan taraf kavramı sezdirir. */
      leftoverLine: string;
    }
  | {
      kind: 'choose';
      prompt: string;
      groups: [SceneGroup, SceneGroup];
      options: ChooseOption[];
      answerId: string;
      /** Yanlışta sahne değişmez, ipucu güçlenir. */
      hints: string[];
      /**
       * Sayı görünürlüğü.
       * `never` = sezgisel matematik (Karar 231); sayılar asla gösterilmez.
       */
      countVisibility?: 'never' | 'after_attempt' | 'always';
    }
  | {
      kind: 'celebrate';
      title: string;
      message: string;
      reward: string;
    }
  | {
      /**
       * LS-006 Trust — duygusal güven tepkisi.
       * Puan / ödül popup / doğru-yanlış geri bildirimi YOKTUR.
       */
      kind: 'trust';
      /** Destekleyici duygusal satır (sonuç övgüsü değil). */
      line: string;
      continueLabel: string;
    };

export type InteractionKind = SceneInteraction['kind'];

// ─── AI gözlem sözleşmesi ────────────────────────────────────
/** AI'nın bu sahnede neyi izleyeceğini sahne kendisi bildirir. */
export interface AIObservationSpec {
  /** Sahnenin ölçtüğü kavram. */
  concept: string;
  /** İzlenecek davranış sinyalleri. */
  signals: AISignal[];
  /** Bu sahnede tipik kavram yanılgıları. */
  misconceptions: string[];
}

export type AISignal =
  | 'touch_latency'
  | 'hesitation'
  | 'wait_time'
  | 'retry_count'
  | 'first_choice'
  | 'error_type'
  | 'success_trend'
  /** Ekranı inceleme süresi — İlk Bakış telemetrisi. */
  | 'screen_dwell'
  /** Karakter/ortam sesini dinleme süresi. */
  | 'audio_listen'
  /** Modüldeki ilk anlamlı başarı (puan yok). */
  | 'first_success'
  /** Karar güveni (tereddüt vs akıcı seçim). */
  | 'decision_confidence'
  | 'observe_pattern'
  | 'subitize_attempt'
  | 'grouping_strategy'
  | 'visual_focus'
  /** Karar 273 — Reflection Time. */
  | 'reflection_time'
  /** LS-011 prep — karşılaştırma gözlemi v2 (anonim). */
  | 'observe_compare_v2';

// ─── Geri bildirim ───────────────────────────────────────────
export interface SceneFeedback {
  /** Doğru davranışta gösterilen kutlama; puan değil, duygu. */
  positive: string;
  /**
   * Yanlışta gösterilen yönlendirme.
   * "Yanlış" kelimesi kullanılmaz; merak ettirir.
   */
  guidance: string;
  speaker: CharacterId;
}

// ─── Yeniden oynanabilirlik ──────────────────────────────────
/** Her girişte küçük oranlarda değişerek ezberi engeller. */
export interface ReplayVariation {
  /** Nesne görselleri havuzu; sahne her açılışta birini seçer. */
  emojiPool?: string[];
  /** Sayılara uygulanacak güvenli sapma (pedagojik sınır içinde). */
  countJitter?: number;
  /** Karşılama cümlesi alternatifleri. */
  greetings?: string[];
}

// ─── PDF çıktısı ─────────────────────────────────────────────
export type PdfKind =
  | 'etkinlik'
  | 'boyama'
  | 'kes_yapistir'
  | 'coktan_secmeli'
  | 'bosluk_doldurma'
  | 'dogru_yanlis'
  | 'cizgi_calismasi'
  | 'ev_etkinligi'
  | 'veli_etkinligi'
  | 'ogretmen_etkinligi';

export type PdfDifficulty = 'kolay' | 'orta' | 'zor';

export interface PdfSpec {
  kind: PdfKind;
  title: string;
  difficulty: PdfDifficulty;
  /** Çıktının hangi kazanımı pekiştirdiği. */
  concept: string;
}

// ─── Atmosfer / Ses / Görsel kompozisyon ─────────────────────
/** Karar 234 — Dünya önce, arayüz sonra. */
export interface VisualComposition {
  /** Yaşayan dünya payı — hedef %70. */
  world: number;
  /** Etkileşim nesneleri — hedef %20. */
  interaction: number;
  /** UI (geri, ses, ayar) — hedef %10. */
  ui: number;
}

/**
 * Ses bütçesi — sahnede en fazla 4 katman.
 * Aynı anda onlarca efekt çalmaz; dikkat dağınıklığını azaltır.
 */
export interface SoundBudget {
  ambient: string;
  character: string;
  interaction: string;
  success: string;
}

export interface SceneAtmosphere {
  season?: 'ilkbahar' | 'yaz' | 'sonbahar' | 'kis';
  /** Sahne yönetmenine not: dünya nasıl hissedilir. */
  worldCue?: string;
}

// ─── Sahne ───────────────────────────────────────────────────
export interface SceneSpec {
  id: string;
  order: number;
  title: string;

  // MES-002 zorunlu başlıkları
  pedagogicalGoal: string;
  targetEmotion: TargetEmotion;
  opening: CinematicOpening;
  interaction: SceneInteraction;
  aiObservation: AIObservationSpec;
  feedback: SceneFeedback;

  /**
   * Süre kuralı: bağ/kutlama sahneleri 15-60 sn,
   * öğrenme sahneleri 20-60 sn.
   */
  estimatedSeconds: number;
  /** 3 dokunuş kuralı: ilk deneyimde sahne başına üst sınır. */
  maxTouches: number;

  replay?: ReplayVariation;
  /** Ekran okuyucu ve düşük görüş için sahne özeti. */
  accessibilityLabel: string;

  atmosphere?: SceneAtmosphere;
  soundBudget?: SoundBudget;
  visualComposition?: VisualComposition;

  /** Golden Reference Learning Scene kimliği (ör. LS-006). */
  learningSceneId?: string;
  /** Story token (ör. story.trust). */
  storyToken?: string;
  /** Motion token (ör. motion.trust). */
  motionToken?: string;
  /**
   * Karar 268 — bu sahnedeki ilk matematiksel karar asla "yanlış" etiketlenmez.
   * Sistem yalnızca gözlemler.
   */
  firstMathDecision?: boolean;
  /**
   * Karar 270 — geri bildirim dünya üzerinden (UI doğru/yanlış mesajı yok).
   * Varsayılan: true (MES sahneleri).
   */
  worldFeedback?: boolean;
  /**
   * Karar 274 — keşif anı çocuğa aittir; sistem duyurmaz, görünür kılar.
   */
  discoveryBelongsToChild?: boolean;
  /**
   * Karar 275 — kutlama dünya ile (pop-up / yıldız yağmuru yok).
   * Varsayılan: true.
   */
  worldCelebration?: boolean;
  /**
   * Karar 277 — karakter soruyu önce davranışla yaşar; söz sonra (gerekirse).
   */
  behaviorBeforeSpeech?: boolean;
  /**
   * Karar 278 — sessiz bekleme aktif öğretim; gereksiz anlık yönlendirme yok.
   * Varsayılan: true.
   */
  waitIsTeaching?: boolean;
  /**
   * Karar 279 — merak/gözlem tamamlanmadan kavram adı tanıtılmaz.
   */
  curiosityBeforeConcept?: boolean;
  /**
   * Karar 283–285 — öğrenme kavramı (nesneden bağımsız kimlik).
   * Örn. `karsilastirma`, `daha_cok`.
   */
  learningConcept?: string;
  /**
   * Karar 284–285 — bağlam kimliği (nesne/hikâye dünyası).
   * Aynı kavram farklı contextId ile transfer edilir.
   */
  contextId?: string;
}

// ─── Mikro deneyim (ders) ────────────────────────────────────
export interface MicroExperience {
  /** MB-MAT-1.1.01 biçiminde ders kodu. */
  code: string;
  title: string;
  subject: SubjectId;
  grade: Grade;
  unitId: string;
  /** Bağlı olduğu kazanım (mevcut müfredat sistemiyle köprü). */
  outcomeId: string;

  /** Çocuğa görünen hikâye amacı — matematik değil. */
  storyGoal: string;
  /** Perde arkasındaki pedagojik amaç. */
  learningGoal: string;

  location: string;
  characters: CharacterId[];
  scenes: SceneSpec[];
  pdfOutputs: PdfSpec[];

  /** Toplam tahmini süre (saniye). */
  totalSeconds: number;

  /** Golden Reference kimlik köprüsü (GRP / GRS / LS). */
  goldenRef?: {
    program: string;
    scene: string;
    learningScene: string;
  };
}

// ─── Çalıştırma sonucu ──────────────────────────────────────
export interface ExperienceOutcome {
  code: string;
  completed: boolean;
  scenesCompleted: number;
  totalScenes: number;
  durationMs: number;
}
