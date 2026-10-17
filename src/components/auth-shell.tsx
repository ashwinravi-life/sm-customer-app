import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Gradients, Radius, Space } from '@/constants/theme';

const LOGO_ASPECT_RATIO = 1920 / 196;

const PERKS: { icon: IconName; label: string }[] = [
  { icon: 'qr-code', label: 'Your store ID' },
  { icon: 'sparkles', label: 'SM Coins' },
  { icon: 'eye', label: 'Family Rx' },
];

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

export function AuthShell({ children, compact }: { children: ReactNode; compact?: boolean }) {
  const keyboardVisible = useKeyboardVisible();
  const scrollRef = useRef<ScrollView>(null);
  // While typing, the headline gives way so the field and button stay above the keypad.
  const collapsed = compact || keyboardVisible;

  useEffect(() => {
    if (keyboardVisible) requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, [keyboardVisible]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.hero} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={Gradients.heroGlow}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0.7 }}
        style={styles.glow}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* Expo Go on Android is edge-to-edge, so the window no longer resizes for the
            keyboard; padding is needed on both platforms. */}
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.hero, collapsed && styles.heroCompact]}>
              <Image
                source={require('@/assets/images/specsmakers-logo-white.png')}
                style={styles.logo}
                contentFit="contain"
                accessibilityLabel="Specsmakers"
              />
              {!collapsed ? (
                <View style={styles.heroText}>
                  <Text variant="display" color={Colors.textOnDark}>
                    See better.{'\n'}
                    <Text variant="display" color={Colors.teal}>
                      Earn more.
                    </Text>
                  </Text>
                  <Text variant="body" color={Colors.textOnDarkMuted}>
                    Your Specsmakers account, rewards and prescriptions in one place.
                  </Text>
                  <View style={styles.perks}>
                    {PERKS.map((perk) => (
                      <View key={perk.label} style={styles.perk}>
                        <Icon name={perk.icon} size={16} color={Colors.teal} />
                        <Text variant="captionStrong" color={Colors.textOnDark}>
                          {perk.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
            <View style={styles.sheet}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.ink },
  flex: { flex: 1 },
  glow: { position: 'absolute', top: 0, right: 0, width: '100%', height: 420 },
  scroll: { flexGrow: 1 },
  hero: { flex: 1, minHeight: 300, paddingHorizontal: Space.xxl, paddingTop: Space.xl, gap: Space.xxl },
  heroCompact: { flex: 0, minHeight: 0, paddingBottom: Space.xl },
  logo: { height: 26, aspectRatio: LOGO_ASPECT_RATIO },
  heroText: { flex: 1, justifyContent: 'flex-end', gap: Space.md, paddingBottom: Space.xxl },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, marginTop: Space.sm },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Space.xxl,
    paddingTop: Space.xxl,
    paddingBottom: Space.xxxl + 16,
    gap: Space.xl,
  },
});
