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
import { TrustReaction, DecisionRipple, SceneTransition } from '@/components/scene';
import { registerFirstSuccess, registerLabObservation } from '@/ai/analytics';
import { motionTokens, storyTokens } from '@/design-tokens';
import { isPerceptualCount, naturalLayout } from '@/lab';

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
    case 'trust':
      return <TrustScene scene={scene} settings={settings} observer={observer} onAdvance={onAdvance} />;
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

// ─── Keşif: dokunarak toplama (MB-277: 1–4 saydırılmaz · MB-274 keşif çocuğa ait) ──
function DiscoverScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'discover' }>;
  const [found, setFound] = useState<Set<string>>(new Set());
  const allFound = found.size === i.items.length;
  const field = 220;
  const itemSize = 64;
  const points = useMemo(
    () =>
      naturalLayout({
        count: i.items.length,
        seed: scene.order * 41 + i.items.length * 7,
        width: 1,
        height: 1,
      }),
    [i.items.length, scene.order],
  );

  useEffect(() => {
    if (isPerceptualCount(i.items.length)) {
      registerLabObservation(observer, scene.id, 'subitize_attempt', String(i.items.length));
    }
  }, [i.items.length, observer, scene.id]);

  const tap = (id: string) => {
    if (found.has(id)) return;
    observer.record(scene.id, 'touch', id);
    registerLabObservation(observer, scene.id, 'visual_focus', id);
    if (!settings.reduceMotion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFound((prev) => new Set(prev).add(id));
  };

  /** MB-277: 1–4’te sayaç asla açılmaz. */
  const mayRevealCount = Boolean(i.revealCount) && !isPerceptualCount(i.items.length);
  const discoveryOwned = scene.discoveryBelongsToChild !== false;

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
      <View style={[styles.discoverField, { width: field, height: field }]}>
        {i.items.map((item, idx) => {
          const isFound = found.has(item.id);
          const p = points[idx] ?? { x: 0.5, y: 0.5 };
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => tap(item.id)}
              style={[
                styles.discoverItem,
                {
                  position: 'absolute',
                  left: p.x * (field - itemSize),
                  top: p.y * (field - itemSize),
                  width: itemSize,
                  height: itemSize,
                },
                isFound && styles.discoverItemFound,
              ]}
              accessibilityLabel={item.label ?? item.emoji}
            >
              <Text style={styles.discoverEmoji}>{item.emoji}</Text>
              {isFound ? <Text style={styles.discoverCheck}>✓</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
      {mayRevealCount && found.size > 0 ? (
        <Text style={styles.counter}>{found.size}</Text>
      ) : null}
      {allFound ? (
        <SpeechBubble
          speaker={scene.feedback.speaker}
          line={
            discoveryOwned
              ? scene.feedback.positive || 'Sen buldun… güzel baktın.'
              : scene.feedback.positive
          }
          settings={settings}
        />
      ) : null}
      {allFound && discoveryOwned ? (
        <Text style={styles.worldCue}>Yapraklar kıpırdar — keşif senin.</Text>
      ) : null}
    </SceneStage>
  );
}

// ─── Gözlem: doğru cevap yok, inceleme var ───────────────────
function ObserveScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'observe' }>;
  const [looked, setLooked] = useState<Set<string>>(new Set());

  useEffect(() => {
    registerLabObservation(observer, scene.id, 'observe_pattern', 'observe_enter');
  }, [observer, scene.id]);

  const look = (id: string) => {
    observer.record(scene.id, 'touch', id);
    registerLabObservation(observer, scene.id, 'visual_focus', id);
    const group = i.groups.find((g) => g.id === id);
    if (group && !isPerceptualCount(group.count)) {
      registerLabObservation(observer, scene.id, 'grouping_strategy', String(group.count));
    }
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
        {i.groups.map((g, gi) => (
          <GroupDisplay
            key={g.id}
            label={g.label}
            emoji={g.emoji}
            count={g.count}
            highlighted={looked.has(g.id)}
            /** MB-269/281: gözlemde sayı gösterilmez — önce gör. */
            showCount={false}
            onPress={() => look(g.id)}
            settings={settings}
            layoutSeed={scene.order * 10 + gi}
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

// ─── Seçim: Karar 268/269/270 — güvenli ilk karar, dünya geri bildirimi ──
function ChooseScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'choose' }>;
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [worldCue, setWorldCue] = useState<string | null>(null);
  const firstChoiceRecorded = useRef(false);
  const firstMathSafe = Boolean(scene.firstMathDecision);
  const worldFeedback = scene.worldFeedback !== false;

  const choose = (optionId: string) => {
    if (solved) return;
    const aligned = optionId === i.answerId;

    if (!firstChoiceRecorded.current) {
      // Karar 268: ilk karar "incorrect/wrong" etiketi almaz — yalnızca gözlem.
      const detail = firstMathSafe
        ? aligned
          ? 'aligned'
          : 'explored'
        : aligned
          ? 'correct'
          : 'incorrect';
      observer.record(scene.id, 'first_choice', detail);
      // Karar 273: Reflection Time — hız değil, düşünme süresi
      observer.record(scene.id, 'reflection_time', detail);
      firstChoiceRecorded.current = true;
    }
    observer.record(scene.id, 'touch', optionId);

    if (aligned) {
      setSolved(true);
      setWorldCue(scene.atmosphere?.worldCue ?? 'Yapraklar hafifçe kıpırdar…');
      if (!settings.reduceMotion) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return;
    }

    // Karar 268: ilk matematiksel kararda misconception / "yanlış" yolu yok.
    if (firstMathSafe && attempts === 0) {
      observer.record(scene.id, 'observe_pattern', 'first_decision_safe');
      const nextHint = Math.min(0, i.hints.length - 1);
      setHintIndex(nextHint);
      if (nextHint >= 0) observer.record(scene.id, 'hint_shown');
      setWorldCue('Fındık gülümseyerek iki yığına tekrar bakar…');
      if (!settings.reduceMotion) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setAttempts((a) => a + 1);
      return;
    }

    // Sonraki denemeler: sahne değişmez; dünya/karakter yönlendirir (Karar 270).
    observer.record(scene.id, 'retry', optionId);
    observer.record(scene.id, 'misconception', `${i.answerId}_yerine_${optionId}`);
    const nextHint = Math.min(hintIndex + 1, i.hints.length - 1);
    setHintIndex(nextHint);
    if (nextHint >= 0) observer.record(scene.id, 'hint_shown');
    setWorldCue('Yığınlar yerinde durur; Fındık merakla bekler…');
    if (!settings.reduceMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAttempts((a) => a + 1);
  };

  const countVisibility = i.countVisibility ?? 'after_attempt';
  const baseShowCount =
    countVisibility === 'always' ||
    (countVisibility === 'after_attempt' && (attempts > 0 || solved));

  useEffect(() => {
    registerLabObservation(observer, scene.id, 'observe_pattern', 'choose_enter');
    if (i.groups.some((g) => !isPerceptualCount(g.count))) {
      registerLabObservation(observer, scene.id, 'grouping_strategy', 'choose_groups');
    }
    if (i.groups.some((g) => isPerceptualCount(g.count))) {
      registerLabObservation(observer, scene.id, 'subitize_attempt', 'choose_perceptual');
    }
  }, [i.groups, observer, scene.id]);

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        solved ? (
          <Button
            title="Devam"
            onPress={onAdvance}
            fullWidth
            size="lg"
            variant={worldFeedback ? 'primary' : 'success'}
          />
        ) : undefined
      }
    >
      <Text style={[styles.prompt, { fontSize: scaleFont(settings, 18) }]}>{i.prompt}</Text>

      <View style={styles.groupRow}>
        {i.groups.map((g, gi) => (
          <GroupDisplay
            key={g.id}
            label={g.label}
            emoji={g.emoji}
            count={g.count}
            /** MB-277: 1–4 nesnede sayı asla gösterilmez. */
            showCount={baseShowCount && !isPerceptualCount(g.count)}
            settings={settings}
            layoutSeed={scene.order * 13 + gi + attempts}
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
                // Karar 270: UI "doğru" rozeti yok — dünya/karakter konuşur.
                !worldFeedback && solved && isAnswer && styles.optionCorrect,
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

      {worldCue ? <Text style={styles.worldCue}>{worldCue}</Text> : null}

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

// ─── LS-006 Trust — puan/ödül/doğru-yanlış YOK ───────────────
function TrustScene({ scene, settings, observer, onAdvance }: SceneProps) {
  const i = scene.interaction as Extract<SceneSpec['interaction'], { kind: 'trust' }>;
  const [ready, setReady] = useState(false);
  const logged = useRef(false);
  const story = storyTokens['story.trust'];
  const motion = motionTokens['motion.trust'];

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    const prevChoice = [...observer.getObservations()]
      .reverse()
      .find((o) => o.type === 'first_choice');
    registerFirstSuccess(observer, scene.id, prevChoice?.latencyMs ?? null);
    observer.record(scene.id, 'touch', 'trust_presence');
  }, [observer, scene.id]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), settings.reduceMotion ? 0 : motion.durationMs * 0.6);
    return () => clearTimeout(t);
  }, [motion.durationMs, settings.reduceMotion]);

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        ready ? (
          <Button title={i.continueLabel} onPress={onAdvance} fullWidth size="lg" />
        ) : (
          <Text style={styles.hintText}>{story.childFeel}</Text>
        )
      }
    >
      <View style={styles.trustStage}>
        <DecisionRipple active reduceMotion={settings.reduceMotion} />
        <SceneTransition visible reduceMotion={settings.reduceMotion}>
          <TrustReaction line={i.line} reduceMotion={settings.reduceMotion} />
        </SceneTransition>
        <Text style={styles.tokenChip}>
          {scene.learningSceneId ?? 'LS-006'} · {scene.storyToken ?? story.id} ·{' '}
          {scene.motionToken ?? motion.id}
        </Text>
      </View>
    </SceneStage>
  );
}

// ─── Kutlama — Karar 275: dünya kutlar, arayüz değil ─────────
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
  const worldCeleb = scene.worldCelebration !== false;

  return (
    <SceneStage
      scene={scene}
      settings={settings}
      footer={
        <Button title="Maceranı tamamla" onPress={onAdvance} fullWidth size="lg" variant="primary" />
      }
    >
      <View style={styles.celebrateBox}>
        {/* Karar 275: pop-up / yıldız yağmuru yok — karakter + dünya cue */}
        <Text style={styles.celebrateCharacter}>{findik.visual}</Text>
        <Text style={[styles.celebrateTitle, { fontSize: scaleFont(settings, 24) }]}>{i.title}</Text>
        <Text style={[styles.celebrateMessage, { fontSize: scaleFont(settings, 16) }]}>
          {i.message}
        </Text>
        {worldCeleb ? (
          <Text style={styles.worldCue}>
            {scene.atmosphere?.worldCue ?? 'Işık yumuşakça ısınır; Fındık gülümser…'}
          </Text>
        ) : null}
        {!worldCeleb && i.reward ? (
          <Text style={styles.celebrateReward}>{i.reward}</Text>
        ) : null}
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

  discoverField: {
    alignSelf: 'center',
    position: 'relative',
  },
  discoverItem: {
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

  trustStage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 240,
    width: '100%',
  },
  tokenChip: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

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
