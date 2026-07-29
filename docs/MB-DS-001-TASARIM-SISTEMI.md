# MB-DS-001 — MiniBilge Tasarım Sistemi

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Görsel dil freeze  
**Bağımlılık:** `MB-UI-001`

> Tüm ekranlar bu sisteme uymak zorundadır.  
> Amaç: tutarlı, resmî, sakin bir **öğretmen işletim sistemi** dili.

---

## 1. Görsel Yön — “Atölye Işığı”

İlkokul öğretmeninin sabah masası: aydınlık, düzenli, güven veren.

| Yasak (AI klişesi) | MiniBilge seçimi |
|--------------------|------------------|
| Mor–indigo gradient / glow | Yok |
| Krem + terracotta + serif broadsheet | Yok |
| Koyu “AI dark mode” varsayılan | Yok — açık atmosfer |
| Yuvarlak hap rozet yığını | Yok |
| Klasik kart ızgarası (dashboard’da) | Yok — bölüm + ayırıcı |

**Atmosfer:** yumuşak buz-mavisi + teal ışık + hafif kehribar sıcaklık (rahatsız etmeyen renkli alan)  
**Mürekkep:** lacivert-siyah  
**Aksiyon:** deniz yeşili (teal)  
**İkincil sıcaklık:** kontrollü kehribar / gökyüzü mavisi (hero chip, timeline)  
**Uyarı:** kontrollü kehribar

---

## 2. CSS Değişkenleri

```css
--mb-ink: #0F2744;
--mb-ink-soft: #3D5166;
--mb-paper: #F3F6F8;
--mb-surface: rgba(255,255,255,0.78);
--mb-line: rgba(15,39,68,0.12);
--mb-accent: #0B7A6A;
--mb-accent-2: #1F9B88;
--mb-warn: #C9842F;
--mb-danger: #B33A3A;
--mb-ok: #2F7D4A;
--mb-bg1: #D7E4EC;
--mb-bg2: #E8EEF2;
--mb-bg3: #F5F1EA; /* yalnızca atmosferde iz; baskın krem tema değil */
--mb-radius: 12px;
--mb-font-display: "Fraunces", Georgia, serif;
--mb-font-ui: "Figtree", "Segoe UI", sans-serif;
```

---

## 3. Tipografi

- **Marka / selamlama:** Fraunces (display)  
- **Arayüz / gövde:** Figtree  
- Ana sayfa markası hero seviyesinde; başlık markayı ezmez  

Ölçek: 12 / 14 / 16 / 20 / 28 / 36

---

## 4. Yerleşim

- Sol menü: 248px, sabit  
- İçerik: max 1080px okuma genişliği  
- Dashboard: **tek sütun akış** + ders şeridi; kart ızgarası yok  
- Mobil: menü üstte yatay kaydırma; içerik tam genişlik  

---

## 5. Bileşenler

| Bileşen | Kural |
|---------|--------|
| **Bölüm (`.mb-section`)** | Başlık + kısa destek cümlesi + içerik; kutu gölgesi yok |
| **Ayırıcı** | `1px` `--mb-line` |
| **Birincil düğme** | Teal dolgu, 10–12px radius, gölgesiz |
| **İkincil düğme** | Çizgili / yüzey |
| **Ders şeridi** | Yatay satırlar; her derste tek CTA “Oluştur” |
| **Görev listesi** | Checkbox + metin + aksiyon; kart değil |
| **Zaman çizgisi** | Yaklaşan işler için dikey nokta+çizgi |
| **Form alanı** | Açık yüzey, ink border |
| **Tablo** | İnce çizgi, zebra yok veya çok hafif |
| **AI komut satırı** | Tek satır input + gönder; sohbet balonu yığını yok |

Kart (border+shadow+radius) **yalnızca** etkileşimli form/sihirbaz adımlarında gerekirse kullanılır.

---

## 6. İkonlar

- Emoji kullanılmaz  
- Basit çizgisel / geometrik işaret veya kısa metin etiketi  
- Menü: tek karakter / 2 harfli kod (AS, OP, YP…) veya SVG stroke  

---

## 7. Hareket

En az 2–3 bilinçli hareket:

1. Sayfa girişinde selamlama fade/slide (180ms)  
2. Görev tamamlanınca checkbox scale  
3. Ders satırı hover’da CTA belirginleşir  

Gürültülü parallax / glow yok.

---

## 8. Erişilebilirlik

- Metin kontrastı WCAG AA  
- Odak halkası teal  
- Dokunma hedefi ≥ 40px  

---

## 9. Uygulama Dosyaları

| Dosya | Rol |
|-------|-----|
| `assets/css/ds.css` | DS değişkenleri + bileşenler |
| `assets/css/platform.css` | Legacy uyum; kademeli DS’e taşınır |
| Google Fonts: Fraunces + Figtree | `index.html` ve layout |

---

## 10. Deneyim katmanı

Görsel dil bu belgededir. Öğretmen deneyimi anayasası:

→ **`docs/MB-DS-002-TEACHER-EXPERIENCE-SYSTEM.md`** (TXS-001…010)

---

*Bu sistem UI-001 ekranlarına uygulanır; yeni ekran DS onayı olmadan stil eklemez.*
