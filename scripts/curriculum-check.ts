/**
 * Müfredat bütünlüğü kontrolü.
 *
 * Maarif Modeli hizalaması sonrası kazanım kimlikleri değiştiği için
 * ön koşul bağlantılarının ve ünite-kazanım eşleşmelerinin kırılmadığını
 * doğrular.
 */
import { getAllCurricula } from '@/core/content-loader';
import { getAllExperiences } from '@/mes/experience-registry';

let failed = false;

function fail(msg: string) {
  console.log(`  ✗ ${msg}`);
  failed = true;
}

for (const c of getAllCurricula()) {
  const outcomeIds = new Set(c.outcomes.map((o) => o.id));
  const unitIds = new Set(c.units.map((u) => u.id));
  const activityCount = c.outcomes.reduce((s, o) => s + o.activities.length, 0);

  console.log(`\n${c.title}`);
  console.log(`  Öğrenme alanı: ${c.units.length}  Kazanım: ${c.outcomes.length}  Etkinlik: ${activityCount}`);

  // Ünite → kazanım tutarlılığı
  for (const u of c.units) {
    for (const oid of u.outcomeIds) {
      if (!outcomeIds.has(oid)) fail(`${u.id} tanımsız kazanıma işaret ediyor: ${oid}`);
    }
  }

  for (const o of c.outcomes) {
    if (!unitIds.has(o.unitId)) fail(`${o.id} tanımsız üniteye bağlı: ${o.unitId}`);

    const unit = c.units.find((u) => u.id === o.unitId);
    if (unit && !unit.outcomeIds.includes(o.id)) {
      fail(`${o.id} ünite listesinde yok: ${o.unitId}`);
    }

    // Ön koşul bütünlüğü
    for (const pre of o.prerequisites) {
      if (!outcomeIds.has(pre)) fail(`${o.id} tanımsız ön koşula işaret ediyor: ${pre}`);
    }

    // Her kazanımda konu anlatımı ve en az bir oyun etkinliği olmalı
    const hasLesson = o.activities.some((a) => a.mode === 'learn');
    const hasPlay = o.activities.some((a) => a.mode === 'play');
    if (!hasLesson) fail(`${o.id} konu anlatımı yok`);
    if (!hasPlay) fail(`${o.id} oyun etkinliği yok`);
    if (o.lesson.slides.length < 4) fail(`${o.id} konu anlatımı çok kısa (${o.lesson.slides.length} slayt)`);
    if (o.realLifeContexts.length < 2) fail(`${o.id} gerçek hayat bağlamı yetersiz`);
  }
}

// Mikro deneyimlerin kazanım köprüsü geçerli mi?
const allOutcomeIds = new Set(getAllCurricula().flatMap((c) => c.outcomes.map((o) => o.id)));
console.log('\nMikro deneyim köprüleri');
for (const exp of getAllExperiences()) {
  if (!allOutcomeIds.has(exp.outcomeId)) {
    fail(`${exp.code} tanımsız kazanıma bağlı: ${exp.outcomeId}`);
  } else {
    console.log(`  ${exp.code} → ${exp.outcomeId} ✓`);
  }
}

console.log(`\nSonuç: ${failed ? 'BAŞARISIZ' : 'MÜFREDAT BÜTÜNLÜĞÜ GEÇTİ'}`);
process.exit(failed ? 1 : 0);
