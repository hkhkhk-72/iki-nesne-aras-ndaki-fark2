import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { getCharacter } from '@/world/characters';
import {
  motionTokens,
  storyTokens,
  LOOK_BACK_CHILD_SEQUENCE,
  LOOK_BACK_CHILD_TOTAL_MS,
} from '@/design-tokens';
import { FINDIK_DEEP_THINKING_STATE } from '@/world/character-states';
import { meaningWithoutSound } from '@/core/accessibility';
import { LS011_PERF } from '@/design-tokens/performance';
import { colors, spacing, typography } from '@/theme';

/**
 * motion.look_back_child — 6s seamless loop:
 * Look child → Look basket → Look child → Smile → Look basket → Loop
 * GPU-friendly transform; cancel on unmount (memory safe).
 */
export function LookBackChild({
  active = true,
  reduceMotion,
  soundEnabled = true,
}: {
  active?: boolean;
  reduceMotion?: boolean;
  soundEnabled?: boolean;
}) {
  const findik = getCharacter('findik');
  /** -1 basket · 0 center · 1 child */
  const look = useSharedValue(0);
  const smile = useSharedValue(0);
  const motion = motionTokens['motion.look_back_child'];
  const story = storyTokens['story.thinking.deep'];

  useEffect(() => {
    if (!active || reduceMotion) {
      look.value = 0;
      smile.value = 0.3;
      return;
    }

    const steps = LOOK_BACK_CHILD_SEQUENCE.map((step) => {
      if (step.target === 'child') {
        return withTiming(1, {
          duration: step.durationMs,
          easing: Easing.inOut(Easing.sin),
        });
      }
      if (step.target === 'basket') {
        return withTiming(-1, {
          duration: step.durationMs,
          easing: Easing.inOut(Easing.sin),
        });
      }
      // smile — bakış ortada, gülümseme nabzı look kanalında 0'a gelir
      return withTiming(0, {
        duration: step.durationMs,
        easing: Easing.inOut(Easing.sin),
      });
    });

    look.value = 0;
    look.value = withRepeat(withSequence(...steps), -1, false);

    // Smile pulse aligned to smile step (4th step, index 3)
    const beforeSmile = LOOK_BACK_CHILD_SEQUENCE.slice(0, 3).reduce(
      (s, x) => s + x.durationMs,
      0,
    );
    const smileDur = LOOK_BACK_CHILD_SEQUENCE[3].durationMs;
    smile.value = withRepeat(
      withSequence(
        withTiming(0, { duration: beforeSmile }),
        withTiming(1, { duration: smileDur * 0.45, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: smileDur * 0.55, easing: Easing.in(Easing.quad) }),
        withTiming(0, {
          duration: LOOK_BACK_CHILD_SEQUENCE[4].durationMs,
        }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(look);
      cancelAnimation(smile);
    };
  }, [active, look, reduceMotion, smile]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: look.value * 14 },
      { scale: 1 + smile.value * 0.04 },
    ],
    opacity: 0.92 + smile.value * 0.08,
  }));

  const a11y = meaningWithoutSound({
    storyId: 'story.thinking.deep',
    motionId: 'motion.look_back_child',
  });

  return (
    <View
      style={styles.root}
      accessibilityLabel={`${a11y}${soundEnabled ? '' : ' (silent — animation primary)'}`}
    >
      <Animated.Text style={[styles.emoji, style]}>{findik.visual}</Animated.Text>
      <Text style={styles.hint}>
        {motion.id} · {LOOK_BACK_CHILD_TOTAL_MS}ms · {FINDIK_DEEP_THINKING_STATE.pose} ·{' '}
        {story.id}
      </Text>
      <Text style={styles.sub}>
        child→basket→child→smile→basket · Bilge silent · {LS011_PERF.targetFps}fps contract
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.xs, minHeight: 88 },
  emoji: { fontSize: 48 },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
