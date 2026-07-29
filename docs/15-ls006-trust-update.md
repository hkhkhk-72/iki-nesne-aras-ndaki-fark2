# LS-006 Trust — Update Package (GRP-001 APPROVED)

| Alan | Değer |
|------|--------|
| Module | MB-MAT-1.1.01 |
| Scene | LS-006 |
| Status | APPROVED |
| Repo | `ls006` in `scenes.ts` |

## Tokens

| Token | Dosya |
|-------|--------|
| `story.trust` | `src/design-tokens/story.ts` |
| `motion.trust` | `src/design-tokens/motion.ts` |
| `ai.first_success` | `src/design-tokens/ai.ts` + `src/ai/analytics.ts` |
| `ai.decision_confidence` | aynı |

## Character states

`emotion.trust` · `pose.smile_small` · `anim.nod_small` · `anim.eyeWarm`  
→ `src/world/character-states.ts` (`FINDIK_TRUST_STATE`)

## Assets

| ID | Name | Kullanım |
|----|------|----------|
| AN006 | Small Smile | FindikSmile |
| AN007 | Small Nod | TrustReaction |
| FX010 | Warm Glow | TrustReaction / DecisionRipple |
| SFX006 | Soft Bell | soundBudget.success |

→ `src/world/assets.ts`

## Components

```
src/components/scene/
  FindikSmile.tsx
  TrustReaction.tsx
  DecisionRipple.tsx
  SceneTransition.tsx
```

## Figma

Frame: `07 Scenes / LS-006_Trust`

Layers:
- Trust Overlay
- Warm Glow
- Smile State
- Transition Layer

Checklist: [docs/14-grs-001c-figma-foundation.md](./14-grs-001c-figma-foundation.md) altına LS-006 ek not.

## QA (zorunlu)

- [x] No score
- [x] No reward popup
- [x] No correct/wrong feedback
- [x] Supportive emotional response only

## React Native

- Trust animation state: `TrustScene` in `ExperienceRunner`
- Story token `story.trust` + motion `motion.trust`
- Analytics: `registerFirstSuccess()` → `first_success` + `decision_confidence`
