/**
 * Mavi Kitap Karar 268 · 269 · 270
 *
 * Ürün sahibi metni — bağlayıcı. Yeni anayasa icat etmez.
 */

export const KARAR_268 = {
  id: 'MB-268' as const,
  title: 'İlk Karar Güvenli · Bakış Nesneye',
  rule:
    'İlk matematiksel karar "yanlış" etiketlenmez. ' +
    'Çocuk seçim yaptıktan sonra karakter önce çocuğa değil, seçilen nesneye bakar — "beni dinliyor" hissi.',
};

export const KARAR_269 = {
  id: 'MB-269' as const,
  title: 'Yanlış Seçim Yok · Keşif',
  rule:
    'MiniBilge’de yanlış seçim kavramı yoktur. ' +
    'Her etkileşim hikâyeyi ilerleten doğal bir keşif olarak değerlendirilir. ' +
    '(Karşılaştırma saymadan önce gelir — Karar 231 / countVisibility.)',
};

export const KARAR_270 = {
  id: 'MB-270' as const,
  title: 'Dünya Geri Bildirim · Beklemede Yaşayan Dünya',
  rule:
    'Geri bildirimi arayüz değil dünya verir. Beklemede yardım metni yerine yaşayan dünya: ' +
    '1) karakter mimiği 2) bakış 3) dünya sesi 4) rehber karakter 5) metin.',
};

/**
 * Karar 270 — bekleme yardım önceliği (metin en sonda).
 */
export const WAIT_HELP_PRIORITY = [
  'character_mime',
  'character_gaze',
  'world_sound',
  'guide_character',
  'text',
] as const;

export type WaitHelpLayer = (typeof WAIT_HELP_PRIORITY)[number];

/** Bekleme süresine göre hangi katman aktif (ms). */
export function waitHelpLayerAt(msSinceTouch: number): WaitHelpLayer {
  if (msSinceTouch < 2500) return 'character_mime';
  if (msSinceTouch < 5000) return 'character_gaze';
  if (msSinceTouch < 8000) return 'world_sound';
  if (msSinceTouch < 12_000) return 'guide_character';
  return 'text';
}

/** Çocuk yüzüne yasaklı etiketler (Karar 268 / 269 / 270). */
export const FORBIDDEN_DECISION_LABELS = [
  'yanlış',
  'yanlis',
  'wrong',
  'incorrect',
  'doğru!',
  'dogru!',
  'correct!',
  'hata yaptın',
  'hata yaptin',
] as const;

export function isForbiddenDecisionLabel(text: string): boolean {
  const blob = text.toLocaleLowerCase('tr');
  return FORBIDDEN_DECISION_LABELS.some((w) => blob.includes(w));
}

/** Karar 268 — seçilen nesneye bakış cue’ları. */
export function gazeAtSelectionCue(optionLabel: string): string {
  return `Fındık ${optionLabel} tarafına bakar… seni dinliyor.`;
}
