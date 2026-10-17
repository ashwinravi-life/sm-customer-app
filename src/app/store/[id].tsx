import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';

import { IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/store-card';
import { StoreMap } from '@/components/store-map';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { EARN_RULES, stores } from '@/data/mock';
import { callStore, driveTime, formatDistance, hoursLabel, openDirections, SERVICE_META } from '@/lib/stores';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const YOU = { latitude: 13.095, longitude: 80.205 };

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = stores.find((s) => s.id === id);
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const photoWidth = width - Space.xl * 2;

  if (!store) {
    return (
      <Screen title="Store">
        <Text variant="body">This store could not be found.</Text>
      </Screen>
    );
  }

  // Monday = 0 to match the DAYS list.
  const today = (new Date().getDay() + 6) % 7;
  const share = () =>
    Share.share({
      message: `${store.name}\n${store.address}, ${store.city}\nCall: ${store.phone}\nhttps://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`,
    });

  return (
    <Screen title={store.code}>
      {/* Photo carousel */}
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={[styles.carousel, { width: photoWidth }]}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / photoWidth))}
        >
          {store.photos.map((uri) => (
            <Image key={uri} source={{ uri }} style={{ width: photoWidth, height: 230 }} contentFit="cover" transition={250} />
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {store.photos.map((uri, i) => (
            <View key={uri} style={[styles.dotIndicator, i === page && styles.dotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.gapSm}>
        <Text variant="h1">{store.name}</Text>
        <Text variant="caption">
          {store.address}, {store.city}
        </Text>
        <View style={styles.metaRow}>
          <StatusPill store={store} />
          <View style={styles.meta}>
            <Icon name="car-outline" size={15} color={Colors.textMuted} />
            <Text variant="caption">
              {formatDistance(store.distanceKm)} · {driveTime(store.distanceKm)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Directions" icon="navigate" size="md" style={styles.flex} onPress={() => openDirections(store)} />
        <Button title="Call" icon="call-outline" variant="outline" size="md" style={styles.flex} onPress={() => callStore(store)} />
        <Button title="Share" icon="share-outline" variant="outline" size="md" style={styles.flex} onPress={share} />
      </View>

      {store.services.includes('Eye test') ? (
        <Card style={styles.eyeTest}>
          <IconBubble name="eye" color={Colors.purple} background={Colors.purpleSoft} />
          <View style={styles.flex}>
            <Text variant="h3">Free eye test here</Text>
            <Text variant="caption">Computerised test by a qualified optometrist. Walk in anytime.</Text>
          </View>
          <View style={styles.earn}>
            <Coin size={18} />
            <Text variant="captionStrong">+{EARN_RULES.eyeTest}</Text>
          </View>
        </Card>
      ) : null}

      <Card style={styles.gap}>
        <Text variant="h3">Services</Text>
        {store.services.map((s) => (
          <View key={s} style={styles.row}>
            <IconBubble name={SERVICE_META[s].icon} color={Colors.tealDeep} background={Colors.tealSoft} size={38} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{s}</Text>
              <Text variant="caption">{SERVICE_META[s].note}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.gapSm}>
        <Text variant="h3">Opening hours</Text>
        {DAYS.map((day, i) => (
          <View key={day} style={[styles.hoursRow, i === today && styles.hoursToday]}>
            <Text variant={i === today ? 'bodyStrong' : 'body'}>{i === today ? `${day} (today)` : day}</Text>
            <Text variant={i === today ? 'bodyStrong' : 'body'}>{hoursLabel(store)}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.map}>
        <StoreMap stores={[store]} you={YOU} selectedId={store.id} onSelect={() => {}} />
      </View>

      <View style={styles.phone}>
        <Icon name="call" size={16} color={Colors.textMuted} />
        <Text variant="caption">+91 {store.phone}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  gapSm: { gap: Space.sm },
  carousel: { borderRadius: Radius.xl, backgroundColor: Colors.border },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Space.sm },
  dotIndicator: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { width: 20, backgroundColor: Colors.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md, flexWrap: 'wrap', marginTop: Space.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actions: { flexDirection: 'row', gap: Space.sm },
  eyeTest: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  earn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.coinSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: Space.sm, borderRadius: Radius.sm },
  hoursToday: { backgroundColor: Colors.tealSoft },
  map: { height: 200, borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.border },
  phone: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
