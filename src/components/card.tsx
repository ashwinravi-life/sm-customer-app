import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radius, Shadow, Space } from '@/constants/theme';
import { tap } from '@/lib/haptics';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export function Card({ children, onPress, style, padded = true }: CardProps) {
  const cardStyle = [styles.card, padded && styles.padded, style];

  if (!onPress) return <View style={cardStyle}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, ...Shadow.card },
  padded: { padding: Space.lg },
  pressed: { transform: [{ scale: 0.985 }] },
});
