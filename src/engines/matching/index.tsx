import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { EngineProps, MatchingPayload, EngineResult } from '@/core/types';
import type { GameEngine } from '@/core/types';
import { colors, radius, spacing, typography } from '@/theme';

function MatchingEngine({ payload, onComplete, onProgress }: EngineProps<MatchingPayload>) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const startTime = useRef(Date.now());
  const mistakes = useRef<string[]>([]);

  const leftItems = payload.pairs.map((p) => ({ id: p.id, ...p.left }));
  const rightItems = shuffle(
    payload.pairs.map((p) => ({ id: p.id, ...p.right })),
  );

  const handleLeftPress = useCallback((id: string) => {
    if (matched.has(id)) return;
    setSelectedLeft(id);
    setWrongPair(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [matched]);

  const handleRightPress = useCallback(
    (rightId: string) => {
      if (!selectedLeft || matched.has(rightId)) return;

      if (selectedLeft === rightId) {
        const newMatched = new Set(matched);
        newMatched.add(rightId);
        setMatched(newMatched);
        setSelectedLeft(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const progress = newMatched.size / payload.pairs.length;
        onProgress?.(progress);

        if (newMatched.size === payload.pairs.length) {
          const result: EngineResult = {
            correct: payload.pairs.length,
            total: payload.pairs.length,
            score: Math.round(100 - mistakes.current.length * 10),
            timeSpentMs: Date.now() - startTime.current,
            mistakes: mistakes.current,
            completed: true,
          };
          onComplete(result);
        }
      } else {
        mistakes.current.push(`${selectedLeft}-${rightId}`);
        setWrongPair(rightId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => {
          setSelectedLeft(null);
          setWrongPair(null);
        }, 600);
      }
    },
    [selectedLeft, matched, payload.pairs.length, onComplete, onProgress],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.instruction}>{payload.instruction}</Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map((item) => (
            <TouchableOpacity
              key={`left-${item.id}`}
              style={[
                styles.item,
                selectedLeft === item.id && styles.itemSelected,
                matched.has(item.id) && styles.itemMatched,
              ]}
              onPress={() => handleLeftPress(item.id)}
              disabled={matched.has(item.id)}
            >
              <ItemContent text={item.text} emoji={item.emoji} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          {rightItems.map((item) => (
            <TouchableOpacity
              key={`right-${item.id}`}
              style={[
                styles.item,
                wrongPair === item.id && styles.itemWrong,
                matched.has(item.id) && styles.itemMatched,
              ]}
              onPress={() => handleRightPress(item.id)}
              disabled={matched.has(item.id)}
            >
              <ItemContent text={item.text} emoji={item.emoji} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {payload.hint ? <Text style={styles.hint}>💡 {payload.hint}</Text> : null}
    </ScrollView>
  );
}

function ItemContent({ text, emoji }: { text?: string; emoji?: string }) {
  return (
    <View style={styles.itemContent}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      {text ? <Text style={styles.itemText}>{text}</Text> : null}
    </View>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.lg },
  instruction: { ...typography.heading, color: colors.text, textAlign: 'center' },
  columns: { flexDirection: 'row', gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  itemSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  itemMatched: { borderColor: colors.success, backgroundColor: colors.successLight, opacity: 0.7 },
  itemWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  itemContent: { alignItems: 'center', gap: 4 },
  emoji: { fontSize: 32 },
  itemText: { ...typography.bodyBold, color: colors.text, textAlign: 'center' },
  hint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});

export const matchingEngine: GameEngine<MatchingPayload> = {
  id: 'matching',
  name: 'Eşleştirme Motoru',
  description: 'Kavramları eşleştirerek öğrenme',
  Component: MatchingEngine,
};
