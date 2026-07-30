import type { SceneGroup, SceneItem, SceneSpec } from './types';

/**
 * Yeniden oynanabilirlik motoru — Karar 285: tekrar değil, transfer.
 *
 * Aynı öğrenme hedefi yeni görseller / sayılar / bağlamlarla sunulur;
 * aynı etkinlik kopyalanmaz. Kavramın doğru cevabı bozulmaz.
 */

/** Oturum başına tek sayı; aynı seed aynı sahneyi üretir (test edilebilirlik). */
export function createSessionSeed(): number {
  return Date.now() % 100000;
}

function pseudoRandom(seed: number, salt: number): number {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function pick<T>(pool: T[], seed: number, salt: number): T {
  return pool[Math.floor(pseudoRandom(seed, salt) * pool.length) % pool.length];
}

/**
 * Sahneyi oturum seed'ine göre çeşitlendirir.
 *
 * Kritik kural: `choose` sahnelerinde grupların büyüklük ilişkisi korunur.
 * Yalnızca görsel ve mutlak sayılar değişir, doğru cevap sabit kalır.
 */
export function varyScene(scene: SceneSpec, seed: number): SceneSpec {
  const replay = scene.replay;
  if (!replay) return scene;

  const emoji = replay.emojiPool?.length
    ? pick(replay.emojiPool, seed, scene.order)
    : undefined;

  const jitter = replay.countJitter ?? 0;
  const delta = jitter > 0 ? Math.floor(pseudoRandom(seed, scene.order + 7) * (jitter + 1)) : 0;

  const opening =
    replay.greetings?.length
      ? { ...scene.opening, line: pick(replay.greetings, seed, scene.order + 3) }
      : scene.opening;

  return {
    ...scene,
    opening,
    interaction: varyInteraction(scene, emoji, delta),
  };
}

function varyItems(items: SceneItem[], emoji?: string): SceneItem[] {
  if (!emoji) return items;
  return items.map((i) => ({ ...i, emoji }));
}

function varyGroups(
  groups: [SceneGroup, SceneGroup],
  emoji: string | undefined,
  delta: number,
): [SceneGroup, SceneGroup] {
  // Aynı delta iki gruba da uygulanır; böylece ilişki (çok/az/eşit) korunur.
  return groups.map((g) => ({
    ...g,
    emoji: emoji ?? g.emoji,
    count: Math.max(1, g.count + delta),
  })) as [SceneGroup, SceneGroup];
}

function varyInteraction(
  scene: SceneSpec,
  emoji: string | undefined,
  delta: number,
): SceneSpec['interaction'] {
  const i = scene.interaction;
  switch (i.kind) {
    case 'discover':
      return { ...i, items: varyItems(i.items, emoji) };
    case 'observe':
    case 'pair':
      return { ...i, groups: varyGroups(i.groups, emoji, delta) };
    case 'choose':
      return { ...i, groups: varyGroups(i.groups, emoji, delta) };
    default:
      return i;
  }
}

/** Bir mikro deneyimin tüm sahnelerini çeşitlendirir. */
export function varyScenes(scenes: SceneSpec[], seed: number): SceneSpec[] {
  return scenes.map((s) => varyScene(s, seed));
}
