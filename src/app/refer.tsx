import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';

import { Avatar, Badge, IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Fonts, Gradients, Radius, Space } from '@/constants/theme';
import { EARN_RULES, referrals } from '@/data/mock';
import { useCustomer } from '@/lib/app-state';
import { formatDate, formatNumber } from '@/lib/format';
import { success } from '@/lib/haptics';

const STEPS: { icon: IconName; title: string; reward: string }[] = [
  { icon: 'share-social', title: 'Share your code with a friend', reward: '' },
  { icon: 'person-add', title: 'They join the app with your code', reward: `+${EARN_RULES.referralJoin}` },
  { icon: 'bag-check', title: 'They make their first purchase', reward: `+${EARN_RULES.referralPurchase}` },
];

export default function ReferScreen() {
  const customer = useCustomer();
  const [copied, setCopied] = useState(false);

  const earned = referrals.reduce(
    (sum, r) => sum + EARN_RULES.referralJoin + (r.status === 'purchased' ? EARN_RULES.referralPurchase : 0),
    0,
  );

  const copy = async () => {
    await Clipboard.setStringAsync(customer.referralCode);
    success();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = () =>
    Share.share({
      message: `I get my glasses at Specsmakers. Join the Specsmakers app with my code ${customer.referralCode} and get 100 SM Coins to spend on your first pair!`,
    });

  return (
    <Screen title="Refer & earn">
      <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <LinearGradient colors={Gradients.heroGlow} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <Text variant="overline" color={Colors.teal}>
          Earn up to {EARN_RULES.referralJoin + EARN_RULES.referralPurchase} per friend
        </Text>
        <Text variant="h1" color={Colors.textOnDark}>
          Great vision is better shared.
        </Text>
        <Text variant="caption" color={Colors.textOnDarkMuted}>
          Your friend gets {EARN_RULES.referralJoin} SM Coins to spend on their first pair too.
        </Text>

        <Pressable accessibilityRole="button" accessibilityLabel="Copy referral code" onPress={copy} style={styles.codeBox}>
          <View style={styles.flex}>
            <Text variant="caption" color={Colors.textOnDarkMuted}>
              Your code
            </Text>
            <Text style={styles.code}>{customer.referralCode}</Text>
          </View>
          <View style={[styles.copyPill, copied && styles.copied]}>
            <Icon name={copied ? 'checkmark' : 'copy-outline'} size={16} color={Colors.ink} />
            <Text variant="captionStrong">{copied ? 'Copied' : 'Copy'}</Text>
          </View>
        </Pressable>

        <Button title="Share with friends" icon="logo-whatsapp" variant="teal" onPress={share} />
      </LinearGradient>

      <Card style={styles.gap}>
        <Text variant="h3">How it works</Text>
        {STEPS.map((step, i) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text variant="captionStrong" color={Colors.textOnDark}>
                {i + 1}
              </Text>
            </View>
            <IconBubble name={step.icon} color={Colors.tealDeep} background={Colors.tealSoft} size={38} />
            <Text variant="bodyStrong" style={styles.flex}>
              {step.title}
            </Text>
            {step.reward ? (
              <View style={styles.reward}>
                <Coin size={16} />
                <Text variant="captionStrong">{step.reward}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </Card>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text variant="h1">{referrals.length}</Text>
          <Text variant="caption">Friends joined</Text>
        </Card>
        <Card style={styles.stat}>
          <View style={styles.statValue}>
            <Coin size={24} />
            <Text variant="h1">{formatNumber(earned)}</Text>
          </View>
          <Text variant="caption">Coins earned</Text>
        </Card>
      </View>

      <Card padded={false}>
        <Text variant="h3" style={styles.listTitle}>
          Your referrals
        </Text>
        {referrals.map((r) => (
          <View key={r.id} style={styles.friend}>
            <Avatar name={r.name} color={Colors.purple} size={40} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{r.name}</Text>
              <Text variant="caption">Joined {formatDate(r.joinedOn)}</Text>
            </View>
            {r.status === 'purchased' ? (
              <Badge label={`+${EARN_RULES.referralJoin + EARN_RULES.referralPurchase} earned`} color={Colors.success} background={Colors.successSoft} />
            ) : (
              <Badge label="Awaiting purchase" color={Colors.coral} background={Colors.coralSoft} />
            )}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.lg },
  hero: { borderRadius: Radius.xl, padding: Space.xxl, gap: Space.md, overflow: 'hidden' },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    marginTop: Space.sm,
    padding: Space.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(55, 215, 189, 0.6)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  code: { fontFamily: Fonts.black, fontSize: 26, letterSpacing: 3, color: Colors.textOnDark },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: Radius.pill,
  },
  copied: { backgroundColor: Colors.teal },
  step: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stats: { flexDirection: 'row', gap: Space.md },
  stat: { flex: 1, gap: 2 },
  statValue: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  listTitle: { padding: Space.lg, paddingBottom: Space.sm },
  friend: { flexDirection: 'row', alignItems: 'center', gap: Space.md, paddingHorizontal: Space.lg, paddingVertical: Space.md },
});
