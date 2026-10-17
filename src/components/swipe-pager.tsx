import { useEffect, useRef, type ReactNode } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { select } from '@/lib/haptics';

interface SwipePagerProps<T> {
  items: T[];
  index: number;
  onIndexChange: (index: number) => void;
  keyOf: (item: T) => string;
  labelOf: (item: T) => string;
  renderPage: (item: T) => ReactNode;
}

// Full-width pages you can swipe between, plus a sticky Prev / dots / Next bar.
export function SwipePager<T>({ items, index, onIndexChange, keyOf, labelOf, renderPage }: SwipePagerProps<T>) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<T>>(null);

  // Follow index changes that come from tabs or the bottom buttons.
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: index * width, animated: true });
  }, [index, width]);

  const go = (i: number) => {
    if (i < 0 || i >= items.length) return;
    select();
    onIndexChange(i);
  };

  const prev = items[index - 1];
  const next = items[index + 1];

  return (
    <View style={styles.flex}>
      <FlatList
        ref={listRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyOf}
        initialScrollIndex={index}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        windowSize={3}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) {
            select();
            onIndexChange(i);
          }
        }}
        renderItem={({ item }) => <View style={{ width }}>{renderPage(item)}</View>}
      />

      <View style={[styles.bar, { paddingBottom: insets.bottom + Space.sm }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={prev ? `Previous: ${labelOf(prev)}` : 'Previous'}
          disabled={!prev}
          onPress={() => go(index - 1)}
          style={[styles.navButton, !prev && styles.disabled]}
        >
          <Icon name="chevron-back" size={18} />
          <Text variant="captionStrong" numberOfLines={1} style={styles.navLabel}>
            {prev ? labelOf(prev) : 'Prev'}
          </Text>
        </Pressable>

        <View style={styles.dots}>
          {items.map((item, i) => (
            <Pressable
              key={keyOf(item)}
              accessibilityRole="button"
              accessibilityLabel={labelOf(item)}
              hitSlop={6}
              onPress={() => go(i)}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={next ? `Next: ${labelOf(next)}` : 'Next'}
          disabled={!next}
          onPress={() => go(index + 1)}
          style={[styles.navButton, styles.navNext, !next && styles.disabled]}
        >
          <Text variant="captionStrong" color={Colors.textOnDark} numberOfLines={1} style={styles.navLabel}>
            {next ? labelOf(next) : 'Next'}
          </Text>
          <Icon name="chevron-forward" size={18} color={Colors.textOnDark} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingHorizontal: Space.lg,
    paddingTop: Space.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    maxWidth: 130,
  },
  navNext: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  navLabel: { flexShrink: 1 },
  disabled: { opacity: 0.35 },
  dots: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { width: 18, backgroundColor: Colors.ink },
});
