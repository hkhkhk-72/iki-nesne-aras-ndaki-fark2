# MB-UI-003 — Ana Ekran: Sonraki Nesil IA

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı (UI-002’yi bu belgeyle günceller)  
**Karar:** MD-026

---

## 1. Üst şerit (bağlam)

| Alan | Kaynak |
|------|--------|
| Öğretmen | `getProfile().adSoyad` |
| Okul | `getSchool().okulAdi` |
| Eğitim Öğretim Yılı | `getSchool().egitimYili` |

Eksikse “Kurulumu tamamla” → Hesabım (tek seferlik veri).

---

## 2. Sınıf kutuları

1 / 2 / 3 / 4 — büyük, eşit, aktif belirgin.  
Seçim → `varsayilanSinif` + tüm hub / ders şeridi yenilenir.

---

## 3. Beş hub (yalnızca bunlar)

1. **Planlar** — yıllık, günlük, haftalık, İYEP, BEP, destek, egzersiz, kulüp, sosyal etkinlik  
2. **Sınıf İşlemleri** — yoklama, liste, oturma, rehberlik, gözlem, davranış, ölçme, süreç  
3. **Evraklar** — tüm resmî belgeler tek merkez (`documents/`)  
4. **Takvim** — ders programı, nöbet, ajanda, belirli gün, tatiller  
5. **MiniBilge AI** — doğal dil ile plan / kazanım / materyal  

Sol menü derin rotaları korur; ana ekran sadeliği bozulmaz.

---

## 4. Veri hattı ipucu (UI)

Ana ekranda kısa hatırlatma:

`Yıllık → Günlük → Ödev → Ölçme → Kazanım → Karne`

---

*DS-001 görsel dil + COMP ClassTabs kullanılır.*
