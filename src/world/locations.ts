/**
 * World Bible — Matematik Köyü.
 *
 * Evren yaşayan yapıdadır: mevsim, gün döngüsü ve özel günler köyün
 * görünümünü değiştirir. Köy çocuğu hatırlar; çocuk dünyayı değiştirir.
 */

export type LocationId =
  | 'merkez_meydan'
  | 'matematik_okulu'
  | 'oyun_parki'
  | 'kesif_ormani'
  | 'sessiz_bahce'
  | 'kupa_meydani'
  | 'bilge_meydani';

export interface VillageLocation {
  id: LocationId;
  name: string;
  visual: string;
  description: string;
  /** Bu mekânda hangi tür deneyimler yaşanır. */
  purpose: string;
  color: string;
}

export const LOCATIONS: Record<LocationId, VillageLocation> = {
  merkez_meydan: {
    id: 'merkez_meydan',
    name: 'Merkez Meydan',
    visual: '🏘️',
    description: 'Köyün kalbi. Her macera burada başlar.',
    purpose: 'Karşılama, günlük görev, yönlendirme',
    color: '#4A90D9',
  },
  matematik_okulu: {
    id: 'matematik_okulu',
    name: 'Matematik Okulu',
    visual: '🏫',
    description: 'Bilge Baykuş burada merak ettirir.',
    purpose: 'Kavram keşfi, konu deneyimi',
    color: '#8E6FCB',
  },
  oyun_parki: {
    id: 'oyun_parki',
    name: 'Oyun Parkı',
    visual: '🎠',
    description: 'Pekiştirme burada oyuna dönüşür.',
    purpose: 'Tekrar, hız, refleks',
    color: '#FF9F43',
  },
  kesif_ormani: {
    id: 'kesif_ormani',
    name: 'Keşif Ormanı',
    visual: '🌲',
    description: 'Fındık Sincap burada yaşar. Doğru cevap yoktur, keşif vardır.',
    purpose: 'Serbest keşif, deneme yanılma',
    color: '#27AE60',
  },
  sessiz_bahce: {
    id: 'sessiz_bahce',
    name: 'Sessiz Bahçe',
    visual: '🌸',
    description: 'Yorulan çocuk buraya gelir. Süre yok, puan yok.',
    purpose: 'Sakinleşme, düşük uyaran modu',
    color: '#1ABC9C',
  },
  kupa_meydani: {
    id: 'kupa_meydani',
    name: 'Kupa Meydanı',
    visual: '🏆',
    description: 'Emek burada görünür olur.',
    purpose: 'Koleksiyon, rozet, ilerleme',
    color: '#F39C12',
  },
  bilge_meydani: {
    id: 'bilge_meydani',
    name: 'Bilge Baykuş Meydanı',
    visual: '🦉',
    description: 'Büyük sorular burada sorulur.',
    purpose: 'Meydan okuma, üst düzey düşünme',
    color: '#9B59B6',
  },
};

// ─── Yaşayan dünya ───────────────────────────────────────────
export type Season = 'ilkbahar' | 'yaz' | 'sonbahar' | 'kis';
export type DayPhase = 'sabah' | 'gunduz' | 'aksam' | 'gece';

export interface WorldState {
  season: Season;
  phase: DayPhase;
  /** Kar, yaprak dökümü gibi atmosfer efekti. */
  weather: 'acik' | 'karli' | 'yaprakli' | 'yagmurlu';
  greeting: string;
}

const SEASON_BY_MONTH: Season[] = [
  'kis', 'kis', 'ilkbahar', 'ilkbahar', 'ilkbahar', 'yaz',
  'yaz', 'yaz', 'sonbahar', 'sonbahar', 'sonbahar', 'kis',
];

function resolvePhase(hour: number): DayPhase {
  if (hour < 6) return 'gece';
  if (hour < 11) return 'sabah';
  if (hour < 18) return 'gunduz';
  if (hour < 22) return 'aksam';
  return 'gece';
}

const GREETINGS: Record<DayPhase, string> = {
  sabah: 'Günaydın! Köy yeni uyandı.',
  gunduz: 'Köyde güzel bir gün var.',
  aksam: 'Akşam oluyor, lambalar yanıyor.',
  gece: 'Köy sessiz. Bilge Baykuş uyanık.',
};

const WEATHER_BY_SEASON: Record<Season, WorldState['weather']> = {
  kis: 'karli',
  sonbahar: 'yaprakli',
  ilkbahar: 'acik',
  yaz: 'acik',
};

/** Gerçek tarih ve saate göre köyün o anki hâli. */
export function getWorldState(now: Date = new Date()): WorldState {
  const season = SEASON_BY_MONTH[now.getMonth()];
  const phase = resolvePhase(now.getHours());
  return {
    season,
    phase,
    weather: WEATHER_BY_SEASON[season],
    greeting: GREETINGS[phase],
  };
}

export function getLocation(id: LocationId): VillageLocation {
  return LOCATIONS[id];
}

export function getAllLocations(): VillageLocation[] {
  return Object.values(LOCATIONS);
}
