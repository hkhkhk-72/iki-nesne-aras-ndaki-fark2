# MB-UI-001 — MiniBilge Öğretmen UI/UX Mimarisi

**Sürüm:** 2.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Ürün bilgi mimarisi freeze (menü + ekran amaçları)  
**Üst bağımlılık:** `MB-DM-001`, `MB-ARCH-001`  
**Görsel dil:** `MB-DS-001`

> ARCH-001 menü (8 madde) bu sürümle **10 maddelik öğretmen düşünme sırasına** güncellenir.  
> Domain kuralı değişmez: **Program ≠ Plan ≠ Belge**.

---

## 1. Ana Menü (Freeze v2)

Öğretmen düşünme sırası: program → plan → evrak.

```
Ana Sayfa
Öğretim Programı
Yıllık Planlar
Günlük Planlar
Evrak Merkezi
Akademik Takvim
MiniBilge AI
Raporlar
Hesabım
Ayarlar
```

| # | Menü | Route | Amaç |
|---|------|-------|------|
| 1 | Ana Sayfa | `index.html` | “Bugün ne yapacağım?” |
| 2 | Öğretim Programı | `modules/ogretim-programi.html` | Müfredat tarayıcısı |
| 3 | Yıllık Planlar | `modules/yillik-plan.html` | Yıllık üretim |
| 4 | Günlük Planlar | `modules/gunluk-plan.html` | Ders programına bağlı günlük |
| 5 | Evrak Merkezi | `documents/index.html` | 250–300 belge yüzeyi |
| 6 | Akademik Takvim | `modules/takvim.html` | MB-TKM yüzeyi |
| 7 | MiniBilge AI | `modules/ai.html` | Doğal dil komut yüzeyi |
| 8 | Raporlar | `modules/raporlar.html` | İlerleme / kapsama |
| 9 | Hesabım | `modules/hesabim.html` | Bağlam |
| 10 | Ayarlar | `modules/ayarlar.html` | Tercihler |

---

## 2. Ana Sayfa — Dashboard İlkesi

**Klasik kart ızgarası yok.**  
Öğretmen açılışta tek kompozisyonda bugünü görür.

Bileşen sırası (sabit):

1. Selamlama (ad + gün/tarih) — marka görünür  
2. Bugünkü Dersler (ders programı şeridi + “Oluştur”)  
3. Bugünkü Görevler (TWE kontrol listesi)  
4. Yaklaşan İşler (takvimden)  
5. Son Belgeler  

Soru: *“Bugün ne yapacağım?”* — cevap bu ekranda.

---

## 3. Öğretim Programı — Müfredat Tarayıcısı

PDF görüntüleyici değil; domain gezgini:

```
Sınıf → Ders → ProgramUnit → LearningOutcome
         → İçerik → Beceriler → Değerler → Eğilimler → Ölçme
```

---

## 4. Yıllık Plan

- **Üst:** Okul, il, ilçe, sınıf, şube, öğretmen, ders, yıl  
- **Orta:** Takvim / haftalar / tatiller / belirli günler (otomatik)  
- **Alt:** Üretilen plan  
- **Yan:** AI önerileri  

Akış: **Sınıf → Ders → Bilgiler → Üret**

---

## 5. Günlük Plan

Ders programına bağlı:

```
Perşembe
08:30 Türkçe  → Oluştur
09:10 Matematik → Oluştur
```

Plan gövdesi:

```
Ders → Öğrenme Çıktısı → Etkinlik → Materyal
     → Farklılaştırma → Ölçme → PDF/Word
```

---

## 6. Evrak Merkezi

Hedef envanter: **~250–300 belge** (kademeli).

Alt gruplar: Planlar · Zümre · Rehberlik · Kulüpler · Belirli Gün · Ölçme · Veli · Okul.

Kulüpler (ör.): Çevre, Kızılay, Yeşilay, Değerler, Bilim, Kültür-Sanat, Spor, Satranç, Zekâ Oyunları, Trafik.

Belirli gün: program, sunucu/müdür/öğretmen metni, şiir, oratoryo, koro, pano, afiş, davetiye.

---

## 7. Akademik Takvim

Sistemi besleyen yüzey: dönemler, tatiller, belirli günler, zümre, veli, rehberlik, kulüp.

---

## 8. MiniBilge AI

Doğal dil → motor tetikleme (uydurma plan yok; domain + şablon).

Örnek komutlar: yıllık/günlük plan, 29 Ekim programı, kulüp raporu, BEP tutanağı, zümre.

---

## 9. Raporlar

- İşlenen öğrenme çıktıları  
- Ders ilerleme  
- Beceri / değer / eğilim kapsama  
- Plan tamamlama  
- Evrak sayısı  
- Yaklaşan resmî işlemler  

---

## 10. MB-TWE — Teacher Workflow Engine

**Kod:** MB-TWE  
**Görev:** Öğretmenin günlük iş akışını yönetir; hangi belgenin ne zaman gerektiğini sistem söyler.

```
Ders Programı
  → Bugünkü Dersler
    → Günlük Plan Oluştur
      → Dersi İşle
        → Ölçme ve Değerlendirme
          → Destek Eğitim / İYEP (gerekirse)
            → Resmî Evrakları Güncelle
              → Günün Tamamlandı
```

Ana sayfa görev listesi bu motorun görünür yüzüdür.

---

## 11. Sonraki

1. **MB-DS-001** — Tasarım Sistemi (renk, tipografi, bileşen)  
2. Ana sayfa + menü v2 uygulaması  
3. Müfredat tarayıcısı iskeleti  
4. TWE görev kurallarının kodlanması  

---

*Kaynak sentez: öğretmen iş akışı + ChatGPT UI/UX v2 raporu + MB-DM-001*
