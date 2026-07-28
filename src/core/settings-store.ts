import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Erişilebilirlik ve performans ayarları.
 *
 * Düşük donanımlı tabletler hedef cihazdır; bu yüzden animasyon ve efektler
 * kapatılabilir olmak zorundadır. Ayarlar offline saklanır.
 */

const SETTINGS_KEY = '@minibilge/settings';

export type TextScale = 'normal' | 'buyuk' | 'cok_buyuk';
export type ColorMode = 'normal' | 'yuksek_kontrast' | 'renk_koru';

export interface AppSettings {
  /** Animasyonları azalt — düşük performans modu. */
  reduceMotion: boolean;
  /** Ses kapatma. */
  soundEnabled: boolean;
  /** Altyazı / metin gösterimi. */
  captionsEnabled: boolean;
  textScale: TextScale;
  colorMode: ColorMode;
  /** Motor beceri desteği: dokunma hedeflerini büyütür, süre baskısını kaldırır. */
  motorAssist: boolean;
  /** Zaman baskısı olan modları kapatır. */
  timePressureEnabled: boolean;
}

export const defaultSettings: AppSettings = {
  reduceMotion: false,
  soundEnabled: true,
  captionsEnabled: true,
  textScale: 'normal',
  colorMode: 'normal',
  motorAssist: false,
  timePressureEnabled: true,
};

export const TEXT_SCALE_FACTOR: Record<TextScale, number> = {
  normal: 1,
  buyuk: 1.2,
  cok_buyuk: 1.45,
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    // Offline fallback
  }
  return { ...defaultSettings };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
): Promise<AppSettings> {
  const current = await loadSettings();
  const next = { ...current, [key]: value };
  await saveSettings(next);
  return next;
}

/** Motor beceri desteği açıkken dokunma hedefi büyür. */
export function touchTargetFor(settings: AppSettings, base: number): number {
  return settings.motorAssist ? Math.round(base * 1.35) : base;
}

export function scaleFont(settings: AppSettings, size: number): number {
  return Math.round(size * TEXT_SCALE_FACTOR[settings.textScale]);
}
