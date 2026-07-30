/**
 * MBA-LIFE-001 Foundation QA — Infrastructure Integrated.
 * No gameplay / educational / UI changes.
 */

import {
  LIFE_LAYERS,
  LIFE_TOKEN_GROUPS,
  lifeTokens,
  LIFE_TOKEN_NAMESPACE,
  IDLE_VARIATION_RULES,
} from '@/design-tokens/life';
import { assertMbaLife001Registry, MBA_LIFE_001, MBA_LIFE_001_PURPOSE } from '@/mba/life-001';
import { assertLayeredIdleSupport, assertLayersNonBlocking } from '@/life/layers';
import { assertRandomSchedulerContract, createSeededRandom } from '@/life/random-scheduler';
import { assertLifePerfContract, LIFE_PERF } from '@/life/performance';
import { assertLifeForbiddenRules, LIFE_EYE_CONTACT_MAX_MS } from '@/life/forbidden';
import { assertEmotionBridge } from '@/life/engine/EmotionBridge';
import { assertAiWeightController } from '@/life/engine/AIWeightController';
import { createCharacterLifeEngine } from '@/life/engine/CharacterLifeEngine';
import { SILENT_MODE_POLICY } from '@/core/accessibility';

export interface LifePrepQaResult {
  ok: boolean;
  checklist: Record<string, boolean>;
  issues: string[];
}

export function runMbaLife001PrepQa(): LifePrepQaResult {
  const issues: string[] = [];

  const namespaceOk = LIFE_TOKEN_NAMESPACE === 'life.' && LIFE_TOKEN_GROUPS.length === 10;
  if (!namespaceOk) issues.push('life.* 10 subgroup rezervasyonu eksik');

  const tokensOk =
    'life.eye.saccade' in lifeTokens &&
    'life.eye.contact' in lifeTokens &&
    lifeTokens['life.eye.contact'].timing?.maxDurationMs === 1200 &&
    'life.face.thinking' in lifeTokens &&
    'life.breath.idle' in lifeTokens &&
    lifeTokens['life.breath.idle'].timing?.cycleMs === 5000 &&
    'life.tail.soft' in lifeTokens &&
    'life.ear.listen' in lifeTokens &&
    'life.focus.child' in lifeTokens &&
    'life.focus.object' in lifeTokens;
  if (!tokensOk) issues.push('Foundation life tokens eksik');

  const layersOk =
    assertLayeredIdleSupport() &&
    assertLayersNonBlocking() &&
    LIFE_LAYERS.length === 9;
  if (!layersOk) issues.push('9 bağımsız katman / non-blocking eksik');

  const randomOk = assertRandomSchedulerContract();
  const seedA = createSeededRandom(99)();
  const seedB = createSeededRandom(99)();
  const seedOk = seedA === seedB;
  if (!randomOk || !seedOk) issues.push('weighted random / deterministic seed başarısız');

  const idleVarOk = IDLE_VARIATION_RULES.maxIdenticalSequence === 1;
  if (!idleVarOk) issues.push('idle variation maxIdenticalSequence≠1');

  const emotionOk = assertEmotionBridge();
  if (!emotionOk) issues.push('Story↔Life emotion bridge eksik');

  const aiOk = assertAiWeightController();
  if (!aiOk) issues.push('AI weight controller (probabilities only) eksik');

  const forbiddenOk =
    assertLifeForbiddenRules() && LIFE_EYE_CONTACT_MAX_MS === 1200;
  if (!forbiddenOk) issues.push('forbidden rules eksik');

  const a11yOk =
    SILENT_MODE_POLICY.animationIsPrimaryChannel &&
    SILENT_MODE_POLICY.meaningNeverDependsOnSound;
  if (!a11yOk) issues.push('a11y movement-primary eksik');

  const perfOk =
    assertLifePerfContract() &&
    LIFE_PERF.maxSimultaneousAnimations === 9 &&
    LIFE_PERF.animationPoolingEnabled;
  if (!perfOk) issues.push('LIFE_PERF foundation eksik');

  const engineOk = createCharacterLifeEngine().assertInfrastructure();
  if (!engineOk) issues.push('CharacterLifeEngine infrastructure eksik');

  const registryOk = assertMbaLife001Registry();
  if (!registryOk) issues.push(`${MBA_LIFE_001} registry başarısız`);

  const purposeOk = MBA_LIFE_001_PURPOSE.includes('organic');
  if (!purposeOk) issues.push('purpose organic eksik');

  const checklist = {
    lifeNamespace10Groups: namespaceOk,
    foundationLifeTokens: tokensOk,
    nineLayersNonBlocking: layersOk,
    weightedRandomWithSeed: randomOk && seedOk,
    idleNeverIdentical: idleVarOk,
    storyEmotionBridge: emotionOk,
    aiProbabilitiesOnly: aiOk,
    forbiddenRules: forbiddenOk,
    accessibilityMovementPrimary: a11yOk,
    performance9LayersPooling: perfOk,
    characterLifeEngine: engineOk,
    mbaLife001Registered: registryOk,
    organicNotScripted: purposeOk,
    infrastructureOnly: true,
  };

  for (const [k, v] of Object.entries(checklist)) {
    if (!v) issues.push(`checklist.${k} başarısız`);
  }

  return {
    ok: issues.length === 0 && Object.values(checklist).every(Boolean),
    checklist,
    issues,
  };
}
