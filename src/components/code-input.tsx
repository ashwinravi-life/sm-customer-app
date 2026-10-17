import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/text';
import { Colors, Fonts, Radius } from '@/constants/theme';

export const CODE_LENGTH = 6;

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

// One real (invisible) input laid over six display boxes, so typing, paste
// and SMS code autofill all work like a normal field.
export function CodeInput({ value, onChange, disabled, hasError }: CodeInputProps) {
  const [focused, setFocused] = useState(false);
  const activeIndex = focused ? Math.min(value.length, CODE_LENGTH - 1) : -1;

  return (
    <View style={styles.row}>
      {Array.from({ length: CODE_LENGTH }, (_, index) => {
        const filled = index < value.length;
        return (
          <View
            key={index}
            style={[
              styles.box,
              filled && styles.boxFilled,
              index === activeIndex && styles.boxActive,
              hasError && styles.boxError,
            ]}
          >
            <Text style={styles.digit}>{value[index] ?? ''}</Text>
          </View>
        );
      })}
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
  row: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  box: {
    flex: 1,
    maxWidth: 54,
    aspectRatio: 0.85,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: { borderColor: Colors.ink },
  boxActive: { borderColor: Colors.teal, backgroundColor: Colors.tealSoft },
  boxError: { borderColor: Colors.danger },
  digit: { fontFamily: Fonts.extrabold, fontSize: 24, color: Colors.text },
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
