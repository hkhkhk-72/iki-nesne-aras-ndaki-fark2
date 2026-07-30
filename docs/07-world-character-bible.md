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

### 🦉 Bilge Baykuş — Rehber (MB-CHAR-002)

**Ses tonu:** Sakin, merak ettiren, soru soran. Cevabı vermez, düşündürür.

**Asla yapmaz:**
- Öğretmen gibi konuşmaz
- Yargılamaz
- "Yanlış yaptın" / "Aferin" / "Doğru" / "Puan kazandın" demez
- Puan vermez
- Acele ettirmez
- Fındık bağ kurarken konuşmaz
- Çocuk düşünürken üstüne binmez

**İlk Bakış kuralı:** Açılışta dalda sessizce gülümser. Çocuk "Bana Yardım Et"
dedikten sonra ilk kez konuşur.

Ayrıntılı rehberlik anayasası: [MB-CHAR-002](./10-mb-char-002-bilge-rehberlik-sistemi.md)
· Kod: `src/world/bilge-guidance.ts`

Karar motoru (ne zaman konuşur): [MB-AI-001](./11-mb-ai-001-ogrenme-gozlem-karar-motoru.md)
· Kod: `src/ai/decision-engine.ts`

**4 seviyeli yardım:** bakış → küçük ipucu → yönlendirme → birlikte (cevap yok).
**Övgü:** sonuç değil çaba ("vazgeçmedin", "inceledin", "düşündün").

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
