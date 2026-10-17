import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { tap } from '@/lib/haptics';

interface ScreenProps {
  children: ReactNode;
  // Stack screens get a back button and title; tab screens pass their own header.
  title?: string;
  right?: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
}

export function Screen({
  children,
  title,
  right,
  scroll = true,
  contentStyle,
  background = Colors.background,
}: ScreenProps) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: background }]} edges={['top', 'left', 'right']}>
      {title ? <StackHeader title={title} right={right} /> : null}
      {body}
    </SafeAreaView>
  );
}

function StackHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={10}
        onPress={() => {
          tap();
          router.back();
        }}
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
      >
        <Icon name="chevron-back" size={22} />
      </Pressable>
      <Text variant="h2" numberOfLines={1} style={styles.headerTitle}>
        {title}
      </Text>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Space.xl, paddingBottom: 120, gap: Space.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingHorizontal: Space.lg,
    paddingTop: Space.sm,
    paddingBottom: Space.xs,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1 },
  headerRight: { minWidth: 40, alignItems: 'flex-end' },
});
