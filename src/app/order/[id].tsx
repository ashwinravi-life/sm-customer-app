import { useLocalSearchParams } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { Divider, IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon, type IconName } from '@/components/icon';
import { OrderDocuments } from '@/components/order-documents';
import { OrderTimeline } from '@/components/order-progress';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Space } from '@/constants/theme';
import { orders, stores } from '@/data/mock';
import type { OrderItem } from '@/data/types';
import { formatDate, formatNumber, formatRupees, formatShortDate } from '@/lib/format';
import { useCustomer } from '@/lib/app-state';
import { isActive, stageLabel } from '@/lib/orders';

const ITEM_ICONS: Record<OrderItem['itemGroup'], IconName> = {
  Frame: 'glasses-outline',
  Lens: 'aperture-outline',
  Sunglasses: 'sunny-outline',
  'Contact Lens': 'ellipse-outline',
  Service: 'shield-checkmark-outline',
};

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text variant={strong ? 'bodyStrong' : 'body'} color={strong ? Colors.text : Colors.textMuted}>
        {label}
      </Text>
      <Text variant={strong ? 'h3' : 'bodyStrong'}>{value}</Text>
    </View>
  );
}

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const customer = useCustomer();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Screen title="Order">
        <Text variant="body">This order could not be found.</Text>
      </Screen>
    );
  }

  const active = isActive(order);
  const store = stores.find((s) => order.store.startsWith(s.code));
  const subtotal = order.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Screen title={`#${order.id}`}>
      {/* Status */}
      <Card style={styles.status}>
        <IconBubble
          name={active ? 'construct' : 'checkmark-circle'}
          color={active ? Colors.tealDeep : Colors.success}
          background={active ? Colors.tealSoft : Colors.successSoft}
          size={52}
        />
        <View style={styles.flex}>
          <Text variant="h2">{stageLabel(order.stage, order)}</Text>
          <Text variant="caption">
            {active
              ? `${order.fulfilment === 'store_pickup' ? 'Ready for pickup' : 'Arriving'} by ${formatShortDate(order.expectedDate)}`
              : `Completed on ${formatDate(order.stageDates.delivered ?? order.expectedDate)}`}
          </Text>
        </View>
      </Card>

      {/* Tracking */}
      <Card>
        <Text variant="overline" style={styles.cardLabel}>
          Tracking
        </Text>
        <OrderTimeline order={order} />
      </Card>

      {/* Items */}
      <Card style={styles.gap}>
        <Text variant="overline">Items · for {order.forName}</Text>
        {order.items.map((item) => (
          <View key={item.itemCode} style={styles.item}>
            <IconBubble name={ITEM_ICONS[item.itemGroup]} color={Colors.text} background={Colors.background} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{item.itemName}</Text>
              <Text variant="caption">{item.description ?? item.itemGroup}</Text>
            </View>
            <Text variant="bodyStrong">{formatRupees(item.amount)}</Text>
          </View>
        ))}
        <Divider />
        <Row label="Item total" value={formatRupees(subtotal)} />
        {order.coinsRedeemed ? (
          <Row label="SM Coins redeemed" value={`− ${formatRupees(order.coinsRedeemed)}`} />
        ) : null}
        <Row label="Order total" value={formatRupees(order.total)} strong />
        <View style={styles.earned}>
          <Coin size={22} />
          <Text variant="captionStrong" style={styles.flex}>
            You earned {formatNumber(order.coinsEarned)} SM Coins on this order
          </Text>
        </View>
      </Card>

      <OrderDocuments order={order} customer={customer} />

      {/* Store */}
      <Card style={styles.gap}>
        <Text variant="overline">{order.fulfilment === 'store_pickup' ? 'Pickup store' : 'Ordered at'}</Text>
        <View style={styles.item}>
          <IconBubble name="storefront" color={Colors.coral} background={Colors.coralSoft} />
          <View style={styles.flex}>
            <Text variant="bodyStrong">{order.store}</Text>
            <Text variant="caption">Ordered on {formatDate(order.date)}</Text>
          </View>
        </View>
        {store ? (
          <Button
            title="Call store"
            icon="call-outline"
            variant="outline"
            size="md"
            onPress={() => Linking.openURL(`tel:${store.phone}`)}
          />
        ) : null}
      </Card>

      <View style={styles.help}>
        <Icon name="help-buoy-outline" size={18} color={Colors.textMuted} />
        <Text variant="caption">Questions? Call care on +91 97915 97915</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  status: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  cardLabel: { marginBottom: Space.lg },
  item: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.coinSoft,
    padding: Space.md,
    borderRadius: 12,
  },
  help: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
