# MİNİBİLGE ÖĞRETMEN PLATFORMU

## Gelişim Raporu v1.1

**Güncelleme:** 30 Temmuz 2026 — MB-DS-007 UCL + ilerleme panosu

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

> **İlerleme kuralı:** Her kalemde **Tamam% / Kaldı%** yazılır. Kaynak: `docs/ILERLEME.md` · `assets/data/progress.json`

| # | Kalem | Tamam | Kaldı |
|---|--------|------:|------:|
| 0 | **MB-AOS-001** Academic Kernel | **68%** | **32%** |
| 0b | **MB-VIS-001** Vizyon + ders/kaynak | **90%** / kaynak **85%** | **10%** / **15%** |
| 0c | **MB-ADR-042…045** | **100%** | **0%** |
| 0d | **MB-LIFE-001** Meslek hayatı | **35%** | **65%** |
| 1 | MB-DM-001 Domain | 100% | 0% |
| 2 | MB-ARCH-001 Mimari | 100% | 0% |
| 2b | MB-UI-001…003 | 95% | 5% |
| 2c | **MB-DS-001** Görsel | **90%** | **10%** |
| 2m | **MB-DS-002** TXS | **85%** | **15%** |
| 2n | **MB-DS-003** Interaction | **85%** | **15%** |
| 2o | **MB-DS-004** A11Y | **85%** | **15%** |
| 2p | **MB-DS-005** Motion | **100%** | **0%** |
| 2q | **MB-DS-006** TXA | **70%** | **30%** |
| 2r | **MB-DS-007** UCL | **75%** | **25%** |
| 2f | MB-IA-001 | 100% | 0% |
| 2g | MB-IA-002 | 70% | 30% |
| 2h | MB-IA-003 | 80% | 20% |
| 2i | MB-DOS-000/001 | 55% | 45% |
| 2i2 | **MB-DOS-002** Core | **70%** | **30%** |
| 2j | MD-038 Cache | 100% | 0% |
| 2k | MB-WFE-001 | 90% | 10% |
| 2l | MB-DOS-003 LEE | 85% | 15% |
| 3 | MB-DM-002 Entity | 100% | 0% |
| 4 | MB-TPM-001 | 80% | 20% |
| 5 | FAZ 6 COMP | 82% | 18% |
| 6 | MB-ARCH-002 Flutter | 0% | 100% |
| 7 | MB-DB→APP | 0% | 100% |

**DS paketi (001…007):** **84% tamam · 16% kaldı**  
**Web omurgası:** **85% tamam · 15% kaldı**

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
