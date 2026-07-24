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
src/core/      → İş mantığı, tipler, kayıtlar
src/engines/   → Oyun motorları (içerikten bağımsız)
src/content/   → JSON müfredat verileri
src/features/  → (gelecek) Öğrenci, öğretmen, AI modülleri
src/components → Paylaşılan UI
src/theme/     → Tasarım tokenları
```

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
