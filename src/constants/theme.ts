// Specsmakers brand (black, white, teal) pushed bolder for the customer app.
export const Colors = {
  ink: '#0A0A0A',
  background: '#F5F6F6',
  surface: '#FFFFFF',
  text: '#0A0A0A',
  textMuted: '#6B7280',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255, 255, 255, 0.65)',
  border: '#E8EAEA',

  teal: '#37D7BD',
  // Darker teal for text and icons on white, where the brand teal is too light to read.
  tealDeep: '#0B8F7A',
  tealSoft: '#E6FAF6',

  coin: '#F5B82E',
  coinSoft: '#FEF5E1',
  coral: '#F2765A',
  coralSoft: '#FDECE8',
  purple: '#6D7BE0',
  purpleSoft: '#ECEEFC',
  sky: '#2BB8F0',
  skySoft: '#E5F6FD',

  success: '#16A34A',
  successSoft: '#E8F7EE',
  danger: '#EF4444',
} as const;

export const Gradients = {
  hero: ['#0A0A0A', '#10322D'] as const,
  heroGlow: ['rgba(55, 215, 189, 0.35)', 'rgba(55, 215, 189, 0)'] as const,
  teal: ['#37D7BD', '#18A891'] as const,
  coin: ['#FFD25E', '#F5A623'] as const,
};

// Custom fonts ignore fontWeight on Android, so each weight is its own family.
export const Fonts = {
  regular: 'NunitoSans_400Regular',
  semibold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  extrabold: 'NunitoSans_800ExtraBold',
  black: 'NunitoSans_900Black',
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#0A0A0A',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0A0A0A',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;
