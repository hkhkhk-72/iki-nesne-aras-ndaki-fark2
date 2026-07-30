/**
 * Karar 283–285 — kavram transfer / çoklu bağlam.
 *
 * Kavram nesneden bağımsızdır; en az 3 bağlam; tekrar değil transfer.
 */

import type { MicroExperience, SceneSpec } from '@/mes/types';
import { MIN_CONTEXTS_PER_CONCEPT } from '@/world/mavi-kitap-283-285';

export interface ConceptContextMap {
  /** Öğrenme kavramı (örn. daha_cok, karsilastirma). */
  concept: string;
  /** Benzersiz bağlam kimlikleri. */
  contexts: string[];
}

/** Sahnelerden kavram → bağlam kümesi çıkarır. */
export function collectConceptContexts(scenes: SceneSpec[]): ConceptContextMap[] {
  const map = new Map<string, Set<string>>();
  for (const s of scenes) {
    const concept = s.learningConcept ?? s.aiObservation.concept;
    if (!concept || concept === 'duygusal_bag' || concept === 'guven' || concept === 'tamamlama') {
      continue;
    }
    const ctx = s.contextId ?? s.id;
    if (!map.has(concept)) map.set(concept, new Set());
    map.get(concept)!.add(ctx);
  }
  return Array.from(map.entries()).map(([concept, set]) => ({
    concept,
    contexts: Array.from(set),
  }));
}

/**
 * Karar 284: her (öğrenme) kavram en az 3 bağlamda mı?
 * Bond/trust/celebrate kavramları muaf.
 */
export function validateMinContexts(scenes: SceneSpec[]): {
  ok: boolean;
  issues: string[];
  maps: ConceptContextMap[];
} {
  const maps = collectConceptContexts(scenes);
  const issues: string[] = [];
  for (const m of maps) {
    if (m.contexts.length < MIN_CONTEXTS_PER_CONCEPT) {
      issues.push(
        `MB-284: kavram "${m.concept}" yalnızca ${m.contexts.length} bağlamda ` +
          `(min ${MIN_CONTEXTS_PER_CONCEPT}): ${m.contexts.join(', ') || '—'}`,
      );
    }
  }
  return { ok: issues.length === 0, issues, maps };
}

/**
 * Karar 285: aynı kavram + aynı bağlam + aynı etkileşim türü = yasaklı tekrar.
 * Transfer = aynı kavram, farklı contextId.
 */
export function validateTransferNotRepeat(scenes: SceneSpec[]): {
  ok: boolean;
  issues: string[];
} {
  const seen = new Map<string, string>();
  const issues: string[] = [];
  for (const s of scenes) {
    const concept = s.learningConcept ?? s.aiObservation.concept;
    if (!concept) continue;
    const ctx = s.contextId ?? s.id;
    const key = `${concept}::${ctx}::${s.interaction.kind}`;
    const prev = seen.get(key);
    if (prev) {
      issues.push(
        `MB-285: tekrar (transfer değil) — ${s.id} ile ${prev} aynı kavram/bağlam/etkileşim (${concept}/${ctx})`,
      );
    } else {
      seen.set(key, s.id);
    }
  }
  return { ok: issues.length === 0, issues };
}

/** Karar 283: kavram birden fazla nesne/emoji ailesinde mi? */
export function validateConceptObjectIndependence(scenes: SceneSpec[]): {
  ok: boolean;
  issues: string[];
} {
  const byConcept = new Map<string, Set<string>>();
  for (const s of scenes) {
    const concept = s.learningConcept ?? s.aiObservation.concept;
    if (!concept || !s.contextId) continue;
    if (!byConcept.has(concept)) byConcept.set(concept, new Set());
    byConcept.get(concept)!.add(s.contextId);
  }
  const issues: string[] = [];
  // Bağımsızlık: en az 2 farklı context işaretli kavramlar için uyarı değil — 284 zaten 3 ister
  for (const [concept, ctxs] of byConcept) {
    if (ctxs.size === 1) {
      issues.push(
        `MB-283 riski: kavram "${concept}" tek bağlama bağlı görünüyor (${Array.from(ctxs)[0]})`,
      );
    }
  }
  return { ok: issues.length === 0, issues };
}

export function validateConceptTransfer(exp: MicroExperience): {
  ok: boolean;
  issues: string[];
} {
  const a = validateMinContexts(exp.scenes);
  const b = validateTransferNotRepeat(exp.scenes);
  const c = validateConceptObjectIndependence(exp.scenes);
  // 283 risklerini soft tut: yalnızca 1 bağlam + learningConcept işaretliyse fail
  const soft283 = c.issues.filter((i) => i.includes('MB-283'));
  // Min contexts is hard for concepts that declare learningConcept
  const hardMaps = a.maps.filter((m) =>
    exp.scenes.some((s) => (s.learningConcept ?? '') === m.concept),
  );
  const hardIssues: string[] = [];
  for (const m of hardMaps) {
    if (m.contexts.length < MIN_CONTEXTS_PER_CONCEPT) {
      hardIssues.push(
        `MB-284: learningConcept "${m.concept}" ${m.contexts.length}/${MIN_CONTEXTS_PER_CONCEPT} bağlam`,
      );
    }
  }
  // Also require family-level compare if present
  const issues = [...hardIssues, ...b.issues, ...soft283];
  return { ok: issues.length === 0, issues };
}
