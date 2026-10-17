import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { select } from '@/lib/haptics';

// Fake optical blur: ghost copies of the text offset around it. Cheap and
// identical on iOS/Android, unlike real blur views.
export function Blurry({ text, amount, style }: { text: string; amount: number; style?: StyleProp<TextStyle> }) {
  if (amount <= 0) return <Text style={style}>{text}</Text>;
  const offsets = [
    [-amount, 0],
    [amount, 0],
    [0, -amount],
    [0, amount],
  ];
  return (
    <View>
      <Text style={[style, { opacity: 0.28 }]}>{text}</Text>
      {offsets.map(([x, y], i) => (
        <Text key={i} style={[style, styles.ghost, { opacity: 0.22, transform: [{ translateX: x }, { translateY: y }] }]}>
          {text}
        </Text>
      ))}
    </View>
  );
}

export interface SceneDistance {
  key: 'far' | 'mid' | 'near';
  icon: IconName;
  label: string;
  sample: string;
}

export const SCENES: SceneDistance[] = [
  { key: 'far', icon: 'car-outline', label: 'Far · road signs', sample: 'EXIT 2 km' },
  { key: 'mid', icon: 'laptop-outline', label: 'Middle · laptop', sample: 'Inbox (3)' },
  { key: 'near', icon: 'book-outline', label: 'Near · reading', sample: 'Once upon a time' },
];

// What a wearer sees at each distance: sharp, slightly soft, or blurred.
export function SceneRows({ clarity }: { clarity: Record<SceneDistance['key'], 'clear' | 'soft' | 'blur'> }) {
  return (
    <View style={styles.scenes}>
      {SCENES.map((scene) => {
        const c = clarity[scene.key];
        return (
          <View key={scene.key} style={styles.scene}>
            <View style={[styles.sceneIcon, c === 'clear' && styles.sceneIconClear]}>
              <Icon name={scene.icon} size={20} color={c === 'clear' ? Colors.tealDeep : Colors.textMuted} />
            </View>
            <View style={styles.flex}>
              <Text variant="caption">{scene.label}</Text>
              <Blurry
                text={scene.sample}
                amount={c === 'clear' ? 0 : c === 'soft' ? 1.2 : 2.6}
                style={styles.sample}
              />
            </View>
            <Icon
              name={c === 'clear' ? 'checkmark-circle' : c === 'soft' ? 'remove-circle' : 'close-circle'}
              size={22}
              color={c === 'clear' ? Colors.success : c === 'soft' ? Colors.coin : Colors.danger}
            />
          </View>
        );
      })}
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              select();
              onChange(o.value);
            }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            {o.icon ? <Icon name={o.icon} size={16} color={active ? Colors.textOnDark : Colors.text} /> : null}
            <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Cross-fades its children whenever `fadeKey` changes.
export function FadeSwap({ fadeKey, children }: { fadeKey: string; children: ReactNode }) {
  const [opacity] = useState(() => new Animated.Value(1));
  useEffect(() => {
    opacity.setValue(0.15);
    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [fadeKey, opacity]);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

export function Caption({ children }: { children: ReactNode }) {
  return (
    <View style={styles.caption}>
      <Icon name="information-circle" size={18} color={Colors.tealDeep} />
      <Text variant="caption" style={styles.flex}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  ghost: { position: 'absolute', left: 0, top: 0 },
  scenes: { gap: Space.sm },
  scene: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Space.md,
  },
  sceneIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneIconClear: { backgroundColor: Colors.tealSoft },
  sample: { fontFamily: Fonts.extrabold, fontSize: 17, color: Colors.text },
  segmented: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: Radius.pill, padding: 4, gap: 4 },
  segment: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: Colors.ink },
  caption: {
    flexDirection: 'row',
    gap: Space.sm,
    alignItems: 'flex-start',
    backgroundColor: Colors.tealSoft,
    borderRadius: Radius.md,
    padding: Space.md,
  },
});
