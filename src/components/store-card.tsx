import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Shadow, Space } from '@/constants/theme';
import type { Store } from '@/data/types';
import { tap } from '@/lib/haptics';
import { callStore, driveTime, formatDistance, openDirections, openStatus, SERVICE_META } from '@/lib/stores';

function ActionButton({
  icon,
  label,
  onPress,
  primary,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
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

export function StatusPill({ store }: { store: Store }) {
  const status = openStatus(store);
  return (
    <View style={styles.statusPill}>
      <View style={[styles.dot, { backgroundColor: status.color }]} />
      <Text variant="captionStrong">{status.label}</Text>
    </View>
  );
}

interface StoreCardProps {
  store: Store;
  nearest?: boolean;
  selected?: boolean;
  // When set, tapping the card selects it (e.g. on the map) instead of opening details.
  onSelect?: () => void;
}

export function StoreCard({ store, nearest, selected, onSelect }: StoreCardProps) {
  const openDetails = () => router.push({ pathname: '/store/[id]', params: { id: store.id } });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={store.name}
      onPress={() => {
        tap();
        (onSelect ?? openDetails)();
      }}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}
    >
      <View style={styles.photo}>
        <Image source={{ uri: store.photos[0] }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        <View style={styles.photoTop}>
          <StatusPill store={store} />
          <View style={styles.distancePill}>
            <Icon name="car-outline" size={14} color={Colors.textOnDark} />
            <Text variant="captionStrong" color={Colors.textOnDark}>
              {formatDistance(store.distanceKm)} · {driveTime(store.distanceKm)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {nearest ? (
          <Text variant="overline" color={Colors.tealDeep}>
            Nearest to you
          </Text>
        ) : null}
        <Text variant="h3">{store.name}</Text>
        <Text variant="caption" numberOfLines={2}>
          {store.address}, {store.city}
        </Text>

        <View style={styles.services}>
          {store.services.map((s) => (
            <View key={s} style={styles.service}>
              <Icon name={SERVICE_META[s].icon} size={14} color={Colors.tealDeep} />
              <Text variant="caption" color={Colors.text}>
                {s}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <ActionButton icon="navigate" label="Directions" primary onPress={() => openDirections(store)} />
          <ActionButton icon="call-outline" label="Call" onPress={() => callStore(store)} />
          <ActionButton icon="information-circle-outline" label="Details" onPress={openDetails} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.card,
  },
  cardSelected: { borderColor: Colors.teal },
  pressed: { transform: [{ scale: 0.99 }] },
  photo: { height: 140, backgroundColor: Colors.border },
  photoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: Space.md, gap: Space.sm },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    flexShrink: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(10,10,10,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  body: { padding: Space.lg, gap: 4 },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Space.sm },
  service: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.tealSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  actions: { flexDirection: 'row', gap: Space.sm, marginTop: Space.md },
  action: {
    flex: 1,
    height: 42,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  actionPrimary: { backgroundColor: Colors.ink, borderColor: Colors.ink },
});
