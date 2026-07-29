# MB-IA-001 — MiniBilge Öğretmen Bilgi Mimarisi

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı Information Architecture  
**Üst:** MD-026 · MB-UI-003 · FAZ-6 · MB-DM-001

> **Öğretmen belge aramaz. Öğretmen yaptığı işi seçer. Belge kendiliğinden oluşur.**

Merkez: **belge değil, öğretmen iş akışı (workflow).**

---

## 0. Temel ayrım

| ÖğretmenEvrak | MiniBilge |
|---------------|-----------|
| Belge merkezli | **Veri / iş akışı merkezli** |
| Menüden belge seç | İş seç → motor çalışır → belge doğar |
| Tekrarlayan formlar | Tek kurulum → merkezî veri havuzu |

---

## 1. Seviye 1 — Sınıf bağlamı (Context)

Girişte öğretmen:

```
Öğretmen adı
Eğitim Öğretim Yılı
Sınıfını Seç
  1/A · 2/A · 3/B · 4/A
```

Bir kutuya basınca sistem otomatik yükler (bir daha sorulmaz):

- sınıf düzeyi · şube  
- haftalık ders çizelgesi (TTKB) · okutulan dersler  
- öğretim programı · yıllık plan (varsa)  
- okul / öğretmen bilgileri  
- resmî tatiller · belirli gün ve haftalar · ders saatleri  

**Storage:** `aktifSinif` + `aktifSube` (+ `siniflar[]` öğretmenin şubeleri).

---

## 2. Seviye 2 — Sekiz ana modül

Ana ekranda **yalnızca 8 büyük kart**:

| # | Modül | İş |
|---|--------|-----|
| 1 | **Planlar** | Yıllık, günlük, haftalık, İYEP, BEP, destek, egzersiz, kulüp, sosyal |
| 2 | **Sınıf Yönetimi** | Öğrenciler, yoklama, oturma, rehberlik, davranış, veli, dosyalar |
| 3 | **Ölçme** | Rubrik, kontrol listesi, gözlem, süreç, kazanım, yazılı analizi, raporlar |
| 4 | **Resmî Evraklar** | ~300 belge tek merkez (zümre, ŞÖK, tutanak, dilekçe…) |
| 5 | **Takvim** | Ders programı, nöbet, ajanda, tatiller, belirli günler, okul takvimi |
| 6 | **Etkinlikler** | Kulüpler, geziler, yarışmalar, sosyal etkinlikler, projeler |
| 7 | **Raporlar** | Gelişim, sınıf/başarı analizi, devamsızlık, istatistik |
| 8 | **MiniBilge AI** | Doğal dil → motor zinciri → belge |

UI-003’teki 5 hub bu 8’li yapıya **genişletilir** (Ölçme, Etkinlikler, Raporlar ayrılır; Sınıf İşlemleri → Sınıf Yönetimi).

---

## 3. Modül içi motor akışı

Örnek — Yıllık Plan:

```
İş seçildi (Yıllık Plan)
  → Ders (bağlamdan / seçim)
  → Program (TPM)
  → Takvim (TKM)
  → Kazanımlar
  → Resmî tatiller
  → Haftalık ders saati (TTKB)
  → Belge (BM) doğar
```

Öğretmen belgeyi “düzenlemek için açmaz”; motor zinciri çalışır. Düzenleme yaşam döngüsünde (IA-002).

---

## 4. Merkezî veri havuzu

Bir kez tanımlanır:

Okul · Müdür · İl / İlçe · Sınıf / Şube · Öğretmen · Branş · Eğitim yılı

Tüm belgeler aynı doğrulanmış veriden üretilir → tutarlılık + sıfır tekrar giriş.

---

## 5. Uygulama dosyaları

| Dosya | Rol |
|-------|-----|
| `docs/MB-IA-001-…md` | Bu anayasa |
| `assets/js/core/hub-config.js` | 8 modül sözlüğü |
| `assets/js/app.js` | Seviye 1 + 2 ana ekran |
| `assets/js/components/nav.js` | `ClassContext` (sinif/şube) |

---

## 6. Sonraki

**MB-IA-002 — Belge Yaşam Döngüsü**  
Oluştur → Doğrula → Önizle → Düzenle → Aktar → Paylaş → Arşivle → Güncelle → Sürüm

---

*IA değişince önce bu belge, sonra hub-config / app.js.*
