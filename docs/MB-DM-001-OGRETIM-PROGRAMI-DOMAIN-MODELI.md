# MB-DM-001 — MiniBilge Öğretim Programı Domain Modeli

**Sürüm:** 1.0 (Kavramsal Tasarım)  
**Tarih:** 29 Temmuz 2026  
**Durum:** Anayasal / bağlayıcı çekirdek  
**Kapsam:** Türkiye Yüzyılı Maarif Modeli — İlkokul (1–4)

> Bu doküman bir yazılım notu değildir.  
> MiniBilge’nin **Eğitim İşletim Sistemi (Education Operating System)** anayasasıdır.  
> Tüm akademik motorlar (plan, belge, ölçme, destek, İYEP, kulüp) bu modele uymak zorundadır.

---

## 0. Mimari İlke

```
Önce Domain Model
  → sonra Entity Detayı (MB-DM-002)
    → sonra Fiziksel Veri Tabanı (MB-DB-001)
      → sonra JSON Şeması (MB-JSON-001)
        → sonra Algoritma (MB-ALG-001)
          → sonra Uygulama Entegrasyonu (MB-APP-001)
```

**JSON en son ortaya çıkacak üründür.**  
Veri formatı değil, **veri modeli (domain model)** projenin başarısını belirler.

### Üç katman ayrımı (zorunlu)

| Katman | Ne değildir | Ne’dir |
|--------|-------------|--------|
| **Öğretim Programı** | Plan / belge | TYMM’nin resmi yapısı |
| **Planlama** | Programın kopyası | Program + takvim + okul/öğretmen verisinden üretilen iş nesnesi |
| **Belge** | Planın kendisi | Planın Word/PDF/HTML çıktısı |

```
Program ≠ Plan ≠ Belge
```

---

## 1. Domain’in Amacı

Bu domain modeli, TYMM kapsamındaki **bütün ilkokul derslerini** ortak bir kavramsal model altında temsil eder.

Ortak kullanılan motorlar:

| Kod | Motor |
|-----|--------|
| MB-TPM | Öğretim Programı Motoru |
| MB-YPM | Yıllık Plan Motoru |
| MB-GPM | Günlük Plan Motoru |
| MB-BM | Belge Motoru |
| MB-ÖDM | Ölçme ve Değerlendirme Motoru |
| MB-DEM | Destek Eğitim Motoru |
| MB-İYEP | İYEP Motoru |
| MB-KEM | Kulüp ve Etkinlik Motoru |
| MB-RM | Rehberlik Motoru |
| MB-KM | Kontrol / Doğrulama Motoru |

Tek soru:

> **“1. sınıf Türkçe öğretim programı hangi nesnelerden oluşuyor?”**

Bu soru cevaplanmadan JSON / tablo / ekran tasarlanmaz.

---

## 2. Dört Ana Seviye

```
Eğitim Sistemi          (EducationSystem)
        ↓
Öğretim Programı        (Curriculum + Course + Grade + Theme + Outcome…)
        ↓
Planlama                (PlanningRule + Week + AnnualPlan + DailyPlan…)
        ↓
Belge Üretimi           (Document)
```

---

## 3. MB-TPM v2.0 — On Bilgi Katmanı

Her ders programı aşağıdaki katmanlarla temsil edilir.  
Bunlar “JSON alanları” değil; **anlamsal sorumluluk katmanlarıdır**.

| # | Katman | Domain karşılığı | TYMM karşılığı |
|---|--------|------------------|----------------|
| 1 | Ders Kimliği | `Course` | Ders adı, kod, kademe |
| 2 | Program Kimliği | `Curriculum` | Onaylı program sürümü, yıl, kaynak |
| 3 | Öğrenme Çıktıları | `LearningOutcome` | Öğrenme çıktıları ve kodları |
| 4 | İçerik Çerçevesi | `ContentFrame` | Anahtar kavramlar, konular |
| 5 | Süreç Bileşenleri | `ProcessComponent` | `a)`, `b)`, `c)`… süreç adımları |
| 6 | Ölçme Değerlendirme | `Assessment` + `LearningEvidence` | Öğrenme kanıtları, ölçme araçları |
| 7 | Değerler ve Eğilimler | `Value` + `Tendency` | Erdem–Değer–Eylem + eğilimler |
| 8 | Beceriler | `Skill` (çok türlü) | Alan / Kavramsal / SDÖ / Okuryazarlık |
| 9 | Takvim İlişkileri | `Calendar` + `Week` | MEB çalışma takvimi bağları |
| 10 | Planlama Kuralları | `PlanningRule` | Motorun iş kuralları |

### Katman 8 — Beceri alt türleri

Tek `Skill` varlığı; `skillKind` ile ayrılır:

- `ALAN` — Alan becerileri (ör. TAB, MAB, FBAB, SBAB)
- `KAVRAMSAL` — Kavramsal beceriler (KB…)
- `SOSYAL_DUYGUSAL` — Sosyal-duygusal öğrenme (SDB…)
- `OKURYAZARLIK` — Okuryazarlık becerileri (OB…)

---

## 4. Ana Domain Nesneleri (Entity Kataloğu)

### ENTITY 01 — EducationSystem

**Görev:** TYMM’yi ve MiniBilge’nin üst bağlamını temsil eder.

**İçerir:** eğitim yılı bağlamı, öğretim programları koleksiyonu, çalışma takvimi, ortak kurallar, kademe (ilkokul).

---

### ENTITY 02 — Curriculum

**Görev:** Bir dersin onaylı öğretim programı sürümünü temsil eder.

**Örnek:** İlkokul Türkçe Dersi Öğretim Programı (1–4) 2024.

**Alanlar (kavramsal):** programKimligi, ders, sınıfKapsami, onayYili, kaynakUrl, toplamDersSaatiSinifBazli, uygulamaEsaslari, programAciklamalari.

---

### ENTITY 03 — Grade

**Görev:** Sınıf düzeyi.

**Değerler:** `1 | 2 | 3 | 4` (ilkokul çekirdeği).

---

### ENTITY 04 — Course

**Görev:** Ders kimliği.

**Örnek:** Türkçe, Matematik, Hayat Bilgisi, Fen Bilimleri, Sosyal Bilgiler…

**Alanlar:** dersId, ad, kademe, haftalikDersSaati(grade), genelAmac, ogrenmeAlanlari/temaYapisi (`tema` | `ogrenmeAlani` | `unite`).

> **Not:** TYMM’de bazı dersler *tema*, bazıları *öğrenme alanı*, bazıları *ünite* kullanır.  
> Domain’de üst soyutlama: **`ProgramUnit`** (aşağıda). `Theme` bunun Türkçe/Matematik görünümüdür.

---

### ENTITY 05 — ProgramUnit (Theme / LearningArea / Unit)

**Görev:** Programın dönemsel/içeriksel birimi.

| Ders ailesi | ProgramUnit türü |
|-------------|------------------|
| Türkçe, Matematik | `THEME` |
| Hayat Bilgisi, Sosyal | `LEARNING_AREA` |
| Fen Bilimleri | `UNIT` |

**Alanlar:** unitId, ad, sira, dersSaati, yuzde, ciktiSayisi, sinif, ders, ozet.

**Özel birimler (planlamaya girer):** Hatırlatma Haftası, Pekiştirme Haftası, Okul Temelli Planlama (OTP), Laboratuvar Güvenliği (fen ortaokul).

---

### ENTITY 06 — LearningOutcome  ★ sistemin kalbi

**Görev:** Tek bir öğrenme çıktısını bağımsız nesne olarak tutar.

**Alanlar:**
- `kod` (ör. `T.D.1.2`, `MAT.1.1.1`, `HB.1.1.1`, `FB.3.1.1`, `SB.4.1.1`)
- `aciklama`
- `sinif`, `ders`, `programUnit`
- `onerilenSure` (varsa)
- `bagimliliklar` (önkoşul çıktılar)
- ilişkiler → ContentFrame, ProcessComponent[], Assessment, Skill[], Value[], Tendency[]

---

### ENTITY 07 — ContentFrame

**Görev:** Çıktının / birimin içerik sınırını tanımlar (anahtar kavramlar, konular, genellemeler).

---

### ENTITY 08 — LearningProcess

**Görev:** Öğrenme–öğretme yaşantıları paketi.

**Alt parçalar:**
- Temel Kabuller
- Ön Değerlendirme
- Köprü Kurma
- Öğrenme–Öğretme Uygulamaları
- Öğretmen Yansıtmaları (meta)

---

### ENTITY 09 — ProcessComponent

**Görev:** Öğrenme çıktısının `a)`, `b)`, `c)`, `ç)`… süreç bileşenleri.

Her bileşen ayrı izlenebilir olmalı (ölçme ve günlük plan için kritik).

---

### ENTITY 10 — Assessment

**Görev:** Ölçme–değerlendirme yaklaşımı ve araç önerileri.

---

### ENTITY 11 — LearningEvidence

**Görev:** “Öğrenme kanıtları” — hangi ürün/gözlem çıktıyı kanıtlar.

---

### ENTITY 12 — Skill

**Görev:** Tüm beceriler tek varlıkta; `skillKind` ile ayrılır.

**Alanlar:** skillId, kod (TAB1, KB2.8, SDB2.1, OB4…), ad, skillKind, aciklama.

---

### ENTITY 13 — Value

**Görev:** TYMM değerleri (Erdem–Değer–Eylem çerçevesi).

**Örnek kodlar:** D3 Çalışkanlık, D14 Saygı, D16 Sorumluluk…

---

### ENTITY 14 — Tendency

**Görev:** Eğilimler.

**Örnek:** E1.1 Merak, E3.2 Odaklanma, E3.8 Soru Sorma…

---

### ENTITY 15 — Differentiation

**Görev:** Zenginleştirme / Destekleme uygulamaları (öğretmen planlar; kitapta zorunlu değil).

---

### ENTITY 16 — PlanningRule

**Görev:** MiniBilge’nin zekâsı. Programdan plana geçiş kuralları.

**Örnek kurallar:**
- Tema/ünite bitmeden sıradaki birim başlamaz (işleniş sırası korunur).
- Ara tatil / yarıyıl haftaları otomatik düşülür.
- OTP saatleri zümre kararına ayrılır; otomatik kazanım doldurulmaz.
- Pekiştirme / Hatırlatma haftaları öğrenme çıktısı üretmez, tekrar/pekiştirme üretir.
- Belirli gün/haftalar ilgili temalarla ilişkilendirilebilir.
- 1. sınıf Türkçe’de ses esaslı ilk okuma yazma kuralları uygulanır.
- 1. sınıfta İngilizce yoktur.

---

### ENTITY 17 — Calendar

**Görev:** MEB çalışma takvimi (eğitim yılı).

---

### ENTITY 18 — Week

**Görev:** Takvimden türetilmiş öğretim haftası.

**Alanlar:** haftaNo, baslangic, bitis, tur (`ogretim` | `araTatil` | `yariyil` | `resmi`), belirliGunBaglantilari.

---

### ENTITY 19 — AnnualPlan

**Görev:** Motorun ürettiği **ilk planlama çıktısı**. Program değildir.

Kaynak: Curriculum + Calendar + PlanningRule + okul/öğretmen bağlamı.

---

### ENTITY 20 — DailyPlan

**Görev:** AnnualPlan satırından türetilen günlük/derslik planı.

---

### ENTITY 21 — Document

**Görev:** Word / PDF / HTML evrak. Planın biçimlendirilmiş hali.

---

### ENTITY 22 — SchoolContext / TeacherContext (destek)

**Görev:** Üretim için gerekli okul, sınıf, şube, öğretmen, zümre bilgisi.  
Programın parçası değildir; planlama girişidir.

---

## 5. Domain İlişkileri

```
EducationSystem
├── Curriculum[]
├── Calendar[]
└── PlanningRule[]

Curriculum
├── Course
├── Grade[]
├── ProgramUnit[]          (Theme / LearningArea / Unit)
├── LearningOutcome[]
├── Skill[] (katalog bağları)
├── Value[]
└── Tendency[]

ProgramUnit
└── LearningOutcome[]      (1..n; bazı özel birimlerde 0)

LearningOutcome
├── ContentFrame           (0..1)
├── ProcessComponent[]     (1..n)
├── LearningProcess        (0..1, birim veya çıktı düzeyinde)
├── Assessment             (0..1)
├── LearningEvidence[]
├── Skill[]                (M:N)
├── Value[]                (M:N)
├── Tendency[]             (M:N)
└── Differentiation        (0..1)

Calendar
└── Week[]

Week + LearningOutcome + PlanningRule + SchoolContext
        ↓
   AnnualPlan
        ↓
   DailyPlan
        ↓
   Document
```

### Kritik mimari karar — Many-to-Many

Öğrenme çıktısı **yalnızca bir programa birimine** (tema/alan/ünite) aittir (1:N),  
ancak **beceri / değer / eğilim** ile ilişkisi **çoktan çoğa (M:N)**’dır.

- Bir çıktı → birden fazla beceriye bağlanabilir  
- Aynı beceri → onlarca çıktıda yeniden kullanılır  
- Bir değer → birçok çıktıyla ilişkilendirilebilir  
- Süreç bileşeni şablonu farklı derslerde yeniden kullanılabilir  

Bu karar veri tekrarını azaltır ve mevzuat güncellemesini sürdürülebilir kılar.

---

## 6. TYMM Program Yapısı → Domain Eşlemesi

Resmi program bloğu (Ortak Metin / ders programları) ile entity eşlemesi:

| TYMM bloğu | Entity |
|------------|--------|
| Ders Saati | `ProgramUnit.dersSaati` / `Course.haftalikDersSaati` |
| Alan Becerileri | `Skill` (`ALAN`) |
| Kavramsal Beceriler | `Skill` (`KAVRAMSAL`) |
| Eğilimler | `Tendency` |
| Programlar Arası Bileşenler | `Skill` (SDÖ, Okuryazarlık) + `Value` |
| Disiplinler Arası İlişkiler | `Curriculum` / `ProgramUnit` ilişkisel alan |
| Öğrenme Çıktıları ve Süreç Bileşenleri | `LearningOutcome` + `ProcessComponent` |
| İçerik Çerçevesi | `ContentFrame` |
| Öğrenme Kanıtları | `LearningEvidence` + `Assessment` |
| Öğrenme–Öğretme Yaşantıları | `LearningProcess` |
| Farklılaştırma | `Differentiation` |
| Öğretmen Yansıtmaları | `LearningProcess` meta alanı |

---

## 7. Kodlama Sözleşmeleri (kimlik)

| Aile | Örnek | Anlam |
|------|-------|--------|
| Türkçe | `T.D.1.2` | Ders.BeceriAlani.Sınıf.ÇıktıNo |
| Matematik | `MAT.1.1.1` | Ders.Sınıf.Tema/Alan.Çıktı |
| Hayat Bilgisi | `HB.1.1.1` | Ders.Sınıf.Alan.Çıktı |
| Fen | `FB.3.1.1` | Ders.Sınıf.Ünite.Çıktı |
| Sosyal | `SB.4.1.1` | Ders.Sınıf.Alan.Çıktı |
| Değer | `D14` | Değer kataloğu |
| Eğilim | `E1.1` | Eğilim kataloğu |
| SDÖ | `SDB2.1` | Sosyal-duygusal |
| Okuryazarlık | `OB4` | Okuryazarlık |

Tam sözlük **MB-DM-002**’de sabitlenecektir.

---

## 8. Planlama Akışı (makine tarafından işlenebilir)

```
Program
  → ProgramUnit (Tema/Alan/Ünite)
    → LearningOutcome
      → ContentFrame
      → ProcessComponent
      → Skill / Value / Tendency
      → Assessment / LearningEvidence
        → PlanningRule + Calendar.Week
          → AnnualPlan
            → DailyPlan
              → Document
```

Yıllık plan, günlük plan, tema planı, ölçme aracı, öğretmen rehberi, kulüp ve destek planları  
**aynı çekirdekten** türetilir. MiniBilge’yi farklı kılan nokta budur.

---

## 9. Bilinçli Dışı Bırakılanlar (şimdilik)

- Öğrenci hesabı / öğrenci ürünü  
- İnternetten kopyalanmış “hazır yıllık plan” içeriği  
- JSON şema alan sırası (MB-JSON-001’e bırakıldı)  
- SQL tablo DDL (MB-DB-001’e bırakıldı)

---

## 10. Yol Haritası (bağlayıcı sıra)

| Kod | Doküman / İş | Durum |
|-----|--------------|-------|
| **MB-DM-001** | Domain Model (bu doküman) | ✅ v1.0 |
| **MB-DM-002** | Entity Detay Spesifikasyonu (alanlar, ID, iş kuralları, validasyon) | ⏳ sıradaki |
| **MB-TPM-001** | 1. Sınıf Türkçe — domain uygulaması (örnek doldurma) | ⏳ |
| **MB-DB-001** | Fiziksel veri tabanı tasarımı | ⏳ |
| **MB-JSON-001** | Makine tarafından işlenebilir JSON şeması | ⏳ |
| **MB-ALG-001** | Yıllık plan üretim algoritması | ⏳ |
| **MB-APP-001** | MiniBilge Öğretmen uygulaması entegrasyonu | ⏳ |

### Mevcut `assets/data/curriculum/*.json` dosyaları

Bunlar **geçici keşif / ön-veri** kabul edilir.  
MB-JSON-001 onaylanana kadar kanonik şema sayılmaz; domain’e uymayan alanlar tasfiye veya migrasyon ile düzeltilecektir.

---

## 11. MB-DM-002’ye Geçiş Kriterleri

MB-DM-002 her varlık için şunları tanımlayacaktır:

1. İş amacı ve sorumluluğu  
2. Zorunlu alanlar  
3. İsteğe bağlı alanlar  
4. Benzersiz kimlik yapısı  
5. İlişkili varlıklar  
6. İş kuralları  
7. Doğrulama kuralları  
8. Gelecekte genişletilebilecek alanlar  

DM-002 tamamlandığında fiziksel DB tasarımı neredeyse mekanik hale gelir.

---

## 12. Karar Özeti

1. MiniBilge bir belge indirme sitesi değil; **Öğretim Programı İşletim Sistemi**’dir.  
2. Çekirdek nesne **LearningOutcome**’dur.  
3. Beceri / değer / eğilim ilişkileri **M:N**’dir.  
4. Tema / öğrenme alanı / ünite tek soyutlamada birleşir: **ProgramUnit**.  
5. Program, plan ve belge katmanları asla karıştırılmaz.  
6. JSON ve DB, domain’den türetilir; tersi yapılmaz.

---

*Kaynak dayanak:* MEB TYMM Ortak Metin + İlkokul Türkçe / Matematik / Hayat Bilgisi / Fen / Sosyal onaylı programlar (`docs/TYMM-OKUMA-NOTLARI.md`).  
*İlişkili strateji:* `docs/STRATEJI-RAPORU.md`
