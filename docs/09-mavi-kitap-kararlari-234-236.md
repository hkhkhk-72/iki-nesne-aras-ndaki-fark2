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

## 📘 Karar No: 268 — Gör → Hisset → İsimlendir *(MB-LAB-001)*

Matematik önce görülür, sonra hissedilir, en son isimlendirilir.

---

## 📘 Karar No: 269 — 1–4 Asla Saydırılmaz

1–4 nesne perceptual subitizing ile hissedilir; sayma istemi yasaktır.

**Kod:** `mayPromptCount()` · discover `revealCount: false` (1–4).

---

## 📘 Karar No: 270 — 5+ Alt Grup

5 ve üzeri nesnelerde doğal kümeler: 3+2, 4+1, 2+2+1…

**Kod:** `pickGrouping()` · `edu.grouping` / `edu.partWhole`.

---

## 📘 Karar No: 271 — Hız Baskısı Yasak

Timer · Countdown · LeaderBoard · Speed Bonus yasaktır.

**Kod:** `FORBIDDEN_PRESSURE` · `runLabQa()`.

---

## 📘 Karar No: 272 — Her LS CPA Destekler

Concrete → Pictorial → Abstract. Her Learning Scene bu zinciri destekler.

Ayrıntı: [docs/16-mb-lab-001-scientific-foundation.md](./16-mb-lab-001-scientific-foundation.md)
