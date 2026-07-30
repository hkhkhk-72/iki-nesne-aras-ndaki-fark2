# MB-DS-006 — Teacher Experience Architecture (TXA)

**Sürüm:** 1.0  
**Tarih:** 30 Temmuz 2026  
**Durum:** Bağlayıcı mimari anayasa  
**Üst:** MB-DS-002 (TXS) · MD-039 Workflow First · MD-038 Context Cache  
**Kod:** `TXA-001` … `TXA-010`  
**Karar:** **MD-045** *(taslak “MD-025” istenmişti; MD-025 zaten “Everything is a Component” — kayıt MD-045)*  
**İlerleme:** **70% tamam** · **30% kaldı** (tüm modül ekranlarında TXA-007/008 kapsaması) · `docs/ILERLEME.md`

> MiniBilge **ekran odaklı değil, iş akışı (Workflow) odaklı** geliştirilir.  
> Kullanıcı menü aramaz — sistem doğru işi doğru sırada sunar.

---

## İlişki

| Katman | Belge |
|--------|--------|
| Görsel | MB-DS-001 |
| Deneyim ilkeleri (TXS) | MB-DS-002 |
| Etkileşim / A11Y / Motion | MB-DS-003…005 |
| **Ekran mimarisi (TXA)** | **MB-DS-006** |

TXA, TXS’i geçersiz kılmaz; **ekran/iş akışı iskeletini** bağlar.

---

## TXA-001 — Tek amaç

Her ekranın **tek amacı** vardır.

Örnek — Yıllık Plan:

```
Plan oluştur → Önizle → Düzenle → Belge üret
```

Başka görev içermez.  
API: `MiniBilgeTxa.declarePurpose({ id, purpose, steps })`

---

## TXA-002 — Sıfır tekrar giriş

Hiçbir kullanıcı aynı bilgiyi ikinci kez girmez.  
Context Engine / Context Cache otomatik doldurur.

Uyum: MD-032 · MD-038 · TXS-003.

---

## TXA-003 — AI her modülde

Her modül AI desteklidir.  
AI bulunduğu sayfanın bağlamını bilir (sınıf/şube/ders/ekran).

Uyum: TXS-005 · `MiniBilgeTxs.attach`

---

## TXA-004 — En fazla 3 ana aksiyon

Her ekranda **maksimum 3** birincil aksiyon.  
API: `MiniBilgeTxa.PrimaryActions([...])` (3’ten fazlası kesilir / Gelişmiş’e düşer)

---

## TXA-005 — Birincil = en büyük

En sık kullanılan işlem **en büyük butondur** (`.txa-btn-primary` / `primary` + `txa-dominant`).

---

## TXA-006 — Autosave

Tüm formlar autosave destekler (30 sn · IS-011).  
API: `MiniBilgeTxa.autosave(opts)` → Interaction.autosave

---

## TXA-007 — Belge adımları

Tüm belgeler şu adımları destekler:

1. Preview  
2. Word  
3. PDF  
4. Yazdır  
5. AI Kontrol  

API: `MiniBilgeTxa.DocumentActions({ onPreview, onWord, onPdf, onPrint, onAiCheck })`

---

## TXA-008 — Version History

Her belge sürüm geçmişi tutar.  
API: `MiniBilgeTxa.VersionHistory` · storage `minibilgeDocVersions`

---

## TXA-009 — Quick Action

Her ekranda Quick Action alanı.  
API: `MiniBilgeTxa.QuickActions([...])`

---

## TXA-010 — Context Aware

Her sayfa bağlam duyarlıdır.  
Sınıf/şube değişince sayfa otomatik yenilenir.

API: `MiniBilgeTxa.watchContext({ onChange })` · class switch → reload/re-render

---

## Uygulama

| Dosya | Rol |
|-------|-----|
| `assets/js/components/txa.js` | TXA-001…010 runtime |
| `assets/css/ds.css` | `.txa-*` stilleri |
| `assets/js/navigation.js` | Layout TXA boot |
| `modules/yillik-plan.html` | Örnek TXA ekranı |

---

## Kabul

- [x] Anayasa yayınlandı (MD-045)  
- [x] Runtime TXA API  
- [x] DocumentActions + VersionHistory  
- [x] Quick Action + PrimaryActions (≤3)  
- [x] Context watch  
- [ ] Tüm belge modüllerinde TXA-007/008 (kademeli — %30 kaldı)  

---

*Yeni ekran PR’ında “TXA hangi maddelere uydu?” belirtilir.*
