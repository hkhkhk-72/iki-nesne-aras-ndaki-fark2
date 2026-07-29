import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Button } from '@/components/ui';
import { getAllCurricula, getTotalStats } from '@/core/content-loader';
import { loadExperienceRecords, type StoredExperienceRecord } from '@/ai/insights-store';
import { filterByAudience, LEVEL_LABELS } from '@/ai/insights';
import { hasHesitation } from '@/ai/observer';
import { hasExperience } from '@/mes/experience-registry';
import { colors, spacing, typography, radius } from '@/theme';

export default function TeacherScreen() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [records, setRecords] = useState<StoredExperienceRecord[]>([]);
  const stats = getTotalStats();
  const curricula = getAllCurricula();
  const curriculum = curricula.find((c) => c.grade === selectedGrade);

  useEffect(() => {
    loadExperienceRecords().then(setRecords);
  }, []);

  const latest = records[records.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Öğretmen Paneli"
        subtitle="Tüm sınıflar · İlerleme takibi"
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Öğrenci</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.outcomes}</Text>
            <Text style={styles.statLabel}>Kazanım</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activities}</Text>
            <Text style={styles.statLabel}>Etkinlik</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.actions}>
          <Button title="Akıllı Tahta Modu" icon="📺" onPress={() => router.push('/smartboard/1/out-1-1-1')} fullWidth />
          <Button title="Sınıf Yarışması Başlat" icon="🏆" variant="secondary" onPress={() => {}} fullWidth />
          <Button title="Yazdırılabilir Etkinlik" icon="📄" variant="outline" onPress={() => {}} fullWidth />
        </View>

        <Text style={styles.sectionTitle}>Sınıf Seç</Text>
        <View style={styles.gradeTabs}>
          {[1, 2, 3, 4].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.gradeTab, selectedGrade === g && styles.gradeTabActive]}
              onPress={() => setSelectedGrade(g)}
            >
              <Text style={[styles.gradeTabText, selectedGrade === g && styles.gradeTabTextActive]}>
                {g}. Sınıf
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {curriculum?.title} — {curriculum?.outcomes.length} Kazanım
        </Text>
        {curriculum?.units.map((unit) => {
          const unitOutcomes = curriculum.outcomes.filter((o) => o.unitId === unit.id);
          return (
            <View key={unit.id} style={styles.unitSection}>
              <Text style={styles.unitTitle}>{unit.icon} {unit.title}</Text>
              {unitOutcomes.map((outcome) => (
                <Card
                  key={outcome.id}
                  title={outcome.title}
                  subtitle={`${outcome.code} · ${outcome.activities.length} etkinlik`}
                  icon={outcome.icon}
                  color={outcome.color}
                  badge={hasExperience(outcome.id, outcome.subject) ? 'Macera' : undefined}
                  onPress={() => router.push(`/outcome/${selectedGrade}/${outcome.id}`)}
                  style={styles.outcomeCard}
                />
              ))}
            </View>
          );
        })}

        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>🤖 Davranış Analizi</Text>
          <Text style={styles.sectionNote}>
            Puan gösterilmez. Kavramın oturup oturmadığı davranıştan okunur.
          </Text>

          {latest ? (
            <>
              <View style={styles.behaviorHeader}>
                <Text style={styles.behaviorCode}>{latest.code}</Text>
                <View style={[styles.levelChip, levelChipStyle(latest.insights.level)]}>
                  <Text style={styles.levelChipText}>
                    {LEVEL_LABELS[latest.insights.level]}
                  </Text>
                </View>
              </View>

              <View style={styles.behaviorGrid}>
                <BehaviorStat
                  label="Tekrar"
                  value={latest.behaviors.reduce((s, b) => s + b.retries, 0)}
                />
                <BehaviorStat
                  label="İpucu"
                  value={latest.behaviors.reduce((s, b) => s + b.hintsShown, 0)}
                />
                <BehaviorStat
                  label="Kararsızlık"
                  value={latest.behaviors.filter(hasHesitation).length}
                />
                <BehaviorStat
                  label="Süre"
                  value={`${Math.round(latest.durationMs / 1000)}s`}
                />
              </View>

              {filterByAudience(latest.insights, 'teacher').map((insight, idx) => (
                <View key={idx} style={styles.aiCard}>
                  <Text style={styles.aiText}>{insight.message}</Text>
                  {insight.nextStep ? (
                    <Text style={styles.aiNext}>→ {insight.nextStep}</Text>
                  ) : null}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.aiCard}>
              <Text style={styles.aiText}>
                Henüz mikro deneyim verisi yok. Bir öğrenci "Fındık Sincap'ın Kış Hazırlığı"
                macerasını tamamladığında kavram bazlı davranış analizi burada görünecek.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BehaviorStat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.behaviorStat}>
      <Text style={styles.behaviorValue}>{value}</Text>
      <Text style={styles.behaviorLabel}>{label}</Text>
    </View>
  );
}

function levelChipStyle(level: 'guclu' | 'gelisiyor' | 'destek_gerekli') {
  switch (level) {
    case 'guclu':
      return { backgroundColor: colors.success };
    case 'gelisiyor':
      return { backgroundColor: colors.warning };
    default:
      return { backgroundColor: colors.error };
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: { ...typography.title, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.heading, color: colors.text },
  actions: { gap: spacing.sm },
  gradeTabs: { flexDirection: 'row', gap: spacing.xs },
  gradeTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  gradeTabActive: { backgroundColor: colors.primary },
  gradeTabText: { ...typography.caption, fontWeight: '600', color: colors.textSecondary },
  gradeTabTextActive: { color: colors.textLight },
  unitSection: { gap: spacing.xs },
  unitTitle: { ...typography.subheading, color: colors.text, marginBottom: spacing.xs },
  outcomeCard: { marginBottom: spacing.xs },
  aiSection: { gap: spacing.sm },
  aiCard: {
    backgroundColor: '#E8F8FF',
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  aiText: { ...typography.body, color: colors.text },
  aiNext: { ...typography.caption, color: colors.primary, marginTop: 4, fontWeight: '600' },
  sectionNote: { ...typography.caption, color: colors.textSecondary },
  behaviorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  behaviorCode: { ...typography.bodyBold, color: colors.text },
  levelChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  levelChipText: { ...typography.caption, color: colors.textLight, fontWeight: '700' },
  behaviorGrid: { flexDirection: 'row', gap: spacing.sm },
  behaviorStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  behaviorValue: { ...typography.subheading, color: colors.primary },
  behaviorLabel: { ...typography.caption, color: colors.textSecondary },
});
