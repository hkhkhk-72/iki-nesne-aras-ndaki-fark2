# MD Registry — Mimari Karar Kataloğu

**Sürüm:** 1.1  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı indeks

> Yeni karar numarası vermeden önce bu kayda bakılır.

---

## Kayıtlı kararlar

| Kod | Başlık | Alan | Durum |
|-----|--------|------|--------|
| **MD-025** | Everything is a Component | UI / FAZ-6 | ✅ freeze |
| **MD-026** | ÖğretmenEvrak referansı → sonraki nesil | Ürün IA | ✅ freeze |
| **MD-031** | Context First | Document OS | ✅ freeze |
| **MD-032** | Zero Input Principle | Document OS | ✅ freeze |
| **MD-033** | Smart Form Engine | Document OS | ✅ freeze |
| **MD-034** | Dynamic Form Builder | Document OS | ✅ freeze |
| **MD-035** | Document DNA | Document OS | ✅ freeze |
| **MD-036** | Official Lock | Document OS | ✅ freeze |
| **MD-038** | Context Cache Engine | Document OS | ✅ freeze |
| **MD-039** | Workflow First | Teacher Workflow | ✅ freeze |
| **MD-040** | LessonExecution SSOT | Document OS / LEE | ✅ freeze |
| **MD-041** | Teacher Experience System (TXS) | UX / MB-DS-002 | ✅ freeze |
| **MD-042** | Interaction Standards | UX / MB-DS-003 | ✅ freeze |
| **MD-043** | Accessibility | UX / MB-DS-004 | ✅ freeze |
| **MD-044** | Motion Language | UX / MB-DS-005 | ✅ freeze |
| **MD-045** | Teacher Experience Architecture (TXA) | UX / MB-DS-006 | ✅ freeze |
| **MD-046** | Universal Component Library (UCL) | UX / MB-DS-007 | ✅ freeze |
| **MD-047** | Document Operating System Core | Document OS / MB-DOS-002 | ✅ freeze |
| **MD-048** | Academic Operating System (Academic Kernel) | AOS / MB-AOS-001 | ✅ freeze |

### Numara notu

Taslakta Document OS ilkeleri MD-025…030 diye anılmıştı.  
**MD-025 / MD-026** zaten dolu olduğu için Document OS ilkeleri **MD-031…036** olarak donduruldu. Anlam aynıdır.

**MD-038** — Context Cache: Load Once — Use Everywhere.  
**MD-039** — Workflow First: belge seçilmez; TWE doğru işi zamanında önerir.  
**MD-040** — LessonExecution tek doğruluk kaynağı; Ders Defteri bağımsız belge değildir.  
**MD-041** — Teacher Experience System: Context/Workflow First, Zero Load, One Click, AI Everywhere, Never Empty, Action Dashboard, AI Confidence.  
**MD-042** — Interaction Standards: hover/click/page/drawer/dialog süreleri, snackbar 3 sn, skeleton, debounce, infinite scroll, undo 5 sn, autosave 30 sn.  
**MD-043** — Accessibility: min 14px, 44×44, klavye/SR, WCAG AA, dark mode, large text, offline sync.  
**MD-044** — Motion Language: yalnızca success/error/loading/transition · max 300 ms · bekletmez.  
**MD-045** — Teacher Experience Architecture (TXA): ekran değil workflow; tek amaç, ≤3 aksiyon, autosave, belge adımları, version history, context-aware.  
*(Taslak MD-025 istemişti; MD-025 dolu → MD-045.)*  
**MD-046** — Universal Component Library: standart `Mb*` kataloğu (MbButton…MbSyncIndicator).  
**MD-047** — Document OS Core: canlı belge entity, Event Bus, Dependency Graph, Document Engine; hard-coded üretim yasak.  
*(Taslak MB-DOS-003 istemişti; MB-DOS-003 = LEE → kayıt MB-DOS-002 / MD-047.)*  
**MD-048** — Academic Kernel: MiniBilge’nin en üst mimari standardı; 10 katman · Global Event Bus · DI · Context Driven UI.

---

## Document OS ilkeleri (özet)

### MD-031 — Context First
Belge seçilmez; önce bağlam oluşur:  
Öğretmen → Okul → Sınıf → Ders → Hafta → Takvim → Belge.

### MD-032 — Zero Input Principle
Öğretmen bilgi girmez; sistem bilir. İl, ilçe, okul, müdür, sınıf, şube, ders, hafta, takvim, saat, program kayıtlıdır.

### MD-033 — Smart Form Engine
Yalnızca eksik alan sorulur (yıllık plan: 0 soru; günlük: materyal; zümre: katılanlar; BEP: öğrenci…).

### MD-034 — Dynamic Form Builder
Her belge kendi form şablonunu, alanlarını ve doğrulamasını getirir.

### MD-035 — Document DNA
Her belgenin kimliği: kod, tür, motor, bağımlılıklar, versiyon, şablon, MEB sürümü.

### MD-036 — Official Lock
MEB korumalı alanlar kilitli (ör. kazanımlar); öğretmen alanı esnek (ör. etkinlik).

### MD-038 — Context Cache Engine
TeacherContext bir kez yüklenir; session boyunca tüm motorlar aynı cache’i kullanır.  
`ContextCacheService` · `TeacherContextAggregate` · `TeacherContextLoaded`.  
Detay: `docs/MD-038-CONTEXT-CACHE-ENGINE.md`

### MD-039 — Workflow First
Kullanıcı belge seçmez. Workflow Engine doğru zamanda doğru belgeyi önerir.  
Detay: `docs/MD-039-WORKFLOW-FIRST.md` · `docs/MB-WFE-001-TEACHER-WORKFLOW-ENGINE-V2.md`

### MD-040 — LessonExecution SSOT
Ders Defteri LessonExecution projeksiyonudur. COMPLETED olmadan defter yok.  
Detay: `docs/MD-040-LESSON-EXECUTION-SSOT.md` · `docs/MB-DOS-003-LESSON-EXECUTION-ENGINE.md`

### MD-041 — Teacher Experience System (TXS)
Tasarım sistemi yalnızca görsel dil değildir; öğretmen akışına göre yönlendirir.  
TXS-001…010 · `docs/MB-DS-002-TEACHER-EXPERIENCE-SYSTEM.md` · `assets/js/components/txs.js`

### MD-042 — Interaction Standards
Etkileşim süreleri tek kaynaktan: `--mb-is-*` · `MiniBilgeInteraction`.  
Detay: `docs/MB-DS-003-INTERACTION-STANDARDS.md` · `docs/MD-042-INTERACTION-STANDARDS.md`

### MD-043 — Accessibility
Min font 14px · touch 44×44 · keyboard/SR · WCAG AA · dark · large text · offline.  
Detay: `docs/MB-DS-004-ACCESSIBILITY.md` · `docs/MD-043-ACCESSIBILITY.md`

### MD-044 — Motion Language
Animasyon gösteriş değil; durum bildirir. Max 300 ms.  
Detay: `docs/MB-DS-005-MOTION-LANGUAGE.md` · `docs/MD-044-MOTION-LANGUAGE.md`

### MD-045 — Teacher Experience Architecture (TXA)
Ekran odaklı değil; iş akışı odaklı. TXA-001…010.  
Detay: `docs/MB-DS-006-TEACHER-EXPERIENCE-ARCHITECTURE.md` · `docs/MD-045-TEACHER-EXPERIENCE-ARCHITECTURE.md`

### MD-046 — Universal Component Library (UCL)
Standart Mb* bileşen kataloğu; yeni UI katalog dışına çıkmaz.  
Detay: `docs/MB-DS-007-UNIVERSAL-COMPONENT-LIBRARY.md` · `docs/MD-046-UNIVERSAL-COMPONENT-LIBRARY.md` · `assets/js/components/mb-library.js`

### MD-047 — Document Operating System Core
Belge dosya değildir: entity · status · version · events · dependency graph · Document Engine.  
Detay: `docs/MB-DOS-002-DOCUMENT-OS-CORE.md` · `docs/MD-047-DOCUMENT-OS-CORE.md` · `assets/js/core/document/`

### MD-048 — Academic Operating System (Academic Kernel)
En üst mimari standart. Context · Workflow · Engines · Document · AI · Automation · Sync · Security.  
Detay: `docs/MB-AOS-001-ACADEMIC-OPERATING-SYSTEM.md` · `docs/MD-048-ACADEMIC-KERNEL.md` · `assets/js/core/aos/`

Detay: `docs/MB-IA-003-AKILLI-BELGE-URETIM-MOTORU.md` · `docs/MB-DOS-000-DOCUMENT-OS.md`
