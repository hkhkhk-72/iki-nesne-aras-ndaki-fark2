/**
 * Mavi Kitap Karar 283 · 284 · 285
 *
 * Kavram genelleme, çoklu bağlam, transfer (tekrar değil).
 */

export const KARAR_283 = {
  id: 'MB-283' as const,
  title: 'Kavram Nesneden Bağımsızdır',
  rule:
    'Matematiksel kavramlar belirli nesnelere bağlı öğretilmez. ' +
    'Aynı kavram farklı bağlamlarda tekrar edilerek genelleme gelişir.',
};

export const KARAR_284 = {
  id: 'MB-284' as const,
  title: 'Her Kavram En Az Üç Bağlamda Yaşatılır',
  rule:
    'Bir matematik kavramı, farklı nesneler ve hikâyeler içinde en az üç kez ' +
    'deneyimlenmeden tamamlanmış kabul edilmez.',
};

export const KARAR_285 = {
  id: 'MB-285' as const,
  title: 'Tekrar Değil, Transfer',
  rule:
    'Aynı etkinlik tekrar ettirilmez. Aynı öğrenme hedefi yeni bağlamlarda sunulur.',
};

/** Karar 284 — tamamlanma eşiği. */
export const MIN_CONTEXTS_PER_CONCEPT = 3;
