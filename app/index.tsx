import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { loadStudentProfile } from '@/core/progress-store';
import type { StudentProfile } from '@/core/types';

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    loadStudentProfile().then(setProfile);
  }, []);

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

          <Card
            title="1. Sınıf Matematik"
            subtitle="Sayılar, karşılaştırma ve toplama"
            icon="📚"
            color={colors.grade1}
            onPress={() => router.push('/grade/1')}
            badge="Başla"
            style={styles.mainCard}
          />

          <View style={styles.lockedGrades}>
            {[2, 3, 4].map((g) => (
              <View key={g} style={styles.lockedCard}>
                <Text style={styles.lockedIcon}>🔒</Text>
                <Text style={styles.lockedText}>{g}. Sınıf</Text>
              </View>
            ))}
          </View>

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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', paddingTop: spacing.xl, gap: spacing.xs },
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
  mainCard: { minHeight: 100 },
  lockedGrades: { flexDirection: 'row', gap: spacing.sm },
  lockedCard: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    opacity: 0.6,
  },
  lockedIcon: { fontSize: 24 },
  lockedText: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  actions: { gap: spacing.sm },
  motto: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
