import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Fonts, Gradients, Radius, Shadow, Space } from '@/constants/theme';
import type { Offer } from '@/data/types';
import { daysUntil, formatRupees } from '@/lib/format';
import { select, success } from '@/lib/haptics';

export const OFFER_ACCENTS: Record<Offer['accent'], { fg: string; bg: string; solid: string }> = {
  teal: { fg: Colors.tealDeep, bg: Colors.tealSoft, solid: Colors.teal },
  coral: { fg: Colors.coral, bg: Colors.coralSoft, solid: Colors.coral },
  purple: { fg: Colors.purple, bg: Colors.purpleSoft, solid: Colors.purple },
  sky: { fg: Colors.sky, bg: Colors.skySoft, solid: Colors.sky },
  coin: { fg: '#B7791F', bg: Colors.coinSoft, solid: Colors.coin },
};

export const CATEGORY_ICONS: Record<Offer['category'], IconName> = {
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

export function expiryLabel(validTill: string) {
  const days = daysUntil(validTill);
  if (days < 0) return { text: 'Expired', urgent: true };
  if (days === 0) return { text: 'Ends today', urgent: true };
  if (days === 1) return { text: 'Ends tomorrow', urgent: true };
  return { text: `Ends in ${days} days`, urgent: days <= 7 };
}

function CodeBox({ code }: { code: string }) {
  const { copied, copy } = useCopy(code);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Copy code ${code}`}
      onPress={copy}
      style={({ pressed }) => [styles.codeBox, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.code}>{code}</Text>
      <View style={[styles.copy, copied && styles.copied]}>
        <Icon name={copied ? 'checkmark' : 'copy-outline'} size={14} color={copied ? Colors.ink : Colors.textOnDark} />
        <Text variant="captionStrong" color={copied ? Colors.ink : Colors.textOnDark}>
          {copied ? 'Copied' : 'Copy'}
        </Text>
      </View>
    </Pressable>
  );
}

// Ticket-style coupon: discount stub on the left, details on the right.
export function OfferCard({ offer }: { offer: Offer }) {
  const accent = OFFER_ACCENTS[offer.accent];
  const expiry = expiryLabel(offer.validTill);
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.ticket}>
      <View style={styles.ticketRow}>
        <View style={[styles.stub, { backgroundColor: accent.solid }]}>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {offer.value}
          </Text>
          <Text style={styles.valueLabel}>{offer.valueLabel}</Text>
          {/* Perforation */}
          <View style={styles.perforation}>
            {Array.from({ length: 7 }, (_, i) => (
              <View key={i} style={styles.hole} />
            ))}
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.categoryRow}>
            <Icon name={CATEGORY_ICONS[offer.category]} size={14} color={accent.fg} />
            <Text variant="overline" color={accent.fg}>
              {offer.category}
            </Text>
            {offer.exclusiveTier ? (
              <View style={styles.exclusive}>
                <Icon name="diamond" size={10} color={Colors.coin} />
                <Text style={styles.exclusiveText}>{offer.exclusiveTier}</Text>
              </View>
            ) : null}
          </View>
          <Text variant="h3" numberOfLines={2}>
            {offer.title}
          </Text>
          <Text variant="caption" numberOfLines={2}>
            {offer.description}
          </Text>
          <View style={styles.metaRow}>
            <Icon name="time-outline" size={13} color={expiry.urgent ? Colors.danger : Colors.textMuted} />
            <Text variant="caption" color={expiry.urgent ? Colors.danger : Colors.textMuted}>
              {expiry.text}
              {offer.minOrder ? ` · Min ${formatRupees(offer.minOrder)}` : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.flex}>
          <CodeBox code={offer.code} />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          hitSlop={8}
          onPress={() => {
            select();
            setOpen(!open);
          }}
          style={styles.detailsToggle}
        >
          <Text variant="captionStrong">Details</Text>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
        </Pressable>
      </View>

      {open ? (
        <View style={styles.terms}>
          {offer.terms.map((t) => (
            <View key={t} style={styles.term}>
              <View style={styles.bullet} />
              <Text variant="caption" style={styles.flex}>
                {t}
              </Text>
            </View>
          ))}
          <View style={styles.howTo}>
            <Icon name="qr-code-outline" size={16} color={Colors.tealDeep} />
            <Text variant="caption" style={styles.flex}>
              Show this code with your member QR at billing.
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

// Photo-led banner for in-store offers. No code needed: the offer applies at billing.
export function FeaturedOffer({ offer, width, height = 300 }: { offer: Offer; width: number; height?: number }) {
  const accent = OFFER_ACCENTS[offer.accent];
  const expiry = expiryLabel(offer.validTill);
  return (
    <View style={[styles.featured, { width, height }]}>
      {offer.image ? (
        <Image source={{ uri: offer.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      ) : (
        <LinearGradient colors={Gradients.hero} style={StyleSheet.absoluteFill} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.featuredTop}>
        <View style={[styles.featuredPill, { backgroundColor: accent.solid }]}>
          <Text variant="captionStrong" color={Colors.ink}>
            {offer.category}
          </Text>
        </View>
        <View style={styles.featuredPillDark}>
          <Icon name="time-outline" size={13} color={Colors.textOnDark} />
          <Text variant="captionStrong" color={Colors.textOnDark}>
            {expiry.text}
          </Text>
        </View>
      </View>
      <View style={styles.featuredBody}>
        <View style={styles.featuredValueRow}>
          <Text style={styles.featuredValue}>{offer.value}</Text>
          <Text style={styles.featuredValueLabel}>{offer.valueLabel}</Text>
        </View>
        <Text variant="h2" color={Colors.textOnDark}>
          {offer.title}
        </Text>
        <Text variant="caption" color={Colors.textOnDarkMuted} numberOfLines={2}>
          {offer.description}
          {offer.minOrder ? ` Min order ${formatRupees(offer.minOrder)}.` : ''}
        </Text>
      </View>
    </View>
  );
}

const STUB = 96;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  ticket: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  ticketRow: { flexDirection: 'row' },
  stub: { width: STUB, alignItems: 'center', justifyContent: 'center', paddingVertical: Space.lg, paddingHorizontal: 6 },
  value: { fontFamily: Fonts.black, fontSize: 28, lineHeight: 32, color: Colors.ink, letterSpacing: -0.5 },
  valueLabel: { fontFamily: Fonts.extrabold, fontSize: 11, letterSpacing: 1.4, color: Colors.ink, marginTop: 2 },
  perforation: { position: 'absolute', right: -5, top: 0, bottom: 0, justifyContent: 'space-evenly' },
  hole: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.surface },
  details: { flex: 1, padding: Space.md, paddingLeft: Space.lg, gap: 3 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  exclusive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.ink,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    marginLeft: 'auto',
  },
  exclusiveText: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.textOnDark },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingLeft: Space.md,
    paddingRight: 5,
    height: 44,
    backgroundColor: Colors.background,
  },
  code: { fontFamily: Fonts.black, fontSize: 16, letterSpacing: 1.5, color: Colors.text },
  copy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.ink,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: Radius.sm,
  },
  copied: { backgroundColor: Colors.teal },
  detailsToggle: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  terms: { paddingHorizontal: Space.lg, paddingBottom: Space.lg, gap: 6 },
  term: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.textMuted },
  howTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.tealSoft,
    borderRadius: Radius.sm,
    padding: Space.sm,
    marginTop: 4,
  },
  featured: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.ink,
    justifyContent: 'space-between',
  },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', padding: Space.lg },
  featuredPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  featuredPillDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(10,10,10,0.6)',
  },
  featuredBody: { padding: Space.xl, gap: Space.sm },
  featuredValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  featuredValue: { fontFamily: Fonts.black, fontSize: 56, lineHeight: 60, color: Colors.teal, letterSpacing: -2 },
  featuredValueLabel: { fontFamily: Fonts.extrabold, fontSize: 16, letterSpacing: 2, color: Colors.textOnDark, marginBottom: 10 },
});
