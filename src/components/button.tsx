import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius } from '@/constants/theme';
import { tap } from '@/lib/haptics';

type Variant = 'primary' | 'teal' | 'outline' | 'ghost' | 'light';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  loadingTitle?: string;
  style?: ViewStyle;
}

const VARIANTS: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: Colors.ink, fg: Colors.textOnDark },
  teal: { bg: Colors.teal, fg: Colors.ink },
  outline: { bg: Colors.surface, fg: Colors.text, border: Colors.border },
  ghost: { bg: 'transparent', fg: Colors.tealDeep },
  light: { bg: 'rgba(255, 255, 255, 0.14)', fg: Colors.textOnDark },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled,
  loading,
  loadingTitle,
  style,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
        inactive && styles.inactive,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={v.fg} />
        ) : icon ? (
          <Icon name={icon} size={size === 'lg' ? 20 : 18} color={v.fg} />
        ) : null}
        <Text variant="bodyStrong" color={v.fg} style={size === 'lg' ? styles.lgText : undefined}>
          {loading && loadingTitle ? loadingTitle : title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  lg: { height: 54 },
  md: { height: 44 },
  lgText: { fontSize: 16 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inactive: { opacity: 0.45 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
});
