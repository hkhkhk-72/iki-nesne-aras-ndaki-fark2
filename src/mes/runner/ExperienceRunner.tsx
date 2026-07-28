import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { MicroExperience, SceneSpec } from '@/mes/types';
import { varyScenes, createSessionSeed } from '@/mes/replay';
import { ExperienceObserver, type SceneBehavior } from '@/ai/observer';
import { buildInsights, type ExperienceInsights } from '@/ai/insights';
import { getCharacter } from '@/world/characters';
import { Button } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';
import type { AppSettings } from '@/core/settings-store';
import { scaleFont } from '@/core/settings-store';
import { SceneStage, GroupDisplay, SpeechBubble } from './SceneStage';

interface RunnerProps {
  experience: MicroExperience;
  settings: AppSettings;
  onFinish: (result: {
    behaviors: SceneBehavior[];
    insights: ExperienceInsights;
    durationMs: number;
  }) => void;
}

/**
 * Mikro deneyim çalıştırıcısı.
 *
 * Sahneleri sırayla oynatır, davranış sinyallerini AI gözlemcisine iletir.
 * Puan tutmaz; yalnızca ilerleme ve davranış kaydeder.
 */
export function ExperienceRunner({ experience, settings, onFinish }: RunnerProps) {
  const seed = useMemo(() => createSessionSeed(), []);
  const scenes = useMemo(() => varyScenes(experience.scenes, seed), [experience.scenes, seed]);
  const observer = useRef(new ExperienceObserver()).current;

  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = scenes[sceneIndex];

  useEffect(() => {
    if (scene) observer.enterScene(scene.id, scene.aiObservation.concept);
  }, [scene, observer]);

  const advance = useCallback(() => {
    observer.exitScene(scene.id);
    if (sceneIndex >= scenes.length - 1) {
      const behaviors = observer.summarize();
      onFinish({
        behaviors,
        insights: buildInsights(experience.code, behaviors),
        durationMs: observer.getTotalDurationMs(),
      });
      return;
    }
    setSceneIndex((i) => i + 1);
  }, [observer, scene, sceneIndex, scenes.length, onFinish, experience.code]);

  if (!scene) return null;

  return (
    <View style={styles.container}>
      <SceneProgress current={sceneIndex + 1} total={scenes.length} scene={scene} />
      <SceneView
        key={scene.id}
        scene={scene}
        settings={settings}
        observer={observer}
        onAdvance={advance}
      />
    </View>
  );
}

function SceneProgress({
  current,
  total,
  scene,
}: {
  current: number;
  total: number;
  scene: SceneSpec;
}) {
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressHeader}>
        <Text style={styles.sceneTitle}>{scene.title}</Text>
        <Text style={styles.progressText}>
          {current} / {total}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
      </View>
    </View>
  );
}

// ─── Sahne yönlendirici ──────────────────────────────────────
function SceneView({
  scene,
  settings,
  observer,
  onAdvance,
}: {
  scene: SceneSpec;
  settings: AppSettings;
  observer: ExperienceObserver;
  onAdvance: () => void;
}) {
  const i = scene.interaction;
  switch (i.kind) {
    case 'narrative':
      return <NarrativeScene scene={scene} settings={settings} observer={observer} onAdvance={onAdvance} />;
    case 'discover':
      return <DiscoverScene scene={scene} settings={settings} observer={observer} onAdvance={onAdvance} />;
    case 'observe':
      return <ObserveScene scene={scene} settings={settings} observer={observer} onAdvance={onAdvance} />;
    case 'pair':
      return <PairScene scene={scene} settings={settings} observer={observer} onAdvance={onAdvance} />;
    case 'choose':
      return <ChooseScene scene={scene} settings={settings} observer={observer} onAdvance={onAdvance} />;
    case 'celebrate':
      return <CelebrateScene scene={scene} settings={settings} onAdvance={onAdvance} />;
  }
}

type SceneProps = {
  scene: SceneSpec;
  settings: AppSettings;
  observer: ExperienceObserver;
  onAdvance: () => void;
};

// ─── Sahne 1 tipi: hikâye / tanışma / İlk Bakış ──────────────
function NarrativeScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'narrative' }>;
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<'story' | 'bond'>('story');
  const enteredAt = useRef(Date.now());
  const dwellRecorded = useRef(false);

  const isSingle = Boolean(i.singleCta);
  const isLast = isSingle || lineIndex >= i.lines.length - 1;
  const visibleLines = isSingle ? i.lines : i.lines.slice(0, lineIndex + 1);

  useEffect(() => {
    // Ekranı inceleme / ses dinleme sinyali — görünmez telemetri
    const dwellTimer = setTimeout(() => {
      if (!dwellRecorded.current) {
        dwellRecorded.current = true;
        observer.record(scene.id, 'idle', 'screen_dwell');
      }
    }, 2500);
    return () => clearTimeout(dwellTimer);
  }, [observer, scene.id]);

  const acceptHelp = () => {
    const latency = Date.now() - enteredAt.current;
    observer.record(scene.id, 'touch', `help_${latency}`);
    if (!settings.reduceMotion) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (i.bondMoment && scene.feedback.positive) {
      setPhase('bond');
      return;
    }
    onAdvance();
  };

  const next = () => {
    observer.record(scene.id, 'touch');
    if (isLast) {
      acceptHelp();
      return;
    }
    setLineIndex((n) => n + 1);
  };

  if (phase === 'bond') {
    return (
      <SceneStage
        scene={scene}
        settings={settings}
        footer={<Button title="Devam" onPress={onAdvance} fullWidth size="lg" variant="success" />}
      >
        <View style={styles.bondBox}>
          <Text style={styles.bondStars}>✨🍂✨</Text>
          <Text style={styles.bondBasket}>🐿️🧺↑</Text>
          <Text style={styles.bondCaption}>Fındık sepetini yukarı kaldırıyor...</Text>
        </View>
        <SpeechBubble
          speaker={scene.feedback.speaker}
          line={scene.feedback.positive}
          settings={settings}
        />
      </SceneStage>
    );
  }

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        <Button
          title={isLast ? i.continueLabel : 'Devam'}
          onPress={isSingle ? acceptHelp : next}
          fullWidth
          size="lg"
        />
      }
    >
      {scene.atmosphere?.worldCue ? (
        <Text style={styles.worldCue}>{scene.atmosphere.worldCue}</Text>
      ) : null}
      {visibleLines.map((line, idx) => (
        <SpeechBubble key={idx} speaker={i.speaker} line={line} settings={settings} />
      ))}
    </SceneStage>
  );
}

// ─── Keşif: nesnelere dokunarak sayma ────────────────────────
function DiscoverScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'discover' }>;
  const [found, setFound] = useState<Set<string>>(new Set());
  const allFound = found.size === i.items.length;

  const tap = (id: string) => {
    if (found.has(id)) return;
    observer.record(scene.id, 'touch', id);
    if (!settings.reduceMotion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFound((prev) => new Set(prev).add(id));
  };

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        allFound ? (
          <Button title="Devam" onPress={onAdvance} fullWidth size="lg" variant="success" />
        ) : (
          <Text style={styles.hintText}>{i.prompt}</Text>
        )
      }
    >
      <Text style={[styles.prompt, { fontSize: scaleFont(settings, 18) }]}>{i.prompt}</Text>
      <View style={styles.discoverGrid}>
        {i.items.map((item) => {
          const isFound = found.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => tap(item.id)}
              style={[styles.discoverItem, isFound && styles.discoverItemFound]}
              accessibilityLabel={item.label ?? item.emoji}
            >
              <Text style={styles.discoverEmoji}>{item.emoji}</Text>
              {isFound ? <Text style={styles.discoverCheck}>✓</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
      {i.revealCount && found.size > 0 ? (
        <Text style={styles.counter}>{found.size}</Text>
      ) : null}
      {allFound ? (
        <SpeechBubble
          speaker={scene.feedback.speaker}
          line={scene.feedback.positive}
          settings={settings}
        />
      ) : null}
    </SceneStage>
  );
}

// ─── Gözlem: doğru cevap yok, inceleme var ───────────────────
function ObserveScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'observe' }>;
  const [looked, setLooked] = useState<Set<string>>(new Set());

  const look = (id: string) => {
    observer.record(scene.id, 'touch', id);
    setLooked((prev) => new Set(prev).add(id));
  };

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={<Button title={i.continueLabel} onPress={onAdvance} fullWidth size="lg" />}
    >
      <Text style={[styles.prompt, { fontSize: scaleFont(settings, 18) }]}>{i.prompt}</Text>
      <View style={styles.groupRow}>
        {i.groups.map((g) => (
          <GroupDisplay
            key={g.id}
            label={g.label}
            emoji={g.emoji}
            count={g.count}
            highlighted={looked.has(g.id)}
            showCount={looked.has(g.id)}
            onPress={() => look(g.id)}
            settings={settings}
          />
        ))}
      </View>
      <Text style={styles.hintText}>Gruplara dokunarak inceleyebilirsin.</Text>
    </SceneStage>
  );
}

// ─── Birebir eşleştirme: artan taraf kavramı sezdirir ────────
function PairScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'pair' }>;
  const [left, right] = i.groups;
  const maxPairs = Math.min(left.count, right.count);
  const [pairs, setPairs] = useState(0);
  const done = pairs >= maxPairs;
  const leftover = Math.abs(left.count - right.count);

  const makePair = () => {
    if (done) return;
    observer.record(scene.id, 'touch', `pair-${pairs + 1}`);
    if (!settings.reduceMotion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPairs((p) => p + 1);
  };

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        done ? (
          <Button title="Devam" onPress={onAdvance} fullWidth size="lg" variant="success" />
        ) : (
          <Button title="Bir çift eşleştir" onPress={makePair} fullWidth size="lg" />
        )
      }
    >
      <Text style={[styles.prompt, { fontSize: scaleFont(settings, 18) }]}>{i.prompt}</Text>
      <View style={styles.pairList}>
        {Array.from({ length: Math.max(left.count, right.count) }, (_, idx) => {
          const hasLeft = idx < left.count;
          const hasRight = idx < right.count;
          const paired = idx < pairs;
          return (
            <View key={idx} style={[styles.pairRow, paired && styles.pairRowDone]}>
              <Text style={styles.pairItem}>{hasLeft ? left.emoji : ''}</Text>
              <Text style={styles.pairLink}>{paired ? '—' : hasLeft && hasRight ? '·' : ''}</Text>
              <Text style={styles.pairItem}>{hasRight ? right.emoji : ''}</Text>
            </View>
          );
        })}
      </View>
      {done ? (
        <SpeechBubble
          speaker={scene.feedback.speaker}
          line={leftover > 0 ? i.leftoverLine : scene.feedback.positive}
          settings={settings}
        />
      ) : null}
    </SceneStage>
  );
}

// ─── Seçim: yanlışta sahne değişmez, ipucu güçlenir ──────────
function ChooseScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'choose' }>;
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const firstChoiceRecorded = useRef(false);

  const choose = (optionId: string) => {
    if (solved) return;
    const correct = optionId === i.answerId;

    if (!firstChoiceRecorded.current) {
      observer.record(scene.id, 'first_choice', correct ? 'correct' : 'incorrect');
      firstChoiceRecorded.current = true;
    }
    observer.record(scene.id, 'touch', optionId);

    if (correct) {
      setSolved(true);
      if (!settings.reduceMotion) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      return;
    }

    // Yanlış cevap: sahne değişmez, yalnızca rehberlik güçlenir.
    observer.record(scene.id, 'retry', optionId);
    observer.record(scene.id, 'misconception', `${i.answerId}_yerine_${optionId}`);
    const nextHint = Math.min(hintIndex + 1, i.hints.length - 1);
    setHintIndex(nextHint);
    if (nextHint >= 0) observer.record(scene.id, 'hint_shown');
    setAttempts((a) => a + 1);
  };

  const countVisibility = i.countVisibility ?? 'after_attempt';
  const showCount =
    countVisibility === 'always' ||
    (countVisibility === 'after_attempt' && (attempts > 0 || solved));

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        solved ? (
          <Button title="Devam" onPress={onAdvance} fullWidth size="lg" variant="success" />
        ) : undefined
      }
    >
      <Text style={[styles.prompt, { fontSize: scaleFont(settings, 18) }]}>{i.prompt}</Text>

      <View style={styles.groupRow}>
        {i.groups.map((g) => (
          <GroupDisplay
            key={g.id}
            label={g.label}
            emoji={g.emoji}
            count={g.count}
            showCount={showCount}
            settings={settings}
          />
        ))}
      </View>

      <View style={styles.optionRow}>
        {i.options.map((opt) => {
          const isAnswer = opt.id === i.answerId;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => choose(opt.id)}
              disabled={solved}
              style={[
                styles.option,
                solved && isAnswer && styles.optionCorrect,
              ]}
              accessibilityLabel={opt.label}
            >
              <Text style={styles.optionVisual}>{opt.visual}</Text>
              <Text style={[styles.optionLabel, { fontSize: scaleFont(settings, 14) }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {solved ? (
        <SpeechBubble
          speaker={scene.feedback.speaker}
          line={scene.feedback.positive}
          settings={settings}
        />
      ) : hintIndex >= 0 ? (
        <SpeechBubble
          speaker={scene.feedback.speaker}
          line={i.hints[hintIndex]}
          settings={settings}
        />
      ) : null}
    </SceneStage>
  );
}

// ─── Kutlama ─────────────────────────────────────────────────
function CelebrateScene({
  scene,
  settings,
  onAdvance,
}: {
  scene: SceneSpec;
  settings: AppSettings;
  onAdvance: () => void;
}) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'celebrate' }>;
  const findik = getCharacter('findik');

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={<Button title="Maceranı tamamla" onPress={onAdvance} fullWidth size="lg" variant="success" />}
    >
      <View style={styles.celebrateBox}>
        <Text style={styles.celebrateReward}>{i.reward}</Text>
        <Text style={[styles.celebrateTitle, { fontSize: scaleFont(settings, 24) }]}>{i.title}</Text>
        <Text style={[styles.celebrateMessage, { fontSize: scaleFont(settings, 16) }]}>
          {i.message}
        </Text>
        <Text style={styles.celebrateCharacter}>{findik.visual}</Text>
      </View>
    </SceneStage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.xs },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sceneTitle: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  progressText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  prompt: { color: colors.text, fontWeight: '700', textAlign: 'center' },
  hintText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  counter: { ...typography.hero, color: colors.primary, textAlign: 'center' },

  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  discoverItem: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoverItemFound: { borderColor: colors.success, backgroundColor: colors.successLight },
  discoverEmoji: { fontSize: 34 },
  discoverCheck: { position: 'absolute', top: 2, right: 6, color: colors.success, fontWeight: '800' },

  groupRow: { flexDirection: 'row', gap: spacing.md },

  pairList: { gap: spacing.xs },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  pairRowDone: { backgroundColor: colors.successLight },
  pairItem: { fontSize: 30, width: 48, textAlign: 'center' },
  pairLink: { fontSize: 22, color: colors.textSecondary, width: 24, textAlign: 'center' },

  optionRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  option: {
    flex: 1,
    minHeight: 92,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: 4,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  optionVisual: { fontSize: 30 },
  optionLabel: { color: colors.text, fontWeight: '700', textAlign: 'center' },

  celebrateBox: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  celebrateReward: { fontSize: 72 },
  celebrateTitle: { color: colors.text, fontWeight: '800', textAlign: 'center' },
  celebrateMessage: { color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  celebrateCharacter: { fontSize: 44, marginTop: spacing.sm },

  bondBox: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  bondStars: { fontSize: 28 },
  bondBasket: { fontSize: 48 },
  bondCaption: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  worldCue: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
});
