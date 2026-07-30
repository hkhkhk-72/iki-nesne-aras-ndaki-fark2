# MB-DM-002 — Entity Detay Spesifikasyonu

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı (DM-001 üzerine)  
**Kapsam:** Türkiye Yüzyılı Maarif Modeli — İlkokul (1–4)  
**Üst belge:** `docs/MB-DM-001-OGRETIM-PROGRAMI-DOMAIN-MODELI.md`

> Bu doküman JSON şeması veya SQL DDL değildir.  
> Her domain varlığının **alanları, kimliği, ilişkileri, iş ve doğrulama kurallarını** sabitler.  
> MB-DB-001 ve MB-JSON-001 buradan türetilir.

---

## 0. Okuma Kuralları

Her varlık için zorunlu başlıklar (DM-001 §11):

1. İş amacı ve sorumluluğu  
2. Zorunlu alanlar  
3. İsteğe bağlı alanlar  
4. Benzersiz kimlik yapısı  
5. İlişkili varlıklar  
6. İş kuralları  
7. Doğrulama kuralları  
8. Gelecekte genişletilebilecek alanlar  

### Notasyon

| Sembol | Anlam |
|--------|--------|
| `PK` | Birincil kimlik |
| `UK` | Benzersiz kısıt |
| `FK` | Başka varlığa referans |
| `1` / `0..1` / `1..n` / `0..n` | Kardinalite |
| `M:N` | Çoktan çoğa (ara tablo gerekir) |
| `enum` | Kapalı değer kümesi |

### Katman ayrımı (asla karışmaz)

```
Program  ≠  Plan  ≠  Belge
Curriculum / LearningOutcome  ≠  AnnualPlan / DailyPlan  ≠  Document
```

### Alan tipi sözlüğü

| Tip | Açıklama |
|-----|----------|
| `string` | Kısa metin |
| `text` | Uzun açıklama |
| `int` | Tam sayı |
| `decimal` | Ondalık (yüzde, saat) |
| `bool` | Mantıksal |
| `date` | ISO `YYYY-MM-DD` |
| `year` | Eğitim/onay yılı (`2024`, `2025-2026`) |
| `uri` | Kaynak URL |
| `enum` | Aşağıdaki ortak enum’lar |
| `id` | Stabil kimlik dizesi |
| `ref` | Başka entity `id` |

---

## 1. Ortak Enum’lar

| Enum | Değerler |
|------|----------|
| `Kademe` | `ILKOKUL` \| `ORTAOKUL` \| `ORTAOGRETIM` *(çekirdek: ILKOKUL)* |
| `Sinif` | `1` \| `2` \| `3` \| `4` |
| `ProgramUnitKind` | `THEME` \| `LEARNING_AREA` \| `UNIT` \| `SPECIAL` |
| `SpecialUnitKind` | `HATIRLATMA` \| `PEKISTIRME` \| `OTP` \| `LAB_GUVENLIGI` \| `DIGER` |
| `SkillKind` | `ALAN` \| `KAVRAMSAL` \| `SOSYAL_DUYGUSAL` \| `OKURYAZARLIK` |
| `WeekKind` | `OGRETIM` \| `ARA_TATIL` \| `YARIYIL` \| `RESMI` \| `IDARI` |
| `CourseKind` | `PROGRAM` \| `SCHEDULE_ONLY` |
| `CourseStructure` | `tema` \| `ogrenmeAlani` \| `unite` |
| `PlanStatus` | `DRAFT` \| `READY` \| `APPROVED` \| `ARCHIVED` |
| `DocumentFormat` | `HTML` \| `PDF` \| `DOCX` |
| `DocumentKind` | `YILLIK_PLAN` \| `GUNLUK_PLAN` \| `TEMA_PLANI` \| `OLCME` \| `EVRAK` \| `DIGER` |
| `EvidenceKind` | `URUN` \| `GOZLEM` \| `PERFORMANS` \| `SOZLU` \| `YAZILI` \| `DIGER` |
| `DiffKind` | `DESTEK` \| `ZENGINLESTIRME` \| `HER_IKISI` |
| `OutcomeCodeFamily` | `T` \| `MAT` \| `HB` \| `FB` \| `SB` \| `ING` \| `DKAB` \| `GS` \| `MUZ` \| `BEO` \| `IHVD` \| `TG` \| `DIGER` |

---

## 2. Kimlik (ID) Sözleşmesi

### 2.1 Genel biçim

| Varlık | `id` biçimi | Örnek |
|--------|-------------|--------|
| EducationSystem | `edu:{kademe}` | `edu:ilkokul` |
| Curriculum | `cur:{dersId}:{onayYili}` | `cur:turkce:2024` |
| Course | `course:{dersId}` | `course:turkce` |
| Grade | `grade:{n}` | `grade:1` |
| ProgramUnit | `pu:{dersId}:{sinif}:{kindShort}:{sira}` | `pu:turkce:1:th:02` |
| LearningOutcome | **resmi kod** (aşağıdaki aileler) | `T.D.1.2` |
| ContentFrame | `cf:{outcomeId}` | `cf:T.D.1.2` |
| ProcessComponent | `pc:{outcomeId}:{harf}` | `pc:T.D.1.2:a` |
| LearningProcess | `lp:{puId}` veya `lp:{outcomeId}` | `lp:pu:turkce:1:th:02` |
| Assessment | `as:{outcomeId}` | `as:T.D.1.2` |
| LearningEvidence | `le:{outcomeId}:{n}` | `le:T.D.1.2:01` |
| Skill | `sk:{kod}` | `sk:TAB1` |
| Value | `val:{kod}` | `val:D14` |
| Tendency | `ten:{kod}` | `ten:E1.1` |
| Differentiation | `df:{outcomeId}` | `df:T.D.1.2` |
| PlanningRule | `rule:{slug}` | `rule:no-skip-unit` |
| Calendar | `cal:{egitimYili}` | `cal:2025-2026` |
| Week | `week:{egitimYili}:{haftaNo}` | `week:2025-2026:12` |
| AnnualPlan | `ap:{teacherId}:{sinif}:{sube}:{dersId}:{egitimYili}` | `ap:t1:1:A:turkce:2025-2026` |
| DailyPlan | `dp:{annualPlanId}:{haftaNo}:{dersSaatiNo}` | `dp:…:12:1` |
| Document | `doc:{kind}:{sourcePlanId}:{rev}` | `doc:YILLIK_PLAN:ap…:1` |
| SchoolContext | `sch:{okulId}` | `sch:meb-123` |
| TeacherContext | `tch:{teacherId}` | `tch:user-9` |

`dersId` (kanonik, camelCase):  
`turkce` · `matematik` · `hayatBilgisi` · `fen` · `sosyal` · `ingilizce` · `dinKulturu` · `gorselSanatlar` · `muzik` · `bedenEgitimi` · `trafikGuvenligi` · `insanHaklari` · `serbestEtkinlikler`

> `serbestEtkinlikler` → `CourseKind = SCHEDULE_ONLY` (program dersi değildir).

### 2.2 Öğrenme çıktısı kod aileleri (ilkokul)

| Aile | Biçim | Örnek | Not |
|------|-------|-------|-----|
| Türkçe | `T.{alan}.{sinif}.{no}` | `T.D.1.2` | alan: dinleme/okuma/yazma… kısa kod |
| Matematik | `MAT.{sinif}.{tema}.{no}` | `MAT.1.1.1` | |
| Hayat Bilgisi | `HB.{sinif}.{alan}.{no}` | `HB.1.1.1` | |
| Fen | `FB.{sinif}.{unite}.{no}` | `FB.3.1.1` | 3–4 |
| Sosyal | `SB.{sinif}.{alan}.{no}` | `SB.4.1.1` | 4 |
| Değer | `D{n}` | `D14` | katalog |
| Eğilim | `E{grup}.{n}` | `E1.1` | katalog |
| Alan becerisi | ders ailesine göre | `TAB1`, `MAB…`, `FBAB…` | `SkillKind=ALAN` |
| Kavramsal | `KB…` | `KB2.8` | |
| SDÖ | `SDB…` | `SDB2.1` | |
| Okuryazarlık | `OB…` | `OB4` | |

Resmi programdaki kod **aynen** saklanır; MiniBilge uydurma kod üretmez.

### 2.3 M:N ara ilişkiler

| Ara varlık | Uçlar | UK |
|------------|-------|-----|
| `OutcomeSkill` | LearningOutcome ↔ Skill | `(outcomeId, skillId)` |
| `OutcomeValue` | LearningOutcome ↔ Value | `(outcomeId, valueId)` |
| `OutcomeTendency` | LearningOutcome ↔ Tendency | `(outcomeId, tendencyId)` |

---

## 3. Entity Detayları

---

### E01 — EducationSystem

**1. İş amacı:** MiniBilge’nin üst bağlamı; hangi kademe, hangi eğitim yılı seti ve ortak kurallar geçerli.

| # | Alan | Tip | Z/İ | Açıklama |
|---|------|-----|-----|----------|
| 1 | `id` | id | Z | `edu:ilkokul` |
| 2 | `ad` | string | Z | örn. Türkiye Yüzyılı Maarif Modeli — İlkokul |
| 3 | `kademe` | enum Kademe | Z | `ILKOKUL` |
| 4 | `aktifEgitimYili` | year | Z | örn. `2025-2026` |
| 5 | `aciklama` | text | İ | |

**Kimlik:** `id` PK.  
**İlişkiler:** `Curriculum[]` 0..n · `Calendar[]` 0..n · `PlanningRule[]` 0..n · Skill/Value/Tendency **katalogları** 0..n.

**İş kuralları:** Tek aktif ilkokul sistemi varsayılır. Katalog beceriler/değerler/eğilimler sistem düzeyinde paylaşılır.  
**Doğrulama:** `kademe=ILKOKUL`; `aktifEgitimYili` bir `Calendar.egitimYili` ile eşleşmeli.  
**Genişletme:** ortaokul/ortaöğretim kademeleri; çoklu eşzamanlı sistem profili.

---

### E02 — Curriculum

**1. İş amacı:** Bir dersin **onaylı öğretim programı sürümü** (plan değil).

| # | Alan | Tip | Z/İ | Açıklama |
|---|------|-----|-----|----------|
| 1 | `id` | id | Z | `cur:{dersId}:{onayYili}` |
| 2 | `dersId` | ref Course | Z | |
| 3 | `ad` | string | Z | Resmi program adı |
| 4 | `sinifKapsami` | Sinif[] | Z | örn. `[1,2,3,4]` |
| 5 | `onayYili` | year | Z | Program onay yılı |
| 6 | `model` | string | Z | `Türkiye Yüzyılı Maarif Modeli` |
| 7 | `kaynakUrl` | uri | İ | tymm.meb.gov.tr PDF |
| 8 | `kaynakNotu` | text | İ | |
| 9 | `toplamDersSaatiSinifBazli` | map Sinif→int | İ | Yıllık saat (program) |
| 10 | `uygulamaEsaslari` | text | İ | |
| 11 | `programAciklamalari` | text | İ | |
| 12 | `surum` | string | İ | iç sürüm etiketi |
| 13 | `durum` | enum | Z | `ACTIVE` \| `SUPERSEDED` \| `DRAFT` |

**Kimlik:** `id` PK; UK `(dersId, onayYili)`.  
**İlişkiler:** Course 1 · Grade[] (kapsam) · ProgramUnit[] 0..n · LearningOutcome[] 0..n.

**İş kuralları:**  
- Aynı ders için birden fazla sürüm olabilir; planda yalnızca `ACTIVE` kullanılır.  
- `SCHEDULE_ONLY` dersler için Curriculum zorunlu değildir.  

**Doğrulama:** `sinifKapsami` boş olamaz; `dersId` var olmalı; `ACTIVE` başına ders başına en fazla bir kayıt (ilkokul çekirdeği).  
**Genişletme:** dil varyantı, engelli öğrenci uyarlama ekleri, disiplinler arası bağ matrisi.

---

### E03 — Grade

**1. İş amacı:** Sınıf düzeyi sabiti.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z `grade:{n}` |
| 2 | `sinif` | enum Sinif | Z |
| 3 | `ad` | string | Z örn. `1. Sınıf` |

**Kimlik:** `sinif` UK.  
**İlişkiler:** Course.haftalikDersSaati · ProgramUnit · LearningOutcome · SchoolContext şubeleri.

**İş kuralları:** İlkokul çekirdeğinde yalnızca 1–4.  
**Doğrulama:** `sinif ∈ {1,2,3,4}`.  
**Genişletme:** okul öncesi / 5–8 köprü sınıfları.

---

### E04 — Course

**1. İş amacı:** Ders kimliği ve çizelge/program özellikleri.

| # | Alan | Tip | Z/İ | Açıklama |
|---|------|-----|-----|----------|
| 1 | `id` | id | Z | `course:{dersId}` |
| 2 | `dersId` | string | Z | kanonik anahtar |
| 3 | `ad` | string | Z | varsayılan görünen ad |
| 4 | `adBySinif` | map Sinif→string | İ | örn. beden 1/2 çift adı |
| 5 | `kademe` | enum Kademe | Z | |
| 6 | `courseKind` | enum CourseKind | Z | `PROGRAM` / `SCHEDULE_ONLY` |
| 7 | `structure` | enum CourseStructure | İ | tema / alan / ünite |
| 8 | `haftalikDersSaati` | map Sinif→int | Z | TTKB çizelgesi |
| 9 | `sinifKapsami` | Sinif[] | Z | dersin okutulduğu sınıflar |
| 10 | `genelAmac` | text | İ | |
| 11 | `sira` | int | İ | program listesi sırası |

**Kimlik:** `dersId` UK.  
**İlişkiler:** Curriculum 0..n · ProgramUnit[] · Weekly hours (Calendar bağlamında da tutulabilir).

**İş kuralları (ilkokul, TTKB 09.05.2025):**  
- `ingilizce` sınıf 1’de yok (`sinifKapsami` ⊇ {2,3,4}).  
- `hayatBilgisi` 1–3; `fen` 3–4; `sosyal`/`dinKulturu`/`trafikGuvenligi`/`insanHaklari` 4.  
- `serbestEtkinlikler` → `SCHEDULE_ONLY`; yıllık/günlük **program planı** üretilmez.  
- Haftalık toplam (program + schedule_only) sınıf bazında **30**.  

**Doğrulama:** `haftalikDersSaati` değerleri ≥ 0; kapsam dışındaki sınıf için saat yok sayılır veya 0 olmalı; görünen ad boş olamaz.  
**Genişletme:** seçmeli dersler, dil kodu (ING/DE/FR), öğretmen branş eşlemesi.

---

### E05 — ProgramUnit

**1. İş amacı:** Tema / öğrenme alanı / ünite / özel hafta birimi.

| # | Alan | Tip | Z/İ | Açıklama |
|---|------|-----|-----|----------|
| 1 | `id` | id | Z | |
| 2 | `curriculumId` | ref | Z | |
| 3 | `dersId` | ref | Z | |
| 4 | `sinif` | Sinif | Z | |
| 5 | `kind` | ProgramUnitKind | Z | |
| 6 | `specialKind` | SpecialUnitKind | İ | `kind=SPECIAL` ise zorunlu |
| 7 | `ad` | string | Z | resmi ad |
| 8 | `sira` | int | Z | işleniş sırası (1…) |
| 9 | `dersSaati` | int | İ | birim için önerilen saat |
| 10 | `yuzde` | decimal | İ | program yüzdesi |
| 11 | `ciktiSayisi` | int | İ | beklenen çıktı adedi |
| 12 | `ozet` | text | İ | |
| 13 | `planlamayaDahil` | bool | Z | default true; OTP vb. özel kurallı |

**Kimlik:** `id` PK; UK `(curriculumId, sinif, sira)`.  
**İlişkiler:** LearningOutcome[] 0..n · LearningProcess 0..1 · Curriculum 1.

**İş kuralları:**  
- `THEME` → Türkçe/Matematik; `LEARNING_AREA` → HB/Sosyal; `UNIT` → Fen.  
- `SPECIAL` birimlerde LearningOutcome **0** olabilir (Hatırlatma/Pekiştirme/OTP).  
- İşleniş sırası atlanamaz (`PlanningRule`).  

**Doğrulama:** `sira ≥ 1`; `kind` ders `structure` ile uyumlu; `SPECIAL` ise `specialKind` dolu; `ciktiSayisi` varsa Outcome sayısı ile çelişki uyarı üretir (sert hata TPM’de netleşir).  
**Genişletme:** disiplinler arası etiketler; görsel kapak; zümre notu alanı.

---

### E06 — LearningOutcome ★

**1. İş amacı:** Sistemin kalbi — tek öğrenme çıktısı.

| # | Alan | Tip | Z/İ | Açıklama |
|---|------|-----|-----|----------|
| 1 | `id` / `kod` | id | Z | resmi kod (=PK) |
| 2 | `aciklama` | text | Z | |
| 3 | `curriculumId` | ref | Z | |
| 4 | `dersId` | ref | Z | |
| 5 | `sinif` | Sinif | Z | |
| 6 | `programUnitId` | ref | Z | tek birim |
| 7 | `siraInUnit` | int | İ | birim içi sıra |
| 8 | `onerilenSure` | int | İ | ders saati |
| 9 | `codeFamily` | OutcomeCodeFamily | Z | |
| 10 | `bagimliliklar` | ref[] | İ | önkoşul outcome kodları |

**Kimlik:** `kod` PK (global unique).  
**İlişkiler:** ProgramUnit 1 · ContentFrame 0..1 · ProcessComponent[] 1..n *(SPECIAL birim hariç)* · Assessment 0..1 · LearningEvidence[] 0..n · Skill/Value/Tendency M:N · Differentiation 0..1.

**İş kuralları:**  
- Bir outcome **tek** ProgramUnit’a aittir.  
- Kod formatı aile sözleşmesine uyar; uydurma kod yasak.  
- Bagımlılık döngüsü yasak.  

**Doğrulama:** `aciklama` boş olamaz; `sinif` unit.sinif ile aynı; `dersId` unit.dersId ile aynı; `kod` regex aileye göre.  
**Genişletme:** bilişsel düzey etiketi; engelli öğrenci uyarlama bayrağı; ölçme ağırlığı.

---

### E07 — ContentFrame

**1. İş amacı:** İçerik sınırı (anahtar kavramlar, konular, genellemeler).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `outcomeId` | ref | Z UK |
| 3 | `anahtarKavramlar` | string[] | İ |
| 4 | `konular` | string[] | İ |
| 5 | `genellemeler` | text[] | İ |
| 6 | `hamMetin` | text | İ | programdan alınan blok |

**Kimlik:** outcome başına en fazla 1 (`outcomeId` UK).  
**İlişkiler:** LearningOutcome 1.

**İş kuralları:** En az bir içerik alanı (kavram/konu/genelleme/hamMetin) dolu olmalı.  
**Doğrulama:** boş çerçeve kaydı oluşturulamaz.  
**Genişletme:** kavram grafı bağlantıları; sözlük terim ID’leri.

---

### E08 — LearningProcess

**1. İş amacı:** Öğrenme–öğretme yaşantıları paketi (birim veya çıktı düzeyi).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `programUnitId` | ref | İ | biri zorunlu |
| 3 | `outcomeId` | ref | İ | biri zorunlu |
| 4 | `temelKabuller` | text | İ |
| 5 | `onDegerlendirme` | text | İ |
| 6 | `kopruKurma` | text | İ |
| 7 | `uygulamalar` | text | İ | öğrenme–öğretme uygulamaları |
| 8 | `ogretmenYansitmalari` | text | İ | meta |

**Kimlik:** `id` PK.  
**İlişkiler:** ProgramUnit 0..1 · LearningOutcome 0..1.

**İş kuralları:** `programUnitId` veya `outcomeId` en az biri dolu.  
**Doğrulama:** XOR değil; ikisi birden olabilir ama en az biri zorunlu.  
**Genişletme:** süre tahmini; materyal listesi; dijital araç bağları.

---

### E09 — ProcessComponent

**1. İş amacı:** Çıktının `a)`, `b)`, `c)`… izlenebilir süreç adımları.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `outcomeId` | ref | Z |
| 3 | `harf` | string | Z | `a`,`b`,`c`,`ç`,`d`… |
| 4 | `sira` | int | Z | |
| 5 | `aciklama` | text | Z | |
| 6 | `olculebilir` | bool | Z | default true |

**Kimlik:** UK `(outcomeId, harf)`.  
**İlişkiler:** LearningOutcome 1 · DailyPlan adımlarına referans.

**İş kuralları:** Günlük planda bileşenler seçilebilir/işaretlenebilir olmalı.  
**Doğrulama:** `harf` Türkçe alfabetik sıra; `aciklama` boş olamaz; aynı outcome’ta tekrar harf yok.  
**Genişletme:** tahmini süre; zorluk etiketi.

---

### E10 — Assessment

**1. İş amacı:** Ölçme–değerlendirme yaklaşımı / araç önerileri.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `outcomeId` | ref | Z UK |
| 3 | `yaklasim` | text | İ |
| 4 | `aracOnerileri` | string[] | İ |
| 5 | `bicimlendirme` | text | İ | biçimlendirici / seviye belirleyici not |

**Kimlik:** outcome başına 0..1.  
**İlişkiler:** LearningOutcome 1 · LearningEvidence[] 0..n.

**İş kuralları:** Kanıt yoksa bile yaklaşım metni tutulabilir.  
**Doğrulama:** en az bir alan dolu.  
**Genişletme:** rubrik ID; puan ölçeği; e-portfolyo bağları.

---

### E11 — LearningEvidence

**1. İş amacı:** Öğrenme kanıtı (ürün, gözlem, performans…).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `outcomeId` | ref | Z |
| 3 | `kind` | EvidenceKind | Z |
| 4 | `ad` | string | Z |
| 5 | `aciklama` | text | İ |
| 6 | `assessmentId` | ref | İ |

**Kimlik:** `id` PK.  
**İlişkiler:** LearningOutcome 1 · Assessment 0..1.

**İş kuralları:** Günlük planda “kanıt” alanına bağlanabilir.  
**Doğrulama:** `ad` zorunlu.  
**Genişletme:** örnek dosya URI; öğrenci ürün şablonu (öğretmen tarafı).

---

### E12 — Skill

**1. İş amacı:** Paylaşılan beceri kataloğu (`skillKind` ile ayrılır).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `kod` | string | Z UK |
| 3 | `ad` | string | Z |
| 4 | `skillKind` | SkillKind | Z |
| 5 | `aciklama` | text | İ |
| 6 | `dersAilesi` | string | İ | ALAN becerilerinde |

**Kimlik:** `kod` UK.  
**İlişkiler:** LearningOutcome M:N (`OutcomeSkill`).

**İş kuralları:** Katalog tekrarsız; outcome’lar referans verir.  
**Doğrulama:** `skillKind` ile kod öneki tutarlı (ör. SDB* → SOSYAL_DUYGUSAL).  
**Genişletme:** seviye göstergeleri; alt beceri ağacı.

---

### E13 — Value

**1. İş amacı:** Erdem–Değer–Eylem çerçevesi değeri.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `kod` | string | Z UK | `D14` |
| 3 | `ad` | string | Z |
| 4 | `aciklama` | text | İ |

**Kimlik:** `kod` UK.  
**İlişkiler:** LearningOutcome M:N (`OutcomeValue`).  
**İş / doğrulama:** kod `D` + sayı; ad zorunlu.  
**Genişletme:** eylem örnekleri; sınıf düzeyinde vurgu.

---

### E14 — Tendency

**1. İş amacı:** Eğilim kataloğu.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `kod` | string | Z UK | `E1.1` |
| 3 | `ad` | string | Z |
| 4 | `aciklama` | text | İ |
| 5 | `grup` | string | İ | E1, E3… |

**Kimlik:** `kod` UK.  
**İlişkiler:** LearningOutcome M:N (`OutcomeTendency`).  
**Doğrulama:** kod `E{n}.{n}` biçimi.  
**Genişletme:** gözlem rubriği.

---

### E15 — Differentiation

**1. İş amacı:** Destekleme / zenginleştirme (öğretmen planlar).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `outcomeId` | ref | Z UK |
| 3 | `kind` | DiffKind | Z |
| 4 | `destek` | text | İ |
| 5 | `zenginlestirme` | text | İ |

**Kimlik:** outcome başına 0..1.  
**İş kuralları:** Programda zorunlu blok olmayabilir; planda üretilebilir.  
**Doğrulama:** `kind` ile dolu alan uyumu (DESTEK → destek metni vb.).  
**Genişletme:** İYEP / BEP bağlantı noktaları.

---

### E16 — PlanningRule

**1. İş amacı:** Program → plan üretim zekâsı (MiniBilge kuralları).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `slug` | string | Z UK |
| 3 | `ad` | string | Z |
| 4 | `aciklama` | text | Z |
| 5 | `kapsam` | string | İ | ders/sınıf filtresi |
| 6 | `oncelik` | int | Z | düşük sayı önce |
| 7 | `aktif` | bool | Z | |
| 8 | `ifade` | text | İ | makineye yakın kural ifadesi |

**Kimlik:** `slug` UK.  
**İlişkiler:** EducationSystem · AnnualPlan üretim pipeline.

**Çekirdek kural seti (v1 — zorunlu aktif):**

| slug | Kural |
|------|--------|
| `no-skip-unit` | ProgramUnit sırası atlanmaz |
| `drop-holiday-weeks` | Ara tatil / yarıyıl / resmi haftalar öğretim haftası değildir |
| `otp-no-auto-outcome` | OTP saatlerine otomatik kazanım doldurulmaz |
| `special-no-new-outcome` | Hatırlatma/Pekiştirme yeni outcome üretmez |
| `belirli-gun-link` | Belirli gün/haftalar ilgili birimlerle ilişkilendirilebilir |
| `no-english-grade1` | 1. sınıfta İngilizce yok |
| `grade1-turkce-ses` | 1. sınıf Türkçe ses esaslı ilk okuma-yazma kuralları |
| `weekly-hours-30` | Sınıf haftalık toplam 30 saat (TTKB) |
| `schedule-only-no-annual` | SCHEDULE_ONLY derslerden AnnualPlan üretilmez |

**Doğrulama:** `oncelik ≥ 0`; `slug` kebab-case.  
**Genişletme:** kural DSL; okul türü istisnaları; öğretmen override bayrağı (denetimli).

---

### E17 — Calendar

**1. İş amacı:** MEB çalışma takvimi (eğitim yılı).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `egitimYili` | year | Z UK |
| 3 | `kaynak` | string | İ |
| 4 | `donemler` | object[] | Z | `{ad, baslangic, bitis}` |
| 5 | `tatiller` | object[] | Z | `{ad, baslangic, bitis, tur}` |
| 6 | `belirliGunler` | object[] | İ | gün/hafta etkinlikleri |
| 7 | `haftalikDersSaati` | map Sinif→(dersId→int) | Z | TTKB |

**Kimlik:** `egitimYili` UK.  
**İlişkiler:** Week[] 1..n (türetilir) · AnnualPlan.

**İş kuralları:** `haftalikDersSaati` sınıf toplamı 30.  
**Doğrulama:** dönem tarihleri örtüşmez; tatil aralıkları geçerli; saat map’i Course ile uyumlu.  
**Genişletme:** il/ilçe idari tatil katmanı.

---

### E18 — Week

**1. İş amacı:** Takvimden türetilmiş öğretim / tatil haftası.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `calendarId` | ref | Z |
| 3 | `haftaNo` | int | Z |
| 4 | `baslangic` | date | Z |
| 5 | `bitis` | date | Z |
| 6 | `tur` | WeekKind | Z |
| 7 | `belirliGunBaglantilari` | string[] | İ |
| 8 | `ogretimeAcik` | bool | Z | `tur=OGRETIM` ⇒ true |

**Kimlik:** UK `(calendarId, haftaNo)`.  
**İlişkiler:** Calendar 1 · AnnualPlan satırları · DailyPlan.

**İş kuralları:** Yalnızca `ogretimeAcik=true` haftalara outcome dağıtılır.  
**Doğrulama:** `baslangic ≤ bitis`; `haftaNo ≥ 1`.  
**Genişletme:** yarım gün / sınav haftası bayrakları.

---

### E19 — AnnualPlan

**1. İş amacı:** Motorun ürettiği **ilk planlama çıktısı** (program kopyası değil).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `curriculumId` | ref | Z |
| 3 | `calendarId` | ref | Z |
| 4 | `dersId` | ref | Z |
| 5 | `sinif` | Sinif | Z |
| 6 | `sube` | string | Z | |
| 7 | `teacherId` | ref | Z | |
| 8 | `schoolId` | ref | İ | |
| 9 | `egitimYili` | year | Z | |
| 10 | `durum` | PlanStatus | Z | |
| 11 | `satirlar` | AnnualPlanRow[] | Z | aşağıda |
| 12 | `kuralSetiSurumu` | string | İ | uygulanan PlanningRule seti |
| 13 | `olusturma` | date | Z | |
| 14 | `guncelleme` | date | İ | |

**AnnualPlanRow (gömülü):**

| Alan | Tip | Z |
|------|-----|---|
| `haftaNo` | int | Z |
| `weekId` | ref | Z |
| `programUnitId` | ref | İ |
| `outcomeIds` | ref[] | İ |
| `not` | text | İ |
| `satirTur` | enum | Z | `OGRETIM` \| `PEKISTIRME` \| `HATIRLATMA` \| `OTP` \| `TATIL` \| `BOS` |

**Kimlik:** UK `(teacherId, sinif, sube, dersId, egitimYili)`.  
**İlişkiler:** Curriculum · Calendar · TeacherContext · DailyPlan[] · Document[].

**İş kuralları:**  
- Kaynak: Curriculum + Calendar + PlanningRule + School/TeacherContext.  
- İnternet “hazır yıllık plan” içeriği kopyalanmaz.  
- `SCHEDULE_ONLY` ders için AnnualPlan yok.  

**Doğrulama:** satır haftaları takvimle uyumlu; tatil satırında outcome boş; öğretim satırında unit veya özel tür zorunlu.  
**Genişletme:** zümre onayı; versiyon diff; paylaşılan şablon (okul içi).

---

### E20 — DailyPlan

**1. İş amacı:** AnnualPlan satırından günlük / derslik planı.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `annualPlanId` | ref | Z |
| 3 | `tarih` | date | Z |
| 4 | `haftaNo` | int | Z |
| 5 | `dersSaatiNo` | int | Z | gün içi sıra |
| 6 | `dersId` | ref | Z |
| 7 | `sinif` | Sinif | Z |
| 8 | `sube` | string | Z |
| 9 | `outcomeIds` | ref[] | İ |
| 10 | `processComponentIds` | ref[] | İ |
| 11 | `evidenceIds` | ref[] | İ |
| 12 | `etkinlik` | text | İ |
| 13 | `olcme` | text | İ |
| 14 | `farklilastirmaNotu` | text | İ |
| 15 | `durum` | PlanStatus | Z |

**Kimlik:** UK `(annualPlanId, tarih, dersSaatiNo)` veya `(annualPlanId, haftaNo, dersSaatiNo)`.  
**İlişkiler:** AnnualPlan 1 · Document 0..n.

**İş kuralları:** Outcome’lar annual satırındaki kümenin alt kümesi olmalı.  
**Doğrulama:** `dersSaatiNo ≥ 1`; tarih eğitim yılı içinde.  
**Genişletme:** yoklama bağları; ders videosu / materyal listesi.

---

### E21 — Document

**1. İş amacı:** Planın biçimlendirilmiş evrak çıktısı (Word/PDF/HTML).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `kind` | DocumentKind | Z |
| 3 | `format` | DocumentFormat | Z |
| 4 | `sourceAnnualPlanId` | ref | İ |
| 5 | `sourceDailyPlanId` | ref | İ |
| 6 | `baslik` | string | Z |
| 7 | `revizyon` | int | Z | 1… |
| 8 | `olusturma` | date | Z |
| 9 | `uri` | uri | İ | depolama |
| 10 | `meta` | object | İ | okul adı, öğretmen, arşiv no |

**Kimlik:** `id` PK.  
**İlişkiler:** AnnualPlan 0..1 · DailyPlan 0..1 · TeacherContext.

**İş kuralları:** Document ≠ Plan; içerik plandan türetilir, programdan doğrudan kopyalanmaz.  
**Doğrulama:** yıllık evrak için `sourceAnnualPlanId`; günlük için `sourceDailyPlanId` zorunlu (kind’e göre).  
**Genişletme:** e-imza; MEBBİS / e-Okul aktarım paketleri.

---

### E22a — SchoolContext

**1. İş amacı:** Planlama girdisi — okul / şube bağlamı (program parçası değil).

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `okulAdi` | string | Z |
| 3 | `il` | string | İ |
| 4 | `ilce` | string | İ |
| 5 | `kurumKodu` | string | İ |
| 6 | `subeler` | object[] | İ | `{sinif, sube}` |

**Kimlik:** `id` PK.  
**İlişkiler:** TeacherContext · AnnualPlan.  
**Doğrulama:** `okulAdi` zorunlu.  
**Genişletme:** ikili eğitim, taşımalı eğitim bayrakları.

---

### E22b — TeacherContext

**1. İş amacı:** Öğretmen profili ve varsayılanlar.

| # | Alan | Tip | Z/İ |
|---|------|-----|-----|
| 1 | `id` | id | Z |
| 2 | `adSoyad` | string | Z |
| 3 | `schoolId` | ref | İ |
| 4 | `varsayilanSinif` | Sinif | İ |
| 5 | `varsayilanSube` | string | İ |
| 6 | `varsayilanDersId` | ref | İ |
| 7 | `brans` | string | İ |

**Kimlik:** `id` PK.  
**İlişkiler:** AnnualPlan[] · Document[].  
**Doğrulama:** adSoyad zorunlu.  
**Genişletme:** zümre başkanı rolü; birden fazla şube ataması.

---

## 4. Çapraz Doğrulama Matrisi (KM)

| Kod | Kural | Sertlik |
|-----|-------|---------|
| V01 | Program / Plan / Belge kimlikleri karışmaz | Sert |
| V02 | Outcome kodu resmi biçime uyar | Sert |
| V03 | Outcome tek ProgramUnit’a bağlı | Sert |
| V04 | M:N skill/value/tendency ara tablosuz çoğaltılamaz | Sert |
| V05 | Haftalık ders saati sınıf toplamı = 30 | Sert |
| V06 | 1. sınıf İngilizce yok | Sert |
| V07 | SCHEDULE_ONLY → AnnualPlan yok | Sert |
| V08 | Tatil haftasına outcome yazılamaz | Sert |
| V09 | Unit sırası atlanamaz | Sert |
| V10 | DailyPlan outcome ⊆ AnnualPlan satırı | Sert |
| V11 | Document kaynak plansız üretilemez (ilgili kind) | Sert |
| V12 | `ciktiSayisi` ≠ gerçek sayı | Uyarı |
| V13 | ContentFrame tamamen boş | Sert |
| V14 | ProcessComponent’siz normal outcome | Uyarı→(TPM’de sertleştirilebilir) |

---

## 5. İlkokul Course Çekirdek Tablosu (referans)

| dersId | kind | sınıflar | yapı |
|--------|------|----------|------|
| turkce | PROGRAM | 1–4 | tema |
| matematik | PROGRAM | 1–4 | tema |
| hayatBilgisi | PROGRAM | 1–3 | ogrenmeAlani |
| fen | PROGRAM | 3–4 | unite |
| sosyal | PROGRAM | 4 | ogrenmeAlani |
| ingilizce | PROGRAM | 2–4 | *(program gelince)* |
| dinKulturu | PROGRAM | 4 | *(program gelince)* |
| gorselSanatlar | PROGRAM | 1–4 | *(program gelince)* |
| muzik | PROGRAM | 1–4 | *(program gelince)* |
| bedenEgitimi | PROGRAM | 1–4 | *(program gelince)* |
| trafikGuvenligi | PROGRAM | 4 | *(program gelince)* |
| insanHaklari | PROGRAM | 4 | *(program gelince)* |
| serbestEtkinlikler | SCHEDULE_ONLY | 1–3 | — |

Saatler: TTKB 09.05.2025 (`docs/TYMM-OKUMA-NOTLARI.md` §7.1).

---

## 6. MB-TPM-001 / MB-DB-001 Geçiş Kriterleri

DM-002 **v1.0** ile aşağıdakiler yeşil sayılır:

- [x] 22 varlık (+ School/Teacher ayrımı) alan düzeyinde tanımlandı  
- [x] ID sözleşmesi ve outcome kod aileleri sabitlendi  
- [x] M:N ara ilişkiler adlandırıldı  
- [x] PlanningRule çekirdek seti listelendi  
- [x] Çapraz validasyon matrisi yazıldı  

**MB-TPM-001 ✅** — `docs/MB-TPM-001-SINIF1-TURKCE-DOMAIN-UYGULAMASI.md`  
Örnek paket: `assets/data/domain/tpm-001-sinif1-turkce.json`  
Not: Türkçe için `ProgramUnitOutcome` M:N (DM-002.1 adayı).

**Sıradaki — MB-DB-001:**  
E01–E22 → tablolar, FK, UK, index önerileri (mekanik türetim).

**Sonra — MB-JSON-001:**  
Makine şeması (JSON Schema / eşdeğeri).

---

## 7. Bilinçli Dışı Bırakılanlar

- SQL DDL / index DDL  
- JSON Schema dosyaları  
- UI bileşen sözleşmesi (UI-001 / DS-001’de)  
- Öğrenci hesabı  
- Hazır internet yıllık plan içeriği  

---

## 8. Karar Özeti

1. LearningOutcome PK’sı **resmi kod**dur.  
2. ProgramUnit; tema/alan/ünite/özel birimi tek modelde toplar.  
3. Skill / Value / Tendency **katalog + M:N**.  
4. Course `PROGRAM` vs `SCHEDULE_ONLY` ayrımı Serbest Etkinlikler için zorunludur.  
5. AnnualPlan / DailyPlan / Document program varlıklarından türetilir; tersi yok.  
6. PlanningRule seti algoritmanın (MB-ALG-001) girdi anayasasıdır.

---

*Üst anayasa:* `MB-DM-001`  
*Çizelge dayanak:* TTKB 09.05.2025 + `TYMM-OKUMA-NOTLARI.md`  
*Sonraki belge:* `MB-TPM-001`
