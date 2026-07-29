# MB-DS-002 — Teacher Experience System (TXS)

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı deneyim anayasası  
**Üst:** MB-DS-001 (görsel dil) · MB-IA-001 · MD-039 · MD-038 · MB-WFE-001  
**Kod:** `TXS-001` … `TXS-010`  
**İlerleme:** **85% tamam** · **15% kaldı** (tüm modüllerde Gelişmiş) · `docs/ILERLEME.md`

> MiniBilge’nin tasarım sistemi yalnızca renk, buton ve kartlardan oluşmaz.  
> Tüm ekranlar öğretmenin **günlük çalışma akışına** göre tasarlanır.  
> Kullanıcı “hangi menüye gireceğini” düşünmez — **sistem yönlendirir**.

---

## İlişki: DS-001 vs DS-002

| Katman | Belge | Konu |
|--------|--------|------|
| Görsel dil | MB-DS-001 | Renk, tipografi, bileşen görünümü |
| Deneyim dili | **MB-DS-002** | Akış, bilişsel yük, AI, boş durum, aksiyon |
| Etkileşim | MB-DS-003 | Hover/click/page süreleri, snackbar, undo, autosave |
| Erişilebilirlik | MB-DS-004 | Font, touch, klavye, SR, AA, dark, offline |
| Hareket | MB-DS-005 | Success/error/loading/transition · ≤300ms |

DS-002, DS-001’i geçersiz kılmaz; **üstüne oturur**. Süreler için DS-003.

---

## TXS-001 — Context First

Uygulamanın ilk bilgisi ekran değil **bağlamdır**.

Seçilen eğitim yılı · okul · sınıf · şube → tüm sistemi otomatik değiştirir.

Uyum: MD-031 · MD-038 Context Cache.

---

## TXS-002 — Workflow First

Her ekran bir **iş akışıdır**, sayfa değildir.

Örnek — Yıllık Plan:

```
Bilgileri Al → Doğrula → Önizle → AI Kontrolü → PDF → Word → Arşiv
```

Uyum: MD-039 · MB-WFE-001 · MB-IA-002.

---

## TXS-003 — Zero Cognitive Load

Öğretmen aynı bilgiyi ikinci kez girmez.  
Sistem mevcut bilgileri otomatik getirir.

Uyum: MD-032 · MD-038 · Smart Form.

---

## TXS-004 — One Click Rule

Yapılabilen her işlem **tek tık** veya en fazla **üç adımda** tamamlanır.

UI’da adım sayacı / wizard max 3 görünür adım tercih edilir.

---

## TXS-005 — AI Everywhere

Her ekranın **sağ alt köşesinde** MiniBilge AI (FAB) bulunur.  
Bulunduğu ekrana göre bağlama özel yardım sunar.

Örn. Yıllık Plan: “Kazanımı açıkla” · “Dersi sadeleştir” · “Etkinlik öner”.

Bileşen: `MiniBilgeTxs.attach()` (sağ alt FAB).

---

## TXS-006 — Progressive Disclosure

İlk ekranda yalnızca gerekli bilgiler.  
İleri düzey seçenekler **Gelişmiş** altında açılır.

Bileşen: `MiniBilgeTxs.AdvancedPanel`.

---

## TXS-007 — Never Empty

Hiçbir ekran boş görünmez.  
Yeni kullanıcıda bile: örnek veri · yardım · öneriler.

Bileşen: `MiniBilgeTxs.EmptyState`.

---

## TXS-008 — Action Based Dashboard

Dashboard bilgi göstermez; **iş yaptırır**.

```
Bugün
□ Günlük Plan hazırla
□ Yoklama al
□ Ders Defterini tamamla (LEE)
□ Veli toplantısı oluştur
□ Rehberlik etkinliği
```

Uyum: WFE görev panosu.

---

## TXS-009 — Document Everywhere

Belge sistemin **sonunda** oluşur.  
Merkezde belge yoktur — **veri** vardır.

Uyum: MB-DOS · MD-040 · IA-001.

---

## TXS-010 — AI Confidence

AI önerileri etiketlenir; MEB belgesi gibi gösterilmez:

| Etiket | Anlam |
|--------|--------|
| **Resmi** | Motor/MEB/TYMM kaynaklı (AI değil) |
| **Öneri** | AI önerisi — öğretmen onayı gerekir |
| **Taslak** | AI taslak metin — düzenlenebilir |

Bileşen: `MiniBilgeTxs.AiConfidence`.

---

## Uygulama dosyaları

| Dosya | Rol |
|-------|-----|
| `assets/js/components/txs.js` | FAB, EmptyState, Advanced, Confidence |
| `assets/css/ds.css` | `.txs-*` stilleri (tüm DS sayfalarında) |
| `assets/js/navigation.js` | Layout’a TXS attach |
| `assets/js/app.js` | TXS-008 Bugün panosu + Gelişmiş ilerleme |

---

## Kabul

- [x] TXS anayasası yayınlandı  
- [x] AI FAB layout’ta (tüm `renderLayout` ekranları)  
- [x] AI Confidence etiketleri  
- [x] Never Empty bileşeni  
- [x] Action dashboard (Bugün)  
- [ ] Tüm modül ekranlarında Gelişmiş paneli (kademeli)  

---

*Yeni ekran PR’ında “TXS hangi maddelere uydu?” belirtilir.*
