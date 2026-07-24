import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StudentProfile, StudentProgress } from './types';

const PROFILE_KEY = '@minibilge/student_profile';
const PROGRESS_KEY = '@minibilge/progress';

const defaultProfile: StudentProfile = {
  id: 'student-1',
  name: 'Öğrenci',
  grade: 1,
  avatar: '🦊',
  progress: [],
  collections: [],
  totalStars: 0,
};

export async function loadStudentProfile(): Promise<StudentProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as StudentProfile;
  } catch {
    // Offline fallback
  }
  return { ...defaultProfile };
}

export async function saveStudentProfile(profile: StudentProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function saveActivityProgress(progress: StudentProgress): Promise<void> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  const all: StudentProgress[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex(
    (p) => p.outcomeId === progress.outcomeId && p.activityId === progress.activityId,
  );
  if (idx >= 0) {
    all[idx] = progress;
  } else {
    all.push(progress);
  }
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export async function loadAllProgress(): Promise<StudentProgress[]> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function calculateOutcomeProgress(
  outcomeId: string,
  activityIds: string[],
  progress: StudentProgress[],
): number {
  if (activityIds.length === 0) return 0;
  const completed = activityIds.filter((id) =>
    progress.some((p) => p.outcomeId === outcomeId && p.activityId === id && p.completed),
  ).length;
  return Math.round((completed / activityIds.length) * 100);
}
