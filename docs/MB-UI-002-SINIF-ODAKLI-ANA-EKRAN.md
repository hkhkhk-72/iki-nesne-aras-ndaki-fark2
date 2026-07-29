# MB-UI-002 — Sınıf Odaklı Ana Ekran ve Sayfa Mimarisi

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı ürün IA (UI-001 ana sayfa ilkesini **bu belgeyle günceller**)  
**Üst:** MB-DM-001 · MB-DM-002 · MB-ARCH-001 · MB-DS-001

> MiniBilge bir belge indirme sitesi değildir.  
> **Dijital Öğretmen İşletim Sistemi** — sınıf seçilmeden işlem başlamaz.

---

## 0. UI-001 ile ilişki

| UI-001 | UI-002 |
|--------|--------|
| Ana sayfa = “Bugün ne yapacağım?” akış şeridi | Ana sayfa = **sınıf seçici + iş kategorisi hub’ı** |
| Klasik kart ızgarası yok | Kategori blokları **etkileşim konteyneri** olarak serbest (gölgesiz, sade) |
| 10 maddelik sol menü | Sol menü kalır (derin rota); **bağlam sınıf sekmelerinden** gelir |

Domain kuralı değişmez: **Program ≠ Plan ≠ Belge**.  
Motor kuralı: belge açılınca ilgili motor çalışır; gereksiz alan sorulmaz.

---

## 1. En önemli kural — Sınıf odaklılık

```
Uygulama açılır
  → Öğretmen sınıf seçer (1 | 2 | 3 | 4)
    → Tüm hub, ders listesi, plan/evrak bağlamı o sınıfa göre yenilenir
```

- Belge seçimi sınıf seçiminden **önce** gelmez.  
- Ders listesi sınıfa göre **otomatik** gelir (`programDersleri` / TTKB).  
- `varsayilanSinif` ayarı aktif sınıf bağlamıdır.

---

## 2. Ana sayfa iskeleti

1. **Marka + selamlama** (MiniBilge Öğretmen hero)  
2. **Sınıf seçici** — 1 / 2 / 3 / 4 büyük sekmeler; aktif belirgin  
3. **Bu sınıfın dersleri** — otomatik şerit (kazanım / plan kısayolu)  
4. **Hub kategorileri** (aşağıdaki 6 blok)  
5. Kısa **bugün özeti** (hafta, TWE ipucu) — ikincil, hero’yu ezmez  

---

## 3. Hub kategorileri

### 3.1 Planlar
Yıllık · Günlük · İYEP · BEP · Destek Eğitim · Egzersiz · Kulüp · Rehberlik · Tema/Ünite

### 3.2 Sınıf İşlemleri
Oturma planı · Sınıf listesi · Yoklama · Sınıf defteri (Günlük Kazanımlar) · Öğrenci bilgileri · Kitaplık · Davranış · Rehberlik · Veli görüşme · Gözlem

### 3.3 Ders İşlemleri
Öğretim Programı · Öğrenme çıktıları · İçerik · Beceriler · Değerler · Eğilimler · Ölçme · Materyal · Rubrik · Kontrol listesi

### 3.4 Evrak Merkezi
Zümre · ŞÖK · Veli · Kulüp · Belirli gün · Tören · Rehberlik · Resmî yazı · Dilekçe · Tutanak · Form

### 3.5 Raporlar
Öğretmen · Ders · Plan · Evrak · Ölçme

### 3.6 Ayarlar
Okul · Öğretmen · Ders programı · İmza · Müdür · Yazdırma

Her alt madde mümkünse mevcut rota/modüle bağlanır; yoksa “yakında” + motor stub notu.

---

## 4. Motor mantığı (hatırlatma)

| Yüzey | Motor |
|-------|--------|
| Yıllık Plan | MB-YPM |
| Günlük Plan | MB-GPM |
| İYEP | MB-İYEP |
| BEP / Destek | MB-DEM |
| Egzersiz / Kulüp | ilgili motor |
| Evrak | MB-BM |
| Kazanım / defter | MB-TPM + KazanimEngine |

Akış: **Motor → yalnızca gerekli form → kayıtlı bağlamı otomatik doldur → TYMM/MEB’e göre üret.**

1. sınıf Türkçe yıllık plan ≠ 4. sınıf Türkçe yıllık plan.

---

## 5. Tasarım ilkeleri (DS-001 uyumu)

- Modern, sade, ferah; dikkat dağıtmayan  
- Sınıf sekmeleri hero’dan sonra en güçlü kontrol  
- Minimum tıklama  
- Responsive  
- Mor glow / krem-terracotta klişe yok  
- Kart = etkileşim bloğu; dekoratif kutu yığını yok  

---

## 6. Uygulama dosyaları

| Dosya | Rol |
|-------|-----|
| `assets/js/app.js` | Sınıf hub ana sayfa |
| `assets/js/core/hub-config.js` | Kategori / rota sözlüğü |
| `assets/css/ds.css` | `.grade-tabs`, `.hub-*` |
| `assets/js/core/storage.js` | `varsayilanSinif` bağlam |

---

*Sonraki:* hub alt maddelerinin eksik motor ekranlarını tek tek doldurmak (İYEP/BEP sihirbazları).
