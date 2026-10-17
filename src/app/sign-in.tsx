import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';

const MOBILE_LENGTH = 10;

export default function SignInScreen() {
  const [mobile, setMobile] = useState('');
  const [focused, setFocused] = useState(false);
  // Indian mobile numbers are 10 digits starting 6–9.
  const isValid = /^[6-9]\d{9}$/.test(mobile);
  const showInvalid = mobile.length === MOBILE_LENGTH && !isValid;

  const handleContinue = () => {
    if (!isValid) return;
    router.push({ pathname: '/verify', params: { mobile } });
  };

  return (
    <AuthShell>
      <View style={styles.heading}>
        <Text variant="h1">Sign in</Text>
        <Text variant="caption">We’ll send a verification code to your mobile number.</Text>
      </View>

      <View style={styles.field}>
        <Text variant="overline">Mobile number</Text>
        <View style={[styles.inputRow, focused && styles.inputFocused, showInvalid && styles.inputError]}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            value={mobile}
            onChangeText={(text) => setMobile(text.replace(/\D/g, '').slice(0, MOBILE_LENGTH))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={handleContinue}
            placeholder="10-digit number"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={MOBILE_LENGTH}
            autoFocus
            accessibilityLabel="Mobile number"
            style={[styles.input, mobile.length === 0 && styles.inputPlaceholder]}
          />
        </View>
        {showInvalid ? (
          <Text variant="caption" color={Colors.danger}>
            Enter a valid Indian mobile number.
          </Text>
        ) : null}
      </View>

      <Button title="Get verification code" icon="arrow-forward" onPress={handleContinue} disabled={!isValid} />

      <Text variant="caption" align="center">
        By continuing you agree to the Specsmakers Terms of Use and Privacy Policy.
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Space.xs },
  field: { gap: Space.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  inputFocused: { borderColor: Colors.teal },
  inputError: { borderColor: Colors.danger },
  prefix: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRightWidth: 2,
    borderRightColor: Colors.border,
  },
  prefixText: { fontFamily: Fonts.extrabold, fontSize: 20, color: Colors.textMuted },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: Fonts.extrabold,
    fontSize: 20,
    letterSpacing: 2,
    color: Colors.text,
  },
  inputPlaceholder: { fontFamily: Fonts.regular, fontSize: 17, letterSpacing: 0 },
});
