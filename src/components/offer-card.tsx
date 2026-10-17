import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Divider } from '@/components/bits';
import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Shadow, Space } from '@/constants/theme';
import type { Offer } from '@/data/types';
import { formatDate, formatRupees } from '@/lib/format';
import { success } from '@/lib/haptics';

const ACCENTS: Record<Offer['accent'], { fg: string; bg: string }> = {
  teal: { fg: Colors.tealDeep, bg: Colors.tealSoft },
  coral: { fg: Colors.coral, bg: Colors.coralSoft },
  purple: { fg: Colors.purple, bg: Colors.purpleSoft },
  sky: { fg: Colors.sky, bg: Colors.skySoft },
  coin: { fg: '#B7791F', bg: Colors.coinSoft },
};

const CATEGORY_ICONS: Record<Offer['category'], IconName> = {
  Frames: 'glasses-outline',
  Lenses: 'aperture-outline',
  Sunglasses: 'sunny-outline',
  'Eye Test': 'eye-outline',
  'Contact Lens': 'ellipse-outline',
};

function useCopy(code: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await Clipboard.setStringAsync(code);
    success();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return { copied, copy };
}

// Ticket-style coupon: details on top, tear line, code + copy below.
export function OfferCard({ offer, compact }: { offer: Offer; compact?: boolean }) {
  const accent = ACCENTS[offer.accent];
  const { copied, copy } = useCopy(offer.code);

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={[styles.top, { backgroundColor: accent.bg }]}>
        <View style={styles.categoryRow}>
          <Icon name={CATEGORY_ICONS[offer.category]} size={16} color={accent.fg} />
          <Text variant="overline" color={accent.fg}>
            {offer.category}
          </Text>
        </View>
        <Text variant="h2" numberOfLines={2}>
          {offer.title}
        </Text>
        {!compact ? <Text variant="caption">{offer.description}</Text> : null}
      </View>

      <View style={styles.tear}>
        <View style={[styles.notch, styles.notchLeft]} />
        <View style={styles.tearLine}>
          <Divider dashed />
        </View>
        <View style={[styles.notch, styles.notchRight]} />
      </View>

      <View style={styles.bottom}>
        <View style={styles.codeInfo}>
          <Text style={styles.code}>{offer.code}</Text>
          <Text variant="caption" numberOfLines={1}>
            Till {formatDate(offer.validTill)}
            {offer.minOrder ? ` · Min ${formatRupees(offer.minOrder)}` : ''}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Copy code ${offer.code}`}
          onPress={copy}
          style={({ pressed }) => [styles.copy, copied && styles.copied, pressed && { opacity: 0.8 }]}
        >
          <Icon name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? Colors.ink : Colors.textOnDark} />
          <Text variant="captionStrong" color={copied ? Colors.ink : Colors.textOnDark}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const NOTCH = 18;

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, ...Shadow.card },
  compact: { width: 270 },
  top: {
    padding: Space.lg,
    gap: 6,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    minHeight: 104,
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tear: { flexDirection: 'row', alignItems: 'center', height: NOTCH },
  notch: { width: NOTCH / 2, height: NOTCH, backgroundColor: Colors.background },
  notchLeft: { borderTopRightRadius: NOTCH, borderBottomRightRadius: NOTCH },
  notchRight: { borderTopLeftRadius: NOTCH, borderBottomLeftRadius: NOTCH },
  tearLine: { flex: 1, paddingHorizontal: 6 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg, paddingTop: Space.sm },
  codeInfo: { flex: 1, gap: 2 },
  code: { fontFamily: Fonts.black, fontSize: 18, letterSpacing: 1.5, color: Colors.text },
  copy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.ink,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: Radius.pill,
  },
  copied: { backgroundColor: Colors.teal },
});
