import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';

import { Avatar, Badge } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { family } from '@/data/mock';
import type { FamilyMember, Prescription, RxEye } from '@/data/types';
import { daysUntil, formatDate } from '@/lib/format';
import { select } from '@/lib/haptics';

const COLUMNS: { key: keyof RxEye; label: string }[] = [
  { key: 'sph', label: 'SPH' },
  { key: 'cyl', label: 'CYL' },
  { key: 'axis', label: 'AXIS' },
  { key: 'add', label: 'ADD' },
  { key: 'va', label: 'VA' },
];

function RxTable({ rx }: { rx: Prescription }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tr, styles.thead]}>
        <Text style={[styles.th, styles.eyeCol]}>Eye</Text>
        {COLUMNS.map((c) => (
          <Text key={c.key} style={styles.th}>
            {c.label}
          </Text>
        ))}
      </View>
      {(['right', 'left'] as const).map((side) => (
        <View key={side} style={styles.tr}>
          <View style={styles.eyeCol}>
            <Text variant="captionStrong">{side === 'right' ? 'Right' : 'Left'}</Text>
            <Text variant="caption">{side === 'right' ? 'OD' : 'OS'}</Text>
          </View>
          {COLUMNS.map((c) => (
            <Text key={c.key} style={styles.td}>
              {rx[side][c.key]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function shareRx(member: FamilyMember, rx: Prescription) {
  const line = (label: string, eye: RxEye) =>
    `${label}: SPH ${eye.sph}, CYL ${eye.cyl}, AXIS ${eye.axis}, ADD ${eye.add}, VA ${eye.va}`;
  Share.share({
    message: [
      `Specsmakers prescription for ${member.name}`,
      `${formatDate(rx.date)} · ${rx.store} · ${rx.optometrist}`,
      line('Right (OD)', rx.right),
      line('Left (OS)', rx.left),
      `PD: ${rx.pd} mm`,
    ].join('\n'),
  });
}

function DueBadge({ due }: { due: string }) {
  const days = daysUntil(due);
  if (days < 0) return <Badge label="Eye test overdue" color={Colors.danger} background={Colors.coralSoft} />;
  if (days <= 30) return <Badge label={`Eye test in ${days} days`} color={Colors.coral} background={Colors.coralSoft} />;
  return <Badge label={`Next test ${formatDate(due)}`} color={Colors.tealDeep} background={Colors.tealSoft} />;
}

export default function PrescriptionsScreen() {
  const params = useLocalSearchParams<{ member?: string }>();
  const [memberId, setMemberId] = useState(params.member ?? family[0].id);
  const member = family.find((m) => m.id === memberId) ?? family[0];
  const [latest, ...older] = member.prescriptions;

  return (
    <Screen title="Prescriptions">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.members} style={styles.bleed}>
        {family.map((m) => {
          const active = m.id === member.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                select();
                setMemberId(m.id);
              }}
              style={[styles.member, active && styles.memberActive]}
            >
              <Avatar name={m.name} color={m.avatarColor} size={38} />
              <View>
                <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
                  {m.name.split(' ')[0]}
                </Text>
                <Text variant="caption" color={active ? Colors.textOnDarkMuted : Colors.textMuted}>
                  {m.relation} · {m.age}y
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {latest ? (
        <Card style={styles.gap}>
          <View style={styles.rowBetween}>
            <View>
              <Text variant="overline" color={Colors.tealDeep}>
                Latest · {latest.type}
              </Text>
              <Text variant="h2">{formatDate(latest.date)}</Text>
            </View>
            <DueBadge due={latest.nextExamDue} />
          </View>

          <RxTable rx={latest} />

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text variant="caption">Pupillary distance</Text>
              <Text variant="bodyStrong">{latest.pd} mm</Text>
            </View>
            <View style={styles.metaItem}>
              <Text variant="caption">Tested by</Text>
              <Text variant="bodyStrong">{latest.optometrist}</Text>
            </View>
          </View>
          <View style={styles.storeRow}>
            <Icon name="storefront-outline" size={16} color={Colors.textMuted} />
            <Text variant="caption">{latest.store}</Text>
          </View>

          <View style={styles.actions}>
            <Button title="Share" icon="share-outline" variant="outline" size="md" style={styles.flex} onPress={() => shareRx(member, latest)} />
            <Button title="Book eye test" icon="calendar-outline" size="md" style={styles.flex} onPress={() => router.push('/book')} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text variant="body">No prescriptions yet for {member.name.split(' ')[0]}.</Text>
        </Card>
      )}

      {older.length ? (
        <View style={styles.gap}>
          <Text variant="h2">Previous</Text>
          {older.map((rx) => (
            <Card key={rx.id} style={styles.gap}>
              <View style={styles.rowBetween}>
                <Text variant="h3">{formatDate(rx.date)}</Text>
                <Text variant="caption">{rx.optometrist}</Text>
              </View>
              <RxTable rx={rx} />
            </Card>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.lg },
  bleed: { marginHorizontal: -Space.xl, flexGrow: 0 },
  members: { gap: Space.sm, paddingHorizontal: Space.xl },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  memberActive: { backgroundColor: Colors.ink },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Space.sm },
  table: { borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 },
  thead: { backgroundColor: Colors.background, paddingVertical: 8 },
  th: { flex: 1, fontFamily: Fonts.bold, fontSize: 11, letterSpacing: 0.8, color: Colors.textMuted, textAlign: 'center' },
  td: { flex: 1, fontFamily: Fonts.extrabold, fontSize: 15, color: Colors.text, textAlign: 'center' },
  eyeCol: { width: 52, flex: 0, textAlign: 'left' },
  metaGrid: { flexDirection: 'row', gap: Space.md },
  metaItem: { flex: 1, backgroundColor: Colors.background, borderRadius: Radius.md, padding: Space.md, gap: 2 },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actions: { flexDirection: 'row', gap: Space.sm },
});
