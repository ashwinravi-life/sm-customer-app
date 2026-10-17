import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chips, IconBubble } from '@/components/bits';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import type { CoinEntry, CoinSource } from '@/data/types';
import { formatDate, formatNumber } from '@/lib/format';

type Filter = 'all' | 'earned' | 'used';

const SOURCE_STYLE: Record<CoinSource, { icon: IconName; color: string; bg: string }> = {
  purchase: { icon: 'bag-handle', color: Colors.tealDeep, bg: Colors.tealSoft },
  walk_in: { icon: 'walk', color: Colors.sky, bg: Colors.skySoft },
  eye_test: { icon: 'eye', color: Colors.purple, bg: Colors.purpleSoft },
  referral_join: { icon: 'person-add', color: Colors.coral, bg: Colors.coralSoft },
  referral_purchase: { icon: 'gift', color: Colors.coral, bg: Colors.coralSoft },
  redeemed: { icon: 'flash', color: '#B7791F', bg: Colors.coinSoft },
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface Row {
  entry: CoinEntry;
  balanceAfter: number;
}

interface MonthGroup {
  key: string;
  label: string;
  earned: number;
  used: number;
  rows: Row[];
}

// Entries arrive newest first; the balance after each one is the current
// balance minus everything that happened later.
function buildStatement(entries: CoinEntry[]) {
  const balance = entries.reduce((sum, e) => sum + e.points, 0);
  let running = balance;
  const rows: Row[] = entries.map((entry) => {
    const row = { entry, balanceAfter: running };
    running -= entry.points;
    return row;
  });

  const groups: MonthGroup[] = [];
  for (const row of rows) {
    const [y, m] = row.entry.date.split('-').map(Number);
    const key = `${y}-${m}`;
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, label: `${MONTHS[m - 1]} ${y}`, earned: 0, used: 0, rows: [] };
      groups.push(group);
    }
    if (row.entry.points > 0) group.earned += row.entry.points;
    else group.used -= row.entry.points;
    group.rows.push(row);
  }

  const earned = entries.filter((e) => e.points > 0).reduce((s, e) => s + e.points, 0);
  return { groups, balance, earned, used: earned - balance };
}

export function CoinStatement({ entries }: { entries: CoinEntry[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const { groups, balance, earned, used } = buildStatement(entries);

  const matches = (row: Row) =>
    filter === 'all' ? true : filter === 'earned' ? row.entry.points > 0 : row.entry.points < 0;

  return (
    <View style={styles.root}>
      {/* Earned − used = left, in plain words */}
      <Card style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text variant="caption">Earned</Text>
          <Text variant="h2" color={Colors.success}>
            +{formatNumber(earned)}
          </Text>
        </View>
        <Text variant="h2" color={Colors.textMuted}>
          −
        </Text>
        <View style={styles.summaryItem}>
          <Text variant="caption">Used</Text>
          <Text variant="h2">{formatNumber(used)}</Text>
        </View>
        <Text variant="h2" color={Colors.textMuted}>
          =
        </Text>
        <View style={[styles.summaryItem, styles.summaryLeft]}>
          <Text variant="caption">Left</Text>
          <View style={styles.leftValue}>
            <Coin size={18} />
            <Text variant="h2">{formatNumber(balance)}</Text>
          </View>
        </View>
      </Card>

      <Chips<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'earned', label: 'Earned' },
          { value: 'used', label: 'Used' },
        ]}
      />

      {groups.map((group) => {
        const rows = group.rows.filter(matches);
        if (rows.length === 0) return null;
        return (
          <View key={group.key} style={styles.month}>
            <View style={styles.monthHeader}>
              <Text variant="captionStrong">{group.label}</Text>
              <Text variant="caption">
                {group.earned ? <Text variant="captionStrong" color={Colors.success}>+{formatNumber(group.earned)} in</Text> : null}
                {group.earned && group.used ? '  ·  ' : ''}
                {group.used ? <Text variant="captionStrong">−{formatNumber(group.used)} out</Text> : null}
              </Text>
            </View>
            <Card padded={false}>
              {rows.map(({ entry, balanceAfter }, i) => {
                const s = SOURCE_STYLE[entry.source];
                const earnedEntry = entry.points > 0;
                return (
                  <View key={entry.id} style={[styles.entry, i > 0 && styles.entryBorder]}>
                    <IconBubble name={s.icon} color={s.color} background={s.bg} size={40} />
                    <View style={styles.flex}>
                      <Text variant="bodyStrong" numberOfLines={2}>
                        {entry.title}
                      </Text>
                      <Text variant="caption">
                        {formatDate(entry.date)}
                        {entry.reference ? ` · ${entry.reference}` : ''}
                      </Text>
                    </View>
                    <View style={styles.amounts}>
                      <Text variant="h3" color={earnedEntry ? Colors.success : Colors.text}>
                        {earnedEntry ? '+' : '−'}
                        {formatNumber(Math.abs(entry.points))}
                      </Text>
                      <Text variant="caption">Bal {formatNumber(balanceAfter)}</Text>
                    </View>
                  </View>
                );
              })}
            </Card>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Space.lg },
  flex: { flex: 1 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Space.sm },
  summaryItem: { gap: 2 },
  summaryLeft: {
    backgroundColor: Colors.coinSoft,
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    borderRadius: Radius.md,
  },
  leftValue: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  month: { gap: Space.sm },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  entry: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg },
  entryBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  amounts: { alignItems: 'flex-end', gap: 2 },
});
