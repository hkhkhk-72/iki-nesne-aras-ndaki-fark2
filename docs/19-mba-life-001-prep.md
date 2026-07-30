# MBA-LIFE-001 Preparation — Character Life System

| Alan | Değer |
|------|--------|
| Version | GRP-001 |
| Sprint | MBA-LIFE-001 Preparation |
| Status | Infrastructure Preparation |
| Gameplay | **No** |

## Purpose

Characters must feel alive even while doing nothing.  
Life is created through **subtle motion**, not constant animation.

## Token group — `life.*`

Reserved namespace. Groups:

- `life.eye.*`
- `life.face.*`
- `life.breath.*`
- `life.idle.*`
- `life.random.*`
- `life.motion.*`

→ `src/design-tokens/life.ts`

## Layered idle engine

Independent layers (simultaneous):

Breath · Eyes · Blink · Face · Tail · Ears · Basket · Leaves

→ `src/life/layers.ts`

## Random engine

Weighted scheduler:

- No immediate repetition
- Cooldown support
- Probability weights
- Memory of previous animation
- AI overridable

→ `src/life/random-scheduler.ts`

## Performance

60 FPS · battery friendly · memory safe · zero idle allocations · simultaneous layers

→ `src/life/performance.ts` · `LIFE_PERF`

## Architecture

| Kimlik | Yol |
|--------|-----|
| MBA-LIFE-001 | `src/mba/life-001.ts` |
| life engine | `src/life/` |
| QA | `src/qa/life-qa.ts` |

## Gameplay

None. Infrastructure only.  
**Ready for MBA-LIFE-001 implementation.**
