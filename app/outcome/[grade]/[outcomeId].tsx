import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
import { getOutcome } from '@/core/content-loader';
import { colors, spacing, typography, activityModeLabels, radius } from '@/theme';
import type { ActivityMode } from '@/core/types';

export default function OutcomeScreen() {
  const { grade, outcomeId } = useLocalSearchParams<{ grade: string; outcomeId: string }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const outcome = getOutcome(gradeNum, outcomeId);

  if (!outcome) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Bulunamadı" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const groupedActivities = groupByMode(outcome.activities);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={outcome.title}
        subtitle={outcome.code}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: outcome.color + '20' }]}>
          <Text style={styles.heroIcon}>{outcome.icon}</Text>
          <Text style={styles.heroDesc}>{outcome.description}</Text>
        </View>

        <View style={styles.contexts}>
          <Text style={styles.contextTitle}>🌍 Gerçek Hayat</Text>
          <View style={styles.contextTags}>
            {outcome.realLifeContexts.map((ctx) => (
              <View key={ctx} style={styles.contextTag}>
                <Text style={styles.contextText}>{ctx}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Öğrenme Merkezi</Text>

        {Object.entries(groupedActivities).map(([mode, activities]) => {
          const modeInfo = activityModeLabels[mode as ActivityMode];
          if (!modeInfo) return null;
          return (
            <View key={mode} style={styles.modeSection}>
              <View style={styles.modeHeader}>
                <Text style={styles.modeIcon}>{modeInfo.icon}</Text>
                <Text style={[styles.modeTitle, { color: modeInfo.color }]}>{modeInfo.label}</Text>
              </View>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[styles.activityCard, !activity.unlocked && styles.locked]}
                  onPress={() => {
                    if (!activity.unlocked) return;
                    if (activity.mode === 'smartboard') {
                      router.push(`/smartboard/${gradeNum}/${outcomeId}`);
                    } else {
                      router.push(`/activity/${gradeNum}/${outcomeId}/${activity.id}`);
                    }
                  }}
                  disabled={!activity.unlocked}
                >
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDesc}>{activity.description}</Text>
                    <Text style={styles.activityMeta}>⏱ {activity.estimatedMinutes} dk</Text>
                  </View>
                  <Text style={styles.chevron}>{activity.unlocked ? '→' : '🔒'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function groupByMode<T extends { mode: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    if (!acc[item.mode]) acc[item.mode] = [];
    acc[item.mode].push(item);
    return acc;
  }, {});
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  heroIcon: { fontSize: 48 },
  heroDesc: { ...typography.body, color: colors.text, textAlign: 'center' },
  contexts: { gap: spacing.sm },
  contextTitle: { ...typography.subheading, color: colors.text },
  contextTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  contextTag: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contextText: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.heading, color: colors.text },
  modeSection: { gap: spacing.sm },
  modeHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  modeIcon: { fontSize: 20 },
  modeTitle: { ...typography.subheading },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locked: { opacity: 0.5 },
  activityIcon: { fontSize: 28 },
  activityInfo: { flex: 1 },
  activityTitle: { ...typography.bodyBold, color: colors.text },
  activityDesc: { ...typography.caption, color: colors.textSecondary },
  activityMeta: { ...typography.caption, color: colors.primary, marginTop: 2 },
  chevron: { fontSize: 20, color: colors.primary, fontWeight: '700' },
});
