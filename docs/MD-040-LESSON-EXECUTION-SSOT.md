# MD-040 — LessonExecution is Single Source of Truth

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** 🔒 Bağlayıcı freeze  
**Üst:** MB-DOS-003 · MB-WFE-001 · MD-039

> Ders Defteri bağımsız belge değildir.  
> **LessonExecution** tek doğruluk kaynağıdır; belgeler ondan türetilir.

---

## Karar

1. Class Log / yoklama / kanıt / ölçme güncellemesi LessonExecution tamamlanınca üretilir.  
2. Manuel belge oluşturma yasaktır (Rule-002).  
3. COMPLETED olmadan Ders Defteri yoktur (Rule-003).  
4. POSTPONED takvim + workflow’u kaydırır (Rule-004).  

Detay: `docs/MB-DOS-003-LESSON-EXECUTION-ENGINE.md`
