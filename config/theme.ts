// Shared design tokens — warm cream background + orange accent, used via inline styles
// throughout the app (no CSS-in-JS/Tailwind in this project, so plain objects/strings work best).
export const COLORS = {
  bg: '#F1FAF7',
  bgSoft: '#E5F4EF',
  card: '#FBFFFD',
  accent: '#E96943',
  accentDark: '#C95435',
  accentSoft: '#FBEAE4',
  text: '#183D41',
  textMuted: '#587370',
  border: '#CFE5DE',
} as const;

export const RADIUS = {
  pill: 999,
  lg: 16,
  md: 12,
} as const;

export const SHADOW = {
  soft: '0 10px 28px -20px rgba(24, 88, 82, 0.28)',
} as const;
