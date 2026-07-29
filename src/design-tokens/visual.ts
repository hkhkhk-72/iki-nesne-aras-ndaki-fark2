/**
 * GRS-001C — Visual Tokens
 * Design System ürün artefaktı. Yeni kural icat etmez; kurucu token ailesini kodlar.
 */

export const color = {
  leaf: {
    autumn: '#C45C26',
    spring: '#3D8B5F',
    summer: '#2E7D4F',
    winter: '#5A7A6A',
  },
  sky: {
    morning: '#A8D4F0',
    day: '#6BB3E0',
    evening: '#F0A878',
    night: '#1A2A44',
  },
  brand: {
    primary: '#4A90D9',
    primaryDark: '#2E6BB0',
    primaryLight: '#7AB3F0',
    secondary: '#FF9F43',
    secondaryDark: '#E88A2D',
  },
  semantic: {
    success: '#2ECC71',
    successLight: '#D5F5E3',
    warning: '#F39C12',
    error: '#E74C3C',
    errorLight: '#FADBD8',
  },
  surface: {
    background: '#F0F7FF',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    border: '#D6E8F7',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    inverse: '#FFFFFF',
  },
  character: {
    findik: '#E67E22',
    bilge: '#8E6FCB',
    narrator: '#7F8C8D',
  },
  grade: {
    g1: '#4A90D9',
    g2: '#2ECC71',
    g3: '#9B59B6',
    g4: '#E67E22',
  },
  smartboard: {
    bg: '#1A1A2E',
    accent: '#00D4FF',
  },
  star: '#FFD700',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const typography = {
  hero: { fontSize: 36, fontWeight: '800' as const, lineHeight: 44 },
  title: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  heading: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  subheading: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 18 },
  button: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
} as const;

export const shadow = {
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
} as const;

export const touchTarget = {
  min: 48,
  comfortable: 56,
  large: 72,
} as const;

/** Karar 234 — görsel kompozisyon bütçesi. */
export const composition = {
  world: 70,
  interaction: 20,
  ui: 10,
} as const;
