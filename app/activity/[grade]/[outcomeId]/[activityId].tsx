import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Button } from '@/components/ui';
import { getActivity } from '@/core/content-loader';
import { getEngine } from '@/core/engine-registry';
import { saveActivityProgress } from '@/core/progress-store';
import { colors, spacing, typography, radius } from '@/theme';
import type { EngineResult } from '@/core/types';

export default function ActivityScreen() {
  const { grade, outcomeId, activityId } = useLocalSearchParams<{
    grade: string;
    outcomeId: string;
    activityId: string;
  }>();
  const router = useRouter();
  const gradeNum = Number(grade);
  const activity = getActivity(gradeNum, outcomeId, activityId);
  const [result, setResult] = useState<EngineResult | null>(null);

  const handleComplete = useCallback(
    async (engineResult: EngineResult) => {
      setResult(engineResult);
      await saveActivityProgress({
        outcomeId,
        activityId,
        completed: engineResult.completed,
        score: engineResult.score,
        attempts: 1,
        lastPlayedAt: new Date().toISOString(),
      });
    },
    [outcomeId, activityId],
  );

  if (!activity) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Etkinlik Bulunamadı" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const engine = getEngine(activity.engineId);
  if (!engine) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Motor Bulunamadı" onBack={() => router.back()} />
        <Text style={styles.error}>Oyun motoru yüklenemedi: {activity.engineId}</Text>
      </SafeAreaView>
    );
  }

  const EngineComponent = engine.Component;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={activity.title}
        subtitle={activity.description}
        onBack={() => router.back()}
      />
      <View style={styles.engineContainer}>
        <EngineComponent
          payload={activity.payload}
          mode={activity.mode}
          onComplete={handleComplete}
        />
      </View>

      <Modal visible={result !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.resultEmoji}>
              {result && result.score >= 70 ? '🎉' : '💪'}
            </Text>
            <Text style={styles.resultTitle}>
              {result && result.score >= 70 ? 'Harika İş!' : 'Tekrar Dene!'}
            </Text>
            <Text style={styles.resultScore}>Puan: {result?.score}</Text>
            <Text style={styles.resultDetail}>
              {result?.correct}/{result?.total} doğru
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Devam Et"
                variant="success"
                onPress={() => router.back()}
                fullWidth
              />
              <Button
                title="Tekrar Oyna"
                variant="outline"
                onPress={() => setResult(null)}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  engineContainer: { flex: 1 },
  error: { ...typography.body, color: colors.error, textAlign: 'center', margin: spacing.lg },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
    maxWidth: 360,
  },
  resultEmoji: { fontSize: 64 },
  resultTitle: { ...typography.title, color: colors.text },
  resultScore: { ...typography.heading, color: colors.primary },
  resultDetail: { ...typography.body, color: colors.textSecondary },
  modalActions: { width: '100%', gap: spacing.sm, marginTop: spacing.md },
});
