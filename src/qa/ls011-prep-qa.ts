/**
 * LS-011 Preparation QA — GRP-001.
 * Yeni gameplay yok; altyapı sözleşmesi kontrolü.
 */

import { storyTokens, motionTokens, aiTokens } from '@/design-tokens';
import {
  ASSETS,
  FX_soft_bounce,
  FX_SOFT_BOUNCE_SPEC,
  DEEP_BREATH_IDLE_AFTER_MS,
  LS011_PREP_ASSETS,
} from '@/world/assets';
import { FINDIK_DEEP_THINKING_STATE } from '@/world/character-states';
import {
  SILENT_MODE_POLICY,
  animationMeaningPreservedWhenSilent,
  meaningWithoutSound,
} from '@/core/accessibility';
import {
  serializeObserveCompareV2,
  type ObserveCompareV2Payload,
} from '@/ai/analytics';

export interface Ls011PrepQaResult {
  ok: boolean;
  checklist: Record<string, boolean>;
  issues: string[];
}

/**
 * Ürün QA maddeleri:
 * □ Dünya dikkat dağıtıyor mu?
 * □ Çocuk acele hissediyor mu?
 * □ AI gereksiz yardım ediyor mu?
 * □ Motion doğal mı?
 * □ Story Token doğru çalışıyor mu?
 */
export function runLs011PrepQa(): Ls011PrepQaResult {
  const issues: string[] = [];

  const storyOk = 'story.thinking.deep' in storyTokens;
  if (!storyOk) issues.push('story.thinking.deep eksik');

  const story = storyTokens['story.thinking.deep'];
  const storyCueOk =
    Boolean(story?.cue.includes('Bilge konuşmaz')) &&
    Boolean(story?.cue.includes('rüzgar'));
  if (!storyCueOk) issues.push('story.thinking.deep cue eksik (Bilge/rüzgar)');

  const look = motionTokens['motion.look_back_child'];
  const motionOk =
    look?.kind === 'character_loop' &&
    look.loopMs === 6000 &&
    look.durationMs === 6000;
  if (!motionOk) issues.push('motion.look_back_child 6s loop bekleniyor');

  const animOk = FINDIK_DEEP_THINKING_STATE.anims.includes('anim.deep_breath');
  if (!animOk) issues.push('anim.deep_breath karakter durumunda yok');

  const idleOk = DEEP_BREATH_IDLE_AFTER_MS === 5000;
  if (!idleOk) issues.push('anim.deep_breath idle eşiği 5000ms olmalı');

  const fxOk =
    FX_soft_bounce.id === 'FX011' &&
    FX_soft_bounce.alias === 'FX_soft_bounce' &&
    FX_SOFT_BOUNCE_SPEC.scalePeak === 1.04 &&
    FX_SOFT_BOUNCE_SPEC.durationMs === 200 &&
    ASSETS.FX011.name === 'Soft Bounce';
  if (!fxOk) issues.push('FX_soft_bounce (FX011) spec uyumsuz');

  const aiOk = 'ai.observe_compare_v2' in aiTokens;
  if (!aiOk) issues.push('ai.observe_compare_v2 token eksik');

  const sample: ObserveCompareV2Payload = {
    firstLookedGroupId: 'g_a',
    firstTouchedGroupId: 'g_b',
    decisionMs: 4200,
    exploreTouchCount: 1,
    waitMs: 3000,
  };
  const serialized = serializeObserveCompareV2(sample);
  const anonOk =
    !serialized.toLowerCase().includes('name=') &&
    !serialized.includes('@') &&
    serialized.includes('look=g_a') &&
    serialized.includes('explore=1');
  if (!anonOk) issues.push('observe_compare_v2 anonim serileştirme hatalı');

  const a11yOk =
    SILENT_MODE_POLICY.soundOffKeepsAnimationMeaning === true &&
    animationMeaningPreservedWhenSilent({ soundEnabled: false }) === true &&
    meaningWithoutSound({ storyId: 'story.thinking.deep' }).length > 0;
  if (!a11yOk) issues.push('Ses kapalı mod anlam koruması eksik');

  const assetsOk = LS011_PREP_ASSETS.length === 2 && ASSETS.AN008.alias === 'anim.deep_breath';
  if (!assetsOk) issues.push('LS-011 prep asset listesi eksik');

  // Ürün checklist — altyapı varsayımları (gameplay henüz yok)
  const checklist = {
    worldNotDistracting: storyCueOk && Boolean(story?.cue.includes('sakin')),
    childNoRush: Boolean(story?.childFeel.includes('Acele yok')),
    aiNoUnnecessaryHelp: Boolean(story?.cue.includes('Bilge konuşmaz')),
    motionNatural: motionOk && fxOk,
    storyTokenCorrect: storyOk && storyCueOk,
    silentKeepsMeaning: a11yOk,
    observeCompareV2Anon: anonOk && aiOk,
    deepBreathIdle: animOk && idleOk,
    softBounceFx: fxOk,
    assetsRegistered: assetsOk,
  };

  for (const [key, val] of Object.entries(checklist)) {
    if (!val) issues.push(`checklist.${key} başarısız`);
  }

  return {
    ok: issues.length === 0 && Object.values(checklist).every(Boolean),
    checklist,
    issues,
  };
}
