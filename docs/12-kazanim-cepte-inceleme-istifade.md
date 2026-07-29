# Kazanım Cepte İncelemesi → MiniBilge İstifadesi

> **Tarih:** 2026-07-29  
> **Amaç:** Rakip/referans ürünü incelemek; yapı ve UX’ten öğrenmek.  
> **Sınır:** Kazanım Cepte’nin özel metinleri / dosyaları kopyalanmaz.  
> Kaynak doğruluk için **MEB / Maarif Modeli** kamu programı kullanılır.

---

## 1. Kazanım Cepte Nedir?

| Alan | Gözlem |
|------|--------|
| Ürün | Öğretmen aracı — yıllık plan, haftalık kazanım, ders programı, hazır dosya |
| Hedef | Sınıf öğretmeni / branş öğretmeni |
| Ölçek | ~650k indirme, ~250k aktif (kendi sitesi) |
| Platform | iOS + Android; web çoğunlukla pazarlama (`kazanimcepte.com`) |
| Backend | `back.kazanimcepte.com` (Laravel tarzı API; token zorunlu) |
| Paket | `com.fenbilimi.plannual` |

### Halka açık özellik seti

1. **Sınıf + ders seç → haftanın kazanımı** (otomatik bu hafta)
2. Favori sınıf/ders
3. Kazanıma **not** ekleme
4. **Ders programı** (çizelge, paylaşım, hatırlatma)
5. Hazır öğretmen dosyaları (veli toplantısı, zümre, kulüp…)
6. İş takvimi (okul/tatil)
7. Premium: reklamsız + offline favoriler

### Teknik yüzey (erişilebilen)

| Uç nokta | Durum |
|----------|--------|
| `GET /api/v1/weeks` | 401 — token gerekli |
| `POST /api/v1/outcomes` | 401 — token gerekli |
| `POST /api/v1/timetable` | 401 |
| `GET /api/v1/course` | 403 yetkisiz |
| Web JS | Yalnızca feedback / contract / e-posta doğrulama |

**Sonuç:** Haftalık kazanım içerikleri API arkasında. Kimlik/oturum olmadan içerik çekilemedi. Bu nedenle MiniBilge’de **içerik kopyası değil; ürün modeli istifadesi** yapıldı.

---

## 2. MiniBilge ile Fark (stratejik)

| | Kazanım Cepte | MiniBilge |
|--|---------------|-----------|
| Merkez | Öğretmen planı | Çocuk deneyimi + Bilge rehber |
| Birim | Haftalık kazanım metni | Mikro deneyim (MES-002) |
| Değer | “Ne anlatacağım?” | “Çocuk nasıl yaşayacak?” |
| Veri | Plan / dosya | Davranış gözlemi (puan yok) |
| Ses | Yok / metin | Bilge Baykuş (MB-CHAR-002) |

**İstifade ilkesi:** KC’nin öğretmen alışkanlığını (hafta → kazanım → hızlı erişim) MiniBilge öğretmen paneline taşı; içeriği kendi Maarif hizalı müfredatımızla doldur; çocuğa giden katmanda görünmez matematik + Bilge kalsın.

---

## 3. Alınan Kararlar (ne yaptık)

### ✅ Alındı

1. **Haftalık bakış** — “Bu haftanın kazanımları” (otomatik hafta)
2. **Sınıf seç → anında liste** — sürtünmesiz öğretmen akışı
3. **Favori kazanım** — sık kullanılan çıktılara tek dokunuş
4. **Saat / tema ağırlığı** — MEB 180 saat / 7 tema dağılımı referans
5. **Offline-first düşünce** — favoriler cihazda (AsyncStorage)

### ❌ Alınmadı / alınmayacak

1. KC metinlerinin birebir kopyası
2. Hazır zümre/kulüp dosya pazarı (şimdilik kapsam dışı)
3. Reklam / premium duvarı
4. Öğretmeni “metin okuyucu”ya indirgeyen UX — MiniBilge’de her kazanım **öğrenme merkezine** ve varsa **mikro deneyime** bağlanır

---

## 4. MEB tema gerçekliği (KC’nin de dayandığı kamu iskelet)

1. sınıf matematik (TYMM, 180 saat, 19 çıktı):

| # | Tema | Saat | ~Hafta |
|---|------|------|--------|
| 1 | Nesnelerin Geometrisi (1) | 15 | 1–3 |
| 2 | Sayılar ve Nicelikler (1) | 57 | 4–14 |
| 3 | Sayılar ve Nicelikler (2) | 18 | 15–18 |
| 4 | İşlemlerden Cebirsel Düşünmeye | 50 | 19–28 |
| 5 | Sayılar ve Nicelikler (3) | 7 | 29–30 |
| 6 | Nesnelerin Geometrisi (2) | 15 | 31–33 |
| 7 | Veriye Dayalı Araştırma | 10 | 34–35 |
| — | Okul temelli planlama | 8 | 36 |

MiniBilge’deki 4 öğrenme alanı (Sayılar / Geometri / Ölçme / Veri) bu temalarla **içerik olarak örtüşür**, sıra olarak henüz birebir değil. Haftalık plan katmanı tema sırasını MEB’e yaklaştırır.

Kod: `src/teacher/weekly-plan.ts`

---

## 5. Sonraki adımlar (Bilge onayı ile)

1. Resmî PDF’den 19 çıktının tema bazlı tam eşlemesi (kod + süreç bileşeni)
2. Öğretmen paneline “ders programı” çizelgesi (KC timetable ilhamı)
3. Kazanım notları (yerel)
4. API erişimi / ortaklık olursa: yalnızca **yapı** senkronu; metin yine MEB

---

## 6. Özet cümle

Kazanım Cepte öğretmene **haftayı cepte** verir.  
MiniBilge aynı alışkanlığı alır; üzerine **çocuğun yaşadığı mikro deneyimi** ve **Bilge’nin şefkatli rehberliğini** koyar.
