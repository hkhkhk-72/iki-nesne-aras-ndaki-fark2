# MB-DS-004 — Accessibility

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı erişilebilirlik anayasası  
**Üst:** MB-DS-001 · MB-DS-002 · MB-DS-003  
**Kod:** `A11Y-001` … `A11Y-008` · Karar: **MD-043**

> MiniBilge Öğretmen her öğretmen için kullanılabilir olmalıdır.  
> Erişilebilirlik sonradan eklenmez — varsayılan kalitedir.

---

## A11Y-001 — Minimum Font

**14 px**

Gövde ve etkileşimli metin asla 14 px altına inmez.  
Küçük etiketler `max(14px, …)` ile korunur.

---

## A11Y-002 — Touch Area

**44 × 44 px** minimum dokunma / tıklama hedefi.

Buton, sekme, nav öğesi, FAB, checkbox satırı.

---

## A11Y-003 — Keyboard Navigation

Tam destek:

- Skip link → ana içerik  
- Görünür `:focus-visible` halkası  
- Mantıksal sekme sırası  
- Dialog’da odak tuzağı (trap)

---

## A11Y-004 — Screen Reader

Tam destek:

- Anlamlı `lang="tr"`  
- Landmark: `banner` / `navigation` / `main`  
- `aria-label` / `aria-live` (toast, offline)  
- `.mb-sr-only` görsel gizleme

---

## A11Y-005 — Color Contrast

**WCAG AA** (metin ≥ 4.5:1, büyük metin ≥ 3:1).

Açık ve koyu temada token’lar AA hedeflidir.

---

## A11Y-006 — Dark Mode

Tam destek. Varsayılan **açık** (DS-001); kullanıcı veya `prefers-color-scheme` ile koyu.

`html[data-theme="dark"]` · Ayarlar’dan seçim: Sistem / Açık / Koyu.

---

## A11Y-007 — Large Text

Ölçekler: **125% · 150% · 200%** (+ 100% varsayılan).

`html[data-text-scale="125|150|200"]` → `--mb-text-scale`.

---

## A11Y-008 — Offline Mode

Desteklenir. Bağlantı kesilince yerel kuyruk; bağlantı gelince senkronize.

`MiniBilgeOffline` · banner + `offlineQueue` · `online` olayında flush.

---

## Uygulama

| Dosya | Rol |
|-------|-----|
| `assets/js/components/a11y.js` | Tema, büyük yazı, skip-link, prefs |
| `assets/js/core/offline-sync.js` | Offline kuyruk + sync |
| `assets/css/ds.css` | Touch, contrast, dark, scale |
| `modules/ayarlar.html` | Erişilebilirlik kontrolleri |

---

## Kabul

- [x] Anayasa yayınlandı  
- [x] Min 14 px + 44×44  
- [x] Skip link + focus-visible  
- [x] Dark mode + large text  
- [x] Offline banner + kuyruk  
- [ ] Tam SR denetim (otomasyon CI — kademeli)  

---

*Yeni ekran PR’ında “A11Y hangi maddelere uydu?” belirtilir.*
