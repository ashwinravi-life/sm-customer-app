import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  loadingTitle?: string;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  loadingTitle,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? Colors.background : Colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading && <ActivityIndicator size="small" color={textColor} />}
        <Text style={[styles.text, { color: textColor }]}>
          {loading && loadingTitle ? loadingTitle : title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: 52,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: Colors.foreground },
  outline: { backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.border },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.96 }] },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontFamily: Fonts.bold, fontSize: 16 },
});
