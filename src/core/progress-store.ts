import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StudentProfile, StudentProgress } from './types';
import { isLessonActivity } from './unlock-logic';

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
  const isNew = idx < 0;
  if (idx >= 0) {
    all[idx] = progress;
  } else {
    all.push(progress);
  }
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(all));

  if (progress.completed && isNew) {
    await awardStars(progress);
  }
}

async function awardStars(progress: StudentProgress): Promise<void> {
  const profile = await loadStudentProfile();
  let stars = 1;
  if (progress.score >= 90) stars = 3;
  else if (progress.score >= 70) stars = 2;
  if (isLessonActivity(progress.activityId)) stars = 2;

  profile.totalStars += stars;
  await saveStudentProfile(profile);
}

export async function loadAllProgress(): Promise<StudentProgress[]> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export { calculateOutcomeProgress } from './unlock-logic';
