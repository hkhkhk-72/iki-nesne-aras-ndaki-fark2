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
import { motionTokens, storyTokens } from '@/design-tokens';
import { FINDIK_DEEP_THINKING_STATE } from '@/world/character-states';
import { meaningWithoutSound } from '@/core/accessibility';
import { colors, spacing, typography } from '@/theme';

/**
 * motion.look_back_child — Fındık çocuğa bakar, sonra palamutlara döner.
 * Loop: 6 saniye. Ses kapalıda anlam korunur. Bilge konuşmaz.
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
  const look = useSharedValue(0);
  const motion = motionTokens['motion.look_back_child'];
  const story = storyTokens['story.thinking.deep'];
  const loopMs = motion.loopMs ?? motion.durationMs;
  const half = loopMs / 2;

  useEffect(() => {
    if (!active || reduceMotion) {
      look.value = 0.5;
      return;
    }
    look.value = 0;
    look.value = withRepeat(
      withSequence(
        withTiming(1, { duration: half, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: half, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(look);
  }, [active, half, look, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    // 0 = palamutlara, 1 = çocuğa bakış (hafif yatay kayma)
    transform: [{ translateX: (look.value - 0.5) * 16 }],
  }));

  const a11y = meaningWithoutSound({
    storyId: 'story.thinking.deep',
    motionId: 'motion.look_back_child',
  });

  return (
    <View
      style={styles.root}
      accessibilityLabel={`${a11y}${soundEnabled ? '' : ' (ses kapalı)'}`}
    >
      <Animated.Text style={[styles.emoji, style]}>{findik.visual}</Animated.Text>
      <Text style={styles.hint}>
        {motion.id} · {loopMs}ms · {FINDIK_DEEP_THINKING_STATE.pose} · {story.id}
      </Text>
      <Text style={styles.sub}>Bilge konuşmaz · dünya sakin</Text>
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
