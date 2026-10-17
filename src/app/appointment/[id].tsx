import { router, useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { EARN_RULES, stores } from '@/data/mock';
import { useAppState } from '@/lib/app-state';
import { formatAppointmentDate } from '@/lib/appointments';
import { callStore, formatClock, openDirections } from '@/lib/stores';

const EXPECT: { icon: IconName; text: string }[] = [
  { icon: 'time-outline', text: 'Takes about 20 minutes' },
  { icon: 'glasses-outline', text: 'Bring your current glasses or contact lenses' },
  { icon: 'qr-code-outline', text: 'Show your member QR at the store' },
];

function Row({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={18} color={Colors.textMuted} />
      <Text variant="caption" style={styles.rowLabel}>
        {label}
      </Text>
      <Text variant="bodyStrong" style={styles.flex}>
        {value}
      </Text>
    </View>
  );
}

export default function AppointmentScreen() {
  const { id, booked } = useLocalSearchParams<{ id: string; booked?: string }>();
  const { appointments, cancelAppointment } = useAppState();
  const appointment = appointments.find((a) => a.id === id);
  const store = stores.find((s) => s.id === appointment?.storeId);

  if (!appointment || !store) {
    return (
      <Screen title="Appointment">
        <Text variant="body">This appointment was cancelled or could not be found.</Text>
        <Button title="Back to home" variant="outline" onPress={() => router.navigate('/')} />
      </Screen>
    );
  }

  const cancel = () =>
    Alert.alert('Cancel this eye test?', `${formatAppointmentDate(appointment.date)} at ${formatClock(appointment.time)}`, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: () => {
          cancelAppointment(appointment.id);
          router.navigate('/');
        },
      },
    ]);

  return (
    <Screen title={booked ? 'Booking confirmed' : 'Your appointment'}>
      <View style={styles.hero}>
        <IconBubble name="checkmark-circle" color={Colors.success} background={Colors.successSoft} size={72} />
        <Text variant="h1" align="center">
          {booked ? 'Eye test booked!' : 'Eye test booked'}
        </Text>
        <Text variant="body" align="center" color={Colors.textMuted}>
          {formatAppointmentDate(appointment.date)} at {formatClock(appointment.time)}
        </Text>
      </View>

      <Card style={styles.gap}>
        <Row icon="person-outline" label="For" value={appointment.memberName} />
        <Row icon="storefront-outline" label="Store" value={`${store.name}, ${store.city}`} />
        <Row icon="location-outline" label="Address" value={store.address} />
        {appointment.reason ? <Row icon="chatbubble-outline" label="Reason" value={appointment.reason} /> : null}
        <Row icon="bookmark-outline" label="Booking ID" value={appointment.id} />
      </Card>

      <View style={styles.actions}>
        <Button title="Directions" icon="navigate" size="md" style={styles.flex} onPress={() => openDirections(store)} />
        <Button title="Call store" icon="call-outline" variant="outline" size="md" style={styles.flex} onPress={() => callStore(store)} />
      </View>

      <Card style={styles.gap}>
        <Text variant="h3">What to expect</Text>
        {EXPECT.map((e) => (
          <View key={e.text} style={styles.expect}>
            <IconBubble name={e.icon} color={Colors.tealDeep} background={Colors.tealSoft} size={34} />
            <Text variant="body" style={styles.flex}>
              {e.text}
            </Text>
          </View>
        ))}
        <View style={styles.coins}>
          <Coin size={20} />
          <Text variant="captionStrong" style={styles.flex}>
            You’ll earn {EARN_RULES.eyeTest} SM Coins after the test
          </Text>
        </View>
      </Card>

      <Button title="Done" onPress={() => router.navigate('/')} />
      <Button title="Cancel booking" variant="ghost" onPress={cancel} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  hero: { alignItems: 'center', gap: Space.sm, paddingVertical: Space.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Space.sm },
  rowLabel: { width: 76 },
  actions: { flexDirection: 'row', gap: Space.sm },
  expect: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.coinSoft,
    borderRadius: Radius.md,
    padding: Space.md,
  },
});
