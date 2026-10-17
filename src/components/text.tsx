import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'captionStrong'
  | 'overline';

export interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Text({ variant = 'body', color, align, style, ...props }: TextProps) {
  return (
    <RNText
      style={[styles[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontFamily: Fonts.black, fontSize: 40, lineHeight: 46, color: Colors.text, letterSpacing: -1 },
  h1: { fontFamily: Fonts.extrabold, fontSize: 28, lineHeight: 34, color: Colors.text, letterSpacing: -0.5 },
  h2: { fontFamily: Fonts.extrabold, fontSize: 20, lineHeight: 26, color: Colors.text },
  h3: { fontFamily: Fonts.bold, fontSize: 16, lineHeight: 22, color: Colors.text },
  body: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22, color: Colors.text },
  bodyStrong: { fontFamily: Fonts.bold, fontSize: 15, lineHeight: 22, color: Colors.text },
  caption: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 18, color: Colors.textMuted },
  captionStrong: { fontFamily: Fonts.bold, fontSize: 13, lineHeight: 18, color: Colors.text },
  overline: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
});
