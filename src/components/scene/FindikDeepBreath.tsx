import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { getCharacter } from '@/world/characters';
import { ASSETS, DEEP_BREATH_IDLE_AFTER_MS, DEEP_BREATH_SPEC } from '@/world/assets';
import { FINDIK_DEEP_THINKING_STATE } from '@/world/character-states';
import { storyTokens } from '@/design-tokens';
import { meaningWithoutSound } from '@/core/accessibility';
import { colors, spacing, typography } from '@/theme';

/**
 * anim.deep_breath (AN008) — 5s idle sonrası.
 * Slow inhale / slow exhale · tiny shoulder · very small chest.
 * GPU-friendly transform; cancel on unmount.
 */
export function FindikDeepBreath({
  idleMs = DEEP_BREATH_IDLE_AFTER_MS,
  reduceMotion,
  soundEnabled = true,
  lastInteractionAt,
}: {
  idleMs?: number;
  reduceMotion?: boolean;
  soundEnabled?: boolean;
  lastInteractionAt?: number;
}) {
  const findik = getCharacter('findik');
  const chest = useSharedValue(1);
  const shoulder = useSharedValue(0);
  const [active, setActive] = useState(false);
  const started = useRef(lastInteractionAt ?? Date.now());
  const story = storyTokens['story.thinking.deep'];
  const { inhaleMs, exhaleMs, shoulderLift, chestScalePeak, bodyScalePeak } = DEEP_BREATH_SPEC;

  useEffect(() => {
    started.current = lastInteractionAt ?? Date.now();
    setActive(false);
    cancelAnimation(chest);
    cancelAnimation(shoulder);
    chest.value = 1;
    shoulder.value = 0;

    const t = setTimeout(() => {
      setActive(true);
      if (reduceMotion) {
        chest.value = bodyScalePeak;
        shoulder.value = 1;
        return;
      }
      // Slow inhale → slow exhale
      chest.value = withSequence(
        withTiming(chestScalePeak, { duration: inhaleMs, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: exhaleMs, easing: Easing.inOut(Easing.sin) }),
      );
      shoulder.value = withSequence(
        withTiming(1, { duration: inhaleMs, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: exhaleMs, easing: Easing.inOut(Easing.sin) }),
      );
    }, idleMs);

    return () => {
      clearTimeout(t);
      cancelAnimation(chest);
      cancelAnimation(shoulder);
    };
  }, [
    bodyScalePeak,
    chest,
    chestScalePeak,
    exhaleMs,
    idleMs,
    inhaleMs,
    lastInteractionAt,
    reduceMotion,
    shoulder,
  ]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: chest.value },
      { translateY: -shoulder.value * shoulderLift },
    ],
  }));

  const a11y = meaningWithoutSound({
    storyId: 'story.thinking.deep',
    fallback: `${findik.name} yavaş nefes alıyor.`,
  });

  return (
    <View
      style={styles.root}
      accessibilityLabel={
        active
          ? `${a11y}${soundEnabled ? '' : ' (silent — animation primary)'}`
          : `${findik.name} bekliyor.`
      }
    >
      <Animated.Text style={[styles.emoji, style]}>{findik.visual}</Animated.Text>
      {active ? (
        <Text style={styles.hint}>
          {ASSETS.AN008.alias} · inhale/exhale · {FINDIK_DEEP_THINKING_STATE.anims[0]} ·{' '}
          {story.id}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.xs, minHeight: 72 },
  emoji: { fontSize: 48 },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
