import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card } from '@/components/ui';
import { getCurriculum } from '@/core/content-loader';
import { colors, spacing, typography } from '@/theme';

export default function UnitScreen() {
  const { grade, unitId } = useLocalSearchParams<{ grade: string; unitId: string }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const curriculum = getCurriculum(gradeNum);
  const unit = curriculum?.units.find((u) => u.id === unitId);

  if (!unit || !curriculum) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Bulunamadı" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const outcomes = curriculum.outcomes.filter((o) => unit.outcomeIds.includes(o.id));

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
        {outcomes.map((outcome) => (
          <Card
            key={outcome.id}
            title={outcome.title}
            subtitle={`${outcome.activities.length} etkinlik · ${outcome.code}`}
            icon={outcome.icon}
            color={outcome.color}
            onPress={() => router.push(`/outcome/${gradeNum}/${outcome.id}`)}
            style={styles.outcomeCard}
          />
        ))}
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
