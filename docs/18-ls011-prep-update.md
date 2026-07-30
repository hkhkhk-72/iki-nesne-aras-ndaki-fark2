# LS-011 Preparation — Engine Update (GRP-001)

| Alan | Değer |
|------|--------|
| Version | GRP-001 |
| Sprint | LS-011 Preparation |
| Status | Infrastructure Update |
| Gameplay | **No** — no mechanics / UI redesign / scene flow |

## Purpose

Engine capabilities only. System ready for LS-011.

## Registered tokens

| Token | Exposed via |
|-------|-------------|
| `story.thinking.deep` | MBA-TOKEN-001 |
| `motion.look_back_child` | MBA-TOKEN-001 · MBA-MOTION-001 |
| `anim.deep_breath` | MBA-TOKEN-001 · MBA-CHAR-DNA-001 |
| `FX_soft_bounce` | MBA-TOKEN-001 · MBA-MOTION-001 |
| `ai.observe_compare_v2` | MBA-TOKEN-001 · MBA-QA-001 |

Kod: `src/mba/`

## 1. Story — `story.thinking.deep`

Long observation without interaction → world slows · wind softer · leaves almost stop · **FN-001** waits calmly · **BO-001** completely silent · no hints · no pressure → **psychological safety**.

## 2. Motion — `motion.look_back_child` (6000 ms)

Look child → Look basket → Look child → Small smile → Look basket → Repeat  
Purpose: maintain emotional connection. Seamless loop (no visible jump).

## 3. Animation — `anim.deep_breath`

Trigger: 5s idle. Slow inhale → tiny shoulder → tiny chest → slow exhale → return to idle.  
Amplitude **extremely small**; never exaggerated.

## 4. FX — `FX_soft_bounce`

Touch collectible · 1.00→1.04→1.00 · 200ms · easeOutQuad · tactile feedback.

## 5. AI — `ai.observe_compare_v2`

Anonymous: firstViewedGroup · firstTouchedGroup · decisionTime · wrongTouchCount · idleTime · comparisonStrategy  

Rules: no child identity · no profile · no grading · no adaptive pressure · **observation only**.

## 6. Accessibility — Silent Mode

Animation = primary channel. Audio optional. Meaning never depends on sound.

## 7. QA (MBA-QA-001)

- [ ] World feels calm
- [ ] Child never feels rushed
- [ ] Story Token transitions are invisible
- [ ] Eye contact feels natural
- [ ] Motion loops contain no visible jump
- [ ] AI never interrupts
- [ ] Accessibility preserved

## 8. Performance

60 FPS · GPU-friendly idle · **zero allocations during idle loop** · no dropped frames.

→ `LS011_PERF.zeroAllocationsDuringIdleLoop`

## 9. Architecture

```
src/mba/
  token-001.ts      MBA-TOKEN-001
  char-dna-001.ts   MBA-CHAR-DNA-001
  motion-001.ts     MBA-MOTION-001
  qa-001.ts         MBA-QA-001
  index.ts
```

## 10. Gameplay

None. Infrastructure only. Ready for LS-011.
