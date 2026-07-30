import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card } from '@/components/ui';
import { getCurriculum } from '@/core/content-loader';
import { loadAllProgress } from '@/core/progress-store';
import { calculateStudentOutcomeProgress } from '@/core/grade1-progress';
import { getExperiencesForOutcome } from '@/mes/experience-registry';
import { colors, spacing, typography } from '@/theme';
import type { StudentProgress } from '@/core/types';

export default function UnitScreen() {
  const { grade, unitId } = useLocalSearchParams<{ grade: string; unitId: string }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const curriculum = getCurriculum(gradeNum);
  const unit = curriculum?.units.find((u) => u.id === unitId);
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAllProgress().then(setProgress);
    }, []),
  );

  const outcomes = useMemo(() => {
    if (!unit || !curriculum) return [];
    return curriculum.outcomes.filter((o) => unit.outcomeIds.includes(o.id));
  }, [unit, curriculum]);

  if (!unit || !curriculum) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Bulunamadı" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={unit.title}
        subtitle={unit.description}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Öğrenme Merkezleri</Text>
        <Text style={styles.sectionDesc}>
          Her kazanım kendi eğitim dünyasıdır. Oyna, keşfet, dene!
        </Text>
        {outcomes.map((outcome) => {
          const expCodes = getExperiencesForOutcome(outcome.id, outcome.subject).map(
            (e) => e.code,
          );
          const pct = calculateStudentOutcomeProgress(outcome, progress, expCodes);
          const studentCount = outcome.activities.filter((a) =>
            ['learn', 'play', 'explore', 'experiment', 'home', 'real_life', 'challenge'].includes(
              a.mode,
            ),
          ).length;
          return (
            <Card
              key={outcome.id}
              title={outcome.title}
              subtitle={`${studentCount} öğrenci etkinliği · ${outcome.code}`}
              icon={outcome.icon}
              color={outcome.color}
              onPress={() => router.push(`/outcome/${gradeNum}/${outcome.id}`)}
              badge={pct >= 100 ? '✓' : `${pct}%`}
              progress={pct}
              style={styles.outcomeCard}
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
  sectionTitle: { ...typography.heading, color: colors.text },
  sectionDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  outcomeCard: { marginBottom: spacing.sm },
});
