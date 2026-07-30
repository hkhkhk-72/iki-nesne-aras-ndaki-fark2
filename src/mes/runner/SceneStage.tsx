import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { CharacterId, SceneSpec } from '@/mes/types';
import { getCharacter } from '@/world/characters';
import { colors, radius, spacing, typography } from '@/theme';
import type { AppSettings } from '@/core/settings-store';
import { scaleFont, touchTargetFor } from '@/core/settings-store';
import { isConceptualCount, naturalLayout, pickGrouping } from '@/lab';
import { TOUCH_TARGET_MIN_PX } from '@/benchmark';
import { motionTokens } from '@/design-tokens';
import { SceneLifeLayer } from './SceneLifeLayer';

/** Karakter repliği — sahnenin duygusal taşıyıcısı. */
export function SpeechBubble({
  speaker,
  line,
  settings,
}: {
  speaker: CharacterId;
  line: string;
  settings: AppSettings;
}) {
  const character = getCharacter(speaker);
  return (
    <View style={styles.speechRow}>
      <View style={[styles.avatar, { backgroundColor: character.color + '25' }]}>
        <Text style={styles.avatarEmoji}>{character.visual}</Text>
      </View>
      <View style={styles.bubble}>
        <Text style={[styles.speakerName, { color: character.color }]}>{character.name}</Text>
        {settings.captionsEnabled ? (
          <Text style={[styles.speechText, { fontSize: scaleFont(settings, 17) }]}>{line}</Text>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Bir grubun nesnelerini doğal dizilimle serer (MB-LAB-001).
 * Izgara YASAK. 5+ için alt grup kümeleri kullanılır.
 */
export function GroupDisplay({
  label,
  emoji,
  count,
  highlighted,
  showCount,
  onPress,
  settings,
  layoutSeed = 1,
}: {
  label: string;
  emoji: string;
  count: number;
  highlighted?: boolean;
  showCount?: boolean;
  onPress?: () => void;
  settings: AppSettings;
  layoutSeed?: number;
}) {
  const size = touchTargetFor(settings, TOUCH_TARGET_MIN_PX);
  const field = Math.max(160, size * 2 + 48);
  const groups = useMemo(
    () => (isConceptualCount(count) ? pickGrouping(count, layoutSeed) : [count]),
    [count, layoutSeed],
  );
  const points = useMemo(
    () =>
      naturalLayout({
        count,
        groups,
        seed: layoutSeed * 17 + count * 3,
        width: 1,
        height: 1,
      }),
    [count, groups, layoutSeed],
  );

  const content = (
    <View style={[styles.group, highlighted && styles.groupHighlighted]}>
      <Text style={[styles.groupLabel, { fontSize: scaleFont(settings, 15) }]}>{label}</Text>
      <View style={[styles.naturalField, { width: field, height: field }]}>
        {points.map((p, i) => (
          <Text
            key={i}
            style={{
              position: 'absolute',
              left: p.x * (field - size),
              top: p.y * (field - size),
              fontSize: size,
            }}
          >
            {emoji}
          </Text>
        ))}
      </View>
      {showCount ? <Text style={styles.groupCount}>{count}</Text> : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} accessibilityLabel={label}>
      {content}
    </TouchableOpacity>
  );
}

/** Sahne kabuğu: sinematik açılış + içerik + alt aksiyon. */
export function SceneStage({
  scene,
  settings,
  children,
  footer,
}: {
  scene: SceneSpec;
  settings: AppSettings;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const behaviorFirst = Boolean(scene.behaviorBeforeSpeech);
  const waitTeaching = scene.waitIsTeaching !== false;
  const delayMs = settings.reduceMotion
    ? 0
    : behaviorFirst
      ? (motionTokens[scene.motionToken as keyof typeof motionTokens]?.durationMs ?? 400)
      : 0;
  const [speechReady, setSpeechReady] = useState(!behaviorFirst || delayMs === 0);

  useEffect(() => {
    if (!behaviorFirst || delayMs === 0) {
      setSpeechReady(true);
      return;
    }
    setSpeechReady(false);
    const t = setTimeout(() => setSpeechReady(true), delayMs);
    return () => clearTimeout(t);
  }, [behaviorFirst, delayMs, scene.id]);

  return (
    <View style={styles.stage} accessibilityLabel={scene.accessibilityLabel}>
      <ScrollView
        contentContainerStyle={styles.stageContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.openingVisual}>{scene.opening.visual}</Text>
        {/* Karar 277: önce davranış; söz sonra. Karar 278: beklemek öğretim. */}
        {speechReady && scene.opening.line ? (
          <SpeechBubble
            speaker={scene.opening.speaker}
            line={scene.opening.line}
            settings={settings}
          />
        ) : behaviorFirst && waitTeaching ? (
          <Text style={styles.waitCue}>Fındık bakar… sen de bak.</Text>
        ) : null}
        <SceneLifeLayer scene={scene} settings={settings} />
        {children}
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1 },
  stageContent: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.lg },
  openingVisual: { fontSize: 64, textAlign: 'center' },
  waitCue: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  speechRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 26 },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.sm,
    padding: spacing.md,
    gap: 2,
  },
  speakerName: { ...typography.caption, fontWeight: '700' },
  speechText: { color: colors.text, lineHeight: 24 },
  group: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 140,
  },
  groupHighlighted: { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
  groupLabel: { color: colors.textSecondary, fontWeight: '600' },
  naturalField: {
    position: 'relative',
    alignSelf: 'center',
  },
  groupCount: { ...typography.title, color: colors.primary },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
