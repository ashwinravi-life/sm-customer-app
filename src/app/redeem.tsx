import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { useAppState, useCustomer, type Redemption } from '@/lib/app-state';
import { formatNumber, formatRupees } from '@/lib/format';
import { select, success } from '@/lib/haptics';

const AMOUNTS = [100, 250, 500, 1000];
const MIN_REDEEM = 100;

function useSecondsLeft(expiresAt: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return Math.max(0, Math.round((expiresAt - now) / 1000));
}

function CloseButton() {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={() => router.back()} style={styles.close}>
      <Icon name="close" size={22} />
    </Pressable>
  );
}

function RedemptionCode({ redemption, onDone }: { redemption: Redemption; onDone: () => void }) {
  const customer = useCustomer();
  const seconds = useSecondsLeft(redemption.expiresAt);
  const expired = seconds === 0;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <View style={styles.body}>
      <View style={styles.headerText}>
        <Text variant="h1">{expired ? 'Code expired' : 'Show this at billing'}</Text>
        <Text variant="caption">
          {expired
            ? 'Your coins are safe. Generate a new code when you are at the counter.'
            : `The cashier scans it to take ${formatRupees(redemption.coins)} off your bill.`}
        </Text>
      </View>

      <Card style={[styles.codeCard, expired && styles.expired]}>
        <QRCode
          value={`SMREDEEM:${customer.customerId}:${redemption.code}:${redemption.coins}`}
          size={180}
          color={Colors.ink}
          backgroundColor={Colors.surface}
        />
        <Text style={styles.code}>{redemption.code}</Text>
        <View style={styles.amountRow}>
          <Coin size={22} />
          <Text variant="h3">{formatNumber(redemption.coins)} coins = {formatRupees(redemption.coins)} off</Text>
        </View>
        <View style={[styles.timer, expired && styles.timerExpired]}>
          <Icon name="time-outline" size={16} color={expired ? Colors.danger : Colors.tealDeep} />
          <Text variant="captionStrong" color={expired ? Colors.danger : Colors.tealDeep}>
            {expired ? 'Expired' : `Valid for ${mm}:${ss}`}
          </Text>
        </View>
      </Card>

      <Button title="Done" onPress={onDone} />
    </View>
  );
}

export default function RedeemScreen() {
  const { coinBalance, activeRedemption, redeemCoins, clearRedemption } = useAppState();
  const options = AMOUNTS.filter((a) => a <= coinBalance);
  const [amount, setAmount] = useState(options[options.length - 1] ?? 0);
  const [showCode, setShowCode] = useState(
    () => activeRedemption !== null && activeRedemption.expiresAt > Date.now(),
  );

  const generate = () => {
    redeemCoins(amount);
    success();
    setShowCode(true);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Text variant="h2">Redeem SM Coins</Text>
        <CloseButton />
      </View>

      {showCode && activeRedemption ? (
        <RedemptionCode
          redemption={activeRedemption}
          onDone={() => {
            clearRedemption();
            router.back();
          }}
        />
      ) : (
        <View style={styles.body}>
          <Card style={styles.balance}>
            <Coin size={44} />
            <View>
              <Text variant="caption">Available</Text>
              <Text variant="h1">{formatNumber(coinBalance)}</Text>
            </View>
          </Card>

          {coinBalance < MIN_REDEEM ? (
            <Text variant="body">You need at least {MIN_REDEEM} coins to redeem. Keep earning!</Text>
          ) : (
            <>
              <View style={styles.gap}>
                <Text variant="overline">How many coins?</Text>
                <View style={styles.amounts}>
                  {options.map((a) => {
                    const active = a === amount;
                    return (
                      <Pressable
                        key={a}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        onPress={() => {
                          select();
                          setAmount(a);
                        }}
                        style={[styles.amount, active && styles.amountActive]}
                      >
                        <Text variant="h2" color={active ? Colors.textOnDark : Colors.text}>
                          {formatNumber(a)}
                        </Text>
                        <Text variant="caption" color={active ? Colors.textOnDarkMuted : Colors.textMuted}>
                          {formatRupees(a)} off
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Card style={styles.summary}>
                <Icon name="information-circle" size={20} color={Colors.tealDeep} />
                <Text variant="caption" style={styles.flex}>
                  You’ll get a code valid for 15 minutes. Generate it when you’re at the billing counter.
                </Text>
              </Card>

              <Button title={`Get code for ${formatRupees(amount)} off`} icon="flash" onPress={generate} disabled={!amount} />
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  gap: { gap: Space.md },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.xl,
    paddingVertical: Space.md,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, padding: Space.xl, gap: Space.xl },
  headerText: { gap: Space.xs },
  balance: { flexDirection: 'row', alignItems: 'center', gap: Space.lg },
  amounts: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.md },
  amount: {
    width: '47%',
    flexGrow: 1,
    padding: Space.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  amountActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  summary: { flexDirection: 'row', gap: Space.sm, alignItems: 'center' },
  codeCard: { alignItems: 'center', gap: Space.lg, paddingVertical: Space.xxl },
  expired: { opacity: 0.5 },
  code: { fontFamily: Fonts.black, fontSize: 34, letterSpacing: 8, color: Colors.text },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.tealSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  timerExpired: { backgroundColor: Colors.coralSoft },
});
