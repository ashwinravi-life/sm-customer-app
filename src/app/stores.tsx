import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StoreCard } from '@/components/store-card';
import { StoreMap } from '@/components/store-map';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { stores } from '@/data/mock';
import type { Store } from '@/data/types';
import { select } from '@/lib/haptics';

type View_ = 'list' | 'map';

// Prototype: a fixed "you are here" in Anna Nagar until real location is added.
const YOU = { latitude: 13.095, longitude: 80.205 };

function ViewToggle({ value, onChange }: { value: View_; onChange: (v: View_) => void }) {
  const options: { value: View_; label: string; icon: IconName }[] = [
    { value: 'list', label: 'List', icon: 'list' },
    { value: 'map', label: 'Map', icon: 'map' },
  ];
  return (
    <View style={styles.toggle}>
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
            style={[styles.toggleItem, active && styles.toggleActive]}
          >
            <Icon name={o.icon} size={16} color={active ? Colors.textOnDark : Colors.text} />
            <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function StoresMap({ list }: { list: Store[] }) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string>(list[0]?.id ?? '');
  const selected = list.find((s) => s.id === selectedId);

  return (
    <View style={styles.mapWrap}>
      <StoreMap
        stores={list}
        you={YOU}
        selectedId={selectedId}
        onSelect={(id) => {
          select();
          setSelectedId(id);
        }}
      />

      {selected ? (
        <View style={[styles.mapCard, { paddingBottom: insets.bottom + Space.lg }]}>
          <StoreCard store={selected} nearest={selected.id === list[0]?.id} />
        </View>
      ) : null}
    </View>
  );
}

export default function StoresScreen() {
  const [mode, setMode] = useState<View_>('list');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  // Stable per search so the map isn't rebuilt on every tap.
  const visible = useMemo(
    () =>
      [...stores]
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .filter((s) => !q || `${s.name} ${s.address} ${s.city}`.toLowerCase().includes(q)),
    [q],
  );

  return (
    <Screen title="Nearby stores" scroll={false} right={<ViewToggle value={mode} onChange={setMode} />}>
      <View style={styles.searchArea}>
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
      </View>

      {mode === 'map' ? (
        // Re-mount on search so the selected store resets to the nearest match.
        <StoresMap key={q} list={visible} />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {visible.map((store, i) => (
            <StoreCard key={store.id} store={store} nearest={i === 0 && !q} />
          ))}
          {visible.length === 0 ? <Text variant="caption">No stores match “{query}”.</Text> : null}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.pill, padding: 3 },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: Radius.pill,
  },
  toggleActive: { backgroundColor: Colors.ink },
  searchArea: { paddingHorizontal: Space.xl, paddingTop: Space.md, paddingBottom: Space.md, gap: Space.sm },
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
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  list: { padding: Space.xl, paddingTop: Space.sm, paddingBottom: 60, gap: Space.lg },
  mapWrap: { flex: 1 },
  mapCard: { position: 'absolute', left: Space.lg, right: Space.lg, bottom: 0 },
});
