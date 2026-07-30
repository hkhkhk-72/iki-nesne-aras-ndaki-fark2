import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Button, ProgressBar } from '@/components/ui';
import { getCurriculum } from '@/core/content-loader';
import { loadAllProgress } from '@/core/progress-store';
import {
  calculateGradeStudentProgress,
  nextIncompleteOutcome,
} from '@/core/grade1-progress';
import { getExperiencesForOutcome } from '@/mes/experience-registry';
import { colors, spacing, typography, radius } from '@/theme';
import type { StudentProgress } from '@/core/types';

const GRADE_COLORS: Record<number, string> = {
  1: colors.grade1,
  2: colors.grade2,
  3: colors.grade3,
  4: colors.grade4,
};

export default function GradeScreen() {
  const { grade } = useLocalSearchParams<{ grade: string }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const curriculum = getCurriculum(gradeNum);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const accent = GRADE_COLORS[gradeNum] ?? colors.primary;

  useFocusEffect(
    useCallback(() => {
      loadAllProgress().then(setProgress);
    }, []),
  );

  const experiencesByOutcome = useMemo(() => {
    const map = new Map<string, readonly string[]>();
    if (!curriculum) return map;
    for (const o of curriculum.outcomes) {
      map.set(
        o.id,
        getExperiencesForOutcome(o.id, o.subject).map((e) => e.code),
      );
    }
    return map;
  }, [curriculum]);

  const gradeProgress = useMemo(() => {
    if (!curriculum) {
      return { percent: 0, completedOutcomes: 0, totalOutcomes: 0 };
    }
    return calculateGradeStudentProgress(
      curriculum.outcomes,
      progress,
      experiencesByOutcome,
    );
  }, [curriculum, progress, experiencesByOutcome]);

  const nextOutcome = useMemo(() => {
    if (!curriculum) return null;
    return nextIncompleteOutcome(curriculum.outcomes, progress, experiencesByOutcome);
  }, [curriculum, progress, experiencesByOutcome]);

  if (!curriculum) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Bulunamadı" onBack={() => router.back()} />
        <Text style={styles.error}>Bu sınıf henüz hazır değil.</Text>
      </SafeAreaView>
    );
  }

  const isGrade1 = gradeNum === 1;
  const nextExps = nextOutcome
    ? getExperiencesForOutcome(nextOutcome.id, nextOutcome.subject)
    : [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={curriculum.title}
        subtitle={`${curriculum.units.length} ünite · ${curriculum.outcomes.length} kazanım`}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.summary, { backgroundColor: accent + '15' }]}>
          <Text style={styles.summaryText}>
            {gradeProgress.completedOutcomes}/{gradeProgress.totalOutcomes} kazanım tamam
          </Text>
          <ProgressBar progress={gradeProgress.percent} label="Öğrenci yolu" color={accent} />
          <Text style={styles.summaryHint}>
            Akıllı tahta sınıf içindir; öğrenci yolunu kilitlemez.
          </Text>
        </View>

        {isGrade1 && nextOutcome ? (
          <View style={styles.continueBlock}>
            <Text style={styles.continueTitle}>Devam et</Text>
            <Text style={styles.continueDesc}>
              {nextOutcome.code} · {nextOutcome.title}
            </Text>
            <Button
              title="Kazanıma Git"
              onPress={() => router.push(`/outcome/${gradeNum}/${nextOutcome.id}`)}
              fullWidth
            />
            {nextExps[0] ? (
              <Button
                title="Fındık ile Maceraya Başla"
                icon="🐿️"
                variant="outline"
                onPress={() =>
                  router.push({
                    pathname: '/experience/[code]',
                    params: { code: nextExps[0].code },
                  })
                }
                fullWidth
              />
            ) : null}
          </View>
        ) : null}

        {isGrade1 && gradeProgress.percent >= 100 ? (
          <View style={[styles.doneBanner, { borderColor: accent }]}>
            <Text style={styles.doneEmoji}>🏅</Text>
            <Text style={styles.doneText}>1. sınıf öğrenci yolu tamam!</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Üniteler</Text>
        {curriculum.units.map((unit) => {
          const outcomes = curriculum.outcomes.filter((o) => unit.outcomeIds.includes(o.id));
          const unitPct = calculateGradeStudentProgress(
            outcomes,
            progress,
            experiencesByOutcome,
          );
          return (
            <Card
              key={unit.id}
              title={unit.title}
              subtitle={unit.description}
              icon={unit.icon}
              color={unit.color}
              onPress={() => router.push(`/unit/${gradeNum}/${unit.id}`)}
              badge={`${unitPct.percent}%`}
              progress={unitPct.percent}
              style={styles.unitCard}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  summary: {
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryText: { ...typography.bodyBold, color: colors.text, textAlign: 'center' },
  summaryHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  continueBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  continueTitle: { ...typography.heading, color: colors.text },
  continueDesc: { ...typography.body, color: colors.textSecondary },
  doneBanner: {
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
  },
  doneEmoji: { fontSize: 36 },
  doneText: { ...typography.subheading, color: colors.text },
  sectionTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.xs },
  unitCard: { marginBottom: spacing.sm },
  error: { ...typography.body, color: colors.error, textAlign: 'center', marginTop: spacing.xl },
});
