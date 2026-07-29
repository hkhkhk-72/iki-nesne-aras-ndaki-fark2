# MB-DOS-003 — Lesson Execution Engine (LEE)

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı Document OS modülü  
**Kod:** `MB-LEE`  
**Karar:** MD-040 — LessonExecution is Single Source of Truth  
**Üst:** MB-DOS-000 · MB-WFE-001 · MD-038 · MD-039 · MB-IA-002

> MiniBilge’de **Ders Defteri bağımsız bir belge değildir.**  
> Merkezde `LessonExecution` domain entity’si vardır. Tamamlanınca kayıtlar **otomatik** doğar.

---

## 1. Otomatik üretilenler (LessonExecution COMPLETED)

| Çıktı | Açıklama |
|-------|----------|
| Class Log | Ders Defteri kaydı |
| Attendance Record | Yoklama |
| Evidence Records | Kanıt / öğrenme kanıtı |
| Assessment Updates | Ölçme güncellemesi |
| Teacher Reflection | Öğretmen yansıtması |
| Workflow Completion | TWE görevi kapanır |

---

## 2. Entity — LessonExecution

| Field | Tip | Not |
|-------|-----|-----|
| `id` | string | `lex:{timestamp}` |
| `teacherId` | string | Context Cache |
| `classId` | string | örn. `1/A` |
| `lessonId` | string | ders id (`turkce`…) |
| `dailyPlanId` | string\|null | bağlı günlük plan |
| `workflowId` | string\|null | TWE snapshot / task |
| `date` | ISO date | |
| `startTime` | ISO\|null | |
| `endTime` | ISO\|null | |
| `executionStatus` | enum | aşağıda |
| `attendanceId` | string\|null | |
| `evidenceIds` | string[] | |
| `assessmentIds` | string[] | |
| `teacherReflection` | string | |
| `aiRecommendation` | string | ReflectionAI |
| `nextLessonAction` | string | DynamicShift / AI |

### ExecutionStatus

`PLANNED` · `STARTED` · `COMPLETED` · `PARTIAL` · `POSTPONED` · `CANCELLED`

---

## 3. LessonExecutionEngine

Sorumluluklar:

- Start lesson  
- Connect Daily Plan  
- Connect Attendance  
- Generate Evidence  
- Update Assessment  
- Create Class Log  
- Trigger Dynamic Shift  
- Notify Workflow Engine  

### Alt motorlar

| Motor | Rol |
|-------|-----|
| **ReflectionAI** | Öğretmen yansımasını analiz → sonraki ders önerisi |
| **EvidenceCollector** | Kanıt kayıtları üretir |
| **DynamicShiftEngine** | POSTPONED / kayma → takvim + workflow |
| **LessonReplay** | Geçmiş yürütmeyi yeniden oynatma / özet |

---

## 4. Domain Events

| Event |
|-------|
| `LessonStarted` |
| `LessonCompleted` |
| `LessonPostponed` |
| `LessonCancelled` |
| `ReflectionSaved` |
| `EvidenceGenerated` |
| `AssessmentUpdated` |
| `LessonArchived` |

WFE ile paylaşılan: `LessonStarted`, `LessonCompleted` → `WorkflowEngine.emit`.

---

## 5. Kurallar (MD-040)

| Kod | Kural |
|-----|--------|
| **Rule-001** | LessonExecution sistemin tek doğruluk kaynağıdır (SSOT) |
| **Rule-002** | Hiçbir belge manuel oluşturulmaz |
| **Rule-003** | LessonExecution tamamlanmadan Ders Defteri oluşturulamaz |
| **Rule-004** | POSTPONED → Workflow Engine + Calendar Engine otomatik tetiklenir |
| **Rule-005** | ReflectionAI sonraki ders planını optimize eder |

---

## 6. Dosyalar

| Dosya | Rol |
|-------|-----|
| `assets/js/core/lesson-execution-engine.js` | Ana motor |
| `assets/js/core/reflection-ai.js` | ReflectionAI |
| `assets/js/core/evidence-collector.js` | EvidenceCollector |
| `assets/js/core/dynamic-shift-engine.js` | DynamicShift |
| `assets/js/core/lesson-replay.js` | LessonReplay |
| `modules/ders-yurutme.html` | Öğretmen yüzeyı |
| `docs/MD-040-LESSON-EXECUTION-SSOT.md` | Karar özeti |

---

## 7. Akış

```
PLANNED
  → start() → STARTED (+ LessonStarted → WFE)
  → complete() → COMPLETED
       → Class Log + Attendance + Evidence + Assessment
       → ReflectionAI → nextLessonAction
       → Workflow Completion (+ LessonCompleted)
  → postpone() → POSTPONED → DynamicShift → Calendar/WFE
  → cancel() → CANCELLED
```

---

*Ders Defteri = LessonExecution projeksiyonu. Manuel “defter oluştur” yok.*
