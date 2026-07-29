# MİNİBİLGE ÖĞRETMEN PLATFORMU

## Gelişim Raporu v1.1

**Güncelleme:** 29 Temmuz 2026 — Strateji raporu ile uyumlu

---

## Proje Felsefesi

> *"Önce Güvenilir Bilgi Motoru, Sonra Akıllı Algoritma, En Son Arayüz."*

---

## Dört Ana Motor

| # | Motor | Görev | Durum |
|---|-------|-------|-------|
| 1 | **Öğretim Programı Motoru** | TYMM öğrenme çıktıları, süreç bileşenleri, içerik çerçeveleri | 1. sınıf 3 ders |
| 2 | **Takvim Motoru** | MEB takvimi, tatiller, belirli gün/haftalar | 2025-26, 2026-27 |
| 3 | **Plan Motoru** | Yıllık + günlük plan otomasyonu (sistemin beyni) | Aktif |
| 4 | **Evrak Motoru** | Word/PDF/HTML resmî belge çıktısı | HTML/Word aktif |

Destek: **Kontrol Motoru** — eksik bilgi ve plan doğrulama

---

## UX Akışı

**Ana Sayfa → Sınıf → Ders → Bilgiler → Üret**

Yıllık plan modülünde 4 adımlı sihirbaz uygulanmıştır.

---

## Evrak Envanteri

38 resmî evrak tanımlı (`assets/data/evrak-envanteri.json`):
- 22 aktif
- 2 kısmi
- 14 yakında

Kategoriler: Planlar, Zümre, Özel Eğitim/Rehberlik, Kulüp, Ölçme, Veli/İdare, Sınıf Evrakları

---

## Yol Haritası (Domain-First → Kurumsal Ürün)

1. **MB-DM-001** Domain Model ✅
2. **MB-ARCH-001** Mimari Freeze ✅
2b. **MB-UI-001** UI/UX v2 + TWE ✅
2c. **MB-DS-001** Tasarım Sistemi ✅
2d. **MB-UI-002** Sınıf odaklı ana ekran + hub ✅ → `docs/MB-UI-002-SINIF-ODAKLI-ANA-EKRAN.md`
2e. **MD-026 / MB-UI-003** Sonraki nesil IA (ÖğretmenEvrak referansı, kopya değil) ✅
2f. **MB-IA-001** Bilgi mimarisi — iş akışı merkezli 8 modül ✅ → `docs/MB-IA-001-BILGI-MIMARISI.md`
2g. **MB-IA-002** Belge yaşam döngüsü 🔒 Architecture Freeze → `docs/MB-IA-002-BELGE-YASAM-DONGUSU.md`
2h. **MB-IA-003** Akıllı Belge Üretim Motoru ✅ → `docs/MB-IA-003-AKILLI-BELGE-URETIM-MOTORU.md`
2i. **MB-DOS-000/001** Document OS + DNA katalog tohumu 🔵
2j. **MD-038** Context Cache Engine ✅ → `docs/MD-038-CONTEXT-CACHE-ENGINE.md`
2k. **MB-WFE-001** Teacher Workflow Engine v2 + MD-039 Workflow First ✅
2l. **MB-DOS-003** Lesson Execution Engine + MD-040 SSOT ✅ → `docs/MB-DOS-003-LESSON-EXECUTION-ENGINE.md`
2m. **MB-DS-002 / MD-041** Teacher Experience System (TXS) ✅ → `docs/MB-DS-002-TEACHER-EXPERIENCE-SYSTEM.md`
2n. **MB-DS-003 / MD-042** Interaction Standards ✅ → `docs/MB-DS-003-INTERACTION-STANDARDS.md`
2o. **MB-DS-004 / MD-043** Accessibility ✅ → `docs/MB-DS-004-ACCESSIBILITY.md`
2p. **MB-DS-005 / MD-044** Motion Language ✅ → `docs/MB-DS-005-MOTION-LANGUAGE.md`
3. **MB-DM-002** Entity Detay Spesifikasyonu ✅ → `docs/MB-DM-002-ENTITY-DETAY-SPESIFIKASYONU.md`
3b. **Günlük Kazanımlar** (sınıf defteri) + Kazanım Cepte UX esini → `docs/ESIN-KAZANIM-CEPTE.md`
4. **MB-TPM-001** 1. sınıf Türkçe domain ✅ → `docs/MB-TPM-001-SINIF1-TURKCE-DOMAIN-UYGULAMASI.md`
5. **FAZ 6 / MB-COMP** Component Architecture 🔵 → `docs/FAZ-6-COMPONENT-ARCHITECTURE.md`
6. **MB-ARCH-002** Flutter Proje Mimarisi *(sıradaki)*
7. **MB-DB-001** → MB-JSON-001 → MB-ALG-001 → MB-APP-001

> MD-025: Everything is a Component. Ana ekran: sınıf sekmeleri → hub (UI-002). Components Lab: `modules/components-lab.html`.

Detay: `docs/STRATEJI-RAPORU.md`

---

## Teknik Mimari

```
assets/js/core/
  curriculum-engine.js   → Öğretim Programı Motoru
  calendar-engine.js     → Takvim Motoru
  plan-engine.js         → Plan Motoru (yıllık + günlük)
  evrak-engine.js        → Evrak Motoru
  validation-engine.js   → Kontrol Motoru
  wizard.js              → Üretim sihirbazı UX
```
