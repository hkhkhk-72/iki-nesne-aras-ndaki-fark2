/**
 * LS-011 Preparation QA — GRP-001 / MBA-QA-001.
 * Yeni gameplay yok; altyapı sözleşmesi kontrolü.
 */

import {
  storyTokens,
  motionTokens,
  aiTokens,
  LOOK_BACK_CHILD_SEQUENCE,
  LOOK_BACK_CHILD_TOTAL_MS,
  assertLs011PerfContract,
  LS011_PERF,
} from '@/design-tokens';
import {
  ASSETS,
  FX_soft_bounce,
  FX_SOFT_BOUNCE_SPEC,
  DEEP_BREATH_IDLE_AFTER_MS,
  DEEP_BREATH_SPEC,
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
  OBSERVE_COMPARE_V2_POLICY,
  type ObserveCompareV2Payload,
} from '@/ai/analytics';

export interface Ls011PrepQaResult {
  ok: boolean;
  checklist: Record<string, boolean>;
  issues: string[];
}

/**
 * Engine Quality Gate:
 * □ World feels calm
 * □ Child never feels rushed
 * □ Story Token transitions are invisible
 * □ Eye contact feels natural
 * □ Motion loops contain no visible jump
 * □ AI never interrupts
 * □ Accessibility preserved
 */
export function runLs011PrepQa(): Ls011PrepQaResult {
  const issues: string[] = [];

  const storyOk = 'story.thinking.deep' in storyTokens;
  if (!storyOk) issues.push('story.thinking.deep eksik');

  const story = storyTokens['story.thinking.deep'];
  const storyCueOk =
    Boolean(story?.cue.includes('FN-001')) &&
    Boolean(story?.cue.includes('BO-001')) &&
    Boolean(story?.cue.includes('no pressure')) &&
    Boolean(story?.cue.includes('psychological safety'));
  if (!storyCueOk) issues.push('story.thinking.deep cue eksik (FN/BO/safety)');

  const look = motionTokens['motion.look_back_child'];
  const sequenceOk =
    LOOK_BACK_CHILD_TOTAL_MS === 6000 &&
    LOOK_BACK_CHILD_SEQUENCE.length === 5 &&
    LOOK_BACK_CHILD_SEQUENCE[0].target === 'child' &&
    LOOK_BACK_CHILD_SEQUENCE[1].target === 'basket' &&
    LOOK_BACK_CHILD_SEQUENCE[2].target === 'child' &&
    LOOK_BACK_CHILD_SEQUENCE[3].target === 'smile' &&
    LOOK_BACK_CHILD_SEQUENCE[3].id === 'small_smile' &&
    LOOK_BACK_CHILD_SEQUENCE[4].target === 'basket';
  const motionOk =
    look?.kind === 'character_loop' &&
    look.loopMs === 6000 &&
    look.durationMs === 6000 &&
    sequenceOk;
  if (!motionOk) issues.push('motion.look_back_child 6s sequence bekleniyor');

  const animOk = FINDIK_DEEP_THINKING_STATE.anims.includes('anim.deep_breath');
  if (!animOk) issues.push('anim.deep_breath karakter durumunda yok');

  const idleOk =
    DEEP_BREATH_IDLE_AFTER_MS === 5000 &&
    DEEP_BREATH_SPEC.amplitude === 'extremely_small' &&
    DEEP_BREATH_SPEC.neverExaggerated &&
    DEEP_BREATH_SPEC.chestScalePeak <= 1.03 &&
    DEEP_BREATH_SPEC.returnToIdleMs > 0;
  if (!idleOk) issues.push('anim.deep_breath amplitude / return-to-idle spec eksik');

  const fxOk =
    FX_soft_bounce.id === 'FX011' &&
    FX_soft_bounce.alias === 'FX_soft_bounce' &&
    FX_SOFT_BOUNCE_SPEC.scalePeak === 1.04 &&
    FX_SOFT_BOUNCE_SPEC.durationMs === 200 &&
    FX_SOFT_BOUNCE_SPEC.easing === 'easeOutQuad' &&
    FX_SOFT_BOUNCE_SPEC.trigger === 'touch_collectible_object';
  if (!fxOk) issues.push('FX_soft_bounce (FX011) spec uyumsuz');

  const aiOk = 'ai.observe_compare_v2' in aiTokens;
  if (!aiOk) issues.push('ai.observe_compare_v2 token eksik');

  const policyOk =
    OBSERVE_COMPARE_V2_POLICY.observationOnly &&
    OBSERVE_COMPARE_V2_POLICY.noChildIdentity &&
    OBSERVE_COMPARE_V2_POLICY.noProfileCreation &&
    OBSERVE_COMPARE_V2_POLICY.noGrading &&
    OBSERVE_COMPARE_V2_POLICY.noAdaptivePressure;
  if (!policyOk) issues.push('observe_compare_v2 observation-only politika eksik');

  const sample: ObserveCompareV2Payload = {
    firstViewedGroup: 'g_a',
    firstTouchedGroup: 'g_b',
    decisionTime: 4200,
    wrongTouchCount: 1,
    idleTime: 3000,
    comparisonStrategy: 'scan_both',
  };
  const serialized = serializeObserveCompareV2(sample);
  const anonOk =
    !serialized.toLowerCase().includes('name=') &&
    !serialized.includes('@') &&
    serialized.includes('firstViewedGroup=g_a') &&
    serialized.includes('comparisonStrategy=scan_both');
  if (!anonOk) issues.push('observe_compare_v2 anonim serileştirme hatalı');

  const a11yOk =
    SILENT_MODE_POLICY.soundOffKeepsAnimationMeaning &&
    SILENT_MODE_POLICY.animationIsPrimaryChannel &&
    SILENT_MODE_POLICY.audioOptional &&
    SILENT_MODE_POLICY.meaningNeverDependsOnSound &&
    animationMeaningPreservedWhenSilent({ soundEnabled: false }) &&
    meaningWithoutSound({ storyId: 'story.thinking.deep' }).length > 0;
  if (!a11yOk) issues.push('Silent Mode a11y eksik');

  const perfOk =
    assertLs011PerfContract() &&
    LS011_PERF.targetFps === 60 &&
    LS011_PERF.zeroAllocationsDuringIdleLoop;
  if (!perfOk) issues.push('LS-011 performans (60fps / zero idle alloc) eksik');

  const assetsOk = LS011_PREP_ASSETS.length === 2 && ASSETS.AN008.alias === 'anim.deep_breath';
  if (!assetsOk) issues.push('LS-011 prep asset listesi eksik');

  const checklist = {
    worldFeelsCalm:
      storyCueOk && Boolean(story?.cue.includes('leaves almost stop')),
    childNeverRushed:
      Boolean(story?.childFeel.includes('Acele yok')) &&
      Boolean(story?.cue.includes('no pressure')),
    storyTransitionsInvisible: storyOk && storyCueOk,
    eyeContactNatural: motionOk && sequenceOk,
    motionLoopsNoVisibleJump: motionOk && LOOK_BACK_CHILD_TOTAL_MS === 6000,
    aiNeverInterrupts:
      Boolean(story?.cue.includes('BO-001')) &&
      Boolean(story?.cue.includes('silent')) &&
      policyOk,
    accessibilityPreserved: a11yOk,
    observeCompareV2Anon: anonOk && aiOk && policyOk,
    deepBreathIdle: animOk && idleOk,
    softBounceFx: fxOk,
    performance60fps: perfOk,
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
