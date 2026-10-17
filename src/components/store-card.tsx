import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import type { Store } from '@/data/types';
import { tap } from '@/lib/haptics';
import { callStore, formatDistance, openDirections, shareStore } from '@/lib/stores';

function ActionButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
    >
      <Icon name={icon} size={16} color={Colors.text} />
      <Text variant="captionStrong">{label}</Text>
    </Pressable>
  );
}

export function StoreCard({ store, nearest }: { store: Store; nearest?: boolean }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          {nearest ? (
            <Text variant="overline" color={Colors.tealDeep}>
              Nearest to you
            </Text>
          ) : null}
          <Text variant="h3">{store.name}</Text>
          <Text variant="caption">
            {store.address}, {store.city}
          </Text>
        </View>
        <View style={styles.distance}>
          <Text variant="captionStrong">{formatDistance(store.distanceKm)}</Text>
        </View>
      </View>

      <Button
        title="Book eye test"
        icon="calendar-outline"
        size="md"
        onPress={() => router.push({ pathname: '/book', params: { store: store.id } })}
      />

      <View style={styles.actions}>
        <ActionButton icon="navigate-outline" label="Directions" onPress={() => openDirections(store)} />
        <ActionButton icon="call-outline" label="Call" onPress={() => callStore(store)} />
        <ActionButton icon="share-social-outline" label="Share" onPress={() => shareStore(store)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Space.md },
  header: { flexDirection: 'row', gap: Space.md },
  titleBlock: { flex: 1, gap: 2 },
  distance: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.tealSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  actions: { flexDirection: 'row', gap: Space.sm },
  action: {
    flex: 1,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
