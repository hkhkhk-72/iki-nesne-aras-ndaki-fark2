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
  | 'story.discover'
  /** LS-011 prep — uzun düşünme; dünya sakinleşir. */
  | 'story.thinking.deep';

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
    cue: 'Yaprak kıpırdar, sepet yukarı — pop-up / yıldız yağmuru yok (MB-275)',
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
  /** LS-011 prep — uzun gözlem sonrası derin düşünme; psikolojik güvenlik. */
  'story.thinking.deep': {
    id: 'story.thinking.deep',
    emotion: 'derin düşünme',
    childFeel: 'Acele yok; güvendeyim; düşünebilirim.',
    cue:
      'Long observation without interaction · world slows · wind softer · ' +
      'leaves almost stop · FN-001 waits calmly · BO-001 completely silent · ' +
      'no instructional hints · no pressure · psychological safety · ' +
      'motion.look_back_child · anim.deep_breath',
  },
};
