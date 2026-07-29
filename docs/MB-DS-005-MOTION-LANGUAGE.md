# MB-DS-005 — Motion Language

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı hareket anayasası  
**Üst:** MB-DS-001 · MB-DS-003 (süreler) · MB-DS-004  
**Kod:** `ML-001` … `ML-004` · Karar: **MD-044**

> Animasyon **gösteriş için kullanılmaz**.  
> Yalnızca durum bildirir.  
> **Maksimum süre: 300 ms.**  
> Hiçbir animasyon öğretmeni bekletmez — işlem animasyonu bitmeden tamamlanır.

---

## İlke

| Kullanılır | Kullanılmaz |
|------------|-------------|
| Başarılı | Dekoratif blob / parallax |
| Hata | Sürekli dikkat çeken pulse (durum dışı) |
| Yükleniyor | “Wow” sayfa şovları |
| Geçiş | 300 ms üzeri her şey |

---

## ML-001 — Success

Kayıt / tamamlandı geri bildirimi ≤ **300 ms**.  
Örn. kısa yeşil flaş, checkbox scale, toast girişi.

Sınıf: `.mb-motion-success` · API: `MiniBilgeMotion.success(el)`

---

## ML-002 — Error

Hata / engel geri bildirimi ≤ **300 ms**.  
Örn. kısa sarsıntı (shake) veya kırmızı flaş — tekrarlayan loop yok.

Sınıf: `.mb-motion-error` · API: `MiniBilgeMotion.error(el)`

---

## ML-003 — Loading

Skeleton / spinner yalnızca yükleme durumunda.  
Döngü süresi ≤ 300 ms; UI kilidi yok — öğretmen gezinmeye devam edebilir.

Sınıf: `.mb-motion-loading` · `Skeleton` / `Spinner` (DS-003)

---

## ML-004 — Transition

Sayfa / panel / dialog geçişi ≤ **300 ms**.  
DS-003 ile uyum: page 250 · dialog 200 · drawer 300 (tavan).

Sınıf: `.mb-motion-transition` · `markPageEnter`

---

## Token’lar

```css
--mb-motion-max: 300ms;
--mb-motion-success: 240ms;
--mb-motion-error: 240ms;
--mb-motion-loading: 300ms;
--mb-motion-transition: 250ms;
```

`prefers-reduced-motion: reduce` → animasyonlar kapatılır / anında.

---

## Uygulama

| Dosya | Rol |
|-------|-----|
| `assets/js/components/motion.js` | success / error / loading / transition |
| `assets/css/ds.css` | Token + sınıflar; dekoratif blob kaldırıldı |
| `notify.js` | Toast giriş ≤ 300 ms |

---

## Kabul

- [x] Anayasa yayınlandı  
- [x] Max 300 ms token  
- [x] Dekoratif hero blob kapalı  
- [x] Success / Error / Loading / Transition API  
- [x] Reduced motion saygısı  

---

*Yeni ekran PR’ında “ML hangi durum için motion kullandı?” belirtilir.*
