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
  core/                 # OS çekirdeği: tipler, motor/ders kaydı, ayarlar
  mes/                  # MES-002 mikro deneyim sistemi + sahne çalıştırıcı
  modules/math/         # Mikro deneyimler (MB-MAT-1.1.01 ...)
  world/                # Matematik Köyü + karakterler
  ai/                   # Davranış gözlemi ve yorum katmanı
  engines/              # Yeniden kullanılabilir oyun motorları
  subjects/             # Ders modülleri
  content/              # Müfredat verileri ve içerik fabrikaları
  components/ui/        # Tasarım sistemi bileşenleri
  theme/                # Renkler, tipografi, spacing
docs/                   # Yaşayan dokümanlar
```

## İki Katmanlı İçerik

| Katman | Amaç | Durum |
|--------|------|-------|
| **Kazanım/Etkinlik** | Genişlik — 1-4. sınıf tüm müfredat | 59 kazanım, ~354 etkinlik |
| **MES-002 Mikro Deneyim** | Derinlik — sinematik, AI gözlemli macera | 1 referans ders (MB-MAT-1.1.01) |

MES-002 kalite çıtasıdır; müfredat bu standarda kademeli taşınır.

## Oyun Motorları

Motorlar hem içerikten hem **dersten** bağımsızdır. Yeni bir kazanım eklemek için yalnızca payload değiştirilir:

| Motor | ID | Kullanım |
|-------|-----|----------|
| Konu Anlatım | `lesson` | Slayt tabanlı ders anlatımı |
| Eşleştirme | `matching` | Sayı-nesne, işlem-sonuç eşleştirme |
| Sürükle Bırak | `drag_drop` | Sıralama, kategorileme |
| Karşılaştırma | `comparison` | Daha fazla, daha az, eşit |

## Ders Modülleri

MiniBilge bir Eğitim İşletim Sistemi'dir: motorlar çekirdek, dersler eklentidir.

```
src/subjects/
  math/         → İlkokul Matematik (etkin)
  index.ts      → registerSubject ile OS'e kayıt
```

Aynı motor birden fazla derste kullanılabilir — kod değişmez, yalnızca veri değişir:

```
Karşılaştırma Motoru
├── Matematik  → "3 elma mı 5 elma mı fazla?"
├── Türkçe     → "hangi kelime daha uzun?"     (planlandı)
└── Fen        → "hangi hayvan daha ağır?"      (planlandı)
```

> **Kapsam kuralı:** Ürün Anayasası gereği matematik tamamlanmadan başka ders
> etkinleştirilmez. Mimari hazırdır, içerik üretimi sıralıdır.

## Dokümantasyon

- [Ürün Anayasası](docs/01-urun-anayasasi.md)
- [Teknik Mimari](docs/02-teknik-mimari.md)
- [Pedagoji El Kitabı](docs/03-pedagoji-el-kitabi.md)
- [UI/UX Tasarım Sistemi](docs/04-ui-ux-tasarim-sistemi.md)
- [Matematik İçerik Fabrikası](docs/05-matematik-icerik-fabrikasi.md)
- [MES-002 Mikro Deneyim Standardı](docs/06-mes-002-mikro-deneyim-standardi.md)
- [World & Character Bible](docs/07-world-character-bible.md)

## Kapsam

- **1-4. Sınıf Matematik** — 24 ünite, 59 kazanım, 59 konu anlatımı, ~354 etkinlik
- **Odak:** Her kazanım bir Öğrenme Merkezi
- **İçerik Fabrikası:** TypeScript tabanlı otomatik aktivite üretimi
