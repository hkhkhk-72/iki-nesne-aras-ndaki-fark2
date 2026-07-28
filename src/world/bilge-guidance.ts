/**
 * MB-CHAR-002 — Bilge Baykuş Rehberlik Sistemi v1.0
 *
 * Bilge yalnızca bir karakter değildir; MiniBilge'nin öğretim motorunun sesidir.
 * Bu modül ne zaman konuşacağını, ne zaman susacağını ve AI ile nasıl
 * birlikte çalışacağını milimetrik tanımlar.
 */

import type { CharacterId } from '@/mes/types';
import type { SceneBehavior } from '@/ai/observer';
import { hasHesitation, isIdlePattern } from '@/ai/observer';

/** Bilge'nin konuşma tetikleyicileri. */
export type BilgeSpeakTrigger =
  | 'bond_after_help' // İlk yardım dokunuşundan sonra (İlk Bakış)
  | 'curiosity_prompt' // Merak ettiren soru
  | 'hint_escalate' // Yanlışta kademeli ipucu
  | 'observe_reflect' // Gözlem sonrası yansıtma
  | 'pair_reveal' // Eşleştirme sonucu sezdirme
  | 'calm_redirect' // Aşırı acele / kaygı anı
  | 'closing_warmth'; // Sahne/ders kapanışı

/** Bilge'nin susma gerekçeleri. */
export type BilgeSilenceReason =
  | 'findik_owns_moment' // Fındık duygusal bağı kuruyor
  | 'child_is_thinking' // Çocuk düşünüyor; acele ettirme
  | 'world_speaks' // Atmosfer / animasyon konuşuyor
  | 'first_look_setup' // İlk 15-20 sn: bağ kuruluyor
  | 'success_belongs_to_child'; // Başarıyı çocuk ve Fındık taşır

export interface BilgeLinePolicy {
  /** Bu tetikleyicide Bilge konuşabilir mi? */
  maySpeak: boolean;
  /** Tercih edilen ton. */
  tone: 'sicak' | 'merak' | 'sakin' | 'yansitici';
  /** Asla kullanmayacağı kalıplar (ek katman). */
  neverSay: string[];
  /** Örnek güvenli replikler. */
  examples: string[];
}

/** Bilge'nin asla söylemeyeceği ifadeler — Character Bible üstüne ek. */
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
];

/** Tetikleyici → politika. */
export const BILGE_SPEAK_POLICY: Record<BilgeSpeakTrigger, BilgeLinePolicy> = {
  bond_after_help: {
    maySpeak: true,
    tone: 'sicak',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Harika... Birlikte çok güzel işler başaracağız.',
      'Sen buradasın. Bu yeterli.',
    ],
  },
  curiosity_prompt: {
    maySpeak: true,
    tone: 'merak',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Sence ne olacak?',
      'Birlikte bakalım mı?',
    ],
  },
  hint_escalate: {
    maySpeak: true,
    tone: 'yansitici',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Birlikte tekrar bakalım.',
      'Az önce ne fark etmiştik?',
    ],
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
    examples: [
      'Bak... Eşi olmayanlar kaldı.',
      'Demek ki burada daha çok var.',
    ],
  },
  calm_redirect: {
    maySpeak: true,
    tone: 'sakin',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Acele etme. Ben buradayım.',
      'Bir nefes alalım, sonra devam ederiz.',
    ],
  },
  closing_warmth: {
    maySpeak: true,
    tone: 'sicak',
    neverSay: BILGE_FORBIDDEN,
    examples: [
      'Bugün güzel bir yolculuktu.',
      'Yarın yine birlikte oluruz.',
    ],
  },
};

/** Ne zaman susulur — sahne bağlamı. */
export const BILGE_SILENCE_RULES: Record<BilgeSilenceReason, string> = {
  findik_owns_moment: 'Fındık bağ kurarken Bilge yalnızca gülümser; konuşmaz.',
  child_is_thinking: 'İlk dokunuş gecikmesinde (kararsızlık) Bilge beklemez, baskı kurmaz.',
  world_speaks: 'Yaprak, rüzgar, animasyon varken Bilge üstüne binmez.',
  first_look_setup: 'İlk Bakış’ta Bilge dalda sessizdir; konuşma yardım dokunuşundan sonradır.',
  success_belongs_to_child: 'Kutlamada Fındık teşekkür eder; Bilge puan veya aferin eklemez.',
};

/**
 * Yardım sunma zamanlaması.
 * Erken yardım bağı zayıflatır; geç yardım kaygı üretir.
 */
export interface HelpTiming {
  /** İlk ipucu için minimum bekleme (ms). */
  firstHintAfterMs: number;
  /** İkinci ipucu için ek bekleme (ms). */
  secondHintAfterMs: number;
  /** Idle eşiği aşılınca sakin yönlendirme. */
  calmAfterIdleMs: number;
}

export const DEFAULT_HELP_TIMING: HelpTiming = {
  firstHintAfterMs: 5000,
  secondHintAfterMs: 8000,
  calmAfterIdleMs: 10000,
};

/** Motivasyon: puan değil, ilişki ve merak. */
export type MotivationMode = 'bag' | 'merak' | 'ortaklik' | 'kesif';

export const MOTIVATION_LINES: Record<MotivationMode, string[]> = {
  bag: ['Sensiz olmazdı.', 'Birlikteyiz.'],
  merak: ['Sence sırada ne var?', 'Bir şey fark ettim...'],
  ortaklik: ['Birlikte çok güzel işler başaracağız.', 'Sen ve Fındık iyi bir ekipsiniz.'],
  kesif: ['Bakmaya devam edelim.', 'Orman hâlâ sürprizlerle dolu.'],
};

/**
 * AI × Bilge işbirliği.
 * AI karar verir (ne zaman / hangi tetikleyici); Bilge ses olur (nasıl söylenir).
 * AI asla puan üretmez; Bilge asla yargılamaz.
 */
export interface BilgeAiHandoff {
  trigger: BilgeSpeakTrigger | 'silence';
  silenceReason?: BilgeSilenceReason;
  motivation?: MotivationMode;
  line?: string;
}

/** Davranış özetinden Bilge'nin bir sonraki hamlesini seçer. */
export function decideBilgeMove(behavior: SceneBehavior): BilgeAiHandoff {
  if (isIdlePattern(behavior)) {
    return {
      trigger: 'calm_redirect',
      motivation: 'bag',
      line: BILGE_SPEAK_POLICY.calm_redirect.examples[0],
    };
  }

  if (behavior.retries >= 1) {
    const idx = Math.min(behavior.hintsShown, BILGE_SPEAK_POLICY.hint_escalate.examples.length - 1);
    return {
      trigger: 'hint_escalate',
      motivation: 'kesif',
      line: BILGE_SPEAK_POLICY.hint_escalate.examples[Math.max(0, idx)],
    };
  }

  if (hasHesitation(behavior) && behavior.totalTouches === 0) {
    return {
      trigger: 'silence',
      silenceReason: 'child_is_thinking',
    };
  }

  if (behavior.firstChoiceCorrect === true && behavior.retries === 0) {
    return {
      trigger: 'silence',
      silenceReason: 'success_belongs_to_child',
      motivation: 'ortaklik',
    };
  }

  return {
    trigger: 'silence',
    silenceReason: 'world_speaks',
  };
}

/** Replik Bilge politikasına uyuyor mu? */
export function validateBilgeLine(line: string): { ok: boolean; issues: string[] } {
  const lower = line.toLocaleLowerCase('tr');
  const issues = BILGE_FORBIDDEN.filter((p) => lower.includes(p)).map(
    (p) => `Bilge yasaklı ifade: "${p}"`,
  );
  return { ok: issues.length === 0, issues };
}

/** Konuşmacı Bilge ise ek denetim uygula. */
export function enforceSpeakerPolicy(
  speaker: CharacterId,
  line: string,
): { ok: boolean; issues: string[] } {
  if (speaker !== 'bilge') return { ok: true, issues: [] };
  return validateBilgeLine(line);
}
