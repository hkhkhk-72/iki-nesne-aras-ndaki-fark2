export const colors = {
  primary: '#4A90D9',
  primaryDark: '#2E6BB0',
  primaryLight: '#7AB3F0',
  secondary: '#FF9F43',
  secondaryDark: '#E88A2D',
  success: '#2ECC71',
  successLight: '#D5F5E3',
  error: '#E74C3C',
  errorLight: '#FADBD8',
  warning: '#F39C12',
  background: '#F0F7FF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#FFFFFF',
  border: '#D6E8F7',
  star: '#FFD700',
  grade1: '#4A90D9',
  grade2: '#2ECC71',
  grade3: '#9B59B6',
  grade4: '#E67E22',
  smartboard: '#1A1A2E',
  smartboardAccent: '#00D4FF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const typography = {
  hero: { fontSize: 36, fontWeight: '800' as const, lineHeight: 44 },
  title: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  heading: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  subheading: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 18 },
  button: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
};

export const touchTarget = {
  min: 48,
  comfortable: 56,
  large: 72,
};

export const shadows = {
  card: {
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
};

export const activityModeLabels: Record<string, { label: string; icon: string; color: string }> = {
  learn: { label: 'Konu Anlatım', icon: '📖', color: '#5C6BC0' },
  play: { label: 'Oyna', icon: '🎮', color: '#4A90D9' },
  explore: { label: 'Keşfet', icon: '🔍', color: '#2ECC71' },
  experiment: { label: 'Deney Yap', icon: '🧪', color: '#9B59B6' },
  real_life: { label: 'Gerçek Hayat', icon: '🌍', color: '#E67E22' },
  home: { label: 'Ev Etkinliği', icon: '🏠', color: '#1ABC9C' },
  classroom: { label: 'Sınıf', icon: '🏫', color: '#3498DB' },
  smartboard: { label: 'Akıllı Tahta', icon: '📺', color: '#1A1A2E' },
  teacher: { label: 'Öğretmen', icon: '👩‍🏫', color: '#8E44AD' },
  ai_reinforcement: { label: 'AI Pekiştirme', icon: '🤖', color: '#00BCD4' },
  pdf: { label: 'PDF', icon: '📄', color: '#95A5A6' },
  challenge: { label: 'Meydan Okuma', icon: '🏆', color: '#F39C12' },
  collection: { label: 'Koleksiyon', icon: '⭐', color: '#FFD700' },
};
