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

## 📘 Karar No: 268 — İlk Karar Güvenli · Bakış Nesneye

Çocuğun verdiği ilk matematiksel karar hiçbir zaman "yanlış" olarak
etiketlenmez. Seçimden sonra karakter önce çocuğa değil, seçilen nesneye
bakar — "beni dinliyor" hissini güçlendirir.

**Kod:** `firstMathDecision` · `gazeAtSelectionCue` · ChooseScene bakış vurgusu · `src/world/mavi-kitap-268-270.ts`.

---

## 📘 Karar No: 269 — Yanlış Seçim Yok · Keşif

MiniBilge'de yanlış seçim kavramı yoktur. Her etkileşim hikâyeyi ilerleten
doğal bir keşif olarak değerlendirilir. (Karşılaştırma saymadan önce gelir —
Karar 231 / `countVisibility`.)

**Kod:** `aligned` / `explored` gözlem dili · misconception etiketi yok · `countVisibility: 'never'`.

---

## 📘 Karar No: 270 — Dünya Geri Bildirim · Beklemede Yaşayan Dünya

Geri bildirimi arayüz değil, dünyanın kendisi verir. Bekleme durumlarında
yardım metni yerine yaşayan dünya kullanılır. Öncelik sırası:

1. Karakter mimiği  
2. Karakter bakışı  
3. Dünya sesi  
4. Rehber karakter  
5. Metin  

**Kod:** `WAIT_HELP_PRIORITY` · `waitHelpLayerAt` · `worldFeedback` · `decideIntervention`.

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

## 📘 Karar No: 277 — Karakter Soruyu Yaşar, Söylemez

MiniBilge'de karakterler önce davranışlarıyla soru oluşturur. Yazılı veya
sözlü yönlendirme, yalnızca davranışın ardından ve gerçekten gerekli
olduğunda kullanılır.

**Kod:** `behaviorBeforeSpeech` · SceneStage gecikmeli replik · `src/world/mavi-kitap-277-279.ts`.

---

## 📘 Karar No: 278 — Beklemek Öğretimin Bir Parçasıdır

Çocuğun düşünmesi için bırakılan sessiz süre, eğitim tasarımının aktif bir
bileşenidir. Sistem gereksiz yönlendirme yapmaz.

**Kod:** `waitIsTeaching` · Karar 271 sessizlik · `decideIntervention` bakış önceliği.

---

## 📘 Karar No: 279 — Merak Cevaptan Önce Gelir

Her yeni matematik kavramı, önce merak ve gözlem yoluyla zihinde yer
edinmeli; kavram adı ancak bu süreç tamamlandıktan sonra tanıtılmalıdır.

**Kod:** `curiosityBeforeConcept` · `EARLY_CONCEPT_ANNOUNCE` · Karar 235 / 284.

---

## 📘 Karar No: 280 — 1–4 Asla Saydırılmaz *(MB-LAB-001)*

1–4 nesne perceptual subitizing ile hissedilir; sayma istemi yasaktır.

**Kod:** `mayPromptCount()` · discover `revealCount: false` (1–4).

---

## 📘 Karar No: 281 — 5+ Alt Grup *(MB-LAB-001)*

5 ve üzeri nesnelerde doğal kümeler: 3+2, 4+1, 2+2+1…

**Kod:** `pickGrouping()` · `edu.grouping` / `edu.partWhole`.

---

## 📘 Karar No: 282 — Hız Baskısı Yasak

Timer · Countdown · LeaderBoard · Speed Bonus yasaktır.

**Kod:** `FORBIDDEN_PRESSURE` · `runLabQa()`.

---

## 📘 Karar No: 283 — Kavram Nesneden Bağımsızdır

MiniBilge'de matematiksel kavramlar belirli nesnelere bağlı öğretilmez.
Aynı kavram farklı bağlamlarda tekrar edilerek çocukta genelleme becerisi
geliştirilir.

**Kod:** `learningConcept` · `contextId` · `COMPARE_EMOJI_POOL` · `src/world/mavi-kitap-283-285.ts`.

---

## 📘 Karar No: 284 — Her Kavram En Az Üç Bağlamda Yaşatılır

Bir matematik kavramı, farklı nesneler ve hikâyeler içinde en az üç kez
deneyimlenmeden tamamlanmış kabul edilmez.

**Kod:** `MIN_CONTEXTS_PER_CONCEPT = 3` · `validateMinContexts()` · `src/mes/concept-transfer.ts`.

---

## 📘 Karar No: 285 — Tekrar Değil, Transfer

MiniBilge aynı etkinliği tekrar ettirmez. Bunun yerine aynı öğrenme hedefini
yeni bağlamlarda sunarak kalıcı öğrenmeyi destekler.

**Kod:** `validateTransferNotRepeat()` · `varyScene` / replay transfer.

---

## 📘 Karar No: 286 — Her LS CPA Destekler *(MB-LAB-001)*

Concrete → Pictorial → Abstract. Her Learning Scene bu zinciri destekler.

---

## 📘 Karar No: 287 — Gör → Hisset → İsimlendir *(MB-LAB-001)*

Matematik önce görülür, sonra hissedilir, en son isimlendirilir.

Ayrıntı: [docs/16-mb-lab-001-scientific-foundation.md](./16-mb-lab-001-scientific-foundation.md)
