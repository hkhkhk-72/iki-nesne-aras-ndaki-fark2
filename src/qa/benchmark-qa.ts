/**
 * MBA-BENCHMARK-001 QA kapısı.
 */

import type { SceneSpec } from '@/mes/types';
import { motionTokens } from '@/design-tokens';
import {
  BENCHMARK_ID,
  FORBIDDEN_AUDIO,
  FORBIDDEN_ERROR_LANGUAGE,
  FORBIDDEN_MATH_ANNOUNCE,
  FORBIDDEN_MOTIVATION,
  FORBIDDEN_SAFETY_LANGUAGE,
  AMBIENT_NATURE_HINTS,
  isMicroSceneLength,
  isMicroAnimationDuration,
  TOUCH_TARGET_MIN_PX,
  INTERACTION_LATENCY_MAX_MS,
  MICRO_SCENE_SECONDS,
} from '@/benchmark';

export interface BenchmarkQaResult {
  ok: boolean;
  checklist: Record<string, boolean>;
  issues: string[];
}

function childFacingBlob(scene: SceneSpec): string {
  const parts: string[] = [
    scene.title,
    scene.opening.line,
    scene.feedback.positive,
    scene.feedback.guidance,
    scene.accessibilityLabel,
  ];
  const i = scene.interaction;
  if (i.kind === 'narrative') parts.push(...i.lines, i.continueLabel);
  if (i.kind === 'discover') parts.push(i.prompt);
  if (i.kind === 'observe') parts.push(i.prompt, i.continueLabel);
  if (i.kind === 'pair') parts.push(i.prompt, i.leftoverLine);
  if (i.kind === 'choose') parts.push(i.prompt, ...i.hints);
  if (i.kind === 'celebrate') parts.push(i.title, i.message);
  if (i.kind === 'trust') parts.push(i.line, i.continueLabel);
  return parts.join(' ').toLocaleLowerCase('tr');
}

function includesAny(blob: string, needles: readonly string[]): string | null {
  for (const n of needles) {
    if (blob.includes(n.toLocaleLowerCase('tr'))) return n;
  }
  return null;
}

function isLearningScene(scene: SceneSpec): boolean {
  const k = scene.interaction.kind;
  return k === 'discover' || k === 'observe' || k === 'pair' || k === 'choose';
}

function ambientOk(scene: SceneSpec): boolean {
  const ambient = scene.soundBudget?.ambient?.toLocaleLowerCase('tr') ?? '';
  if (!ambient) return true;
  const forbidden = includesAny(ambient, FORBIDDEN_AUDIO);
  if (forbidden) return false;
  // Doğa / yumuşak ortam ipucu
  return AMBIENT_NATURE_HINTS.some((h) => ambient.includes(h));
}

function soundBudgetForbidden(scene: SceneSpec): string | null {
  if (!scene.soundBudget) return null;
  const blob = Object.values(scene.soundBudget).join(' ').toLocaleLowerCase('tr');
  return includesAny(blob, FORBIDDEN_AUDIO);
}

/**
 * Tek sahne için MBA-BENCHMARK-001 checklist.
 */
export function runBenchmarkQa(scene: SceneSpec): BenchmarkQaResult {
  const issues: string[] = [];
  const blob = childFacingBlob(scene);

  const errWord = includesAny(blob, FORBIDDEN_ERROR_LANGUAGE);
  if (errWord) {
    issues.push(`${scene.id}: Error philosophy — yasaklı dil "${errWord}" (${BENCHMARK_ID})`);
  }

  const motiv = includesAny(blob, FORBIDDEN_MOTIVATION);
  if (motiv) {
    issues.push(`${scene.id}: Motivation — yasaklı "${motiv}"`);
  }

  const safety = includesAny(blob, FORBIDDEN_SAFETY_LANGUAGE);
  if (safety) {
    issues.push(`${scene.id}: Child safety — yasaklı "${safety}"`);
  }

  const audioHit = soundBudgetForbidden(scene);
  if (audioHit) {
    issues.push(`${scene.id}: Audio — yasaklı ses "${audioHit}"`);
  }

  const ambientPass = ambientOk(scene);
  if (!ambientPass) {
    issues.push(`${scene.id}: Audio — ambient doğa sesi değil / yasaklı`);
  }

  // Mikro sahne süresi — öğrenme sahneleri 20–45
  let lengthOk = true;
  if (isLearningScene(scene)) {
    lengthOk = isMicroSceneLength(scene.estimatedSeconds);
    if (!lengthOk) {
      issues.push(
        `${scene.id}: UX — mikro sahne ${scene.estimatedSeconds}sn (beklenen ${MICRO_SCENE_SECONDS.min}–${MICRO_SCENE_SECONDS.max})`,
      );
    }
  } else if (scene.estimatedSeconds < 15 || scene.estimatedSeconds > 60) {
    lengthOk = false;
    issues.push(`${scene.id}: UX — bağ/kutlama süresi MES dışı (${scene.estimatedSeconds}sn)`);
  }

  // Story: matematik duyurusu (özellikle erken narrative / trust)
  let storyOk = true;
  if (scene.interaction.kind === 'narrative' || scene.order <= 2) {
    const announce = includesAny(blob, FORBIDDEN_MATH_ANNOUNCE);
    if (announce) {
      storyOk = false;
      issues.push(`${scene.id}: Story — matematik duyuruluyor ("${announce}")`);
    }
  }

  // Motion token süresi (varsa)
  let motionOk = true;
  if (scene.motionToken && scene.motionToken in motionTokens) {
    const token = motionTokens[scene.motionToken as keyof typeof motionTokens];
    motionOk = isMicroAnimationDuration(token.durationMs);
    if (!motionOk) {
      issues.push(
        `${scene.id}: UX — ${scene.motionToken} süresi ${token.durationMs}ms (250–450)`,
      );
    }
  }

  const checklist = {
    cognitiveBridge: true, // LAB QA ayrı kapı; burada köprü varsayılır
    touchTargetStandard: TOUCH_TARGET_MIN_PX >= 64,
    latencyTarget: INTERACTION_LATENCY_MAX_MS <= 50,
    microSceneLength: lengthOk,
    microAnimation: motionOk,
    ambientNature: ambientPass && !audioHit,
    noForbiddenMotivation: !motiv,
    controlOfError: !errWord,
    childSafety: !safety,
    storyBeforeMath: storyOk,
  };

  return {
    ok: issues.length === 0 && Object.values(checklist).every(Boolean),
    checklist,
    issues,
  };
}

export function runBenchmarkQaForScenes(scenes: SceneSpec[]): {
  ok: boolean;
  results: BenchmarkQaResult[];
  issues: string[];
} {
  const results = scenes.map(runBenchmarkQa);
  const issues = results.flatMap((r) => r.issues);
  return { ok: issues.length === 0, results, issues };
}

/** Tüm motion token’ların mikro süre aralığında olduğunu doğrular. */
export function runMotionTokenBenchmark(): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  for (const [id, token] of Object.entries(motionTokens)) {
    if (!isMicroAnimationDuration(token.durationMs)) {
      issues.push(`${id}: ${token.durationMs}ms (beklenen 250–450 veya 0)`);
    }
  }
  return { ok: issues.length === 0, issues };
}
