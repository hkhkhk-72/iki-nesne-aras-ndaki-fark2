import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { loadStudentProfile } from '@/core/progress-store';
import { getCurriculum, getTotalStats } from '@/core/content-loader';
import type { StudentProfile } from '@/core/types';

const GRADE_META: Record<number, { subtitle: string; color: string }> = {
  1: { subtitle: 'Sayılar, toplama, çıkarma, geometri', color: colors.grade1 },
  2: { subtitle: '100\'e kadar sayılar, çarpma, kesirler', color: colors.grade2 },
  3: { subtitle: '1000\'e kadar, çarpma, bölme, alan', color: colors.grade3 },
  4: { subtitle: 'Dört işlem, kesirler, ondalık, veri', color: colors.grade4 },
};

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const stats = getTotalStats();

  useEffect(() => {
    loadStudentProfile().then(setProfile);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStudentProfile().then(setProfile);
    }, []),
  );

  return (
    <LinearGradient colors={['#E8F4FD', '#F0F7FF', '#FFFFFF']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.logo}>🧠</Text>
            <Text style={styles.title}>MiniBilge</Text>
            <Text style={styles.subtitle}>Matematik Macerası</Text>
          </View>

          {profile ? (
            <View style={styles.profileCard}>
              <Text style={styles.avatar}>{profile.avatar}</Text>
              <View>
                <Text style={styles.greeting}>Merhaba, {profile.name}!</Text>
                <Text style={styles.stars}>⭐ {profile.totalStars} yıldız</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.statsBanner}>
            <Text style={styles.statsTitle}>İlkokul Matematik Müfredatı</Text>
            <View style={styles.statsRow}>
              <StatBadge value={stats.grades} label="Sınıf" />
              <StatBadge value={stats.units} label="Ünite" />
              <StatBadge value={stats.outcomes} label="Kazanım" />
              <StatBadge value={stats.activities} label="Etkinlik" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Sınıfını Seç</Text>
          {[1, 2, 3, 4].map((g) => {
            const meta = GRADE_META[g];
            const curriculum = getCurriculum(g);
            const activityCount = curriculum?.outcomes.reduce((s, o) => s + o.activities.length, 0) ?? 0;
            return (
              <Card
                key={g}
                title={`${g}. Sınıf Matematik`}
                subtitle={`${curriculum?.units.length} ünite · ${curriculum?.outcomes.length} kazanım · ${activityCount} etkinlik`}
                icon={['📚', '📗', '📘', '📙'][g - 1]}
                color={meta.color}
                onPress={() => router.push(`/grade/${g}`)}
                badge={g === 1 ? 'Başla' : undefined}
                style={styles.gradeCard}
              />
            );
          })}

          <View style={styles.actions}>
            <Button
              title="Öğretmen Paneli"
              icon="👩‍🏫"
              variant="outline"
              onPress={() => router.push('/teacher')}
              fullWidth
            />
          </View>

          <Text style={styles.motto}>
            Matematik bir macera, ders değil! 🚀
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StatBadge({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', paddingTop: spacing.lg, gap: spacing.xs },
  logo: { fontSize: 64 },
  title: { ...typography.hero, color: colors.primary },
  subtitle: { ...typography.subheading, color: colors.textSecondary },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
  },
  avatar: { fontSize: 40 },
  greeting: { ...typography.subheading, color: colors.text },
  stars: { ...typography.caption, color: colors.star },
  statsBanner: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
  },
  statsTitle: { ...typography.bodyBold, color: colors.text, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statBadge: { alignItems: 'center' },
  statValue: { ...typography.heading, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing.sm },
  gradeCard: { minHeight: 88 },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  motto: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
