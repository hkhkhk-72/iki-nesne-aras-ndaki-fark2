# ADR Format — Kısa Karar Standardı

**Durum:** LOCKED  
**Tarih:** 30 Temmuz 2026  

Bundan sonra Cursor’a verilen kararlar **uzun rapor değil**, bu formatta yazılır.

---

## Şablon

```markdown
# MB-ADR-NNN — Başlık

## LOCKED

### Karar N

Tek cümle karar.

* Madde
* Madde
```

---

## Kurallar

1. Başlık kısa.  
2. `## LOCKED` veya `## OPEN`.  
3. Her karar `### Karar N` — numaralar `docs/ADR-REGISTRY.md`’de artar.  
4. Madde işaretleri yeterli; paragraf yok.  
5. Uygulama kodu ayrı PR’da; ADR yalnızca karar.  
6. Eski uzun anayasalar (MB-AOS, MB-DOS…) geçerlidir; yeni kararlar ADR ile eklenir.

---

## Kodlar

| Dizi | Kullanım |
|------|----------|
| **MD-*** | Mimari karar (mevcut) |
| **MB-ADR-*** | Kısa ürün karar paketi (yeni) |
| **Karar N** | Atomik kilitli madde |
