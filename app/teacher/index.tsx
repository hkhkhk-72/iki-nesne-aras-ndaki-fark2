import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Card, Button } from '@/components/ui';
import { getCurriculum } from '@/core/content-loader';
import { colors, spacing, typography } from '@/theme';

export default function TeacherScreen() {
  const router = useRouter();
  const curriculum = getCurriculum(1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Öğretmen Paneli"
        subtitle="Sınıf yönetimi ve ilerleme takibi"
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Öğrenci</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Kazanım</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>68%</Text>
            <Text style={styles.statLabel}>Ort. İlerleme</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.actions}>
          <Button title="Akıllı Tahta Modu" icon="📺" onPress={() => router.push('/smartboard/1/out-1-2-1')} fullWidth />
          <Button title="Sınıf Yarışması Başlat" icon="🏆" variant="secondary" onPress={() => {}} fullWidth />
          <Button title="Yazdırılabilir Etkinlik" icon="📄" variant="outline" onPress={() => {}} fullWidth />
        </View>

        <Text style={styles.sectionTitle}>Kazanım İlerlemeleri</Text>
        {curriculum?.outcomes.map((outcome) => (
          <Card
            key={outcome.id}
            title={outcome.title}
            subtitle={`${outcome.activities.length} etkinlik`}
            icon={outcome.icon}
            color={outcome.color}
            progress={Math.floor(Math.random() * 40 + 40)}
            onPress={() => router.push(`/outcome/1/${outcome.id}`)}
            style={styles.outcomeCard}
          />
        ))}

        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>🤖 AI Önerileri</Text>
          <View style={styles.aiCard}>
            <Text style={styles.aiText}>
              3 öğrenci "Daha Fazla – Daha Az" kazanımında zorlanıyor.
              Karşılaştırma oyununu sınıfta tekrar oynamanız önerilir.
            </Text>
          </View>
          <View style={styles.aiCard}>
            <Text style={styles.aiText}>
              Velilere ev etkinliği önerisi: "Çorap Eşleştir" etkinliğini
              bu hafta sonu evde yapın.
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
