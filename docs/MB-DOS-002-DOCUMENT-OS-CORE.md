# MB-DOS-002 — Document Operating System Core

**Sürüm:** 1.0  
**Tarih:** 30 Temmuz 2026  
**Durum:** Bağlayıcı mimari anayasa  
**Kod:** `MB-DOC` / Document Engine  
**Karar:** **MD-047**  
**Üst:** MB-DOS-000 · MB-IA-002 · MB-IA-003 · MB-WFE-001 · MD-031…036 · MD-038 · MD-039  

> **Numara notu:** Taslak başlık *MB-DOS-003* idi.  
> **MB-DOS-003** zaten **Lesson Execution Engine (LEE / MD-040)** olduğu için bu anayasa **MB-DOS-002** olarak kaydedildi. Anlam aynıdır: Document OS Core.

**İlerleme:** **70% tamam** · **30% kaldı** (Flutter Riverpod/Isar · Background Sync derinliği) · `docs/ILERLEME.md`

---

## Amaç

MiniBilge’de **belge dosya değildir.**

| İlke | Anlam |
|------|--------|
| Canlı | Durum, sürüm, olay geçmişi taşır |
| İlişkili | Bağımsız belge yoktur — Dependency Graph |
| Versiyonlu | Her anlamlı değişim sürüm üretir |
| Event üretir | Event Bus üzerinden yayınlanır |
| Workflow içinde yaşar | Hard-coded üretim yok; TWE → Document Engine |

Bu karar MiniBilge’nin **resmi mimari standardıdır.** Tüm geliştirmeler buna göre yapılır.

---

## Document Entity

Her belge şu alanlara sahiptir:

| Alan | Tip | Not |
|------|-----|-----|
| `id` | string | Stabil kimlik |
| `documentType` | string | DNA `id` / katalog tipi |
| `title` | string | |
| `status` | enum | Document Status |
| `version` | number | 1…n |
| `createdAt` | ISO | |
| `updatedAt` | ISO | |
| `createdBy` | string | öğretmen id / ad |
| `contextId` | string | Context Cache oturum / aggregate |
| `schoolYear` | string | örn. `2025-2026` |
| `grade` | string | sınıf |
| `classroom` | string | sınıf etiketi |
| `branch` | string | şube |
| `dependencies` | string[] \| DependencyRef[] | bağımlı belge / veri id’leri |
| `events` | DocumentEvent[] | gömülü olay günlüğü (özet) |
| `metadata` | object | DNA / motor çıktıları |
| `tags` | string[] | |

---

## Document Status

```
Draft
Generating
WaitingApproval
Approved
Rejected
Archived
Expired
Deleted
```

UI rozeti: **MbDocumentStatus** (MB-DS-007).  
IA-002 eski durumları bu enum’a map edilir (`draft` → `Draft`, `archived` → `Archived`…).

---

## Document Workflow

```
Create → Validate → Preview → Customize → Generate
  → Export → Print → Share → Archive → Sync → Version
```

IA-002 freeze sırası bozulmaz; bu liste **Document Engine** iş adımlarıdır.

---

## Document Events

| Event | Ne zaman |
|-------|----------|
| `DocumentCreated` | Create |
| `DocumentValidated` | Validate OK |
| `DocumentGenerated` | Generate |
| `DocumentPreviewed` | Preview |
| `DocumentUpdated` | Update |
| `DocumentApproved` | Approved |
| `DocumentRejected` | Rejected |
| `DocumentArchived` | Archive |
| `DocumentVersionCreated` | Version bump |
| `DocumentExported` | Export |
| `DocumentPrinted` | Print |
| `DocumentShared` | Share |
| `DocumentDeleted` | soft delete → Deleted |

**Her belge event üretir. Event Bus kullanılır.**

---

## Katmanlar

```
Workflow Engine (MD-039)
        ↓
  Document Engine   ← bu belge
        ↓
  Services + Repository
        ↓
  Offline store (web: localStorage · Flutter: Isar)
        ↓
  Sync Engine (Background Sync)
```

### Klasör

| Hedef | Yol |
|-------|-----|
| Web runtime | `assets/js/core/document/` |
| Flutter iskelet haritası | `core/document/` → ARCH-002 paketleri |

### Servisler

| Servis | Görev |
|--------|--------|
| `DocumentLifecycleService` | durum geçişleri |
| `DocumentValidationService` | DNA / alan doğrulama |
| `DocumentDependencyService` | Dependency Graph |
| `DocumentVersionService` | sürüm |
| `DocumentArchiveService` | arşiv |
| `DocumentExportService` | HTML/Word/PDF/print |

### Repository

`IDocumentRepository` — `get` · `list` · `save` · `delete` · `findByType` · `findDependents`

### Use cases

`CreateDocument` · `UpdateDocument` · `GenerateDocument` · `ArchiveDocument` · `ExportDocument` · `ValidateDocument`

### State (Flutter)

Riverpod Notifier — ARCH-002’de.

### Offline First

Flutter: **Isar**. Web prototip: localStorage + Offline Sync kuyruğu.

### Sync Engine

Background Sync — değişiklik kuyruğu → sunucu (kademeli).

---

## UI (Mb*)

| Bileşen | Rol |
|---------|-----|
| Document Status Badge | `MbDocumentStatus` |
| Version Timeline | `MbVersionHistory` / `MbDocVersionTimeline` |
| Dependency Viewer | `MbDependencyViewer` |
| Workflow Timeline | `MbDocWorkflowTimeline` |

---

## Bağlayıcı kurallar

1. **Hiçbir belge birbirinden bağımsız değildir** — Dependency Graph.  
2. **Her belge event üretir** — Event Bus.  
3. **Belge oluşturma yalnızca Workflow Engine üzerinden** (Rule-003 / MD-039).  
4. **Hard-coded belge oluşturulmaz.**  
5. **Tüm belge tipleri Document Engine üzerinden üretilir.**  
6. LEE (MB-DOS-003) Document Engine’e bağlıdır; Ders Defteri bağımsız belge değildir (MD-040).

---

## Uygulama (web v1)

| Dosya | Rol |
|-------|-----|
| `assets/js/core/document/event-bus.js` | Event Bus |
| `assets/js/core/document/repository.js` | IDocumentRepository |
| `assets/js/core/document/services.js` | Lifecycle…Export |
| `assets/js/core/document/engine.js` | Document Engine + use cases |
| `core/document/README.md` | Flutter klasör haritası |

---

## Kabul

- [x] Anayasa + MD-047  
- [x] Entity / Status / Workflow / Events donduruldu  
- [x] Web Document Engine + Event Bus + Repository  
- [x] Use case API  
- [x] Dependency Graph servisi  
- [ ] Flutter Riverpod + Isar — kaldı  
- [ ] Background Sync üretim derinliği — kaldı  
- [ ] Tüm legacy `addDocument` çağrıları Engine’e migrate — kademeli  

---

*Yeni belge tipi = DNA (DOS-001) + Document Engine; ekran kopyalamak değil.*
