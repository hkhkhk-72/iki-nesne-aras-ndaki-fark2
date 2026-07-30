/**
 * MB-LAB-001 Scientific Foundation v1.2 — APPROVED
 *
 * Mavi Kitap 268–285 + LAB pedagoji 280–282, 286–287.
 */

export const LAB_ID = 'MB-LAB-001' as const;
export const LAB_VERSION = '1.2' as const;

export type ScientificFoundation =
  | 'perceptual_subitizing'
  | 'conceptual_subitizing'
  | 'cpa'
  | 'montessori_sensory'
  | 'finland_play_based'
  | 'oecd_starting_strong';

export const SCIENTIFIC_FOUNDATIONS: Record<
  ScientificFoundation,
  { title: string; summary: string }
> = {
  perceptual_subitizing: {
    title: 'Perceptual Subitizing (1–4)',
    summary: '1–4 nesne sayılmadan doğrudan hissedilir.',
  },
  conceptual_subitizing: {
    title: 'Conceptual Subitizing (5+)',
    summary: '5+ nesne alt gruplarla (3+2, 4+1…) algılanır.',
  },
  cpa: {
    title: 'CPA Learning Model',
    summary: 'Concrete → Pictorial → Abstract.',
  },
  montessori_sensory: {
    title: 'Montessori Sensory Learning',
    summary: 'Doğal dizilim, dokunma, baskısız tempo.',
  },
  finland_play_based: {
    title: 'Finland Play-Based Mathematics',
    summary: 'Hikâye ve oyun; test / hız hissi yok.',
  },
  oecd_starting_strong: {
    title: 'OECD Starting Strong',
    summary: 'Erken matematik ilişki, dil ve oyunla kurulur.',
  },
};

export type PedagogicalRuleId =
  | 'MB-268'
  | 'MB-269'
  | 'MB-270'
  | 'MB-271'
  | 'MB-272'
  | 'MB-273'
  | 'MB-274'
  | 'MB-275'
  | 'MB-276'
  | 'MB-277'
  | 'MB-278'
  | 'MB-279'
  | 'MB-280'
  | 'MB-281'
  | 'MB-282'
  | 'MB-283'
  | 'MB-284'
  | 'MB-285'
  | 'MB-286'
  | 'MB-287';

export const PEDAGOGICAL_RULES: Record<
  PedagogicalRuleId,
  { title: string; rule: string }
> = {
  'MB-268': {
    title: 'İlk Karar Güvenli Olmalıdır',
    rule:
      'İlk matematiksel karar asla "yanlış" etiketlenmez; sistem yalnızca gözlemler.',
  },
  'MB-269': {
    title: 'Karşılaştırma Saymadan Önce Gelir',
    rule: 'Önce miktar farkı hissedilir; sembol ve sayılar sonra gelir.',
  },
  'MB-270': {
    title: 'Dünya Geri Bildirim Verir',
    rule: 'Geri bildirimi arayüz değil dünya verir (bakış, yaprak, doğal hareket).',
  },
  'MB-271': {
    title: 'Sessizlik de Bir Geri Bildirimdir',
    rule: 'Bekleme ve doğal akış; ses/metin zorunlu değildir.',
  },
  'MB-272': {
    title: 'Hata Söylenmez, Hissettirilir',
    rule: 'Asla "yanlış" denmez; doğal ipucu ile çocuk yeniden değerlendirir.',
  },
  'MB-273': {
    title: 'Düşünme Süresi Başarı Süresinden Değerlidir',
    rule: 'AI öncelikle Reflection Time izler; hız övülmez.',
  },
  'MB-274': {
    title: 'Keşif Anı Çocuğa Aittir',
    rule: 'Keşif anı çocuğundur; sistem yalnızca görünür ve anlamlı kılar.',
  },
  'MB-275': {
    title: 'Dünya Kutlar, Arayüz Değil',
    rule: 'Kutlama dünya ile yapılır; pop-up / yıldız yağmuru / yüksek ses yok.',
  },
  'MB-276': {
    title: 'Süreç Sonuçtan Değerlidir',
    rule: 'AI süreci analiz eder (gözlem, karşılaştırma, düşünme, öz-düzeltme); sonucu değil.',
  },
  'MB-277': {
    title: 'Karakter Soruyu Yaşar, Söylemez',
    rule: 'Önce davranışla soru; sözlü/yazılı yönlendirme sonra ve yalnızca gerektiğinde.',
  },
  'MB-278': {
    title: 'Beklemek Öğretimin Bir Parçasıdır',
    rule: 'Sessiz düşünme süresi aktif öğretim bileşenidir; gereksiz yönlendirme yok.',
  },
  'MB-279': {
    title: 'Merak Cevaptan Önce Gelir',
    rule: 'Önce merak ve gözlem; kavram adı süreç tamamlandıktan sonra.',
  },
  'MB-280': {
    title: '1–4 Asla Saydırılmaz',
    rule: '1–4 nesne ASLA saydırılmaz; çocuk miktarı doğrudan hisseder.',
  },
  'MB-281': {
    title: '5+ Alt Grup',
    rule: '5+ nesnede doğal kümeler kullanılır (3+2, 4+1, 2+2+1…).',
  },
  'MB-282': {
    title: 'Hız Baskısı Yasak',
    rule: 'Timer, Countdown, LeaderBoard, Speed Bonus yasaktır.',
  },
  'MB-283': {
    title: 'Kavram Nesneden Bağımsızdır',
    rule: 'Kavram belirli nesneye bağlı öğretilmez; farklı bağlamlarda genellenir.',
  },
  'MB-284': {
    title: 'Her Kavram En Az Üç Bağlamda Yaşatılır',
    rule: 'En az üç farklı nesne/hikâye bağlamı olmadan kavram tamamlanmış sayılmaz.',
  },
  'MB-285': {
    title: 'Tekrar Değil, Transfer',
    rule: 'Aynı etkinlik tekrar ettirilmez; aynı hedef yeni bağlamlarda sunulur.',
  },
  'MB-286': {
    title: 'Her LS CPA Destekler',
    rule: 'Concrete → Picture → Abstract zinciri her LS’te desteklenir.',
  },
  'MB-287': {
    title: 'Gör → Hisset → İsimlendir',
    rule: 'Matematik önce görülür, sonra hissedilir, en son isimlendirilir.',
  },
};

/** MB-282 — yasaklı hız baskısı kalıpları (içerik + UI metni). */
export const FORBIDDEN_PRESSURE = [
  'timer',
  'countdown',
  'leaderboard',
  'speed bonus',
  'hız bonus',
  'süre doldu',
  'geri sayım',
  'liderlik tablosu',
  'en hızlı',
] as const;

export type CpaPhase = 'concrete' | 'pictorial' | 'abstract';

export const CPA_ORDER: CpaPhase[] = ['concrete', 'pictorial', 'abstract'];

export const PERCEPTUAL_SUBITIZE_MAX = 4;
export const CONCEPTUAL_SUBITIZE_MIN = 5;

export function isPerceptualCount(n: number): boolean {
  return n >= 1 && n <= PERCEPTUAL_SUBITIZE_MAX;
}

export function isConceptualCount(n: number): boolean {
  return n >= CONCEPTUAL_SUBITIZE_MIN;
}

/** MB-280: 1–4 için sayma istemi üretilemez. */
export function mayPromptCount(n: number): boolean {
  return !isPerceptualCount(n);
}

/**
 * MB-281 — 5+ için doğal alt grup şablonları.
 * Toplam her zaman `n` eder.
 */
export const GROUPING_TEMPLATES: Record<number, number[][]> = {
  5: [
    [3, 2],
    [4, 1],
    [2, 2, 1],
  ],
  6: [
    [3, 3],
    [4, 2],
    [2, 2, 2],
    [5, 1],
  ],
  7: [
    [4, 3],
    [3, 2, 2],
    [5, 2],
  ],
  8: [
    [4, 4],
    [3, 3, 2],
    [5, 3],
  ],
  9: [
    [3, 3, 3],
    [4, 3, 2],
    [5, 4],
  ],
  10: [
    [5, 5],
    [4, 3, 3],
    [2, 2, 3, 3],
  ],
};

export function pickGrouping(n: number, seed = 0): number[] {
  if (!isConceptualCount(n)) return [n];
  const templates = GROUPING_TEMPLATES[n];
  if (!templates?.length) {
    // Güvenli varsayılan: 3’lü kümeler + kalan
    const groups: number[] = [];
    let left = n;
    while (left > 4) {
      groups.push(3);
      left -= 3;
    }
    if (left > 0) groups.push(left);
    return groups;
  }
  return templates[Math.abs(seed) % templates.length];
}
