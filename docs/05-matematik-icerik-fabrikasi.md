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

## Müfredat Durumu (Tüm Sınıflar)

| Sınıf | Ünite | Kazanım | Etkinlik |
|-------|-------|---------|----------|
| 1. Sınıf | 6 | 14 | ~70 |
| 2. Sınıf | 6 | 14 | ~70 |
| 3. Sınıf | 6 | 15 | ~75 |
| 4. Sınıf | 6 | 16 | ~80 |
| **Toplam** | **24** | **59** | **~295** |

İçerik `src/content/grades/index.ts` ve `src/content/factories/activity-factory.ts` ile üretilir.

## İçerik Ekleme Adımları

1. `src/content/grades/index.ts` dosyasına yeni kazanım tanımı ekle
2. Uygun `topic` tipini seç (counting, addition, geometry, vb.)
3. Fabrika otomatik olarak aktiviteleri üretir
4. `npm run typecheck` çalıştır
5. Uygulamada test et
