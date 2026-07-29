# MB-COMP-001 — MiniBilge Component Library

**Sürüm:** 1.0  
**Tarih:** 29 Temmuz 2026  
**Durum:** Bağlayıcı katalog (FAZ 6)  
**Üst:** FAZ-6 · MD-025 · MB-DS-001 · MB-UI-002  
**Uygulama:** `assets/js/components/` · `assets/css/components.css`

> Platformun temel taşı. Ekran değil; **parça** tasarlanır.

---

## 0. Sözleşme ilkeleri

| İlke | Açıklama |
|------|----------|
| Tek kaynak | Aynı UI işi tek bileşende |
| DS token | Yalnızca `--mb-*` değişkenleri |
| Motor bağları | Seçiciler ilgili engine’e bağlanır (takvim, TPM, storage) |
| Flutter-ready | Prop adları Flutter widget’ına birebir taşınabilir |
| Erişilebilirlik | `role`, `aria-*`, klavye |

**API biçimi (web):**

```js
MiniBilgeComponents.ClassTabs({ active: '1', onChange: (sinif) => {} })
// → { html, mount(el) }
```

---

## 1. Navigation Components

| Bileşen | ID | Props (çekirdek) | Not |
|---------|-----|------------------|-----|
| Side Menu | `SideMenu` | `items`, `activeId`, `sinif` | Mevcut `MiniBilgeNav` sarmalanır |
| Top Bar | `TopBar` | `title`, `actions[]` | Modül sayfaları |
| Bottom Navigation | `BottomNav` | `items`, `activeId` | Mobil |
| Breadcrumb | `Breadcrumb` | `crumbs[{label,href}]` | |
| Class Tabs | `ClassTabs` | `active`, `grades=[1..4]`, `onChange` | UI-002 zorunlu |
| Back Button | `BackButton` | `href`, `label` | |

---

## 2. Dashboard Components

| Bileşen | ID | İçerik |
|---------|-----|--------|
| Today’s Lessons | `TodaysLessons` | Sınıf ders şeridi |
| Today’s Tasks | `TodaysTasks` | TWE maddeleri |
| Upcoming Events | `UpcomingEvents` | Takvim motoru |
| AI Suggestions | `AiSuggestions` | MB-AI öneri kartı |
| Recent Documents | `RecentDocuments` | Son plan/evrak |
| Quick Actions | `QuickActions` | Kısa CTA grubu |

> UI-002: hub etkileşim konteyneridir; klasik “istatistik kart ızgarası” değildir.

---

## 3. Plan Components

| Bileşen | ID | Motor |
|---------|-----|-------|
| Annual Plan Card | `AnnualPlanCard` | MB-YPM |
| Daily Plan Card | `DailyPlanCard` | MB-GPM |
| BEP Card | `BepCard` | MB-DEM |
| İYEP Card | `IyepCard` | MB-İYEP |
| Support Education Card | `SupportPlanCard` | MB-DEM |
| Exercise Plan Card | `ExercisePlanCard` | MB-EGZ |

Ortak alanlar: `title`, `sinif`, `ders`, `status`, `href`, `updatedAt`.

---

## 4. Document Components

| Bileşen | ID | Rol |
|---------|-----|-----|
| Document Card | `DocumentCard` | Liste öğesi |
| Document Preview | `DocumentPreview` | Önizleme paneli |
| Document Editor | → **COMP-002** | Universal Document Builder |
| PDF Viewer | `PdfViewer` | |
| Print Preview | `PrintPreview` | |
| Export Menu | `ExportMenu` | HTML / Word / PDF / Yazdır |

---

## 5. Smart Form Components

Tekrarlayan form yok. Bağlam zincirleri:

### SchoolSelector
`Okul → İl → İlçe → Müdür → Öğretmen → Şube`  
Kaynak: `MiniBilgeStorage` profil / okul.

### LessonSelector
`Sınıf → Ders → Ünite → Öğrenme Çıktısı → Tema → Hafta → Kazanım`  
Kaynak: TPM + KazanimEngine + takvim.

### DateSelector
Takvim Motoru (`CalendarEngine`) — tatil / belirli gün farkındalığı.

### StudentSelector
BEP · İYEP · Destek · RAM aynı bileşeni kullanır.

| Bileşen | ID |
|---------|-----|
| School Selector | `SchoolSelector` |
| Lesson Selector | `LessonSelector` |
| Date Selector | `DateSelector` |
| Student Selector | `StudentSelector` |
| Field / Label | `FormField` |
| Wizard Steps | `WizardSteps` |

---

## 6. Diğer aileler (özet)

- **COMP-002** Universal Document Builder — belge kalbi  
- **COMP-003** Universal Table — tek tablo  
- **COMP-004** AI aksiyonları (`AiCreate`, `AiSuggest`, `AiFix`, `AiUpdate`, `AiCheck`)  
- **COMP-005** Status (`ready` / `editing` / `updated` / `missing`)  
- **COMP-006** Notification (`info` / `success` / `warn` / `critical`)  
- **COMP-007** Calendar (tatiller, belirli gün, zümre, veli, kulüp, sınav…)  
- **COMP-008** Teacher Profile (okul, öğretmen, branş, program, imza, müdür)

Detay belgeler: `MB-COMP-002` … `MB-COMP-008`.

---

## 7. Dosya haritası (web)

```
assets/js/components/
  mb-components.js      # çekirdek registry + render yardımcıları
  nav.js                # ClassTabs, Breadcrumb, BackButton, TopBar
  status.js             # StatusBadge
  notify.js             # Toast / Banner
  ai.js                 # AI action buttons
  forms.js              # School / Lesson / Date / Student selectors (iskelet)
  table.js              # UniversalTable iskeleti
  document.js           # DocumentCard, ExportMenu iskeleti
  dashboard.js          # TodaysLessons, TodaysTasks, …
assets/css/components.css
modules/components-lab.html
```

---

## 8. Kabul kriterleri (COMP-001 v1)

- [x] Katalog belgesi yayınlandı  
- [x] Components Lab canlı (`modules/components-lab.html`)  
- [x] `ClassTabs` ana sayfada bileşenden geliyor  
- [x] `StatusBadge` + `Toast` DS ile uyumlu  
- [ ] Flutter prop sözlüğü eki (ARCH-002 öncesi)

---

*Yeni bileşen eklerken bu tabloya satır açılır; ekran PR’ında “hangi COMP kullanıldı” belirtilir.*
