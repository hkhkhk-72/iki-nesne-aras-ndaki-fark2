# MD-039 — Workflow First

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** 🔒 Bağlayıcı freeze  
**Üst:** MB-WFE-001 · MB-IA-001 · MD-038

> MiniBilge’de kullanıcı belge seçmez.  
> **Workflow Engine** doğru zamanda doğru belgeyi önerir ve üretim sürecini yönetir.

---

## Karar

1. Giriş noktası menü/belge kataloğu değil; **zamanlı iş listesi**dir.  
2. Belge üretimi Workflow → Document Engine zinciriyle tetiklenir (Rule-003).  
3. Context Cache zorunludur (Rule-002 / MD-038).  
4. Takvim senkronu zorunludur (Rule-005).  

Detay: `docs/MB-WFE-001-TEACHER-WORKFLOW-ENGINE-V2.md`
