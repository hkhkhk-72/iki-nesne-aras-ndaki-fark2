# LS-011 Preparation — Update Package (GRP-001)

| Alan | Değer |
|------|--------|
| Version | GRP-001 |
| Sprint | LS-011 Preparation |
| Status | Infrastructure Update |
| Gameplay | **No** — mechanics not added |

## 1. Story Token — `story.thinking.deep`

Activated after prolonged observation.

- World becomes calmer
- Wind slows
- Leaves almost stop
- Findik waits
- Bilge stays silent
- No hints

→ `src/design-tokens/story.ts`

## 2. Motion Token — `motion.look_back_child`

| | |
|--|--|
| Duration | 6 seconds |
| Loop | seamless |

**Sequence:** Look child → Look basket → Look child → Smile → Look basket → Loop

→ `LOOK_BACK_CHILD_SEQUENCE` · `LookBackChild`

## 3. Animation — `anim.deep_breath`

| | |
|--|--|
| Trigger | 5 seconds without interaction |
| Behavior | Slow inhale · slow exhale · tiny shoulder · very small chest |

→ AN008 · `DEEP_BREATH_SPEC` · `FindikDeepBreath`

## 4. FX — `FX_soft_bounce`

| | |
|--|--|
| Trigger | Touch object |
| Scale | 1.00 → 1.04 → 1.00 |
| Duration | 200 ms |
| Ease | easeOutQuad |

→ FX011 · `SoftBounce`

## 5. Analytics — `ai.observe_compare_v2`

Anonymous capture:

- `firstViewedGroup`
- `firstTouchedGroup`
- `decisionTime`
- `wrongTouchCount` (telemetry name; child-facing “wrong” label forbidden — MB-269)
- `idleTime`
- `comparisonStrategy`

→ `registerObserveCompareV2`

## 6. Accessibility — Silent Mode

All emotional meaning remains understandable without audio.  
Animations become the primary communication channel.

→ `SILENT_MODE_POLICY.animationIsPrimaryChannel`

## 7. QA Checklist

- [ ] World is calm
- [ ] Child never feels rushed
- [ ] Story Token transitions are smooth
- [ ] Character eye contact feels natural
- [ ] Motion loops are seamless
- [ ] AI remains invisible
- [ ] Accessibility preserved

Kapı: `src/qa/ls011-prep-qa.ts`

## 8. Performance

| Contract | Value |
|----------|--------|
| Max FPS | 60 |
| Dropped frames | none (contract) |
| Idle animations | GPU-friendly (transform/opacity) |
| Memory | cancel on unmount |

→ `src/design-tokens/performance.ts` · `LS011_PERF`

## Components (infra only)

```
SoftBounce.tsx · FindikDeepBreath.tsx · LookBackChild.tsx
```

Not wired into MB-MAT scenes yet.

## Ready for LS-011

Infrastructure complete. Gameplay binding comes next.
