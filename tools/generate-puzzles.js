/*
 * ABC Bağlamaca bulmaca üreticisi.
 *
 * Her bulmaca, ızgaranın tamamını kaplayan Hamilton yolunun parçalara
 * bölünmesiyle üretilir. Bu sayede "tüm noktalar dolu" kuralını sağlayan
 * en az bir çözüm garanti edilir ve bu çözüm ipucu için saklanır.
 *
 * Kullanım: node tools/generate-puzzles.js > puzzles.json
 */

'use strict';

const GRADES = [
  {
    grade: 1,
    label: '1. Sınıf',
    levels: [
      { size: 3, pairs: 2 },
      { size: 3, pairs: 3 },
      { size: 4, pairs: 2 },
      { size: 4, pairs: 3 },
      { size: 4, pairs: 4 }
    ]
  },
  {
    grade: 2,
    label: '2. Sınıf',
    levels: [
      { size: 4, pairs: 3 },
      { size: 4, pairs: 4 },
      { size: 5, pairs: 3 },
      { size: 5, pairs: 4 },
      { size: 5, pairs: 5 }
    ]
  },
  {
    grade: 3,
    label: '3. Sınıf',
    levels: [
      { size: 5, pairs: 4 },
      { size: 5, pairs: 5 },
      { size: 6, pairs: 4 },
      { size: 6, pairs: 5 },
      { size: 6, pairs: 6 }
    ]
  },
  {
    grade: 4,
    label: '4. Sınıf',
    levels: [
      { size: 6, pairs: 5 },
      { size: 6, pairs: 6 },
      { size: 7, pairs: 5 },
      { size: 7, pairs: 6 },
      { size: 8, pairs: 6 }
    ]
  }
];

const PUZZLES_PER_LEVEL = 10;
const LETTERS = 'ABCDEFGH';

function buildNeighbors(size) {
  const nb = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const list = [];
      if (r > 0) list.push((r - 1) * size + c);
      if (r < size - 1) list.push((r + 1) * size + c);
      if (c > 0) list.push(r * size + c - 1);
      if (c < size - 1) list.push(r * size + c + 1);
      nb.push(list);
    }
  }
  return nb;
}

function reverseSegment(path, pos, from, to) {
  while (from < to) {
    const a = path[from];
    const b = path[to];
    path[from] = b;
    path[to] = a;
    pos[b] = from;
    pos[a] = to;
    from++;
    to--;
  }
}

/* Backbite algoritması ile rastgele Hamilton yolu */
function randomHamiltonian(size, neighbors, iterations) {
  const path = [];
  for (let r = 0; r < size; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < size; c++) path.push(r * size + c);
    } else {
      for (let c = size - 1; c >= 0; c--) path.push(r * size + c);
    }
  }
  const pos = new Array(size * size);
  path.forEach((cell, i) => { pos[cell] = i; });

  const n = path.length;
  for (let it = 0; it < iterations; it++) {
    if (Math.random() < 0.5) {
      const nbrs = neighbors[path[0]];
      const v = nbrs[(Math.random() * nbrs.length) | 0];
      const i = pos[v];
      if (i <= 1) continue;
      reverseSegment(path, pos, 0, i - 1);
    } else {
      const nbrs = neighbors[path[n - 1]];
      const v = nbrs[(Math.random() * nbrs.length) | 0];
      const i = pos[v];
      if (i >= n - 2) continue;
      reverseSegment(path, pos, i + 1, n - 1);
    }
  }
  return path;
}

function splitPath(path, parts, minLen) {
  const total = path.length;
  if (total < parts * minLen) return null;

  /* Rastgele ama minimum uzunluğu koruyan bölme noktaları */
  let extra = total - parts * minLen;
  const lengths = new Array(parts).fill(minLen);
  while (extra > 0) {
    const i = (Math.random() * parts) | 0;
    lengths[i]++;
    extra--;
  }

  const segments = [];
  let cursor = 0;
  for (const len of lengths) {
    segments.push(path.slice(cursor, cursor + len));
    cursor += len;
  }
  return segments;
}

function manhattan(a, b, size) {
  const ar = (a / size) | 0, ac = a % size;
  const br = (b / size) | 0, bc = b % size;
  return Math.abs(ar - br) + Math.abs(ac - bc);
}

function countTurns(segment, size) {
  let turns = 0;
  for (let i = 2; i < segment.length; i++) {
    const p = segment[i - 2], q = segment[i - 1], r = segment[i];
    const d1 = (q - p);
    const d2 = (r - q);
    if (d1 !== d2) turns++;
  }
  return turns;
}

function difficultyScore(segments, size) {
  let score = 0;
  for (const seg of segments) {
    const detour = (seg.length - 1) - manhattan(seg[0], seg[seg.length - 1], size);
    score += countTurns(seg, size) * 1.0 + detour * 0.6;
  }
  /* Kısa (bitişik uçlu) çiftler bulmacayı kolaylaştırır */
  const trivial = segments.filter(s => s.length <= 2).length;
  return score - trivial * 2.5;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function signature(segments) {
  return segments
    .map(s => {
      const a = s[0], b = s[s.length - 1];
      return a < b ? a + '-' + b : b + '-' + a;
    })
    .sort()
    .join('|');
}

function generateLevel(size, pairs, count) {
  const neighbors = buildNeighbors(size);
  /* Her çiftin arasında en az bir nokta olsun (bitişik uçlar bulmacayı önemsiz kılar) */
  const minLen = 3;
  const seen = new Set();
  const candidates = [];
  const target = count * 12;
  const maxAttempts = 60000;

  for (let attempt = 0; attempt < maxAttempts && candidates.length < target; attempt++) {
    const path = randomHamiltonian(size, neighbors, 400 + size * 120);
    const segments = splitPath(path, pairs, minLen);
    if (!segments) return null;

    /* Uçları bitişik olan (tek hamlede çözülen) çiftleri ele */
    if (segments.some(s => s.length <= 2)) continue;

    const ordered = shuffle(segments.slice());
    const sig = signature(ordered);
    if (seen.has(sig)) continue;
    seen.add(sig);

    candidates.push({
      segments: ordered,
      score: difficultyScore(ordered, size)
    });
  }

  if (candidates.length < count) return null;

  candidates.sort((a, b) => a.score - b.score);

  /* Kolaydan zora eşit aralıklı seçim */
  const picked = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.round((i * (candidates.length - 1)) / (count - 1));
    picked.push(candidates[idx]);
  }

  return picked.map(p => ({
    s: size,
    sol: p.segments.map(seg => seg.slice())
  }));
}

function main() {
  const out = [];
  for (const g of GRADES) {
    const levels = [];
    g.levels.forEach((cfg, li) => {
      const puzzles = generateLevel(cfg.size, cfg.pairs, PUZZLES_PER_LEVEL);
      if (!puzzles) {
        throw new Error(`Üretilemedi: sınıf ${g.grade} seviye ${li + 1} (${cfg.size}x${cfg.size}, ${cfg.pairs} çift)`);
      }
      levels.push({
        level: li + 1,
        size: cfg.size,
        pairs: cfg.pairs,
        letters: LETTERS.slice(0, cfg.pairs),
        puzzles
      });
      process.stderr.write(`sınıf ${g.grade} · seviye ${li + 1}: ${cfg.size}x${cfg.size}, ${cfg.pairs} çift, ${puzzles.length} soru\n`);
    });
    out.push({ grade: g.grade, label: g.label, levels });
  }
  process.stdout.write(JSON.stringify(out));
}

main();
