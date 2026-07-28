# Türkiye Yüzyılı Maarif Modeli Hizalaması

> 1. sınıf matematik müfredatı resmî öğretim programının öğrenme alanları ve
> öğrenme çıktılarıyla birebir hizalanmıştır.

## Öğrenme Alanları

Maarif Modeli matematiği soyut kural yığını olmaktan çıkarıp günlük hayatla
bütünleştirir. Bu nedenle üniteler artık işlem türlerine göre değil, resmî
**öğrenme alanlarına** göre yapılandırılmıştır.

| Alan | Ünite | Çıktı |
|------|-------|-------|
| 1 | Sayılar ve İşlemler | 9 |
| 2 | Geometri | 4 |
| 3 | Ölçme | 4 |
| 4 | Veri | 2 |
| | **Toplam** | **19** |

## Kazanım Kodlaması

Biçim: `MAT.{sınıf}.{öğrenme alanı}.{çıktı}`

Örnek: `MAT.1.2.1` → 1. sınıf, Geometri alanı, 1. çıktı (Uzamsal İlişkiler)

## 1. Sınıf Öğrenme Çıktıları

### Sayılar ve İşlemler

| Kod | Çıktı | Konu tipi |
|-----|-------|-----------|
| MAT.1.1.1 | Azlık, çokluk ve eşitlik bakımından karşılaştırma | `comparison` |
| MAT.1.1.2 | 1-100 ileriye, 20'den geriye birer ritmik sayma | `counting` |
| MAT.1.1.3 | İkişer, beşer, onar ritmik sayma | `rhythmic` |
| MAT.1.1.4 | Rakamları okuma ve yazma | `digits` |
| MAT.1.1.5 | Sıra bildiren sayılar | `ordinal` |
| MAT.1.1.6 | Onluk ve birlik gruplama | `place_value` |
| MAT.1.1.7 | 20'ye kadar toplama | `addition` |
| MAT.1.1.8 | 20'ye kadar çıkarma | `subtraction` |
| MAT.1.1.9 | Zihinden toplama ve çıkarma | `mental_math` |

### Geometri

| Kod | Çıktı | Konu tipi |
|-----|-------|-----------|
| MAT.1.2.1 | Uzamsal ilişkiler (yer, yön, konum) | `spatial` |
| MAT.1.2.2 | Temel geometrik şekiller | `geometry` |
| MAT.1.2.3 | Geometrik cisimler | `solids` |
| MAT.1.2.4 | Örüntüler | `patterns` |

### Ölçme

| Kod | Çıktı | Konu tipi |
|-----|-------|-----------|
| MAT.1.3.1 | Standart olmayan uzunluk ölçme | `nonstandard_length` |
| MAT.1.3.2 | Saat, gün, hafta, ay, mevsim | `time` |
| MAT.1.3.3 | Paralarımız | `money` |
| MAT.1.3.4 | Sıvı miktarı | `liquid` |

### Veri

| Kod | Çıktı | Konu tipi |
|-----|-------|-----------|
| MAT.1.4.1 | Tablo ve grafik okuma | `data` |
| MAT.1.4.2 | Grafik oluşturma | `data_create` |

## Hizalama ile Eklenen Kazanımlar

Önceki yapıda bulunmayan ve resmî programın gerektirdiği çıktılar:

- **Ritmik sayma** (ikişer, beşer, onar) — sayı hissinin temeli
- **Sıra bildiren sayılar** — miktar ile sıra ayrımı
- **Onluk ve birlik gruplama** — basamak kavramının hazırlığı
- **Zihinden işlem** — işlem akıcılığı
- **Uzamsal ilişkiler** — geometrinin başlangıç noktası
- **Geometrik cisimler** — iki boyuttan üç boyuta geçiş
- **Örüntüler** (1. sınıfa taşındı) — cebirsel düşünmenin temeli
- **Standart olmayan uzunluk ölçme** — ölçme ihtiyacını sezdirir
- **Para** — finansal okuryazarlığın ilk adımı
- **Sıvı ölçme** — korunum kavramı
- **Veri alanı (tümü)** — istatistiksel okuryazarlık

Ayrıca sayma üst sınırı 20'den **100'e** çıkarılmıştır.

## Kimlik Değişimi ve Veri Güvenliği

Yeniden yapılandırma kazanım kimliklerinin anlamını değiştirdi. Örneğin
`out-1-2-1` önce karşılaştırmaydı, artık uzamsal ilişkilerdir.

Eski ilerleme kayıtlarının sessizce yanlış kazanıma atanmaması için ilerleme
deposu sürümlendi:

```
@minibilge/progress/v2
```

Eski anahtar yorumlanmaz; yanlış veri üretmek yerine devre dışı kalır.

## Otomatik Denetim

```bash
npm run curriculum:check
```

Şunları doğrular:

- Ünite ↔ kazanım tutarlılığı (iki yönlü)
- Ön koşulların var olan kazanımlara işaret etmesi
- Her kazanımda konu anlatımı ve oyun etkinliği bulunması
- Konu anlatımının en az 4 slayt olması
- Her kazanımda en az 2 gerçek hayat bağlamı
- Mikro deneyimlerin geçerli kazanıma bağlı olması

```bash
npm run check   # typecheck + müfredat + MES-002
```
