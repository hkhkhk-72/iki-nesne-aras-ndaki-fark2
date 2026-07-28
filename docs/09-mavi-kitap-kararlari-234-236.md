# Mavi Kitap — Kararlar 234 · 235 · 236

> Bu kararlar MB-MAT-1.1.01 "İlk Bakış" ile birlikte yürürlüğe girmiştir.
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
