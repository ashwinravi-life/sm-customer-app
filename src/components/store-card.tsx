import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import type { Store } from '@/data/types';
import { tap } from '@/lib/haptics';

function formatDistance(km: number) {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function openDirections(store: Store) {
  const label = encodeURIComponent(store.name);
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${store.latitude},${store.longitude}&q=${label}`
      : `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
  Linking.openURL(url);
}

function ActionButton({ icon, label, onPress, primary }: { icon: IconName; label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.action, primary && styles.actionPrimary, pressed && { opacity: 0.8 }]}
    >
      <Icon name={icon} size={16} color={primary ? Colors.textOnDark : Colors.text} />
      <Text variant="captionStrong" color={primary ? Colors.textOnDark : Colors.text}>
        {label}
      </Text>
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

      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Icon name="time-outline" size={15} color={Colors.textMuted} />
          <Text variant="caption">{store.hours}</Text>
        </View>
      </View>

      <View style={styles.services}>
        {store.services.map((service) => (
          <View key={service} style={styles.service}>
            <Text variant="caption" color={Colors.text}>
              {service}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <ActionButton icon="call-outline" label="Call" onPress={() => Linking.openURL(`tel:${store.phone}`)} />
        <ActionButton icon="navigate" label="Directions" primary onPress={() => openDirections(store)} />
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
  metaRow: { flexDirection: 'row' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  service: { backgroundColor: Colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  actions: { flexDirection: 'row', gap: Space.sm },
  action: {
    flex: 1,
    height: 42,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionPrimary: { backgroundColor: Colors.ink, borderColor: Colors.ink },
});
