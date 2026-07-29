# MB-COMP-002 — Universal Document Builder

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Spesifikasyon (FAZ 6 · P0)  
**Bağımlılık:** MB-COMP-001 · MB-BM · MB-DS-001

> Platformun kalbi. Her belge aynı editörü, tabloyu, yazdırmayı ve PDF motorunu kullanır.

---

## 1. Amaç

Modül başına özel belge editörü yazılmaz.

`DocumentBuilder` şunları standartlaştırır:

- üst bilgi (okul / öğretmen / sınıf / şube / tarih) — COMP-008 profilinden  
- gövde blokları (başlık, paragraf, tablo, imza, ek)  
- durum (COMP-005)  
- dışa aktarma (HTML / Word / PDF / Yazdır)  
- AI düzelt / üret (COMP-004)

---

## 2. API (sözleşme)

```ts
DocumentBuilder({
  documentType: string,      // örn. 'yillik-plan' | 'bep' | 'tutanak'
  motorId: string,           // MB-YPM | MB-BM | …
  context: {
    sinif, ders, sube, egitimYili, school, teacher
  },
  blocks: DocumentBlock[],
  status: 'ready' | 'editing' | 'updated' | 'missing',
  onChange(blocks),
  onExport(format)           // 'html' | 'word' | 'pdf' | 'print'
})
```

### DocumentBlock

| type | Alanlar |
|------|---------|
| `heading` | `level`, `text` |
| `paragraph` | `text`, `align?` |
| `table` | `columns`, `rows` → UniversalTable veri modeli |
| `meta` | key/value çiftleri |
| `signature` | `roles[]` |
| `aiHint` | öneri metni (opsiyonel) |

---

## 3. Akış

```
Motor formu tamamlanır
  → DocumentBuilder.mount
    → blocks üretilir (sınıf/ders’e göre farklı içerik)
      → öğretmen düzenler
        → ExportMenu / PrintPreview / PdfViewer
```

1. sınıf Türkçe yıllık plan ≠ 4. sınıf Türkçe yıllık plan — içerik motordan gelir; builder şablonu ortaktır.

---

## 4. Web iskeleti

`MiniBilgeComponents.DocumentBuilder` — v1: önizleme + export menüsü + durum rozeti.  
Tam zengin editör Flutter / sonraki sprintte.

---

## 5. Kabul

- En az bir canlı belge (ör. günlük plan çıktısı) builder iskeletine bağlanır.  
- Export menüsü tek bileşendir.  
- Yeni evrak türü yalnızca `documentType` + motor + block şablonu ekler.
