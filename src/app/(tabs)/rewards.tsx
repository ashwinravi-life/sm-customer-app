import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Chips, IconBubble, ProgressBar, SectionHeader } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Gradients, Radius, Space } from '@/constants/theme';
import { EARN_RULES, TIERS } from '@/data/mock';
import type { CoinSource } from '@/data/types';
import { useAppState } from '@/lib/app-state';
import { formatDate, formatNumber, formatRupees } from '@/lib/format';
import { tap } from '@/lib/haptics';

type Filter = 'all' | 'earned' | 'redeemed';

const SOURCE_STYLE: Record<CoinSource, { icon: IconName; color: string; bg: string }> = {
  purchase: { icon: 'bag-handle', color: Colors.tealDeep, bg: Colors.tealSoft },
  walk_in: { icon: 'walk', color: Colors.sky, bg: Colors.skySoft },
  eye_test: { icon: 'eye', color: Colors.purple, bg: Colors.purpleSoft },
  referral_join: { icon: 'person-add', color: Colors.coral, bg: Colors.coralSoft },
  referral_purchase: { icon: 'gift', color: Colors.coral, bg: Colors.coralSoft },
  redeemed: { icon: 'flash', color: '#B7791F', bg: Colors.coinSoft },
};

const WAYS_TO_EARN: { icon: IconName; title: string; value: string; color: string; bg: string; onPress?: () => void }[] = [
  { icon: 'bag-handle', title: 'Every purchase', value: `${EARN_RULES.purchasePercent}% back`, color: Colors.tealDeep, bg: Colors.tealSoft },
  { icon: 'walk', title: 'Store visit', value: `+${EARN_RULES.walkIn}`, color: Colors.sky, bg: Colors.skySoft },
  { icon: 'eye', title: 'Eye test', value: `+${EARN_RULES.eyeTest}`, color: Colors.purple, bg: Colors.purpleSoft },
  {
    icon: 'gift',
    title: 'Refer a friend',
    value: `+${EARN_RULES.referralJoin + EARN_RULES.referralPurchase}`,
    color: Colors.coral,
    bg: Colors.coralSoft,
    onPress: () => router.push('/refer'),
  },
];

export default function RewardsScreen() {
  const { coinBalance, lifetimeCoins, tier, nextTier, coinEntries } = useAppState();
  const [filter, setFilter] = useState<Filter>('all');

  const entries = coinEntries.filter((e) =>
    filter === 'all' ? true : filter === 'earned' ? e.points > 0 : e.points < 0,
  );

  return (
    <Screen>
      <Text variant="h1">Rewards</Text>

      {/* Balance */}
      <LinearGradient colors={Gradients.coin} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Text variant="overline" color="#7A4B00">
            SM Coins balance
          </Text>
          <Coin size={34} />
        </View>
        <Text variant="display">{formatNumber(coinBalance)}</Text>
        <Text variant="captionStrong" color="#7A4B00">
          1 coin = ₹1 · Worth {formatRupees(coinBalance)} at any store
        </Text>
        <Button title="Redeem coins" icon="flash" style={styles.redeem} onPress={() => router.push('/redeem')} />
      </LinearGradient>

      {/* Tier */}
      <Card style={styles.gap}>
        <View style={styles.rowBetween}>
          <Text variant="h3">SM Club tier</Text>
          <Text variant="caption">{formatNumber(lifetimeCoins)} lifetime coins</Text>
        </View>
        <View style={styles.tiers}>
          {TIERS.map((t) => {
            const reached = lifetimeCoins >= t.minLifetimeCoins;
            const current = t.tier === tier;
            return (
              <View key={t.tier} style={[styles.tierStep, current && styles.tierCurrent]}>
                <Icon name="diamond" size={18} color={reached ? Colors.coin : Colors.border} />
                <Text variant="captionStrong" color={reached ? Colors.text : Colors.textMuted}>
                  {t.tier}
                </Text>
                <Text variant="caption">{formatNumber(t.minLifetimeCoins)}+</Text>
              </View>
            );
          })}
        </View>
        {nextTier ? (
          <>
            <ProgressBar progress={nextTier.progress} color={Colors.coin} />
            <Text variant="caption">
              <Text variant="captionStrong">{formatNumber(nextTier.coinsNeeded)} coins</Text> to {nextTier.tier}:
              extra 2% back on every purchase and priority lens processing.
            </Text>
          </>
        ) : (
          <Text variant="caption">You’re at the top tier. Enjoy the perks!</Text>
        )}
      </Card>

      {/* Ways to earn */}
      <View style={styles.section}>
        <SectionHeader title="Ways to earn" />
        <View style={styles.earnGrid}>
          {WAYS_TO_EARN.map((way) => (
            <Pressable
              key={way.title}
              disabled={!way.onPress}
              onPress={() => {
                tap();
                way.onPress?.();
              }}
              style={({ pressed }) => [styles.earnTile, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <IconBubble name={way.icon} color={way.color} background={way.bg} size={40} />
              <Text variant="h2">{way.value}</Text>
              <Text variant="caption">{way.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* History */}
      <View style={styles.section}>
        <SectionHeader title="Coin history" />
        <Chips<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'earned', label: 'Earned' },
            { value: 'redeemed', label: 'Redeemed' },
          ]}
        />
        <Card padded={false}>
          {entries.map((entry, i) => {
            const s = SOURCE_STYLE[entry.source];
            const earned = entry.points > 0;
            return (
              <View key={entry.id} style={[styles.entry, i > 0 && styles.entryBorder]}>
                <IconBubble name={s.icon} color={s.color} background={s.bg} size={40} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {entry.title}
                  </Text>
                  <Text variant="caption">
                    {formatDate(entry.date)}
                    {entry.reference ? ` · ${entry.reference}` : ''}
                  </Text>
                </View>
                <Text variant="h3" color={earned ? Colors.success : Colors.text}>
                  {earned ? '+' : '−'}
                  {formatNumber(Math.abs(entry.points))}
                </Text>
              </View>
            );
          })}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceCard: { borderRadius: Radius.xl, padding: Space.xxl, gap: Space.xs },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  redeem: { marginTop: Space.lg },
  tiers: { flexDirection: 'row', gap: Space.sm },
  tierStep: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Space.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
  },
  tierCurrent: { backgroundColor: Colors.coinSoft, borderWidth: 1.5, borderColor: Colors.coin },
  section: { gap: Space.md },
  earnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.md },
  earnTile: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Space.lg,
    gap: 4,
  },
  entry: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg },
  entryBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
});
