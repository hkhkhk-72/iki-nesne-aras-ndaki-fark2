/**
 * MB-CHAR-002 — Bilge Baykuş Rehberlik Anayasası v1.0
 *
 * Bu dosya karakter kostümü değildir; MiniBilge'nin rehberlik anayasasının
 * kod karşılığıdır. Bilge öğretmen, hakem veya puan dağıtıcı değildir —
 * çocuğun yanında yürüyen güvenilir yol arkadaşıdır.
 *
 * Amaç: "Sana matematik öğreteceğim" demek değil;
 * çocuğun öğrenmesini kolaylaştırmaktır.
 *
 * Kararlar: 237 (sessizlik), 238 (basamaklı yardım), 239 (süreç övgüsü).
 * Tetikleme eşikleri: MB-AI-001 (`src/ai/decision-engine.ts`).
 */

import type { CharacterId } from '@/mes/types';
import type { SceneBehavior } from '@/ai/observer';
import { hasHesitation, isIdlePattern } from '@/ai/observer';

// ─── Konuşma tetikleyicileri ─────────────────────────────────
export type BilgeSpeakTrigger =
  | 'first_meeting' // İlk karşılaşma / bağ sonrası
  | 'bond_after_help' // İlk Bakış: yardım dokunuşu
  | 'long_wait' // Uzun bekleme
  | 'child_requests_help' // Çocuk yardım istedi
  | 'after_effort' // Başarı sonrası — süreç övgüsü
  | 'morale_low' // Moral düşüşü
  | 'new_discovery' // Yeni keşif
  | 'hint_level_2' // Yardım seviyesi 2
  | 'hint_level_3' // Yardım seviyesi 3
  | 'hint_level_4' // Yardım seviyesi 4 (birlikte; cevap yok)
  | 'curiosity_prompt'
  | 'observe_reflect'
  | 'pair_reveal'
  | 'calm_redirect'
  | 'closing_warmth';

/** Karar 237 — sessizlik gerekçeleri. */
export type BilgeSilenceReason =
  | 'child_is_thinking'
  | 'child_is_dragging'
  | 'child_is_exploring'
  | 'findik_owns_moment'
  | 'world_speaks'
  | 'first_look_setup'
  | 'success_belongs_to_child'
  | 'no_need'; // AI: müdahale gerekmiyor

// ─── Yardım motoru (Karar 238) ───────────────────────────────
/** 1 = işaret (sessiz) … 4 = birlikte çöz (cevap yok). */
export type HelpLevel = 1 | 2 | 3 | 4;

export interface HelpLevelSpec {
  level: HelpLevel;
  speaks: boolean;
  /** Gözle işaret / parıltı — seviye 1. */
  gazeOnly: boolean;
  description: string;
  examples: string[];
}

export const HELP_LADDER: Record<HelpLevel, HelpLevelSpec> = {
  1: {
    level: 1,
    speaks: false,
    gazeOnly: true,
    description: 'Yalnızca gözleriyle / hafif parıltıyla işaret eder. Konuşmaz.',
    examples: [],
  },
  2: {
    level: 2,
    speaks: true,
    gazeOnly: false,
    description: 'Çok küçük ipucu.',
    examples: ['Şuraya tekrar bakalım mı?', 'Birlikte başka bir açıdan bakalım.'],
  },
  3: {
    level: 3,
    speaks: true,
    gazeOnly: false,
    description: 'Düşünmeyi yönlendirir; çözümü söylemez.',
    examples: [
      'Acaba herkesin bir palamudu oldu mu?',
      'Acaba şunu denesek nasıl olur?',
    ],
  },
  4: {
    level: 4,
    speaks: true,
    gazeOnly: false,
    description: 'Çocuk isterse birlikte çözer. Asla cevabı söylemez.',
    examples: [
      'Birlikte adım adım bakalım. Sen seç, ben yanında olayım.',
      'Bir ipucu daha keşfetmek ister misin?',
    ],
  },
};

// ─── Yasaklı dil ─────────────────────────────────────────────
export const BILGE_FORBIDDEN = [
  'aferin',
  'bravo',
  'doğru',
  'yanlış',
  'puan',
  'skor',
  'kazandın',
  'kaybettin',
  'başarısız',
  'hatalı',
  'tekrar dene',
  'yapamadın',
  'olmadı',
  'hatalısın',
  'öğreteceğim',
];

export interface BilgeLinePolicy {
  maySpeak: boolean;
  tone: 'sicak' | 'merak' | 'sakin' | 'yansitici' | 'cesaret';
  neverSay: string[];
  examples: string[];
}

export const BILGE_SPEAK_POLICY: Record<BilgeSpeakTrigger, BilgeLinePolicy> = {
  first_meeting: {
    maySpeak: true,
    tone: 'sicak',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Bugün seni görmek çok güzel.', 'Birlikteyiz.'],
  },
  bond_after_help: {
    maySpeak: true,
    tone: 'sicak',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Harika... Birlikte çok güzel işler başaracağız.',
      'Sen buradasın. Bu yeterli.',
    ],
  },
  long_wait: {
    maySpeak: true,
    tone: 'sakin',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Acele etme. Ben buradayım.', 'Bir nefes alalım, sonra devam ederiz.'],
  },
  child_requests_help: {
    maySpeak: true,
    tone: 'merak',
    neverSay: BILGE_FORBIDDEN,
    examples: HELP_LADDER[2].examples,
  },
  after_effort: {
    maySpeak: true,
    tone: 'cesaret',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Harika, vazgeçmedin.',
      'Dikkatlice inceledin.',
      'Çok güzel düşündün.',
      'Yeni bir yol denedin.',
    ],
  },
  morale_low: {
    maySpeak: true,
    tone: 'sicak',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Ben yanındayım.', 'Birlikte başka bir açıdan bakalım.'],
  },
  new_discovery: {
    maySpeak: true,
    tone: 'merak',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Sence ne olacak?', 'Bir şey fark ettim...'],
  },
  hint_level_2: {
    maySpeak: true,
    tone: 'merak',
    neverSay: BILGE_FORBIDDEN,
    examples: HELP_LADDER[2].examples,
  },
  hint_level_3: {
    maySpeak: true,
    tone: 'yansitici',
    neverSay: BILGE_FORBIDDEN,
    examples: HELP_LADDER[3].examples,
  },
  hint_level_4: {
    maySpeak: true,
    tone: 'yansitici',
    neverSay: BILGE_FORBIDDEN,
    examples: HELP_LADDER[4].examples,
  },
  curiosity_prompt: {
    maySpeak: true,
    tone: 'merak',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Sence ne olacak?', 'Birlikte bakalım mı?'],
  },
  observe_reflect: {
    maySpeak: true,
    tone: 'merak',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'İyi gözlem... Birbirinden farklı görünüyorlar.',
      'Diğerine de bakmak ister misin?',
    ],
  },
  pair_reveal: {
    maySpeak: true,
    tone: 'yansitici',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Bak... Eşi olmayanlar kaldı.', 'Demek ki burada daha çok var.'],
  },
  calm_redirect: {
    maySpeak: true,
    tone: 'sakin',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Acele etme. Ben buradayım.', 'Bir nefes alalım, sonra devam ederiz.'],
  },
  closing_warmth: {
    maySpeak: true,
    tone: 'sicak',
    neverSay: BILGE_FORBIDDEN,
    examples: ['Bugün güzel bir yolculuktu.', 'Yarın yine birlikte oluruz.'],
  },
};

export const BILGE_SILENCE_RULES: Record<BilgeSilenceReason, string> = {
  child_is_thinking: 'Çocuk düşünüyorsa Bilge konuşmaz. Sessizlik öğretmendir.',
  child_is_dragging: 'Çocuk sürüklüyorsa Bilge konuşmaz.',
  child_is_exploring: 'Çocuk keşfediyorsa Bilge konuşmaz.',
  findik_owns_moment: 'Fındık bağ kurarken Bilge yalnızca gülümser.',
  world_speaks: 'Atmosfer / animasyon varken Bilge üstüne binmez.',
  first_look_setup: 'İlk Bakış’ta dalda sessiz; konuşma yardım dokunuşundan sonradır.',
  success_belongs_to_child: 'Kutlamada puan/aferin yok; başarı çocukta kalır.',
  no_need: 'AI müdahale eşiğini geçmedi; Bilge sessiz kalır.',
};

/** Yardım zamanlaması — erken yardım bağı zayıflatır. */
export interface HelpTiming {
  level1GazeAfterMs: number;
  level2AfterMs: number;
  level3AfterMs: number;
  level4OnlyIfRequested: boolean;
  calmAfterIdleMs: number;
}

export const DEFAULT_HELP_TIMING: HelpTiming = {
  level1GazeAfterMs: 4000,
  level2AfterMs: 8000,
  level3AfterMs: 14000,
  level4OnlyIfRequested: true,
  calmAfterIdleMs: 10000,
};

/** Karar 239 — süreç övgüsü kalıpları. */
export const EFFORT_PRAISE = [
  'Harika, vazgeçmedin.',
  'Dikkatlice inceledin.',
  'Çok güzel düşündün.',
  'Yeni bir yol denedin.',
] as const;

/** Duygusal hafıza — öğrenme yolculuğu, kişisel veri değil. */
export interface JourneyMemory {
  /** Son sevilen aktivite / kavram etiketi. */
  likedConcept?: string;
  /** Son ziyaret sıcak karşılama için. */
  lastVisitAt?: number;
  /** Çaba öyküleri (kısa etiketler). */
  effortMoments: string[];
}

export function journeyGreeting(memory: JourneyMemory): string {
  if (memory.likedConcept) {
    return `Geçen gün ${memory.likedConcept} çok sevmiştin.`;
  }
  if (memory.lastVisitAt) {
    return 'Bugün seni tekrar görmek çok güzel.';
  }
  return BILGE_SPEAK_POLICY.first_meeting.examples[0];
}

export type MotivationMode = 'bag' | 'merak' | 'ortaklik' | 'kesif' | 'cabaya';

export const MOTIVATION_LINES: Record<MotivationMode, string[]> = {
  bag: ['Sensiz olmazdı.', 'Birlikteyiz.', 'Ben yanındayım.'],
  merak: ['Sence sırada ne var?', 'Bir şey fark ettim...'],
  ortaklik: ['Birlikte çok güzel işler başaracağız.', 'Sen ve Fındık iyi bir ekipsiniz.'],
  kesif: ['Bakmaya devam edelim.', 'Orman hâlâ sürprizlerle dolu.'],
  cabaya: [...EFFORT_PRAISE],
};

export interface BilgeAiHandoff {
  trigger: BilgeSpeakTrigger | 'silence';
  silenceReason?: BilgeSilenceReason;
  helpLevel?: HelpLevel;
  motivation?: MotivationMode;
  line?: string;
  /** Seviye 1: konuşma yok, yalnızca bakış/parıltı. */
  gazeOnly?: boolean;
}

/**
 * Davranış özetinden Bilge hamlesi.
 * Not: Eşiklerin resmi kaynağı MB-AI-001 `decideIntervention`'dır;
 * bu fonksiyon sahne içi hızlı yol / geriye uyumluluk sağlar.
 */
export function decideBilgeMove(behavior: SceneBehavior): BilgeAiHandoff {
  if (isIdlePattern(behavior)) {
    return {
      trigger: 'long_wait',
      helpLevel: 2,
      motivation: 'bag',
      line: BILGE_SPEAK_POLICY.long_wait.examples[0],
    };
  }

  if (behavior.retries >= 2) {
    return {
      trigger: 'hint_level_3',
      helpLevel: 3,
      motivation: 'kesif',
      line: HELP_LADDER[3].examples[0],
    };
  }

  if (behavior.retries >= 1 || behavior.hintsShown >= 1) {
    return {
      trigger: 'hint_level_2',
      helpLevel: 2,
      motivation: 'kesif',
      line: HELP_LADDER[2].examples[0],
    };
  }

  if (hasHesitation(behavior) && behavior.totalTouches === 0) {
    // Önce sessizlik; AI süre uzarsa seviye 1 bakışa geçer
    return {
      trigger: 'silence',
      silenceReason: 'child_is_thinking',
      helpLevel: 1,
      gazeOnly: true,
    };
  }

  if (behavior.firstChoiceCorrect === true) {
    // Karar 239: sonuç değil çaba
    return {
      trigger: 'after_effort',
      motivation: 'cabaya',
      line: EFFORT_PRAISE[0],
    };
  }

  return {
    trigger: 'silence',
    silenceReason: 'no_need',
  };
}

/** Yardım seviyesine göre güvenli replik (seviye 1 = sessiz). */
export function lineForHelpLevel(level: HelpLevel): BilgeAiHandoff {
  const spec = HELP_LADDER[level];
  if (!spec.speaks) {
    return {
      trigger: 'silence',
      silenceReason: 'child_is_thinking',
      helpLevel: 1,
      gazeOnly: true,
    };
  }
  const trigger =
    level === 2 ? 'hint_level_2' : level === 3 ? 'hint_level_3' : 'hint_level_4';
  return {
    trigger,
    helpLevel: level,
    motivation: 'kesif',
    line: spec.examples[0],
  };
}

export function validateBilgeLine(line: string): { ok: boolean; issues: string[] } {
  const lower = line.toLocaleLowerCase('tr');
  const issues = BILGE_FORBIDDEN.filter((p) => lower.includes(p)).map(
    (p) => `Bilge yasaklı ifade: "${p}"`,
  );
  return { ok: issues.length === 0, issues };
}

export function enforceSpeakerPolicy(
  speaker: CharacterId,
  line: string,
): { ok: boolean; issues: string[] } {
  if (speaker !== 'bilge') return { ok: true, issues: [] };
  return validateBilgeLine(line);
}

/** Sonuç övgüsü mü sızmış? (Karar 239 kalite kontrolü) */
export const RESULT_PRAISE_LEAKS = [
  'doğru bildin',
  'puan kazandın',
  'hepsini yaptın',
  'birinci oldun',
  'doğru cevap',
];

export function isProcessPraise(line: string): boolean {
  const lower = line.toLocaleLowerCase('tr');
  if (RESULT_PRAISE_LEAKS.some((p) => lower.includes(p))) return false;
  return EFFORT_PRAISE.some((p) => lower.includes(p.toLocaleLowerCase('tr'))) ||
    lower.includes('vazgeçmedin') ||
    lower.includes('inceledin') ||
    lower.includes('düşündün') ||
    lower.includes('yol denedin') ||
    lower.includes('birlikte');
}
