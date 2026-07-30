# MB-DOS-000 — Document Operating System

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı ürün tanımı  
**Üst:** MB-IA-001 · MB-IA-002 (freeze) · MB-IA-003

> MiniBilge Öğretmen = **Document OS** (Document Operating System).  
> Sıradan mobil uygulama değildir; çekirdek mimarisi belgedir.

---

## 1. Tanım

Document OS, aynı veri çekirdeğinden yüzlerce resmî belgeyi tutarlı üreten, doğrulayan, önizleyen, dışa aktaran ve arşivleyen işletim katmanıdır.

---

## 2. Güçler

| Güç | İlke |
|-----|------|
| Single Source of Truth | Okul/öğretmen bir kez |
| Sıfıra yakın giriş | MD-032 / MD-033 |
| Dinamik üretim | MD-034 + DNA |
| Resmî uyumluluk | MD-036 Official Lock |
| AI hazır | Preview sonrası Enhancement kancası |

---

## 3. Motor yığını

Teacher Context → Document Context → Validation → Generation → Preview → AI Enhancement → Export → Archive → Sync

---

## 4. Katalog

Tüm belgeler **MB-DOS-001** kataloğunda DNA ile tanımlıdır.  
Kod iskeleti: `assets/data/document-catalog.json`

## 5. Document OS Core

Bağlayıcı çekirdek: **`docs/MB-DOS-002-DOCUMENT-OS-CORE.md`** (MD-047)  
Runtime: `assets/js/core/document/` · Event Bus · Dependency Graph · Document Engine

> Belge dosya değildir. Hard-coded üretim yoktur. Workflow → Document Engine.

---

*Yeni belge eklemek = kataloğa DNA satırı + şablon + Document Engine (ekran/modül kopyalamak değil).*
