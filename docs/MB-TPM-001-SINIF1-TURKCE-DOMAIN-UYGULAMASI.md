# MB-TPM-001 — 1. Sınıf Türkçe Domain Uygulaması

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Domain örnek doldurma (taslak örnek)  
**Üst belgeler:** MB-DM-001 · MB-DM-002  
**Örnek veri:** `assets/data/domain/tpm-001-sinif1-turkce.json`

> Bu belge **kanonik JSON şeması değildir** (MB-JSON-001’e bırakılır).  
> Amaç: DM-002 varlıklarını **1. sınıf Türkçe** üzerinde somut doldurmak ve motorların tüketeceği ilk gerçek örnek paketi üretmek.

---

## 0. Kapsam

| Dahil | Hariç |
|-------|--------|
| `cur:turkce:2024` · sınıf 1 | 2–4. sınıf Türkçe |
| ProgramUnit (tema + özel) | AnnualPlan / DailyPlan üretimi (ALG-001) |
| LearningOutcome + M:N bağlar | SQL DDL (DB-001) |
| İlk okuma-yazma kuralları | Hazır internet yıllık plan kopyası |

**Kaynak program:** MEB TYMM İlkokul Türkçe Dersi Öğretim Programı (1–4) 2024  
**Keşif girdisi:** `assets/data/curriculum/sinif1-turkce.json` (geçici; tasfiye adayı)

---

## 1. Kimlikler (bu pakette)

| Varlık | id |
|--------|-----|
| EducationSystem | `edu:ilkokul` |
| Course | `course:turkce` |
| Curriculum | `cur:turkce:2024` |
| Grade | `grade:1` |
| ProgramUnit (tema) | `pu:turkce:1:th:01` … `th:09` |
| ProgramUnit (özel) | `pu:turkce:1:sp:10` … `sp:12` |
| LearningOutcome | resmi kod (`T.D.1.1` …) |

---

## 2. ProgramUnit envanteri (sınıf 1)

| sira | id | kind | ad | dersSaati | hafta* |
|------|-----|------|-----|----------:|-------:|
| 1 | `th:01` | THEME | İlk Okuma Yazmaya Hazırlık Çalışmaları | 10 | 1 |
| 2 | `th:02` | THEME | Güzel Davranışlarımız | 38 | 4 |
| 3 | `th:03` | THEME | Mustafa Kemal'den Atatürk'e | 38 | 4 |
| 4 | `th:04` | THEME | Çevremizdeki Yaşam | 38 | 4 |
| 5 | `th:05` | THEME | Yol Arkadaşımız Kitaplar | 38 | 4 |
| 6 | `th:06` | THEME | Yeteneklerimizi Keşfediyoruz | 38 | 4 |
| 7 | `th:07` | THEME | Minik Kâşifler | 38 | 4 |
| 8 | `th:08` | THEME | Atalarımızın İzleri | 38 | 4 |
| 9 | `th:09` | THEME | Sorumluluklarımızın Farkındayız | 38 | 4 |
| 10 | `sp:10` | SPECIAL / PEKISTIRME | Pekiştirme Haftası | 20 | — |
| 11 | `sp:11` | SPECIAL / HATIRLATMA | Hatırlatma Haftası | 10 | — |
| 12 | `sp:12` | SPECIAL / OTP | Okul Temelli Planlama | 16 | — |

\* `onerilenHafta` keşif alanından; yıllık planda takvim haftasına `PlanningRule` ile yayılır.

**Saat kontrolü (program):** 10 + 8×38 + 20 + 10 + 16 = **360** (= 36 hafta × 10 saat).

---

## 3. LearningOutcome modeli (Türkçe inceliği)

### 3.1 Kod ailesi

```
T.{alan}.{sinif}.{no}
alan ∈ { D=Dinleme/İzleme, K=Konuşma, O=Okuma, Y=Yazma }
```

Örnek: `T.D.1.2`, `T.Y.1.3`

### 3.2 Aynı kod, birden fazla tema

TYMM Türkçe’de bir çıktı kodu **birden fazla temada** listelenir.  
DM-001’deki “outcome tek ProgramUnit’a aittir” kuralı burada gerçeğe uymuyor.

**TPM-001 kararı (DM-002.1 adayı):**

| Yapı | Anlam |
|------|--------|
| `LearningOutcome` | `kod` PK — tekil tanım |
| `ProgramUnitOutcome` | M:N bağ `(programUnitId, outcomeId, siraInUnit)` |
| `primaryProgramUnitId` | İlk görüldüğü tema (navigasyon kolaylığı) |

Örnek istatistik (paket): **17** tekil çıktı · **99** tema–çıktı bağı.

### 3.3 Alan → Skill eşlemesi

| Alan | Skill |
|------|--------|
| D | `TAB1` Dinleme/İzleme |
| O | `TAB2` Okuma |
| K | `TAB3` Konuşma |
| Y | `TAB4` Yazma |

---

## 4. İlk okuma-yazma (PlanningRule)

Curriculum alanı `ilkOkumaYazma`:

- Yöntem: **Ses Esaslı İlk Okuma Yazma Öğretimi**
- Harf: tırnaksız dik temel harfler
- Harf grupları haftalara yayılır (grup 1: a-A, n-N, e-E, t-T …)

Zorunlu kural: `grade1-turkce-ses` (DM-002 PlanningRule seti).

Özel birimler:

- `otp-no-auto-outcome` — OTP’ye otomatik kazanım yazılmaz  
- `special-no-new-outcome` — Pekiştirme/Hatırlatma yeni outcome üretmez  

---

## 5. Paket içeriği (dosya)

`assets/data/domain/tpm-001-sinif1-turkce.json`

| Bölüm | İçerik |
|-------|--------|
| meta | spec, durum, migrasyon notu |
| educationSystem / course / curriculum / grade | kimlikler |
| programUnits | 9 tema + 3 özel |
| learningOutcomes | 17 tekil |
| programUnitOutcomes | 99 bağ |
| contentFrames / processComponents | taslak (keşiften) |
| assessments / learningEvidence | taslak |
| skills / values / tendencies | katalog çekirdeği |
| outcomeSkills / Values / Tendencies | M:N örnekleri |
| planningRulesApplied | slug listesi |

`meta.notCanonicalSchema = true` — MB-JSON-001 gelene kadar şema kilidi yok.

---

## 6. Motor tüketimi

`CurriculumEngine.loadDomainPack('tpm-001-sinif1-turkce')`  
Öğretim Programı tarayıcısı 1. sınıf Türkçe için domain paketi varsa **ProgramUnit → Outcome** gezginini bu paketten besler; yoksa keşif JSON’a düşer.

Günlük Kazanımlar / yıllık plan hâlâ keşif dağıtımını kullanabilir; ALG-001 domain paketine geçecektir.

---

## 7. Doğrulama kontrol listesi

- [x] Curriculum id = `cur:turkce:2024`  
- [x] Tema sırası resmi liste ile uyumlu  
- [x] Özel birimler (Pekiştirme / Hatırlatma / OTP) var  
- [x] Outcome kodları `T.{D|K|O|Y}.1.n`  
- [x] Toplam tema+özel saat = 360  
- [x] `SCHEDULE_ONLY` yok (Türkçe PROGRAM)  
- [x] Hazır internet planı kopyalanmadı  

---

## 8. Sonraki adımlar

1. **MB-DB-001** — bu paketten tablo/FK taslağı  
2. **MB-JSON-001** — JSON Schema kilidi  
3. **MB-ALG-001** — `programUnits` + takvim → AnnualPlan  
4. DM-002.1 — `ProgramUnitOutcome` M:N’nin anayasaya işlenmesi  
5. ProcessComponent’leri resmi `a) b) c)` metinleriyle zenginleştirme (PDF satır satır)

---

## 9. Karar özeti

1. 1. sınıf Türkçe, MiniBilge’nin **ilk tam domain örneğidir**.  
2. Outcome tekilliği **kod** üzerindendir; temalar M:N bağlanır.  
3. Özel birimler planda yer alır, yeni çıktı üretmez.  
4. Keşif JSON migrasyon kaynağıdır; kanonik şema değildir.  
5. Ses esaslı ilk okuma-yazma kuralı plan motoruna bağlanmak zorundadır.

---

*Örnek dosya:* `assets/data/domain/tpm-001-sinif1-turkce.json`  
*Sonraki belge:* `MB-DB-001`
