# GRP / GRS / LS — Repo Kimlik Köprüsü

> Bu belge **yeni kural icat etmez**. Master Status’taki kimlikleri mevcut kod yollarına bağlar.

| Kurucu kimlik | Anlam | Repo karşılığı |
|---------------|--------|----------------|
| GRP-001 | Golden Reference Program | Aktif faz — `docs/00-master-project-status.md` |
| GRS-001 / LS-001 | Fındık ile Tanışma | `MB-MAT-1.1.01` · `scene01` (*İlk Bakış* / tanışma) |
| FN-001 | Fındık Sincap | `src/world/characters.ts` → `findik` |
| BO-001 | Bilge Baykuş | `src/world/characters.ts` → `bilge` + `src/world/bilge-guidance.ts` |
| MB-MAT-1.1.01 | Kış Hazırlığı modülü | `src/modules/math/unit1/MB-MAT-1.1.01/` |
| MB-LAB-001 | Az / Çok / Eşit lab | Kazanım `out-1-1-1` / `MAT.1.1.1` |
| MES-002 | Mikro deneyim standardı | `src/mes/` · `docs/06-…` |
| MB-CHAR-002 | Bilge rehberlik anayasası | `docs/10-…` · `bilge-guidance.ts` |
| MB-AI-001 | Gözlem & karar motoru | `docs/11-…` · `src/ai/` |
| GRS-001C | Figma Foundation (ürün) | `src/design-tokens/` + Figma `01 Tokens` |
| MB-LAB-001 | Az/Çok/Eşit bilimsel temel | `src/lab/` · `src/qa/lab-qa.ts` · `docs/16-…` |
| MBA-BENCHMARK-001 | Küresel üretim eşiği v1.1 | `src/benchmark/` · `src/qa/benchmark-qa.ts` · `docs/17-…` |
| MBA-TOKEN-001 | Token kayıt (LS-011 prep) | `src/mba/token-001.ts` |
| MBA-CHAR-DNA-001 | FN-001 / BO-001 DNA | `src/mba/char-dna-001.ts` |
| MBA-MOTION-001 | Motion / FX kayıt | `src/mba/motion-001.ts` |
| MBA-QA-001 | Quality Gate (LS-011) | `src/mba/qa-001.ts` · `src/qa/ls011-prep-qa.ts` |
| MBA-LIFE-001 | Character Life System (Foundation) | `src/mba/life-001.ts` · `src/life/` · `src/life/engine/` · `docs/19-…` |
| Karar 268–270 | Bakış nesneye · yanlış seçim yok · beklemede yaşayan dünya | `src/world/mavi-kitap-268-270.ts` · ChooseScene · `decideIntervention` |
| Karar 271–273 | Sessizlik · hata hissettirilir · Reflection Time | `src/world/mavi-kitap-271-273.ts` · `reflectionTimeMs` |
| Karar 274–276 | Keşif çocuğa ait · dünya kutlar · süreç > sonuç | `src/world/mavi-kitap-274-276.ts` |
| Karar 277–279 | Davranışla soru · beklemek öğretim · merak önce | `src/world/mavi-kitap-277-279.ts` · SceneStage |
| Karar 283–285 | Kavram bağımsız · ≥3 bağlam · transfer | `src/world/mavi-kitap-283-285.ts` · `concept-transfer.ts` |

## Sahne sırası (modül içi)

Mevcut MES sahneleri LS hattının ilk dilimidir; tam 30 LS genişlemesi ürün döneminde GRS kalitesinde üretilecek.

| scene id | Rol |
|----------|-----|
| scene01 | GRS-001 / LS-001 — tanışma / İlk Bakış |
| scene02 | Sezgisel “daha fazla” |
| **ls006** | **LS-006 Trust** — `story.trust` / `motion.trust` |
| **LS-011 prep** | Altyapı — `story.thinking.deep` · `motion.look_back_child` · `anim.deep_breath` · `FX_soft_bounce` · `ai.observe_compare_v2` (`docs/18-…`) |
| scene03… | Keşif → gözlem → eşleştirme → az/çok/eşit → kutlama |

## Token → kod

| Token ailesi | Dosya |
|--------------|--------|
| color / spacing / radius / type / shadow | `src/design-tokens/visual.ts` |
| story.* | `src/design-tokens/story.ts` |
| edu.* | `src/design-tokens/educational.ts` |
| ai.* | `src/design-tokens/ai.ts` |
| motion.* | `src/design-tokens/motion.ts` |
| audio.* | `src/design-tokens/audio.ts` |
| export barrel | `src/design-tokens/index.ts` |
