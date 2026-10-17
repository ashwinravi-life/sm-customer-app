import * as Haptics from 'expo-haptics';

// Haptics can fail on devices without a vibration motor; never let that break a tap.
export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
export const select = () => Haptics.selectionAsync().catch(() => {});
export const success = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
export const error = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
