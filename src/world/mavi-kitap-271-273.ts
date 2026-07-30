/**
 * Mavi Kitap Karar 271 · 272 · 273
 *
 * Ürün sahibi metni — bağlayıcı.
 */

export const KARAR_271 = {
  id: 'MB-271' as const,
  title: 'Sessizlik de Bir Geri Bildirimdir',
  rule:
    'Her geri bildirim ses veya metin olmak zorunda değildir. ' +
    'Karakterin beklemesi ve dünyanın doğal akışı düşünmeye teşvik eder.',
};

export const KARAR_272 = {
  id: 'MB-272' as const,
  title: 'Hata Söylenmez, Hissettirilir',
  rule:
    'MiniBilge hiçbir zaman "yanlış" demez. ' +
    'Çocuk kendi gözlemiyle kararını yeniden değerlendirir; sistem doğal ipucu sunar.',
};

export const KARAR_273 = {
  id: 'MB-273' as const,
  title: 'Düşünme Süresi Başarı Süresinden Değerlidir',
  rule:
    'Düşünmek için ayrılan zaman, doğru cevabı verme hızından daha değerlidir. ' +
    'AI motoru öncelikle Reflection Time metriğini izler.',
};

/** Karar 273 — AI birincil metrik kimliği. */
export const REFLECTION_TIME_METRIC = 'reflection_time' as const;
