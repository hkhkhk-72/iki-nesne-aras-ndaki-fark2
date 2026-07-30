# MB-DS-007 — Universal Component Library

**Sürüm:** 1.0  
**Tarih:** 30 Temmuz 2026  
**Durum:** Bağlayıcı bileşen kataloğu  
**Üst:** MD-025 Everything is a Component · MB-DS-001…006  
**Karar:** **MD-046**  
**Kod:** `Mb*` standart API  
**İlerleme:** **75% tamam** · **25% kaldı** (Flutter/port + derin motor bağlamı) · `docs/ILERLEME.md`

> MiniBilge’de aşağıdaki bileşenler **standarttır**.  
> Yeni UI bu katalog dışına çıkmaz; eksikse önce buraya eklenir.

---

## İlke

1. Her bileşen `MiniBilgeComponents.MbX` veya `MiniBilgeLib.MbX`  
2. `{ html, mount(target) }` sözleşmesi  
3. DS-001…006 (renk, TXS, IS, A11Y, Motion, TXA) uyumlu  
4. Components Lab’da vitrinlenir

---

## Katalog

### Core

| Bileşen | Rol |
|---------|-----|
| **MbButton** | Birincil / ikincil / ghost CTA |
| **MbCard** | Etkileşim konteyneri (hub/form) |
| **MbInput** | Metin / sayı / tarih alanı |
| **MbDropdown** | Seçim listesi |
| **MbSearch** | 300 ms debounce arama |
| **MbTable** | Universal tablo |
| **MbBadge** | Durum / AI confidence |
| **MbAvatar** | Öğretmen / öğrenci kısaltma |
| **MbStepper** | Wizard adımları (≤3 görünür tercih) |
| **MbTimeline** | Zaman çizelgesi |
| **MbCalendar** | Takvim özeti |
| **MbPreview** | Belge önizleme |
| **MbWizard** | Üretim sihirbazı kabuğu |
| **MbProgress** | % tamam / kaldı |
| **MbTabs** | Sekme / sınıf sekmeleri |
| **MbContextBar** | Yıl · okul · sınıf · şube |
| **MbClassSelector** | Sınıf/şube seçici |
| **MbFloatingAI** | Sağ alt AI FAB |
| **MbNotificationCenter** | Toast / banner |
| **MbCommandPalette** | Komut paleti (⌘K) |
| **MbQuickActions** | TXA-009 hızlı işlemler |
| **MbRecentDocuments** | Son belgeler |
| **MbDocumentStatus** | Belge durumu |
| **MbAutosaveIndicator** | Autosave durumu |
| **MbVersionHistory** | Sürüm geçmişi |
| **MbTeacherDashboard** | Bugün panosu kabuğu |
| **MbWorkflowStepper** | Workflow aşaması |
| **MbLessonTimeline** | Ders zaman çizgisi |
| **MbLessonExecution** | LEE özeti / kontrol |
| **MbAttendanceBar** | Yoklama çubuğu |
| **MbReflectionCard** | Yansıtma kartı |
| **MbAssessmentPanel** | Ölçme paneli |
| **MbAnalyticsCard** | Analitik özet |
| **MbEmptyState** | TXS-007 boş durum |
| **MbSkeletonLoader** | IS-007 skeleton |
| **MbOfflineBanner** | A11Y-008 çevrimdışı |
| **MbSyncIndicator** | Senkron durumu |

---

## Uygulama

| Dosya | Rol |
|-------|-----|
| `assets/js/components/mb-library.js` | Tüm `Mb*` kayıtları |
| `assets/css/ds.css` | `.mb-lib-*` stilleri |
| `modules/components-lab.html` | Katalog vitrini |

---

## Kabul

- [x] Katalog yayınlandı  
- [x] Tüm Mb* isimleri runtime’da mevcut (37)  
- [x] Lab vitrini (`modules/components-lab.html`)  
- [ ] Flutter port (ARCH-002) — kaldı  
- [ ] Her bileşenin derin motor bağlantısı — kademeli  

---

*Yeni ekran PR’ında kullanılan Mb* listesi belirtilir.*
