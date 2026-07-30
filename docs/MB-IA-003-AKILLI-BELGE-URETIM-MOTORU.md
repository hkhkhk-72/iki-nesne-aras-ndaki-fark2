# MB-IA-003 — Akıllı Belge Üretim Motoru (Smart Document Engine)

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı (IA-002 freeze üzerine oturur)  
**Kararlar:** MD-031…036 · `docs/MD-REGISTRY.md`  
**Üst:** MB-IA-001 · MB-IA-002 · MB-DM-001 · MB-COMP-002

> Belge sadece oluşmaz. Belge **bağlamı bilir**, eksikleri sorar, MEB alanını korur.

---

## 1. Motor haritası

```
                 MiniBilge Teacher OS
                 DOCUMENT ENGINE (DEM)
                          │
     ┌────────────────────┼─────────────────────┐
     ▼                    ▼                     ▼
 Program Motoru      Takvim Motoru         Okul Motoru
 (TPM)               (TCM / TKM)           (School Engine)
     │                    │                     │
     └───────────────┬──────────────────────────┘
                     ▼
           Context Builder Engine
        (Öğretmen + Okul + Sınıf + Ders + Hafta)
                     ▼
         Document Generation Engine
                     │
        ┌────────────┴───────────────┐
        ▼                            ▼
 Official Layer              Editable Layer
 (MEB Korumalı)            (Öğretmen düzenler)
```

---

## 2. Pipeline (Teacher OS)

```
Teacher Context Engine
  → Document Context Engine
  → Validation Engine
  → Generation Engine
  → Preview Engine
  → AI Enhancement Engine   (opsiyonel)
  → Export Engine
  → Archive Engine
  → Sync Engine             (sonra)
```

Yaşam döngüsü sırası IA-002 freeze ile aynıdır; bu belge **nasıl düşündüğünü** tanımlar.

---

## 3. Context First (MD-031)

```
Öğretmen → Okul → Sınıf → Ders → Hafta → Takvim → Belge
```

1A + Türkçe + 6. Hafta bağlamındayken “üret” denince bilgi **tekrar sorulmaz**.

---

## 4. Zero Input (MD-032)

Otomatik gelenler (kayıtlıysa):

İl · İlçe · Okul · Müdür · Müdür Yrd. · Sınıf · Şube · Ders · Hafta · Takvim · Saat · Program · Öğretmen · Branş · Eğitim yılı

---

## 5. Smart / Dynamic Form (MD-033 · MD-034)

| Belge | Kullanıcıdan istenen |
|-------|----------------------|
| Yıllık Plan | **0 soru** |
| Günlük Plan | Bugün kullanılacak materyal? (gerekirse) |
| Zümre | Toplantıya katılan öğretmenler? |
| BEP | Öğrenci seç → hazır |
| İYEP | Modül seç → hazır |
| Kulüp | Kulüp · Danışman · Üyeler |
| Rehberlik | Ay · Tema |

Akış: `BELGE → Form Şablonu → Gerekli Alanlar → Doğrulama → Belge`

---

## 6. Document DNA (MD-035)

Her belge:

| Alan | Örnek |
|------|--------|
| Belge ID / Kod | `DOC-PLN-001` |
| Belge Türü | `AnnualPlan` |
| Motor(lar) | TPM, YPM, TCM, School |
| Bağımlılıklar | Curriculum, Calendar, Teacher, School |
| Versiyon | `1.0.0` |
| Şablon | `tpl-annual-plan-v1` |
| MEB Sürümü | TYMM / ilgili yıl |

---

## 7. Official Lock (MD-036)

| Alan türü | Örnek | Düzenleme |
|-----------|--------|-----------|
| Official | Kazanımlar / öğrenme çıktıları | Kilitli |
| Editable | Etkinlik, materyal notu | Açık |

Generation Engine iki katmanı ayrı üretir; Preview bunları görsel olarak ayırır.

---

## 8. Uygulama dosyaları

| Dosya | Rol |
|-------|-----|
| `assets/js/core/context-cache.js` | MD-038 ContextCacheService |
| `assets/js/core/context-engine.js` | Teacher + Document context (cache üzerinden) |
| `assets/js/core/document-dna.js` | DNA okuma / katalog erişimi |
| `assets/data/document-catalog.json` | DOS-001 tohum katalog |
| `docs/MB-DOS-000-DOCUMENT-OS.md` | OS özeti |
| `docs/MB-DOS-001-BELGE-KATALOGU.md` | Katalog anayasası |

---

## 9. Sonraki stratejik adım

**MB-DOS-001 — Belge Kataloğu:** ~300 belgenin DNA’sı.  
Yeni belge = kataloğa tanım eklemek.

---

*IA-003, IA-002 freeze’i bozmaz; üzerine zekâ katmanı ekler.*
