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
import { ASSETS, DEEP_BREATH_IDLE_AFTER_MS } from '@/world/assets';
import { FINDIK_DEEP_THINKING_STATE } from '@/world/character-states';
import { storyTokens } from '@/design-tokens';
import { meaningWithoutSound } from '@/core/accessibility';
import { colors, spacing, typography } from '@/theme';

/**
 * anim.deep_breath (AN008) — idle’da Fındık derin nefes alır.
 * 5 sn hareketsizlik sonrası tetiklenir.
 * Ses kapalı modda görsel anlam korunur.
 */
export function FindikDeepBreath({
  idleMs = DEEP_BREATH_IDLE_AFTER_MS,
  reduceMotion,
  soundEnabled = true,
  lastInteractionAt,
}: {
  /** Varsayılan 5000 ms. */
  idleMs?: number;
  reduceMotion?: boolean;
  soundEnabled?: boolean;
  /** Son dokunuş zamanı; verilmezse mount’tan sayar. */
  lastInteractionAt?: number;
}) {
  const findik = getCharacter('findik');
  const breath = useSharedValue(1);
  const [active, setActive] = useState(false);
  const started = useRef(lastInteractionAt ?? Date.now());
  const story = storyTokens['story.thinking.deep'];

  useEffect(() => {
    started.current = lastInteractionAt ?? Date.now();
    setActive(false);
    cancelAnimation(breath);
    breath.value = 1;

    const t = setTimeout(() => {
      setActive(true);
      if (reduceMotion) {
        breath.value = 1.03;
        return;
      }
      breath.value = withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      );
    }, idleMs);

    return () => {
      clearTimeout(t);
      cancelAnimation(breath);
    };
  }, [breath, idleMs, lastInteractionAt, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
  }));

  const a11y = meaningWithoutSound({
    storyId: 'story.thinking.deep',
    fallback: `${findik.name} derin nefes alıyor.`,
  });

  return (
    <View
      style={styles.root}
      accessibilityLabel={
        active
          ? `${a11y}${soundEnabled ? '' : ' (ses kapalı — anlam korunuyor)'}`
          : `${findik.name} bekliyor.`
      }
    >
      <Animated.Text style={[styles.emoji, style]}>{findik.visual}</Animated.Text>
      {active ? (
        <Text style={styles.hint}>
          {ASSETS.AN008.alias} · {FINDIK_DEEP_THINKING_STATE.anims[0]} · {story.id}
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
