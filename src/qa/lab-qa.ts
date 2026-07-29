/**
 * MB-LAB-001 QA kapısı — her Learning Scene bu testlerden geçer.
 */

import type { SceneSpec } from '@/mes/types';
import {
  FORBIDDEN_PRESSURE,
  isPerceptualCount,
  mayPromptCount,
  PEDAGOGICAL_RULES,
  LAB_ID,
} from '@/lab/foundations';

export interface LabQaResult {
  ok: boolean;
  checklist: Record<string, boolean>;
  issues: string[];
}

/** Çocuğa görünen metin — pedagojikGoal hariç (meta dil false positive üretmesin). */
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

function sceneTextBlob(scene: SceneSpec): string {
  return `${childFacingBlob(scene)} ${scene.pedagogicalGoal}`.toLocaleLowerCase('tr');
}

function collectCounts(scene: SceneSpec): number[] {
  const i = scene.interaction;
  if (i.kind === 'discover') return [i.items.length];
  if (i.kind === 'observe' || i.kind === 'pair' || i.kind === 'choose') {
    return i.groups.map((g) => g.count);
  }
  return [];
}

function hasCountPrompt(scene: SceneSpec): boolean {
  const blob = childFacingBlob(scene);
  // "saymadan" istisnası — yasak olan saydırma istemi
  const normalized = blob.replace(/saymadan/g, ' ');
  return (
    normalized.includes('kaç tane') ||
    normalized.includes('tek tek say') ||
    /\bsay\b/.test(normalized) ||
    normalized.includes('sayalım') ||
    normalized.includes('sayalim') ||
    (normalized.includes('sayı') && !normalized.includes('sayi hiss'))
  );
}

function supportsCpa(scene: SceneSpec): boolean {
  // Concrete: somut nesne/emoji grupları veya narrative dünya
  // Pictorial: görsel groups/items
  // Abstract: henüz sembol/rakam dayatılmaz — lab sahnelerinde abstract sonra gelir
  const i = scene.interaction;
  if (i.kind === 'narrative' || i.kind === 'trust' || i.kind === 'celebrate') return true;
  if (i.kind === 'discover' || i.kind === 'observe' || i.kind === 'pair' || i.kind === 'choose') {
    return true; // concrete/pictorial nesneler
  }
  return false;
}

/**
 * MB-LAB-001 QA checklist.
 */
export function runLabQa(scene: SceneSpec): LabQaResult {
  const issues: string[] = [];
  const blob = sceneTextBlob(scene);
  const counts = collectCounts(scene);

  const hasTimerPressure = FORBIDDEN_PRESSURE.some((p) => blob.includes(p));
  if (hasTimerPressure) {
    issues.push(`${scene.id}: MB-271 ihlali — hız baskısı ifadesi (${LAB_ID})`);
  }

  // MB-269: 1–4 için sayma istemi
  const perceptual = counts.filter(isPerceptualCount);
  if (perceptual.length && hasCountPrompt(scene)) {
    issues.push(
      `${scene.id}: MB-269 ihlali — 1–4 nesne saydırılıyor (${PEDAGOGICAL_RULES['MB-269'].title})`,
    );
  }

  // revealCount + 1–4 discover = sayma riski
  if (
    scene.interaction.kind === 'discover' &&
    scene.interaction.revealCount &&
    isPerceptualCount(scene.interaction.items.length)
  ) {
    issues.push(
      `${scene.id}: MB-269 riski — 1–4 discover’da revealCount açık (sayma hissi)`,
    );
  }

  // choose: 1–4 varken sayı görünürlüğü
  if (scene.interaction.kind === 'choose') {
    const hasPerceptual = scene.interaction.groups.some((g) => isPerceptualCount(g.count));
    const vis = scene.interaction.countVisibility ?? 'after_attempt';
    if (hasPerceptual && vis !== 'never') {
      issues.push(
        `${scene.id}: MB-269 ihlali — 1–4 grup varken countVisibility=${vis} (olmalı: never)`,
      );
    }
  }

  const solvableWithoutCounting =
    scene.interaction.kind === 'choose'
      ? scene.interaction.countVisibility === 'never' ||
        scene.interaction.groups.every((g) => mayPromptCount(g.count) || isPerceptualCount(g.count))
      : scene.interaction.kind === 'narrative' ||
        scene.interaction.kind === 'trust' ||
        scene.interaction.kind === 'observe' ||
        scene.interaction.kind === 'pair' ||
        scene.interaction.kind === 'celebrate' ||
        (scene.interaction.kind === 'discover' && !hasCountPrompt(scene));

  const subitizingSupported =
    counts.length === 0 ||
    counts.some(isPerceptualCount) ||
    counts.some((n) => n >= 5) ||
    scene.aiObservation.concept.includes('sezgisel') ||
    scene.aiObservation.concept.includes('subitize') ||
    scene.storyToken === 'story.observe' ||
    scene.pedagogicalGoal.toLocaleLowerCase('tr').includes('sezgisel') ||
    scene.pedagogicalGoal.toLocaleLowerCase('tr').includes('saymadan');

  const checklist = {
    subitizing: Boolean(subitizingSupported),
    solvableWithoutCounting: Boolean(solvableWithoutCounting),
    noTimer: !hasTimerPressure,
    noSpeedPressure: !hasTimerPressure,
    montessori: !hasTimerPressure && !looksForcedGridLanguage(blob),
    cpa: supportsCpa(scene),
    finlandPlay: !hasTimerPressure && !blob.includes('test'),
    oecdAligned: !hasTimerPressure && !blob.includes('yarış'),
  };

  if (!checklist.subitizing) {
    issues.push(`${scene.id}: Subitizing desteği belirsiz`);
  }
  if (!checklist.solvableWithoutCounting) {
    issues.push(`${scene.id}: Saymadan çözülebilirlik zayıf`);
  }
  if (!checklist.cpa) {
    issues.push(`${scene.id}: MB-272 CPA desteği yetersiz`);
  }

  return {
    ok: issues.length === 0 && Object.values(checklist).every(Boolean),
    checklist,
    issues,
  };
}

function looksForcedGridLanguage(blob: string): boolean {
  return blob.includes('ızgara') || blob.includes('grid dizilim');
}

/** Deneyim düzeyinde toplu QA. */
export function runLabQaForScenes(scenes: SceneSpec[]): {
  ok: boolean;
  results: LabQaResult[];
  issues: string[];
} {
  const results = scenes.map(runLabQa);
  const issues = results.flatMap((r) => r.issues);
  return { ok: issues.length === 0, results, issues };
}
