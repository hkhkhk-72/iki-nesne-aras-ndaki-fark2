# MB-COMP-004 … 008 — Destek Bileşen Aileleri

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Spesifikasyon (FAZ 6 · P1)  
**Üst:** MB-COMP-001

---

## MB-COMP-004 — AI Components

Tek AI görsel dili. Metinlerde emoji zorunlu değildir; ikon `AI` markası kullanılır.

| Bileşen | Aksiyon |
|---------|---------|
| `AiCreate` | AI ile Oluştur |
| `AiSuggest` | AI’dan Öneri Al |
| `AiFix` | AI Düzelt |
| `AiUpdate` | AI Güncelle |
| `AiCheck` | AI Kontrol Et |

Ortak props: `label?`, `busy?`, `disabled?`, `onClick`, `size: 'sm'|'md'`.

Bağlantı: `modules/ai.html` / MB-AI motoru.

---

## MB-COMP-005 — Status Components

| Kod | Etiket | Renk (DS) |
|-----|--------|-----------|
| `ready` | Hazır | yeşil `--mb-ok` |
| `editing` | Düzenleniyor | kehribar `--mb-warn` |
| `updated` | Güncellendi | gökyüzü `--mb-sky` |
| `missing` | Eksik | kırmızı `--mb-danger` |

Bileşen: `StatusBadge({ status, label? })`.

Belge / plan kartlarında tek kaynak.

---

## MB-COMP-006 — Notification Components

| Tür | Kullanım |
|-----|----------|
| `info` | Bilgi |
| `success` | Başarı |
| `warn` | Uyarı |
| `critical` | Kritik |

Bileşenler: `Toast({ type, title, message, timeout })`, `Banner({ type, message, dismissible })`.

Global kuyruk: `MiniBilgeComponents.notify.success('…')`.

---

## MB-COMP-007 — Calendar Components

Yalnızca tarih seçici değil — **Takvim Motoru** bağlantılı.

Gösterilecekler:

- Resmî tatiller · Ara tatiller  
- Belirli Gün ve Haftalar  
- Veli toplantıları · Zümre tarihleri  
- Rehberlik etkinlikleri · Kulüp faaliyetleri  
- Sınav takvimi  

Bileşenler: `DateSelector`, `CalendarMonth`, `EventChip`, `UpcomingEvents`.

---

## MB-COMP-008 — Teacher Profile Components

Merkezi profil → belgelerde otomatik doldurma.

| Bileşen | Alanlar |
|---------|---------|
| `SchoolInfo` | okul, il, ilçe |
| `TeacherInfo` | ad, branş, iletişim |
| `ScheduleSummary` | ders programı özeti |
| `SignatureBlock` | öğretmen / müdür imza |
| `DirectorInfo` | müdür bilgisi |

Kaynak: `MiniBilgeStorage` (`getSchool`, `getProfile`, settings).  
Smart Form `SchoolSelector` bu veriyi okur/yazar.

---

*P1 aileleri Components Lab’da vitrinlenir; üretim ekranlarına kademeli bağlanır.*
