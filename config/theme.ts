// Shared design tokens — warm cream background + orange accent, used via inline styles
// throughout the app (no CSS-in-JS/Tailwind in this project, so plain objects/strings work best).
export const COLORS = {
  bg: '#FCF2E4',
  bgSoft: '#FBEADA',
  card: '#FFFFFF',
  accent: '#FF6A39',
  accentDark: '#E4531F',
  accentSoft: '#FFE4D2',
  text: '#2B2118',
  textMuted: '#7A6E60',
  border: '#F1DFC8',
} as const;

export const RADIUS = {
  pill: 999,
  lg: 20,
  md: 14,
} as const;

export const SHADOW = {
  soft: '0 10px 24px -12px rgba(43, 33, 24, 0.18)',
} as const;
