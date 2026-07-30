/**
 * MBA-QA-001 — Quality Gate Registry (LS-011 prep exposure).
 * Observation-only AI; no grading / adaptive pressure.
 */

import { runLs011PrepQa, type Ls011PrepQaResult } from '@/qa/ls011-prep-qa';
import { assertMbaToken001Registry } from './token-001';
import { assertMbaCharDna001Registry } from './char-dna-001';
import { assertMbaMotion001Registry } from './motion-001';
import {
  OBSERVE_COMPARE_V2_POLICY,
  type ObserveCompareV2Payload,
  serializeObserveCompareV2,
} from '@/ai/analytics';
import { SILENT_MODE_POLICY } from '@/core/accessibility';
import { assertLs011PerfContract } from '@/design-tokens/performance';

export const MBA_QA_001 = 'MBA-QA-001' as const;

/**
 * LS-011 Quality Gate checklist (engine update).
 * □ World feels calm
 * □ Child never feels rushed
 * □ Story Token transitions are invisible
 * □ Eye contact feels natural
 * □ Motion loops contain no visible jump
 * □ AI never interrupts
 * □ Accessibility preserved
 */
export const LS011_QA_CHECKLIST_KEYS = [
  'worldFeelsCalm',
  'childNeverRushed',
  'storyTransitionsInvisible',
  'eyeContactNatural',
  'motionLoopsNoVisibleJump',
  'aiNeverInterrupts',
  'accessibilityPreserved',
] as const;

export type Ls011QaChecklistKey = (typeof LS011_QA_CHECKLIST_KEYS)[number];

export function runMbaQa001Gate(): Ls011PrepQaResult & {
  registriesOk: boolean;
  observationOnly: boolean;
  perfOk: boolean;
} {
  const prep = runLs011PrepQa();
  const registriesOk =
    assertMbaToken001Registry() &&
    assertMbaCharDna001Registry() &&
    assertMbaMotion001Registry();
  const observationOnly =
    OBSERVE_COMPARE_V2_POLICY.noChildIdentity &&
    OBSERVE_COMPARE_V2_POLICY.noProfileCreation &&
    OBSERVE_COMPARE_V2_POLICY.noGrading &&
    OBSERVE_COMPARE_V2_POLICY.noAdaptivePressure &&
    OBSERVE_COMPARE_V2_POLICY.observationOnly;
  const perfOk = assertLs011PerfContract();
  const a11y =
    SILENT_MODE_POLICY.animationIsPrimaryChannel &&
    SILENT_MODE_POLICY.meaningNeverDependsOnSound;

  const sample: ObserveCompareV2Payload = {
    firstViewedGroup: 'g1',
    firstTouchedGroup: 'g2',
    decisionTime: 1000,
    wrongTouchCount: 0,
    idleTime: 500,
    comparisonStrategy: 'unknown',
  };
  const anon = !serializeObserveCompareV2(sample).includes('@');

  return {
    ...prep,
    registriesOk,
    observationOnly,
    perfOk,
    ok: prep.ok && registriesOk && observationOnly && perfOk && a11y && anon,
  };
}

export function assertMbaQa001Registry(): boolean {
  return runMbaQa001Gate().ok;
}
