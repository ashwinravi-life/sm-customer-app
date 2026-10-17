import { Linking, Platform, Share } from 'react-native';

import type { Store } from '@/data/types';

export function formatClock(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatDistance(km: number) {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

const mapsLink = (store: Store) =>
  `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;

export function openDirections(store: Store) {
  const label = encodeURIComponent(store.name);
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${store.latitude},${store.longitude}&q=${label}`
      : `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
  Linking.openURL(url);
}

export const callStore = (store: Store) => Linking.openURL(`tel:${store.phone}`);

export const shareStore = (store: Store) =>
  Share.share({
    message: `${store.name}\n${store.address}, ${store.city}\nCall: +91 ${store.phone}\n${mapsLink(store)}`,
  });
