import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { motionTokens, storyTokens } from '@/design-tokens';
import { ASSETS } from '@/world/assets';
import { FINDIK_TRUST_STATE } from '@/world/character-states';
import { FindikSmile } from './FindikSmile';
import { colors, spacing, typography, radius } from '@/theme';

/**
 * LS-006 TrustReaction — destekleyici duygusal tepki.
 * QA: puan yok, ödül popup yok, doğru/yanlış yok.
 */
export function TrustReaction({
  line,
  reduceMotion,
}: {
  line: string;
  reduceMotion?: boolean;
}) {
  const glow = useSharedValue(0);
  const nod = useSharedValue(0);
  const duration = motionTokens['motion.trust'].durationMs;
  const story = storyTokens['story.trust'];

  useEffect(() => {
    if (reduceMotion) {
      glow.value = 1;
      nod.value = 1;
      return;
    }
    glow.value = withTiming(1, { duration: duration * 0.55, easing: Easing.out(Easing.cubic) });
    nod.value = withDelay(
      duration * 0.2,
      withTiming(1, { duration: duration * 0.4, easing: Easing.inOut(Easing.sin) }),
    );
  }, [duration, glow, nod, reduceMotion]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.55,
    transform: [{ scale: 0.9 + glow.value * 0.15 }],
  }));

  const nodStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - nod.value) * 6 }],
  }));

  return (
    <View
      style={styles.root}
      accessibilityLabel={`Güven tepkisi. ${story.childFeel}`}
    >
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View style={nodStyle}>
        <FindikSmile active />
      </Animated.View>
      <Text style={styles.line}>{line}</Text>
      <Text style={styles.tokenHint}>
        {story.id} · {ASSETS.FX010.id} · {ASSETS.AN007.id} · {FINDIK_TRUST_STATE.anims.join(' · ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    minHeight: 200,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: radius.full,
    backgroundColor: '#FFE0B2',
  },
  line: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 24,
  },
  tokenHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
