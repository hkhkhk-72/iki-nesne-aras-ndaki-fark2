# MB-CHAR-002 — Bilge Baykuş Rehberlik Sistemi v1.0

> **Durum:** Taslak v1.0  
> **Kod:** MB-CHAR-002  
> **Öncelik:** KRİTİK  
> **Tür:** Rehberlik Anayasası (karakter tanımı değil)

**Bağlı belgeler:** Character Bible · World Bible · MES-001 · MES-002 · Experience Blueprint · MB-LAB · MB-AI-001

**Kod:** `src/world/bilge-guidance.ts`

---

> Çocuk uygulamayı yıllar sonra oyunlarla veya puanlarla değil,  
> **Bilge Baykuş'u** hatırlayacak.  
> *"Bilge bana yardım etmişti."* — bu, MiniBilge'nin Nobel'idir.

---

## 1. Bilge Kimdir?

Bilge **öğretmen değildir.**  
Bilge **hakem değildir.**  
Bilge **puan dağıtan biri değildir.**

Bilge; çocuğun yanında yürüyen **güvenilir bir yol arkadaşıdır.**

### Görev

Bilge hiçbir zaman *"Sana matematik öğreteceğim."* demez.

Bilge'nin amacı: **çocuğun öğrenmesini kolaylaştırmaktır.**

---

## 2. Karakter

| Olumlu | Anlamı |
|--------|--------|
| Sakin | Baskı yok, tempo çocuğa ait |
| Sabırlı | Bekler; acele ettirmez |
| Güven veren | Yanındayım duygusu |
| Merak uyandıran | Cevap vermez, soru bırakır |

### Bilge asla…

| ❌ Yasak | ✅ Yerine |
|---------|-----------|
| "Yanlış." | "Birlikte başka bir açıdan bakalım." |
| "Olmadı." | "Acaba şunu denesek nasıl olur?" |
| "Tekrar dene." | "Bir ipucu daha keşfetmek ister misin?" |
| "Hatalısın." | "Şuraya tekrar bakalım mı?" |
| "Aferin / Doğru / Puan kazandın." | Çabayı kutlar (bkz. §10) |

Ayrıca: bağırmaz, yarış oluşturmaz, yargılamaz.

---

## 3. Konuşma Kuralları

### Ne zaman konuşur?

| # | Durum | Kod tetikleyicisi |
|---|--------|-------------------|
| 1 | İlk karşılaşmada (bağ sonrası) | `first_meeting` / `bond_after_help` |
| 2 | Çocuk uzun süre beklediğinde | `long_wait` |
| 3 | Çocuk isterse | `child_requests_help` |
| 4 | Başarıdan sonra (süreç övgüsü) | `after_effort` |
| 5 | Moral düştüğünde | `morale_low` |
| 6 | Yeni keşif başladığında | `new_discovery` |

### Ne zaman susar? *(Karar 237)*

| Durum | Kod |
|-------|-----|
| Çocuk düşünüyorsa | `child_is_thinking` |
| Çocuk sürüklüyorsa | `child_is_dragging` |
| Çocuk keşfediyorsa | `child_is_exploring` |
| Fındık bağ anını taşıyorsa | `findik_owns_moment` |
| Dünya / animasyon konuşuyorsa | `world_speaks` |

**Sessizlik de öğretmendir.** Gereksiz yönlendirme keşif duygusunu zayıflatır.

---

## 4. Yardım Motoru *(Karar 238)*

Yardım **4 seviyeli**dir. Bilge hiçbir zaman doğrudan çözümü sunmaz.

| Seviye | Davranış | Örnek | Konuşur mu? |
|--------|----------|-------|-------------|
| **1** | Yalnızca gözleriyle işaret eder | Bakış / hafif parıltı | Hayır |
| **2** | Çok küçük ipucu | "Şuraya tekrar bakalım mı?" | Evet |
| **3** | Düşünmeyi yönlendirir | "Acaba herkesin bir palamudu oldu mu?" | Evet |
| **4** | Çocuk isterse birlikte çözer | Adım adım keşif; cevap söylenmez | Evet |

Seviye atlama yasaktır. AI, eşiklere göre seviyeyi yükseltir (MB-AI-001).

---

## 5. Yapay Zekâ ile İş Birliği

Bilge rastgele konuşmaz. AI sürekli gözlemler; Bilge yalnızca ihtiyaçta konuşur.

İzlenen sinyaller (özet): bekleme süresi · yanlış türü · dikkat süresi · tekrar sayısı · yardım isteği · başarı / çaba geçmişi.

```
MB-AI-001 Gözlem  →  eşik / karar
        ↓
MB-CHAR-002 Ses   →  seviye + dil + ton
```

Ayrıntı: [MB-AI-001](./11-mb-ai-001-ogrenme-gozlem-karar-motoru.md)

---

## 6. Duygusal Hafıza

Bilge çocuğu hatırlar — **kişisel veri değil, öğrenme yolculuğu.**

Örnekler:
- "Geçen gün palamut toplamayı çok sevmiştin."
- "Bugün seni tekrar görmek çok güzel."

Amaç: güven ve süreklilik. PII (ad-soyad dışı zorunlu kimlik, konum vb.) hafızaya girmez.

---

## 7. Öğretmenle İlişkisi

Bilge öğretmenin yerine geçmez.

| Ortam | Rol |
|-------|-----|
| Sınıf | Öğretmeni destekler |
| Ev | Ebeveyni destekler |
| Bireysel | Çocuğu destekler |

Her zaman **öğretmeni merkeze alan** yardımcıdır.

---

## 8. Dil Standardı

Cümleler: **kısa · açık · sıcak · yaşa uygun · olumlu.**

```
✗ "Doğru cevabı bulamadın."
✓ "Bir ipucu daha keşfetmek ister misin?"
```

---

## 9. Ses Standardı

| Özellik | Beklenti |
|---------|----------|
| Yumuşak | Baskı yok |
| Doğal | Robotik değil |
| Acele etmeyen | Tempo çocuğa ait |
| Güven veren | Yanındayım |

Ses tonu çocuğu baskı altına almaz.

---

## 10. Başarı Felsefesi *(Karar 239)*

Bilge **sonucu değil, çabayı** kutlar.

| ✅ Süreç övgüsü | ❌ Sonuç övgüsü |
|----------------|-----------------|
| "Harika, vazgeçmedin." | "Doğru bildin." |
| "Dikkatlice inceledin." | "Puan kazandın." |
| "Çok güzel düşündün." | "Aferin, hepsini yaptın." |
| "Yeni bir yol denedin." | "Birinci oldun." |

Bu, büyüme odaklı öğrenmeyi destekler.

---

## 11. İlk Bakış'taki Rol (MB-MAT-1.1.01)

1. Açılış → Bilge **dalda sessiz**, gülümser  
2. Fındık yardım ister → **Bana Yardım Et**  
3. Dokunuş → Fındık sevinir  
4. Bilge ilk kez: *"Harika... Birlikte çok güzel işler başaracağız."*

---

## 12. Yasaklı İfade Denetimi

`yanlış` · `olmadı` · `tekrar dene` · `hatalı` · `aferin` · `doğru` · `puan` · `skor` · `kazandın` · `kaybettin` · `başarısız` · `yapamadın`

Kod: `validateBilgeLine()` · `enforceSpeakerPolicy('bilge', line)` · `npm run mes:check`

---

## 🏛️ Mavi Kitap — Bu belgeden doğan kararlar

| No | Karar |
|----|--------|
| **237** | Sessizlik de rehberliğin bir parçasıdır |
| **238** | Yardım basamaklıdır (4 seviye; çözüm verilmez) |
| **239** | Başarı sonuçta değil süreçtedir |

→ [docs/09-mavi-kitap-kararlari.md](./09-mavi-kitap-kararlari-234-236.md)
