# MiniBilge Öğretmen Platformu – Proje Durum ve Strateji Raporu

**Tarih:** 29 Temmuz 2026

**Proje Adı:** MiniBilge Öğretmen

**Hedef Kitle:** Türkiye genelindeki resmî ve özel okullarda görev yapan tüm ilkokul (1, 2, 3 ve 4. sınıf) öğretmenleri.

**Proje Felsefesi:** *"Önce Güvenilir Bilgi Motoru, Sonra Akıllı Algoritma, En Son Arayüz."* Sistem, hazır şablonları kopyalamaz; Türkiye Yüzyılı Maarif Modeli'ni ve MEB mevzuatını anlık olarak işleyerek resmî evrakları ve planları dinamik olarak üretir.

---

## 1. Projenin Vizyonu ve Mimari Hedefleri

MiniBilge Öğretmen, klasik bir belge indirme platformu değildir. Amacımız, Türkiye'deki bir ilkokul öğretmeninin eğitim-öğretim yılı boyunca hazırlamak, kullanmak ve idareye sunmak zorunda olduğu **tüm resmî evrakları** hatasız, mevzuata tam uygun ve saniyeler içinde üretebilen akıllı bir **Öğretmen Bilgi ve Otomasyon Sistemi** kurmaktır.

Proje bir belge indirme sitesi değil; **Öğretim Programı İşletim Sistemi** olarak tasarlanır.

Üç katman asla karıştırılmaz: **Program ≠ Plan ≠ Belge**.

Çekirdek motorlar (domain’den türetilir):

1. **Öğretim Programı Motoru (MB-TPM)** — TYMM nesneleri: çıktı, süreç bileşeni, içerik, beceri, değer, eğilim…
2. **Takvim Motoru** — MEB çalışma takvimi, tatiller, belirli gün/haftalar
3. **Plan Motoru (MB-YPM / MB-GPM)** — Program + takvim + planlama kuralları → yıllık/günlük plan
4. **Evrak Motoru (MB-BM)** — Planı Word/PDF/HTML belgesine dönüştürür

Anayasa: `docs/MB-DM-001-OGRETIM-PROGRAMI-DOMAIN-MODELI.md`

---

## 2. Şimdiye Kadar Yapılan Çalışmalar

- Mimari ve felsefi altyapı kuruldu
- Maarif Modeli yapısı analiz edildi
- 1. sınıf Türkçe, Matematik, Hayat Bilgisi ön veri setleri oluşturuldu
- Resmî evrak envanteri kategorize edildi
- UX akışı netleştirildi: **Ana Sayfa → Sınıf → Ders → Bilgiler → Üret**
- Prototip motorlar kodlandı ve test edildi

---

## 3. Kapsam ve Modül Envanteri

- **Planlar:** Yıllık, günlük, ünite/tema, destek eğitim, İYEP, egzersiz, kulüp
- **Zümre Evrakları:** Sene başı, ara değerlendirme, sene sonu tutanakları
- **Özel Eğitim ve Rehberlik:** BEP, destek eğitim odası, RAM yönlendirme, risk takip
- **Kulüpler ve Sosyal Etkinlikler:** Üye listeleri, toplum hizmeti raporları, belirli gün metinleri
- **Ölçme ve Değerlendirme:** Gözlem formları, rubrikler, kontrol listeleri, performans görevleri
- **Veli ve İdare:** Toplantı tutanakları, imza sirküleri, gezi izin belgeleri

---

## 4. Yol Haritası (Domain-First)

> **Karar (29 Temmuz 2026):** JSON / dosya yazımı durduruldu. Önce kavramsal domain modeli, sonra şema ve algoritma.

Bağlayıcı sıra:

1. **MB-DM-001** — Öğretim Programı Domain Modeli *(anayasa — tamamlandı)* → `docs/MB-DM-001-OGRETIM-PROGRAMI-DOMAIN-MODELI.md`
2. **MB-ARCH-001** — Platform Mimari Freeze *(tamamlandı)*
2b. **MB-UI-001** — UI/UX v2.0 + MB-TWE *(tamamlandı)* → `docs/MB-UI-001-UI-UX-MIMARISI-V2.md`
2c. **MB-DS-001** — Tasarım Sistemi *(tamamlandı)* → `docs/MB-DS-001-TASARIM-SISTEMI.md`
3. **MB-DM-002** — Entity Detay Spesifikasyonu *(tamamlandı)* → `docs/MB-DM-002-ENTITY-DETAY-SPESIFIKASYONU.md`
4. **MB-TPM-001** — 1. Sınıf Türkçe domain uygulaması *(tamamlandı)* → `docs/MB-TPM-001-SINIF1-TURKCE-DOMAIN-UYGULAMASI.md`
5. **MB-DB-001** — Fiziksel veri tabanı *(sıradaki)*
6. **MB-JSON-001** — Makine tarafından işlenebilir JSON şeması
7. **MB-ALG-001** — Yıllık plan üretim algoritması
8. **MB-APP-001** — Uygulama entegrasyonu (freeze IA’ya göre)

**Freeze menü (8):** Ana Sayfa · Yıllık Plan · Günlük Plan · Evrak Merkezi · Öğretim Programı · Takvim · Hesabım · Ayarlar

Mevcut `assets/data/curriculum/*.json` dosyaları geçici keşif verisidir; kanonik şema değildir.

---

## 5. Teknik Uygulama Durumu

| Motor | Dosya | Durum |
|-------|-------|-------|
| Öğretim Programı Motoru | `assets/js/core/curriculum-engine.js` | 1. sınıf 3 ders |
| Takvim Motoru | `assets/js/core/calendar-engine.js` | 2025-26, 2026-27 |
| Plan Motoru | `assets/js/core/plan-engine.js` | Yıllık + günlük |
| Evrak Motoru | `assets/js/core/evrak-engine.js` | HTML/PDF, Word yol haritasında |
| Kontrol Motoru | `assets/js/core/validation-engine.js` | Aktif |

Evrak envanteri: `assets/data/evrak-envanteri.json`
