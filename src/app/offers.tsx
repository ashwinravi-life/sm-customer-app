import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { IconBubble } from '@/components/bits';
import { Icon, type IconName } from '@/components/icon';
import { FeaturedOffer, OfferCard } from '@/components/offer-card';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { offers, TIERS } from '@/data/mock';
import type { Tier } from '@/data/types';
import { useAppState } from '@/lib/app-state';
import { daysUntil } from '@/lib/format';

const STEPS: { icon: IconName; text: string }[] = [
  { icon: 'copy-outline', text: 'Copy your coupon code' },
  { icon: 'qr-code-outline', text: 'Show it with your QR at billing' },
  { icon: 'pricetag-outline', text: 'Save instantly' },
];

const tierRank = (t: Tier) => TIERS.findIndex((x) => x.tier === t);

export default function OffersScreen() {
  const { width } = useWindowDimensions();
  const { tier } = useAppState();

  const live = offers
    .filter((o) => daysUntil(o.validTill) >= 0)
    .sort((a, b) => daysUntil(a.validTill) - daysUntil(b.validTill));
  // In-store offers apply automatically at billing; coupons are member-only codes.
  const storeOffers = live.filter((o) => !o.exclusiveTier);
  const coupons = live.filter((o) => o.exclusiveTier && tierRank(tier) >= tierRank(o.exclusiveTier));

  const bannerWidth = width - Space.xl * 2;

  return (
    <Screen title="Offers & coupons">
      <View style={styles.section}>
        <Text variant="h2">In-store offers</Text>
        <Text variant="caption">Applied at billing in any Specsmakers store. No code needed.</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={bannerWidth + Space.md}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          style={styles.bleed}
        >
          {storeOffers.map((offer) => (
            <FeaturedOffer key={offer.id} offer={offer} width={bannerWidth} />
          ))}
        </ScrollView>
      </View>

      {coupons.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.tierBadge}>
              <Icon name="diamond" size={14} color={Colors.coin} />
              <Text variant="captionStrong" color={Colors.textOnDark}>
                {tier}
              </Text>
            </View>
            <Text variant="h2">Your coupons</Text>
          </View>
          {coupons.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}

          <View style={styles.steps}>
            {STEPS.map((s, i) => (
              <View key={s.text} style={styles.step}>
                <IconBubble name={s.icon} color={Colors.tealDeep} background={Colors.surface} size={40} />
                <Text variant="caption" align="center" color={Colors.text}>
                  {i + 1}. {s.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -Space.xl, flexGrow: 0, marginTop: Space.xs },
  carousel: { gap: Space.md, paddingHorizontal: Space.xl },
  section: { gap: Space.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  steps: {
    flexDirection: 'row',
    gap: Space.sm,
    backgroundColor: Colors.tealSoft,
    borderRadius: Radius.lg,
    padding: Space.md,
  },
  step: { flex: 1, alignItems: 'center', gap: 6 },
});
