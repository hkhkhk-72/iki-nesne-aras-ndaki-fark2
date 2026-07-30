# MB-VIS-001 — Ürün Vizyonu (Öğretmen Akademik Yaşamı)

**Sürüm:** 1.0  
**Tarih:** 30 Temmuz 2026  
**Durum:** Bağlayıcı ürün amacı  
**Üst:** MB-AOS-001 · MB-DOS-000 · MB-DM-001  

> MiniBilge; belge veya plan uygulaması değildir.  
> Öğretmenin **eğitim-öğretim hayatı boyunca** lazım olacak bütün belgeleri  
> **MEB güncel verileri** ve **Türkiye Yüzyılı Maarif Modeli**ne göre  
> **eksiksiz ve hatasız** üreten Academic Operating System’dir.

---

## 1. Ortak amaç

1. Tüm resmî / pedagojik belgeler TYMM + MEB çizelge/programına uygun üretilir.  
2. Yapay zekâ bölümünde öğretmen merak ettiği her şeyi sorabilir; ihtiyaçları karşılanır (Context Aware AI).  
3. Hazır ürünlerden **daha faydalı**, yeni yüzyıla uygun, **her yıl** eğitim-öğretime göre güncellenir.  
4. Hard-coded şablon kopyası yok — motorlar + DNA + kaynak registry.

---

## 2. Ders + kaynak seçimi (zorunlu)

Aynı ders için Milli Eğitim’in **birden fazla kaynağı** olabilir (TYMM PDF, domain pack, TTKB çizelge, sonraki onay yılı…).

**Akış:**

```
Ders seç → Tüm MEB/TYMM kaynaklarını göster → Kaynağı seç → Plan motoru çalışır
```

| Dosya | Rol |
|-------|-----|
| `assets/data/curriculum/sources.json` | Kaynak kataloğu |
| `CurriculumEngine.listSourcesForDers` | Kaynak listesi |
| `CurriculumEngine.loadCurriculum(ders, sinif, { kaynakId })` | Seçili kaynaktan yükle |
| Yıllık / günlük plan UI | Ders + kaynak seçici |

Yıllık planda seçilen `kaynakId` plana yazılır; günlük plan bu kaynaktan beslenir.

---

## 3. Yıllık güncelleme

Her eğitim-öğretim yılında:

- Takvim JSON  
- `sources.json` (yeni onaylı programlar)  
- Document DNA / Official Lock  

güncellenir. Eski kaynaklar `ARCHIVED` kalır; öğretmen bilinçli seçer.

---

## 4. AI

TXS-005 / AI Kernel: her ekranda bağlamı bilir (öğretmen, sınıf, ders, belge, amaç).  
Merak / destek / kontrol soruları AI asistanında karşılanır.

---

*Bu vizyon AOS anayasasının ürün dilidir; teknik katman MB-AOS-001’dedir.*
