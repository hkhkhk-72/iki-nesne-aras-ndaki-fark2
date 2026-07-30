# core/document — Document OS Core (Flutter haritası)

**Anayasa:** `docs/MB-DOS-002-DOCUMENT-OS-CORE.md` (MD-047)  
**Web runtime (şimdi):** `assets/js/core/document/`

Bu klasör **MB-ARCH-002** Flutter paket ağacına taşınacak çekirdek sınırını işaretler.

```
core/document/
  domain/          # Document entity, status, events
  application/     # use cases (Create…Validate)
  infrastructure/  # Isar repository, sync
  presentation/    # Riverpod notifiers

# Hedef paketler (ARCH-002)
packages/mb_domain/...
packages/mb_application/...
packages/mb_data/...
```

Web v1 motoru `assets/js/core/document/engine.js` ile aynı sözleşmeyi taşır; Flutter port API adlarını korur.
