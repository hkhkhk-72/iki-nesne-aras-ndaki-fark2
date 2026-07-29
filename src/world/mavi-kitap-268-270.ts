/**
 * Mavi Kitap Karar 268 · 269 · 270
 *
 * Ürün sahibi metni — bağlayıcı. Yeni anayasa icat etmez.
 */

export const KARAR_268 = {
  id: 'MB-268' as const,
  title: 'İlk Karar Güvenli Olmalıdır',
  rule:
    'Çocuğun verdiği ilk matematiksel karar hiçbir zaman "yanlış" olarak etiketlenmez. ' +
    'Sistem yalnızca gözlemler; ilk karar öğrenmenin doğal parçasıdır.',
};

export const KARAR_269 = {
  id: 'MB-269' as const,
  title: 'Karşılaştırma Saymadan Önce Gelir',
  rule:
    'Karşılaştırma becerisi sayma becerisinden önce geliştirilir. ' +
    'Çocuk önce miktar farkını hisseder; sembol ve sayılar sonra gelir.',
};

export const KARAR_270 = {
  id: 'MB-270' as const,
  title: 'Dünya Geri Bildirim Verir',
  rule:
    'Geri bildirimi arayüz değil, dünyanın kendisi verir. ' +
    'Yaprak, bakış ve doğal animasyon; doğru/yanlış mesajının yerini alır.',
};

/** Çocuk yüzüne yasaklı etiketler (Karar 268 + 270). */
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
