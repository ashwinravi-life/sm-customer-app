import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const MOBILE_LENGTH = 10;

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [focused, setFocused] = useState(false);
  const isValid = /^\d{10}$/.test(mobile);

  const handleSendCode = () => {
    if (!isValid) return;
    router.navigate({ pathname: '/verify', params: { mobile } });
  };

  return (
    <Screen>
      <View style={styles.heading}>
        <AppText variant="title">Login</AppText>
        <AppText variant="muted">Enter your mobile number to continue.</AppText>
      </View>

      <View style={styles.field}>
        <AppText variant="label">
          Mobile Number <AppText style={styles.required}>*</AppText>
        </AppText>
        <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
          <AppText style={styles.prefix}>+91</AppText>
          <TextInput
            value={mobile}
            onChangeText={(text) => setMobile(text.replace(/\D/g, '').slice(0, MOBILE_LENGTH))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={handleSendCode}
            placeholder="10-digit mobile number"
            placeholderTextColor={Colors.mutedForeground}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={MOBILE_LENGTH}
            autoFocus
            accessibilityLabel="Mobile number"
            style={[styles.input, mobile.length === 0 && styles.inputPlaceholder]}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton title="Send Code" onPress={handleSendCode} disabled={!isValid} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.xs },
  field: { gap: Spacing.sm },
  required: { color: Colors.destructive },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.field,
    overflow: 'hidden',
  },
  inputRowFocused: { borderColor: Colors.teal },
  prefix: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.mutedForeground,
    backgroundColor: Colors.muted,
    height: '100%',
    paddingHorizontal: 14,
    textAlignVertical: 'center',
    lineHeight: 52,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontFamily: Fonts.bold,
    fontSize: 20,
    letterSpacing: 1.5,
    color: Colors.foreground,
  },
  inputPlaceholder: { fontFamily: Fonts.regular, fontSize: 16, letterSpacing: 0 },
  actions: { flexDirection: 'row' },
});
