# Teknik Mimari Dokümanı

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | React Native 0.86 |
| Platform | Expo SDK 57 |
| Dil | TypeScript (strict) |
| Navigasyon | Expo Router (file-based) |
| Depolama | AsyncStorage (offline-first) |
| Animasyon | Reanimated + Gesture Handler |
| Haptics | Expo Haptics |

## Mimari Prensipler

### Feature-Based Architecture

```
app/           → Route ekranları (ince katman)
src/core/      → OS çekirdeği: tipler, motor kaydı, ders kaydı
src/engines/   → Oyun motorları (ders ve içerikten bağımsız)
src/subjects/  → Ders modülleri (şu an yalnızca math)
src/content/   → Müfredat verileri ve içerik fabrikaları
src/features/  → (gelecek) Öğrenci, öğretmen, AI modülleri
src/components → Paylaşılan UI
src/theme/     → Tasarım tokenları
```

### Katman Bağımsızlığı

Eğitim OS iki bağımsız eksende çalışır:

| Katman | Bilgisi | Örnek |
|--------|---------|-------|
| **Motorlar (kernel)** | Dersten habersiz | `comparison` yalnızca iki grup ve doğru cevap bilir |
| **Ders modülleri** | İçeriği sağlar | `math` modülü müfredatı üretir |

Bu ayrım sayesinde bir motor birden fazla derste yeniden kullanılır:

```
Karşılaştırma Motoru
├── Matematik  → "3 elma mı 5 elma mı fazla?"
├── Türkçe     → "hangi kelime daha uzun?"      (gelecek)
└── Fen        → "hangi hayvan daha ağır?"       (gelecek)
```

### Ders Modülü Sözleşmesi

```typescript
interface SubjectModule {
  meta: SubjectMeta;                                  // id, başlık, ikon, sınıflar, enabled
  getCurriculum(grade: Grade): GradeCurriculum | undefined;
}
```

Ders eklemek için oyun motorlarında **hiçbir değişiklik gerekmez**:

1. `src/subjects/<ders>/index.ts` içinde `SubjectModule` implement et
2. Kendi konu tiplerini ve içerik fabrikasını yaz
3. `src/subjects/index.ts` içinde `registerSubject(...)` ile kaydet
4. `meta.enabled` ile kapsam kilidini yönet

> **Anayasa kuralı:** Matematik tamamlanmadan başka ders `enabled: true` yapılmaz.
> Planlanan dersler `PLANNED_SUBJECTS` içinde tutulur.

### Ders Boyutu ve Veri Bütünlüğü

Kazanım kimlikleri dersler arasında tekrar edebileceği için (`out-1-2-1` hem
matematikte hem Türkçe'de olabilir) ilerleme kayıtları **ders + kazanım**
ikilisiyle eşleşir. `StudentProgress.subject` alanı bu yüzden zorunludur;
alan eklenmeden önce yazılmış kayıtlar okunurken `math` sayılır.

### Oyun Motoru Sözleşmesi

```typescript
interface GameEngine<TPayload> {
  id: EngineId;
  name: string;
  description: string;
  Component: React.ComponentType<EngineProps<TPayload>>;
}

interface EngineProps<TPayload> {
  payload: TPayload;        // JSON'dan gelen veri
  mode: ActivityMode;       // play, explore, smartboard...
  onComplete: (result) => void;
  onProgress?: (0-1) => void;
}
```

### Payload Injection

Motor kodu değişmez. Yeni kazanım = yeni JSON payload:

```json
{
  "engineId": "comparison",
  "payload": {
    "instruction": "Hangisinde daha fazla?",
    "left": { "count": 3, "emoji": "🍎" },
    "right": { "count": 5, "emoji": "🍎" },
    "correctAnswer": "less"
  }
}
```

### İçerik Yükleme

`src/content/grade{N}/curriculum.json` → `content-loader.ts` → ekranlar

### İlerleme Takibi

`progress-store.ts` → AsyncStorage → offline-first

## Yeni Motor Ekleme

1. `src/engines/{motor-adı}/index.tsx` oluştur
2. `GameEngine<TPayload>` interface'ini implement et
3. `src/engines/index.ts`'de `registerEngine()` çağır
4. `EngineId` tipine ekle
5. JSON içerikte `engineId` kullan

## Route Yapısı

| Route | Açıklama |
|-------|----------|
| `/` | Ana sayfa |
| `/grade/[grade]` | Sınıf seçimi |
| `/unit/[grade]/[unitId]` | Ünite |
| `/outcome/[grade]/[outcomeId]` | Öğrenme Merkezi |
| `/activity/.../[activityId]` | Etkinlik oynatıcı |
| `/teacher` | Öğretmen paneli |
| `/smartboard/...` | Akıllı tahta düellosu |

## Performans Hedefleri

- 60fps animasyonlar
- < 3sn cold start
- < 50MB bundle (hedef)
- Tablet ve akıllı tahta responsive layout
