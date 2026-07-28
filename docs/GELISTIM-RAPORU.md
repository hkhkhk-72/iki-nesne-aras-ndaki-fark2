# MİNİBİLGE ÖĞRETMEN PLATFORMU

## Gelişim Raporu v1.0

Bu belge, projenin amacını, vizyonunu, mimari kararlarını ve yol haritasını özetler.

---

## 1. Projenin Amacı

MiniBilge Öğretmen; Türkiye'de görev yapan ilkokul öğretmenlerinin eğitim-öğretim yılı boyunca ihtiyaç duyduğu bütün resmî planları, evrakları ve öğretmen dokümanlarını **Türkiye Yüzyılı Maarif Modeli** ve **MEB mevzuatına** uygun şekilde tek platform üzerinden hazırlayabilmesini sağlayan yapay zekâ destekli dijital öğretmen platformudur.

**Temel amaçlar:**
- Öğretmenin zamanını kazanmak
- Evrak hazırlama yükünü azaltmak
- MEB mevzuatına uygun belge üretmek
- Güncel öğretim programlarını tek merkezde toplamak
- Resmî belgeleri standartlaştırmak

---

## 2. Proje Vizyonu

MiniBilge Öğretmen, hazır plan indiren bir sistem değil; **TYMM'yi anlayan, çalışma takvimini yorumlayan ve öğretmenin girdiğine göre kendi planlarını üreten akıllı bir öğretmen platformu** olacaktır.

---

## 3. Temel Tasarım Kararı

> MiniBilge hiçbir zaman internetten bulunan hazır yıllık planları kopyalamayacaktır.

Bunun yerine TYMM, resmî öğretim programları, MEB çalışma takvimi, resmî tatiller, belirli gün ve haftalar ile öğretmen/okul bilgileri birleştirilerek otomatik plan üretilecektir.

---

## 4. Hedef Kitle

Yalnızca ilkokul öğretmenleri, sınıf öğretmenleri ve ilkokul düzeyi branş öğretmenleri. **Öğrenci modülü bulunmaz.**

---

## 5. Ana Menü Yapısı

- Ana Sayfa
- Yıllık Plan
- Günlük Plan
- Okul Evrakları
- Belirli Gün ve Haftalar
- Kulüp Evrakları
- Destek Eğitim
- İYEP
- Egzersiz Planları
- Zümre Evrakları
- Rehberlik Evrakları
- Ölçme ve Değerlendirme
- Hesabım
- Ayarlar

---

## 6. Geliştirilen Motorlar (v1.0)

| Motor | Durum | Dosya |
|-------|-------|-------|
| Takvim Motoru | ✅ Aktif | `assets/js/core/calendar-engine.js` |
| Öğretim Programı Motoru | ✅ 1. Sınıf (3 ders) | `assets/js/core/curriculum-engine.js` |
| Yıllık Plan Motoru | ✅ Aktif | `assets/js/core/annual-plan-engine.js` |
| Günlük Plan Motoru | ✅ Aktif | `assets/js/core/daily-plan-engine.js` |
| Belge Motoru | ✅ 31 şablon | `assets/js/documents.js` |
| Kontrol Motoru | ✅ Aktif | `assets/js/core/validation-engine.js` |

---

## 7. Veri Kaynakları

- `assets/data/calendar-2025-2026.json` — MEB çalışma takvimi
- `assets/data/curriculum/sinif1-turkce.json` — 1. Sınıf Türkçe TYMM verisi
- `assets/data/curriculum/sinif1-matematik.json`
- `assets/data/curriculum/sinif1-hayat-bilgisi.json`

---

## 8. Sonraki Aşamalar

1. 1. Sınıf Türkçe yıllık plan motorunun TYMM verisiyle doğrulanması
2. 2., 3. ve 4. sınıf derslerinin eklenmesi
3. Word/PDF profesyonel çıktı formatları
4. Destek Eğitim ve İYEP plan motorları
5. Gerçek öğretmenlerle kullanılabilirlik testi

---

## 9. Teknik Mimari

```
index.html                    → Öğretmen kontrol paneli (Ana Sayfa)
modules/                      → Plan ve evrak modülleri
documents/                    → Okul Evrakları (Belge Merkezi)
assets/js/core/               → Motorlar (takvim, müfredat, plan, kontrol)
assets/data/                  → Takvim ve öğretim programı verileri
```

Modüler mimari sayesinde aynı motor farklı derslerde yeniden kullanılabilir.
