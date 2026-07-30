/**
 * Mavi Kitap Karar 274 · 275 · 276
 *
 * Ürün sahibi metni — bağlayıcı.
 */

export const KARAR_274 = {
  id: 'MB-274' as const,
  title: 'Keşif Anı Çocuğa Aittir',
  rule:
    'MiniBilge keşif anını çocuğun elinden almaz. Çocuk "Ben buldum." hissini yaşamalıdır. ' +
    'Sistem yalnızca bu anı görünür ve anlamlı kılar.',
};

export const KARAR_275 = {
  id: 'MB-275' as const,
  title: 'Dünya Kutlar, Arayüz Değil',
  rule:
    'Doğru öğrenme anlarında geri bildirim karakter, ışık, doğa ve çevresel animasyonlarla verilir. ' +
    'Pop-up, yıldız yağmuru veya yüksek sesli efekt kullanılmaz.',
};

export const KARAR_276 = {
  id: 'MB-276' as const,
  title: 'Süreç Sonuçtan Değerlidir',
  rule:
    'MiniBilge doğru cevabı değil; gözlem, karşılaştırma, düşünme ve öz-düzeltme sürecini destekler. ' +
    'Yapay zekâ bu süreci analiz eder, sonucu değil.',
};

/** Karar 275 — yasaklı UI kutlama kalıpları. */
export const FORBIDDEN_UI_CELEBRATION = [
  'popup',
  'pop-up',
  'pop_up',
  'yıldız yağmuru',
  'yildiz yagmuru',
  'star rain',
  'starrain',
  'confetti blast',
  'loud reward',
  'fanfare',
  'ödül popup',
  'odul popup',
] as const;

/** Karar 276 — AI süreç metrikleri (sonuç skoru değil). */
export const PROCESS_AI_METRICS = [
  'reflection_time',
  'observe_pattern',
  'subitize_attempt',
  'grouping_strategy',
  'visual_focus',
  'wait_time',
  'effort_history',
  'retry_count',
] as const;
