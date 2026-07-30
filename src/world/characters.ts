import type { CharacterId } from '@/mes/types';

/**
 * Character Bible.
 *
 * Karakterlerin konuşma kuralları burada tanımlıdır ve kod tarafından
 * zorunlu kılınır: Bilge Baykuş asla yargılamaz, "yanlış yaptın" demez.
 */
export interface CharacterProfile {
  id: CharacterId;
  name: string;
  visual: string;
  role: string;
  /** Ses tonu; içerik üretiminde referans alınır. */
  voice: string;
  /** Bu karakterin asla yapmayacağı şeyler. */
  neverDoes: string[];
  color: string;
}

export const CHARACTERS: Record<CharacterId, CharacterProfile> = {
  bilge: {
    id: 'bilge',
    name: 'Bilge Baykuş',
    visual: '🦉',
    role: 'Rehber — öğretim motorunun sesi (MB-CHAR-002)',
    voice: 'Sakin, merak ettiren, soru soran. Cevabı vermez, düşündürür.',
    neverDoes: [
      'Öğretmen gibi konuşmaz',
      'Yargılamaz',
      '"Yanlış yaptın" demez',
      '"Aferin / Doğru / Puan kazandın" demez',
      'Puan vermez',
      'Acele ettirmez',
      'Fındık bağ kurarken konuşmaz',
      'Çocuk düşünürken üstüne binmez',
    ],
    color: '#8E6FCB',
  },
  findik: {
    id: 'findik',
    name: 'Fındık Sincap',
    visual: '🐿️',
    role: 'En yakın arkadaş',
    voice: 'Meraklı, enerjik, sıcak. Çocuktan yardım ister.',
    neverDoes: [
      'Ders anlatmaz',
      'Çocuğu test etmez',
      'Üzgün bırakılmaz',
    ],
    color: '#E67E22',
  },
  narrator: {
    id: 'narrator',
    name: 'Anlatıcı',
    visual: '✨',
    role: 'Sahne geçişleri',
    voice: 'Kısa, şiirsel, görünmez.',
    neverDoes: ['Uzun konuşmaz', 'Matematik terimi kullanmaz'],
    color: '#7F8C8D',
  },
};

export function getCharacter(id: CharacterId): CharacterProfile {
  return CHARACTERS[id];
}

/**
 * Yasaklı ifadeler — içerik kalite kontrolünde kullanılır.
 * Çocuğa "başarısız oldun" duygusu veren hiçbir kalıp kullanılmaz.
 */
export const FORBIDDEN_PHRASES = [
  'yanlış',
  'hatalı',
  'hatalısın',
  'başarısız',
  'olmadı',
  'yapamadın',
  'tekrar dene',
  'kaybettin',
  'puan kazandın',
  'doğru cevabı bulamadın',
];

/** Bir replik Character Bible kurallarına uyuyor mu? */
export function validateLine(line: string): { ok: boolean; issues: string[] } {
  const lower = line.toLocaleLowerCase('tr');
  const issues = FORBIDDEN_PHRASES.filter((p) => lower.includes(p)).map(
    (p) => `Yasaklı ifade: "${p}"`,
  );
  return { ok: issues.length === 0, issues };
}
