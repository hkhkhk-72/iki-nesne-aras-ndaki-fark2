/**
 * MES-002 kalite kontrolü.
 * Yayın öncesi her mikro deneyimin standarda uyduğunu doğrular.
 */
import { MATH_EXPERIENCES } from '@/modules/math';
import { validateExperience } from '@/mes/experience-registry';
import { validateLine } from '@/world/characters';
import type { MicroExperience } from '@/mes/types';

function collectLines(exp: MicroExperience): string[] {
  const lines: string[] = [];
  for (const s of exp.scenes) {
    lines.push(s.opening.line, s.feedback.positive, s.feedback.guidance);
    const i = s.interaction;
    if (i.kind === 'narrative') lines.push(...i.lines);
    if (i.kind === 'choose') lines.push(...i.hints, i.prompt);
    if (i.kind === 'pair') lines.push(i.leftoverLine, i.prompt);
    if (i.kind === 'celebrate') lines.push(i.title, i.message);
    if (i.kind === 'discover' || i.kind === 'observe') lines.push(i.prompt);
  }
  return lines.filter(Boolean);
}

let failed = false;

for (const exp of MATH_EXPERIENCES) {
  const v = validateExperience(exp);
  const lines = collectLines(exp);
  const bad = lines.filter((l) => !validateLine(l).ok);
  const firstThree = exp.scenes.slice(0, 3).reduce((s, x) => s + x.estimatedSeconds, 0);

  console.log(`\n${exp.code} — ${exp.title}`);
  console.log(`  Sahne: ${exp.scenes.length}  Süre: ${exp.totalSeconds}sn  İlk 3 sahne: ${firstThree}sn`);
  console.log(`  PDF çıktı: ${exp.pdfOutputs.length}  Denetlenen replik: ${lines.length}`);
  console.log(`  MES-002: ${v.ok ? 'GEÇTİ' : 'BAŞARISIZ'}`);
  console.log(`  Character Bible: ${bad.length === 0 ? 'GEÇTİ' : 'BAŞARISIZ'}`);

  if (!v.ok) { console.log('  Sorunlar:', v.issues); failed = true; }
  if (bad.length) { console.log('  Yasaklı ifadeler:', bad); failed = true; }
}

console.log(`\nSonuç: ${failed ? 'BAŞARISIZ' : 'TÜM KONTROLLER GEÇTİ'}`);
process.exit(failed ? 1 : 0);
