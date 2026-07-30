import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SceneBehavior } from './observer';
import type { ExperienceInsights } from './insights';

/**
 * AI çıktısının kalıcı saklanması.
 *
 * Öğretmen paneli puan değil davranış görür; bu yüzden saklanan şey
 * skor değil, sahne bazlı davranış özeti ve nitel yorumdur.
 */

const INSIGHTS_KEY = '@minibilge/insights';

export interface StoredExperienceRecord {
  code: string;
  completedAt: string;
  durationMs: number;
  behaviors: SceneBehavior[];
  insights: ExperienceInsights;
}

export async function saveExperienceRecord(record: StoredExperienceRecord): Promise<void> {
  const all = await loadExperienceRecords();
  // Aynı deneyimin tekrarları korunur; gelişim grafiği bunlardan üretilir.
  all.push(record);
  await AsyncStorage.setItem(INSIGHTS_KEY, JSON.stringify(all));
}

export async function loadExperienceRecords(): Promise<StoredExperienceRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(INSIGHTS_KEY);
    return raw ? (JSON.parse(raw) as StoredExperienceRecord[]) : [];
  } catch {
    return [];
  }
}

export async function loadRecordsForExperience(
  code: string,
): Promise<StoredExperienceRecord[]> {
  const all = await loadExperienceRecords();
  return all.filter((r) => r.code === code);
}

/** En son deneyim kaydı — öğretmen panelinde özet için. */
export async function loadLatestRecord(
  code?: string,
): Promise<StoredExperienceRecord | undefined> {
  const all = await loadExperienceRecords();
  const scoped = code ? all.filter((r) => r.code === code) : all;
  return scoped[scoped.length - 1];
}

/**
 * Tekrar sayısı üzerinden gelişim eğilimi.
 * Amaç sıralama değil, ilerlemenin görünür olmasıdır.
 */
export function buildProgressTrend(records: StoredExperienceRecord[]) {
  return records.map((r, idx) => ({
    attempt: idx + 1,
    completedAt: r.completedAt,
    level: r.insights.level,
    totalRetries: r.behaviors.reduce((s, b) => s + b.retries, 0),
    totalHints: r.behaviors.reduce((s, b) => s + b.hintsShown, 0),
    durationMs: r.durationMs,
  }));
}
