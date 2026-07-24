import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Button } from '@/components/ui';
import { getAllCurricula, getTotalStats } from '@/core/content-loader';
import { colors, spacing, typography, radius } from '@/theme';

export default function TeacherScreen() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState(1);
  const stats = getTotalStats();
  const curricula = getAllCurricula();
  const curriculum = curricula.find((c) => c.grade === selectedGrade);

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
          <Button title="Akıllı Tahta Modu" icon="📺" onPress={() => router.push('/smartboard/1/out-1-2-1')} fullWidth />
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
                  progress={Math.floor(Math.random() * 40 + 30)}
                  onPress={() => router.push(`/outcome/${selectedGrade}/${outcome.id}`)}
                  style={styles.outcomeCard}
                />
              ))}
            </View>
          );
        })}

        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>🤖 AI Önerileri</Text>
          <View style={styles.aiCard}>
            <Text style={styles.aiText}>
              1. sınıfta 3 öğrenci "Daha Fazla – Daha Az" kazanımında zorlanıyor.
            </Text>
          </View>
          <View style={styles.aiCard}>
            <Text style={styles.aiText}>
              3. sınıfta çarpım tablosu pekiştirmesi önerilir. 7 ve 8'ler zayıf.
            </Text>
          </View>
          <View style={styles.aiCard}>
            <Text style={styles.aiText}>
              4. sınıf kesir toplama konusunda sınıf ortalaması %45. Akıllı tahta etkinliği önerilir.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
});
