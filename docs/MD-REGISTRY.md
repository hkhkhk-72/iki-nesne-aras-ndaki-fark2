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

### Numara notu

Taslakta Document OS ilkeleri MD-025…030 diye anılmıştı.  
**MD-025 / MD-026** zaten dolu olduğu için Document OS ilkeleri **MD-031…036** olarak donduruldu. Anlam aynıdır.

**MD-038** — Context Cache: Load Once — Use Everywhere.  
**MD-039** — Workflow First: belge seçilmez; TWE doğru işi zamanında önerir.  
**MD-040** — LessonExecution tek doğruluk kaynağı; Ders Defteri bağımsız belge değildir.  
**MD-041** — Teacher Experience System: Context/Workflow First, Zero Load, One Click, AI Everywhere, Never Empty, Action Dashboard, AI Confidence.

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

Detay: `docs/MB-IA-003-AKILLI-BELGE-URETIM-MOTORU.md` · `docs/MB-DOS-000-DOCUMENT-OS.md`
