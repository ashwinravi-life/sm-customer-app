import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconBubble, ProgressBar, SectionHeader } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { CoinStatement } from '@/components/coin-statement';
import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Gradients, Radius, Space } from '@/constants/theme';
import { EARN_RULES, TIERS } from '@/data/mock';
import { useAppState } from '@/lib/app-state';
import { formatNumber, formatRupees } from '@/lib/format';
import { tap } from '@/lib/haptics';

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
        <SectionHeader title="Coin statement" />
        <CoinStatement entries={coinEntries} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
});
