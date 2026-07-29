/**
 * Story Tokens — sahnenin duygusal hedefi.
 * Experience Blueprint / GRS-001 ile hizalı.
 */

export type StoryTokenId =
  | 'story.safe'
  | 'story.curious'
  | 'story.help'
  | 'story.excited'
  | 'story.calm'
  | 'story.proud'
  | 'story.together'
  | 'story.trust'
  | 'story.observe'
  | 'story.notice'
  | 'story.discover';

export interface StoryToken {
  id: StoryTokenId;
  emotion: string;
  /** Çocuk ne hissetmeli */
  childFeel: string;
  /** UI / animasyon ipucu */
  cue: string;
}

export const storyTokens: Record<StoryTokenId, StoryToken> = {
  'story.safe': {
    id: 'story.safe',
    emotion: 'güven',
    childFeel: 'Burada güvendeyim.',
    cue: 'Yumuşak ışık, yavaş giriş, baskısız CTA',
  },
  'story.curious': {
    id: 'story.curious',
    emotion: 'merak',
    childFeel: 'Ne olacak acaba?',
    cue: 'Hafif parıltı, soru odaklı replik',
  },
  'story.help': {
    id: 'story.help',
    emotion: 'yardım',
    childFeel: "Fındık'ın bana ihtiyacı var.",
    cue: 'Tek CTA: Bana Yardım Et',
  },
  'story.excited': {
    id: 'story.excited',
    emotion: 'sevinç',
    childFeel: 'Birlikte başardık.',
    cue: 'Yaprak / yıldız FX, sepet yukarı',
  },
  'story.calm': {
    id: 'story.calm',
    emotion: 'sakinlik',
    childFeel: 'Acele yok.',
    cue: 'Düşük ses, yavaş tempo',
  },
  'story.proud': {
    id: 'story.proud',
    emotion: 'gurur',
    childFeel: 'Ben yaptım.',
    cue: 'Süreç övgüsü; puan yok',
  },
  'story.together': {
    id: 'story.together',
    emotion: 'ortaklık',
    childFeel: 'Bilge yanımda.',
    cue: 'Bilge sıcak ton; yargı yok',
  },
  'story.trust': {
    id: 'story.trust',
    emotion: 'güven',
    childFeel: 'Kararım değerli; Fındık bana güveniyor.',
    cue: 'Küçük gülümseme, sıcak ışık, yumuşak zil — puan/ödül yok',
  },
  'story.observe': {
    id: 'story.observe',
    emotion: 'gözlem',
    childFeel: 'Bakıyorum… acele yok.',
    cue: 'FN Observe; motion.observe; sessiz bakış',
  },
  'story.notice': {
    id: 'story.notice',
    emotion: 'fark etme',
    childFeel: 'Bir şey fark ettim.',
    cue: 'FN Think; hafif parıltı; sayı yok',
  },
  'story.discover': {
    id: 'story.discover',
    emotion: 'keşif',
    childFeel: 'Keşfettim / davet edildim.',
    cue: 'FN Invite; motion.softBounce',
  },
};
