import type { LessonPayload, LessonSlide } from '@/core/types';
import type { OutcomeDef, TopicType } from '../factories/activity-factory';

function slide(title: string, body: string, visual: string, tip?: string): LessonSlide {
  return { title, body, visual, tip };
}

export function buildLesson(def: OutcomeDef): LessonPayload {
  const { grade, title, code, description, realLifeContexts, topic, params = {} } = def;
  const ctx = realLifeContexts[0] ?? 'günlük hayat';
  const built = TOPIC_LESSONS[topic](def);
  return {
    title,
    code,
    grade,
    durationMinutes: built.durationMinutes,
    slides: built.slides,
    keyPoints: built.keyPoints,
    realLifeExample: built.realLifeExample ?? `${ctx} örneğinde ${title.toLowerCase()} kullanırız.`,
    practicePrompt: built.practicePrompt ?? 'Şimdi oyunlarla pekiştir!',
  };
}

type LessonBuild = {
  durationMinutes: number;
  slides: LessonSlide[];
  keyPoints: string[];
  realLifeExample?: string;
  practicePrompt?: string;
};

const TOPIC_LESSONS: Record<TopicType, (def: OutcomeDef) => LessonBuild> = {
  counting: (def) => {
    const max = (def.params?.max as number) ?? 10;
    const g = def.grade;
    return {
      durationMinutes: 5,
      keyPoints: [
        'Sayılar nesneleri saymak için kullanılır',
        'Her sayı bir sırada gelir',
        'Rakamlar sayı yazmak için kullanılır',
      ],
      slides: [
        slide('Sayı Nedir?', `${g}. sınıfta sayıları öğreniyoruz. Sayılar, kaç tane olduğunu anlatır. Örneğin masada 3 elma varsa "üç" deriz.`, '🔢'),
        slide('Nasıl Sayarız?', `1'den başlayarak tek tek sayarız: 1, 2, 3... ${max}'a kadar saymayı öğrenelim. Her nesneyi bir kez say, atlama!`, '👆', 'Sayarken parmağını her nesneye dokun.'),
        slide('Rakam ve Sayı', '0, 1, 2, 3, 4, 5, 6, 7, 8, 9 rakamlarıdır. Rakamları birleştirince sayı olur. Örneğin 1 ve 5 birleşince 15 olur.', '🔤'),
        slide('Gerçek Hayatta', `${def.realLifeContexts.join(', ')} gibi durumlarda sayıları kullanırız. Bugün ${ctx(def)} yaparken saymayı dene!`, '🌍'),
        slide('Hazır mısın?', 'Saymayı öğrendin! Şimdi oyunlarla pekiştirme zamanı. Eğlenerek öğren!', '🎮'),
      ],
      practicePrompt: 'Sayı eşleştirme oyunuyla başla!',
    };
  },

  comparison: (def) => ({
    durationMinutes: 5,
    keyPoints: ['Daha fazla = daha çok', 'Daha az = daha az', 'Eşit = aynı sayıda'],
    slides: [
      slide('Karşılaştırma Nedir?', 'İki grubu yan yana koyup hangisinde daha çok, daha az veya eşit sayıda olduğunu bulmaya karşılaştırma denir.', '⚖️'),
      slide('Daha Fazla', 'Bir gruptaki nesne sayısı diğerinden çoksa "daha fazla" deriz. 7 elma, 4 elmadan daha fazladır.', '🍎🍎🍎', 'Önce her iki grubu say!'),
      slide('Daha Az ve Eşit', 'Daha az: daha az nesne olan grup. Eşit: iki grupta da aynı sayıda nesne varsa eşittir.', '📊'),
      slide('Sıralama', 'Nesneleri büyükten küçüğe veya küçükten büyüğe sıralayabiliriz. En uzun kalem, en kısa silgiden uzundur.', '📏'),
      slide(def.title, def.description, def.icon),
      slide('Pratik Zamanı', `${def.realLifeContexts[0]} örneğinde karşılaştırma yap. Sonra oyunlara geç!`, '🎯'),
    ],
    practicePrompt: 'Karşılaştırma oyunuyla pratik yap!',
  }),

  addition: (def) => {
    const a = (def.params?.a as number) ?? 3;
    const b = (def.params?.b as number) ?? 2;
    const sum = a + b;
    return {
      durationMinutes: 6,
      keyPoints: ['Toplama birleştirmektir', 'İki gruptaki nesneleri bir araya getiririz', `${a} + ${b} = ${sum}`],
      slides: [
        slide('Toplama Nedir?', 'Toplama, iki grubu birleştirip toplam kaç olduğunu bulmaktır. + işareti "artı" demektir.', '➕'),
        slide('Nasıl Toplarız?', `${a} tane nesne ve ${b} tane nesneyi birleştirirsen toplam ${sum} olur. ${a} + ${b} = ${sum}`, '🍎', 'Parmaklarınla sayabilirsin!'),
        slide('Toplama Stratejisi', 'Önce büyük sayıyı düşün, sonra küçük sayı kadar ekle. Veya nesneleri tek tek say.', '💡'),
        slide('Gerçek Hayat', `Marketten ${a} elma ve ${b} armut aldığında toplam ${sum} meyve almış olursun.`, '🛒'),
        slide('Pekiştirme', 'Toplama işlemini oyunlarla çalış. Her doğru cevap seni güçlendirir!', '🌟'),
      ],
      practicePrompt: 'Toplama eşleştirme oyununu dene!',
    };
  },

  subtraction: (def) => {
    const total = (def.params?.total as number) ?? 8;
    const take = (def.params?.take as number) ?? 3;
    const remain = total - take;
    return {
      durationMinutes: 6,
      keyPoints: ['Çıkarma eksiltmektir', 'Bir gruptan bir miktar alırız', `${total} - ${take} = ${remain}`],
      slides: [
        slide('Çıkarma Nedir?', 'Çıkarma, bir gruptan bir miktar çıkarmaktır. − işareti "eksi" demektir.', '➖'),
        slide('Nasıl Çıkarırız?', `${total} nesnen var. ${take} tanesini verirsen ${remain} tane kalır. ${total} - ${take} = ${remain}`, '🍪', 'Geriye doğru say!'),
        slide('Çıkarma ve Toplama', 'Çıkarma, toplamanın tersidir. 5 + 3 = 8 ise, 8 - 3 = 5 olur.', '🔄'),
        slide('Gerçek Hayat', `${total} TL harçlığın var. ${take} TL harcarsan ${remain} TL kalır.`, '💰'),
        slide('Pratik', 'Çıkarma oyunlarıyla kendini sına!', '🎮'),
      ],
      practicePrompt: 'Çıkarma eşleştirmesine başla!',
    };
  },

  multiplication: (def) => {
    const f = (def.params?.factor as number) ?? 3;
    const t = (def.params?.times as number) ?? 4;
    const p = f * t;
    return {
      durationMinutes: 7,
      keyPoints: [`Çarpma tekrarlı toplamadır`, `${t} grup, her birinde ${f} = ${p}`, `${f} × ${t} = ${p}`],
      slides: [
        slide('Çarpma Nedir?', 'Çarpma, aynı sayıyı tekrar tekrar toplamaktır. × işareti "çarpı" demektir.', '✖️'),
        slide('Tekrarlı Toplama', `${f} + ${f} + ${f}... ${t} kez = ${f} × ${t} = ${p}. ${t} grup, her birinde ${f} nesne.`, '⭐⭐⭐'),
        slide('Çarpım Tablosu', 'Çarpım tablosunu ezberlemek işlemleri hızlandırır. Her gün biraz çalış!', '📋', '3×4 ile 4×3 aynı sonucu verir.'),
        slide('Gerçek Hayat', `Her kutuda ${f} kalem var. ${t} kutu = ${p} kalem.`, '📦'),
        slide(def.title, def.description, def.icon),
        slide('Hazır!', 'Çarpma oyunlarına geç ve tabloyu pekiştir!', '🏆'),
      ],
      practicePrompt: 'Çarpma eşleştirme oyununu oyna!',
    };
  },

  division: (def) => {
    const total = (def.params?.total as number) ?? 12;
    const groups = (def.params?.groups as number) ?? 3;
    const each = total / groups;
    return {
      durationMinutes: 7,
      keyPoints: ['Bölme eşit paylaşmaktır', `${total} nesneyi ${groups} gruba böl`, `Her grupta ${each} olur`],
      slides: [
        slide('Bölme Nedir?', 'Bölme, bir miktarı eşit parçalara ayırmaktır. ÷ işareti "bölü" demektir.', '➗'),
        slide('Eşit Paylaşma', `${total} şekeri ${groups} arkadaşa eşit paylaşırsan herkes ${each} şeker alır. ${total} ÷ ${groups} = ${each}`, '🍬'),
        slide('Bölme ve Çarpma', 'Bölme, çarpmanın tersidir. 3 × 4 = 12 ise, 12 ÷ 3 = 4 olur.', '🔄'),
        slide('Kalanlı Bölme', 'Bazen eşit bölünmez, kalan olur. 17 ÷ 5 = 3 kalan 2.', '🔢'),
        slide('Pratik', 'Bölme oyunlarıyla paylaşmayı öğren!', '🎮'),
      ],
      practicePrompt: 'Bölme eşleştirmesine geç!',
    };
  },

  fractions: (def) => ({
    durationMinutes: 7,
    keyPoints: ['Kesir bir bütünün parçasıdır', 'Pay üstte, payda altta', '1/2 = yarım, 1/4 = çeyrek'],
    slides: [
      slide('Kesir Nedir?', 'Bir bütünü eşit parçalara böldüğümüzde her parça kesirdir. Pizza dilimi bir kesirdir!', '🍕'),
      slide('Yarım ve Çeyrek', 'Bütünü 2 eşit parçaya bölersen her parça 1/2 (yarım) olur. 4 parçaya bölersen 1/4 (çeyrek) olur.', '🥧', 'Payda kaç parçaya bölündüğünü gösterir.'),
      slide('Kesir Karşılaştırma', 'Aynı paydada pay büyük olan kesir büyüktür. 3/4, 1/4 ten büyüktür.', '⚖️'),
      slide('Gerçek Hayat', 'Ekmek yarım yer, portakal çeyrek yeriz. Mutfakta kesirler her yerde!', '🍞'),
      slide(def.title, def.description, def.icon),
      slide('Oyun Zamanı', 'Kesir oyunlarıyla pekiştir!', '🎯'),
    ],
    practicePrompt: 'Kesir eşleştirme oyununu başlat!',
  }),

  geometry: (def) => ({
    durationMinutes: 6,
    keyPoints: ['Şekillerin köşe ve kenarları vardır', 'Kare: 4 eşit kenar', 'Daire: köşesi yok'],
    slides: [
      slide('Geometrik Şekiller', 'Geometri şekilleri inceler. Kare, üçgen, daire ve dikdörtgen temel şekillerdir.', '📐'),
      slide('Kare ve Dikdörtgen', 'Karenin 4 eşit kenarı ve 4 köşesi vardır. Dikdörtgenin karşılıklı kenarları eşittir.', '⬜'),
      slide('Üçgen ve Daire', 'Üçgenin 3 kenarı ve 3 köşesi vardır. Dairenin köşesi yoktur, yuvarlaktır.', '🔺'),
      slide('Simetri', 'Bir şekil ikiye katlandığında üst üste biniyorsa simetriktir. Kelebek simetriktir!', '🦋'),
      slide('Çevre ve Alan', def.grade >= 3
        ? 'Çevre: şeklin dış sınırının uzunluğu. Alan: şeklin kapladığı yer.'
        : 'Çevrendeki nesnelerin şekillerini bul: pencere, top, kitap.', '📏'),
      slide(def.title, def.description, def.icon),
      slide('Keşfet', 'Şekil oyunlarıyla öğrendiklerini uygula!', '🔍'),
    ],
    practicePrompt: 'Şekil eşleştirme oyununa geç!',
  }),

  measurement: (def) => ({
    durationMinutes: 6,
    keyPoints: ['Ölçme karşılaştırma yapar', 'Uzunluk: cm, m, km', 'Zaman: saat, gün, hafta'],
    slides: [
      slide('Ölçme Nedir?', 'Ölçme, bir şeyin ne kadar uzun, ağır veya büyük olduğunu bulmaktır.', '📏'),
      slide('Uzunluk Ölçme', 'Kısa mesafeler cm ile, uzun mesafeler m ve km ile ölçülür. Cetvel kullanırız.', '📐'),
      slide('Zaman ve Para', 'Saat zamanı, takvim günleri gösterir. Türk Lirası (₺) ve kuruş para birimidir.', '🕐'),
      slide('Ağırlık ve Sıvı', def.grade >= 3
        ? 'Ağırlık kg ve g ile, sıvı litre ile ölçülür.'
        : 'Ağır ve hafif nesneleri karşılaştırırız.',
        '⚖️'),
      slide(def.title, def.description, def.icon),
      slide('Uygulama', 'Ölçme oyunlarıyla pratik yap!', '🎮'),
    ],
    practicePrompt: 'Uzunluk karşılaştırma oyununu dene!',
  }),

  data: (def) => ({
    durationMinutes: 6,
    keyPoints: ['Veri toplama bilgi toplamaktır', 'Grafik veriyi görselleştirir', 'En çok ve en az kavramları'],
    slides: [
      slide('Veri Nedir?', 'Veri, topladığımız bilgilerdir. Sınıfta en sevilen meyveyi anketle öğrenebiliriz.', '📊'),
      slide('Veri Toplama', 'Anket yap, say ve kaydet. Hangi meyve en çok sevildi? İşaretle ve say.', '✅'),
      slide('Grafik Okuma', 'Sütun grafiğinde her sütun bir veriyi gösterir. En uzun sütun en çok olanı gösterir.', '📈'),
      slide('Yorumlama', 'Grafikten soruları cevapla: En çok hangisi? En az hangisi? Fark kaç?', '💡'),
      slide(def.title, def.description, def.icon),
      slide('Pratik', 'Veri oyunlarıyla grafik okumayı öğren!', '🎯'),
    ],
    practicePrompt: 'Grafik eşleştirme oyununa başla!',
  }),

  patterns: (def) => ({
    durationMinutes: 5,
    keyPoints: ['Örüntü tekrar eden dizidir', 'Deseni tanı ve devam ettir', 'Sayı ve şekil örüntüleri'],
    slides: [
      slide('Örüntü Nedir?', 'Örüntü, tekrar eden bir dizedir. Kırmızı-mavi-kırmızı-mavi bir örüntüdür.', '🔴🔵'),
      slide('Sayı Örüntüleri', '2, 4, 6, 8... her seferinde 2 artıyor. Sıradaki sayı 10 olur.', '🔢'),
      slide('Şekil Örüntüleri', '⭐🌙⭐🌙 deseni tekrar eder. Sıradaki şekil yıldızdır.', '⭐'),
      slide(def.title, def.description, def.icon),
      slide('Devam Et', 'Örüntü oyunlarıyla sıradaki parçayı bul!', '🎮'),
    ],
    practicePrompt: 'Örüntü eşleştirme oyununu oyna!',
  }),
};

function ctx(def: OutcomeDef): string {
  return def.realLifeContexts[0] ?? 'günlük hayat';
}
