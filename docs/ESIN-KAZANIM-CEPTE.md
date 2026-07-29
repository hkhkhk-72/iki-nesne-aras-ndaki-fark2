# Esin Notu — Kazanım Cepte → MiniBilge

**Tarih:** 29 Temmuz 2026  
**Kaynaklar:** [kazanimcepte.com](https://kazanimcepte.com/), Play/App Store açıklamaları, fenbilimi.net

> Bu belge **kopyalama rehberi değildir**. UX kalıplarını ayrıştırır; MiniBilge felsefesine uyanları alır, uymayanları bilinçli reddeder.

---

## 1. Kazanım Cepte ne yapıyor?

Öğretmen mobil uygulaması (fenbilimi / Kazanım Cepte). Çekirdek vaat: *sınıf + ders → o haftanın kazanımları, cepte.*

| Özellik | Açıklama |
|---------|----------|
| Haftalık kazanım listesi | Sınıf ve ders seç → istenen haftanın kazanımları |
| Otomatik bu hafta | Açılışta bulunduğunuz hafta açılır |
| Favoriler | Sınıf+ders çiftini kaydet, tekrar seçme |
| Haftaya not | Kazanım/haftaya özel öğretmen notu |
| Ders programı | Gün/saat/sınıf çizelgesi, yazdır, paylaş |
| Ders öncesi bildirim | Programdan hatırlatma |
| İş takvimi | Tatil / okul günleri |
| Hazır dosya deposu | Zümre, kulüp, veli vb. yüzlerce şablon indirme |
| Offline (premium) | Favori + program çevrimdışı |

Ölçek (site iddiası): 650k+ indirme, 250k+ aktif kullanıcı.

---

## 2. MiniBilge’nin farkı (kırmızı çizgi)

| Kazanım Cepte | MiniBilge |
|---------------|-----------|
| Hazır / güncel **yıllık plan paketleri** sunar | Planı **TYMM + takvim + öğretmen bağlamından üretir** |
| İnternetten şablon dosya indirtir | Evrakı **plandán türetir** (Program ≠ Plan ≠ Belge) |
| Kazanım listesi ürünün merkezi | LearningOutcome domain’in kalbi; defter yalnızca yüzey |
| Kurs kazanımları da var | Önce ilkokul zorunlu program dersleri |

**Alınmaz:** Hazır yıllık plan içeriği, “indir–yapıştır” evrak kütüphanesi mantığı.

---

## 3. Alınan UX esinleri (uygulandı / sırada)

### Uygulandı (Günlük Kazanımlar v2)

1. **Açılışta bu hafta** — ekstra tıklama olmadan haftanın çıktıları yüklenir  
2. **Hafta okları** — önceki / sonraki / bu hafta  
3. **Favori sınıf+ders** — localStorage  
4. **Haftalık öğretmen notu** — deftere eklenir / kopyalanır  
5. **Tek ders ↔ günün tüm dersleri** — sınıf defteri günü için  

### Sonraki adaylar (henüz yok)

| Esin | MiniBilge karşılığı |
|------|---------------------|
| Kişisel ders programı | MB-TWE + günlük plan çizelgesi (öğretmen saatleri) |
| Ders öncesi hatırlatma | Bildirim / TWE görevi (PWA sonrası) |
| İş takvimi yazdır | Akademik Takvim zaten var; yazdır güçlendirilir |
| Offline | Service worker + domain cache (MB-APP) |

---

## 4. Öğretmen iş akışı (hedef)

```
Favori: 3-A Türkçe
  → Bu hafta otomatik açılır
    → Kazanım listesi (TYMM / yıllık plandan)
      → Not ekle
        → Kopyala / Yazdır → Sınıf defteri
```

Kazanım Cepte’deki “hız” duygusu korunur; içerik kaynağı MiniBilge motorlarıdır.

---

*İlgili ekran:* `modules/gunluk-kazanimlar.html`  
*Motor:* `assets/js/core/kazanim-engine.js`
