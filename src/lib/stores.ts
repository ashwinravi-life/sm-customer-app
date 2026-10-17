import { Linking, Platform } from 'react-native';

import type { IconName } from '@/components/icon';
import { Colors } from '@/constants/theme';
import type { Store, StoreService } from '@/data/types';

export const SERVICE_META: Record<StoreService, { icon: IconName; note: string }> = {
  'Eye test': { icon: 'eye-outline', note: 'Free computerised eye test' },
  'Contact lens': { icon: 'ellipse-outline', note: 'Trials and fitting' },
  Repairs: { icon: 'construct-outline', note: 'Screws, nose pads, adjustments' },
  'Kids corner': { icon: 'happy-outline', note: 'Frames and play area for kids' },
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function formatClock(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function hoursLabel(store: Store) {
  return `${formatClock(store.opensAt)} – ${formatClock(store.closesAt)}`;
}

export type OpenState = 'open' | 'closing' | 'closed';

export function openStatus(store: Store, now = new Date()): { state: OpenState; label: string; color: string } {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(store.opensAt);
  const close = toMinutes(store.closesAt);
  if (minutes >= open && minutes < close) {
    if (close - minutes <= 60) {
      return { state: 'closing', label: `Closes soon · ${formatClock(store.closesAt)}`, color: Colors.coin };
    }
    return { state: 'open', label: `Open · till ${formatClock(store.closesAt)}`, color: Colors.success };
  }
  return { state: 'closed', label: `Closed · opens ${formatClock(store.opensAt)}`, color: Colors.danger };
}

export function formatDistance(km: number) {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

// Rough city driving estimate (~22 km/h); good enough to compare stores.
export function driveTime(km: number) {
  const minutes = Math.max(3, Math.round((km / 22) * 60));
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function openDirections(store: Store) {
  const label = encodeURIComponent(store.name);
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${store.latitude},${store.longitude}&q=${label}`
      : `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
  Linking.openURL(url);
}

export const callStore = (store: Store) => Linking.openURL(`tel:${store.phone}`);
