# MiniBilge Matematik – Ürün Anayasası v2.0

> Bu belge nadiren değişir. Tüm ürün kararları bu anayasaya dayanır.

## Kimlik

MiniBilge, yaşayan bir **Eğitim İşletim Sistemi (Education OS)**'tir. Sıradan bir eğitim uygulaması değildir.

## Kapsam

- **Sadece İlkokul Matematik** (1-4. sınıf)
- Geliştirmeye **1. Sınıf Matematik** ile başlanır
- Matematik bitmeden başka alana geçilmez

### Kapsam ile Mimari Ayrımı

Kapsam kuralı **içerik üretimi** için geçerlidir, mimari için değil.

MiniBilge bir Eğitim İşletim Sistemi olduğu için altyapı ders bağımsız
tasarlanır: oyun motorları hiçbir dersi bilmez, dersler birer modül olarak
kaydedilir. Bu, ileride Türkçe/Fen/Hayat Bilgisi eklenirken sıfırdan
geliştirme değil yalnızca içerik üretimi gerektirmesini sağlar.

Kural nettir:

- Mimari çok derse **hazır** olur → izinli, hatta zorunlu
- Matematik dışında ders **içeriği yayınlanır** → matematik bitene kadar yasak

Planlanan dersler `PLANNED_SUBJECTS` içinde `enabled: false` olarak durur.

## Temel Felsefe

Çocuğa soru çözdürmek değil; matematiği **yaşayarak, keşfederek ve eğlenerek** öğrenmesini sağlamak.

Çocuk uygulamaya ders çalışmak için değil, **bir maceraya çıkmak** için girer.

## Her Kazanım = Öğrenme Merkezi

Tek etkinlik değil; Oyna, Keşfet, Deney Yap, Gerçek Hayat, Ev/Sınıf/Akıllı Tahta, AI Pekiştirme, PDF, Meydan Okuma, Koleksiyon.

## Oyun Felsefesi

- Oyun Motoru Mimarisi
- Oyun ile içerik tamamen ayrı
- ~100 yeniden kullanılabilir motor hedefi
- Payload injection ile veri değişimi, kod değişimi yok

## Yapay Zekâ

Doğru-yanlış kontrolü değil; kavram analizi, öğrenme yolu önerisi, öğretmen ve veli rehberliği.

## Çalışma Prensipleri (10 Soru)

1. Çocuğun öğrenmesini artırıyor mu?
2. Öğretmenin işini kolaylaştırıyor mu?
3. Motor başka kazanımlarda kullanılabilir mi?
4. Düşük donanımda çalışır mı?
5. Offline kullanılabilir mi?
6. Köy okulunda uygulanabilir mi?
7. Akıllı tahtada rahat kullanılabilir mi?
8. Evde veli desteğiyle devam edebilir mi?
9. AI kişiselleştirebilir mi?
10. Rakiplerden gerçekten ayırıyor mu?

## Son Kural

Amaç çok oyun yapmak değil; **çocukların matematiği sevmesini sağlamak**.
