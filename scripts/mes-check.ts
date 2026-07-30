/**
 * MES-002 + MB-CHAR-002 + MB-AI-001 kalite kontrolü.
 */
import { MATH_EXPERIENCES } from '@/modules/math';
import { validateExperience } from '@/mes/experience-registry';
import { validateLine } from '@/world/characters';
import {
  enforceSpeakerPolicy,
  HELP_LADDER,
  EFFORT_PRAISE,
  validateBilgeLine,
} from '@/world/bilge-guidance';
import {
  decideIntervention,
  DEFAULT_THRESHOLDS,
  toTeacherSafeSummary,
  teacherVisible,
  personalizationOnly,
} from '@/ai/decision-engine';
import { runLabQaForScenes } from '@/qa/lab-qa';
import { runBenchmarkQaForScenes, runMotionTokenBenchmark } from '@/qa/benchmark-qa';
import { runLs011PrepQa } from '@/qa/ls011-prep-qa';
import {
  BENCHMARK_ID,
  BENCHMARK_VERSION,
  TOUCH_TARGET_MIN_PX,
  INTERACTION_LATENCY_MAX_MS,
  PRIMARY_MOTIVATION,
} from '@/benchmark';
import { KARAR_268, KARAR_269, KARAR_270, WAIT_HELP_PRIORITY } from '@/world/mavi-kitap-268-270';
import { KARAR_271, KARAR_272, KARAR_273, REFLECTION_TIME_METRIC } from '@/world/mavi-kitap-271-273';
import { KARAR_274, KARAR_275, KARAR_276, PROCESS_AI_METRICS } from '@/world/mavi-kitap-274-276';
import { KARAR_277, KARAR_278, KARAR_279 } from '@/world/mavi-kitap-277-279';
import { KARAR_283, KARAR_284, KARAR_285, MIN_CONTEXTS_PER_CONCEPT } from '@/world/mavi-kitap-283-285';
import { validateConceptTransfer } from '@/mes/concept-transfer';
import { PRIMARY_AI_METRICS } from '@/ai/decision-engine';
import { storyTokens, eduTokens, motionTokens, aiTokens, touchTarget } from '@/design-tokens';
import type { SceneBehavior } from '@/ai/observer';
import type { MicroExperience, CharacterId } from '@/mes/types';
import { serializeObserveCompareV2 } from '@/ai/analytics';
import { SILENT_MODE_POLICY } from '@/core/accessibility';
import { FX_SOFT_BOUNCE_SPEC, DEEP_BREATH_IDLE_AFTER_MS } from '@/world/assets';

function collectLines(exp: MicroExperience): { line: string; speaker: CharacterId }[] {
  const lines: { line: string; speaker: CharacterId }[] = [];
  for (const s of exp.scenes) {
    lines.push({ line: s.opening.line, speaker: s.opening.speaker });
    lines.push({ line: s.feedback.positive, speaker: s.feedback.speaker });
    lines.push({ line: s.feedback.guidance, speaker: s.feedback.speaker });
    const i = s.interaction;
    if (i.kind === 'narrative') {
      for (const line of i.lines) lines.push({ line, speaker: i.speaker });
    }
    if (i.kind === 'choose') {
      for (const h of i.hints) lines.push({ line: h, speaker: s.feedback.speaker });
      lines.push({ line: i.prompt, speaker: s.opening.speaker });
    }
    if (i.kind === 'pair') {
      lines.push({ line: i.leftoverLine, speaker: s.feedback.speaker });
      lines.push({ line: i.prompt, speaker: s.opening.speaker });
    }
    if (i.kind === 'celebrate') {
      lines.push({ line: i.title, speaker: 'findik' });
      lines.push({ line: i.message, speaker: 'findik' });
    }
    if (i.kind === 'trust') {
      lines.push({ line: i.line, speaker: s.feedback.speaker });
    }
    if (i.kind === 'discover' || i.kind === 'observe') {
      lines.push({ line: i.prompt, speaker: s.opening.speaker });
    }
  }
  return lines.filter((x) => Boolean(x.line));
}

function stubBehavior(partial: Partial<SceneBehavior>): SceneBehavior {
  return {
    sceneId: 'test',
    concept: 'test',
    firstTouchLatencyMs: null,
    totalTouches: 0,
    retries: 0,
    hintsShown: 0,
    idleEvents: 0,
    firstChoiceCorrect: null,
    firstSuccess: false,
    decisionConfidence: null,
    reflectionTimeMs: null,
    misconceptions: [],
    durationMs: 1000,
    ...partial,
  };
}

let failed = false;

for (const exp of MATH_EXPERIENCES) {
  const v = validateExperience(exp);
  const lines = collectLines(exp);
  const badBible = lines.filter((l) => !validateLine(l.line).ok);
  const badBilge = lines
    .map((l) => ({ ...l, check: enforceSpeakerPolicy(l.speaker, l.line) }))
    .filter((l) => !l.check.ok);
  const firstThree = exp.scenes.slice(0, 3).reduce((s, x) => s + x.estimatedSeconds, 0);

  console.log(`\n${exp.code} — ${exp.title}`);
  console.log(`  Sahne: ${exp.scenes.length}  Süre: ${exp.totalSeconds}sn  İlk 3 sahne: ${firstThree}sn`);
  console.log(`  PDF çıktı: ${exp.pdfOutputs.length}  Denetlenen replik: ${lines.length}`);
  console.log(`  MES-002: ${v.ok ? 'GEÇTİ' : 'BAŞARISIZ'}`);
  console.log(`  Character Bible: ${badBible.length === 0 ? 'GEÇTİ' : 'BAŞARISIZ'}`);
  console.log(`  MB-CHAR-002 Bilge: ${badBilge.length === 0 ? 'GEÇTİ' : 'BAŞARISIZ'}`);

  if (!v.ok) {
    console.log('  Sorunlar:', v.issues);
    failed = true;
  }
  if (badBible.length) {
    console.log(
      '  Yasaklı ifadeler:',
      badBible.map((b) => b.line),
    );
    failed = true;
  }
  if (badBilge.length) {
    console.log(
      '  Bilge ihlalleri:',
      badBilge.map((b) => `${b.line} → ${b.check.issues.join(', ')}`),
    );
    failed = true;
  }
}

// ── MB-CHAR-002 yardım basamağı ──
console.log('\nMB-CHAR-002 Yardım Motoru');
const ladderOk =
  HELP_LADDER[1].speaks === false &&
  HELP_LADDER[1].gazeOnly === true &&
  HELP_LADDER[2].speaks === true &&
  HELP_LADDER[4].examples.every((l) => validateBilgeLine(l).ok);
console.log(`  4 seviye / seviye-1 sessiz: ${ladderOk ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!ladderOk) failed = true;

const praiseOk = EFFORT_PRAISE.every((l) => validateBilgeLine(l).ok);
console.log(`  Süreç övgüsü (Karar 239): ${praiseOk ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!praiseOk) failed = true;

// ── MB-AI-001 karar motoru ──
console.log('\nMB-AI-001 Karar Motoru');
// MB-270: mimik (silence) → bakış (gaze) → … → metin
const silentThink = decideIntervention({
  behavior: stubBehavior({ firstTouchLatencyMs: 1500 }),
  msSinceLastTouch: 1500,
});
const gaze = decideIntervention({
  behavior: stubBehavior({ firstTouchLatencyMs: 3500 }),
  msSinceLastTouch: 3500,
});
const dragSilent = decideIntervention({
  behavior: stubBehavior({ retries: 5 }),
  dragActive: true,
});
const effort = decideIntervention({
  behavior: stubBehavior({ firstChoiceCorrect: true, retries: 0, totalTouches: 2 }),
});
const reflectionPraise = decideIntervention({
  behavior: stubBehavior({
    firstChoiceCorrect: true,
    retries: 0,
    totalTouches: 2,
    reflectionTimeMs: 3500,
  }),
});

const aiOk =
  silentThink.kind === 'silence' &&
  (gaze.kind === 'gaze' || gaze.helpLevel === 1) &&
  dragSilent.kind === 'silence' &&
  effort.kind === 'effort_praise' &&
  reflectionPraise.kind === 'effort_praise' &&
  reflectionPraise.bilge?.line === 'Dikkatlice düşündün.' &&
  DEFAULT_THRESHOLDS.gazeHintAfterMs < DEFAULT_THRESHOLDS.softHintAfterMs &&
  !teacherVisible('help_request') &&
  personalizationOnly('effort_history');

console.log(`  Sessizlik / bakış / sürükleme / Reflection Time: ${aiOk ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!aiOk) {
  console.log('  Detay:', {
    silentThink: silentThink.kind,
    gaze: gaze.kind,
    dragSilent: dragSilent.kind,
    effort: effort.kind,
    reflectionPraise: reflectionPraise.kind,
    reflectionLine: reflectionPraise.bilge?.line,
  });
  failed = true;
}

const teacher = toTeacherSafeSummary(
  stubBehavior({ concept: 'daha_cok', retries: 2, misconceptions: ['az_ile_cok'] }),
);
console.log(
  `  Öğretmen güvenli özet: ${teacher.qualitative === 'destek_gerekli' ? 'GEÇTİ' : 'BAŞARISIZ'}`,
);
if (teacher.qualitative !== 'destek_gerekli') failed = true;

// ── MB-LAB-001 Scientific Foundation ──
console.log('\nMB-LAB-001 Bilimsel Temel');
const labTokensOk =
  'story.observe' in storyTokens &&
  'story.notice' in storyTokens &&
  'story.discover' in storyTokens &&
  'edu.partWhole' in eduTokens &&
  'edu.visualCompare' in eduTokens &&
  'edu.grouping' in eduTokens &&
  'motion.deepBreath' in motionTokens &&
  'motion.softBounce' in motionTokens &&
  'motion.observe' in motionTokens &&
  'ai.observe_pattern' in aiTokens &&
  'ai.subitize_attempt' in aiTokens &&
  'ai.grouping_strategy' in aiTokens &&
  'ai.visual_focus' in aiTokens;
console.log(`  Token paketi: ${labTokensOk ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!labTokensOk) failed = true;

for (const exp of MATH_EXPERIENCES) {
  const lab = runLabQaForScenes(exp.scenes);
  console.log(`  ${exp.code} Lab QA: ${lab.ok ? 'GEÇTİ' : 'BAŞARISIZ'}`);
  if (!lab.ok) {
    console.log('  Lab sorunlar:', lab.issues);
    failed = true;
  }
}

// ── Mavi Kitap 268–285 ──
console.log('\nMavi Kitap Karar 268–285');
const reflectionPrimary = PRIMARY_AI_METRICS[0] === REFLECTION_TIME_METRIC;
const processOk = PROCESS_AI_METRICS.includes('reflection_time');
console.log(
  `  ${KARAR_273.id}/${KARAR_276.id} Reflection+süreç: ${reflectionPrimary && processOk ? 'GEÇTİ' : 'BAŞARISIZ'}`,
);
if (!reflectionPrimary || !processOk) failed = true;

for (const exp of MATH_EXPERIENCES) {
  const firstChoose = exp.scenes.find((s) => s.interaction.kind === 'choose');
  const discover = exp.scenes.find((s) => s.interaction.kind === 'discover');
  const celebrate = exp.scenes.find((s) => s.interaction.kind === 'celebrate');
  const k268 =
    firstChoose?.firstMathDecision === true &&
    (firstChoose.interaction.kind === 'choose'
      ? firstChoose.interaction.countVisibility === 'never'
      : false) &&
    KARAR_268.rule.includes('seçilen nesneye');
  // MB-269: yanlış seçim yok + saymadan karşılaştırma (Karar 231 / countVisibility)
  const k269 =
    KARAR_269.rule.includes('yanlış seçim') &&
    exp.scenes
      .filter((s) => s.interaction.kind === 'choose')
      .every((s) =>
        s.interaction.kind === 'choose'
          ? s.interaction.countVisibility === 'never' ||
            s.interaction.groups.every((g) => g.count >= 5)
          : true,
      );
  const k270 =
    WAIT_HELP_PRIORITY[0] === 'character_mime' &&
    WAIT_HELP_PRIORITY[4] === 'text' &&
    exp.scenes
      .filter((s) => s.interaction.kind === 'choose' || s.interaction.kind === 'observe')
      .every((s) => s.worldFeedback !== false);
  const k271 = KARAR_271.title.includes('Sessizlik');
  const k272 = KARAR_272.title.includes('Hata');
  const k273 =
    firstChoose?.aiObservation.signals.includes('reflection_time') === true;
  const k274 = discover?.discoveryBelongsToChild !== false;
  const k275 = celebrate?.worldCelebration !== false;
  const k276 = KARAR_276.title.includes('Süreç');
  const k277 = firstChoose?.behaviorBeforeSpeech === true;
  const k278 = firstChoose?.waitIsTeaching !== false;
  const k279 = firstChoose?.curiosityBeforeConcept === true;
  const transfer = validateConceptTransfer(exp);
  const k283 = KARAR_283.title.includes('Nesneden');
  const k284 =
    transfer.ok ||
    exp.scenes.filter((s) => s.learningConcept).length === 0 ||
    MIN_CONTEXTS_PER_CONCEPT === 3;
  const k285 = KARAR_285.title.includes('Transfer');
  const ok =
    k268 &&
    k269 &&
    k270 &&
    k271 &&
    k272 &&
    k273 &&
    k274 &&
    k275 &&
    k276 &&
    k277 &&
    k278 &&
    k279 &&
    transfer.ok &&
    k283 &&
    k284 &&
    k285;
  console.log(
    `  ${exp.code}: ${KARAR_268.id}…${KARAR_285.id} → ${ok ? 'GEÇTİ' : 'BAŞARISIZ'}`,
  );
  if (!transfer.ok) {
    console.log('  Transfer/bağlam:', transfer.issues);
  }
  if (!ok) {
    console.log('  Detay:', {
      k268,
      k269,
      k270,
      k271,
      k272,
      k273,
      k274,
      k275,
      k276,
      k277,
      k278,
      k279,
      transfer: transfer.ok,
      first: firstChoose?.id,
    });
    failed = true;
  }
}

// ── MBA-BENCHMARK-001 Global Standards ──
console.log(`\n${BENCHMARK_ID} v${BENCHMARK_VERSION}`);
const uxFloorOk =
  TOUCH_TARGET_MIN_PX >= 64 &&
  touchTarget.min >= 64 &&
  INTERACTION_LATENCY_MAX_MS <= 50 &&
  PRIMARY_MOTIVATION === 'curiosity';
console.log(`  UX / motivasyon tabanı: ${uxFloorOk ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!uxFloorOk) failed = true;

const motionBench = runMotionTokenBenchmark();
console.log(`  Motion 250–450ms: ${motionBench.ok ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!motionBench.ok) {
  console.log('  Motion sorunlar:', motionBench.issues);
  failed = true;
}

for (const exp of MATH_EXPERIENCES) {
  const bench = runBenchmarkQaForScenes(exp.scenes);
  console.log(`  ${exp.code} Benchmark QA: ${bench.ok ? 'GEÇTİ' : 'BAŞARISIZ'}`);
  if (!bench.ok) {
    console.log('  Benchmark sorunlar:', bench.issues);
    failed = true;
  }
}

// ── LS-011 Preparation (altyapı — gameplay yok) ──
console.log('\nLS-011 Preparation (GRP-001)');
const ls011 = runLs011PrepQa();
console.log(`  Altyapı QA: ${ls011.ok ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!ls011.ok) {
  console.log('  LS-011 sorunlar:', ls011.issues);
  failed = true;
}
const ls011TokensOk =
  'story.thinking.deep' in storyTokens &&
  'motion.look_back_child' in motionTokens &&
  motionTokens['motion.look_back_child'].kind === 'character_loop' &&
  'ai.observe_compare_v2' in aiTokens &&
  FX_SOFT_BOUNCE_SPEC.durationMs === 200 &&
  DEEP_BREATH_IDLE_AFTER_MS === 5000 &&
  SILENT_MODE_POLICY.soundOffKeepsAnimationMeaning &&
  serializeObserveCompareV2({
    firstLookedGroupId: 'a',
    firstTouchedGroupId: 'b',
    decisionMs: 1,
    exploreTouchCount: 0,
    waitMs: 2,
  }).startsWith('look=');
console.log(`  Token / FX / a11y sözleşmesi: ${ls011TokensOk ? 'GEÇTİ' : 'BAŞARISIZ'}`);
if (!ls011TokensOk) failed = true;

console.log(`\nSonuç: ${failed ? 'BAŞARISIZ' : 'TÜM KONTROLLER GEÇTİ'}`);
process.exit(failed ? 1 : 0);
