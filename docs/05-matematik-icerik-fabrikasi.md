# Matematik İçerik Fabrikası

## İçerik Üretim Standardı

Her kazanım şu yapıda üretilir:

```
Kazanım (LearningOutcome)
├── Meta: id, code, title, description, grade, unit
├── Gerçek Hayat Bağlamları (min 2)
├── Ön Koşullar
└── Aktiviteler (min 3 mod)
    ├── Oyna (zorunlu)
    ├── Keşfet veya Deney (zorunlu)
    ├── Gerçek Hayat veya Ev (zorunlu)
    └── Opsiyonel: Akıllı Tahta, Meydan Okuma, AI, PDF
```

## Kazanım Kodlama

Format: `M.{sınıf}.{ünite}.{sıra}`

Örnek: `M.1.2.1` = 1. Sınıf, 2. Ünite, 1. Kazanım

## JSON Şablonu

```json
{
  "id": "out-1-2-1",
  "code": "M.1.2.1",
  "title": "Daha Fazla – Daha Az – Eşit",
  "activities": [
    {
      "id": "act-1-2-1-play",
      "mode": "play",
      "engineId": "comparison",
      "payload": { ... }
    }
  ]
}
```

## Motor Seçim Rehberi

| Kavram | Önerilen Motor |
|--------|----------------|
| Eşleştirme | matching |
| Sıralama, kategorileme | drag_drop |
| Karşılaştırma | comparison |
| Hızlı tepki | balloon_pop (gelecek) |
| Hikâye tabanlı | story (gelecek) |

## Kalite Kontrol Listesi

- [ ] Pedagojik amaç net mi?
- [ ] Gerçek hayat bağlamı var mı?
- [ ] Hint (ipucu) eklendi mi?
- [ ] Celebration (kutlama) mesajı var mı?
- [ ] Süre tahmini doğru mu?
- [ ] Motor doğru seçildi mi?
- [ ] Ön koşullar tanımlı mı?
- [ ] 10 çalışma prensibi test edildi mi?

## 1. Sınıf Müfredat Durumu

| Ünite | Kazanım | Etkinlik | Durum |
|-------|---------|----------|-------|
| Sayılar ve Sayma | 3 | 7 | ✅ |
| Karşılaştırma | 2 | 8 | ✅ |
| Toplama | 1 | 1 | 🔄 |

## İçerik Ekleme Adımları

1. `src/content/grade1/curriculum.json` dosyasını aç
2. Yeni kazanım veya aktivite ekle
3. Uygun `engineId` ve `payload` tanımla
4. `npm run typecheck` çalıştır
5. Uygulamada test et
