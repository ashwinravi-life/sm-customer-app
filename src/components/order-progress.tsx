import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Space } from '@/constants/theme';
import type { Order } from '@/data/types';
import { formatShortDate } from '@/lib/format';
import { STAGE_ORDER, stageDescription, stageIndex, stageLabel } from '@/lib/orders';

// Compact horizontal tracker for cards.
export function OrderProgressBar({ order }: { order: Order }) {
  const current = stageIndex(order.stage);
  return (
    <View style={styles.barRow}>
      {STAGE_ORDER.map((stage, i) => (
        <View key={stage} style={[styles.barSegment, i <= current && styles.barDone]} />
      ))}
    </View>
  );
}

// Full vertical timeline for the order details screen.
export function OrderTimeline({ order }: { order: Order }) {
  const current = stageIndex(order.stage);

  return (
    <View>
      {STAGE_ORDER.map((stage, i) => {
        const done = i < current || order.stage === 'delivered';
        const active = i === current && order.stage !== 'delivered';
        const last = i === STAGE_ORDER.length - 1;
        const date = order.stageDates[stage];

        return (
          <View key={stage} style={styles.step}>
            <View style={styles.rail}>
              <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                {done ? <Icon name="checkmark" size={14} color={Colors.ink} /> : null}
                {active ? <View style={styles.pulse} /> : null}
              </View>
              {!last ? <View style={[styles.line, (done || active) && i < current && styles.lineDone]} /> : null}
            </View>
            <View style={styles.stepBody}>
              <View style={styles.stepTitleRow}>
                <Text variant="h3" color={done || active ? Colors.text : Colors.textMuted}>
                  {stageLabel(stage, order)}
                </Text>
                {date ? <Text variant="caption">{formatShortDate(date)}</Text> : null}
              </View>
              {done || active ? <Text variant="caption">{stageDescription(stage, order)}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barRow: { flexDirection: 'row', gap: 4 },
  barSegment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  barDone: { backgroundColor: Colors.teal },
  step: { flexDirection: 'row', gap: Space.md },
  rail: { alignItems: 'center', width: 26 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.teal, borderColor: Colors.teal },
  dotActive: { borderColor: Colors.teal },
  pulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.teal },
  line: { flex: 1, width: 2, minHeight: 28, backgroundColor: Colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: Colors.teal },
  stepBody: { flex: 1, paddingBottom: Space.xl, gap: 2 },
  stepTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Space.sm },
});
