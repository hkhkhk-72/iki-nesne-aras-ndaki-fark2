/**
 * MB-LAB-001 — Doğal dizilim.
 * Nesneler ASLA ızgara gibi dizilmez. Her tekrar farklı dizilim üretir.
 */

export interface Point {
  x: number;
  y: number;
}

export interface NaturalLayoutOptions {
  count: number;
  /** 0–1 arası alan genişliği / yüksekliği. */
  width?: number;
  height?: number;
  seed?: number;
  /** Alt gruplar (MB-278); her küme kendi bölgesinde. */
  groups?: number[];
}

/** Deterministik pseudo-random [0,1). */
function rand(seed: number): () => number {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Doğal (organik) nokta bulutu üretir.
 * Izgara kaçınılır: düzenli satır/sütun aralığı kullanılmaz.
 */
export function naturalLayout(opts: NaturalLayoutOptions): Point[] {
  const width = opts.width ?? 1;
  const height = opts.height ?? 1;
  const seed = opts.seed ?? Date.now() % 100000;
  const rng = rand(seed);
  const groups = opts.groups ?? [opts.count];
  const points: Point[] = [];

  const clusterCount = groups.length;
  groups.forEach((size, gi) => {
    // Her küme için hafifçe kaymış merkez
    const cx = width * (0.22 + (gi / Math.max(1, clusterCount - 1 || 1)) * 0.56 + (rng() - 0.5) * 0.08);
    const cy = height * (0.35 + (rng() - 0.5) * 0.25);
    for (let i = 0; i < size; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = 0.06 + rng() * 0.14;
      const jitterX = (rng() - 0.5) * 0.04;
      const jitterY = (rng() - 0.5) * 0.04;
      points.push({
        x: clamp(cx + Math.cos(angle) * radius * width + jitterX * width, 0.05, width - 0.05),
        y: clamp(cy + Math.sin(angle) * radius * height + jitterY * height, 0.05, height - 0.05),
      });
    }
  });

  return points;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Izgara benzeri dizilim mi? QA / kalite için.
 * Eşit aralıklı satır-sütun örüntüsü yakalanırsa true.
 */
export function looksLikeGrid(points: Point[], tolerance = 0.02): boolean {
  if (points.length < 4) return false;
  const xs = [...new Set(points.map((p) => Math.round(p.x / tolerance) * tolerance))].sort(
    (a, b) => a - b,
  );
  const ys = [...new Set(points.map((p) => Math.round(p.y / tolerance) * tolerance))].sort(
    (a, b) => a - b,
  );
  // Çok düzenli satır+sütun → ızgara şüphesi
  if (xs.length >= 2 && ys.length >= 2 && xs.length * ys.length === points.length) {
    const dx = xs.slice(1).map((x, i) => x - xs[i]);
    const dy = ys.slice(1).map((y, i) => y - ys[i]);
    const evenX = dx.every((d) => Math.abs(d - dx[0]) < tolerance);
    const evenY = dy.every((d) => Math.abs(d - dy[0]) < tolerance);
    return evenX && evenY;
  }
  return false;
}
