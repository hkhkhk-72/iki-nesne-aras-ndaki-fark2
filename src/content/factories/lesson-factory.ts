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

  rhythmic: (def) => {
    const step = (def.params?.step as number) ?? 2;
    return {
      durationMinutes: 6,
      keyPoints: [
        'Ritmik sayma belirli aralıklarla saymaktır',
        `${step}'şer sayarken her seferinde ${step} eklenir`,
        'Ritmik sayma hızlı saymayı sağlar',
      ],
      slides: [
        slide('Ritmik Sayma Nedir?', 'Birer birer saymak yerine ikişer, beşer veya onar sayabiliriz. Bu daha hızlıdır.', '🔢'),
        slide(`${step}'şer Sayalım`, `${step}, ${step * 2}, ${step * 3}, ${step * 4}... Her seferinde ${step} artıyor.`, '👣', 'Sayılar arasındaki fark her zaman aynı.'),
        slide('Neden İşe Yarar?', 'Çorapları ikişer, parmakları beşer, paraları onar sayarız. Böylece daha çabuk sayarız.', '🧦'),
        slide('Geriye Sayma', 'İleriye saydığımız gibi geriye de sayabiliriz: 20, 19, 18... Roket sayımı gibi!', '🚀'),
        slide(def.title, def.description, def.icon),
        slide('Hazır!', 'Ritmik sayma oyunlarıyla pratik yap!', '🎮'),
      ],
      practicePrompt: 'Eksik sayıyı bulma oyununa geç!',
    };
  },

  digits: (def) => ({
    durationMinutes: 5,
    keyPoints: ['Rakam 10 tanedir: 0-9', 'Rakamlar birleşerek sayı olur', 'Her sayı bir miktarı gösterir'],
    slides: [
      slide('Rakam Nedir?', 'Rakamlar sayıları yazmak için kullandığımız işaretlerdir: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.', '🔤'),
      slide('Rakam ve Sayı Farkı', 'Rakam bir işarettir, sayı ise miktarı anlatır. 1 ve 5 rakamları birleşince 15 sayısı olur.', '🔢', 'Harf ve kelime gibi düşün.'),
      slide('Nasıl Yazarız?', 'Her rakamın kendine özgü bir yazımı var. Havada parmağınla dene, sonra deftere yaz.', '✏️'),
      slide('Gerçek Hayat', 'Saatte, telefonda, ev numarasında, fiyat etiketinde rakamlar var. Etrafına bak!', '🕐'),
      slide('Pratik', 'Rakam eşleştirme oyunlarıyla pekiştir!', '🎯'),
    ],
    practicePrompt: 'Rakamı bulma oyununa başla!',
  }),

  ordinal: (def) => ({
    durationMinutes: 5,
    keyPoints: ['Sıra sayıları yeri gösterir', '1. birinci, 2. ikinci, 3. üçüncü', 'Sayma sayısı miktar, sıra sayısı yer bildirir'],
    slides: [
      slide('Sıra Bildiren Sayılar', 'Bir yarışta kimin önde olduğunu söylerken "birinci", "ikinci" deriz. Bunlar sıra sayılarıdır.', '🥇'),
      slide('Nasıl Yazılır?', 'Sıra sayıları rakamdan sonra nokta ile yazılır: 1., 2., 3. Okunuşu birinci, ikinci, üçüncüdür.', '📝', 'Noktayı unutma!'),
      slide('Miktar mı Sıra mı?', '"3 elma" miktarı anlatır. "3. sırada" ise yeri anlatır. İkisi farklıdır.', '🍎'),
      slide('Gerçek Hayat', 'Asansörde 3. kat, sırada 5. kişi, yarışta 1. olmak. Sıra sayıları her yerde.', '🏢'),
      slide(def.title, def.description, def.icon),
      slide('Pratik', 'Sıralama oyunlarıyla dene!', '🎮'),
    ],
    practicePrompt: 'Yarışta sıralama oyununa geç!',
  }),

  place_value: (def) => {
    const value = (def.params?.value as number) ?? 14;
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return {
      durationMinutes: 7,
      keyPoints: [
        'Onluk 10 tane bir arada demektir',
        `${value} = ${tens} onluk + ${ones} birlik`,
        'Basamak, rakamın yerine göre değerini değiştirir',
      ],
      slides: [
        slide('Onluk Nedir?', '10 tane nesneyi bir demet yaparsak buna onluk deriz. Onluk saymayı kolaylaştırır.', '🟦'),
        slide('Onluk ve Birlik', `${value} sayısında ${tens} onluk ve ${ones} birlik var. Yani ${tens} demet ve ${ones} tek nesne.`, '🧮', 'Önce demetleri, sonra tekleri say.'),
        slide('Neden Gruplarız?', '17 çubuğu tek tek saymak zor. 1 onluk ve 7 birlik olarak görmek daha kolay.', '💡'),
        slide('Gerçek Hayat', 'Yumurta kolisi 10\'luk, kalem paketi 10\'luk gelir. Hayatta onluk gruplar çok kullanılır.', '🥚'),
        slide(def.title, def.description, def.icon),
        slide('Pratik', 'Onluk-birlik ayırma oyununa geç!', '🎯'),
      ],
      practicePrompt: 'Sayıyı gruplara ayırma oyununu dene!',
    };
  },

  mental_math: (def) => ({
    durationMinutes: 6,
    keyPoints: ['Zihinden hesap parmak kullanmadan yapılır', 'Onluğa tamamlama kolaylık sağlar', 'Eşit ikilileri bilmek hızlandırır'],
    slides: [
      slide('Zihinden Hesap', 'Bazı işlemleri kâğıt kalem olmadan, aklımızdan yapabiliriz. Bu bir beceridir ve pratikle gelişir.', '🧠'),
      slide('Onluğa Tamamla', '9 + 3 işleminde 9\'u 10 yapmak için 1 alırız, kalan 2\'yi ekleriz: 10 + 2 = 12.', '💡', 'Onluklar hesabı kolaylaştırır.'),
      slide('Eşit İkililer', '5 + 5 = 10, 3 + 3 = 6. Bu eşit ikilileri ezberlemek çok işe yarar.', '🤝'),
      slide('Gerçek Hayat', 'Kasada para üstü hesaplarken, oyunda puan toplarken zihinden hesap yaparız.', '💰'),
      slide('Pratik', 'Zihinden hesap oyunlarıyla hızlan!', '⚡'),
    ],
    practicePrompt: 'Zihinden çözme oyununa başla!',
  }),

  spatial: (def) => ({
    durationMinutes: 6,
    keyPoints: [
      'Konum sözcükleri nesnenin yerini anlatır',
      'Üstünde, altında, arasında, önünde, arkasında',
      'Sağ ve sol bakış yönüne göre değişir',
    ],
    slides: [
      slide('Nerede?', 'Bir nesnenin yerini anlatırken konum sözcükleri kullanırız: üstünde, altında, yanında.', '📍'),
      slide('Üstünde ve Altında', 'Kitap masanın üstünde. Top masanın altında. Üstünde yukarıyı, altında aşağıyı gösterir.', '⬆️'),
      slide('Arasında ve Yanında', 'İki nesnenin ortasındaysa "arasında" deriz. Hemen bitişikse "yanında" deriz.', '↔️', 'Arasında olmak için iki şey gerekir.'),
      slide('Sağ ve Sol', 'Sağ ve sol senin bakış yönüne göre değişir. Karşındaki kişinin sağı senin solundadır.', '🤚'),
      slide('Gerçek Hayat', 'Yol tarifi verirken, eşya bulurken, oyun oynarken konum sözcükleri kullanırız.', '🗺️'),
      slide(def.title, def.description, def.icon),
      slide('Keşfet', 'Konum oyunlarıyla pratik yap!', '🎮'),
    ],
    practicePrompt: 'Nesneyi doğru yere koyma oyununa geç!',
  }),

  solids: (def) => ({
    durationMinutes: 6,
    keyPoints: ['Cisimler üç boyutludur', 'Küre yuvarlanır, küp yuvarlanmaz', 'Günlük nesneler cisimlere benzer'],
    slides: [
      slide('Geometrik Cisimler', 'Şekiller düzdür, cisimler ise kalınlığı olan gerçek nesnelerdir. Top bir cisimdir.', '📦'),
      slide('Küre ve Silindir', 'Top küreye benzer, teneke kutu silindire benzer. İkisi de yuvarlanabilir.', '⚽'),
      slide('Küp ve Prizma', 'Zar küpe benzer, kutu prizmaya benzer. Köşeleri ve düz yüzeyleri vardır, yuvarlanmazlar.', '🎲', 'Köşesi olan cisim yuvarlanmaz.'),
      slide('Gerçek Hayat', 'Evde bak: bardak silindir, top küre, kutu prizma. Cisimler her yerde.', '🏠'),
      slide(def.title, def.description, def.icon),
      slide('Pratik', 'Cisim eşleştirme oyununa geç!', '🎯'),
    ],
    practicePrompt: 'Nesneyi cisme benzetme oyununu dene!',
  }),

  nonstandard_length: (def) => ({
    durationMinutes: 6,
    keyPoints: [
      'Karış, adım, ayak birer ölçme birimidir',
      'Aynı nesne farklı birimlerle farklı sayı verir',
      'Ölçerken birim değişmemelidir',
    ],
    slides: [
      slide('Cetvel Olmadan Ölçme', 'Cetvel yoksa da ölçebiliriz. Karışımızı, adımımızı, ayağımızı kullanırız.', '🖐️'),
      slide('Karış ve Adım', 'Kısa şeyleri karışla, uzun mesafeleri adımla ölçeriz. Masayı karışla, sınıfı adımla.', '👣', 'Kısa için karış, uzun için adım.'),
      slide('Dikkat!', 'Ölçerken aynı birimi kullanmalıyız. Yarısını karışla, yarısını adımla ölçersek sonuç şaşar.', '⚠️'),
      slide('Herkesin Karışı Farklı', 'Senin karışın öğretmeninkinden küçük. Bu yüzden sayılar farklı çıkar. İşte bu yüzden cetvel icat edilmiş!', '📏'),
      slide(def.title, def.description, def.icon),
      slide('Ölç', 'Ölçme oyunlarıyla pratik yap!', '🎮'),
    ],
    practicePrompt: 'Karışla ölçme oyununa geç!',
  }),

  time: (def) => ({
    durationMinutes: 7,
    keyPoints: [
      'Kısa kol saati, uzun kol dakikayı gösterir',
      'Uzun kol 12\'de ise tam saat, 6\'da ise buçuktur',
      'Gün, hafta, ay ve mevsimler sırayla gelir',
    ],
    slides: [
      slide('Saat Nedir?', 'Saat zamanı gösterir. İki kolu var: kısa kol saati, uzun kol dakikayı gösterir.', '🕐'),
      slide('Tam Saat', 'Uzun kol 12\'yi gösteriyorsa tam saattir. Kısa kol 3\'te ise "saat 3" deriz.', '🕒', 'Uzun kol yukarıda ise tam saat.'),
      slide('Buçuk', 'Uzun kol 6\'yı gösteriyorsa yarım saat geçmiştir. "Üç buçuk" deriz.', '🕞'),
      slide('Gün ve Hafta', 'Bir haftada 7 gün var: Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar.', '📅'),
      slide('Ay ve Mevsim', 'Bir yılda 12 ay ve 4 mevsim var: ilkbahar, yaz, sonbahar, kış.', '🍂'),
      slide(def.title, def.description, def.icon),
      slide('Pratik', 'Saat okuma oyunlarıyla dene!', '🎯'),
    ],
    practicePrompt: 'Saati okuma oyununa geç!',
  }),

  money: (def) => ({
    durationMinutes: 6,
    keyPoints: [
      'Paramız Türk Lirası (₺) ve kuruştur',
      'Madeni ve kâğıt para olmak üzere iki tür vardır',
      '100 kuruş 1 lira eder',
    ],
    slides: [
      slide('Paramız', 'Ülkemizin parası Türk Lirasıdır ve ₺ ile gösterilir. Küçük birimi kuruştur.', '💰'),
      slide('Madeni ve Kâğıt', 'Metalden yapılan paralara madeni para, kâğıttan olanlara kâğıt para deriz.', '🪙', 'Madeni paralar yuvarlaktır.'),
      slide('Kuruş ve Lira', '100 kuruş 1 lira eder. 50 kuruş yarım lira demektir.', '🧮'),
      slide('Gerçek Hayat', 'Kantinde, markette, otobüste para kullanırız. Parayı doğru saymak önemlidir.', '🛒'),
      slide(def.title, def.description, def.icon),
      slide('Pratik', 'Para tanıma oyunlarıyla dene!', '🎮'),
    ],
    practicePrompt: 'Para eşleştirme oyununa geç!',
  }),

  liquid: (def) => ({
    durationMinutes: 6,
    keyPoints: [
      'Sıvılar kabın şeklini alır',
      'Büyük kap daha çok sıvı alır',
      'Bardak ve fincanla ölçüm yapabiliriz',
    ],
    slides: [
      slide('Sıvı Ölçme', 'Su, süt gibi sıvıların miktarını ölçebiliriz. Sıvılar konuldukları kabın şeklini alır.', '🥛'),
      slide('Hangi Kap Daha Çok Alır?', 'Sürahi bardaktan, bardak fincandan daha çok sıvı alır. Büyüklük önemlidir.', '🏺', 'Büyük kap çok alır.'),
      slide('Bardakla Ölçelim', 'Sürahiyi doldurmak için kaç bardak su gerekiyor? Sayarak ölçebiliriz.', '🔢'),
      slide('Dikkat', 'İnce uzun bardak ile geniş kısa bardak aynı miktarda su alabilir. Şekle değil miktara bakalım.', '⚠️'),
      slide(def.title, def.description, def.icon),
      slide('Deney', 'Sıvı ölçme oyunlarıyla dene!', '🧪'),
    ],
    practicePrompt: 'Hangi kapta çok oyununa geç!',
  }),

  data_create: (def) => ({
    durationMinutes: 6,
    keyPoints: [
      'Çetele işaretleri sayarken kullanılır',
      'Grafikte çok olan sütun daha yüksektir',
      'Grafik veriyi bir bakışta anlatır',
    ],
    slides: [
      slide('Veri Toplama', 'Bir soru sorup cevapları toplarsak veri elde ederiz. Örneğin sınıfın en sevdiği meyve.', '📋'),
      slide('Çetele Tutma', 'Sayarken her cevap için bir çizgi çizeriz: ||| üç demektir. Böylece karışmaz.', '✏️', 'Beşincide çizgileri çaprazla.'),
      slide('Grafik Yapma', 'Topladığımız veriyi sütunlarla gösterebiliriz. Çok olan sütun daha yüksek olur.', '📊'),
      slide('Grafiği Okuma', 'En yüksek sütun en çok seçileni, en kısa sütun en az seçileni gösterir.', '📈'),
      slide(def.title, def.description, def.icon),
      slide('Pratik', 'Grafik oluşturma oyununa geç!', '🎯'),
    ],
    practicePrompt: 'Kendi grafiğini yapma oyununa başla!',
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
