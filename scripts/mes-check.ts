/**
 * MES-002 kalite kontrolü.
 * Yayın öncesi her mikro deneyimin standarda uyduğunu doğrular.
 */
import { MATH_EXPERIENCES } from '@/modules/math';
import { validateExperience } from '@/mes/experience-registry';
import { validateLine } from '@/world/characters';
import { enforceSpeakerPolicy } from '@/world/bilge-guidance';
import type { MicroExperience, CharacterId } from '@/mes/types';

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
    if (i.kind === 'discover' || i.kind === 'observe') {
      lines.push({ line: i.prompt, speaker: s.opening.speaker });
    }
  }
  return lines.filter((x) => Boolean(x.line));
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

console.log(`\nSonuç: ${failed ? 'BAŞARISIZ' : 'TÜM KONTROLLER GEÇTİ'}`);
process.exit(failed ? 1 : 0);
