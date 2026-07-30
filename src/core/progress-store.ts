import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StudentProfile, StudentProgress, SubjectId } from './types';
import { isLessonActivity } from './unlock-logic';
import { DEFAULT_SUBJECT } from './subject-registry';

const PROFILE_KEY = '@minibilge/student_profile';

/**
 * Kazanım kimlikleri Maarif Modeli hizalamasıyla yeniden yapılandırıldığı için
 * (örn. out-1-2-1 artık karşılaştırma değil uzamsal ilişkiler) eski kayıtların
 * sessizce yanlış kazanıma atanmaması gerekir. Sürümlü anahtar, eski verinin
 * yorumlanmak yerine devre dışı kalmasını sağlar.
 */
const PROGRESS_KEY = '@minibilge/progress/v2';

const defaultProfile: StudentProfile = {
  id: 'student-1',
  name: 'Öğrenci',
  grade: 1,
  avatar: '🦊',
  activeSubject: DEFAULT_SUBJECT,
  progress: [],
  collections: [],
  totalStars: 0,
};

export async function loadStudentProfile(): Promise<StudentProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StudentProfile;
      return { ...defaultProfile, ...parsed };
    }
  } catch {
    // Offline fallback
  }
  return { ...defaultProfile };
}

export async function saveStudentProfile(profile: StudentProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/**
 * Ders alanı sonradan eklendiği için eski kayıtlar matematik sayılır.
 * Böylece kullanıcı verisi için ayrı bir migration adımı gerekmez.
 */
function normalize(records: StudentProgress[]): StudentProgress[] {
  return records.map((p) => ({ ...p, subject: p.subject ?? DEFAULT_SUBJECT }));
}

export async function saveActivityProgress(progress: StudentProgress): Promise<void> {
  const all = await loadAllProgress();
  const subject = progress.subject ?? DEFAULT_SUBJECT;
  const record: StudentProgress = { ...progress, subject };

  const idx = all.findIndex(
    (p) =>
      p.subject === subject &&
      p.outcomeId === record.outcomeId &&
      p.activityId === record.activityId,
  );
  const isNew = idx < 0;
  if (isNew) {
    all.push(record);
  } else {
    all[idx] = { ...record, attempts: (all[idx].attempts ?? 0) + 1 };
  }
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(all));

  if (record.completed && isNew) {
    await awardStars(record);
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
    return raw ? normalize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

/** Tek bir dersin ilerlemesi — dersler arası karışmayı önler. */
export async function loadSubjectProgress(
  subject: SubjectId = DEFAULT_SUBJECT,
): Promise<StudentProgress[]> {
  const all = await loadAllProgress();
  return all.filter((p) => p.subject === subject);
}

export { calculateOutcomeProgress } from './unlock-logic';
