# MiniBilge Matematik

Dünyanın en iyi ilkokul matematik öğrenme platformu. React Native + Expo + TypeScript ile geliştirilmiştir.

## Başlangıç

### MiniBilge OS — Canlı Web Arayüzü

Proje kökündeki `index.html` dosyası, tam ekran responsive web arayüzünü sunar:

```bash
# Basit HTTP sunucusu ile
npx serve . -p 3000
# veya
python3 -m http.server 3000
```

Tarayıcıda `http://localhost:3000` adresini açın.

> **Not:** `main` dalından gelen ABC Bağlamaca oyunu `games/abc-baglamaca/` altında korunmuştur.

### Expo Mobil Uygulama

```bash
npm install
npm start
```

Platformlar:
- `npm run web` — Web tarayıcı
- `npm run android` — Android
- `npm run ios` — iOS

## Mimari

```
app/                    # Expo Router ekranları
src/
  core/                 # Tip tanımları, motor kaydı, içerik yükleyici
  engines/              # Yeniden kullanılabilir oyun motorları
  content/              # JSON tabanlı müfredat ve etkinlik verileri
  components/ui/        # Tasarım sistemi bileşenleri
  theme/                # Renkler, tipografi, spacing
docs/                   # Yaşayan dokümanlar
```

## Oyun Motorları

Motorlar içerikten tamamen bağımsızdır. Yeni bir kazanım eklemek için yalnızca JSON payload değiştirilir:

| Motor | ID | Kullanım |
|-------|-----|----------|
| Eşleştirme | `matching` | Sayı-nesne, işlem-sonuç eşleştirme |
| Sürükle Bırak | `drag_drop` | Sıralama, kategorileme |
| Karşılaştırma | `comparison` | Daha fazla, daha az, eşit |

## Dokümantasyon

- [Ürün Anayasası](docs/01-urun-anayasasi.md)
- [Teknik Mimari](docs/02-teknik-mimari.md)
- [Pedagoji El Kitabı](docs/03-pedagoji-el-kitabi.md)
- [UI/UX Tasarım Sistemi](docs/04-ui-ux-tasarim-sistemi.md)
- [Matematik İçerik Fabrikası](docs/05-matematik-icerik-fabrikasi.md)

## Kapsam

- **1-4. Sınıf Matematik** — 24 ünite, 59 kazanım, 59 konu anlatımı, ~354 etkinlik
- **Odak:** Her kazanım bir Öğrenme Merkezi
- **İçerik Fabrikası:** TypeScript tabanlı otomatik aktivite üretimi
