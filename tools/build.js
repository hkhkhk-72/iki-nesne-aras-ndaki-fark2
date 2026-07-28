/*
 * Üretilen bulmaca verisini index.html içine gömer.
 * Kullanım: node tools/generate-puzzles.js > puzzles.json && node tools/build.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const dataPath = path.join(root, 'puzzles.json');

const data = fs.readFileSync(dataPath, 'utf8').trim();
JSON.parse(data);

let html = fs.readFileSync(htmlPath, 'utf8');
const marker = /const DATA = \/\*__PUZZLE_DATA__\*\/[\s\S]*?;(\r?\n)/;
const found = html.match(marker);

if (!found) {
  throw new Error('index.html içinde DATA yer tutucusu bulunamadı.');
}

html = html.replace(marker, `const DATA = /*__PUZZLE_DATA__*/${data};${found[1]}`);
fs.writeFileSync(htmlPath, html);

const parsed = JSON.parse(data);
const total = parsed.reduce(
  (sum, g) => sum + g.levels.reduce((s, l) => s + l.puzzles.length, 0),
  0
);
console.log(`Gömüldü: ${parsed.length} sınıf, ${total} soru, ${(data.length / 1024).toFixed(1)} KB`);
