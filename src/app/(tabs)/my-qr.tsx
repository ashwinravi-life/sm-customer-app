import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Coin } from '@/components/coin';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Fonts, Gradients, Radius, Space } from '@/constants/theme';
import { EARN_RULES } from '@/data/mock';
import { useAppState, useCustomer } from '@/lib/app-state';
import { formatNumber } from '@/lib/format';

const LOGO_ASPECT_RATIO = 1920 / 196;

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export default function MyQrScreen() {
  const customer = useCustomer();
  const { coinBalance, tier } = useAppState();
  const focused = useIsFocused();
  // A ticking clock shows staff this is the live app, not a screenshot.
  const now = useClock();
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View style={styles.root}>
      {focused ? <StatusBar style="light" /> : null}
      <LinearGradient colors={Gradients.hero} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={Gradients.heroGlow} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 0.6 }} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.top}>
          <Image
            source={require('@/assets/images/specsmakers-logo-white.png')}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Specsmakers"
          />
          <Text variant="caption" color={Colors.textOnDarkMuted} align="center">
            Show this at the billing counter
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.flex}>
              <Text variant="h2">{customer.name}</Text>
              <Text variant="caption">Member since {new Date(customer.memberSince).getFullYear()}</Text>
            </View>
            <View style={styles.tier}>
              <Icon name="diamond" size={12} color={Colors.coin} />
              <Text variant="captionStrong" color={Colors.textOnDark}>
                {tier}
              </Text>
            </View>
          </View>

          <View style={styles.qrWrap}>
            <QRCode value={`SMCLUB:${customer.customerId}`} size={220} color={Colors.ink} backgroundColor={Colors.surface} ecl="M" />
          </View>

          <Text style={styles.memberId}>{customer.customerId}</Text>

          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text variant="caption">Live · {time}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Coin size={26} />
            <View>
              <Text variant="h3" color={Colors.textOnDark}>
                {formatNumber(coinBalance)}
              </Text>
              <Text variant="caption" color={Colors.textOnDarkMuted}>
                coins to use
              </Text>
            </View>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerItem}>
            <Icon name="walk" size={24} color={Colors.teal} />
            <View>
              <Text variant="h3" color={Colors.textOnDark}>
                +{EARN_RULES.walkIn}
              </Text>
              <Text variant="caption" color={Colors.textOnDarkMuted}>
                per store visit
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ink },
  safe: { flex: 1, paddingHorizontal: Space.xxl, justifyContent: 'center', gap: Space.xxl, paddingBottom: 90 },
  flex: { flex: 1 },
  top: { alignItems: 'center', gap: Space.sm },
  logo: { height: 22, aspectRatio: LOGO_ASPECT_RATIO },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Space.xxl, alignItems: 'center', gap: Space.lg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: Space.md },
  tier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  qrWrap: { padding: Space.md, borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.border },
  memberId: { fontFamily: Fonts.extrabold, fontSize: 18, letterSpacing: 2, color: Colors.text },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.lg,
    padding: Space.lg,
  },
  footerItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Space.md, justifyContent: 'center' },
  footerDivider: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.15)' },
});
