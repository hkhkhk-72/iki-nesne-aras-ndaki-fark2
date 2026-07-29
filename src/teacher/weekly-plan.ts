/**
 * Öğretmen haftalık plan katmanı.
 *
 * İlham: Kazanım Cepte’nin “sınıf + ders → bu haftanın kazanımı” akışı.
 * İçerik: MiniBilge’nin Maarif hizalı çıktıları + MEB tema/saat ağırlıkları.
 *
 * KC metinleri kopyalanmaz. Hafta dağılımı kamu MEB saat tablosuna yakındır.
 */

import type { Grade } from '@/core/types';
import { getCurriculum } from '@/core/content-loader';
import type { LearningOutcome } from '@/core/types';

export interface ThemeBlock {
  id: string;
  title: string;
  /** MEB yaklaşık ders saati. */
  hours: number;
  /** 1-36 okul haftası (dahil). */
  weekStart: number;
  weekEnd: number;
  /** MiniBilge outcome id’leri — pedagojik sıra. */
  outcomeIds: string[];
}

export interface WeekPlanEntry {
  week: number;
  themeId: string;
  themeTitle: string;
  outcomes: LearningOutcome[];
  isCurrent: boolean;
}

/**
 * 1. sınıf — MEB tema sırası + saat ağırlığı (~36 hafta).
 * Outcome eşlemesi mevcut MiniBilge kimlikleriyle köprülenir.
 */
export const GRADE1_THEME_BLOCKS: ThemeBlock[] = [
  {
    id: 'tema-geo-1',
    title: 'Nesnelerin Geometrisi (1)',
    hours: 15,
    weekStart: 1,
    weekEnd: 3,
    outcomeIds: ['out-1-2-1', 'out-1-2-2'],
  },
  {
    id: 'tema-sayi-1',
    title: 'Sayılar ve Nicelikler (1)',
    hours: 57,
    weekStart: 4,
    weekEnd: 14,
    outcomeIds: [
      'out-1-1-1',
      'out-1-1-2',
      'out-1-1-3',
      'out-1-1-4',
      'out-1-1-5',
      'out-1-1-6',
      'out-1-3-1',
    ],
  },
  {
    id: 'tema-sayi-2',
    title: 'Sayılar ve Nicelikler (2)',
    hours: 18,
    weekStart: 15,
    weekEnd: 18,
    outcomeIds: ['out-1-1-7', 'out-1-3-3'],
  },
  {
    id: 'tema-cebir',
    title: 'İşlemlerden Cebirsel Düşünmeye',
    hours: 50,
    weekStart: 19,
    weekEnd: 28,
    outcomeIds: ['out-1-1-8', 'out-1-1-9', 'out-1-2-4', 'out-1-3-2'],
  },
  {
    id: 'tema-sayi-3',
    title: 'Sayılar ve Nicelikler (3)',
    hours: 7,
    weekStart: 29,
    weekEnd: 30,
    outcomeIds: ['out-1-3-4'],
  },
  {
    id: 'tema-geo-2',
    title: 'Nesnelerin Geometrisi (2)',
    hours: 15,
    weekStart: 31,
    weekEnd: 33,
    outcomeIds: ['out-1-2-3'],
  },
  {
    id: 'tema-veri',
    title: 'Veriye Dayalı Araştırma',
    hours: 10,
    weekStart: 34,
    weekEnd: 35,
    outcomeIds: ['out-1-4-1', 'out-1-4-2'],
  },
  {
    id: 'tema-otp',
    title: 'Okul Temelli Planlama',
    hours: 8,
    weekStart: 36,
    weekEnd: 36,
    outcomeIds: [],
  },
];

/** Türkiye’de tipik eğitim yılı başlangıcı (yaklaşık). */
const SCHOOL_YEAR_START_MONTH = 9; // Eylül
const SCHOOL_YEAR_START_DAY = 8;

/** Bugünden 1–36 okul haftası tahmini (tatil düzeltmesi yok — v1). */
export function estimateSchoolWeek(now = new Date()): number {
  const year =
    now.getMonth() + 1 >= SCHOOL_YEAR_START_MONTH ? now.getFullYear() : now.getFullYear() - 1;
  const start = new Date(year, SCHOOL_YEAR_START_MONTH - 1, SCHOOL_YEAR_START_DAY);
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  const week = Math.floor(diffDays / 7) + 1;
  return Math.min(36, Math.max(1, week));
}

export function themeForWeek(week: number): ThemeBlock {
  const block = GRADE1_THEME_BLOCKS.find((t) => week >= t.weekStart && week <= t.weekEnd);
  return block ?? GRADE1_THEME_BLOCKS[GRADE1_THEME_BLOCKS.length - 1];
}

/** Belirli haftanın planı — Kazanım Cepte “bu hafta” deneyimi. */
export function getWeekPlan(grade: Grade, week?: number): WeekPlanEntry {
  const w = week ?? estimateSchoolWeek();
  const theme = grade === 1 ? themeForWeek(w) : themeForWeek(w);
  const curriculum = getCurriculum(grade);
  const outcomes = (curriculum?.outcomes ?? [])
    .filter((o) => theme.outcomeIds.includes(o.id));

  // theme sırasını koru
  const ordered = theme.outcomeIds
    .map((id) => outcomes.find((o) => o.id === id))
    .filter((o): o is LearningOutcome => Boolean(o));

  return {
    week: w,
    themeId: theme.id,
    themeTitle: theme.title,
    outcomes: ordered,
    isCurrent: w === estimateSchoolWeek(),
  };
}

/** Tüm yılın haftalık iskeleti (öğretmen tarama listesi). */
export function getYearOutline(grade: Grade): WeekPlanEntry[] {
  return Array.from({ length: 36 }, (_, i) => getWeekPlan(grade, i + 1));
}

export function getThemeBlocks(grade: Grade): ThemeBlock[] {
  if (grade === 1) return GRADE1_THEME_BLOCKS;
  // 2–4: şimdilik 1. sınıf iskeleti yer tutucu; Maarif hizalaması sırada
  return GRADE1_THEME_BLOCKS;
}
