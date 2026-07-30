# MB-AI-001 — Öğrenme Gözlem ve Karar Motoru v1.0

> **Durum:** Taslak v1.0  
> **Kod:** MB-AI-001  
> **Öncelik:** KRİTİK  
> **Bağlı:** MB-CHAR-002 · MES-002 · Character Bible · Öğretmen Paneli

**Kod:** `src/ai/decision-engine.ts` · gözlem: `src/ai/observer.ts`

---

> Yapay zekâ, öğretmenin yerini alan bir sistem değildir.  
> Çocuğun ritmine saygı duyan, **şefkatli bir rehberlik motorudur.**

MB-CHAR-002 **nasıl konuşulacağını** tanımlar.  
MB-AI-001 **ne zaman konuşulacağını** (ve ne zaman susulacağını) tanımlar.

---

## 1. İlkeler

1. **Puan yok** — motor skor üretmez.
2. **Rastgele konuşma yok** — yalnızca eşik aşıldığında müdahale.
3. **Sessizlik varsayılandır** — Karar 237.
4. **Yardım basamaklıdır** — Karar 238; cevap asla verilmez.
5. **Övgü süreçedir** — Karar 239.
6. **Öğretmen merkezde** — AI öğretmeni ikame etmez; destekler.

---

## 2. Hangi Davranışlar İzlenir?

| Sinyal | Anlamı |
|--------|--------|
| `wait_time` | Kararsızlık / düşünme |
| `error_type` | Kavram yanılgısı türü |
| `attention_span` | Idle / dikkat |
| `retry_count` | Takılma veya ısrar |
| `help_request` | Açık yardım isteği |
| `effort_history` | Çaba / yolculuk hafızası |
| `first_choice` | İlk anda kavram oturdu mu |
| `touch_latency` | İlk bakış telemetrisi |
| `drag_active` | Sürükleme → zorunlu sus |
| `explore_active` | Keşif → zorunlu sus |

---

## 3. Bilge'yi Devreye Sokan Eşikler

Varsayılanlar (`DEFAULT_THRESHOLDS`):

| Eşik | Süre / sayı | Bilge tepkisi |
|------|-------------|---------------|
| Düşünme penceresi | &lt; 5 sn kararsızlık | **SUS** |
| Seviye 1 bakış | ≥ 5 sn | Sessiz işaret (konuşmaz) |
| Seviye 2 ipucu | ≥ 8 sn veya 1 retry | Küçük ipucu |
| Seviye 3 yönlendirme | ≥ 14 sn veya 2+ retry | Düşünmeyi yönlendir |
| Seviye 4 birlikte | Çocuk isterse | Birlikte çöz; cevap yok |
| Idle | ~10 sn+ | Sakin yönlendirme |
| Moral düşüşü | 3+ retry + idle | Moral desteği |
| Akıcı başarı | ilk seçim doğru, retry 0 | Süreç övgüsü |

Fonksiyon: `decideIntervention(ctx)`.

---

## 4. Ne Zaman Hiç Müdahale Edilmez?

| Durum | Gerekçe |
|-------|---------|
| Çocuk düşünüyor (pencere içi) | Sessizlik öğretmendir |
| Çocuk sürüklüyor | Akışı bozma |
| Çocuk keşfediyor | Keşif duygusunu koru |
| Eşik aşılmadı | `no_need` |
| Fındık bağ anı | Duygusal sahiplik Fındık'ta |
| Dünya animasyonu | Üstüne binme |

---

## 5. Öğretmen Paneline Yansıyan Veriler

Nitel özet — **puan / yüzde / sıralama yok.**

| Dahil | Hariç |
|-------|-------|
| Kavram durumu (Güçlü / Gelişiyor / Destek Gerekli) | Ham dokunma milisaniyeleri (kişiselleştirme) |
| Kavram yanılgısı etiketleri | Yardım isteği sıklığı (kişisel ritim) |
| Dikkat dağınıklığı notu | Sürükleme / keşif anlık bayrakları |
| Tekrar örüntüsü (özet) | Duygusal hafıza cümleleri |
| Pedagojik sonraki adım önerisi | Cihaz kimliği, PII |

Kod: `toTeacherSafeSummary()` · `DATA_ROUTING` · `teacherVisible()`.

---

## 6. Yalnızca Kişiselleştirme İçin Kullanılan Veriler

| Veri | Kullanım |
|------|----------|
| `touch_latency` / İlk Bakış ritmi | Bağ temposu, acele ettirmeme |
| `help_request` | Yardım basamağı tercihi |
| `effort_history` | "Geçen gün… sevmiştin" yolculuk cümleleri |
| Anlık `drag_active` / `explore_active` | O anki sessizlik; cihazda kalır |

Bu veriler öğretmen paneline **ham** olarak yansımaz.

---

## 7. Karar Akışı

```
ExperienceObserver (sinyal)
        ↓
decideIntervention (eşik + Karar 237/238/239)
        ↓
┌───────────────┬────────────────┐
│ silence/gaze  │ speak / praise │
└───────┬───────┴────────┬───────┘
        ↓                ↓
   (sessiz kal)   MB-CHAR-002 dil/ton
        ↓                ↓
   öğretmen özeti (safe) + kişiselleştirme
```

---

## 8. Bilge × AI Sözleşmesi

| Katman | Sorumluluk |
|--------|------------|
| MB-AI-001 | *Ne zaman?* — eşik, seviye, sus/konuş |
| MB-CHAR-002 | *Nasıl?* — dil, ton, yasak, süreç övgüsü |
| MES-002 | *Nerede?* — sahne, etkileşim, AIObservationSpec |

AI **asla** puan üretmez. Bilge **asla** yargılamaz. Öğretmen **asla** kenara itilmez.
