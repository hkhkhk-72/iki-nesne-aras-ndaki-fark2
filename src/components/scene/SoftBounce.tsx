import React, { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ASSETS, FX_SOFT_BOUNCE_SPEC, FX_soft_bounce } from '@/world/assets';
import { meaningWithoutSound } from '@/core/accessibility';

/**
 * FX_soft_bounce (FX011) — palamuda dokununca çok hafif yaylanma.
 * Scale 1.00 → 1.04 → 1.00 · 200 ms.
 * Ses kapalı modda da aynı görsel anlam.
 */
export function SoftBounce({
  active,
  reduceMotion,
  soundEnabled = true,
  children,
  style,
}: {
  active: boolean;
  reduceMotion?: boolean;
  /** false = sessiz mod; animasyon anlamı korunur. */
  soundEnabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const { scaleFrom, scalePeak, scaleTo, durationMs } = FX_SOFT_BOUNCE_SPEC;
  const half = durationMs / 2;

  useEffect(() => {
    if (!active) {
      scale.value = scaleFrom;
      return;
    }
    if (reduceMotion) {
      scale.value = scalePeak;
      scale.value = withTiming(scaleTo, { duration: 80 });
      return;
    }
    scale.value = withSequence(
      withTiming(scalePeak, { duration: half, easing: Easing.out(Easing.quad) }),
      withTiming(scaleTo, { duration: half, easing: Easing.in(Easing.quad) }),
    );
  }, [active, half, reduceMotion, scale, scaleFrom, scalePeak, scaleTo]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const a11y =
    soundEnabled === false
      ? meaningWithoutSound({
          fallback: 'Palamut hafifçe kıpırdadı.',
        })
      : 'Palamut hafifçe yaylandı.';

  return (
    <Animated.View
      style={[styles.wrap, style, animStyle]}
      accessibilityLabel={`${a11y} ${FX_soft_bounce.alias ?? ASSETS.FX011.id}`}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
