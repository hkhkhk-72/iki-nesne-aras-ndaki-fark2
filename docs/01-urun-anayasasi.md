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

## Mavi Kitap — Güncel Kararlar (özet)

| No | Karar |
|----|--------|
| 231 | Sezgisel matematik önceliği — önce gör, sonra say |
| 234 | Dünya önce, arayüz sonra (%70/%20/%10) |
| 235 | İlk 60 saniyede matematik kelimesi yok |
| 236 | Her mikro deneyim tek öğrenme hedefi |
| 237 | Sessizlik de rehberliğin bir parçasıdır |
| 238 | Yardım basamaklıdır (4 seviye; çözüm yok) |
| 239 | Başarı sonuçta değil süreçtedir |
| 268 | İlk karar güvenli · bakış seçilen nesneye |
| 269 | Yanlış seçim yok · her etkileşim keşif |
| 270 | Beklemede yaşayan dünya (mimik→bakış→ses→rehber→metin) |
| 271 | Sessizlik de bir geri bildirimdir |
| 272 | Hata söylenmez, hissettirilir |
| 273 | Düşünme süresi başarı süresinden değerlidir (Reflection Time) |
| 274 | Keşif anı çocuğa aittir |
| 275 | Dünya kutlar, arayüz değil |
| 276 | Süreç sonuçtan değerlidir |
| 277 | Karakter soruyu yaşar, söylemez |
| 278 | Beklemek öğretimin bir parçasıdır |
| 279 | Merak cevaptan önce gelir |
| 280 | 1–4 asla saydırılmaz |
| 281 | 5+ alt grup (3+2, 4+1…) |
| 282 | Timer / hız baskısı yasak |
| 283 | Kavram nesneden bağımsızdır |
| 284 | Her kavram en az üç bağlamda yaşatılır |
| 285 | Tekrar değil, transfer |
| 286 | Her LS CPA destekler |
| 287 | Gör → Hisset → İsimlendir |

Ayrıntı: [docs/09…](./09-mavi-kitap-kararlari-234-236.md)
· [MB-CHAR-002](./10-mb-char-002-bilge-rehberlik-sistemi.md)
· [MB-AI-001](./11-mb-ai-001-ogrenme-gozlem-karar-motoru.md)
