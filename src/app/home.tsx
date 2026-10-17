import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';
import { Colors, Spacing } from '@/constants/theme';

// Placeholder until the real home screen is designed.
export default function HomeScreen() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();

  return (
    <Screen>
      <View style={styles.card}>
        <AppText variant="title" style={styles.cardText}>
          Welcome
        </AppText>
        <AppText style={styles.cardText}>You're logged in as +91 {mobile}</AppText>
      </View>

      <AppText variant="muted">Home screen coming soon.</AppText>

      <View style={styles.actions}>
        <AppButton variant="outline" title="Log out" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.teal, borderRadius: 16, padding: Spacing.lg, gap: Spacing.xs },
  cardText: { color: Colors.background },
  actions: { flexDirection: 'row' },
});
