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

## Sahne sırası (modül içi)

Mevcut MES sahneleri LS hattının ilk dilimidir; tam 30 LS genişlemesi ürün döneminde GRS kalitesinde üretilecek.

| scene id | Rol |
|----------|-----|
| scene01 | GRS-001 / LS-001 — tanışma / İlk Bakış |
| scene02 | Sezgisel “daha fazla” |
| **ls006** | **LS-006 Trust** — `story.trust` / `motion.trust` |
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
