# MD-041 — Teacher Experience System (TXS)

**Durum:** ✅ freeze  
**Belge:** `docs/MB-DS-002-TEACHER-EXPERIENCE-SYSTEM.md`  
**Kod:** TXS-001 … TXS-010

## Özet

MiniBilge tasarım sistemi yalnızca görsel dil (MB-DS-001) değildir.  
Öğretmen deneyimi anayasası TXS’tir: bağlam, iş akışı, düşük bilişsel yük, tek tık, AI her yerde, progressive disclosure, asla boş ekran, aksiyon dashboard, veri merkezli belge üretimi, AI güven etiketi.

## Uygulama

| Parça | Dosya |
|-------|--------|
| Anayasa | `MB-DS-002-TEACHER-EXPERIENCE-SYSTEM.md` |
| Runtime | `assets/js/components/txs.js` |
| Stil | `assets/css/ds.css` (`.txs-*`) |
| Layout hook | `assets/js/navigation.js` → `MiniBilgeTxs.attach` |

## İlişkili kararlar

MD-031 Context First · MD-032 Zero Input · MD-038 Context Cache · MD-039 Workflow First · MD-040 LessonExecution SSOT
