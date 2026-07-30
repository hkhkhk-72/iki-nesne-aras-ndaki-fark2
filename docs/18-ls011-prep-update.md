# LS-011 Preparation — Update Package (GRP-001)

| Alan | Değer |
|------|--------|
| Version | GRP-001 |
| Sprint | LS-011 Preparation |
| Status | INFRASTRUCTURE ONLY |
| Gameplay | Yok — yalnızca sistem altyapısı |

## Amaç

LS-011 öncesi token / animasyon / FX / analytics / erişilebilirlik / QA sözleşmesi.

## 1. Story Token

| Token | Dosya |
|-------|--------|
| `story.thinking.deep` | `src/design-tokens/story.ts` |

**Kullanım:** Çocuk uzun süre düşünüyor → dünya sakinleşir · rüzgar yavaşlar · Fındık bekler · Bilge konuşmaz.

## 2. Motion Token

| Token | Loop | Dosya |
|-------|------|--------|
| `motion.look_back_child` | 6 sn | `src/design-tokens/motion.ts` |

Fındık çocuğa bakar, sonra palamutlara döner. `kind: character_loop` (mikro 250–450 ms kuralı dışı).

## 3. Animation

| Anim | Tetik | Asset |
|------|-------|--------|
| `anim.deep_breath` | 5 sn idle | AN008 |

→ `src/world/character-states.ts` · `FindikDeepBreath` · `DEEP_BREATH_IDLE_AFTER_MS = 5000`

## 4. FX

| Alias | ID | Spec |
|-------|-----|------|
| `FX_soft_bounce` | FX011 | scale 1.00 → 1.04 → 1.00 · 200 ms |

→ `src/world/assets.ts` · `SoftBounce`

## 5. Analytics

| Event | Alanlar | Gizlilik |
|-------|---------|----------|
| `ai.observe_compare_v2` | ilk bakılan grup · ilk dokunulan grup · karar süresi · keşif dokunuşu · bekleme | Anonim |

→ `src/design-tokens/ai.ts` · `registerObserveCompareV2` · `ObservationType`

## 6. Accessibility

Ses kapalı modda animasyonlar aynı anlamı taşır.

→ `src/core/accessibility.ts` · `SILENT_MODE_POLICY` · `meaningWithoutSound`

## 7. QA Checklist

- [ ] Dünya dikkat dağıtıyor mu?
- [ ] Çocuk acele hissediyor mu?
- [ ] AI gereksiz yardım ediyor mu?
- [ ] Motion doğal mı?
- [ ] Story Token doğru çalışıyor mu?

Kapı: `src/qa/ls011-prep-qa.ts` · `npm run check`

## Components (altyapı)

```
src/components/scene/
  SoftBounce.tsx
  FindikDeepBreath.tsx
  LookBackChild.tsx
```

Henüz MB-MAT sahnelerine bağlanmadı (gameplay yok).

## Figma (hazırlık notu)

Frame adayı: `07 Scenes / LS-011_*` (henüz sahne yok)

Layers (öneri): Deep Thinking Overlay · Look Back Loop · Soft Bounce · Idle Breath

## Sonraki adım

LS-011 gameplay / sahne bağlama — bu paketten **sonra**.
