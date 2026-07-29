import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { motionTokens } from '@/design-tokens';

/**
 * Sahne geçiş katmanı — LS-006 Transition Layer.
 * Soft fade; skor/ödül katmanı eklemez. İçeriği sarar (overlay değil).
 */
export function SceneTransition({
  visible,
  reduceMotion,
  children,
}: {
  visible: boolean;
  onFinished?: () => void;
  reduceMotion?: boolean;
  children?: React.ReactNode;
}) {
  const opacity = useSharedValue(visible ? 0 : 1);
  const duration = motionTokens['motion.trust'].durationMs;

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = visible ? 1 : 0;
      return;
    }
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: duration * 0.45,
      easing: Easing.inOut(Easing.quad),
    });
  }, [visible, duration, opacity, reduceMotion]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.host}>
      <View style={styles.warmWash} pointerEvents="none" />
      <Animated.View style={style}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  warmWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 224, 178, 0.22)',
    borderRadius: 24,
  },
});
