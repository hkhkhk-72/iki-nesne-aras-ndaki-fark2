# MB-WFE-001 — Teacher Workflow Engine v2.0

**Sürüm:** 2.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı modül spesifikasyonu  
**Kod:** `MB-TWE` / `MB-WFE`  
**Karar:** MD-039 — Workflow First  
**Üst:** MB-IA-001 · MD-038 Context Cache · MB-IA-002 · Calendar Engine

> Öğretmeni menüler arasında dolaştırma.  
> Doğru zamanda doğru görevi göster; belge üretimini workflow tetiklesin.

---

## 1. Amaç

Teacher Workflow Engine (TWE), eğitim-öğretim yılı boyunca resmî ve pedagojik süreçleri **zaman ekseninde** yöneten merkezi orkestrasyon katmanıdır.

- Günlük / haftalık / aylık / dönemlik görevleri otomatik planlar  
- Belge üretimini doğru zamanda tetikler  
- TPM, TCM, Plan, Document, Assessment, Archive motorlarını koordine eder  
- Context Cache (MD-038) üzerinden çalışır — aynı bilgiyi tekrar sormaz  

---

## 2. Orkestrasyon zinciri

```
Teacher Context (Cache)
  → Calendar Engine
  → Workflow Engine
  → Task Engine (SmartTask)
  → Document Engine
  → Assessment Engine
  → Archive Engine
```

---

## 3. Alt motorlar

### 3.1 SmartTaskEngine
- Günlük / haftalık / dönemlik görev üretir  
- Öncelik puanı hesaplar (`priority`: 1–100)  

### 3.2 DeadlineEngine
- Resmî teslim tarihlerini takip eder  
- Yaklaşan görevleri bildirir  
- Gecikenleri `overdue` işaretler  

### 3.3 ProgressEngine
- Modül tamamlanma yüzdesi  
- Dashboard ilerleme kartları  
- Öğretmen performans paneli beslemesi  

---

## 4. Workflow aşamaları

| # | Aşama | Örnek çıktılar |
|---|--------|----------------|
| 1 | Eğitim yılı hazırlığı | Yıllık plan, sınıf listesi, zümre sene başı |
| 2 | Haftalık planlama | Haftalık/günlük planlar, kazanımlar |
| 3 | Günlük ders akışı | Günlük plan, materyal |
| 4 | Ders sonrası kayıt | Sınıf defteri, yoklama, gözlem |
| 5 | Dönem sonu işlemleri | Zümre ara, ölçme raporları |
| 6 | Yıl sonu arşivleme | Arşiv, sene sonu tutanak |

Aktif aşama Calendar Engine + bugünün tarihinden türetilir.

---

## 5. Domain event’leri

| Event | Ne zaman |
|-------|----------|
| `TeacherDayStarted` | Gün başı / dashboard açılışı |
| `TeacherWeekStarted` | Hafta değişimi |
| `LessonStarted` | Ders akışı başladı |
| `LessonCompleted` | Ders tamamlandı |
| `DocumentGenerated` | Belge üretildi |
| `DocumentApproved` | Belge onaylandı |
| `AssessmentCompleted` | Ölçme tamamlandı |
| `ArchiveCreated` | Arşiv oluşturuldu |

Event bus: `WorkflowEngine.emit` / `WorkflowEngine.on` (+ `window` CustomEvent `mb:*`).

---

## 6. Kurallar

| Kod | Kural |
|-----|--------|
| **Rule-001** | Görevler öğretmene zamanında gösterilir |
| **Rule-002** | Aynı bilgi ikinci kez istenmez (MD-038) |
| **Rule-003** | Belge üretimi manuel değil; workflow tetikler |
| **Rule-004** | Tamamlanan görevler ilgili belgeleri günceller |
| **Rule-005** | Tüm süreçler Calendar Engine ile senkron |

---

## 7. MD-039 — Workflow First

Kullanıcı belge seçmez.  
Workflow Engine doğru zamanda doğru belgeyi **önerir** ve üretim sürecini yönetir.

IA-001 ile uyum: “Öğretmen işi seçer” → iş listesi TWE’den gelir.

---

## 8. Dosyalar

| Dosya | Rol |
|-------|-----|
| `assets/js/core/workflow-engine.js` | Orkestrasyon + event’ler |
| `assets/js/core/smart-task-engine.js` | Görev üretimi |
| `assets/js/core/deadline-engine.js` | Teslim / gecikme |
| `assets/js/core/progress-engine.js` | İlerleme % |
| `docs/MD-039-WORKFLOW-FIRST.md` | Karar özeti |

---

## 9. Dashboard sözleşmesi

Ana ekran “Bugün” bölümü TWE’den beslenir:

- `stage` — aktif aşama  
- `tasks[]` — öncelikli görevler  
- `deadlines[]` — yaklaşan / geciken  
- `progress` — modül yüzdeleri  

---

*v1 UI-001’deki TWE kontrol listesi bu sürümle değiştirilir.*
