# MB-IA-002 — Belge Yaşam Döngüsü

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** 🔒 **Architecture Freeze**  
**Üst:** MB-IA-001 · MB-COMP-002 · MB-BM  
**Üst katman:** MB-IA-003 (Smart Document Engine)

> MiniBilge yalnızca belge üretmez; öğretmenin resmî doküman sürecini yöneten bir **Document Operating System** çekirdeğidir.

---

## 1. Yaşam döngüsü (freeze)

```
Oluştur → Doğrula → Önizle → Düzenle
  → PDF/Word’e Aktar → Paylaş → Arşivle
  → Güncelle → Sürüm Takibi
```

| Aşama | Anlam | Motor / bileşen |
|-------|--------|------------------|
| Oluştur | İş + bağlam → üretim | IA-003 Generation |
| Doğrula | Eksik alan, mevzuat, DNA kuralları | ValidationEngine |
| Önizle | Official + Editable katmanlar | Preview Engine |
| Düzenle | Yalnızca kilitli olmayan alanlar (MD-036) | DocumentBuilder |
| Aktar | HTML / Word / PDF / Yazdır | Export Engine |
| Paylaş | Okul / veli / zümre | Sync (sonra) |
| Arşivle | Yıl sonu / kapanış | Archive Engine |
| Güncelle | Program/takvim değişince re-run | Generation |
| Sürüm | v1, v2… geri alınabilir | Document.version |

Bu sıra **değiştirilmez**. Yeni özellikler aşamalara eklenir; sıra bozulmaz.

---

## 2. Durum modeli (freeze)

```
draft → validating → ready → exported → shared → archived
```

Yan yollar: `editing` · `missing` · `outdated` · `locked_official`

COMP-005 rozetleri bu durumlarla eşlenir.

---

## 3. Katman ayrımı (IA-003 ile)

| Katman | Kim | Düzenlenebilir? |
|--------|-----|-----------------|
| **Official Layer** | MEB / TYMM / kilitli DNA | Hayır (MD-036) |
| **Editable Layer** | Öğretmen | Evet |

---

## 4. Gelecek kancalar (sıra dışı özellik)

Freeze bozulmadan eklenecek kancalar:

- e-imza  
- e-Okul / okul YS entegrasyonu  
- AI Enhancement (Preview sonrası, Export öncesi)  
- otomatik güncelleme (program/takvim değişimi)

---

## 5. Değişiklik politikası

IA-002 freeze sonrası değişiklik = **yeni MD + versiyon bump** (1.1…).  
Uygulama ayrıntıları IA-003 ve DOS-001 kataloğunda yaşar.

---

*Freeze tarihi: 29 Temmuz 2026.*
