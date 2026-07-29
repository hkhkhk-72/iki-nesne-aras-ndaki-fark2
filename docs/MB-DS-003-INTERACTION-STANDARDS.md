# MB-DS-003 — Interaction Standards

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı etkileşim anayasası  
**Üst:** MB-DS-001 (görsel) · MB-DS-002 (deneyim / TXS)  
**Kod:** `IS-001` … `IS-011` · Karar: **MD-042**

> Hareket ve geri bildirim gürültü değil; **güven ve hız** sinyali verir.  
> Tüm süreler CSS değişkenleri + `MiniBilgeInteraction` üzerinden tek kaynaktan okunur.

---

## İlişki

| Katman | Belge |
|--------|--------|
| Görsel dil | MB-DS-001 |
| Deneyim dili | MB-DS-002 (TXS) |
| Etkileşim zamanlaması | **MB-DS-003** |
| Erişilebilirlik | MB-DS-004 |
| Hareket | MB-DS-005 · max 300 ms |

---

## IS-001 — Hover

**150–200 ms**

Hover geçişleri `--mb-is-hover` (varsayılan **180 ms**).  
Opasite / arka plan / border-color; glow ve agresif scale yok.

---

## IS-002 — Click Feedback

**80–120 ms**

Aktif basış: `--mb-is-click` (varsayılan **100 ms**).  
Butonlarda kısa `scale(0.98)` veya arka plan koyulaşması.

---

## IS-003 — Page Transition

**250 ms** — `--mb-is-page`

Ana içerik girişi: fade + hafif yükselme.  
`prefers-reduced-motion` → anında.

---

## IS-004 — Drawer

**300 ms** — `--mb-is-drawer`

Yan panel aç/kapa.

---

## IS-005 — Dialog

**200 ms** — `--mb-is-dialog`

Modal / overlay fade + içerik scale.

---

## IS-006 — Snackbar

**3 saniye** görünür kalır — `--mb-is-snackbar-ms: 3000`

Toast / snackbar aynı süre.  
Kapanış animasyonu dialog süresiyle (200 ms).

---

## IS-007 — Loading

- Varsayılan: **Skeleton**
- **Spinner** yalnızca zorunlu durumlarda (ağ bekleniyor, işlem iptal edilemez)

Bileşen: `MiniBilgeInteraction.Skeleton`.

---

## IS-008 — Search

**300 ms debounce** — `--mb-is-search-ms: 300`

`MiniBilgeInteraction.debounce(fn, TIMINGS.search)`.

---

## IS-009 — Infinite Scroll

Sayfa numarası UI’da kullanılmaz.  
Liste sonuna yaklaşınca sonraki dilim yüklenir.

`MiniBilgeInteraction.InfiniteScroll`.

---

## IS-010 — Undo (silme)

Silme işlemleri **5 saniye** geri alınabilir — `--mb-is-undo-ms: 5000`

Snackbar + “Geri al” aksiyonu.  
Süre dolmadan onaylanmazsa kalıcı silme.

`MiniBilgeInteraction.undoable`.

---

## IS-011 — Autosave

Formlar **30 saniyede bir** otomatik kaydedilir — `--mb-is-autosave-ms: 30000`

Kirli form + görünür sekme iken çalışır.  
`MiniBilgeInteraction.autosave`.

---

## CSS değişkenleri

```css
--mb-is-hover: 180ms;
--mb-is-click: 100ms;
--mb-is-page: 250ms;
--mb-is-drawer: 300ms;
--mb-is-dialog: 200ms;
--mb-is-snackbar-ms: 3000;
--mb-is-search-ms: 300;
--mb-is-undo-ms: 5000;
--mb-is-autosave-ms: 30000;
```

---

## Uygulama dosyaları

| Dosya | Rol |
|-------|-----|
| `assets/js/components/interaction.js` | TIMINGS, debounce, undo, autosave, skeleton, scroll |
| `assets/css/ds.css` | Token + utility sınıfları |
| `assets/js/components/notify.js` | Snackbar 3 sn |

---

## Kabul

- [x] Anayasa yayınlandı  
- [x] CSS token’ları  
- [x] Runtime helpers  
- [x] Snackbar 3 sn  
- [x] Skeleton varsayılan loading  
- [ ] Tüm listelerde infinite scroll (kademeli)  

---

*Yeni ekran PR’ında “IS hangi maddelere uydu?” belirtilir.*
