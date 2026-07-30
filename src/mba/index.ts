/**
 * MBA registries — LS-011 Preparation exposure layer.
 * GRP-001 infrastructure only; no gameplay.
 */

export {
  MBA_TOKEN_001,
  LS011_REGISTERED_TOKENS,
  assertMbaToken001Registry,
  resolveStoryToken,
  resolveMotionToken,
  resolveAiToken,
  resolveFxSoftBounce,
} from './token-001';

export {
  MBA_CHAR_DNA_001,
  CHAR_DNA_IDS,
  LS011_CHAR_DNA,
  assertMbaCharDna001Registry,
  resolveFn001,
  resolveBo001,
} from './char-dna-001';

export {
  MBA_MOTION_001,
  LS011_MOTION_REGISTRY,
  assertMbaMotion001Registry,
  resolveLookBackChildMotion,
} from './motion-001';

export {
  MBA_QA_001,
  LS011_QA_CHECKLIST_KEYS,
  runMbaQa001Gate,
  assertMbaQa001Registry,
  type Ls011QaChecklistKey,
} from './qa-001';

export {
  MBA_LIFE_001,
  MBA_LIFE_001_PURPOSE,
  LS_LIFE_REGISTERED,
  assertMbaLife001Registry,
} from './life-001';
