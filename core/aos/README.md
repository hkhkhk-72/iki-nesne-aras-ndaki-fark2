# core/aos — Academic Operating System (Flutter haritası)

**Anayasa:** `docs/MB-AOS-001-ACADEMIC-OPERATING-SYSTEM.md` (MD-048)  
**Web runtime:** `assets/js/core/aos/`

```
core/aos/
  kernel/           # AcademicKernel boot
  context/          # Context Kernel
  workflow/         # Workflow Kernel
  engines/          # Engine Kernel adapters
  document/         # → core/document (DOS-002)
  assessment/
  ai/
  automation/
  sync/
  security/
  di/               # Dependency Injection
  bus/              # Global Event Bus

# Feature First (ARCH-002)
apps/minibolge_ogretmen/features/
  dashboard/
  workflow/
  document/
  lesson_execution/
  assessment/
  archive/
```

Web `AcademicKernel` API adları Flutter port’ta korunur.
