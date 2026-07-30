import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Button, ProgressBar } from '@/components/ui';
import { getOutcome } from '@/core/content-loader';
import { loadAllProgress } from '@/core/progress-store';
import {
  getUnlockedActivities,
  calculateOutcomeProgress,
  isLessonCompleted,
} from '@/core/unlock-logic';
import {
  isStudentTrackActivity,
  nextStudentActivity,
} from '@/core/grade1-progress';
import { getExperiencesForOutcome } from '@/mes/experience-registry';
import { colors, spacing, typography, activityModeLabels, radius } from '@/theme';
import type { ActivityConfig, ActivityMode, StudentProgress } from '@/core/types';

const MODE_ORDER: ActivityMode[] = [
  'learn',
  'play',
  'explore',
  'experiment',
  'real_life',
  'home',
  'challenge',
  'smartboard',
  'classroom',
  'ai_reinforcement',
  'pdf',
  'collection',
  'teacher',
];

export default function OutcomeScreen() {
  const { grade, outcomeId } = useLocalSearchParams<{ grade: string; outcomeId: string }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const outcome = getOutcome(gradeNum, outcomeId);
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAllProgress().then(setProgress);
    }, []),
  );

  if (!outcome) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Bulunamadı" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const experiences = getExperiencesForOutcome(outcome.id, outcome.subject);
  const expCodes = experiences.map((e) => e.code);
  const activities = getUnlockedActivities(outcome, progress);
  const progressPct = calculateOutcomeProgress(outcome, progress, expCodes);
  const lessonDone = isLessonCompleted(outcome.id, progress, outcome.subject);
  const grouped = groupByModeOrdered(activities);
  const nextAct = nextStudentActivity(outcome, progress);
  const missingAdventure = experiences.find(
    (e) =>
      !progress.some(
        (p) => p.activityId === `exp-${e.code}` && p.completed && p.outcomeId === outcome.id,
      ),
  );

  const isDone = (activityId: string) =>
    progress.some(
      (p) =>
        p.outcomeId === outcome.id &&
        p.activityId === activityId &&
        p.completed &&
        (p.subject ?? outcome.subject) === outcome.subject,
    );

  const openActivity = (activity: ActivityConfig) => {
    if (!activity.unlocked) return;
    if (activity.mode === 'smartboard') {
      router.push(`/smartboard/${gradeNum}/${outcomeId}`);
      return;
    }
    router.push(`/activity/${gradeNum}/${outcomeId}/${activity.id}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={outcome.title}
        subtitle={outcome.code}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: outcome.color + '20' }]}>
          <Text style={styles.heroIcon}>{outcome.icon}</Text>
          <Text style={styles.heroDesc}>{outcome.description}</Text>
          <ProgressBar
            progress={progressPct}
            label="Öğrenci yolu"
            color={outcome.color}
          />
          {progressPct >= 100 ? (
            <Text style={styles.completeHint}>Kazanım öğrenci yolu tamam ✓</Text>
          ) : (
            <Text style={styles.trackHint}>
              Akıllı tahta isteğe bağlıdır · macera varsa zorunlu
            </Text>
          )}
        </View>

        {experiences.map((exp) => {
          const done = isDone(`exp-${exp.code}`);
          return (
            <TouchableOpacity
              key={exp.code}
              style={[styles.experienceCard, done && styles.experienceDone]}
              onPress={() =>
                router.push({ pathname: '/experience/[code]', params: { code: exp.code } })
              }
            >
              <View style={styles.experienceBadge}>
                <Text style={styles.experienceBadgeText}>
                  {done ? 'MACERA ✓' : 'MACERA'}
                </Text>
              </View>
              <Text style={styles.experienceVisual}>🐿️</Text>
              <Text style={styles.experienceTitle}>{exp.title}</Text>
              <Text style={styles.experienceGoal}>{exp.storyGoal}</Text>
              <Text style={styles.experienceMeta}>
                {exp.scenes.length} sahne · {Math.round(exp.totalSeconds / 60)} dk
              </Text>
            </TouchableOpacity>
          );
        })}

        {!lessonDone ? (
          <TouchableOpacity
            style={[styles.lessonCta, { backgroundColor: outcome.color }]}
            onPress={() => {
              const learn = activities.find((a) => a.mode === 'learn');
              if (learn) openActivity(learn);
            }}
          >
            <Text style={styles.lessonCtaIcon}>📖</Text>
            <View style={styles.lessonCtaText}>
              <Text style={styles.lessonCtaTitle}>Önce Konuyu Öğren</Text>
              <Text style={styles.lessonCtaDesc}>
                {outcome.lesson.slides.length} slayt · {outcome.lesson.durationMinutes} dk
              </Text>
            </View>
            <Text style={styles.lessonCtaArrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.lessonDone}>
            <Text style={styles.lessonDoneText}>✅ Konu anlatımı tamamlandı</Text>
            <Button
              title="Tekrar Oku"
              variant="outline"
              size="sm"
              onPress={() => openActivity(activities.find((a) => a.mode === 'learn')!)}
            />
          </View>
        )}

        {progressPct < 100 && (missingAdventure || nextAct) ? (
          <View style={styles.nextBlock}>
            <Text style={styles.nextLabel}>Sıradaki</Text>
            {missingAdventure && lessonDone ? (
              <Button
                title="Macerayı Tamamla"
                icon="🐿️"
                onPress={() =>
                  router.push({
                    pathname: '/experience/[code]',
                    params: { code: missingAdventure.code },
                  })
                }
                fullWidth
              />
            ) : null}
            {nextAct ? (
              <Button
                title={nextAct.title}
                variant={missingAdventure && lessonDone ? 'outline' : 'primary'}
                onPress={() => openActivity(activities.find((a) => a.id === nextAct.id)!)}
                fullWidth
              />
            ) : null}
          </View>
        ) : null}

        <View style={styles.contexts}>
          <Text style={styles.contextTitle}>🌍 Gerçek Hayat</Text>
          <View style={styles.contextTags}>
            {outcome.realLifeContexts.map((ctx) => (
              <View key={ctx} style={styles.contextTag}>
                <Text style={styles.contextText}>{ctx}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Öğrenme Merkezi</Text>

        {MODE_ORDER.map((mode) => {
          const modeActivities = grouped[mode];
          if (!modeActivities?.length) return null;
          const modeInfo = activityModeLabels[mode];
          if (!modeInfo) return null;
          const optional = mode === 'smartboard' || mode === 'classroom' || mode === 'teacher';
          return (
            <View key={mode} style={styles.modeSection}>
              <View style={styles.modeHeader}>
                <Text style={styles.modeIcon}>{modeInfo.icon}</Text>
                <Text style={[styles.modeTitle, { color: modeInfo.color }]}>
                  {modeInfo.label}
                  {optional ? ' (isteğe bağlı)' : ''}
                </Text>
              </View>
              {modeActivities.map((activity) => {
                const done = isDone(activity.id);
                const onTrack = isStudentTrackActivity(activity);
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.activityCard,
                      !activity.unlocked && styles.locked,
                      done && onTrack && styles.activityDone,
                    ]}
                    onPress={() => openActivity(activity)}
                    disabled={!activity.unlocked}
                  >
                    <Text style={styles.activityIcon}>{activity.icon}</Text>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>
                        {done ? '✓ ' : ''}
                        {activity.title}
                      </Text>
                      <Text style={styles.activityDesc}>{activity.description}</Text>
                      <Text style={styles.activityMeta}>⏱ {activity.estimatedMinutes} dk</Text>
                      {activity.mode === 'challenge' && !activity.unlocked ? (
                        <Text style={styles.lockHint}>Konu + Oyna tamamla</Text>
                      ) : null}
                    </View>
                    <Text style={styles.chevron}>{activity.unlocked ? '→' : '🔒'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function groupByModeOrdered(activities: ActivityConfig[]): Record<string, ActivityConfig[]> {
  const map: Record<string, ActivityConfig[]> = {};
  for (const a of activities) {
    if (!map[a.mode]) map[a.mode] = [];
    map[a.mode].push(a);
  }
  return map;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  heroIcon: { fontSize: 48 },
  heroDesc: { ...typography.body, color: colors.text, textAlign: 'center' },
  trackHint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  completeHint: { ...typography.bodyBold, color: colors.success, textAlign: 'center' },
  nextBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  nextLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' },
  lessonCta: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  lessonCtaIcon: { fontSize: 36 },
  lessonCtaText: { flex: 1 },
  lessonCtaTitle: { ...typography.subheading, color: colors.textLight },
  lessonCtaDesc: { ...typography.caption, color: 'rgba(255,255,255,0.85)' },
  lessonCtaArrow: { fontSize: 24, color: colors.textLight, fontWeight: '700' },
  experienceCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#E67E22',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  experienceDone: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  experienceBadge: {
    backgroundColor: '#E67E22',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  experienceBadgeText: {
    ...typography.caption,
    color: colors.textLight,
    fontWeight: '800',
    fontSize: 11,
  },
  experienceVisual: { fontSize: 44 },
  experienceTitle: { ...typography.subheading, color: colors.text, textAlign: 'center' },
  experienceGoal: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  experienceMeta: { ...typography.caption, color: '#E67E22', fontWeight: '700' },
  lessonDone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  lessonDoneText: { ...typography.bodyBold, color: colors.success },
  contexts: { gap: spacing.sm },
  contextTitle: { ...typography.subheading, color: colors.text },
  contextTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  contextTag: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contextText: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.heading, color: colors.text },
  modeSection: { gap: spacing.sm },
  modeHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  modeIcon: { fontSize: 20 },
  modeTitle: { ...typography.subheading },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityDone: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  locked: { opacity: 0.5 },
  activityIcon: { fontSize: 28 },
  activityInfo: { flex: 1 },
  activityTitle: { ...typography.bodyBold, color: colors.text },
  activityDesc: { ...typography.caption, color: colors.textSecondary },
  activityMeta: { ...typography.caption, color: colors.primary, marginTop: 2 },
  lockHint: { ...typography.caption, color: colors.warning, marginTop: 2 },
  chevron: { fontSize: 20, color: colors.primary, fontWeight: '700' },
});
