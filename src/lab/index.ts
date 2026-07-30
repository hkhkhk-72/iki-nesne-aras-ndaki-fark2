/**
 * MB-LAB-001 — Az / Çok / Eşit laboratuvarı
 */

export {
  LAB_ID,
  LAB_VERSION,
  SCIENTIFIC_FOUNDATIONS,
  PEDAGOGICAL_RULES,
  FORBIDDEN_PRESSURE,
  CPA_ORDER,
  PERCEPTUAL_SUBITIZE_MAX,
  CONCEPTUAL_SUBITIZE_MIN,
  GROUPING_TEMPLATES,
  isPerceptualCount,
  isConceptualCount,
  mayPromptCount,
  pickGrouping,
  type PedagogicalRuleId,
  type CpaPhase,
  type ScientificFoundation,
} from './foundations';

export {
  naturalLayout,
  looksLikeGrid,
  type Point,
  type NaturalLayoutOptions,
} from './natural-layout';

export {
  FINDIK_OBSERVE_CYCLE,
  FINDIK_PHASE_CUES,
  BILGE_APPEAR_ONLY_AFTER_MS,
  type FindikBehaviourPhase,
} from './character-lab';
