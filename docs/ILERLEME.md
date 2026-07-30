# MiniBilge — İlerleme Panosu

**Güncelleme:** 30 Temmuz 2026  
**Kural:** Her teslimatta bu tablo güncellenir — *hangi kalemde % kaç tamam, % kaç kaldı*.

> Formül: **Tamam %** = kabul / uygulama kapsamı.  
> **Kaldı %** = 100 − Tamam.

---

## 1. Tasarım sistemi (MB-DS)

| Kod | Başlık | Tamam | Kaldı | Kalan iş |
|-----|--------|------:|------:|----------|
| **MB-DS-001** | Görsel dil | **90%** | **10%** | `platform.css` → DS token migrate |
| **MB-DS-002** | TXS (deneyim) | **85%** | **15%** | Tüm modüllerde Gelişmiş paneli |
| **MB-DS-003** | Interaction | **85%** | **15%** | Tüm listelerde infinite scroll |
| **MB-DS-004** | Accessibility | **85%** | **15%** | Tam SR denetim / CI |
| **MB-DS-005** | Motion Language | **100%** | **0%** | Anayasa + runtime kabulü dolu |
| **MB-DS-006** | TXA (mimari) | **70%** | **30%** | Tüm belge modüllerinde TXA-007/008 |
| **MB-DS-007** | Universal Component Library | **75%** | **25%** | Flutter port · derin motor bağları |

**DS paket ortalaması:** **84%** tamam · **16%** kaldı  
*(90+85+85+85+100+70+75) / 7*

---

## 2. Yol haritası (ana kalemler)

| Kod | Tamam | Kaldı | Not |
|-----|------:|------:|-----|
| MB-DM-001 Domain | 100% | 0% | Freeze |
| **MB-VIS-001 Ürün vizyonu** | **90%** | **10%** | Yıllık kaynak güncelleme süreci |
| **MB-AOS-001 / MD-048 Kernel** | **68%** | **32%** | Flutter Feature-First · Security derinliği · legacy boot |
| MB-ARCH-001 Mimari | 100% | 0% | Freeze |
| MB-UI-001 / UI-002 / UI-003 | 95% | 5% | Derin rota cilası |
| MB-IA-001 Bilgi mimarisi | 100% | 0% | 8 modül |
| MB-IA-002 Belge yaşam döngüsü | 70% | 30% | Architecture freeze; motor bağları |
| MB-IA-003 Akıllı belge motoru | 80% | 20% | DNA katalog genişletme |
| MB-DOS-000/001 Document OS | 55% | 45% | Katalog ~14 → ~300 DNA |
| **MB-DOS-002 / MD-047 Core** | **70%** | **30%** | Flutter Isar/Riverpod · Sync derinliği · legacy migrate |
| MD-038 Context Cache | 100% | 0% | |
| MB-WFE-001 / MD-039 | 90% | 10% | Deadline/UI derinliği |
| MB-DOS-003 / MD-040 LEE | 85% | 15% | Canlı ders kanıtı / sync |
| FAZ 6 MB-COMP | 82% | 18% | UCL (MD-046) katalog + lab |
| MB-DM-002 Entity | 100% | 0% | Spec |
| MB-TPM-001 1.sınıf Türkçe | 80% | 20% | Diğer dersler |
| MB-ARCH-002 Flutter | 0% | 100% | Sırada |
| MB-DB-001 → APP-001 | 0% | 100% | Sırada |

**Yol haritası ağırlıklı (aktif web ürünü):** ≈ **78%** tamam · **22%** kaldı  
*(Flutter + DB hattı hariç tutulursa web omurgası ≈ **85%** / **15%**)*

---

## 3. Bu tur özeti (VIS-001 + ders/kaynak)

| Kalem | Tamam | Kaldı |
|-------|------:|------:|
| Ürün vizyonu (MB-VIS-001) | 90% | 10% |
| Ders + MEB kaynak seçimi (Curriculum sources) | 85% | 15% |
| Academic Kernel (MB-AOS-001 / MD-048) | 68% | 32% |
| Document OS Core (MB-DOS-002 / MD-047) | 70% | 30% |
| Sonraki: yeni yıl program kaynakları sources.json’a | — | sürekli |

---

## 4. Ana sayfa başlık yüzdeleri

Ana sayfadaki her başlıkta renkli rozet (`%tamam · kaldı %`):

| Başlık | Anahtar | Tamam |
|--------|---------|------:|
| Öğretmen / web omurgası | `webSpine` | 85% |
| Sınıfını Seç | `home.baglam` | 95% |
| Bugün | `home.bugun` | 90% |
| Dersleri | `home.dersler` | 85% |
| Ana Modüller | `home.ana-moduller` | 78% |
| Planlar … AI (8 hub) | `home.hubs.*` | 40–82% |

Renk: **≥90 yeşil** · **70–89 teal** · **40–69 kehribar** · **&lt;40 kırmızı**

---

## 5. Makine okunur

`assets/data/progress.json` — UI / rapor aynı kaynağı kullanır.

---

*Her PR veya bulut ajan turunda: ilgili satırın Tamam/Kaldı değerleri güncellenir.*
