# Mavi Kitap — Kararlar 231 · 234–239

> Bu kararlar MB-MAT-1.1.01 "İlk Bakış", MB-CHAR-002 ve MB-AI-001 ile yürürlüktedir.
> Kod denetimi: `validateExperience()` + `npm run mes:check`.

## 📘 Karar No: 231 — Sezgisel Matematik Önceliği *(hatırlatma)*

Çocuk saymadan önce **görür**. "Say." / "Kaç tane?" demeden önce
"daha fazla / daha az" sezdirilir.

**Kod:** `countVisibility: 'never'` (MB-MAT-1.1.01 sahne 02 — İki Ağaç).

---

## 📘 Karar No: 234 — Dünya Önce, Arayüz Sonra

Çocuk uygulamayı açtığında ilk dikkatini çeken unsur butonlar değil,
**yaşayan dünya** olacaktır.

### Görsel Kompozisyon Standardı

| Katman | Pay | İçerik |
|--------|-----|--------|
| Canlı dünya | **%70** | Ağaçlar, çimen, gölgeler, kuşlar, yapraklar |
| Etkileşim | **%20** | Palamutlar, sepet, Fındık, dokunma alanları |
| Arayüz | **%10** | Geri, ses, ayarlar |

Arayüz dünyayı bastırmaz. Çocuk önce dünyayı, sonra oyunu görür.

**Kod:** `SceneSpec.visualComposition` — `world + interaction + ui === 100`,
`world ≥ 60`, `ui ≤ 15`.

---

## 📘 Karar No: 235 — İlk Dakikada Matematik Kelimesi Kullanılmaz

İlk **60 saniye** boyunca çocuk yardım eder, keşfeder ve bağ kurar.
Matematik kavramları doğal olarak deneyimin içine yerleştirilir; kelime
olarak dayatılmaz.

Yasaklı örnekler (ilk 60 sn, çocuğa görünen metin):

`matematik`, `sayı`, `say`, `kaç tane`, `toplama`, `çıkarma`, `doğru cevap`, `puan`

**Kod:** `validateExperience` ilk dakika sahnelerinde bu kelimeleri tarar.

---

## 📘 Karar No: 236 — Her Mikro Deneyim Tek Bir Öğrenme Hedefi Taşır

Bir mikro deneyim (sahne) yalnızca **bir** temel beceriye odaklanır.
Birden fazla yeni kavram aynı deneyimde tanıtılmaz.

Örnek (MB-MAT-1.1.01):

| Sahne | Tek hedef |
|-------|-----------|
| İlk Bakış | Duygusal bağ |
| İki Ağaç | Sezgisel "daha fazla" |
| Palamutları Keşfet | Birebir dokunarak sayma |
| Birebir Eşleştir | Artan tarafı sezdirme |
| Daha Az Olan | "Daha az" karşıtı |

---

## 🎼 Ses Tasarımı Standardı

Her sahnede en fazla **4 katman**:

1. Ortam sesi
2. Karakter sesi
3. Etkileşim sesi
4. Başarı sesi

Aynı anda onlarca efekt çalmaz. Dikkat dağınıklığını azaltır, odağı korur.

**Kod:** `SceneSpec.soundBudget` — dört alan zorunlu doldurulur.

---

## 📘 Karar No: 237 — Sessizlik de Rehberliğin Bir Parçasıdır

Bilge Baykuş, çocuk aktif olarak düşünürken veya keşfederken konuşmaz.
Gereksiz yönlendirme, keşif duygusunu zayıflatır.

**Kod:** `BilgeSilenceReason` · `decideIntervention` zorunlu sus (`drag_active`, `explore_active`, düşünme penceresi).

---

## 📘 Karar No: 238 — Yardım Basamaklıdır

Bilge hiçbir zaman doğrudan çözümü sunmaz. Yardım sırası:

1. İşaret etme (sessiz bakış)
2. Küçük ipucu
3. Düşünmeyi yönlendirme
4. Birlikte çözme (cevap yok)

**Kod:** `HELP_LADDER` · `HelpLevel` 1–4 · `lineForHelpLevel()`.

---

## 📘 Karar No: 239 — Başarı Sonuçta Değil Süreçtedir

MiniBilge'de övgü; doğru cevaba değil, gösterilen çabaya, meraka, sabra
ve öğrenme stratejisine yöneliktir.

Örnek: *"Harika, vazgeçmedin."* · *"Dikkatlice inceledin."* · *"Yeni bir yol denedin."*

**Kod:** `EFFORT_PRAISE` · `isProcessPraise()` · `after_effort` tetikleyicisi.

---

## 📘 Karar No: 268 — İlk Karar Güvenli Olmalıdır

Çocuğun verdiği ilk matematiksel karar hiçbir zaman "yanlış" olarak
etiketlenmez. Sistem, ilk kararları öğrenme sürecinin doğal bir parçası
olarak kabul eder ve yalnızca gözlemler.

**Kod:** `firstMathDecision` · `src/world/mavi-kitap-268-270.ts` · ChooseScene güvenli yol.

---

## 📘 Karar No: 269 — Karşılaştırma Saymadan Önce Gelir

Karşılaştırma becerisi, sayma becerisinden önce geliştirilir. Çocuk önce
miktar farkını hisseder, daha sonra semboller ve sayılarla tanışır.

**Kod:** `countVisibility: 'never'` (ilk karşılaştırma) · `edu.visualCompare` / `edu.compare`.

---

## 📘 Karar No: 270 — Dünya Geri Bildirim Verir

Geri bildirimi arayüz değil, dünyanın kendisi verir. Yaprakların hareketi,
Fındık'ın bakışı ve nesnelerin doğal animasyonları; "doğru/yanlış"
mesajlarının yerini alır.

**Kod:** `worldFeedback` · dünya cue + karakter repliği; UI rozeti yok.

---

## 📘 Karar No: 271 — Sessizlik de Bir Geri Bildirimdir

Her geri bildirim ses veya metin olmak zorunda değildir. Gerektiğinde
karakterin beklemesi ve dünyanın doğal akışı, çocuğu düşünmeye teşvik
eden en güçlü pedagojik araçtır.

**Kod:** `decideIntervention` sessizlik / bakış · Karar 237 ile uyumlu · `src/world/mavi-kitap-271-273.ts`.

---

## 📘 Karar No: 272 — Hata Söylenmez, Hissettirilir

MiniBilge hiçbir zaman "yanlış" demez. Sistem, çocuğun kendi gözlemiyle
kararını yeniden değerlendirebilmesi için doğal ipuçları sunar.

**Kod:** `FORBIDDEN_DECISION_LABELS` · Control of Error · dünya cue (Karar 270).

---

## 📘 Karar No: 273 — Düşünme Süresi Başarı Süresinden Değerlidir

Bir çocuğun düşünmek için ayırdığı zaman, doğru cevabı verme hızından daha
değerli bir öğrenme göstergesidir. AI motoru öncelikle **Reflection Time**
metriğini izler.

**Kod:** `reflectionTimeMs` · `reflection_time` sinyali · `PRIMARY_AI_METRICS`.

---

## 📘 Karar No: 274 — Keşif Anı Çocuğa Aittir

MiniBilge hiçbir zaman keşif anını elinden almaz. Çocuk "Ben buldum."
hissini yaşamalıdır. Sistem yalnızca bu anı görünür ve anlamlı kılar.

**Kod:** `discoveryBelongsToChild` · DiscoverScene · `src/world/mavi-kitap-274-276.ts`.

---

## 📘 Karar No: 275 — Dünya Kutlar, Arayüz Değil

Doğru öğrenme anlarında geri bildirim; karakterlerin davranışları, ışık,
doğa ve çevresel animasyonlarla verilir. Pop-up, yıldız yağmuru veya
yüksek sesli efektler kullanılmaz.

**Kod:** `worldCelebration` · `FORBIDDEN_UI_CELEBRATION` · CelebrateScene dünya cue.

---

## 📘 Karar No: 276 — Süreç Sonuçtan Değerlidir

MiniBilge, doğru cevabı değil; gözlem, karşılaştırma, düşünme ve kendi
kendini düzeltme sürecini destekler. Yapay zekâ bu süreci analiz eder,
sonucu değil.

**Kod:** `PROCESS_AI_METRICS` · `PRIMARY_AI_METRICS` · Karar 239 / 273 ile uyumlu.

---

## 📘 Karar No: 277 — 1–4 Asla Saydırılmaz *(MB-LAB-001)*

1–4 nesne perceptual subitizing ile hissedilir; sayma istemi yasaktır.

**Kod:** `mayPromptCount()` · discover `revealCount: false` (1–4).

---

## 📘 Karar No: 278 — 5+ Alt Grup *(MB-LAB-001)*

5 ve üzeri nesnelerde doğal kümeler: 3+2, 4+1, 2+2+1…

**Kod:** `pickGrouping()` · `edu.grouping` / `edu.partWhole`.

---

## 📘 Karar No: 279 — Hız Baskısı Yasak

Timer · Countdown · LeaderBoard · Speed Bonus yasaktır.

**Kod:** `FORBIDDEN_PRESSURE` · `runLabQa()`.

---

## 📘 Karar No: 280 — Her LS CPA Destekler

Concrete → Pictorial → Abstract. Her Learning Scene bu zinciri destekler.

---

## 📘 Karar No: 281 — Gör → Hisset → İsimlendir *(MB-LAB-001)*

Matematik önce görülür, sonra hissedilir, en son isimlendirilir.

Ayrıntı: [docs/16-mb-lab-001-scientific-foundation.md](./16-mb-lab-001-scientific-foundation.md)
