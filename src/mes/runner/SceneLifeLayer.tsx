import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { AppSettings } from '@/core/settings-store';
import type { SceneSpec } from '@/mes/types';
import { FindikDeepBreath, LookBackChild } from '@/components/scene';
import { createCharacterLifeEngine } from '@/life/engine';
import { isLifeTokenId } from '@/design-tokens/life';
import type { StoryTokenId } from '@/design-tokens/story';

/**
 * Sahne yaşam katmanı — MBA-LIFE-001 + LS-011 prep.
 * Gameplay değiştirmez; karakteri “canlı” tutar.
 */
export function SceneLifeLayer({
  scene,
  settings,
}: {
  scene: SceneSpec;
  settings: AppSettings;
}) {
  const engineRef = useRef(createCharacterLifeEngine());
  const [lastTick, setLastTick] = useState<string | null>(null);
  const storyId = scene.storyToken as StoryTokenId | undefined;
  const showDeepBreath =
    scene.motionToken === 'motion.deepBreath' ||
    storyId === 'story.thinking.deep' ||
    storyId === 'story.calm' ||
    storyId === 'story.observe';
  const showLookBack =
    scene.motionToken === 'motion.look_back_child' ||
    storyId === 'story.thinking.deep' ||
    Boolean(scene.waitIsTeaching);

  useEffect(() => {
    const engine = engineRef.current;
    if (storyId) {
      try {
        engine.setStory(storyId);
      } catch {
        // ignore unknown story influence
      }
    }
    engine.setAiContext({ childWaiting: true, waitMs: 0 });

    if (settings.reduceMotion) return;

    const id = setInterval(() => {
      const next = engine.tickIdle({ now: Date.now() });
      if (next && next !== 'life.nothing' && isLifeTokenId(next)) {
        setLastTick(next);
      }
    }, 4500);

    return () => clearInterval(id);
  }, [scene.id, settings.reduceMotion, storyId]);

  if (settings.reduceMotion && !showDeepBreath && !showLookBack) {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="none" accessibilityElementsHidden>
      {showLookBack ? (
        <LookBackChild
          active={!settings.reduceMotion}
          reduceMotion={settings.reduceMotion}
          soundEnabled={settings.soundEnabled}
        />
      ) : showDeepBreath ? (
        <FindikDeepBreath
          reduceMotion={settings.reduceMotion}
          soundEnabled={settings.soundEnabled}
        />
      ) : null}
      {/* lastTick reserved for future debug chip — keep silent in product UI */}
      {lastTick ? null : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    minHeight: 0,
    marginBottom: 4,
  },
});
