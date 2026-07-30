# FAZ 6 — Component Architecture

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Kurumsal ürün fazı — aktif  
**Karar:** MD-025 — Everything is a Component

---

## 0. Dönüm noktası

FAZ 1–5 (vizyon, domain, motorlar, UI/UX, design system) **tamamlandı**.

Bundan sonrası “fikir üretme” değil; **kurumsal ürün geliştirme** sürecidir.

| Faz | Konu | Durum |
|-----|------|--------|
| 1 | Platform Vizyonu | ✅ |
| 2 | Domain Model (MB-DM) | ✅ |
| 3 | Motor Mimarisi | ✅ |
| 4 | UI/UX Mimarisi | ✅ |
| 5 | Design System (MB-DS-001) | ✅ |
| **6** | **Component Architecture** | **🔵 aktif** |
| 7 | Flutter Proje Mimarisi | ⏳ sıradaki → `MB-ARCH-002` |
| 8 | Veri / DB / Sync | ⏳ |

> **İsim notu:** Mevcut `MB-ARCH-001` web platform freeze’tir.  
> Flutter Clean Architecture paketi **`MB-ARCH-002`** olarak açılacaktır (çakışma yok).

---

## 1. MD-025 — Everything is a Component

MiniBilge’de tekrar eden hiçbir kullanıcı arayüzü **sıfırdan** oluşturulmaz.

Her buton, kart, tablo, form, seçim kutusu ve belge görünümü **yeniden kullanılabilir bir bileşendir**.

Bu yaklaşım:

- geliştirme süresini kısaltır  
- bakım maliyetini düşürür  
- görsel tutarlılığı sağlar  
- yeni modül eklemeyi kolaylaştırır  
- Flutter’a taşınırken widget sözleşmesini hazır tutar  

**Kural:** Yeni bir ekran yazmadan önce ilgili bileşen kataloğuna bakılır. Yoksa önce bileşen eklenir, sonra ekran o bileşeni kullanır.

---

## 2. Bileşen paketleri

| Kod | Paket | Öncelik |
|-----|--------|---------|
| **MB-COMP-001** | Component Library (katalog + nav/dashboard çekirdeği) | P0 |
| **MB-COMP-002** | Universal Document Builder | P0 |
| **MB-COMP-003** | Universal Table | P0 |
| **MB-COMP-004** | AI Components | P1 |
| **MB-COMP-005** | Status Components | P1 |
| **MB-COMP-006** | Notification Components | P1 |
| **MB-COMP-007** | Calendar Components | P1 |
| **MB-COMP-008** | Teacher Profile Components | P1 |

Detay: `docs/MB-COMP-001-COMPONENT-LIBRARY.md` ve bağlı COMP-002…008 belgeleri.

---

## 3. Uygulama katmanları

### 3.1 Web prototip (şimdi)

```
assets/js/components/   → MiniBilgeComponents (HTML string / mount API)
assets/css/components.css
modules/components-lab.html  → canlı vitrin
```

Web bileşenleri **sözleşme kaynağıdır**. Flutter widget’ları aynı prop/API isimlerini taşır.

### 3.2 Flutter (FAZ 7 — MB-ARCH-002)

```
packages/mb_ui/          → Design System + widgets
packages/mb_domain/      → Domain entities
packages/mb_application/ → Use cases
packages/mb_data/        → Repositories / local DB / sync
```

Riverpod + Clean Architecture. COMP kataloğu Flutter’da birebir widget setine dönüşür.

---

## 4. Başarı ölçütleri (FAZ 6)

1. Ana ekran sınıf sekmeleri `ClassTabs` bileşeninden üretilir.  
2. Durum rozetleri yalnızca `StatusBadge` kullanır.  
3. Bildirimler yalnızca `Toast` / `Banner` kullanır.  
4. Yeni belge ekranı `DocumentBuilder` iskeletine bağlanır (COMP-002).  
5. Liste yüzeyleri `UniversalTable` sözleşmesine uymaya başlar (COMP-003).  
6. Components Lab sayfasında tüm aileler görülebilir.

---

## 5. Sonraki büyük hedef

**MB-ARCH-002 — Flutter Proje Mimarisi**

- klasör yapısı  
- Clean Architecture (Domain / Application / Infrastructure)  
- Riverpod  
- Repository + servis katmanı  
- yerel veritabanı ve senkronizasyon  
- modüler paket mimarisi  

COMP kütüphanesi tamamlandıkça Flutter geçişi riski düşer.

---

*FAZ 6 sahibi: ürün + UI mühendisliği. Motor kodu değiştirilmez; yüzeyler bileşenleşir.*
