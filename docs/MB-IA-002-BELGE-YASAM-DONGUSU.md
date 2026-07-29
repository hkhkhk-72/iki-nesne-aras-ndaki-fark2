# MB-IA-002 — Belge Yaşam Döngüsü

**Sürüm:** 0.1 (iskelet — bağlayıcı yön)  
**Tarih:** 29 Temmuz 2026  
**Durum:** Sonraki kritik aşama  
**Üst:** MB-IA-001 · MB-COMP-002 · MB-BM

> MiniBilge yalnızca belge üretmez; öğretmenin resmî doküman sürecini yöneten bir **Belge İşletim Sistemi**dir.

---

## 1. Yaşam döngüsü

```
Oluştur → Doğrula → Önizle → Düzenle
  → PDF/Word’e Aktar → Paylaş → Arşivle
  → Güncelle → Sürüm Takibi
```

| Aşama | Anlam | Bileşen / motor |
|-------|--------|------------------|
| Oluştur | İş seçildi → motor zinciri | TPM/YPM/GPM/BM… |
| Doğrula | Eksik alan, mevzuat, tutarlılık | ValidationEngine |
| Önizle | DocumentBuilder önizleme | COMP-002 |
| Düzenle | Kontrollü alan düzenleme | DocumentBuilder |
| Aktar | HTML / Word / PDF / Yazdır | ExportMenu |
| Paylaş | Okul / veli / zümre (sonra) | — |
| Arşivle | Yıl sonu / kapanış | Document store |
| Güncelle | Takvim veya program değişince | Motor re-run |
| Sürüm | v1, v2… geri alınabilir | Document.version |

---

## 2. Durum modeli (COMP-005 ile hizalı)

`draft` → `validating` → `ready` → `exported` → `shared` → `archived`  
Yan yollar: `editing` · `missing` · `outdated`

---

## 3. Gelecek kancalar

- e-imza  
- okul yönetim sistemi (e-Okul vb.) entegrasyonu  
- AI destekli otomatik güncelleme (program/takvim değişince)

---

## 4. v1.0’da doldurulacaklar

- Durum geçiş diyagramı (sert kurallar)  
- Sürüm şeması (DM-002 uyumu)  
- Arşiv saklama politikası  
- Paylaşım rolleri  

*Şimdilik yön belgesi; uygulama COMP-002 + BM ile kademeli bağlanır.*
