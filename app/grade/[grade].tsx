import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card } from '@/components/ui';
import { getCurriculum } from '@/core/content-loader';
import { colors, spacing, typography } from '@/theme';

export default function GradeScreen() {
  const { grade } = useLocalSearchParams<{ grade: string }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const curriculum = getCurriculum(gradeNum);

  if (!curriculum) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Bulunamadı" onBack={() => router.back()} />
        <Text style={styles.error}>Bu sınıf henüz hazır değil.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={curriculum.title}
        subtitle={`${curriculum.units.length} ünite · ${curriculum.outcomes.length} kazanım`}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Üniteler</Text>
        {curriculum.units.map((unit) => {
          const outcomes = curriculum.outcomes.filter((o) => unit.outcomeIds.includes(o.id));
          return (
            <Card
              key={unit.id}
              title={unit.title}
              subtitle={unit.description}
              icon={unit.icon}
              color={unit.color}
              onPress={() => router.push(`/unit/${gradeNum}/${unit.id}`)}
              badge={`${outcomes.length} kazanım`}
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
  sectionTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.xs },
  unitCard: { marginBottom: spacing.sm },
  error: { ...typography.body, color: colors.error, textAlign: 'center', marginTop: spacing.xl },
});
