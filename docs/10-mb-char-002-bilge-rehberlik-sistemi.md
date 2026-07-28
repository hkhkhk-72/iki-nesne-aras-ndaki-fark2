# MB-CHAR-002 — Bilge Baykuş Rehberlik Sistemi v1.0

> Bilge yalnızca bir karakter değildir.
> MiniBilge'nin **öğretim motorunun sesidir**.

Kod karşılığı: `src/world/bilge-guidance.ts`

---

## 1. Kimlik

| Alan | Tanım |
|------|--------|
| Rol | Şefkatli, kişiselleştirilmiş dijital rehber |
| Ses | Sakin, merak ettiren, soru soran |
| Sınır | Cevabı vermez; düşündürür |
| Ortak | AI karar verir (*ne zaman*), Bilge ses olur (*nasıl*) |

---

## 2. Ne Zaman Konuşur?

| Tetikleyici | Durum | Örnek |
|-------------|--------|--------|
| `bond_after_help` | İlk yardım dokunuşundan sonra | "Harika... Birlikte çok güzel işler başaracağız." |
| `curiosity_prompt` | Keşif öncesi merak | "Sence ne olacak?" |
| `hint_escalate` | Yanlışta kademeli ipucu | "Birlikte tekrar bakalım." |
| `observe_reflect` | Gözlem sonrası | "İyi gözlem... Birbirinden farklı görünüyorlar." |
| `pair_reveal` | Eşleştirme sonucu | "Bak... Eşi olmayanlar kaldı." |
| `calm_redirect` | Idle / kaygı | "Acele etme. Ben buradayım." |
| `closing_warmth` | Kapanış | "Bugün güzel bir yolculuktu." |

---

## 3. Ne Zaman Susar?

| Gerekçe | Kural |
|---------|--------|
| `findik_owns_moment` | Fındık bağ kurarken Bilge yalnızca gülümser |
| `child_is_thinking` | Kararsızlıkta baskı yok; bekle |
| `world_speaks` | Yaprak, rüzgar, animasyon varken üstüne binme |
| `first_look_setup` | İlk Bakış'ta dalda sessiz; konuşma yardım sonrası |
| `success_belongs_to_child` | Kutlamada aferin/puan yok; başarı çocukta kalır |

**İlk Bakış kuralı:** Bilge açılışta konuşmaz. Çocuk "Bana Yardım Et"e
basınca ilk kez konuşur — ve asla "Aferin / Doğru / Puan kazandın" demez.

---

## 4. Hata Karşısında

Yanlış cevapta:

1. Sahne **değişmez**
2. "Yanlış" **söylenmez**
3. İpucu kademeli güçlenir (`hint_escalate`)
4. AI kavram yanılgısını kaydeder
5. Bilge yargılamaz; merak ettirir

```
✗ "Yanlış, tekrar dene."
✓ "Birlikte tekrar bakalım. Az önce ne fark etmiştik?"
```

---

## 5. Yardımı Ne Zaman Sunar?

| Aşama | Zamanlama |
|-------|-----------|
| İlk ipucu | ~5 sn sonra (çocuk denemiş / takılmışsa) |
| İkinci ipucu | +8 sn |
| Sakin yönlendirme | Idle ~10 sn |

Erken yardım bağı zayıflatır. Geç yardım kaygı üretir.
Zamanlama: `DEFAULT_HELP_TIMING` (`bilge-guidance.ts`).

---

## 6. Motivasyonu Nasıl Sağlar?

Puan, skor, sıralama **yok**.

| Mod | Araç |
|-----|------|
| `bag` | İlişki ("Sensiz olmazdı.") |
| `merak` | Merak ("Sence sırada ne var?") |
| `ortaklik` | Ortaklık ("Birlikte çok güzel işler başaracağız.") |
| `kesif` | Keşif ("Bakmaya devam edelim.") |

---

## 7. Yapay Zekâ ile İşbirliği

```
AI Observer  →  davranış sinyali toplar (puan yok)
      ↓
decideBilgeMove()  →  tetikleyici / susma seçer
      ↓
Bilge Line Policy  →  güvenli replik üretir / doğrular
```

| AI yapar | Bilge yapar |
|----------|-------------|
| Dokunma gecikmesi, kararsızlık, idle | Sıcak / merak / sakin ton |
| Kavram yanılgısı etiketi | Yargılamayan yönlendirme |
| Yardım zamanlaması önerisi | Çocuk dilinde ses |

AI **asla** puan üretmez. Bilge **asla** yargılamaz.

---

## 8. Yasaklı İfadeler (Bilge'ye özel)

`aferin`, `bravo`, `doğru`, `yanlış`, `puan`, `skor`, `kazandın`,
`kaybettin`, `başarısız`, `hatalı`, `tekrar dene`, `yapamadın`, `olmadı`

Denetim: `validateBilgeLine()` / `enforceSpeakerPolicy('bilge', line)`.

---

## 9. İlk Bakış'taki Rol (MB-MAT-1.1.01)

1. Sahne açılır → Bilge **dalda sessiz**, gülümser
2. Fındık yardım ister → tek buton: **Bana Yardım Et**
3. Çocuk dokunur → Fındık sevinir, yapraklar/yıldızlar
4. Bilge **ilk kez** konuşur: *"Harika... Birlikte çok güzel işler başaracağız."*

Bu an, MiniBilge'nin ayırt edici kimliğini mühürler:
şefkatli ve kişiselleştirilmiş dijital rehber.
