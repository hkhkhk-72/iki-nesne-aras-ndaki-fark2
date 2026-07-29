# MB-LAB-001 — Scientific Foundation v1.2

> **Status:** APPROVED  
> **Version:** 1.2  
> **Lab:** Az / Çok / Eşit  
> **Kod:** `src/lab/` · QA: `src/qa/lab-qa.ts`

MiniBilge bundan sonra aşağıdaki bilimsel temeller üzerine inşa edilir.
Yeni anayasa değildir; laboratuvarın ürün üretim standardıdır.

---

## 1. Bilimsel Temeller

| # | Temel | MiniBilge karşılığı |
|---|--------|---------------------|
| 1 | **Perceptual Subitizing** (1–4 nesne) | `edu.subitize` · sayma yok |
| 2 | **Conceptual Subitizing** (5+ alt gruplar) | `edu.partWhole` · `edu.grouping` |
| 3 | **CPA** Concrete → Pictorial → Abstract | Her LS CPA destekler (MB-272) |
| 4 | **Montessori Sensory Learning** | Doğal dizilim, dokunma, baskısız tempo |
| 5 | **Finland Play-Based Mathematics** | Hikâye + oyun; test hissi yok |
| 6 | **OECD Starting Strong** | Erken matematik = ilişki, dil, oyun |

---

## 2. Pedagojik Kurallar (MB-268 … MB-272)

### MB-268 — Gör → Hisset → İsimlendir

Matematik önce **görülür**, sonra **hissedilir**, en son **isimlendirilir**.

### MB-269 — 1–4 Asla Saydırılmaz

1–4 nesne **ASLA** saydırılmaz. Çocuk miktarı doğrudan hisseder (perceptual subitizing).

### MB-270 — 5+ Alt Grup

5+ nesnede doğal kümeler: `3+2`, `4+1`, `2+2+1` vb. (`edu.grouping` / `edu.partWhole`).

### MB-271 — Hız Baskısı Yasak

Hiçbir LS çocuğu hızlı cevaba zorlayamaz.

**Yasak:** Timer · Countdown · LeaderBoard · Speed Bonus

### MB-272 — Her LS CPA Destekler

Concrete → Picture → Abstract. Her Learning Scene bu zinciri desteklemek zorundadır.

---

## 3. Tokenlar

**Story:** `story.observe` · `story.notice` · `story.discover`  
**Edu:** `edu.subitize` · `edu.partWhole` · `edu.visualCompare` · `edu.grouping`  
**Motion:** `motion.deepBreath` · `motion.softBounce` · `motion.observe`  
**AI:** `ai.observe_pattern` · `ai.subitize_attempt` · `ai.grouping_strategy` · `ai.visual_focus`

---

## 4. Karakter Davranışları

**FN-001:** Observe → Think → Smile → Invite  
**BO-001:** Yalnızca çocuk uzun süre zorlanırsa ortaya çıkar (MB-CHAR-002 + gecikmeli yardım).

---

## 5. Tasarım Kuralı

Nesneler **ASLA** ızgara gibi dizilmez. Doğal görünür. Her tekrar farklı dizilim üretir.

Kod: `src/lab/natural-layout.ts`

---

## 6. QA Kapısı (her LS)

- [ ] Subitizing destekliyor mu?
- [ ] Saymadan çözülebiliyor mu?
- [ ] Timer var mı? → olmamalı
- [ ] Hız baskısı var mı? → olmamalı
- [ ] Montessori uyumlu mu?
- [ ] CPA uyumlu mu?
- [ ] Finland oyun yaklaşımına uygun mu?
- [ ] OECD önerileriyle çelişiyor mu?

Kod: `runLabQa(scene)` · `npm run mes:check`
