import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type Variant = 'title' | 'body' | 'label' | 'muted' | 'error';

export function AppText({ variant = 'body', style, ...props }: TextProps & { variant?: Variant }) {
  return <Text style={[styles.base, styles[variant], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: { color: Colors.foreground, fontFamily: Fonts.regular },
  title: { fontFamily: Fonts.extrabold, fontSize: 28, lineHeight: 34 },
  body: { fontSize: 15, lineHeight: 22 },
  label: { fontFamily: Fonts.semibold, fontSize: 14 },
  muted: { fontSize: 14, lineHeight: 20, color: Colors.mutedForeground },
  error: { fontSize: 14, color: Colors.destructive, textAlign: 'center' },
});
