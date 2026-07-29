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

**Karar 235:** İlk 60 saniye boyunca matematik kelimesi kullanılmaz.

## Görsel & Ses Standartları

- **%70 / %20 / %10** — dünya / etkileşim / arayüz (Karar 234)
- Ses bütçesi: ortam + karakter + etkileşim + başarı (en fazla 4 katman)

Ayrıntı: [docs/09-mavi-kitap-kararlari-234-236.md](./09-mavi-kitap-kararlari-234-236.md)

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

| Sahne | Ad | Süre | Etkileşim | Tek hedef |
|-------|-----|------|-----------|-----------|
| 1 | İlk Bakış | 20s | narrative | Duygusal bağ |
| 2 | İki Ağaç | 30s | choose (sezgisel) | Daha fazla |
| 3 | **LS-006 Güven** | 18s | trust | Güven (puan yok) |
| 4 | Palamutları Keşfet | 30s | discover | Birebir sayma |
| 4 | İki Kovayı İncele | 30s | observe | Grup farkındalığı |
| 5 | Birebir Eşleştir | 45s | pair | Artan taraf |
| 6 | Daha Çok Olan | 40s | choose | Daha çok |
| 7 | Daha Az Olan | 40s | choose | Daha az |
| 8 | Eşit Olunca | 40s | choose | Eşit |
| 9 | Kış Hazır! | 20s | celebrate | Tekrar isteği |

Toplam: 295 saniye (~5 dakika)

Bu ders, sonraki tüm içeriklerin kalite çıtasıdır.

İlgili kararlar: [Karar 234–236](./09-mavi-kitap-kararlari-234-236.md) ·
[MB-CHAR-002](./10-mb-char-002-bilge-rehberlik-sistemi.md)
