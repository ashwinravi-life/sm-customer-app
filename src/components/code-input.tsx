import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Fonts, Radius } from '@/constants/theme';

export const CODE_LENGTH = 6;

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// One real (invisible) input laid over six display boxes, so typing, paste
// and SMS code autofill all work like a normal field.
export function CodeInput({ value, onChange, disabled }: CodeInputProps) {
  const [focused, setFocused] = useState(false);
  const activeIndex = focused ? Math.min(value.length, CODE_LENGTH - 1) : -1;

  return (
    <View style={styles.row}>
      {Array.from({ length: CODE_LENGTH }, (_, index) => (
        <View key={index} style={[styles.box, index === activeIndex && styles.boxActive]}>
          <Text style={styles.digit}>{value[index] ?? ''}</Text>
        </View>
      ))}
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, CODE_LENGTH))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={CODE_LENGTH}
        autoFocus
        caretHidden
        accessibilityLabel="Verification code"
        style={styles.hiddenInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  box: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: Colors.teal },
  digit: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.foreground },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.01,
    color: 'transparent',
  },
});
