import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/button';
import { CODE_LENGTH, CodeInput } from '@/components/code-input';
import { Text } from '@/components/text';
import { Colors, Space } from '@/constants/theme';
import { useAppState } from '@/lib/app-state';
import { error as errorHaptic, success } from '@/lib/haptics';

const RESEND_COOLDOWN_SECONDS = 30;
// Prototype only: 123456 is accepted; any other code mocks a wrong one.
const MOCK_CODE = '123456';
const VERIFY_DELAY_MS = 700;

export default function VerifyScreen() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const { signIn } = useAppState();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verify = (value: string) => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (value === MOCK_CODE) {
        success();
        signIn(mobile);
      } else {
        errorHaptic();
        setError('That code is incorrect. Please try again.');
        setCode('');
      }
    }, VERIFY_DELAY_MS);
  };

  // Verify as soon as the sixth digit lands, like most banking apps.
  const handleChange = (value: string) => {
    setCode(value);
    if (error) setError('');
    if (value.length === CODE_LENGTH && !verifying) verify(value);
  };

  return (
    <AuthShell compact>
      <View style={styles.heading}>
        <Text variant="h1">Enter code</Text>
        <Text variant="caption">Sent by SMS to</Text>
        <View style={styles.numberRow}>
          <Text variant="h3">+91 {mobile}</Text>
          <Pressable accessibilityRole="button" hitSlop={10} onPress={() => router.back()} disabled={verifying}>
            <Text variant="captionStrong" color={Colors.tealDeep}>
              Change
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.codeBlock}>
        <CodeInput value={code} onChange={handleChange} disabled={verifying} hasError={!!error} />
        {error ? (
          <Text variant="caption" color={Colors.danger} align="center">
            {error}
          </Text>
        ) : null}
      </View>

      <Button
        title="Verify"
        loadingTitle="Verifying…"
        loading={verifying}
        disabled={code.length !== CODE_LENGTH}
        onPress={() => verify(code)}
      />

      <View style={styles.resendRow}>
        <Text variant="caption">Didn’t get it?</Text>
        {cooldown > 0 ? (
          <Text variant="captionStrong">Resend in 0:{String(cooldown).padStart(2, '0')}</Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => {
              setCode('');
              setError('');
              setCooldown(RESEND_COOLDOWN_SECONDS);
            }}
          >
            <Text variant="captionStrong" color={Colors.tealDeep}>
              Resend code
            </Text>
          </Pressable>
        )}
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 2 },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  codeBlock: { gap: Space.md },
  resendRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
});
