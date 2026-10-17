import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chips } from '@/components/bits';
import { OfferCard } from '@/components/offer-card';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Space } from '@/constants/theme';
import { offers } from '@/data/mock';
import type { Offer } from '@/data/types';

type Filter = 'All' | Offer['category'];

const FILTERS: Filter[] = ['All', 'Frames', 'Lenses', 'Sunglasses', 'Contact Lens', 'Eye Test'];

export default function OffersScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const visible = offers.filter((o) => filter === 'All' || o.category === filter);

  return (
    <Screen title="Offers & coupons">
      <Text variant="caption">Copy a code and show it at billing, or tell the store team.</Text>
      <Chips<Filter> value={filter} onChange={setFilter} options={FILTERS.map((f) => ({ value: f, label: f }))} />
      <View style={styles.list}>
        {visible.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
        {visible.length === 0 ? <Text variant="caption">No offers in this category right now.</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Space.lg },
});
