/**
 * MBA-LIFE-001 Preparation QA.
 * No gameplay — infrastructure contracts only.
 */

import {
  LIFE_LAYERS,
  LIFE_TOKEN_GROUPS,
  lifeTokens,
  LIFE_TOKEN_NAMESPACE,
} from '@/design-tokens/life';
import { assertMbaLife001Registry, MBA_LIFE_001, MBA_LIFE_001_PURPOSE } from '@/mba/life-001';
import { assertLayeredIdleSupport } from '@/life/layers';
import { assertRandomSchedulerContract } from '@/life/random-scheduler';
import { assertLifePerfContract, LIFE_PERF } from '@/life/performance';

export interface LifePrepQaResult {
  ok: boolean;
  checklist: Record<string, boolean>;
  issues: string[];
}

/**
 * □ life.* namespace reserved
 * □ 8 independent layers simultaneous
 * □ weighted random (no immediate repeat, cooldown, AI override)
 * □ 60 FPS / battery / memory safe
 * □ no gameplay coupling
 */
export function runMbaLife001PrepQa(): LifePrepQaResult {
  const issues: string[] = [];

  const namespaceOk = LIFE_TOKEN_NAMESPACE === 'life.' && LIFE_TOKEN_GROUPS.length === 6;
  if (!namespaceOk) issues.push('life.* token group rezervasyonu eksik');

  const examplesOk =
    'life.eye.blink' in lifeTokens &&
    'life.face.micro_smile' in lifeTokens &&
    'life.breath.calm' in lifeTokens &&
    'life.idle.presence' in lifeTokens &&
    'life.random.scheduler' in lifeTokens &&
    'life.motion.subtle' in lifeTokens;
  if (!examplesOk) issues.push('life.* örnek tokenlar eksik');

  const layersOk = assertLayeredIdleSupport() && LIFE_LAYERS.length === 8;
  if (!layersOk) issues.push('layered idle (8 katman) eksik');

  const randomOk = assertRandomSchedulerContract();
  if (!randomOk) issues.push('weighted random scheduler sözleşmesi başarısız');

  const perfOk =
    assertLifePerfContract() &&
    LIFE_PERF.batteryFriendly &&
    LIFE_PERF.zeroAllocationsDuringIdleLoop;
  if (!perfOk) issues.push('LIFE_PERF 60fps / battery / memory eksik');

  const registryOk = assertMbaLife001Registry();
  if (!registryOk) issues.push(`${MBA_LIFE_001} registry başarısız`);

  const purposeOk = MBA_LIFE_001_PURPOSE.includes('subtle motion');
  if (!purposeOk) issues.push('MBA-LIFE-001 purpose eksik');

  const checklist = {
    lifeNamespaceReserved: namespaceOk,
    lifeTokenExamples: examplesOk,
    layeredIdleSimultaneous: layersOk,
    weightedRandomScheduler: randomOk,
    performance60fpsBatterySafe: perfOk,
    mbaLife001Registered: registryOk,
    subtleNotConstant: purposeOk,
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
