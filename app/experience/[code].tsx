import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Button } from '@/components/ui';
import { getExperience } from '@/mes/experience-registry';
import { ExperienceRunner } from '@/mes/runner/ExperienceRunner';
import { loadSettings, type AppSettings, defaultSettings } from '@/core/settings-store';
import { saveActivityProgress } from '@/core/progress-store';
import { DEFAULT_SUBJECT } from '@/core/subject-registry';
import { filterByAudience, type ExperienceInsights } from '@/ai/insights';
import { saveExperienceRecord } from '@/ai/insights-store';
import type { SceneBehavior } from '@/ai/observer';
import { getWorldState, getLocation, type LocationId } from '@/world/locations';
import { colors, radius, spacing, typography } from '@/theme';

type Phase = 'intro' | 'playing' | 'done';

export default function ExperienceScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const experience = getExperience(code);

  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [phase, setPhase] = useState<Phase>('intro');
  const [insights, setInsights] = useState<ExperienceInsights | null>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  if (!experience) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Macera Bulunamadı" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const world = getWorldState();
  const location = getLocation(experience.location as LocationId);

  const handleFinish = async (result: {
    behaviors: SceneBehavior[];
    insights: ExperienceInsights;
    durationMs: number;
  }) => {
    setInsights(result.insights);
    setPhase('done');
    await saveExperienceRecord({
      code: experience.code,
      completedAt: new Date().toISOString(),
      durationMs: result.durationMs,
      behaviors: result.behaviors,
      insights: result.insights,
    });
    await saveActivityProgress({
      subject: DEFAULT_SUBJECT,
      outcomeId: experience.outcomeId,
      activityId: `exp-${experience.code}`,
      completed: true,
      // Deneyimlerde puan yoktur; ilerleme kaydı için sabit değer.
      score: 100,
      attempts: 1,
      lastPlayedAt: new Date().toISOString(),
    });
  };

  if (phase === 'playing') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader
          title={experience.title}
          subtitle={experience.storyGoal}
          onBack={() => setPhase('intro')}
        />
        <ExperienceRunner
          experience={experience}
          settings={settings}
          onFinish={handleFinish}
        />
      </SafeAreaView>
    );
  }

  if (phase === 'done' && insights) {
    const childInsights = filterByAudience(insights, 'child');
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Macera Tamamlandı" onBack={() => router.back()} />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.doneHero}>
            <Text style={styles.doneEmoji}>🏅</Text>
            <Text style={styles.doneTitle}>Fındık sana teşekkür ediyor!</Text>
          </View>

          {childInsights.map((insight, idx) => (
            <View key={idx} style={styles.insightCard}>
              <Text style={styles.insightMessage}>{insight.message}</Text>
              {insight.nextStep ? (
                <Text style={styles.insightNext}>{insight.nextStep}</Text>
              ) : null}
            </View>
          ))}

          <Button
            title="Tekrar Oyna"
            variant="outline"
            onPress={() => {
              setInsights(null);
              setPhase('playing');
            }}
            fullWidth
          />
          <Button title="Köye Dön" variant="success" onPress={() => router.back()} fullWidth />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={experience.title} subtitle={experience.code} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: location.color + '20' }]}>
          <Text style={styles.heroVisual}>{location.visual}</Text>
          <Text style={styles.heroLocation}>{location.name}</Text>
          <Text style={styles.heroWorld}>
            {world.greeting} {world.weather === 'karli' ? '❄️' : ''}
          </Text>
        </View>

        <View style={styles.storyCard}>
          <Text style={styles.storyLabel}>Görevin</Text>
          <Text style={styles.storyGoal}>{experience.storyGoal}</Text>
          <Text style={styles.meta}>
            {experience.scenes.length} sahne · yaklaşık {Math.round(experience.totalSeconds / 60)} dakika
          </Text>
        </View>

        <View style={styles.charactersRow}>
          <Text style={styles.characterEmoji}>🐿️</Text>
          <Text style={styles.characterEmoji}>🦉</Text>
        </View>

        <Button
          title="Maceraya Başla"
          onPress={() => setPhase('playing')}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  hero: { borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.xs },
  heroVisual: { fontSize: 56 },
  heroLocation: { ...typography.heading, color: colors.text },
  heroWorld: { ...typography.caption, color: colors.textSecondary },
  storyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  storyLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' },
  storyGoal: { ...typography.subheading, color: colors.text },
  meta: { ...typography.caption, color: colors.primary, marginTop: spacing.xs },
  charactersRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  characterEmoji: { fontSize: 44 },
  doneHero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  doneEmoji: { fontSize: 72 },
  doneTitle: { ...typography.title, color: colors.text, textAlign: 'center' },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    gap: 4,
  },
  insightMessage: { ...typography.body, color: colors.text },
  insightNext: { ...typography.caption, color: colors.textSecondary },
});
