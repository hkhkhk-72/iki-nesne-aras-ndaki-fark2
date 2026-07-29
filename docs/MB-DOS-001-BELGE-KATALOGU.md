# MB-DOS-001 — Belge Kataloğu (Document Catalog)

**Sürüm:** 0.1 (şema freeze + tohum kayıtlar)  
**Tarih:** 29 Temmuz 2026  
**Durum:** Aktif — ~300 belgeye doğru doldurulacak  
**Üst:** MB-DOS-000 · MB-IA-003 · MD-035 Document DNA

> Platformdaki her resmî belge bu katalogda DNA ile tanımlanır.  
> Yeni belge = yeni DNA kaydı (ekran/modül kopyalamak değil).

---

## 1. DNA şeması (freeze)

Her kayıt:

| Alan | Açıklama |
|------|----------|
| `code` | `DOC-{KAT}-{NNN}` örn. `DOC-PLN-001` |
| `id` | Stabil kısa id (`yillik-plan`) |
| `name` | Görünen ad |
| `category` | planlar · sinif · olcme · resmi · takvim · etkinlik · rapor · diger |
| `iaModule` | IA-001 8 modülden biri |
| `motors` | `["MB-TPM","MB-YPM","MB-TKM","School"]` |
| `dependencies` | veri kaynakları |
| `userInputs` | Smart Form alanları (`[]` = sıfır soru) |
| `officialLocked` | MEB kilitli alan id’leri |
| `editable` | öğretmen alan id’leri |
| `outputs` | `["html","word","pdf","print"]` |
| `lifecycle` | IA-002 aşama kuralları / varsayılan |
| `related` | ilişkili belge kodları |
| `template` | şablon anahtarı |
| `mebVersion` | örn. `TYMM-2024` |
| `status` | `active` · `partial` · `planned` |
| `route` | mevcut UI rotası (geçici) |

---

## 2. Kod önekleri

| Önek | Kategori |
|------|----------|
| `DOC-PLN` | Planlar |
| `DOC-SNF` | Sınıf yönetimi |
| `DOC-OLC` | Ölçme |
| `DOC-RSM` | Resmî evraklar |
| `DOC-TKV` | Takvim |
| `DOC-ETK` | Etkinlikler |
| `DOC-RPR` | Raporlar |

---

## 3. Tohum dosya

Makine okunur katalog: `assets/data/document-catalog.json`  
Eski envanter (`evrak-envanteri.json`) keşif listesidir; **kanonik DNA bu katalogdur**. Migrasyon kademeli yapılır.

---

## 4. Doldurma sırası

1. Planlar (Yıllık, Günlük, İYEP, BEP, Destek…)  
2. Sınıf yönetimi  
3. Ölçme  
4. Zümre / ŞÖK / tutanak  
5. Kulüp / rehberlik / veli  
6. Kalan ~300’e tamamlama  

---

## 5. Kabul (DOS-001 v1.0)

- [ ] ≥ 50 belge tam DNA  
- [ ] Context Engine katalogdan `userInputs` okur  
- [ ] Official Lock alanları Preview’da kilitli  
- [ ] Eski envanterdeki aktif evraklar migrate  

*v0.1: şema + örnek DNA kayıtları.*
