# MD-026 — ÖğretmenEvrak Referansı ve MiniBilge Sonraki Nesil Kararı

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı mimari karar  
**Ürün IA:** MB-UI-003 (bu kararın ana ekran yansıması)

> Hedef: ÖğretmenEvrak’ın **benzeri olmak değil**, onun **bir sonraki nesli** olmak.  
> İnceleme değerli bir referanstır; kopya değildir.

---

## 1. Referanstan alınan güçler (korunacak)

| Güç | MiniBilge karşılığı |
|-----|---------------------|
| Kategoriler sade | Ana hub: 5 blok |
| Evraklar mantıklı başlıklar | Evraklar tek merkez |
| Belgeyi kolay bulma | Arama + kategori; dağılma yok |
| Planlar tek başlık | **Planlar** hub’ı |
| Sınıf işlemleri ayrı | **Sınıf İşlemleri** hub’ı |
| Menü karmaşık değil | Sol menü derin rota; ana ekran sade |

Bu yapı öğretmene güven verir — **bilinçli olarak** korunur.

---

## 2. Fark oluşturacağımız eksikler

### 2.1 Sınıf seçimi aktif sistem bağlamıdır

Pasif buton yok. Öğretmen **1. Sınıf**’a basınca:

- program dersleri o sınıfa göre yüklenir  
- plan / evrak / ölçme bağlamı `varsayilanSinif` olur  
- motorlar sınıf düzeyine göre içerik üretir  

### 2.2 Menü değil motor

Yıllık Plan, Günlük Plan, BEP, İYEP… her biri bağımsız motor:

```
Motor → gerekli alanlar → kayıtlı bağlamı doldur
  → TTKB saatleri → TYMM → resmî takvim → otomatik üret
```

### 2.3 Tek kurulum, tekrar sormama

İlk kurulumda: Okul, Müdür, İl, İlçe, Sınıf, Şube, Öğretmen, Branş.  
Sonraki belgelerde bu alanlar **otomatik** gelir (COMP-008).

### 2.4 Tek veri hattı (belgeler kopuk değil)

```
Yıllık Plan → Günlük Plan → Ödev → Ölçme → Kazanım → Karne
```

Aynı domain / plan / öğrenci verisi üzerinden çalışır.

---

## 3. Ana ekran iskeleti (MB-UI-003)

```
[ MiniBilge Öğretmen ]
Öğretmen · Okul · Eğitim Öğretim Yılı
────────────────────────────────
[ 1. Sınıf ] [ 2. Sınıf ] [ 3. Sınıf ] [ 4. Sınıf ]   ← büyük kutular
────────────────────────────────
Bu sınıfın dersleri (otomatik)
────────────────────────────────
📚 Planlar
👨‍🏫 Sınıf İşlemleri
📂 Evraklar          ← 250–300 belge tek merkez
📅 Takvim
🤖 MiniBilge AI
```

**Ana hub’da yoktur (bilinçli):** Raporlar / Ayarlar / Ders İşlemleri ayrı menü veya derin rota.  
Öğretim Programı gezgini Planlar veya AI/motor akışından açılır; evrakları dağıtmaz.

---

## 4. Motor kataloğu (menü arkası)

| Motor | Kod |
|-------|-----|
| Öğretim Programı | MB-TPM |
| Takvim | MB-TKM / TCM |
| Belge | MB-BM (DEM belge motoru ile hizalı) |
| Plan (yıllık/günlük) | MB-YPM / MB-GPM |
| Ölçme | MB-AIE |
| Karakter Gelişim | MB-CDE |
| Beceri | MB-CEM |
| Destek / BEP / İYEP | MB-DEM / MB-İYEP |
| MiniBilge AI Asistanı | MB-AI |

---

## 5. Sonuç cümlesi

MiniBilge, öğretmenin **bir kez sınıfını seçtiği**, belgelerin **tek veri tabanından** üretildiği ve **yapay zekâ motorlarının** arka planda çalıştığı bir **Öğretmen Eğitim İşletim Sistemi**’dir.

Klasik evrak uygulamasının ötesine geçmek zorunluluktur; referans yalnızca navigasyon sadeliği için kullanılır.

---

*Uygulama: `hub-config.js` · `app.js` · `docs/MB-UI-003-ANA-EKRAN-SONRAKI-NESIL.md`*
