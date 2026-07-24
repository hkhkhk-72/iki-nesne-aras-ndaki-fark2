import type {
  ActivityConfig,
  ComparisonPayload,
  ComparisonSymbol,
  DragDropPayload,
  Grade,
  LearningOutcome,
  MatchingPayload,
  Unit,
} from '@/core/types';
import { buildLesson } from './lesson-factory';

export type TopicType =
  | 'counting'
  | 'comparison'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'geometry'
  | 'measurement'
  | 'data'
  | 'patterns';

export interface OutcomeDef {
  id: string;
  code: string;
  title: string;
  description: string;
  grade: Grade;
  unitId: string;
  order: number;
  icon: string;
  color: string;
  topic: TopicType;
  realLifeContexts: string[];
  prerequisites: string[];
  /** Topic-specific parameters for payload generation */
  params?: Record<string, unknown>;
}

export interface UnitDef {
  id: string;
  title: string;
  description: string;
  grade: Grade;
  order: number;
  icon: string;
  color: string;
  outcomeIds: string[];
}

function actId(outcomeId: string, mode: string): string {
  return `act-${outcomeId.replace('out-', '')}-${mode}`;
}

function matching(
  outcomeId: string,
  mode: ActivityConfig['mode'],
  title: string,
  description: string,
  payload: MatchingPayload,
  minutes = 5,
  unlocked = true,
): ActivityConfig {
  return {
    id: actId(outcomeId, mode),
    mode,
    engineId: 'matching',
    title,
    description,
    icon: modeIcon(mode),
    estimatedMinutes: minutes,
    unlocked,
    payload,
  };
}

function comparison(
  outcomeId: string,
  mode: ActivityConfig['mode'],
  title: string,
  description: string,
  payload: ComparisonPayload,
  minutes = 5,
  unlocked = true,
): ActivityConfig {
  return {
    id: actId(outcomeId, mode),
    mode,
    engineId: 'comparison',
    title,
    description,
    icon: modeIcon(mode),
    estimatedMinutes: minutes,
    unlocked,
    payload,
  };
}

function dragDrop(
  outcomeId: string,
  mode: ActivityConfig['mode'],
  title: string,
  description: string,
  payload: DragDropPayload,
  minutes = 6,
  unlocked = true,
): ActivityConfig {
  return {
    id: actId(outcomeId, mode),
    mode,
    engineId: 'drag_drop',
    title,
    description,
    icon: modeIcon(mode),
    estimatedMinutes: minutes,
    unlocked,
    payload,
  };
}

function modeIcon(mode: ActivityConfig['mode']): string {
  const icons: Record<string, string> = {
    learn: '📖',
    play: '🎮',
    explore: '🔍',
    experiment: '🧪',
    real_life: '🌍',
    home: '🏠',
    classroom: '🏫',
    smartboard: '📺',
    teacher: '👩‍🏫',
    ai_reinforcement: '🤖',
    pdf: '📄',
    challenge: '🏆',
    collection: '⭐',
  };
  return icons[mode] ?? '🎮';
}

function comparePayload(
  instruction: string,
  leftCount: number,
  rightCount: number,
  emoji: string,
  leftLabel?: string,
  rightLabel?: string,
): ComparisonPayload {
  let correct: ComparisonSymbol = 'equal';
  if (leftCount > rightCount) correct = 'more';
  else if (leftCount < rightCount) correct = 'less';

  return {
    instruction,
    left: { label: leftLabel, count: leftCount, emoji },
    right: { label: rightLabel, count: rightCount, emoji },
    correctAnswer: correct,
    hint: 'Her iki grubu tek tek say!',
    celebration: 'Harika! Doğru karşılaştırdın! 🎉',
  };
}

export function buildActivities(def: OutcomeDef): ActivityConfig[] {
  const { id, topic, params = {} } = def;
  const activities: ActivityConfig[] = [];

  switch (topic) {
    case 'counting': {
      const max = (params.max as number) ?? 10;
      const emojis = (params.emojis as string[]) ?? ['🍎', '⭐', '🐱', '🌸'];
      activities.push(
        matching(id, 'play', 'Sayı Eşleştir', 'Sayıları nesnelerle eşleştir', {
          instruction: `1'den ${max}'a kadar sayıları eşleştir!`,
          pairs: [1, 2, 3, 4].map((n, i) => ({
            id: `p${n}`,
            left: { text: String(n) },
            right: { emoji: emojis[i % emojis.length].repeat(n) },
          })),
          hint: 'Nesneleri tek tek say!',
        }),
        dragDrop(id, 'explore', 'Sayıları Sırala', 'Küçükten büyüğe sırala', {
          instruction: 'Sayıları doğru sıraya koy!',
          items: ['3', '1', '4', '2'].map((n, i) => ({ id: `n${i}`, content: n })),
          zones: ['1', '2', '3', '4'].map((n, i) => ({
            id: `z${i}`,
            label: `${i + 1}.`,
            accepts: [`n${['3', '1', '4', '2'].indexOf(n)}`],
          })),
          correctMapping: { n1: 'z0', n3: 'z1', n0: 'z2', n2: 'z3' },
          hint: 'En küçük sayıdan başla!',
        }),
        comparison(
          id,
          'real_life',
          'Gerçek Hayatta Say',
          'Günlük hayatta sayma',
          comparePayload('Hangisinde daha fazla var?', 3, 5, '🍊', 'Tabak A', 'Tabak B'),
          8,
        ),
        matching(id, 'challenge', 'Hızlı Sayı', 'Zamana karşı eşleştir', {
          instruction: 'Hızlı ol!',
          pairs: [
            { id: 'p1', left: { text: String(max) }, right: { emoji: '🎈'.repeat(Math.min(max, 7)) } },
            { id: 'p2', left: { text: String(max - 2) }, right: { emoji: '🐸'.repeat(Math.min(max - 2, 7)) } },
          ],
        }, 3, false),
        comparison(id, 'smartboard', 'Akıllı Tahta', 'Sınıfta yarış', comparePayload('İlk doğru cevap kazanır!', 4, 6, '⚽'), 10),
      );
      break;
    }

    case 'comparison': {
      activities.push(
        comparison(id, 'play', 'Karşılaştırma Oyunu', 'Daha fazla, az veya eşit', comparePayload('Hangisinde daha fazla?', 4, 7, '🍎', 'Sepet A', 'Sepet B')),
        comparison(id, 'explore', 'Eşit mi?', 'İki grup eşit mi?', comparePayload('Sayılar eşit mi?', 5, 5, '🐟')),
        dragDrop(id, 'experiment', 'Denge Deneyi', 'Teraziyi dengele', {
          instruction: 'Ağır ve hafif nesneleri yerleştir!',
          items: [
            { id: 'heavy', content: 'Ağır', emoji: '🪨' },
            { id: 'light', content: 'Hafif', emoji: '🪶' },
          ],
          zones: [
            { id: 'more', label: 'Daha Fazla', accepts: ['heavy'] },
            { id: 'less', label: 'Daha Az', accepts: ['light'] },
          ],
          correctMapping: { heavy: 'more', light: 'less' },
        }),
        comparison(id, 'real_life', 'Bahçede Karşılaştır', 'Gerçek hayat', comparePayload('Parkta hangi grupta daha fazla çocuk var?', 2, 5, '🧒', 'Salıncak', 'Kaydırak'), 12),
        matching(id, 'home', 'Ev Etkinliği', 'Evde karşılaştır', {
          instruction: 'Eşyaları grupla ve hangisinden daha fazla olduğunu bul!',
          pairs: [
            { id: 'p1', left: { emoji: '🧦' }, right: { text: 'Çorap' } },
            { id: 'p2', left: { emoji: '👕' }, right: { text: 'Tişört' } },
          ],
          hint: 'Renklere göre grupla!',
        }, 15),
        comparison(id, 'smartboard', 'Sınıf Düellosu', 'İki öğrenci yarışır', comparePayload('İlk doğru cevap!', 8, 3, '⚽'), 10),
        comparison(id, 'challenge', 'Şampiyonluk', 'Zorlu sorular', comparePayload('Hızlı düşün!', 9, 9, '🌟'), 5, false),
      );
      break;
    }

    case 'addition': {
      const a = (params.a as number) ?? 3;
      const b = (params.b as number) ?? 2;
      const sum = a + b;
      activities.push(
        matching(id, 'play', 'Toplama Eşleştir', 'İşlem ve sonuç eşleştir', {
          instruction: 'Toplama işlemlerini sonuçlarıyla eşleştir!',
          pairs: [
            { id: 'p1', left: { text: `${a} + ${b}` }, right: { text: String(sum) } },
            { id: 'p2', left: { text: `${a + 1} + ${b - 1}` }, right: { text: String(sum) } },
            { id: 'p3', left: { text: `1 + ${sum - 1}` }, right: { text: String(sum) } },
          ],
          hint: 'Parmaklarını kullanarak say!',
        }),
        comparison(
          id,
          'explore',
          'Toplamı Keşfet',
          'Grupları birleştirerek toplamı bul',
          comparePayload(`${a} + ${b} = ?`, a, b, '🔵', 'Grup A', 'Grup B'),
          6,
        ),
        dragDrop(id, 'experiment', 'Toplama Dene', 'Grupları birleştir', {
          instruction: 'İki grubu birleştirerek toplamı bul!',
          items: [
            { id: 'g1', content: String(a), emoji: '🟦' },
            { id: 'g2', content: String(b), emoji: '🟩' },
          ],
          zones: [{ id: 'total', label: `Toplam: ${sum}`, accepts: ['g1', 'g2'] }],
          correctMapping: { g1: 'total', g2: 'total' },
        }),
        comparison(id, 'real_life', 'Market Alışverişi', 'Gerçek hayat toplama', comparePayload('2 ekmek + 3 simit = kaç?', 2, 3, '🥖'), 10),
        matching(id, 'home', 'Evde Topla', 'Ev etkinliği', {
          instruction: 'Evdeki nesneleri say ve topla!',
          pairs: [
            { id: 'p1', left: { text: '2 tabak + 1 bardak' }, right: { text: '3' } },
            { id: 'p2', left: { text: '1 kitap + 4 kalem' }, right: { text: '5' } },
          ],
        }, 15),
        comparison(id, 'smartboard', 'Toplama Yarışı', 'Sınıf düellosu', comparePayload('3 + 4 = ? Hangi grup 7?', 3, 4, '🔵'), 10),
      );
      break;
    }

    case 'subtraction': {
      const total = (params.total as number) ?? 8;
      const take = (params.take as number) ?? 3;
      const remain = total - take;
      activities.push(
        matching(id, 'play', 'Çıkarma Eşleştir', 'İşlem ve sonuç', {
          instruction: 'Çıkarma işlemlerini sonuçlarıyla eşleştir!',
          pairs: [
            { id: 'p1', left: { text: `${total} - ${take}` }, right: { text: String(remain) } },
            { id: 'p2', left: { text: `${total + 1} - ${take + 1}` }, right: { text: String(remain) } },
          ],
          hint: 'Geriye doğru say!',
        }),
        comparison(id, 'explore', 'Kalanı Bul', 'Çıkarma ile karşılaştır', comparePayload(`${total} elmaktan ${take} yedik, kaç kaldı?`, remain, take, '🍎')),
        dragDrop(id, 'experiment', 'Çıkar ve Bırak', 'Gruptan çıkar', {
          instruction: 'Fazla nesneleri çıkar!',
          items: Array.from({ length: take }, (_, i) => ({ id: `out${i}`, content: '−1', emoji: '❌' })),
          zones: [{ id: 'remain', label: `Kalan: ${remain}`, accepts: [] }],
          correctMapping: Object.fromEntries(Array.from({ length: take }, (_, i) => [`out${i}`, 'remain'])),
        }),
        comparison(id, 'real_life', 'Harçlık Hesabı', 'Gerçek hayat', comparePayload('10 TL harçlıktan 4 TL harcadın, kaç TL kaldı?', 6, 4, '💰'), 10),
        comparison(id, 'smartboard', 'Çıkarma Düellosu', 'Sınıf yarışması', comparePayload('9 - 4 = ?', 5, 4, '🎯'), 10),
      );
      break;
    }

    case 'multiplication': {
      const factor = (params.factor as number) ?? 3;
      const times = (params.times as number) ?? 4;
      const product = factor * times;
      activities.push(
        matching(id, 'play', 'Çarpma Eşleştir', 'Tekrarlı toplama', {
          instruction: `${factor} × ${times} = ?`,
          pairs: [
            { id: 'p1', left: { text: `${factor} × ${times}` }, right: { text: String(product) } },
            { id: 'p2', left: { text: `${times} + ${times} + ${times}` }, right: { text: String(factor * times) } },
          ],
          hint: 'Tekrarlı toplama olarak düşün!',
        }),
        comparison(id, 'explore', 'Grupları Say', 'Çarpma grupları', comparePayload(`${times} grup, her birinde ${factor} tane`, factor, times, '🔵')),
        dragDrop(id, 'experiment', 'Çarpma Dizisi', 'Grupları oluştur', {
          instruction: `${factor}×${times} grubunu oluştur!`,
          items: Array.from({ length: times }, (_, i) => ({ id: `g${i}`, content: `×${factor}`, emoji: '⭐'.repeat(factor) })),
          zones: [{ id: 'product', label: `Sonuç: ${product}`, accepts: [] }],
          correctMapping: Object.fromEntries(Array.from({ length: times }, (_, i) => [`g${i}`, 'product'])),
        }),
        matching(id, 'real_life', 'Sıra Dizme', 'Gerçek hayat çarpma', {
          instruction: 'Her sırada 5 öğrenci, 3 sıra = kaç öğrenci?',
          pairs: [{ id: 'p1', left: { text: '5 × 3' }, right: { text: '15' } }],
        }, 10),
        comparison(id, 'smartboard', 'Çarpım Tablosu Yarışı', 'Sınıf düellosu', comparePayload(`${factor} × ${times} = ?`, factor, product - factor, '✖️'), 10),
        matching(id, 'challenge', 'Çarpım Ustası', 'Hızlı çarpma', {
          instruction: 'Hızlı çarp!',
          pairs: [
            { id: 'p1', left: { text: '6 × 7' }, right: { text: '42' } },
            { id: 'p2', left: { text: '8 × 9' }, right: { text: '72' } },
          ],
        }, 5, false),
      );
      break;
    }

    case 'division': {
      const total = (params.total as number) ?? 12;
      const groups = (params.groups as number) ?? 3;
      const each = total / groups;
      activities.push(
        matching(id, 'play', 'Bölme Eşleştir', 'Paylaştırma', {
          instruction: `${total} ÷ ${groups} = ?`,
          pairs: [
            { id: 'p1', left: { text: `${total} ÷ ${groups}` }, right: { text: String(each) } },
            { id: 'p2', left: { text: `${total} paylaş ${groups}` }, right: { text: String(each) } },
          ],
          hint: 'Eşit gruplara ayır!',
        }),
        dragDrop(id, 'explore', 'Eşit Paylaş', 'Nesneleri böl', {
          instruction: `${total} nesneyi ${groups} gruba eşit böl!`,
          items: Array.from({ length: groups }, (_, i) => ({ id: `gr${i}`, content: String(each), emoji: '📦' })),
          zones: [{ id: 'done', label: `Her grupta ${each}`, accepts: [] }],
          correctMapping: Object.fromEntries(Array.from({ length: groups }, (_, i) => [`gr${i}`, 'done'])),
        }),
        comparison(id, 'real_life', 'Şeker Paylaş', 'Gerçek hayat bölme', comparePayload(`${total} şekeri ${groups} arkadaşa eşit paylaş`, each, each, '🍬'), 10),
        comparison(id, 'smartboard', 'Bölme Düellosu', 'Sınıf yarışması', comparePayload('15 ÷ 3 = ?', 5, 3, '➗'), 10),
      );
      break;
    }

    case 'fractions': {
      const name = (params.name as string) ?? 'yarım';
      activities.push(
        matching(id, 'play', 'Kesir Eşleştir', 'Kesir ve görsel', {
          instruction: 'Kesirleri görsellerle eşleştir!',
          pairs: [
            { id: 'p1', left: { text: '1/2' }, right: { text: 'Yarım' } },
            { id: 'p2', left: { text: '1/4' }, right: { text: 'Çeyrek' } },
            { id: 'p3', left: { text: '3/4' }, right: { text: 'Üç çeyrek' } },
          ],
          hint: 'Pizzayı düşün!',
        }),
        dragDrop(id, 'explore', 'Kesirleri Sırala', 'Küçükten büyüğe', {
          instruction: 'Kesirleri sırala!',
          items: [
            { id: 'q', content: '1/4' },
            { id: 'h', content: '1/2' },
            { id: 'f', content: '1/1' },
          ],
          zones: [
            { id: 'z1', label: 'En Küçük', accepts: ['q'] },
            { id: 'z2', label: 'Orta', accepts: ['h'] },
            { id: 'z3', label: 'En Büyük', accepts: ['f'] },
          ],
          correctMapping: { q: 'z1', h: 'z2', f: 'z3' },
        }),
        comparison(id, 'real_life', 'Pizza Paylaş', 'Gerçek hayat kesir', comparePayload('Pizzanın yarısı mı çeyreği mi daha fazla?', 2, 1, '🍕'), 10),
        matching(id, 'home', 'Mutfakta Kesir', 'Ev etkinliği', {
          instruction: 'Ekmeği yarım ve çeyrek olarak kes!',
          pairs: [
            { id: 'p1', left: { emoji: '🍞' }, right: { text: 'Tam' } },
            { id: 'p2', left: { emoji: '🥖' }, right: { text: 'Yarım' } },
          ],
        }, 15),
        comparison(id, 'smartboard', 'Kesir Düellosu', 'Sınıf yarışması', comparePayload('1/2 mi 1/3 mü büyük?', 1, 1, '🥧'), 10),
      );
      break;
    }

    case 'geometry': {
      const shape = (params.shape as string) ?? 'kare';
      activities.push(
        matching(id, 'play', 'Şekil Eşleştir', 'Şekil ve isim', {
          instruction: 'Şekilleri isimleriyle eşleştir!',
          pairs: [
            { id: 'p1', left: { emoji: '⬜' }, right: { text: 'Kare' } },
            { id: 'p2', left: { emoji: '🔺' }, right: { text: 'Üçgen' } },
            { id: 'p3', left: { emoji: '🔵' }, right: { text: 'Daire' } },
            { id: 'p4', left: { emoji: '▭' }, right: { text: 'Dikdörtgen' } },
          ],
          hint: 'Köşe sayısına dikkat et!',
        }),
        dragDrop(id, 'explore', 'Şekil Sınıflandır', 'Şekilleri grupla', {
          instruction: 'Şekilleri doğru gruba koy!',
          items: [
            { id: 's1', content: 'Kare', emoji: '⬜' },
            { id: 's2', content: 'Daire', emoji: '🔵' },
            { id: 's3', content: 'Üçgen', emoji: '🔺' },
          ],
          zones: [
            { id: 'poly', label: 'Köşeli', accepts: ['s1', 's3'] },
            { id: 'round', label: 'Yuvarlak', accepts: ['s2'] },
          ],
          correctMapping: { s1: 'poly', s2: 'round', s3: 'poly' },
        }),
        comparison(id, 'real_life', 'Şekil Avı', 'Çevrende şekil bul', comparePayload('Pencerede kaç köşe var: kare mi üçgen mi?', 4, 3, '🪟'), 10),
        matching(id, 'home', 'Evde Şekil Bul', 'Ev etkinliği', {
          instruction: 'Evdeki eşyaların şekillerini eşleştir!',
          pairs: [
            { id: 'p1', left: { emoji: '🕐' }, right: { text: 'Daire' } },
            { id: 'p2', left: { emoji: '📺' }, right: { text: 'Dikdörtgen' } },
          ],
        }, 15),
        comparison(id, 'smartboard', 'Şekil Düellosu', 'Sınıf yarışması', comparePayload('Hangisinin daha fazla köşesi var?', 4, 3, '📐'), 10),
      );
      break;
    }

    case 'measurement': {
      activities.push(
        comparison(id, 'play', 'Uzunluk Karşılaştır', 'Hangisi daha uzun?', comparePayload('Hangisi daha uzun?', 5, 3, '📏', 'Kalem', 'Silgi')),
        dragDrop(id, 'explore', 'Sıraya Koy', 'Kısadan uzuna', {
          instruction: 'Nesneleri kısadan uzuna sırala!',
          items: [
            { id: 'a', content: 'Araç', emoji: '🚗' },
            { id: 'b', content: 'Kalem', emoji: '✏️' },
            { id: 'c', content: 'Tren', emoji: '🚂' },
          ],
          zones: [
            { id: 'z1', label: 'En Kısa', accepts: ['b'] },
            { id: 'z2', label: 'Orta', accepts: ['a'] },
            { id: 'z3', label: 'En Uzun', accepts: ['c'] },
          ],
          correctMapping: { b: 'z1', a: 'z2', c: 'z3' },
        }),
        matching(id, 'real_life', 'Zaman Eşleştir', 'Saat ve günlük rutin', {
          instruction: 'Günlük aktiviteleri zamanlarıyla eşleştir!',
          pairs: [
            { id: 'p1', left: { text: 'Sabah' }, right: { emoji: '🌅' } },
            { id: 'p2', left: { text: 'Öğle' }, right: { emoji: '☀️' } },
            { id: 'p3', left: { text: 'Akşam' }, right: { emoji: '🌙' } },
          ],
        }, 10),
        matching(id, 'home', 'Mutfakta Ölç', 'Ev etkinliği', {
          instruction: 'Tarif için malzemeleri eşleştir!',
          pairs: [
            { id: 'p1', left: { text: '1 su bardağı' }, right: { emoji: '🥛' } },
            { id: 'p2', left: { text: '2 yemek kaşığı' }, right: { emoji: '🥄' } },
          ],
        }, 15),
        comparison(id, 'smartboard', 'Ölçü Düellosu', 'Sınıf yarışması', comparePayload('Hangisi daha ağır?', 5, 2, '⚖️'), 10),
      );
      break;
    }

    case 'data': {
      activities.push(
        matching(id, 'play', 'Grafik Eşleştir', 'Veri ve grafik', {
          instruction: 'Grafikleri verilerle eşleştir!',
          pairs: [
            { id: 'p1', left: { text: 'En çok: Elma' }, right: { emoji: '🍎🍎🍎' } },
            { id: 'p2', left: { text: 'En az: Armut' }, right: { emoji: '🍐' } },
          ],
        }),
        dragDrop(id, 'explore', 'Veri Sırala', 'Çoktan aza sırala', {
          instruction: 'Meyveleri çoktan aza sırala!',
          items: [
            { id: 'a', content: 'Armut (2)', emoji: '🍐' },
            { id: 'b', content: 'Elma (5)', emoji: '🍎' },
            { id: 'c', content: 'Muz (3)', emoji: '🍌' },
          ],
          zones: [
            { id: 'z1', label: '1.', accepts: ['b'] },
            { id: 'z2', label: '2.', accepts: ['c'] },
            { id: 'z3', label: '3.', accepts: ['a'] },
          ],
          correctMapping: { b: 'z1', c: 'z2', a: 'z3' },
        }),
        comparison(id, 'real_life', 'Anket Sonucu', 'Sınıf anketi', comparePayload('Sınıfta en sevilen renk hangisi?', 8, 5, '🎨', 'Mavi', 'Kırmızı'), 10),
        comparison(id, 'smartboard', 'Veri Düellosu', 'Grafik okuma yarışı', comparePayload('Grafikte hangi ay daha sıcak?', 30, 15, '🌡️'), 10),
      );
      break;
    }

    case 'patterns': {
      activities.push(
        matching(id, 'play', 'Örüntü Eşleştir', 'Desenleri tamamla', {
          instruction: 'Örüntüleri tamamla!',
          pairs: [
            { id: 'p1', left: { text: '🔴🔵🔴🔵?' }, right: { text: '🔴' } },
            { id: 'p2', left: { text: '⭐🌙⭐🌙?' }, right: { text: '⭐' } },
          ],
        }),
        dragDrop(id, 'explore', 'Örüntü Oluştur', 'Sıradaki şekil', {
          instruction: 'Örüntüdeki eksik parçayı koy!',
          items: [{ id: 'next', content: '🔺' }],
          zones: [{ id: 'slot', label: '🔴🔵🔴?', accepts: ['next'] }],
          correctMapping: { next: 'slot' },
        }),
        comparison(id, 'real_life', 'Fayans Deseni', 'Gerçek hayat örüntü', comparePayload('Hangi desen devam ediyor?', 4, 4, '🧱'), 10),
        comparison(id, 'smartboard', 'Örüntü Düellosu', 'Sınıf yarışması', comparePayload('4 ve 4 eşit mi?', 4, 4, '🔴'), 10),
      );
      break;
    }

    default:
      activities.push(
        matching(id, 'play', 'Eşleştirme', 'Kavramları eşleştir', {
          instruction: def.title,
          pairs: [{ id: 'p1', left: { text: def.title }, right: { text: def.code } }],
        }),
      );
  }

  return activities;
}

export function buildOutcome(def: OutcomeDef): LearningOutcome {
  const lesson = buildLesson(def);
  const lessonActivity: ActivityConfig = {
    id: `act-${def.id.replace('out-', '')}-learn`,
    mode: 'learn',
    engineId: 'lesson',
    title: 'Konuyu Öğren',
    description: `${lesson.slides.length} slaytlık anlatım`,
    icon: '📖',
    estimatedMinutes: lesson.durationMinutes,
    unlocked: true,
    payload: lesson,
  };

  return {
    id: def.id,
    code: def.code,
    title: def.title,
    description: def.description,
    grade: def.grade,
    unitId: def.unitId,
    order: def.order,
    icon: def.icon,
    color: def.color,
    realLifeContexts: def.realLifeContexts,
    prerequisites: def.prerequisites,
    lesson,
    activities: [lessonActivity, ...buildActivities(def)],
  };
}

export function buildUnit(def: UnitDef): Unit {
  return {
    id: def.id,
    title: def.title,
    description: def.description,
    grade: def.grade,
    order: def.order,
    icon: def.icon,
    color: def.color,
    outcomeIds: def.outcomeIds,
  };
}

export function buildCurriculum(
  grade: Grade,
  title: string,
  units: UnitDef[],
  outcomes: OutcomeDef[],
) {
  return {
    grade,
    title,
    units: units.map(buildUnit),
    outcomes: outcomes.map(buildOutcome),
  };
}
