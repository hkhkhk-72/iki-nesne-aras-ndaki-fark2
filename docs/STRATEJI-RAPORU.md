# MiniBilge Öğretmen Platformu – Proje Durum ve Strateji Raporu

**Tarih:** 29 Temmuz 2026

**Proje Adı:** MiniBilge Öğretmen

**Hedef Kitle:** Türkiye genelindeki resmî ve özel okullarda görev yapan tüm ilkokul (1, 2, 3 ve 4. sınıf) öğretmenleri.

**Proje Felsefesi:** *"Önce Güvenilir Bilgi Motoru, Sonra Akıllı Algoritma, En Son Arayüz."* Sistem, hazır şablonları kopyalamaz; Türkiye Yüzyılı Maarif Modeli'ni ve MEB mevzuatını anlık olarak işleyerek resmî evrakları ve planları dinamik olarak üretir.

**Ürün evresi:** Fikir üretme → **kurumsal ürün geliştirme** (FAZ 6 aktif).

---

## 1. Projenin Vizyonu ve Mimari Hedefleri

MiniBilge Öğretmen, klasik bir belge indirme platformu değildir. Amacımız, Türkiye'deki bir ilkokul öğretmeninin eğitim-öğretim yılı boyunca hazırlamak, kullanmak ve idareye sunmak zorunda olduğu **tüm resmî evrakları** hatasız, mevzuata tam uygun ve saniyeler içinde üretebilen akıllı bir **Öğretmen Bilgi ve Otomasyon Sistemi** kurmaktır.

Proje bir belge indirme sitesi değil; **Öğretim Programı İşletim Sistemi** / **Dijital Öğretmen İşletim Sistemi** olarak tasarlanır.

Üç katman asla karıştırılmaz: **Program ≠ Plan ≠ Belge**.

Çekirdek motorlar (domain’den türetilir):

1. **Öğretim Programı Motoru (MB-TPM)** — TYMM nesneleri: çıktı, süreç bileşeni, içerik, beceri, değer, eğilim…
2. **Takvim Motoru** — MEB çalışma takvimi, tatiller, belirli gün/haftalar
3. **Plan Motoru (MB-YPM / MB-GPM)** — Program + takvim + planlama kuralları → yıllık/günlük plan
4. **Evrak Motoru (MB-BM)** — Planı Word/PDF/HTML belgesine dönüştürür

Anayasa: `docs/MB-DM-001-OGRETIM-PROGRAMI-DOMAIN-MODELI.md`

---

## 2. Tamamlanan fazlar (FAZ 1–5)

| Faz | Konu | Durum |
|-----|------|--------|
| 1 | Platform Vizyonu | ✅ |
| 2 | Domain Model (MB-DM) | ✅ |
| 3 | Motor Mimarisi | ✅ |
| 4 | UI/UX (UI-001 / UI-002) | ✅ |
| 5 | Design System (DS-001) | ✅ |
| **6** | **Component Architecture** | **🔵 aktif** |

Karar: **MD-025 — Everything is a Component** → `docs/FAZ-6-COMPONENT-ARCHITECTURE.md`

---

## 3. Kapsam ve Modül Envanteri

- **Planlar:** Yıllık, günlük, ünite/tema, destek eğitim, İYEP, egzersiz, kulüp
- **Zümre Evrakları:** Sene başı, ara değerlendirme, sene sonu tutanakları
- **Özel Eğitim ve Rehberlik:** BEP, destek eğitim odası, RAM yönlendirme, risk takip
- **Kulüpler ve Sosyal Etkinlikler:** Üye listeleri, toplum hizmeti raporları, belirli gün metinleri
- **Ölçme ve Değerlendirme:** Gözlem formları, rubrikler, kontrol listeleri, performans görevleri
- **Veli ve İdare:** Toplantı tutanakları, imza sirküleri, gezi izin belgeleri

---

## 4. Yol Haritası

Bağlayıcı sıra:

1. **MB-DM-001** — Domain Modeli ✅  
2. **MB-ARCH-001** — Platform Mimari Freeze ✅  
2b–2d. **MB-UI-001 / DS-001 / UI-002** ✅  
3. **MB-DM-002** — Entity Detay ✅  
4. **MB-TPM-001** — 1. sınıf Türkçe domain ✅  
5. **FAZ 6 / MB-COMP-001…008** — Bileşen mimarisi *(aktif)*  
6. **MB-ARCH-002** — Flutter Proje Mimarisi *(sıradaki büyük hedef)*  
7. **MB-DB-001** — Fiziksel veri tabanı  
8. **MB-JSON-001** → **MB-ALG-001** → **MB-APP-001**

> Mevcut `MB-ARCH-001` web freeze’tir. Flutter Clean Architecture paketi **`MB-ARCH-002`** adıyla açılır.

---

## 5. Teknik Uygulama Durumu

Web prototip bileşenleri: `assets/js/components/` · vitrin: `modules/components-lab.html`

Motor dosyaları: `assets/js/core/*-engine.js`

---

*Son güncelleme: FAZ 6 açılışı — 29 Temmuz 2026*
