# MB-COMP-003 — Universal Table

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Spesifikasyon (FAZ 6 · P0)  
**Bağımlılık:** MB-COMP-001 · MB-DS-001 · MB-COMP-002

> Tek tablo. Liste, evrak, plan satırları, öğrenci seçimi — hepsi bu bileşen.

---

## 1. Özellikler

| Özellik | Zorunlu |
|---------|---------|
| Filtreleme | ✓ |
| Arama | ✓ |
| Sıralama | ✓ |
| Çoklu seçim | ✓ |
| Excel dışa aktarma | ✓ |
| Word dışa aktarma | ✓ |
| PDF dışa aktarma | ✓ |
| Yazdır | ✓ |
| Boş durum | ✓ |
| Mobil yatay kaydırma | ✓ |

---

## 2. API

```ts
UniversalTable({
  columns: [{ id, label, sortable?, width?, render?(row) }],
  rows: object[],
  rowKey: string | (row)=>string,
  selectable?: boolean,
  selectedIds?: string[],
  onSelect?(ids),
  filterable?: boolean,
  searchable?: boolean,
  searchPlaceholder?: string,
  onSort?(columnId, dir),
  exportName?: string,
  emptyText?: string
})
```

---

## 3. Kullanım yerleri

- Evrak Merkezi listesi  
- Sınıf listesi / yoklama  
- Öğrenci seçici (BEP/İYEP)  
- DocumentBuilder içi tablolar  
- Rapor satırları  

---

## 4. Web v1

Arama + sıralama + yazdır + HTML dışa aktarma.  
Excel/Word/PDF: export kancaları (COMP-002 ExportMenu ile paylaşılır).

---

## 5. Kabul

- Components Lab’da örnek veri ile çalışır.  
- En az bir üretim ekranı (Evrak listesi veya sınıf listesi) tabloya geçer.
