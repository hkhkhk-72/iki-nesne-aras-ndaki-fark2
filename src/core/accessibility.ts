/**
 * Erişilebilirlik politikası — LS-011 prep.
 *
 * Silent Mode: tüm duygusal anlam ses olmadan anlaşılır kalır.
 * Animasyonlar birincil iletişim kanalıdır.
 */

import type { AppSettings } from '@/core/settings-store';
import { storyTokens, type StoryTokenId } from '@/design-tokens/story';
import { motionTokens, type MotionTokenId } from '@/design-tokens/motion';

/** Ses kapalıyken anlam koruma kuralı (ürün). */
export const SILENT_MODE_POLICY = {
  id: 'a11y.silent_keeps_meaning' as const,
  rule:
    'Silent Mode: all emotional meaning remains understandable without audio. ' +
    'Animations become the primary communication channel.',
  soundOffKeepsAnimationMeaning: true as const,
  /** Animasyon birincil kanal; ses destekleyicidir. */
  animationIsPrimaryChannel: true as const,
};

/**
 * Ses kapalı mı? (soundEnabled === false)
 */
export function isSilentMode(settings: Pick<AppSettings, 'soundEnabled'>): boolean {
  return settings.soundEnabled === false;
}

/**
 * Ses kapalı olsa bile story + motion anlamı korunur.
 * Ekran okuyucu / altyazı için metin üretir.
 */
export function meaningWithoutSound(opts: {
  storyId?: StoryTokenId;
  motionId?: MotionTokenId;
  fallback?: string;
}): string {
  const parts: string[] = [];
  if (opts.storyId && opts.storyId in storyTokens) {
    parts.push(storyTokens[opts.storyId].childFeel);
  }
  if (opts.motionId && opts.motionId in motionTokens) {
    const m = motionTokens[opts.motionId];
    parts.push(
      m.kind === 'character_loop'
        ? 'Fındık bakışını sürdürüyor; acele yok.'
        : 'Hareket aynı anlamı taşıyor.',
    );
  }
  if (parts.length === 0) {
    return opts.fallback ?? SILENT_MODE_POLICY.rule;
  }
  return parts.join(' ');
}

/** Soft bounce / deep breath — ses yokken de görsel anlam geçerli. */
export function animationMeaningPreservedWhenSilent(
  settings: Pick<AppSettings, 'soundEnabled'>,
): boolean {
  void settings;
  return (
    SILENT_MODE_POLICY.soundOffKeepsAnimationMeaning &&
    SILENT_MODE_POLICY.animationIsPrimaryChannel
  );
}
