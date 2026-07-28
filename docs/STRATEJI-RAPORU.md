# MiniBilge Öğretmen Platformu – Proje Durum ve Strateji Raporu

**Tarih:** 29 Temmuz 2026

**Proje Adı:** MiniBilge Öğretmen

**Hedef Kitle:** Türkiye genelindeki resmî ve özel okullarda görev yapan tüm ilkokul (1, 2, 3 ve 4. sınıf) öğretmenleri.

**Proje Felsefesi:** *"Önce Güvenilir Bilgi Motoru, Sonra Akıllı Algoritma, En Son Arayüz."* Sistem, hazır şablonları kopyalamaz; Türkiye Yüzyılı Maarif Modeli'ni ve MEB mevzuatını anlık olarak işleyerek resmî evrakları ve planları dinamik olarak üretir.

---

## 1. Projenin Vizyonu ve Mimari Hedefleri

MiniBilge Öğretmen, klasik bir belge indirme platformu değildir. Amacımız, Türkiye'deki bir ilkokul öğretmeninin eğitim-öğretim yılı boyunca hazırlamak, kullanmak ve idareye sunmak zorunda olduğu **tüm resmî evrakları** hatasız, mevzuata tam uygun ve saniyeler içinde üretebilen akıllı bir **Öğretmen Bilgi ve Otomasyon Sistemi** kurmaktır.

Proje, dört ana motor üzerine inşa edilmektedir:

1. **Öğretim Programı Motoru** — 1-4. sınıf tüm derslerin öğrenme çıktıları, süreç bileşenleri, içerik çerçeveleri, alan/kavramsal becerileri, eğilimleri ve farklılaştırma yaklaşımları.
2. **Takvim Motoru** — MEB çalışma takvimi, ara tatiller, yarıyıl tatili, resmî tatiller, bayramlar ve belirli gün/haftalar.
3. **Plan Motoru (Sistemin Beyni)** — Okul, sınıf, ders ve öğretmen bilgilerini harmanlayarak doğru hafta, tema, kazanım ve ders saatlerini üreten otomasyon merkezi.
4. **Evrak Motoru** — Plan motorundan gelen verileri Word ve PDF formatlarında MEB standartlarına uygun belgelere dönüştüren biçimlendirme motoru.

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

## 4. Yol Haritası

1. Ders bazlı veri tabanı tamamlama (1-4. sınıf tüm dersler)
2. Takvim ve plan algoritmasının kodlanması (2026-2027 dahil)
3. Evrak şablon motorunun Word/PDF entegrasyonu
4. Test ve kalite kontrol aşaması

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
