import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { motionTokens } from '@/design-tokens';
import { ASSETS } from '@/world/assets';

function RippleRing({
  progress,
  label,
}: {
  progress: SharedValue<number>;
  label?: string;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: (1 - progress.value) * 0.45,
    transform: [{ scale: 0.4 + progress.value * 1.4 }],
  }));
  return <Animated.View style={[styles.ring, style]} accessibilityLabel={label} />;
}

/**
 * Karar anı dalgası — doğru/yanlış rengi yok; yalnızca sıcak varlık (FX010).
 */
export function DecisionRipple({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion?: boolean;
}) {
  const r0 = useSharedValue(0);
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);
  const ripples = [r0, r1, r2];
  const duration = motionTokens['motion.trust'].durationMs;

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      ripples.forEach((r) => {
        r.value = 1;
      });
      return;
    }
    ripples.forEach((r, i) => {
      r.value = 0;
      r.value = withDelay(
        i * (duration * 0.18),
        withTiming(1, { duration: duration * 0.7, easing: Easing.out(Easing.cubic) }),
      );
    });
    // ripples is stable shared values for this mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration, reduceMotion]);

  return (
    <>
      <RippleRing progress={r0} label={`Karar dalgası ${ASSETS.FX010.name}`} />
      <RippleRing progress={r1} />
      <RippleRing progress={r2} />
    </>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFB74D',
    alignSelf: 'center',
  },
});
