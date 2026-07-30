# MBA-LIFE-001 Foundation — Character Life System

| Alan | Değer |
|------|--------|
| Version | GRP-001 |
| Sprint | MBA-LIFE-001 Foundation |
| Status | Infrastructure Integrated |
| Gameplay / UI / Education | **No changes** |

## Purpose

Characters must never appear static.  
Life emerges through tiny, almost invisible behaviors — organic, not scripted.

## Token namespace `life.*`

Subgroups: eye · face · breath · tail · ear · idle · random · motion · focus · emotion

### Foundation tokens

| Token | Spec |
|-------|------|
| `life.eye.saccade` | 2–5s interval |
| `life.eye.contact` | max 1.2s |
| `life.face.micro_smile` | random subtle |
| `life.face.thinking` | tiny eyebrow |
| `life.breath.idle` | 5s cycle |
| `life.tail.soft` | independent float |
| `life.ear.listen` | random micro |
| `life.focus.child` | brief check |
| `life.focus.object` | return to object |

## 9 independent layers

Breath · Blink · Eye movement · Facial expression · Head · Ear · Tail · Basket · Leaves  

Never block each other. Max simultaneous = 9.

## Random scheduler

Weighted · cooldown · previous memory · no immediate repeat · AI **weight** override only · deterministic seed

Idle max identical sequence = **1**

## Story → Life

| Story | Life bias |
|-------|-----------|
| `story.safe` | slow blink · deep breath · soft smile |
| `story.curious` | faster eyes · head tilt · focus object |
| `story.thinking.deep` | reduced motion · slow breath · observation |

## AI

Modifies **probabilities only**. Never directly triggers animation.

## Forbidden

Robotic loops · sync blink · constant smile · exaggerated squash · sudden moves · horror timing · stare >2s · hyperactive idle

## RN modules

```
src/life/engine/
  CharacterLifeEngine.ts
  LifeScheduler.ts
  controllers.ts          (Blink/Eye/Breath/Tail/Ear/Focus/…)
  EmotionBridge.ts
  StoryTokenBridge.ts
  AIWeightController.ts
```

## Performance

60 FPS · pooling · zero idle alloc · battery/memory safe

## Ready

**Ready for MBA-LIFE-001 implementation** (visual binding next — not this package).
