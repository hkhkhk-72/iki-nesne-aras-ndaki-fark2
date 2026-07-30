# MBA-BENCHMARK-001 — Global Standards v1.1

> **Status:** APPROVED  
> **Version:** 1.1  
> **Kod:** `src/benchmark/` · QA: `src/qa/benchmark-qa.ts`

MiniBilge’nin küresel üretim eşiği. Yeni anayasa değildir; MBA / MES / LAB
üzerine ölçülebilir kalite kapısıdır.

---

## 1. Cognitive Standards

| Standart | MiniBilge karşılığı |
|----------|---------------------|
| Perceptual Subitizing | `edu.subitize` · MB-277 · 1–4 saymadan |
| Conceptual Subitizing | `edu.grouping` / `edu.partWhole` · MB-278 |
| Intraparietal Sulcus Based Number Sense | Miktar hissi önce; rakam sonra (MB-269/281) |
| Concrete → Pictorial → Abstract (CPA) | MB-280 · her LS |

Ayrıntı: [docs/16-mb-lab-001-scientific-foundation.md](./16-mb-lab-001-scientific-foundation.md)

---

## 2. UX Standards

| Ölçü | Değer |
|------|--------|
| Touch Target | **Minimum 64×64 px** |
| Animation Duration (mikro etkileşim) | **250–450 ms** |
| Micro Scene Length | **20–45 sn** |
| Interaction Latency | **&lt; 50 ms** |

---

## 3. Audio Standards

**Allowed ambient nature sounds:** wind · birds · leaves · soft wood  

**Forbidden:** buzzer · error alarm · loud rewards  

---

## 4. Motivation Standards

| Rol | Değer |
|-----|--------|
| Primary | Curiosity |
| Secondary | Helping Characters |
| Forbidden | Leaderboard · Lives · Heart System · Countdown Timer · Punishment |

---

## 5. Error Philosophy — Control of Error

Sistem asla **Wrong / Yanlış** demez.

Bunun yerine:

- Nesneler doğal yerine döner  
- Karakter gülümsemeye devam eder  
- Çocuk kendi düzeltmesini keşfeder  

---

## 6. Child Safety Rules

- No anxiety  
- No time pressure  
- No comparison  
- No punishment  
- No manipulation  

---

## 7. Story Rules

1. Story **always** before mathematics.  
2. Mathematics is **discovered**.  
3. Mathematics is **never announced**.  

(Karar 235 ile uyumlu: ilk 60 sn matematik kelimesi yok.)

---

## 8. QA Kapısı

`runBenchmarkQa(scene)` · `npm run mes:check`
