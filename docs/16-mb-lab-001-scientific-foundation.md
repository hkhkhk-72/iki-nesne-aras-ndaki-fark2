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
| 1 | **Perceptual Subitizing** (1–4 nesne) | `edu.subitize` · MB-277 |
| 2 | **Conceptual Subitizing** (5+ alt gruplar) | `edu.partWhole` · `edu.grouping` · MB-278 |
| 3 | **CPA** Concrete → Pictorial → Abstract | Her LS CPA destekler (MB-280) |
| 4 | **Montessori Sensory Learning** | Doğal dizilim, dokunma, baskısız tempo |
| 5 | **Finland Play-Based Mathematics** | Hikâye + oyun; test hissi yok |
| 6 | **OECD Starting Strong** | Erken matematik = ilişki, dil, oyun |

---

## 2. Pedagojik Kurallar (Mavi Kitap + LAB)

### MB-268 — İlk Karar Güvenli Olmalıdır

İlk matematiksel karar asla "yanlış" etiketlenmez; sistem yalnızca gözlemler.

### MB-269 — Karşılaştırma Saymadan Önce Gelir

Önce miktar farkı hissedilir; sembol ve sayılar sonra gelir.

### MB-270 — Dünya Geri Bildirim Verir

Geri bildirimi arayüz değil dünya verir (bakış, yaprak, doğal hareket).

### MB-271 — Sessizlik de Bir Geri Bildirimdir

Ses/metin zorunlu değildir; bekleme ve doğal akış düşünmeye teşvik eder.

### MB-272 — Hata Söylenmez, Hissettirilir

Asla "yanlış" denmez; doğal ipucu ile çocuk yeniden değerlendirir.

### MB-273 — Düşünme Süresi Başarı Süresinden Değerlidir

AI öncelikle **Reflection Time** izler; hız övülmez.

### MB-274 — Keşif Anı Çocuğa Aittir

Keşif anı çocuğundur; sistem yalnızca görünür ve anlamlı kılar.

### MB-275 — Dünya Kutlar, Arayüz Değil

Kutlama dünya ile; pop-up / yıldız yağmuru / yüksek ses yok.

### MB-276 — Süreç Sonuçtan Değerlidir

AI süreci analiz eder (gözlem, karşılaştırma, düşünme, öz-düzeltme); sonucu değil.

### MB-277 — 1–4 Asla Saydırılmaz

1–4 nesne **ASLA** saydırılmaz (perceptual subitizing).

### MB-278 — 5+ Alt Grup

5+ nesnede doğal kümeler: `3+2`, `4+1`, `2+2+1` vb.

### MB-279 — Hız Baskısı Yasak

Timer · Countdown · LeaderBoard · Speed Bonus yasaktır.

### MB-280 — Her LS CPA Destekler

Concrete → Picture → Abstract. Her Learning Scene bu zinciri destekler.

### MB-281 — Gör → Hisset → İsimlendir

Matematik önce **görülür**, sonra **hissedilir**, en son **isimlendirilir**.

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
