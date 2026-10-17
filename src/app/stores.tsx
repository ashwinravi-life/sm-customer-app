import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StoreCard } from '@/components/store-card';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { stores } from '@/data/mock';

export default function StoresScreen() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = [...stores]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .filter((s) => !q || `${s.name} ${s.address} ${s.city}`.toLowerCase().includes(q));

  return (
    <Screen title="Nearby stores">
      <View style={styles.search}>
        <Icon name="search" size={20} color={Colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search area or city"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          accessibilityLabel="Search stores"
        />
      </View>
      <View style={styles.locationRow}>
        <Icon name="navigate-circle" size={18} color={Colors.tealDeep} />
        <Text variant="caption">Sorted by distance from Anna Nagar, Chennai</Text>
      </View>
      <View style={styles.list}>
        {visible.map((store, i) => (
          <StoreCard key={store.id} store={store} nearest={i === 0 && !q} />
        ))}
        {visible.length === 0 ? <Text variant="caption">No stores match “{query}”.</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Space.lg,
    height: 52,
  },
  input: { flex: 1, fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -Space.sm },
  list: { gap: Space.lg },
});
