// Brand tokens, matching the specse web app (src/index.css there).
export const Colors = {
  background: '#FFFFFF',
  foreground: '#000000',
  teal: '#37D7BD',
  tealSoft: 'rgba(55, 215, 189, 0.1)',
  muted: '#F5F5F5',
  mutedForeground: '#737373',
  border: '#E6E6E6',
  destructive: '#EF4444',
} as const;

// Custom fonts ignore fontWeight on Android, so each weight is its own family.
export const Fonts = {
  regular: 'NunitoSans_400Regular',
  semibold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  extrabold: 'NunitoSans_800ExtraBold',
} as const;

export const Radius = {
  field: 10,
  button: 12,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
