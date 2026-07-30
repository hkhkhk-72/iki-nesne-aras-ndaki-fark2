/**
 * Safe haptics — web'de no-op / catch; native'de expo-haptics.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export async function lightTap(enabled = true): Promise<void> {
  if (!enabled || Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // ignore
  }
}

export async function successTap(enabled = true): Promise<void> {
  if (!enabled || Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // ignore
  }
}
