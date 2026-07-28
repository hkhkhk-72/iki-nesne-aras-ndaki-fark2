# World Bible & Character Bible

## Matematik Köyü

Matematik ekranlardan oluşmaz. Matematik Köyü adında yaşayan bir dünyada geçer.

| Mekân | Görsel | İşlev |
|-------|--------|-------|
| Merkez Meydan | 🏘️ | Karşılama, günlük görev |
| Matematik Okulu | 🏫 | Kavram keşfi |
| Oyun Parkı | 🎠 | Pekiştirme, hız |
| Keşif Ormanı | 🌲 | Serbest keşif (Fındık burada yaşar) |
| Sessiz Bahçe | 🌸 | Sakinleşme, düşük uyaran |
| Kupa Meydanı | 🏆 | Koleksiyon, rozet |
| Bilge Baykuş Meydanı | 🦉 | Meydan okuma |

## Yaşayan Dünya

Evren gerçek tarih ve saate göre değişir (`getWorldState()`):

- **Mevsim** — ilkbahar, yaz, sonbahar, kış
- **Gün döngüsü** — sabah, gündüz, akşam, gece
- **Atmosfer** — kar, yaprak dökümü, yağmur
- **Karşılama** — güne göre değişir

Kışın köye kar yağar, sonbaharda yaprak döker. Köy çocuğu hatırlar.

## Karakterler

### 🦉 Bilge Baykuş — Rehber

**Ses tonu:** Sakin, merak ettiren, soru soran. Cevabı vermez, düşündürür.

**Asla yapmaz:**
- Öğretmen gibi konuşmaz
- Yargılamaz
- "Yanlış yaptın" demez
- Puan vermez
- Acele ettirmez

### 🐿️ Fındık Sincap — En yakın arkadaş

**Ses tonu:** Meraklı, enerjik, sıcak. Çocuktan yardım ister.

**Asla yapmaz:**
- Ders anlatmaz
- Çocuğu test etmez
- Üzgün bırakılmaz

Çocuk Fındık için görev yapar — matematik için değil. Bu, görünmez
matematiğin taşıyıcısıdır.

### ✨ Anlatıcı

Sahne geçişleri için. Kısa, şiirsel, görünmez. Matematik terimi kullanmaz.

## Yasaklı İfadeler

Aşağıdaki kelimeler hiçbir replikte kullanılmaz ve `validateLine()` ile
denetlenir:

`yanlış`, `hatalı`, `başarısız`, `olmadı`, `yapamadın`, `tekrar dene`, `kaybettin`

Bunun yerine merak ettiren yönlendirme kullanılır:

> ✗ "Yanlış, tekrar dene."
> ✓ "Az önce eşleştirmiştik. Hangi kovada eşi olmayan palamutlar kalmıştı?"
