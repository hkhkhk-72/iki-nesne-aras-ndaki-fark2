import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { motionTokens } from '@/design-tokens';
import { ASSETS } from '@/world/assets';
import { FINDIK_TRUST_STATE } from '@/world/character-states';
import { getCharacter } from '@/world/characters';
import { colors, spacing, typography } from '@/theme';

/**
 * FN-001 küçük gülümseme — AN006.
 * Puan / ödül göstermez; yalnızca duygusal varlık.
 */
export function FindikSmile({ active = true }: { active?: boolean }) {
  const findik = getCharacter('findik');
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);
  const duration = motionTokens['motion.trust'].durationMs;

  useEffect(() => {
    if (!active) return;
    opacity.value = withTiming(1, { duration: duration * 0.4, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.06, { duration: duration * 0.45, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: duration * 0.35, easing: Easing.inOut(Easing.quad) }),
    );
  }, [active, duration, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.wrap, style]}
      accessibilityLabel={`${findik.name} küçük gülümsüyor (${ASSETS.AN006.name})`}
    >
      <Text style={styles.emoji}>{findik.visual}</Text>
      <Text style={styles.smile}>◡</Text>
      <Text style={styles.meta}>{FINDIK_TRUST_STATE.pose}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', minHeight: 96 },
  emoji: { fontSize: 64 },
  smile: {
    marginTop: -18,
    fontSize: 28,
    color: colors.secondary,
    fontWeight: '700',
  },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
