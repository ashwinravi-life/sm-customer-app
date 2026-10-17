import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge, Chips } from '@/components/bits';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { OrderProgressBar } from '@/components/order-progress';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Space } from '@/constants/theme';
import { orders } from '@/data/mock';
import type { Order } from '@/data/types';
import { formatDate, formatRupees, formatShortDate } from '@/lib/format';
import { isActive, stageLabel } from '@/lib/orders';

type Filter = 'all' | 'active' | 'completed';

function OrderCard({ order }: { order: Order }) {
  const active = isActive(order);
  const [first, ...rest] = order.items.filter((item) => item.itemGroup !== 'Service');

  return (
    <Card onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })} style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.flex}>
          <Text variant="captionStrong">#{order.id}</Text>
          <Text variant="caption">
            {formatDate(order.date)} · For {order.forName.split(' ')[0]}
          </Text>
        </View>
        {active ? (
          <Badge label={stageLabel(order.stage, order)} color={Colors.tealDeep} background={Colors.tealSoft} />
        ) : (
          <Badge label={stageLabel(order.stage, order)} color={Colors.success} background={Colors.successSoft} />
        )}
      </View>

      <View style={styles.itemRow}>
        <View style={styles.itemIcon}>
          <Icon name="glasses" size={26} color={Colors.text} />
        </View>
        <View style={styles.flex}>
          <Text variant="h3" numberOfLines={1}>
            {first?.itemName}
          </Text>
          <Text variant="caption" numberOfLines={1}>
            {rest.length ? `with ${rest.map((r) => r.itemName).join(', ')}` : first?.description}
          </Text>
        </View>
        <Text variant="h3">{formatRupees(order.total)}</Text>
      </View>

      {active ? (
        <View style={styles.progress}>
          <OrderProgressBar order={order} />
          <Text variant="caption">
            {order.fulfilment === 'store_pickup' ? 'Ready for pickup' : 'Delivery'} by{' '}
            <Text variant="captionStrong">{formatShortDate(order.expectedDate)}</Text>
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

export default function OrdersScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = orders.filter((order) =>
    filter === 'all' ? true : filter === 'active' ? isActive(order) : !isActive(order),
  );

  return (
    <Screen>
      <Text variant="h1">Orders</Text>
      <Chips<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: `All (${orders.length})` },
          { value: 'active', label: 'In progress' },
          { value: 'completed', label: 'Completed' },
        ]}
      />
      <View style={styles.list}>
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {visible.length === 0 ? (
          <Card style={styles.empty}>
            <Icon name="bag-handle-outline" size={36} color={Colors.textMuted} />
            <Text variant="h3">Nothing here yet</Text>
            <Text variant="caption" align="center">
              Orders you place at any Specsmakers store show up here.
            </Text>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: Space.lg },
  card: { gap: Space.lg },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Space.md },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  itemIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: { gap: Space.sm },
  empty: { alignItems: 'center', gap: Space.sm, paddingVertical: Space.xxxl },
});
