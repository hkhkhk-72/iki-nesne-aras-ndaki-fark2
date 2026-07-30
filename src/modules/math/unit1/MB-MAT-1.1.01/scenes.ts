import type { SceneSpec } from '@/mes/types';

/**
 * MB-MAT-1.1.01 — Fındık Sincap'ın Kış Hazırlığı
 *
 * Mikro Deneyim 01 "İlk Bakış": bağ kurar, matematik yoktur.
 * Mikro Deneyim 02 "İki Ağaç": sezgisel "daha fazla" (Karar 231).
 *
 * Karar 235: ilk 60 saniyede matematik kelimesi kullanılmaz.
 * Karar 236: her sahne tek öğrenme hedefi taşır.
 */

const PALAMUT_POOL = ['🌰', '🥜', '🌰'];

export const scenes: SceneSpec[] = [
  // ── MİKRO DENEYİM 01 — İlk Bakış ───────────────────────────
  {
    id: 'scene01',
    order: 1,
    title: 'İlk Bakış',
    pedagogicalGoal:
      'Güven, merak ve duygusal bağ kurmak. Matematik yoktur; çocuk yalnızca ' +
      '"Fındık\'ın bana ihtiyacı var" hissini yaşar.',
    targetEmotion: 'sicaklik',
    opening: {
      visual: '🍂🐿️🧺',
      line: 'Merhaba!',
      speaker: 'findik',
      animation: 'rise',
    },
    interaction: {
      kind: 'narrative',
      speaker: 'findik',
      lines: [
        'Kış yaklaşıyor...',
        'Ama galiba tek başıma yetişemeyeceğim.',
      ],
      continueLabel: 'Bana Yardım Et',
      /** Tek CTA; satırlar otomatik akar, çocuk yalnızca bağ kurar. */
      singleCta: true,
      /** Dokunuştan sonra Bilge ilk kez konuşur — puan/aferin yok. */
      bondMoment: true,
    },
    aiObservation: {
      concept: 'duygusal_bag',
      signals: ['touch_latency', 'wait_time', 'hesitation', 'screen_dwell', 'audio_listen'],
      misconceptions: [],
    },
    feedback: {
      positive: 'Harika... Birlikte çok güzel işler başaracağız.',
      guidance: 'Ben buradayım. Acele etme.',
      speaker: 'bilge',
    },
    estimatedSeconds: 20,
    maxTouches: 1,
    atmosphere: {
      season: 'sonbahar',
      worldCue: 'Yapraklar sallanıyor, kuş ve rüzgar sesi; Fındık yarı dolu sepetle nefes nefese gelir. Bilge dalda sessizce gülümser.',
    },
    soundBudget: {
      ambient: 'ruzgar_yaprak',
      character: 'findik_nefes_selam',
      interaction: 'yardim_dokunus',
      success: 'yaprak_yildiz',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    replay: {
      greetings: [
        'Merhaba!',
        'Selam! Seni gördüğüme sevindim.',
        'Hoş geldin... Biraz telaşlıyım.',
      ],
    },
    accessibilityLabel:
      'Sonbahar ormanı. Fındık Sincap yarı dolu sepetiyle yardım istiyor. Bilge Baykuş dalda sessizce gülümsüyor.',
  },

  // ── MİKRO DENEYİM 02 — Sezgisel karşılaştırma ──────────────
  {
    id: 'scene02',
    order: 2,
    title: 'İki Ağaç',
    learningSceneId: 'LS-004',
    storyToken: 'story.observe',
    motionToken: 'motion.observe',
    /** Karar 268 — ilk matematiksel karar; asla "yanlış" etiketlenmez. */
    firstMathDecision: true,
    /** Karar 270 — geri bildirimi dünya verir. */
    worldFeedback: true,
    /** Karar 277 — önce davranışla soru. */
    behaviorBeforeSpeech: true,
    /** Karar 278 — beklemek öğretim. */
    waitIsTeaching: true,
    /** Karar 279 — merak önce. */
    curiosityBeforeConcept: true,
    pedagogicalGoal:
      'Karar 268/269/271–279: güvenli karar, saymadan karşılaştırma, davranışla soru, merak önce. ' +
      '3 perceptual, 6 conceptual (3+3). Hız baskısı yok (MB-282).',
    targetEmotion: 'merak',
    discoveryBelongsToChild: true,
    worldCelebration: true,
    opening: {
      visual: '🌳🌳',
      line: 'Sence hangisinde daha fazla olabilir?',
      speaker: 'findik',
      animation: 'fade',
    },
    interaction: {
      kind: 'choose',
      prompt: 'Hangisinde daha fazla palamut var?',
      groups: [
        { id: 'agac_az', label: 'Sol Ağaç', emoji: '🌰', count: 3 },
        { id: 'agac_cok', label: 'Sağ Ağaç', emoji: '🌰', count: 6 },
      ],
      options: [
        { id: 'agac_az', label: 'Sol Ağaç', visual: '🌳' },
        { id: 'agac_cok', label: 'Sağ Ağaç', visual: '🌳' },
      ],
      answerId: 'agac_cok',
      hints: [
        'İki ağaca bir daha bak. Hangisinin altında daha büyük bir yığın duruyor?',
        'Sol taraftaki yığın daha küçük görünüyor. Diğerine bir bak.',
      ],
      /** Sezgisel: sayılar asla görünmez. */
      countVisibility: 'never',
    },
    aiObservation: {
      concept: 'sezgisel_daha_fazla',
      signals: [
        'first_choice',
        'hesitation',
        'touch_latency',
        'subitize_attempt',
        'grouping_strategy',
        'visual_focus',
        'observe_pattern',
        'reflection_time',
      ],
      misconceptions: ['kucuk_yigini_secme', 'rastgele_dokunma'],
    },
    feedback: {
      positive: 'Evet... Sağdaki ağacın altında daha fazla palamut var.',
      guidance: 'Birlikte tekrar bakalım. Hangisinin yığını daha büyük görünüyor?',
      speaker: 'findik',
    },
    estimatedSeconds: 30,
    maxTouches: 2,
    atmosphere: {
      season: 'sonbahar',
      worldCue: 'Fındık iki ağaca bakar, bekler — soruyu yaşar, henüz söylemez (MB-277/278).',
    },
    soundBudget: {
      ambient: 'orman_sessiz',
      character: 'findik_merak',
      interaction: 'agac_dokunus',
      success: 'hafif_yildiz',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    replay: { countJitter: 1 },
    accessibilityLabel:
      'İki ağaç. Birinin altında az, diğerinin altında daha fazla palamut var. Hangisinde daha fazla olduğunu seçiyorsun.',
  },

  // ── LS-006 — Trust (GRP-001 APPROVED) ──────────────────────
  {
    id: 'ls006',
    order: 3,
    title: 'Güven',
    learningSceneId: 'LS-006',
    storyToken: 'story.trust',
    motionToken: 'motion.trust',
    pedagogicalGoal:
      'İlk anlamlı karardan sonra güven duygusu oluşturmak. ' +
      'Puan, ödül penceresi ve doğru/yanlış geri bildirimi yoktur — yalnızca destekleyici duygusal tepki.',
    targetEmotion: 'guven',
    opening: {
      visual: '🐿️✨',
      line: 'Yanımda olduğun için teşekkür ederim.',
      speaker: 'findik',
      animation: 'rise',
    },
    interaction: {
      kind: 'trust',
      line: 'Birlikte bakmak… bana güven veriyor.',
      continueLabel: 'Devam edelim',
    },
    aiObservation: {
      concept: 'guven',
      signals: ['first_success', 'decision_confidence', 'touch_latency'],
      misconceptions: [],
    },
    feedback: {
      positive: 'Birlikte bakmak… bana güven veriyor.',
      guidance: 'Ben buradayım.',
      speaker: 'findik',
    },
    estimatedSeconds: 20,
    maxTouches: 1,
    atmosphere: {
      season: 'sonbahar',
      worldCue: 'Sıcak ışık (FX010). Fındık küçük gülümser (AN006) ve hafif baş sallar (AN007). Soft bell (SFX006).',
    },
    soundBudget: {
      ambient: 'orman_sessiz',
      character: 'findik_guven',
      interaction: 'karar_dalga',
      success: 'SFX006_soft_bell',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel:
      'Fındık Sincap güvenle gülümsüyor. Puan veya ödül yok; yalnızca sıcak bir teşekkür.',
  },

  // ── SAHNE 3 — Palamutları keşfetme ─────────────────────────
  {
    id: 'scene03',
    order: 4,
    title: 'Palamutları Keşfet',
    storyToken: 'story.discover',
    motionToken: 'motion.softBounce',
    discoveryBelongsToChild: true,
    worldCelebration: true,
    behaviorBeforeSpeech: true,
    waitIsTeaching: true,
    curiosityBeforeConcept: true,
    pedagogicalGoal:
      '1–4 perceptual subitizing (MB-280): sayma istemez, sayaç göstermez. ' +
      'Keşif anı çocuğa aittir (MB-274). CPA concrete (MB-283). Merak önce (MB-279).',
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
      /** MB-280: 1–4’te sayı sayacı gösterilmez. */
      revealCount: false,
    },
    aiObservation: {
      concept: 'subitize_toplama',
      signals: ['touch_latency', 'subitize_attempt', 'visual_focus', 'reflection_time'],
      misconceptions: ['ayni_nesneye_tekrar_dokunma', 'nesne_atlama'],
    },
    feedback: {
      positive: 'Sen buldun — hepsini topladın.',
      guidance: 'Dokunmadığın bir palamut kalmış olabilir, bir daha bak.',
      speaker: 'findik',
    },
    estimatedSeconds: 30,
    maxTouches: 3,
    soundBudget: {
      ambient: 'orman_hafif',
      character: 'findik_tesvik',
      interaction: 'palamut_topla',
      success: 'sepet_doluyor',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    replay: { emojiPool: PALAMUT_POOL },
    accessibilityLabel: 'Üç palamut var. Her birine dokunarak topluyorsun.',
  },

  // ── SAHNE 4 — İki grubu inceleme ───────────────────────────
  {
    id: 'scene04',
    order: 5,
    title: 'İki Kovayı İncele',
    storyToken: 'story.notice',
    motionToken: 'motion.deepBreath',
    pedagogicalGoal:
      'Karşılaştırma öncesi gözlem (MB-269/284): önce gör. 5 conceptual (3+2), 3 perceptual. ' +
      'Davranışla soru (MB-277); beklemek öğretim (MB-278).',
    worldFeedback: true,
    worldCelebration: true,
    behaviorBeforeSpeech: true,
    waitIsTeaching: true,
    curiosityBeforeConcept: true,
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
      signals: ['touch_latency', 'wait_time', 'observe_pattern', 'visual_focus', 'grouping_strategy'],
      misconceptions: [],
    },
    feedback: {
      positive: 'İyi gözlem! Kovalar birbirinden farklı görünüyor.',
      guidance: 'Diğer kovaya da bakmak ister misin?',
      speaker: 'bilge',
    },
    estimatedSeconds: 30,
    maxTouches: 3,
    soundBudget: {
      ambient: 'orman_hafif',
      character: 'bilge_merak',
      interaction: 'kova_bak',
      success: 'gozlem_tik',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel:
      'İki kova. Biri daha dolu görünüyor; saymadan bakıyorsun.',
  },

  // ── SAHNE 5 — Birebir eşleştirme ───────────────────────────
  {
    id: 'scene05',
    order: 6,
    title: 'Birebir Eşleştir',
    storyToken: 'story.discover',
    motionToken: 'motion.softBounce',
    pedagogicalGoal:
      'Sayı saymadan karşılaştırma (MB-269/280): birebir eşleştirme artan tarafı sezdirir. ' +
      'CPA concrete (MB-283). Hata söylenmez (MB-272). Keşif çocuğa ait (MB-274).',
    worldFeedback: true,
    discoveryBelongsToChild: true,
    worldCelebration: true,
    behaviorBeforeSpeech: true,
    waitIsTeaching: true,
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
      leftoverLine:
        'Bak! Kırmızı kovada eşi olmayan palamutlar kaldı. Demek ki orada daha çok var.',
    },
    aiObservation: {
      concept: 'birebir_eslestirme',
      signals: ['touch_latency', 'retry_count', 'success_trend', 'visual_focus'],
      misconceptions: ['eslesmeyi_tamamlamadan_karar_verme'],
    },
    feedback: {
      positive: 'Eşleştirmeyi tamamladın!',
      guidance: 'Eşleştirmeye devam edelim, sonunda bir şey fark edeceksin.',
      speaker: 'bilge',
    },
    estimatedSeconds: 45,
    maxTouches: 3,
    soundBudget: {
      ambient: 'sessiz_bahce',
      character: 'bilge_yonlendir',
      interaction: 'eslestirme_tik',
      success: 'artan_isik',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel:
      'Palamutları birebir eşleştiriyorsun; kırmızı kovada artan palamutlar kalıyor.',
  },

  // ── SAHNE 6 — Daha fazla (eşleştirme sonrası doğrulama) ────
  {
    id: 'scene06',
    order: 7,
    title: 'Daha Çok Olan',
    storyToken: 'story.notice',
    motionToken: 'motion.observe',
    pedagogicalGoal:
      '"Daha çok"u eşleştirme deneyiminin üzerine oturtmak (MB-269/284). ' +
      '3 perceptual saydırılmaz (MB-280); 5 conceptual alt grup (MB-281). ' +
      'Merak/gözlem sonrası isimlendirme (MB-279). Süreç > sonuç (MB-276).',
    worldFeedback: true,
    worldCelebration: true,
    curiosityBeforeConcept: true,
    waitIsTeaching: true,
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
        'Kırmızı kovadaki yığına bir daha bak, sonra mavi kovadakine.',
      ],
      /** MB-280: grupta 1–4 varken sayı asla görünmez. */
      countVisibility: 'never',
    },
    aiObservation: {
      concept: 'daha_cok',
      signals: [
        'first_choice',
        'retry_count',
        'error_type',
        'hesitation',
        'subitize_attempt',
        'grouping_strategy',
        'visual_focus',
        'reflection_time',
      ],
      misconceptions: ['az_ile_cok_karistirma', 'buyuk_gorunen_secme'],
    },
    feedback: {
      positive: 'Evet! Kırmızı kovada daha çok palamut var.',
      guidance: 'Birlikte tekrar bakalım. Eşleştirdiğimizde nerede fazla kalmıştı?',
      speaker: 'findik',
    },
    estimatedSeconds: 40,
    maxTouches: 3,
    soundBudget: {
      ambient: 'orman_hafif',
      character: 'findik_soru',
      interaction: 'secim_tik',
      success: 'basari_yildiz',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel: 'Daha çok palamut olan kovayı seçiyorsun.',
  },

  // ── SAHNE 7 — Daha az ──────────────────────────────────────
  {
    id: 'scene07',
    order: 8,
    title: 'Daha Az Olan',
    storyToken: 'story.notice',
    motionToken: 'motion.observe',
    pedagogicalGoal:
      '"Daha az"ı "daha çok"un karşıtı olarak kurmak (MB-269/284). ' +
      'Sayma dili yok; görsel yığın karşılaştırması (MB-280).',
    worldFeedback: true,
    worldCelebration: true,
    waitIsTeaching: true,
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
        'Daha az demek, daha küçük yığın demek. Hangisi daha küçük görünüyor?',
        'Kırmızıdaki yığına bir bak, sonra mavidekine. Hangisi daha ufak?',
      ],
      countVisibility: 'never',
    },
    aiObservation: {
      concept: 'daha_az',
      signals: [
        'first_choice',
        'retry_count',
        'error_type',
        'subitize_attempt',
        'visual_focus',
      ],
      misconceptions: ['az_ile_cok_ters_cevirme'],
    },
    feedback: {
      positive: 'Evet... Mavi kovada daha az palamut var.',
      guidance: 'Bu kez daha küçük olanı arıyoruz. Hangisi daha küçük?',
      speaker: 'bilge',
    },
    estimatedSeconds: 40,
    maxTouches: 3,
    soundBudget: {
      ambient: 'orman_hafif',
      character: 'bilge_soru',
      interaction: 'secim_tik',
      success: 'basari_yildiz',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel: 'Daha az palamut olan kovayı seçiyorsun.',
  },

  // ── SAHNE 8 — Eşit ─────────────────────────────────────────
  {
    id: 'scene08',
    order: 9,
    title: 'Eşit Olunca',
    storyToken: 'story.discover',
    motionToken: 'motion.softBounce',
    pedagogicalGoal:
      '"Eşit"i birebir eşleştirmede artan olmaması olarak kurmak (MB-269/284). ' +
      'Her iki taraf 5 — conceptual subitizing / alt grup (MB-281).',
    worldFeedback: true,
    worldCelebration: true,
    waitIsTeaching: true,
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
      /** İsimlendirme aşaması — yalnızca 5+ (perceptual yok). */
      countVisibility: 'after_attempt',
    },
    aiObservation: {
      concept: 'esit',
      signals: [
        'first_choice',
        'retry_count',
        'error_type',
        'grouping_strategy',
        'observe_pattern',
      ],
      misconceptions: ['esitligi_fark_etmeme', 'kova_boyutuna_bakma'],
    },
    feedback: {
      positive: 'Evet! İkisi de eşit. Hiç artan palamut yok.',
      guidance: 'Eşleştirdiğimizde artan kalmıyorsa buna eşit deriz.',
      speaker: 'findik',
    },
    estimatedSeconds: 40,
    maxTouches: 3,
    soundBudget: {
      ambient: 'orman_hafif',
      character: 'findik_merak',
      interaction: 'secim_tik',
      success: 'esit_isik',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel: 'İki kovada da beş palamut var; eşit olduğunu seçiyorsun.',
  },

  // ── SAHNE 9 — Kutlama ──────────────────────────────────────
  {
    id: 'scene09',
    order: 10,
    title: 'Kış Hazır!',
    storyToken: 'story.proud',
    motionToken: 'motion.deepBreath',
    /** Karar 275 — dünya kutlar; pop-up / yıldız yağmuru yok. */
    worldCelebration: true,
    worldFeedback: true,
    pedagogicalGoal:
      'Emeği görünür kılmak (MB-274/275/276). Puan yok; dünya ve Fındık kutlar.',
    targetEmotion: 'nese',
    opening: {
      visual: '❄️',
      line: 'Kış hazırlığım tamamlandı! Sensiz yapamazdım.',
      speaker: 'findik',
      animation: 'rise',
    },
    interaction: {
      kind: 'celebrate',
      title: "Fındık'ın kışı güvende!",
      message:
        'Birlikte baktın, topladın, eşleştirdin ve karşılaştırdın. Fındık artık kışa hazır.',
      /** Arayüz ödülü kullanılmaz (MB-275); alan geriye dönük uyumluluk için boş. */
      reward: '',
    },
    aiObservation: {
      concept: 'tamamlama',
      signals: ['success_trend', 'reflection_time'],
      misconceptions: [],
    },
    feedback: {
      positive: 'Yarın yine gelir misin? Sana ormanı gezdireceğim.',
      guidance: '',
      speaker: 'findik',
    },
    estimatedSeconds: 20,
    maxTouches: 1,
    atmosphere: {
      season: 'kis',
      worldCue: 'Yumuşak kış ışığı; Fındık gülümser, yapraklar sakin — arayüz kutlamaz.',
    },
    soundBudget: {
      ambient: 'kis_isik',
      character: 'findik_tesekkur',
      interaction: 'tamamla_dokunus',
      success: 'yaprak_yildiz',
    },
    visualComposition: { world: 70, interaction: 20, ui: 10 },
    accessibilityLabel: 'Macera tamamlandı. Fındık kışa hazır ve sana teşekkür ediyor.',
  },
];
