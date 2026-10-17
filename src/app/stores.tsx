import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { StoreCard } from '@/components/store-card';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Shadow, Space } from '@/constants/theme';
import { stores } from '@/data/mock';
import type { Store } from '@/data/types';
import { select } from '@/lib/haptics';

type View_ = 'list' | 'map';

// Prototype: a fixed "you are here" in Anna Nagar until real location is added.
const YOU = { latitude: 13.095, longitude: 80.205 };
const CHENNAI = { latitude: 13.04, longitude: 80.212, latitudeDelta: 0.16, longitudeDelta: 0.16 };

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

function StorePin({ active }: { active: boolean }) {
  return (
    <View style={styles.pinWrap}>
      <View style={[styles.pin, active && styles.pinActive]}>
        <Icon name="glasses" size={18} color={active ? Colors.ink : Colors.teal} />
      </View>
      <View style={[styles.pinTip, active && styles.pinTipActive]} />
    </View>
  );
}

function StoresMap({ list }: { list: Store[] }) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string>(list[0]?.id ?? '');
  const selected = list.find((s) => s.id === selectedId);

  return (
    <View style={styles.mapWrap}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={CHENNAI} toolbarEnabled={false} showsPointsOfInterests={false}>
        <Marker coordinate={YOU} anchor={{ x: 0.5, y: 0.5 }} title="You are here">
          <View style={styles.you}>
            <View style={styles.youDot} />
          </View>
        </Marker>
        {list.map((store) => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => {
              select();
              setSelectedId(store.id);
            }}
          >
            <StorePin active={store.id === selectedId} />
          </Marker>
        ))}
      </MapView>

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
  const visible = [...stores]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .filter((s) => !q || `${s.name} ${s.address} ${s.city}`.toLowerCase().includes(q));

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
  pinWrap: { alignItems: 'center' },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
    ...Shadow.raised,
  },
  pinActive: { backgroundColor: Colors.teal, width: 48, height: 48, borderRadius: 24 },
  pinTip: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.ink,
  },
  pinTipActive: { borderTopColor: Colors.teal },
  you: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(43, 184, 240, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.sky, borderWidth: 2, borderColor: Colors.surface },
});
