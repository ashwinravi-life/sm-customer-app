import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { EARN_RULES, family, stores } from '@/data/mock';
import { useAppState } from '@/lib/app-state';
import { formatAppointment, nextDays, slotPeriod, slotsFor, type Slot } from '@/lib/appointments';
import { select, success } from '@/lib/haptics';
import { formatDistance } from '@/lib/stores';

const REASONS = ['Routine check-up', 'Blurry vision', 'New glasses', 'Contact lenses', 'Kids eye test'];
const DAYS_AHEAD = 7;

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={styles.stepBadge}>
          <Text variant="captionStrong" color={Colors.textOnDark}>
            {step}
          </Text>
        </View>
        <Text variant="h3">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function BookScreen() {
  const params = useLocalSearchParams<{ store?: string }>();
  const insets = useSafeAreaInsets();
  const { bookAppointment } = useAppState();

  const nearest = [...stores].sort((a, b) => a.distanceKm - b.distanceKm);
  const [storeId, setStoreId] = useState(params.store ?? nearest[0].id);
  const [choosingStore, setChoosingStore] = useState(false);
  const store = stores.find((s) => s.id === storeId) ?? nearest[0];

  const [memberId, setMemberId] = useState(family[0].id);
  const member = family.find((m) => m.id === memberId) ?? family[0];

  const days = nextDays(DAYS_AHEAD);
  const [date, setDate] = useState(days[0].iso);
  const slots = slotsFor(store, date);
  // If today has no free slots left, the grid shows that; the customer picks another day.
  const [time, setTime] = useState<string | null>(null);
  const chosenSlot = slots.find((s) => s.time === time && s.available);

  const [reason, setReason] = useState<string | null>(null);

  const pickStore = (id: string) => {
    select();
    setStoreId(id);
    setChoosingStore(false);
    setTime(null);
  };

  const confirm = () => {
    if (!chosenSlot) return;
    const appointment = bookAppointment({
      storeId: store.id,
      memberId: member.id,
      memberName: member.name,
      date,
      time: chosenSlot.time,
      reason: reason ?? undefined,
    });
    success();
    router.replace({ pathname: '/appointment/[id]', params: { id: appointment.id, booked: '1' } });
  };

  const periods = (['Morning', 'Afternoon', 'Evening'] as const)
    .map((p) => ({ period: p, slots: slots.filter((s) => slotPeriod(s.time) === p) }))
    .filter((g) => g.slots.length);
  const anyAvailable = slots.some((s) => s.available);

  return (
    <Screen title="Book an eye test" scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.free}>
          <Icon name="eye" size={22} color={Colors.purple} />
          <Text variant="caption" style={styles.flex}>
            Free computerised eye test by a qualified optometrist, about 20 minutes.
          </Text>
          <View style={styles.earn}>
            <Coin size={16} />
            <Text variant="captionStrong">+{EARN_RULES.eyeTest}</Text>
          </View>
        </Card>

        <Section step={1} title="Store">
          <Card style={styles.storeCard}>
            <View style={styles.flex}>
              <Text variant="bodyStrong">{store.name}</Text>
              <Text variant="caption">
                {store.address}, {store.city} · {formatDistance(store.distanceKm)}
              </Text>
            </View>
            <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setChoosingStore(!choosingStore)}>
              <Text variant="captionStrong" color={Colors.tealDeep}>
                {choosingStore ? 'Close' : 'Change'}
              </Text>
            </Pressable>
          </Card>
          {choosingStore ? (
            <Card padded={false}>
              {nearest.map((s, i) => (
                <Pressable
                  key={s.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: s.id === store.id }}
                  onPress={() => pickStore(s.id)}
                  style={[styles.storeOption, i > 0 && styles.divider]}
                >
                  <Icon
                    name={s.id === store.id ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={s.id === store.id ? Colors.tealDeep : Colors.textMuted}
                  />
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{s.name}</Text>
                    <Text variant="caption">
                      {s.city} · {formatDistance(s.distanceKm)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </Card>
          ) : null}
        </Section>

        <Section step={2} title="Who is it for?">
          <View style={styles.wrap}>
            {family.map((m) => {
              const active = m.id === member.id;
              return (
                <Pressable
                  key={m.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  onPress={() => {
                    select();
                    setMemberId(m.id);
                  }}
                  style={[styles.person, active && styles.selected]}
                >
                  <Avatar name={m.name} color={m.avatarColor} size={30} />
                  <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
                    {m.relation === 'Self' ? 'Me' : m.name.split(' ')[0]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section step={3} title="Date">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days} style={styles.bleed}>
            {days.map((d) => {
              const active = d.iso === date;
              return (
                <Pressable
                  key={d.iso}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  onPress={() => {
                    select();
                    setDate(d.iso);
                    setTime(null);
                  }}
                  style={[styles.day, active && styles.selected]}
                >
                  <Text variant="caption" color={active ? Colors.textOnDarkMuted : Colors.textMuted}>
                    {d.label}
                  </Text>
                  <Text variant="h2" color={active ? Colors.textOnDark : Colors.text}>
                    {d.day}
                  </Text>
                  <Text variant="caption" color={active ? Colors.textOnDarkMuted : Colors.textMuted}>
                    {d.month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Section>

        <Section step={4} title="Time">
          {anyAvailable ? (
            periods.map(({ period, slots: group }) => (
              <View key={period} style={styles.period}>
                <Text variant="overline">{period}</Text>
                <View style={styles.wrap}>
                  {group.map((s: Slot) => {
                    const active = s.time === time && s.available;
                    return (
                      <Pressable
                        key={s.time}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: active, disabled: !s.available }}
                        disabled={!s.available}
                        onPress={() => {
                          select();
                          setTime(s.time);
                        }}
                        style={[styles.slot, active && styles.selected, !s.available && styles.slotTaken]}
                      >
                        <Text
                          variant="captionStrong"
                          color={active ? Colors.textOnDark : s.available ? Colors.text : Colors.textMuted}
                          style={!s.available ? styles.struck : undefined}
                        >
                          {s.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))
          ) : (
            <Text variant="caption">No slots left on this day. Please pick another date.</Text>
          )}
        </Section>

        <Section step={5} title="Reason (optional)">
          <View style={styles.wrap}>
            {REASONS.map((r) => {
              const active = r === reason;
              return (
                <Pressable
                  key={r}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    select();
                    setReason(active ? null : r);
                  }}
                  style={[styles.reason, active && styles.selected]}
                >
                  <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Space.md }]}>
        <Text variant="caption" numberOfLines={1}>
          {chosenSlot
            ? `${formatAppointment({ date, time: chosenSlot.time })} · ${store.name.replace('Specsmakers ', '')}`
            : 'Pick a time slot to continue'}
        </Text>
        <Button title="Confirm booking" icon="checkmark-circle" disabled={!chosenSlot} onPress={confirm} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Space.xl, paddingBottom: Space.xxxl, gap: Space.xxl },
  free: { flexDirection: 'row', alignItems: 'center', gap: Space.md, backgroundColor: Colors.purpleSoft },
  earn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  section: { gap: Space.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeCard: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  storeOption: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg },
  divider: { borderTopWidth: 1, borderTopColor: Colors.border },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingLeft: 5,
    paddingRight: 14,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  selected: { backgroundColor: Colors.ink },
  bleed: { marginHorizontal: -Space.xl },
  days: { gap: Space.sm, paddingHorizontal: Space.xl },
  day: {
    width: 64,
    alignItems: 'center',
    paddingVertical: Space.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  period: { gap: Space.sm },
  slot: {
    width: '23%',
    flexGrow: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  slotTaken: { backgroundColor: Colors.background },
  struck: { textDecorationLine: 'line-through' },
  reason: { paddingHorizontal: 14, height: 38, justifyContent: 'center', borderRadius: Radius.pill, backgroundColor: Colors.surface },
  footer: {
    paddingHorizontal: Space.xl,
    paddingTop: Space.md,
    gap: Space.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
