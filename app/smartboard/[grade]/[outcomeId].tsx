import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Button } from '@/components/ui';
import { getOutcome } from '@/core/content-loader';
import { saveActivityProgress } from '@/core/progress-store';
import { DEFAULT_SUBJECT } from '@/core/subject-registry';
import { lightTap, successTap } from '@/core/haptics';
import { colors, spacing, typography, radius } from '@/theme';
import type { ComparisonPayload, ComparisonSymbol } from '@/core/types';

type Player = 'left' | 'right' | null;

const SYMBOLS: { key: ComparisonSymbol; label: string }[] = [
  { key: 'more', label: 'Sol Daha Fazla' },
  { key: 'less', label: 'Sağ Daha Fazla' },
  { key: 'equal', label: 'Eşit' },
];

/** Tur varyasyonu — aynı payload'u hafifçe kaydırır. */
function roundPayload(base: ComparisonPayload, round: number): ComparisonPayload {
  const shift = (round - 1) % 3;
  if (shift === 0) return base;
  if (shift === 1) {
    return {
      ...base,
      left: { ...base.right },
      right: { ...base.left },
      correctAnswer:
        base.correctAnswer === 'more'
          ? 'less'
          : base.correctAnswer === 'less'
            ? 'more'
            : 'equal',
    };
  }
  const bump = (base.left.count % 2) + 1;
  return {
    ...base,
    left: { ...base.left, count: Math.max(1, base.left.count + bump) },
    right: { ...base.right, count: Math.max(1, base.right.count + bump) },
    correctAnswer:
      base.left.count + bump === base.right.count + bump
        ? 'equal'
        : base.left.count + bump > base.right.count + bump
          ? 'more'
          : 'less',
  };
}

export default function SmartboardScreen() {
  const { grade, outcomeId } = useLocalSearchParams<{ grade: string; outcomeId: string }>();
  const router = useRouter();
  const outcome = getOutcome(Number(grade), outcomeId);
  const smartboardActivity = outcome?.activities.find((a) => a.mode === 'smartboard');
  const fallbackComparison = outcome?.activities.find((a) => a.engineId === 'comparison');
  const basePayload = (smartboardActivity?.payload ?? fallbackComparison?.payload) as
    | ComparisonPayload
    | undefined;

  const [scores, setScores] = useState({ left: 0, right: 0 });
  const [round, setRound] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [winner, setWinner] = useState<Player>(null);
  const [saved, setSaved] = useState(false);
  const totalRounds = 5;
  const saving = useRef(false);

  const payload = useMemo(
    () => (basePayload ? roundPayload(basePayload, round) : undefined),
    [basePayload, round],
  );

  const persistComplete = useCallback(async () => {
    if (!smartboardActivity || saving.current) return;
    saving.current = true;
    await saveActivityProgress({
      subject: DEFAULT_SUBJECT,
      outcomeId,
      activityId: smartboardActivity.id,
      completed: true,
      score: 100,
      attempts: 1,
      lastPlayedAt: new Date().toISOString(),
    });
    setSaved(true);
    void successTap(true);
  }, [outcomeId, smartboardActivity]);

  useEffect(() => {
    if (round >= totalRounds && answered && !saved) {
      void persistComplete();
    }
  }, [answered, persistComplete, round, saved]);

  const handleAnswer = (player: 'left' | 'right', answer: ComparisonSymbol) => {
    if (answered || !payload) return;
    setAnswered(true);

    const isCorrect = answer === payload.correctAnswer;
    const playerWins =
      (answer === 'more' && player === 'left') ||
      (answer === 'less' && player === 'right') ||
      (answer === 'equal' && isCorrect);

    if (isCorrect && playerWins) {
      setScores((s) => ({ ...s, [player]: s[player] + 1 }));
      setWinner(player);
      void successTap(true);
    } else {
      setWinner(null);
      void lightTap(true);
    }

    setTimeout(() => {
      if (round >= totalRounds) return;
      setRound((r) => r + 1);
      setAnswered(false);
      setWinner(null);
    }, 1200);
  };

  if (!payload) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Akıllı Tahta" onBack={() => router.back()} />
        <Text style={styles.error}>Akıllı tahta etkinliği bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const gameOver = round >= totalRounds && answered;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScreenHeader
          title="📺 Akıllı Tahta Düellosu"
          subtitle={`Tur ${Math.min(round, totalRounds)}/${totalRounds}`}
          onBack={() => router.back()}
        />

        <View style={styles.scoreboard}>
          <View style={[styles.playerScore, styles.playerLeft]}>
            <Text style={styles.playerLabel}>Öğrenci 1</Text>
            <Text style={styles.scoreNum}>{scores.left}</Text>
          </View>
          <Text style={styles.vs}>VS</Text>
          <View style={[styles.playerScore, styles.playerRight]}>
            <Text style={styles.playerLabel}>Öğrenci 2</Text>
            <Text style={styles.scoreNum}>{scores.right}</Text>
          </View>
        </View>

        <Text style={styles.question}>{payload.instruction}</Text>

        <View style={styles.duelArea}>
          <PlayerSide
            side="left"
            count={payload.left.count}
            emoji={payload.left.emoji}
            label="Öğrenci 1"
            onAnswer={(ans) => handleAnswer('left', ans)}
            disabled={answered || gameOver}
            isWinner={winner === 'left'}
          />
          <PlayerSide
            side="right"
            count={payload.right.count}
            emoji={payload.right.emoji}
            label="Öğrenci 2"
            onAnswer={(ans) => handleAnswer('right', ans)}
            disabled={answered || gameOver}
            isWinner={winner === 'right'}
          />
        </View>

        {gameOver ? (
          <View style={styles.gameOver}>
            <Text style={styles.gameOverTitle}>🏆 Oyun Bitti!</Text>
            <Text style={styles.gameOverScore}>
              {scores.left > scores.right
                ? 'Öğrenci 1 Kazandı!'
                : scores.right > scores.left
                  ? 'Öğrenci 2 Kazandı!'
                  : 'Berabere!'}
            </Text>
            <Text style={styles.finalScore}>
              {scores.left} - {scores.right}
            </Text>
            {saved ? <Text style={styles.savedNote}>İlerleme kaydedildi ✓</Text> : null}
            <Button title="Kazanıma Dön" onPress={() => router.back()} fullWidth />
          </View>
        ) : null}

        <Text style={styles.rules}>
          İlk doğru cevap veren puan kazanır. 5 tur bitince ilerleme kaydolur.
        </Text>
      </SafeAreaView>
    </View>
  );
}

function PlayerSide({
  side,
  count,
  emoji,
  label,
  onAnswer,
  disabled,
  isWinner,
}: {
  side: 'left' | 'right';
  count: number;
  emoji?: string;
  label: string;
  onAnswer: (answer: ComparisonSymbol) => void;
  disabled: boolean;
  isWinner: boolean;
}) {
  const dots = Array.from({ length: Math.min(count, 12) }, (_, i) => i);
  const color = side === 'left' ? '#00D4FF' : '#FF6B6B';

  return (
    <View style={[styles.playerSide, isWinner && { borderColor: colors.star, borderWidth: 3 }]}>
      <Text style={[styles.sideLabel, { color }]}>{label}</Text>
      {emoji ? <Text style={styles.sideEmoji}>{emoji}</Text> : null}
      <View style={styles.dotsGrid}>
        {dots.map((i) => (
          <View key={i} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
      <View style={styles.answerButtons}>
        {SYMBOLS.map((sym) => (
          <TouchableOpacity
            key={sym.key}
            style={[styles.answerBtn, { borderColor: color }]}
            onPress={() => onAnswer(sym.key)}
            disabled={disabled}
          >
            <Text style={styles.answerBtnText}>{sym.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.smartboard },
  safe: { flex: 1 },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    padding: spacing.lg,
  },
  playerScore: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    minWidth: 120,
  },
  playerLeft: { backgroundColor: 'rgba(0,212,255,0.15)' },
  playerRight: { backgroundColor: 'rgba(255,107,107,0.15)' },
  playerLabel: { ...typography.caption, color: '#AAA' },
  scoreNum: { fontSize: 48, fontWeight: '800', color: colors.textLight },
  vs: { fontSize: 24, fontWeight: '800', color: colors.smartboardAccent },
  question: {
    ...typography.title,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  duelArea: { flexDirection: 'row', flex: 1, gap: spacing.md, padding: spacing.md },
  playerSide: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  sideLabel: { ...typography.subheading },
  sideEmoji: { fontSize: 48 },
  dotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 200 },
  dot: { width: 24, height: 24, borderRadius: 12 },
  answerButtons: { gap: spacing.sm, width: '100%' },
  answerBtn: {
    borderWidth: 2,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  answerBtnText: { ...typography.bodyBold, color: colors.textLight },
  gameOver: { alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  gameOverTitle: { fontSize: 36, color: colors.star },
  gameOverScore: { ...typography.heading, color: colors.textLight },
  finalScore: { fontSize: 48, fontWeight: '800', color: colors.smartboardAccent },
  savedNote: { ...typography.bodyBold, color: colors.success },
  rules: { ...typography.caption, color: '#666', textAlign: 'center', padding: spacing.md },
  error: { ...typography.body, color: colors.error, textAlign: 'center' },
});
