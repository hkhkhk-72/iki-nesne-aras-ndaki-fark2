import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { EngineProps, EngineResult, LessonPayload } from '@/core/types';
import type { GameEngine } from '@/core/types';
import { Button } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';

const { width } = Dimensions.get('window');

function LessonEngine({ payload, onComplete }: EngineProps<LessonPayload>) {
  const [slideIndex, setSlideIndex] = useState(0);
  const startTime = useRef(Date.now());
  const slide = payload.slides[slideIndex];
  const isLast = slideIndex === payload.slides.length - 1;
  const isFirst = slideIndex === 0;

  const goNext = () => {
    if (isLast) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete({
        correct: payload.slides.length,
        total: payload.slides.length,
        score: 100,
        timeSpentMs: Date.now() - startTime.current,
        mistakes: [],
        completed: true,
      });
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSlideIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (!isFirst) setSlideIndex((i) => i - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {slideIndex + 1} / {payload.slides.length}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((slideIndex + 1) / payload.slides.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.slideContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.visual}>{slide.visual}</Text>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideBody}>{slide.body}</Text>
        {slide.tip ? (
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>💡 {slide.tip}</Text>
          </View>
        ) : null}

        {isLast ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Önemli Noktalar</Text>
            {payload.keyPoints.map((point) => (
              <Text key={point} style={styles.summaryPoint}>✓ {point}</Text>
            ))}
            <Text style={styles.realLife}>🌍 {payload.realLifeExample}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.nav}>
        {!isFirst ? (
          <Button title="← Geri" variant="outline" onPress={goPrev} size="sm" />
        ) : (
          <View style={styles.navSpacer} />
        )}
        <Button
          title={isLast ? 'Tamamladım! 🎉' : 'Devam →'}
          onPress={goNext}
          size="md"
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  progressRow: { gap: spacing.xs, marginBottom: spacing.md },
  progressText: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  slideContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md,
    minHeight: width * 0.8,
  },
  visual: { fontSize: 72, textAlign: 'center' },
  slideTitle: { ...typography.title, color: colors.text, textAlign: 'center' },
  slideBody: { ...typography.body, color: colors.text, textAlign: 'center', lineHeight: 26, maxWidth: 480 },
  tipBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    width: '100%',
  },
  tipText: { ...typography.body, color: colors.text },
  summaryBox: {
    backgroundColor: colors.successLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    gap: spacing.sm,
  },
  summaryTitle: { ...typography.subheading, color: colors.success },
  summaryPoint: { ...typography.body, color: colors.text },
  realLife: { ...typography.bodyBold, color: colors.primary, marginTop: spacing.sm },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  navSpacer: { width: 80 },
  nextBtn: { flex: 1 },
});

export const lessonEngine: GameEngine<LessonPayload> = {
  id: 'lesson',
  name: 'Konu Anlatım Motoru',
  description: 'Slayt tabanlı konu anlatımı',
  Component: LessonEngine,
};
