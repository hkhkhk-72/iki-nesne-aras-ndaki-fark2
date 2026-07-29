/**
 * Öğretmen favori kazanımları — Kazanım Cepte “favori” alışkanlığı.
 * Cihazda kalır; puan/sıralama yok.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@minibilge/teacher-favorites/v1';

export async function loadFavoriteOutcomeIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export async function toggleFavoriteOutcome(outcomeId: string): Promise<string[]> {
  const current = await loadFavoriteOutcomeIds();
  const next = current.includes(outcomeId)
    ? current.filter((id) => id !== outcomeId)
    : [...current, outcomeId];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function isFavoriteOutcome(outcomeId: string): Promise<boolean> {
  const ids = await loadFavoriteOutcomeIds();
  return ids.includes(outcomeId);
}
