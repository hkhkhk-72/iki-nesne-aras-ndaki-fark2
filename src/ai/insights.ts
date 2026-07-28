import type { SceneBehavior } from './observer';
import { hasHesitation, isIdlePattern } from './observer';

/**
 * AI Yorum Katmanı.
 *
 * Kural: AI puan vermez, yol gösterir.
 * Çıktılar üç muhataba göre ayrılır: çocuk, öğretmen, veli.
 */

export type InsightAudience = 'child' | 'teacher' | 'parent';
export type InsightLevel = 'guclu' | 'gelisiyor' | 'destek_gerekli';

export interface Insight {
  audience: InsightAudience;
  level: InsightLevel;
  concept: string;
  /** Muhataba uygun dille yazılmış öneri. */
  message: string;
  /** Önerilen sonraki adım. */
  nextStep?: string;
}

export interface ExperienceInsights {
  code: string;
  level: InsightLevel;
  /** Kavramın oturma durumu — yüzde değil, nitel. */
  conceptStatus: Record<string, InsightLevel>;
  insights: Insight[];
}

function levelForScene(b: SceneBehavior): InsightLevel {
  const struggled = b.retries >= 2 || b.misconceptions.length > 0;
  const smooth = b.firstChoiceCorrect === true && b.retries === 0 && !hasHesitation(b);

  if (smooth) return 'guclu';
  if (struggled) return 'destek_gerekli';
  return 'gelisiyor';
}

function worstLevel(levels: InsightLevel[]): InsightLevel {
  if (levels.includes('destek_gerekli')) return 'destek_gerekli';
  if (levels.includes('gelisiyor')) return 'gelisiyor';
  return 'guclu';
}

/**
 * Davranış özetinden yorum üretir.
 * Hiçbir çıktıda puan, yüzde veya "başarısız" ifadesi yer almaz.
 */
export function buildInsights(code: string, behaviors: SceneBehavior[]): ExperienceInsights {
  const conceptStatus: Record<string, InsightLevel> = {};
  const insights: Insight[] = [];

  for (const b of behaviors) {
    if (!b.concept) continue;
    const level = levelForScene(b);
    const existing = conceptStatus[b.concept];
    conceptStatus[b.concept] = existing ? worstLevel([existing, level]) : level;
  }

  for (const [concept, level] of Object.entries(conceptStatus)) {
    const related = behaviors.filter((b) => b.concept === concept);
    const misconceptions = Array.from(new Set(related.flatMap((b) => b.misconceptions)));
    const hesitated = related.some(hasHesitation);
    const idled = related.some(isIdlePattern);

    // Çocuğa: her zaman cesaretlendirici, asla yargılayıcı değil
    insights.push({
      audience: 'child',
      level,
      concept,
      message:
        level === 'guclu'
          ? `${concept} konusunda çok rahatsın! Fındık sana güveniyor.`
          : level === 'gelisiyor'
            ? `${concept} konusunda ilerliyorsun. Biraz daha keşfedelim mi?`
            : `${concept} konusunu birlikte tekrar keşfedelim. Bilge Baykuş yanında.`,
      nextStep: level === 'guclu' ? 'Yeni bir maceraya geçebilirsin.' : 'Aynı sahneyi tekrar oynayabilirsin.',
    });

    // Öğretmene: davranış temelli, uygulanabilir
    const teacherDetail: string[] = [];
    if (hesitated) teacherDetail.push('karar vermeden önce uzun süre bekliyor');
    if (idled) teacherDetail.push('sahnede dikkat dağınıklığı gözlendi');
    if (misconceptions.length) teacherDetail.push(`kavram yanılgısı: ${misconceptions.join(', ')}`);

    insights.push({
      audience: 'teacher',
      level,
      concept,
      message: teacherDetail.length
        ? `${concept}: ${teacherDetail.join('; ')}.`
        : `${concept}: akıcı ilerliyor, ek desteğe ihtiyaç görünmüyor.`,
      nextStep:
        level === 'destek_gerekli'
          ? `${concept} için somut materyalle (nesne eşleştirme) sınıf içi tekrar önerilir.`
          : level === 'gelisiyor'
            ? `${concept} için kısa pekiştirme etkinliği yeterli.`
            : `${concept} tamamlandı; bir sonraki kazanıma geçilebilir.`,
    });

    // Veliye: evde yapılabilir tek somut iş
    insights.push({
      audience: 'parent',
      level,
      concept,
      message:
        level === 'destek_gerekli'
          ? `${concept} konusunda evde birlikte çalışmak iyi olur.`
          : `${concept} konusunda güzel ilerliyor.`,
      nextStep:
        level === 'destek_gerekli'
          ? 'Mutfakta iki tabağa farklı sayıda çatal koyup "hangisi daha çok?" diye sorun.'
          : 'Alışverişte ürünleri birlikte sayın.',
    });
  }

  return {
    code,
    level: worstLevel(Object.values(conceptStatus)),
    conceptStatus,
    insights,
  };
}

export function filterByAudience(
  result: ExperienceInsights,
  audience: InsightAudience,
): Insight[] {
  return result.insights.filter((i) => i.audience === audience);
}

export const LEVEL_LABELS: Record<InsightLevel, string> = {
  guclu: 'Güçlü',
  gelisiyor: 'Gelişiyor',
  destek_gerekli: 'Destek Gerekli',
};
