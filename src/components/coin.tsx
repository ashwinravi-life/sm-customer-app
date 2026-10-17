import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { Fonts, Gradients } from '@/constants/theme';

// The SM Coin mark: a gold disc with "SM", used wherever coins are shown.
export function Coin({ size = 20 }: { size?: number }) {
  return (
    <LinearGradient
      colors={Gradients.coin}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.disc, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={[styles.ring, { borderRadius: size / 2, borderWidth: Math.max(1, size / 14) }]} />
      <Text
        style={{ fontFamily: Fonts.black, fontSize: size * 0.36, lineHeight: size * 0.44, color: '#7A4B00' }}
      >
        SM
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  disc: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', top: 1.5, left: 1.5, right: 1.5, bottom: 1.5, borderColor: 'rgba(255,255,255,0.55)' },
});
