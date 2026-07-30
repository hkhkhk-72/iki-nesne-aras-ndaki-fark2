# MB-ARCH-001 — MiniBilge Öğretmen Platformu  
# Mimari ve Ana Ekran Tasarım Raporu

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Architecture Freeze (menü v2 için bkz. MB-UI-001)  
**Bağımlılık:** `MB-DM-001` (Domain Model) tamamlanmış kabul edilir  
**Güncelleme:** Menü ve dashboard düzeni **MB-UI-001 v2.0** ile genişletildi; görsel dil **MB-DS-001**.  
**Ana ekran IA:** **MB-UI-002** (sınıf odaklı hub) UI-001 ana sayfa ilkesinin yerini alır.  
**Bileşen fazı:** **FAZ 6 / MD-025** — `docs/FAZ-6-COMPONENT-ARCHITECTURE.md`. Flutter mimarisi **MB-ARCH-002** olarak planlanır (bu belge web freeze’tir).

> Domain kuralları (`Program ≠ Plan ≠ Belge`) bozulamaz.  
> **En üst standart:** `docs/MB-AOS-001-ACADEMIC-OPERATING-SYSTEM.md` (MD-048 Academic Kernel).  
> Sol menü için güncel freeze: `docs/MB-UI-001-UI-UX-MIMARISI-V2.md`.

---

## 1. Platformun Amacı

MiniBilge Öğretmen; Türkiye’deki ilkokul öğretmenlerinin eğitim-öğretim yılı boyunca ihtiyaç duyduğu tüm resmî evrakları, planları ve öğretim süreçlerini tek merkezden yöneten yapay zekâ destekli dijital öğretmen asistanıdır.

Esas alınan kaynaklar:

- Türkiye Yüzyılı Maarif Modeli  
- MEB Öğretim Programları  
- Okul Öncesi ve İlköğretim Kurumları Yönetmeliği  
- Güncel resmî mevzuat  

---

## 2. Temel Felsefe

| Değil | Olması gereken |
|-------|----------------|
| Evrak hazırlayan uygulama | Öğretmenin eğitim süreçlerini yöneten **Eğitim İşletim Sistemi** |

Amaçlar:

- öğretmenin zamanını azaltmak  
- evrak yükünü ortadan kaldırmak  
- hataları önlemek  
- mevzuata uygun belge üretmek  
- yapay zekâ ile rehberlik etmek  

Ürün sloganı (strateji ile aynı):

> *“Önce Güvenilir Bilgi Motoru, Sonra Akıllı Algoritma, En Son Arayüz.”*

---

## 3. Ürün Bilgi Mimarisi (Freeze Menü)

```
MiniBilge Öğretmen
├── Ana Sayfa
├── Yıllık Plan
├── Günlük Plan
├── Evrak Merkezi
├── Öğretim Programı
├── Takvim
├── Hesabım
└── Ayarlar
```

Bu 8 madde **sol menünün tek üst seviyesidir**.  
Zümre, kulüp, İYEP, rehberlik vb. ayrı menü satırı değildir; **Evrak Merkezi** altındadır.

| Menü | Route (hedef) | Domain katmanı |
|------|---------------|----------------|
| Ana Sayfa | `index.html` | Kontrol paneli |
| Yıllık Plan | `modules/yillik-plan.html` | Planlama → `AnnualPlan` |
| Günlük Plan | `modules/gunluk-plan.html` | Planlama → `DailyPlan` |
| Evrak Merkezi | `documents/index.html` | Belge → `Document` |
| Öğretim Programı | `modules/ogretim-programi.html` | Program → `Curriculum` |
| Takvim | `modules/takvim.html` | `Calendar` + `Week` |
| Hesabım | `modules/hesabim.html` | `TeacherContext` / `SchoolContext` |
| Ayarlar | `modules/ayarlar.html` | Uygulama tercihleri |

---

## 4. Ana Sayfa — Kontrol Merkezi

Öğretmen girişinde ilk ekran. Yedi bileşen (sıra sabittir):

### 4.1 Bugünkü Dersler
Günlük ders programı. Her satırda **Günlük Planı Aç**.

### 4.2 Bugünkü Görevler
Örn. günlük plan, yoklama, veli, kulüp, rehberlik, belirli gün hazırlığı.

### 4.3 Yaklaşan Tarihler
Takvim motorundan: resmi günler, ara tatil, karne, veli/zümre toplantısı.

### 4.4 Son Çalışmalar
Son üretilen yıllık / günlük / kulüp / destek / İYEP planları — tek tık.

### 4.5 Hızlı İşlemler
- Yeni Günlük Plan  
- Yeni Yıllık Plan  
- Yeni Evrak  
- Belgelerim  

### 4.6 Akıllı Uyarılar
AI / kural motoru uyarıları (eksik plan, rehberlik haftası, güncelleme ihtiyacı).

### 4.7 Yapay Zekâ Asistanı
Kalıcı giriş (doğal dil → plan/belge üretim komutu).  
*Not: Asistan, domain ve motorlar hazır olmadan “sihirli belge üretici” gibi davranamaz; önce TPM + kurallar.*

---

## 5. Modül İçerikleri (Freeze)

### 5.1 Yıllık Plan
Sınıf → Ders seçimi sonrası üretim. Ders listesi örnekleri:

Türkçe, Matematik, Hayat Bilgisi, Fen, Sosyal (4), Yabancı Dil/İngilizce (2+), Görsel Sanatlar, Müzik, Oyun ve Fiziki Etkinlikler (Beden Eğitimi ve Oyun), Din Kültürü / İHVD / Trafik (4; program kapsamına göre).

Akış: **Sınıf → Ders → Bilgiler → Üret** (değişmez).

### 5.2 Günlük Plan
Bugünkü dersler · Hazırla · Düzenle · PDF · Word · Yazdır.

### 5.3 Evrak Merkezi (en geniş yüzey)

| Alt grup | İçerik |
|----------|--------|
| Planlar | Yıllık, günlük, ünite/tema, rehberlik, kulüp, destek, İYEP, egzersiz |
| Zümre | Sene başı, ara dönem, sene sonu, okul zümresi |
| Rehberlik | BEP, RAM, gözlem, risk takip, görüşme |
| Kulüpler | İlkokul kulüp evrakları |
| Belirli Gün ve Haftalar | Program, konuşma, şiir, sunucu metni |
| Ölçme Değerlendirme | Rubrik, kontrol listesi, gözlem, performans |
| Veli | Toplantı, izin, görüşme |
| Okul | Nöbet, sınıf listesi, oturma planı, kitaplık, dosyalar |

### 5.4 Öğretim Programı (kalp ekran)
TYMM gezgini: sınıf → ders → program birimi → öğrenme çıktısı → beceri / değer / eğilim / içerik / süreç / ölçme.  
Veri kaynağı: MB-DM-001 entity’leri (JSON keşif dosyaları değil, kanonik model).

### 5.5 Takvim
Resmî tatiller, belirli günler, ders haftaları, zümre, rehberlik, kulüp, ölçme, veli — otomatik.

### 5.6 Hesabım
Profil, okul, branş, okutulan sınıf, ders programı, PDF ayarları.

### 5.7 Ayarlar
Tema, yazdırma, imza, müdür, okul logosu, AI, bildirimler.

---

## 6. Arka Plan Motorları (Freeze Kataloğu)

Kullanıcı motorları görmez. Domain ile hizalı kodlar:

| Kod | Motor | Domain bağı |
|-----|--------|-------------|
| **MB-TPM** | Öğretim Programı Motoru | `Curriculum`, `LearningOutcome`, `ProgramUnit` |
| **MB-TKM** | Akademik Takvim Motoru | `Calendar`, `Week` |
| **MB-YPM** | Yıllık Plan Motoru | `AnnualPlan`, `PlanningRule` |
| **MB-GPM** | Günlük Plan Motoru | `DailyPlan` |
| **MB-CEM** | Beceri Motoru | `Skill` (ALAN / KAVRAMSAL / SDÖ / OKURYAZARLIK) |
| **MB-CDE** | Karakter Gelişim Motoru | `Value`, `Tendency` |
| **MB-AIE** | Ölçme Zekâ Motoru | `Assessment`, `LearningEvidence` |
| **MB-DEM** | Destek Eğitim Motoru | Destek planı + Outcome bağları |
| **MB-İYEP** | İYEP Motoru | İYEP planı |
| **MB-BM** | Belge Motoru | `Document` |
| **MB-AI** | Yapay Zekâ Asistanı | Tüm motorlara komut katmanı |
| **MB-KM** | Kontrol / Doğrulama | Validasyon (DM + plan kuralları) |

> Eski “4 ana motor” anlatımı geçerliliğini korur (TPM + TKM + Plan + BM);  
> yukarıdaki liste bunların **uzmanlaşmış alt motorlara** ayrılmış halidir.

---

## 7. Tasarım İlkeleri

1. **Resmî Uyum** — TYMM + MEB mevzuatı  
2. **Tek Veri Kaynağı (SSOT)** — Program bir kez; plan ve belge ondan türetilir  
3. **Yapay Zekâ Destekli** — Doğal dil komutları motorları tetikler; uydurma içerik üretmez  
4. **Minimum Tıklama** — Sık işlemler 2–3 adım  
5. **Otomatik Güncelleme** — Program/takvim değişince planlar yenilenebilir  
6. **Belge Üretimi** — Word, PDF, yazdırılabilir çıktı  

---

## 8. Domain ↔ UI Sözleşmesi

```
Öğretim Programı ekranı  →  Curriculum (okuma)
Yıllık / Günlük Plan     →  Planlama katmanı (üretim)
Evrak Merkezi            →  Document (biçimlendirme)
Takvim                   →  Calendar / Week
Ana Sayfa                →  tüm katmanların özeti + görevler
```

AI asistanı **asla** domain’i baypas ederek internetten “hazır plan” kopyalamaz.

---

## 9. Uygulama Durumu (Freeze anı)

| Bileşen | Durum |
|---------|--------|
| MB-DM-001 Domain Model | ✅ Freeze |
| MB-ARCH-001 Bu doküman | ✅ Freeze |
| Sol menü 8 madde | ✅ Hedef IA (uygulama hizalanır) |
| Ana sayfa 7 bileşen | ⏳ İskelet var; freeze bileşenlere çekilecek |
| Öğretim Programı ekranı | ⏳ Yeni |
| Takvim ekranı | ⏳ Yeni (motor kısmen var) |
| Evrak Merkezi alt grupları | ⏳ Envanter üzerinden |
| MB-DM-002 Entity detay | ✅ `docs/MB-DM-002-ENTITY-DETAY-SPESIFIKASYONU.md` |
| MB-TPM-001 1. sınıf Türkçe uygulama | ✅ `docs/MB-TPM-001-SINIF1-TURKCE-DOMAIN-UYGULAMASI.md` |
| MB-DB-001 Fiziksel DB | ⏳ Sıradaki domain işi |

---

## 10. Stratejik Değerlendirme

Bu mimariyle MiniBilge; yalnızca yıllık plan üreten bir araç değil —  
**ilkokul öğretmeninin eğitim yılı boyunca kullandığı planları, resmî evrakları ve öğretim süreçlerini tek merkezden yöneten, TYMM ile bütünleşik, yapay zekâ destekli dijital öğretmen işletim sistemi** olacaktır.

Uzun vadede e-Okul / MEBBİS entegrasyonu için ölçeklenebilir temel:  
önce domain (DM), sonra UI freeze (ARCH), sonra motor ve şema.

---

## 11. Değişiklik Kontrolü

Bu dokümanda menü, ana sayfa bileşenleri veya motor kataloğu değişecekse:

1. Sürüm numarası artar (1.1…)  
2. `MB-DM-001` ile çelişki kontrol edilir  
3. Navigasyon ve ekran iskeletleri aynı PR’da güncellenir  

---

*İlişkili:* `docs/MB-DM-001-OGRETIM-PROGRAMI-DOMAIN-MODELI.md` · `docs/STRATEJI-RAPORU.md`
