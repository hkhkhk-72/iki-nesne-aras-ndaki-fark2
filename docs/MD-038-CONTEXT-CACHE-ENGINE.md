# MD-038 — Context Cache Engine

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** 🔒 Bağlayıcı freeze  
**Üst:** MD-031 Context First · MD-032 Zero Input · MB-IA-003  
**Kod:** `assets/js/core/context-cache.js`

> **Load Once — Use Everywhere**  
> Kullanıcı aynı bilgiyi ikinci kez girmez. TeacherContext bir kez yüklenir; oturum boyunca tüm motorlar aynı cache’i kullanır.

---

## 1. Karar

`TeacherContext` oluştuğu anda aşağıdaki alanlar **Context Cache**’e alınır:

| Alan |
|------|
| Öğretmen |
| Okul |
| İl |
| İlçe |
| Müdür |
| Müdür Yardımcısı |
| Eğitim Öğretim Yılı |
| Sınıf |
| Şube |
| Ders Programı |
| Haftalık Ders Saatleri |

Bu bilgiler **session** boyunca ortaktır. Hiçbir belge bu alanları yeniden sormaz.

---

## 2. Tüketiciler (zorunlu)

| Motor | Kullanım |
|-------|----------|
| Teaching Program Engine (TPM) | program / ders bağlamı |
| Calendar Engine (TCM) | yıl / hafta |
| Planning Engine (YPM/GPM) | sınıf / şube / saat |
| Document Engine (BM) | üst bilgi / DNA |
| Assessment Engine (AIE) | sınıf bağlamı |
| Character Engine (CDE) | okul / sınıf |
| Workflow Engine (TWE) | aktif bağlam |

Hepsi `ContextCacheService.get()` okur; storage’ı doğrudan “form için” sorgulamaz.

---

## 3. DDD yapıtaşları

| Tür | Ad | Rol |
|-----|-----|-----|
| Component / Service | `ContextCacheService` | yükle, oku, invalidate |
| Aggregate | `TeacherContextAggregate` | tutarlı bağlam kökü |
| Domain Event | `TeacherContextLoaded` | cache dolduğunda yayınlanır |
| Rule | **Load Once — Use Everywhere** | ikinci giriş yasak |

---

## 4. Yaşam döngüsü

```
Uygulama açılır / sınıf-şube seçilir
  → ContextCacheService.load()
  → TeacherContextAggregate oluşturulur
  → TeacherContextLoaded event
  → Tüm motorlar Cache.get() kullanır
```

Invalidate yalnızca:

- profil / okul kaydı değişince  
- aktif sınıf/şube değişince  
- eğitim yılı değişince  

---

## 5. API (web)

```js
await ContextCacheService.load({ cal }); // bir kez
const agg = ContextCacheService.get();   // TeacherContextAggregate
ContextCacheService.on('TeacherContextLoaded', handler);
ContextCacheService.invalidate();        // sonra tekrar load
```

---

## 6. Zero Input ilişkisi

MD-032 “sistem bilir” der.  
MD-038 “sistem bildiğini **bir kez yükleyip her yerde kullanır**” der.

Smart Form (MD-033) cache’teki alanları asla tekrar sormaz.

---

*Uygulama: `ContextCacheService` · ContextEngine cache üzerinden okur.*
