# MB-ARCH-002 — Flutter Proje Mimarisi

**Sürüm:** 0.1 (iskelet)  
**Tarih:** 29 Temmuz 2026  
**Durum:** Sıradaki büyük hedef — FAZ 6 sonrası  
**Üst:** FAZ-6 · MB-COMP-001…008 · MB-DM-001 · MB-DS-001

> Mevcut `MB-ARCH-001` web platform freeze’tir.  
> Bu belge **Flutter** Clean Architecture paketini tanımlar.

---

## 1. Hedef

Uzun yıllar sürdürülebilir, test edilebilir, modüler bir Flutter ürün iskeleti:

- klasör / paket yapısı  
- Domain / Application / Infrastructure  
- Riverpod durum yönetimi  
- Repository + servis katmanı  
- yerel veritabanı ve senkronizasyon  
- `mb_ui` widget’ları = COMP kataloğunun Flutter karşılığı  

---

## 2. Önerilen paketler

```
packages/
  mb_domain/         # entities, value objects (DM-001/002)
  mb_application/    # use cases, ports
  mb_data/           # repositories, local DB, sync
  mb_ui/             # Design System + COMP widgets
apps/
  minibolge_ogretmen/
```

---

## 3. Önkoşul

FAZ 6 bileşen sözleşmeleri (COMP-001…008) yeterince olgunlaşmadan Flutter iskeleti dondurulmaz.

Prop adları web `MiniBilgeComponents.*` ile hizalanır.

---

## 4. Bu belgenin sonraki sürümü

v1.0’da: klasör ağacı, Riverpod provider haritası, DB seçimi (**Isar**), sync stratejisi, modül sınırları.  
Document OS Core (MD-047): `core/document/` → domain / application / infrastructure / presentation.  
Academic Kernel (MD-048): `core/aos/` + Feature First `features/*`.

*Şimdilik yer tutucu — FAZ 6 + DOS-002 + AOS-001 web sözleşmesi olgunlaştıkça doldurulur.*
