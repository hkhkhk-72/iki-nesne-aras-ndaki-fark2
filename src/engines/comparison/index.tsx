import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { EngineProps, ComparisonPayload, ComparisonSymbol, EngineResult } from '@/core/types';
import type { GameEngine } from '@/core/types';
import { colors, radius, spacing, typography } from '@/theme';

const SYMBOLS: { key: ComparisonSymbol; label: string; emoji: string }[] = [
  { key: 'more', label: 'Daha Fazla', emoji: '>' },
  { key: 'less', label: 'Daha Az', emoji: '<' },
  { key: 'equal', label: 'Eşit', emoji: '=' },
];

function ComparisonEngine({ payload, onComplete }: EngineProps<ComparisonPayload>) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<ComparisonSymbol | null>(null);
  const startTime = useRef(Date.now());

  const handleAnswer = (answer: ComparisonSymbol) => {
    if (answered) return;
    setSelected(answer);
    setAnswered(true);

    const isCorrect = answer === payload.correctAnswer;
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // MBA-BENCHMARK-001 Control of Error — alarm yok
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setTimeout(() => {
      const result: EngineResult = {
        correct: isCorrect ? 1 : 0,
        total: 1,
        score: isCorrect ? 100 : 0,
        timeSpentMs: Date.now() - startTime.current,
        mistakes: isCorrect ? [] : [answer],
        completed: true,
      };
      onComplete(result);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{payload.instruction}</Text>

      <View style={styles.compareRow}>
        <CompareSide item={payload.left} />
        <Text style={styles.vs}>?</Text>
        <CompareSide item={payload.right} />
      </View>

      <View style={styles.answersRow}>
        {SYMBOLS.map((sym) => {
          const isSelected = selected === sym.key;
          const isCorrect = sym.key === payload.correctAnswer;
          let btnStyle = styles.answerBtn;
          if (answered && isSelected) {
            btnStyle = isCorrect ? styles.answerCorrect : styles.answerWrong;
          } else if (answered && isCorrect) {
            btnStyle = styles.answerCorrect;
          }

          return (
            <TouchableOpacity
              key={sym.key}
              style={[btnStyle]}
              onPress={() => handleAnswer(sym.key)}
              disabled={answered}
            >
              <Text style={styles.answerEmoji}>{sym.emoji}</Text>
              <Text style={styles.answerLabel}>{sym.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {answered && payload.celebration ? (
        <Text style={styles.celebration}>{payload.celebration}</Text>
      ) : null}
      {payload.hint && !answered ? <Text style={styles.hint}>💡 {payload.hint}</Text> : null}
    </View>
  );
}

function CompareSide({ item }: { item: ComparisonPayload['left'] }) {
  const dots = Array.from({ length: item.count }, (_, i) => i);
  return (
    <View style={styles.side}>
      {item.emoji ? <Text style={styles.sideEmoji}>{item.emoji}</Text> : null}
      {item.label ? <Text style={styles.sideLabel}>{item.label}</Text> : null}
      <View style={styles.dotsGrid}>
        {dots.map((i) => (
          <View key={i} style={styles.dot} />
        ))}
      </View>
      <Text style={styles.count}>{item.count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.xl, justifyContent: 'center' },
  instruction: { ...typography.heading, color: colors.text, textAlign: 'center' },
  compareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  vs: { fontSize: 48, fontWeight: '800', color: colors.secondary },
  side: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 200,
  },
  sideEmoji: { fontSize: 40 },
  sideLabel: { ...typography.caption, color: colors.textSecondary },
  dotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 120 },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary },
  count: { ...typography.title, color: colors.primary },
  answersRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  answerBtn: {
    flex: 1,
    maxWidth: 120,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 80,
    justifyContent: 'center',
  },
  answerCorrect: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 80,
    justifyContent: 'center',
    flex: 1,
    maxWidth: 120,
  },
  answerWrong: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 80,
    justifyContent: 'center',
    flex: 1,
    maxWidth: 120,
  },
  answerEmoji: { fontSize: 28, fontWeight: '800', color: colors.text },
  answerLabel: { ...typography.caption, color: colors.text, fontWeight: '600', marginTop: 4 },
  celebration: { ...typography.subheading, color: colors.success, textAlign: 'center' },
  hint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});

export const comparisonEngine: GameEngine<ComparisonPayload> = {
  id: 'comparison',
  name: 'Karşılaştırma Motoru',
  description: 'Daha fazla, daha az ve eşit kavramlarını öğren',
  Component: ComparisonEngine,
};
