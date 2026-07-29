# GRS-001C — Figma Foundation (ürün görevi)

> Master Status §14.1 — **Önce Figma, sonra kod.**  
> Bu belge Figma klasör sözleşmesini ve repo token köprüsünü sabitler.  
> Yeni anayasa değildir.

## Figma dosya ağacı

```
MiniBilge / GRS-001 Foundation
├── 01 Tokens          ← src/design-tokens/*
├── 02 Foundations
├── 03 Icons
├── 04 Components
├── 05 Patterns
├── 06 Templates
├── 07 Scenes          ← GRS-001 / LS-001 frame’leri
├── 08 Prototype
├── 09 QA
└── 10 Handoff
```

## 01 Tokens — zorunlu koleksiyonlar

| Figma collection | Kod |
|------------------|-----|
| Visual / Color / Space / Type / Radius / Shadow | `visual.ts` |
| Story | `story.ts` |
| Educational | `educational.ts` |
| AI | `ai.ts` |
| Motion | `motion.ts` |
| Audio | `audio.ts` |

Zorunlu örnek değişkenler (Status §7):

`story.safe` · `story.curious` · `story.help` · `story.excited`  
`edu.compare` · `edu.count`  
`ai.first_touch`  
`motion.gentle`  
`color.leaf.autumn`

## Kompozisyon (Karar 234)

Her Scene frame’de annotation:

- World **70%**
- Interaction **20%**
- UI **10%**

## GRS-001 sahne frame checklist

- [ ] Sonbahar dünya (yaprak, rüzgar atmosferi)
- [ ] FN-001 yarı dolu sepet
- [ ] BO-001 dalda sessiz gülümseme
- [ ] Tek CTA: **Bana Yardım Et**
- [ ] Bond anı: sepet ↑ + yaprak/yıldız + Bilge ilk replik
- [ ] Story token: `story.safe` → `story.help` → `story.together`
- [ ] Edu token: `edu.bond` (matematik yok)
- [ ] AI pins: `ai.first_touch`, `ai.screen_dwell`, `ai.wait`

## Kod köprüsü

```ts
import { storyTokens, color, composition, audioGrs001 } from '@/design-tokens';
```

Mevcut UI `@/theme` üzerinden aynı visual token’ları kullanır (breaking change yok).

## LS-006 Trust frame (APPROVED)

`07 Scenes / LS-006_Trust`

| Layer | Asset / Token |
|-------|----------------|
| Trust Overlay | `story.trust` |
| Warm Glow | FX010 |
| Smile State | AN006 + `pose.smile_small` |
| Transition Layer | `motion.trust` + SceneTransition |

QA: puan yok · ödül popup yok · doğru/yanlış yok · yalnızca destekleyici duygu.

## Sonraki ürün adımları

② UI Kit · ③ Scene Kit · ④ Animation Kit · ⑤ Çalışan prototip (Expo 57)
