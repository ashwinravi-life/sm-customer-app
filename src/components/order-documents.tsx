import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';

import { IconBubble } from '@/components/bits';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Space } from '@/constants/theme';
import type { Customer, Order } from '@/data/types';
import { invoiceHtml, receiptHtml, sharePdf } from '@/lib/documents';
import { formatDate } from '@/lib/format';
import { tap } from '@/lib/haptics';

type Doc = 'receipt' | 'invoice';

export function OrderDocuments({ order, customer }: { order: Order; customer: Customer }) {
  const [busy, setBusy] = useState<Doc | null>(null);
  const invoiceReady = !!order.invoiceNo;

  const download = async (doc: Doc) => {
    tap();
    setBusy(doc);
    try {
      if (doc === 'receipt') {
        await sharePdf(receiptHtml(order, customer), `Order-Receipt-${order.id}.pdf`);
      } else {
        await sharePdf(invoiceHtml(order, customer), `Invoice-${order.invoiceNo}.pdf`);
      }
    } catch {
      Alert.alert('Could not create the PDF', 'Please try again in a moment.');
    } finally {
      setBusy(null);
    }
  };

  const rows: { doc: Doc; title: string; subtitle: string; enabled: boolean }[] = [
    { doc: 'receipt', title: 'Order receipt', subtitle: `Advance and items · ${order.id}`, enabled: true },
    {
      doc: 'invoice',
      title: 'Tax invoice',
      subtitle: invoiceReady
        ? `${order.invoiceNo} · ${formatDate(order.invoiceDate!)}`
        : `Available once your order is ${order.fulfilment === 'store_pickup' ? 'picked up' : 'delivered'}`,
      enabled: invoiceReady,
    },
  ];

  return (
    <Card padded={false}>
      <Text variant="overline" style={styles.label}>
        Documents
      </Text>
      {rows.map((row, i) => (
        <Pressable
          key={row.doc}
          accessibilityRole="button"
          accessibilityLabel={`Download ${row.title}`}
          accessibilityState={{ disabled: !row.enabled || busy !== null, busy: busy === row.doc }}
          disabled={!row.enabled || busy !== null}
          onPress={() => download(row.doc)}
          style={({ pressed }) => [styles.row, i > 0 && styles.border, pressed && { backgroundColor: Colors.background }]}
        >
          <IconBubble
            name={row.doc === 'invoice' ? 'receipt' : 'document-text'}
            color={row.enabled ? Colors.text : Colors.textMuted}
            background={Colors.background}
            size={40}
          />
          <View style={styles.flex}>
            <Text variant="bodyStrong" color={row.enabled ? Colors.text : Colors.textMuted}>
              {row.title}
            </Text>
            <Text variant="caption">{row.subtitle}</Text>
          </View>
          {busy === row.doc ? (
            <ActivityIndicator color={Colors.tealDeep} />
          ) : row.enabled ? (
            <View style={styles.download}>
              <Icon name="download-outline" size={18} color={Colors.textOnDark} />
            </View>
          ) : (
            <Icon name="time-outline" size={20} color={Colors.textMuted} />
          )}
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { paddingHorizontal: Space.lg, paddingTop: Space.lg, paddingBottom: Space.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg },
  border: { borderTopWidth: 1, borderTopColor: Colors.border },
  download: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
