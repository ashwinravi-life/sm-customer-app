import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { CODE_LENGTH, CodeInput } from '@/components/code-input';
import { Screen } from '@/components/screen';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const RESEND_COOLDOWN_SECONDS = 30;
// Prototype only: 123456 is accepted; any other 6 digits mock a wrong code.
const MOCK_CODE = '123456';
const VERIFY_DELAY_MS = 700;

export default function VerifyScreen() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (error) setError('');
  };

  const handleResend = () => {
    setCode('');
    setError('');
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (code === MOCK_CODE) {
        router.replace({ pathname: '/home', params: { mobile } });
      } else {
        setError('Incorrect verification code. Please try again.');
        setCode('');
      }
    }, VERIFY_DELAY_MS);
  };

  return (
    <Screen>
      <View style={styles.heading}>
        <AppText variant="title">Verify Mobile Number</AppText>
        <AppText variant="muted">Enter the 6-digit code sent to</AppText>
        <View style={styles.numberRow}>
          <AppText style={styles.number}>+91 {mobile}</AppText>
          <Pressable
            onPress={() => router.back()}
            disabled={isVerifying}
            accessibilityRole="button"
            hitSlop={8}
          >
            <AppText style={styles.change}>Change</AppText>
          </Pressable>
        </View>
      </View>

      <View style={styles.codeSection}>
        <CodeInput value={code} onChange={handleCodeChange} disabled={isVerifying} />
        {error ? <AppText variant="error">{error}</AppText> : null}
        <AppText variant="muted" style={styles.hint}>
          Prototype: use code {MOCK_CODE}
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton
          variant="outline"
          title={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
          onPress={handleResend}
          disabled={cooldown > 0 || isVerifying}
        />
        <AppButton
          title="Verify"
          loadingTitle="Verifying..."
          onPress={handleVerify}
          disabled={code.length !== CODE_LENGTH}
          loading={isVerifying}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.xs },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xs },
  number: { fontFamily: Fonts.bold, fontSize: 18, letterSpacing: 0.5 },
  change: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.teal, textDecorationLine: 'underline' },
  codeSection: { gap: Spacing.md, paddingVertical: Spacing.sm },
  hint: { textAlign: 'center', fontSize: 12 },
  actions: { flexDirection: 'row', gap: Spacing.md },
});
