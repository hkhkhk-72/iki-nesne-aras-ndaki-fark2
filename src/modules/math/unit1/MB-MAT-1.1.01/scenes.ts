import type { SceneSpec } from '@/mes/types';

/**
 * MB-MAT-1.1.01 — Fındık Sincap'ın Kış Hazırlığı
 * Sahne dosyası.
 *
 * Görünmez matematik ilkesi: çocuk "az/çok/eşit çalışıyorum" demez,
 * "Fındık'a yardım ediyorum" der. Kavram hikâyenin içinde saklıdır.
 *
 * 60 saniye kuralı: ilk üç sahne toplam 60 saniyenin altında ve
 * çocuk ilk sahnede hiçbir şeyi "bilmek" zorunda değildir.
 * 3 dokunuş kuralı: sahne başına maxTouches ≤ 3.
 */

const PALAMUT_POOL = ['🌰', '🥜', '🌰'];

export const scenes: SceneSpec[] = [
  // ── SAHNE 1 — Tanışma ──────────────────────────────────────
  {
    id: 'scene01',
    order: 1,
    title: 'Fındık ile Tanışma',
    pedagogicalGoal:
      'Duygusal bağ kurmak. Bu sahnede matematik yoktur; çocuk yalnızca bir arkadaş edinir.',
    targetEmotion: 'sicaklik',
    opening: {
      visual: '🐿️',
      line: 'Merhaba! Ben Fındık. Keşif Ormanı\'nda yaşıyorum.',
      speaker: 'findik',
      animation: 'rise',
    },
    interaction: {
      kind: 'narrative',
      speaker: 'findik',
      lines: [
        'Kış geliyor ve benim bir sorunum var.',
        'Kışın yiyecek bulamıyorum. Şimdiden hazırlık yapmam gerek.',
        'Bana yardım eder misin?',
      ],
      continueLabel: 'Sana yardım ederim!',
    },
    aiObservation: {
      concept: 'katilim',
      signals: ['touch_latency', 'wait_time'],
      misconceptions: [],
    },
    feedback: {
      positive: 'Teşekkür ederim! Artık iyi bir ekibiz.',
      guidance: 'Acele etme, ben buradayım.',
      speaker: 'findik',
    },
    estimatedSeconds: 25,
    maxTouches: 3,
    replay: {
      greetings: [
        'Merhaba! Ben Fındık. Keşif Ormanı\'nda yaşıyorum.',
        'Selam! Adım Fındık. Şu ağaçta oturuyorum.',
        'Hoş geldin! Ben Fındık, ormanın en meraklı sincabı.',
      ],
    },
    accessibilityLabel: 'Fındık Sincap kendini tanıtıyor ve yardım istiyor.',
  },

  // ── SAHNE 2 — Palamutları keşfetme ─────────────────────────
  {
    id: 'scene02',
    order: 2,
    title: 'Palamutları Keşfet',
    pedagogicalGoal:
      'Birebir sayma becerisini dokunarak deneyimletmek. Sayı söylenmez, çocuk kendi sayar.',
    targetEmotion: 'kesif',
    opening: {
      visual: '🌳',
      line: 'Ormanda palamutlar var. Hepsine dokunup toplayabilir misin?',
      speaker: 'findik',
      animation: 'fade',
    },
    interaction: {
      kind: 'discover',
      prompt: 'Palamutlara dokun ve topla',
      items: [
        { id: 'p1', emoji: '🌰', label: 'palamut' },
        { id: 'p2', emoji: '🌰', label: 'palamut' },
        { id: 'p3', emoji: '🌰', label: 'palamut' },
      ],
      revealCount: true,
    },
    aiObservation: {
      concept: 'birebir_sayma',
      signals: ['touch_latency', 'retry_count'],
      misconceptions: ['ayni_nesneye_tekrar_dokunma', 'nesne_atlama'],
    },
    feedback: {
      positive: 'Harika! Hepsini topladın.',
      guidance: 'Dokunmadığın bir palamut kalmış olabilir, bir daha bak.',
      speaker: 'findik',
    },
    estimatedSeconds: 30,
    maxTouches: 3,
    replay: { emojiPool: PALAMUT_POOL },
    accessibilityLabel: 'Üç palamut var. Her birine dokunarak topluyorsun.',
  },

  // ── SAHNE 3 — İki grubu inceleme ───────────────────────────
  {
    id: 'scene03',
    order: 3,
    title: 'İki Kovayı İncele',
    pedagogicalGoal:
      'Karşılaştırma öncesi gözlem. Bu sahnede doğru cevap yoktur; amaç iki grubu fark etmek.',
    targetEmotion: 'merak',
    opening: {
      visual: '🪣',
      line: 'İki kovam var. Onlara bir bakalım mı?',
      speaker: 'findik',
      animation: 'fade',
    },
    interaction: {
      kind: 'observe',
      prompt: 'Kovalara dokunarak içlerine bak',
      groups: [
        { id: 'kova_a', label: 'Kırmızı Kova', emoji: '🌰', count: 5 },
        { id: 'kova_b', label: 'Mavi Kova', emoji: '🌰', count: 3 },
      ],
      continueLabel: 'İkisini de gördüm',
    },
    aiObservation: {
      concept: 'grup_farkindaligi',
      signals: ['touch_latency', 'wait_time'],
      misconceptions: [],
    },
    feedback: {
      positive: 'İyi gözlem! Kovalar birbirinden farklı görünüyor.',
      guidance: 'Diğer kovaya da bakmak ister misin?',
      speaker: 'bilge',
    },
    estimatedSeconds: 30,
    maxTouches: 3,
    accessibilityLabel: 'Kırmızı kovada beş, mavi kovada üç palamut var.',
  },

  // ── SAHNE 4 — Birebir eşleştirme ───────────────────────────
  {
    id: 'scene04',
    order: 4,
    title: 'Birebir Eşleştir',
    pedagogicalGoal:
      'Sayı saymadan karşılaştırma: birebir eşleştirme sonucu artan taraf kavramı sezdirir. ' +
      'Bu, az/çok kavramının somut temelidir.',
    targetEmotion: 'kesif',
    opening: {
      visual: '🤝',
      line: 'Palamutları ikişer ikişer yan yana koyalım. Bakalım ne olacak?',
      speaker: 'bilge',
      animation: 'rise',
    },
    interaction: {
      kind: 'pair',
      prompt: 'Her kırmızı palamuta bir mavi palamut eşle',
      groups: [
        { id: 'kova_a', label: 'Kırmızı Kova', emoji: '🌰', count: 5 },
        { id: 'kova_b', label: 'Mavi Kova', emoji: '🌰', count: 3 },
      ],
      leftoverLine: 'Bak! Kırmızı kovada eşi olmayan palamutlar kaldı. Demek ki orada daha çok var.',
    },
    aiObservation: {
      concept: 'birebir_eslestirme',
      signals: ['touch_latency', 'retry_count', 'success_trend'],
      misconceptions: ['eslesmeyi_tamamlamadan_karar_verme'],
    },
    feedback: {
      positive: 'Eşleştirmeyi tamamladın!',
      guidance: 'Eşleştirmeye devam edelim, sonunda bir şey fark edeceksin.',
      speaker: 'bilge',
    },
    estimatedSeconds: 45,
    maxTouches: 3,
    accessibilityLabel: 'Palamutları birebir eşleştiriyorsun; kırmızı kovada artan palamutlar kalıyor.',
  },

  // ── SAHNE 5 — Daha fazla ───────────────────────────────────
  {
    id: 'scene05',
    order: 5,
    title: 'Daha Çok Olan',
    pedagogicalGoal: '"Daha çok" kavramını eşleştirme deneyiminin üzerine oturtmak.',
    targetEmotion: 'basari',
    opening: {
      visual: '🐿️',
      line: 'Hangi kovada daha çok palamut var?',
      speaker: 'findik',
      animation: 'pop',
    },
    interaction: {
      kind: 'choose',
      prompt: 'Daha çok palamut hangi kovada?',
      groups: [
        { id: 'kova_a', label: 'Kırmızı Kova', emoji: '🌰', count: 5 },
        { id: 'kova_b', label: 'Mavi Kova', emoji: '🌰', count: 3 },
      ],
      options: [
        { id: 'kova_a', label: 'Kırmızı Kova', visual: '🔴' },
        { id: 'kova_b', label: 'Mavi Kova', visual: '🔵' },
      ],
      answerId: 'kova_a',
      hints: [
        'Az önce eşleştirmiştik. Hangi kovada eşi olmayan palamutlar kalmıştı?',
        'Kırmızı kovadaki palamutları tek tek sayalım, sonra mavi kovadakileri.',
      ],
    },
    aiObservation: {
      concept: 'daha_cok',
      signals: ['first_choice', 'retry_count', 'error_type', 'hesitation'],
      misconceptions: ['az_ile_cok_karistirma', 'buyuk_gorunen_secme'],
    },
    feedback: {
      positive: 'Evet! Kırmızı kovada daha çok palamut var.',
      guidance: 'Birlikte tekrar bakalım. Eşleştirdiğimizde nerede fazla kalmıştı?',
      speaker: 'findik',
    },
    estimatedSeconds: 40,
    maxTouches: 3,
    accessibilityLabel: 'Daha çok palamut olan kovayı seçiyorsun.',
  },

  // ── SAHNE 6 — Daha az ──────────────────────────────────────
  {
    id: 'scene06',
    order: 6,
    title: 'Daha Az Olan',
    pedagogicalGoal:
      '"Daha az" kavramını "daha çok"un karşıtı olarak kurmak. Aynı görsel bağlam korunur.',
    targetEmotion: 'guven',
    opening: {
      visual: '🪣',
      line: 'Şimdi tersini soralım. Hangi kovada daha az palamut var?',
      speaker: 'bilge',
      animation: 'fade',
    },
    interaction: {
      kind: 'choose',
      prompt: 'Daha az palamut hangi kovada?',
      groups: [
        { id: 'kova_a', label: 'Kırmızı Kova', emoji: '🌰', count: 5 },
        { id: 'kova_b', label: 'Mavi Kova', emoji: '🌰', count: 3 },
      ],
      options: [
        { id: 'kova_a', label: 'Kırmızı Kova', visual: '🔴' },
        { id: 'kova_b', label: 'Mavi Kova', visual: '🔵' },
      ],
      answerId: 'kova_b',
      hints: [
        'Daha az demek, daha küçük miktar demek. Hangi kovada daha küçük bir yığın var?',
        'Kırmızı kovada 5, mavi kovada 3 palamut var. 3, 5\'ten küçüktür.',
      ],
    },
    aiObservation: {
      concept: 'daha_az',
      signals: ['first_choice', 'retry_count', 'error_type'],
      misconceptions: ['az_ile_cok_ters_cevirme'],
    },
    feedback: {
      positive: 'Doğru! Mavi kovada daha az palamut var.',
      guidance: 'Bu kez daha küçük olanı arıyoruz. Hangisi daha küçük?',
      speaker: 'bilge',
    },
    estimatedSeconds: 40,
    maxTouches: 3,
    accessibilityLabel: 'Daha az palamut olan kovayı seçiyorsun.',
  },

  // ── SAHNE 7 — Eşit ─────────────────────────────────────────
  {
    id: 'scene07',
    order: 7,
    title: 'Eşit Olunca',
    pedagogicalGoal:
      '"Eşit" kavramını birebir eşleştirmede artan olmaması olarak kurmak.',
    targetEmotion: 'basari',
    opening: {
      visual: '⚖️',
      line: 'Mavi kovaya iki palamut daha ekledim. Şimdi ne oldu?',
      speaker: 'findik',
      animation: 'pop',
    },
    interaction: {
      kind: 'choose',
      prompt: 'Kovalar hakkında ne söyleyebilirsin?',
      groups: [
        { id: 'kova_a', label: 'Kırmızı Kova', emoji: '🌰', count: 5 },
        { id: 'kova_b', label: 'Mavi Kova', emoji: '🌰', count: 5 },
      ],
      options: [
        { id: 'esit', label: 'İkisi de aynı', visual: '⚖️' },
        { id: 'kova_a', label: 'Kırmızıda çok', visual: '🔴' },
        { id: 'kova_b', label: 'Mavide çok', visual: '🔵' },
      ],
      answerId: 'esit',
      hints: [
        'Birebir eşleştirsek artan palamut kalır mıydı?',
        'Her kırmızı palamutun bir mavi eşi var. Hiç artan yok.',
      ],
    },
    aiObservation: {
      concept: 'esit',
      signals: ['first_choice', 'retry_count', 'error_type'],
      misconceptions: ['esitligi_fark_etmeme', 'kova_boyutuna_bakma'],
    },
    feedback: {
      positive: 'Evet! İkisi de eşit. Hiç artan palamut yok.',
      guidance: 'Eşleştirdiğimizde artan kalmıyorsa buna eşit deriz.',
      speaker: 'findik',
    },
    estimatedSeconds: 40,
    maxTouches: 3,
    accessibilityLabel: 'İki kovada da beş palamut var; eşit olduğunu seçiyorsun.',
  },

  // ── SAHNE 8 — Kutlama ──────────────────────────────────────
  {
    id: 'scene08',
    order: 8,
    title: 'Kış Hazır!',
    pedagogicalGoal:
      'Emeği görünür kılmak ve tekrar gelme isteği oluşturmak. Puan gösterilmez, hikâye kapanır.',
    targetEmotion: 'nese',
    opening: {
      visual: '❄️',
      line: 'Kış hazırlığım tamamlandı! Sensiz yapamazdım.',
      speaker: 'findik',
      animation: 'rise',
    },
    interaction: {
      kind: 'celebrate',
      title: 'Fındık\'ın kışı güvende!',
      message:
        'Palamutları saydın, eşleştirdin ve kovaları karşılaştırdın. Fındık artık kışa hazır.',
      reward: '🏅',
    },
    aiObservation: {
      concept: 'tamamlama',
      signals: ['success_trend'],
      misconceptions: [],
    },
    feedback: {
      positive: 'Yarın yine gelir misin? Sana ormanı gezdireceğim.',
      guidance: '',
      speaker: 'findik',
    },
    estimatedSeconds: 20,
    maxTouches: 1,
    accessibilityLabel: 'Macera tamamlandı. Fındık kışa hazır ve sana teşekkür ediyor.',
  },
];
