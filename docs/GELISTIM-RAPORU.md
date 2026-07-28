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

## Yol Haritası (Domain-First)

1. **MB-DM-001** Domain Model ✅ — `docs/MB-DM-001-OGRETIM-PROGRAMI-DOMAIN-MODELI.md`
2. **MB-DM-002** Entity Detay Spesifikasyonu
3. MB-TPM-001 → MB-DB-001 → MB-JSON-001 → MB-ALG-001 → MB-APP-001

> JSON en son ürün olacaktır. Mevcut curriculum JSON’ları geçici keşif verisidir.

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
