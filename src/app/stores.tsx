import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Chips } from '@/components/bits';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StoreCard } from '@/components/store-card';
import { StoreMap } from '@/components/store-map';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { stores } from '@/data/mock';
import type { StoreService } from '@/data/types';
import { openStatus } from '@/lib/stores';

type Filter = 'all' | 'open' | StoreService;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open now' },
  { value: 'Eye test', label: 'Eye test' },
  { value: 'Kids corner', label: 'Kids corner' },
  { value: 'Contact lens', label: 'Contact lens' },
  { value: 'Repairs', label: 'Repairs' },
];

// Prototype: a fixed "you are here" in Anna Nagar until real location is added.
const YOU = { latitude: 13.095, longitude: 80.205 };

export default function StoresScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const q = query.trim().toLowerCase();

  // Stable per search/filter so the map is only rebuilt when the list changes.
  const visible = useMemo(
    () =>
      [...stores]
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .filter((s) => !q || `${s.name} ${s.address} ${s.city}`.toLowerCase().includes(q))
        .filter((s) =>
          filter === 'all' ? true : filter === 'open' ? openStatus(s).state !== 'closed' : s.services.includes(filter),
        ),
    [q, filter],
  );

  const [pickedId, setSelectedId] = useState('');
  // Fall back to the nearest match when the picked store is filtered out.
  const selectedId = visible.some((s) => s.id === pickedId) ? pickedId : (visible[0]?.id ?? '');
  const listRef = useRef<ScrollView>(null);
  const [cardY, setCardY] = useState<Record<string, number>>({});

  return (
    <Screen title="Stores" scroll={false}>
      <View style={styles.top}>
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
        <Chips<Filter> value={filter} onChange={setFilter} options={FILTERS} />
      </View>

      <View style={styles.mapCard}>
        {visible.length ? (
          <StoreMap
            key={`${q}|${filter}`}
            stores={visible}
            you={YOU}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              listRef.current?.scrollTo({ y: Math.max(0, (cardY[id] ?? 0) - Space.md), animated: true });
            }}
          />
        ) : (
          <View style={styles.mapEmpty}>
            <Icon name="map-outline" size={28} color={Colors.textMuted} />
          </View>
        )}
      </View>

      <ScrollView ref={listRef} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.locationRow}>
          <Icon name="navigate-circle" size={18} color={Colors.tealDeep} />
          <Text variant="caption">
            {visible.length} {visible.length === 1 ? 'store' : 'stores'} · nearest to Anna Nagar, Chennai
          </Text>
        </View>
        {visible.map((store, i) => (
          <View
            key={store.id}
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              setCardY((prev) => (prev[store.id] === y ? prev : { ...prev, [store.id]: y }));
            }}
          >
            <StoreCard
              store={store}
              nearest={i === 0 && !q && filter === 'all'}
              selected={store.id === selectedId}
              onSelect={() => setSelectedId(store.id)}
            />
          </View>
        ))}
        {visible.length === 0 ? (
          <Text variant="caption" align="center">
            No stores match. Try another area or filter.
          </Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: Space.xl, paddingTop: Space.md, gap: Space.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Space.lg,
    height: 50,
  },
  input: { flex: 1, fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text },
  mapCard: {
    height: 210,
    marginHorizontal: Space.xl,
    marginTop: Space.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.border,
  },
  mapEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Space.xl, paddingTop: Space.md, paddingBottom: 60, gap: Space.lg },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
