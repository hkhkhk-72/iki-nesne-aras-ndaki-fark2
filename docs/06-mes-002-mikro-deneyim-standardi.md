# MES-002 — Mikro Deneyim Standardı

> Artık ekran tasarlanmıyor. Mikro deneyim tasarlanıyor.

## Temel Ölçü

Her mikro deneyim **20-60 saniye** sürer. Bir ders, birbirini takip eden
mikro deneyimlerden (sahnelerden) oluşur.

## Zorunlu Başlıklar

Her sahne aşağıdaki alanları taşımak zorundadır. Eksik alan varsa içerik
yayınlanamaz (`validateExperience` kontrolü).

| Alan | Kod karşılığı | Açıklama |
|------|---------------|----------|
| Pedagojik Amaç | `pedagogicalGoal` | Bu sahne neyi öğretiyor |
| Hedef Duygu | `targetEmotion` | Çocuk ne hissetmeli |
| Sinematik Açılış | `opening` | Görsel + ilk replik + konuşan |
| Etkileşim | `interaction` | Çocuk ne yapıyor |
| AI Gözlemi | `aiObservation` | Hangi sinyaller izlenecek |
| Geri Bildirim | `feedback` | Olumlu ve yönlendirici replik |
| Yeniden Oynanabilirlik | `replay` | Değişkenlik havuzu |
| Erişilebilirlik | `accessibilityLabel` | Ekran okuyucu özeti |
| Süre | `estimatedSeconds` | 20-60 sn |
| Dokunuş | `maxTouches` | ≤ 3 |

## 60 Saniye Kuralı

İlk 60 saniyede çocuk mutlu olmalı, başarmalı, gülümsemeli, merak etmeli ve
tekrar gelmek istemeli.

Kod karşılığı: ilk üç sahnenin toplamı 90 saniyeyi geçemez ve **ilk sahnede
çocuğun hiçbir şeyi bilmesi gerekmez** (sahne 1 daima `narrative`).

## 3 Dokunuş Kuralı

İlk deneyimde sahne başına en fazla 3 dokunuş. `narrative` ve `celebrate`
sahneleri bütçeye dahil edilmez.

## Etkileşim Türleri

| Tür | Pedagojik işlev |
|-----|-----------------|
| `narrative` | Duygusal bağ, hikâye kurulumu. Doğru cevap yok. |
| `discover` | Dokunarak keşif, birebir sayma. |
| `observe` | Gözlem. Doğru cevap yok, fark etme var. |
| `pair` | Birebir eşleştirme; artan taraf kavramı sezdirir. |
| `choose` | Kavram kararı. Yanlışta sahne değişmez, ipucu güçlenir. |
| `celebrate` | Emeği görünür kılma. Puan gösterilmez. |

## Görünmez Matematik

Çocuk "ders yapıyorum" demez. "Fındık'a yardım ediyorum" der.

Kodda bu ayrım iki alanla zorunlu kılınır:

```typescript
storyGoal: "Fındık'ın kışa hazırlanmasına yardım etmek"   // çocuğa görünen
learningGoal: 'Az, çok ve eşit kavramlarını kazandırmak'  // perde arkası
```

## Yanlış Cevap Politikası

Yanlış cevapta:

- Sahne **değişmez**
- Puan **düşmez**
- "Yanlış" kelimesi **kullanılmaz**
- İpucu kademeli güçlenir (`hints` dizisi)
- AI kavram yanılgısını kaydeder

## Klasör Yapısı

```
src/modules/math/unit1/MB-MAT-1.1.01/
  index.ts      → MicroExperience tanımı
  scenes.ts     → Sahne dizisi
```

Her mikro deneyim bağımsız klasörde yaşar.

## Kalite Kontrolü

`validateExperience(exp)` şunları denetler:

- Sahne süresi 20-60 sn aralığında
- `maxTouches ≤ 3`
- Pedagojik amaç ve erişilebilirlik etiketi dolu
- İlk üç sahne toplamı ≤ 90 sn

`validateLine(line)` Character Bible yasaklı ifadelerini denetler.

## Referans Ders

**MB-MAT-1.1.01 — Fındık Sincap'ın Kış Hazırlığı**

| Sahne | Ad | Süre | Etkileşim |
|-------|-----|------|-----------|
| 1 | Fındık ile Tanışma | 25s | narrative |
| 2 | Palamutları Keşfet | 30s | discover |
| 3 | İki Kovayı İncele | 30s | observe |
| 4 | Birebir Eşleştir | 45s | pair |
| 5 | Daha Çok Olan | 40s | choose |
| 6 | Daha Az Olan | 40s | choose |
| 7 | Eşit Olunca | 40s | choose |
| 8 | Kış Hazır! | 20s | celebrate |

Toplam: 270 saniye (~4,5 dakika)

Bu ders, sonraki tüm içeriklerin kalite çıtasıdır.
