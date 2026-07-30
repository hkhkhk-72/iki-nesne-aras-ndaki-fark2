# MB-AOS-001 — MiniBilge Academic Operating System (Academic Kernel)

**Sürüm:** 1.0  
**Tarih:** 30 Temmuz 2026  
**Durum:** Bağlayıcı — en üst mimari standart  
**Kod:** `MB-AOS` / Academic Kernel  
**Karar:** **MD-048**  
**Üst:** MB-DM-001 · MB-ARCH-001 · MB-DOS-000…003 · MB-WFE-001 · MB-DS-001…007  

**İlerleme:** **68% tamam** · **32% kaldı** (Flutter Feature-First paketleri · Background Sync üretim · Security Kernel derinliği) · `docs/ILERLEME.md`

> Bu belge MiniBilge’nin **en üst mimari standardıdır.**  
> Tüm motorlar bu işletim sistemi üzerinde çalışır.

---

## Temel felsefe

MiniBilge;

| Değil | Olması gereken |
|-------|----------------|
| Belge üreten uygulama | — |
| Plan hazırlayan uygulama | — |
| — | Öğretmenin bütün akademik yaşamını yöneten **Academic Operating System** |

Document OS, Workflow, LEE, DS ve AI — hepsi **Academic Kernel** altında yaşar.

---

## Academic Kernel

Kernel şunları yönetir:

1. **Context**  
2. **Workflow**  
3. **Motorlar (Engines)**  
4. **Event’ler**  
5. **Document OS**  
6. **AI**

---

## Kernel katmanları

| # | Katman | Rol |
|---|--------|-----|
| 1 | **Context Kernel** | SSOT bağlam |
| 2 | **Workflow Kernel** | Tüm işlemler workflow |
| 3 | **Engine Kernel** | TPM · PM · TWE · DOE · DRE · TRE · AIE · Calendar · Notification · AI |
| 4 | **Document Kernel** | MB-DOS-002 Document Engine |
| 5 | **Assessment Kernel** | Ölçme / AIE |
| 6 | **Teacher Workflow Kernel** | MB-WFE-001 / TWE |
| 7 | **AI Kernel** | Context-aware AI (her ekran) |
| 8 | **Automation Kernel** | Trigger → Rules → Actions → Events → Notifications → Logs |
| 9 | **Sync Kernel** | Offline First · Background Sync |
| 10 | **Security Kernel** | Erişim · Official Lock · veri koruma |

---

## 1. Context Kernel

**Single Source of Truth** alanları:

`School` · `Academic Year` · `Teacher` · `Grade` · `Class` · `Branch` · `Course` · `Student` · `Theme` · `Week` · `Lesson`

Context değişince **tüm ekranlar otomatik güncellenir** (`ContextChanged` event).

Uyum: MD-031 Context First · MD-038 Context Cache · TXA-010.

---

## 2. Workflow Kernel

Tüm işlemler **Workflow** olarak çalışır. Hard-coded ekran yoktur.

Örnek workflow’lar:

- Create Year Plan  
- Create Daily Plan  
- Lesson Execution  
- Assessment  
- BEP · IYEP · Club · Meeting · Reports · Guidance  

Uyum: MD-039 Workflow First · Rule-003.

---

## 3. Engine Kernel

| Kod | Motor |
|-----|--------|
| **TPM** | Teaching Program Engine |
| **PM** | Planning Engine |
| **TWE** | Teacher Workflow Engine |
| **DOE** | Document Orchestrator (Document Engine) |
| **DRE** | Dependency Resolver |
| **TRE** | Template Rendering Engine |
| **AIE** | Assessment Intelligence Engine |
| — | Calendar Engine |
| — | Notification Engine |
| — | AI Engine |

Motorlar Kernel DI üzerinden çözülür; birbirine doğrudan hard-wire edilmez.

---

## 4–6. Document · Assessment · Teacher Workflow

- **Document Kernel** = MB-DOS-002 / MD-047  
- **Assessment Kernel** = ölçme paneli + AIE (kademeli)  
- **Teacher Workflow Kernel** = MB-WFE-001  

---

## 7. AI Kernel

Her ekranda **Context Aware AI** vardır. AI otomatik bilir:

- ekranın amacını  
- belgeyi  
- öğretmeni · sınıfı · dersi  

Uyum: TXS-005 AI Everywhere · MbFloatingAI.

---

## 8. Automation Kernel

```
Trigger → Rules → Actions → Events → Notifications → Logs
```

---

## 9–10. Sync · Security

- **Offline First** zorunlu  
- **Background Sync** zorunlu  
- Official Lock (MD-036) · erişim politikaları (Security Kernel)

---

## Event Bus (Global)

Her işlem event üretir. Global Event Bus kullanılır.

| Event |
|-------|
| `ContextChanged` |
| `DocumentCreated` |
| `LessonStarted` |
| `LessonCompleted` |
| `AttendanceTaken` |
| `AssessmentCreated` |
| `WorkflowCompleted` |
| `NotificationSent` |
| `AICompleted` |
| `ExportFinished` |
| `ArchiveCompleted` |
| `SyncCompleted` |

Document OS event’leri (MD-047) bu bus’a köprülenir.

---

## Navigation (Context Driven UI)

```
Dashboard → Workflow → Task → Document → Execution → Assessment → Archive
```

Hard-coded menü akışı değil; Kernel context + workflow durumu UI’yı besler.

---

## Bağlayıcı kurallar

1. Hiçbir modül bağımsız değildir — haberleşme **yalnızca Kernel** üzerinden.  
2. **Global Event Bus** zorunlu.  
3. **Dependency Injection** zorunlu.  
4. **Repository Pattern** zorunlu.  
5. **Feature First Architecture** (Flutter ARCH-002).  
6. **Offline First** zorunlu.  
7. **Background Sync** zorunlu.  
8. **Context Driven UI** zorunlu.  

**Academic Kernel MiniBilge’nin en üst mimari standardıdır.**

---

## Uygulama

| Yol | Rol |
|-----|-----|
| `assets/js/core/aos/` | Web Academic Kernel runtime |
| `core/aos/README.md` | Flutter Feature-First haritası |
| `AcademicKernel.boot()` | Sayfa açılışında tek giriş |

---

## Kabul

- [x] Anayasa + MD-048  
- [x] 10 katman tanımlı  
- [x] Global Event Bus + DI container  
- [x] Context / Workflow / Document / AI köprüleri  
- [x] Automation Engine iskeleti  
- [ ] Flutter Feature-First paket ağacı — kaldı  
- [ ] Security Kernel üretim derinliği — kaldı  
- [ ] Tüm legacy ekranların Kernel boot’una bağlanması — kademeli  

---

*Yeni motor / modül PR’ında: hangi Kernel katmanına bağlandığı belirtilir.*
