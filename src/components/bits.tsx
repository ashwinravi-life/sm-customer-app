import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { initials } from '@/lib/format';
import { select, tap } from '@/lib/haptics';

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="h2">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          onPress={() => {
            tap();
            onAction();
          }}
        >
          <Text variant="captionStrong" color={Colors.tealDeep}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Badge({ label, color, background }: { label: string; color: string; background: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function Avatar({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={{ fontFamily: Fonts.extrabold, fontSize: size * 0.38, color: Colors.textOnDark }}>
        {initials(name)}
      </Text>
    </View>
  );
}

export function ProgressBar({
  progress,
  color = Colors.teal,
  track = Colors.border,
  height = 8,
}: {
  progress: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${clamped * 100}%`, height: '100%', borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

export function IconBubble({
  name,
  color,
  background,
  size = 44,
}: {
  name: IconName;
  color: string;
  background: string;
  size?: number;
}) {
  return (
    <View style={[styles.bubble, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: background }]}>
      <Icon name={name} size={size * 0.5} color={color} />
    </View>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              select();
              onChange(option.value);
            }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Divider({ dashed }: { dashed?: boolean }) {
  return <View style={[styles.divider, dashed && styles.dashed]} />;
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontFamily: Fonts.bold, fontSize: 12 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  bubble: { alignItems: 'center', justifyContent: 'center' },
  chips: { gap: Space.sm, paddingRight: Space.xl },
  chip: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  divider: { height: 1, backgroundColor: Colors.border },
  dashed: { height: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, backgroundColor: 'transparent' },
});
