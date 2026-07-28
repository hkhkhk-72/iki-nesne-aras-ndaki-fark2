# UI/UX Tasarım Sistemi

## Tasarım İlkeleri

1. **Sade** — Az yazı, güçlü görseller
2. **Büyük dokunma alanları** — Min 48px, tercih 56px
3. **Yüksek erişilebilirlik** — Kontrast, accessibilityLabel
4. **Düşük donanım performansı** — Hafif animasyonlar
5. **Oyun hissi** — Ders değil macera
6. **Dünya önce** — Arayüz dünyayı bastırmaz (Karar 234)

## Mikro Deneyim Görsel Kompozisyonu

| Katman | Pay | Örnek |
|--------|-----|-------|
| Canlı dünya | %70 | Ağaç, çimen, gölge, yaprak, kuş |
| Etkileşim | %20 | Palamut, sepet, Fındık, dokunma |
| Arayüz | %10 | Geri, ses, ayar |

## Ses Bütçesi

Sahne başına en fazla: 1 ortam + 1 karakter + 1 etkileşim + 1 başarı sesi.

## Renk Paleti

| Token | Değer | Kullanım |
|-------|-------|----------|
| primary | #4A90D9 | Ana aksiyon, 1. sınıf |
| secondary | #FF9F43 | Vurgu, eğlence |
| success | #2ECC71 | Doğru cevap |
| error | #E74C3C | Yanlış cevap |
| background | #F0F7FF | Sayfa arka planı |
| smartboard | #1A1A2E | Akıllı tahta modu |

## Tipografi

| Stil | Boyut | Kullanım |
|------|-------|----------|
| hero | 36px | Ana başlık |
| title | 28px | Sayfa başlığı |
| heading | 22px | Bölüm başlığı |
| body | 16px | Normal metin |
| caption | 14px | Yardımcı metin |

## Bileşenler

- `Button` — primary, secondary, outline, ghost, success
- `Card` — ikon, başlık, ilerleme çubuğu
- `ScreenHeader` — geri butonu, başlık
- `ProgressBar` — yüzde gösterimi

## Spacing

xs: 4 | sm: 8 | md: 16 | lg: 24 | xl: 32 | xxl: 48

## Aktivite Modu Renkleri

Her modun kendine özgü ikon ve rengi vardır (`activityModeLabels`).

## Tablet & Akıllı Tahta

- `orientation: default` (her iki yön)
- Akıllı tahta: koyu tema, büyük butonlar, split-screen düello
- Minimum dokunma: 72px (akıllı tahta)

## Haptic Geri Bildirim

- Dokunma: Light impact
- Doğru: Success notification
- Yanlış: Error notification
