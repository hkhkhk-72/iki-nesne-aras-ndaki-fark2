import type { Grade } from '@/core/types';
import { buildCurriculum, type OutcomeDef, type UnitDef } from '../factories/activity-factory';

const G1 = '#4A90D9';
const G2 = '#2ECC71';
const G3 = '#9B59B6';
const G4 = '#E67E22';

function units(grade: Grade, items: Omit<UnitDef, 'grade'>[]): UnitDef[] {
  return items.map((u) => ({ ...u, grade }));
}

function outcomes(grade: Grade, items: Omit<OutcomeDef, 'grade'>[]): OutcomeDef[] {
  return items.map((o) => ({ ...o, grade }));
}

// ─── 1. SINIF ───────────────────────────────────────────────
/**
 * Türkiye Yüzyılı Maarif Modeli ile hizalı yapı.
 *
 * Üniteler resmî öğrenme alanlarıdır:
 *   1 Sayılar ve İşlemler · 2 Geometri · 3 Ölçme · 4 Veri
 *
 * Kazanım kodu biçimi: MAT.{sınıf}.{öğrenme alanı}.{çıktı}
 */
const grade1Units = units(1, [
  {
    id: 'unit-1-1',
    title: 'Sayılar ve İşlemler',
    description: 'Sayı hissi, ritmik sayma, onluk-birlik ve dört işlemin temeli',
    order: 1,
    icon: '🔢',
    color: G1,
    outcomeIds: [
      'out-1-1-1', 'out-1-1-2', 'out-1-1-3', 'out-1-1-4', 'out-1-1-5',
      'out-1-1-6', 'out-1-1-7', 'out-1-1-8', 'out-1-1-9',
    ],
  },
  {
    id: 'unit-1-2',
    title: 'Geometri',
    description: 'Uzamsal düşünme, şekiller, cisimler ve örüntüler',
    order: 2,
    icon: '📐',
    color: '#F39C12',
    outcomeIds: ['out-1-2-1', 'out-1-2-2', 'out-1-2-3', 'out-1-2-4'],
  },
  {
    id: 'unit-1-3',
    title: 'Ölçme',
    description: 'Uzunluk, zaman, para ve sıvı ölçme deneyimleri',
    order: 3,
    icon: '📏',
    color: '#1ABC9C',
    outcomeIds: ['out-1-3-1', 'out-1-3-2', 'out-1-3-3', 'out-1-3-4'],
  },
  {
    id: 'unit-1-4',
    title: 'Veri',
    description: 'Basit tablo, çetele ve grafiklerle istatistiksel okuryazarlık',
    order: 4,
    icon: '📊',
    color: '#E74C3C',
    outcomeIds: ['out-1-4-1', 'out-1-4-2'],
  },
]);

const grade1Outcomes = outcomes(1, [
  // ── Öğrenme Alanı 1: Sayılar ve İşlemler ──────────────────
  { id: 'out-1-1-1', code: 'MAT.1.1.1', title: 'Azlık, Çokluk ve Eşitlik', description: 'Nesne gruplarını azlık-çokluk ve eşitlik bakımından karşılaştırır.', unitId: 'unit-1-1', order: 1, icon: '⚖️', color: G1, topic: 'comparison', realLifeContexts: ['Oyuncak karşılaştırma', 'Tabaktaki meyveler', 'Sınıftaki arkadaşlar'], prerequisites: [] },
  { id: 'out-1-1-2', code: 'MAT.1.1.2', title: 'Birer Ritmik Sayma', description: "1'den 100'e kadar ileriye, 20'den geriye doğru birer ritmik sayar.", unitId: 'unit-1-1', order: 2, icon: '🔢', color: G1, topic: 'counting', realLifeContexts: ['Merdiven sayma', 'Oyunda sayma', 'Geri sayım'], prerequisites: ['out-1-1-1'], params: { max: 100 } },
  { id: 'out-1-1-3', code: 'MAT.1.1.3', title: 'İkişer, Beşer, Onar Sayma', description: "İleriye doğru ikişer, beşer ve onar ritmik sayar (100'e kadar).", unitId: 'unit-1-1', order: 3, icon: '👣', color: G1, topic: 'rhythmic', realLifeContexts: ['Çorap çiftleri', 'Parmakla sayma', 'Onluk paketler'], prerequisites: ['out-1-1-2'], params: { step: 2 } },
  { id: 'out-1-1-4', code: 'MAT.1.1.4', title: 'Rakamları Okuma ve Yazma', description: 'Rakamları okur ve yazar; nesne sayılarını rakamla ifade eder.', unitId: 'unit-1-1', order: 4, icon: '🔤', color: G1, topic: 'digits', realLifeContexts: ['Saat', 'Telefon numarası', 'Ev numarası'], prerequisites: ['out-1-1-2'] },
  { id: 'out-1-1-5', code: 'MAT.1.1.5', title: 'Sıra Bildiren Sayılar', description: 'Sıra bildiren sayıları (1., 2., 3. vb.) yerinde ve doğru kullanır.', unitId: 'unit-1-1', order: 5, icon: '🥇', color: G1, topic: 'ordinal', realLifeContexts: ['Yarışta sıra', 'Asansör katı', 'Sırada bekleme'], prerequisites: ['out-1-1-4'] },
  { id: 'out-1-1-6', code: 'MAT.1.1.6', title: 'Onluk ve Birlik Gruplama', description: 'Miktarı 10 ile 20 arasında olan bir grup nesneyi onluk ve birlik gruplarına ayırır.', unitId: 'unit-1-1', order: 6, icon: '🧮', color: G1, topic: 'place_value', realLifeContexts: ['Yumurta kolisi', 'Kalem paketi', 'Çubuk demetleri'], prerequisites: ['out-1-1-4'], params: { value: 14 } },
  { id: 'out-1-1-7', code: 'MAT.1.1.7', title: "20'ye Kadar Toplama", description: "Toplamları 20'ye kadar olan doğal sayılarla toplama işlemi yapar.", unitId: 'unit-1-1', order: 7, icon: '➕', color: G1, topic: 'addition', realLifeContexts: ['Oyuncak birleştirme', 'Alışveriş', 'Puan toplama'], prerequisites: ['out-1-1-6'], params: { a: 8, b: 5 } },
  { id: 'out-1-1-8', code: 'MAT.1.1.8', title: "20'ye Kadar Çıkarma", description: "20'ye kadar olan doğal sayılarla çıkarma işlemi yapar.", unitId: 'unit-1-1', order: 8, icon: '➖', color: G1, topic: 'subtraction', realLifeContexts: ['Harçlık harcama', 'Paylaşma', 'Kalan bulma'], prerequisites: ['out-1-1-7'], params: { total: 17, take: 6 } },
  { id: 'out-1-1-9', code: 'MAT.1.1.9', title: 'Zihinden Toplama ve Çıkarma', description: 'Zihinden basit toplama ve çıkarma işlemleri gerçekleştirir.', unitId: 'unit-1-1', order: 9, icon: '🧠', color: G1, topic: 'mental_math', realLifeContexts: ['Kasada hesap', 'Oyunda puan', 'Hızlı sayma'], prerequisites: ['out-1-1-7', 'out-1-1-8'] },

  // ── Öğrenme Alanı 2: Geometri ─────────────────────────────
  { id: 'out-1-2-1', code: 'MAT.1.2.1', title: 'Uzamsal İlişkiler', description: 'Uzamsal (yer, yön, konum) ilişkileri ifade eder: altında-üstünde, etrafında-arasında, önde-arkada, sağında-solunda.', unitId: 'unit-1-2', order: 1, icon: '📍', color: '#F39C12', topic: 'spatial', realLifeContexts: ['Sınıfta eşya bulma', 'Yol tarifi', 'Evde konum oyunu'], prerequisites: [] },
  { id: 'out-1-2-2', code: 'MAT.1.2.2', title: 'Temel Geometrik Şekiller', description: 'Temel geometrik şekilleri (üçgen, kare, dikdörtgen, çember) tanır ve adlandırır.', unitId: 'unit-1-2', order: 2, icon: '⬜', color: '#F39C12', topic: 'geometry', realLifeContexts: ['Trafik işaretleri', 'Pencere', 'Tabak'], prerequisites: [] },
  { id: 'out-1-2-3', code: 'MAT.1.2.3', title: 'Geometrik Cisimler', description: 'Günlük hayattaki nesneleri geometrik cisimlere benzeterek özelliklerini fark eder.', unitId: 'unit-1-2', order: 3, icon: '📦', color: '#F39C12', topic: 'solids', realLifeContexts: ['Top', 'Kutu', 'Teneke kutu'], prerequisites: ['out-1-2-2'] },
  { id: 'out-1-2-4', code: 'MAT.1.2.4', title: 'Örüntüler', description: 'Nesne veya şekillerden oluşan örüntüleri tanır, kuralını bulur ve eksik bırakılan ögeyi tamamlar.', unitId: 'unit-1-2', order: 4, icon: '🔁', color: '#F39C12', topic: 'patterns', realLifeContexts: ['Fayans deseni', 'Kolye dizimi', 'Kumaş deseni'], prerequisites: ['out-1-2-2'] },

  // ── Öğrenme Alanı 3: Ölçme ────────────────────────────────
  { id: 'out-1-3-1', code: 'MAT.1.3.1', title: 'Standart Olmayan Uzunluk Ölçme', description: 'Standart olmayan uzunluk ölçme birimlerini (karış, kulaç, adım, ayak vb.) kullanarak ölçüm yapar.', unitId: 'unit-1-3', order: 1, icon: '🖐️', color: '#1ABC9C', topic: 'nonstandard_length', realLifeContexts: ['Masayı karışla ölçme', 'Sınıfı adımla ölçme', 'Boy karşılaştırma'], prerequisites: ['out-1-1-2'] },
  { id: 'out-1-3-2', code: 'MAT.1.3.2', title: 'Saat, Gün, Hafta, Ay ve Mevsim', description: 'Tam ve yarım saatleri okur; gün, hafta, ay ve mevsim kavramlarını sırasıyla ifade eder.', unitId: 'unit-1-3', order: 2, icon: '🕐', color: '#1ABC9C', topic: 'time', realLifeContexts: ['Okul saati', 'Ders programı', 'Doğum günü'], prerequisites: ['out-1-1-4'] },
  { id: 'out-1-3-3', code: 'MAT.1.3.3', title: 'Paralarımız', description: 'Kâğıt ve madeni paralarımızı tanır, günlük yaşamdaki basit kullanım yerlerini kavrar.', unitId: 'unit-1-3', order: 3, icon: '💰', color: '#1ABC9C', topic: 'money', realLifeContexts: ['Kantin alışverişi', 'Kumbara', 'Market'], prerequisites: ['out-1-1-4'] },
  { id: 'out-1-3-4', code: 'MAT.1.3.4', title: 'Sıvı Miktarı', description: 'Sıvıların miktarını standart olmayan birimlerle (bardak, fincan, sürahi vb.) karşılaştırır.', unitId: 'unit-1-3', order: 4, icon: '🥛', color: '#1ABC9C', topic: 'liquid', realLifeContexts: ['Mutfakta ölçme', 'Su içme', 'Tarif hazırlama'], prerequisites: ['out-1-1-1'] },

  // ── Öğrenme Alanı 4: Veri ─────────────────────────────────
  { id: 'out-1-4-1', code: 'MAT.1.4.1', title: 'Tablo ve Grafik Okuma', description: 'En çok iki veri grubuna sahip basit tablo ve grafikleri (çetele, sıklık tablosu, nesne/şekil grafiği) okur ve yorumlar.', unitId: 'unit-1-4', order: 1, icon: '📊', color: '#E74C3C', topic: 'data', realLifeContexts: ['Sınıf anketi', 'Hava durumu tablosu', 'Devamsızlık çizelgesi'], prerequisites: ['out-1-1-4'] },
  { id: 'out-1-4-2', code: 'MAT.1.4.2', title: 'Grafik Oluşturma', description: 'Toplanan verileri kullanarak basit bir nesne veya şekil grafiği oluşturur.', unitId: 'unit-1-4', order: 2, icon: '📈', color: '#E74C3C', topic: 'data_create', realLifeContexts: ['En sevilen meyve anketi', 'Göz rengi sayımı', 'Hava kaydı'], prerequisites: ['out-1-4-1'] },
]);

// ─── 2. SINIF ───────────────────────────────────────────────
const grade2Units = units(2, [
  { id: 'unit-2-1', title: 'Sayılar', description: "100'e kadar sayılar", order: 1, icon: '🔢', color: G2, outcomeIds: ['out-2-1-1', 'out-2-1-2', 'out-2-1-3'] },
  { id: 'unit-2-2', title: 'Toplama ve Çıkarma', description: 'İki basamaklı işlemler', order: 2, icon: '➕', color: '#3498DB', outcomeIds: ['out-2-2-1', 'out-2-2-2', 'out-2-2-3'] },
  { id: 'unit-2-3', title: 'Çarpma', description: 'Tekrarlı toplama ve çarpma', order: 3, icon: '✖️', color: '#9B59B6', outcomeIds: ['out-2-3-1', 'out-2-3-2'] },
  { id: 'unit-2-4', title: 'Kesirler', description: 'Bütün, yarım, çeyrek', order: 4, icon: '🍕', color: '#E67E22', outcomeIds: ['out-2-4-1', 'out-2-4-2'] },
  { id: 'unit-2-5', title: 'Geometri', description: 'Şekiller ve simetri', order: 5, icon: '📐', color: '#1ABC9C', outcomeIds: ['out-2-5-1', 'out-2-5-2'] },
  { id: 'unit-2-6', title: 'Ölçme', description: 'Para, zaman ve ağırlık', order: 6, icon: '💰', color: '#F39C12', outcomeIds: ['out-2-6-1', 'out-2-6-2'] },
]);

const grade2Outcomes = outcomes(2, [
  { id: 'out-2-1-1', code: 'M.2.1.1', title: "100'e Kadar Sayma", description: "1'den 100'e kadar sayıları okur ve yazar.", unitId: 'unit-2-1', order: 1, icon: '🔢', color: G2, topic: 'counting', realLifeContexts: ['Takvim', 'Fiyat etiketleri'], prerequisites: [], params: { max: 100 } },
  { id: 'out-2-1-2', code: 'M.2.1.2', title: 'Basamak Değeri', description: 'Onluk ve birlik basamağını bilir.', unitId: 'unit-2-1', order: 2, icon: '🏗️', color: G2, topic: 'counting', realLifeContexts: ['Para üstü', 'Sıra numarası'], prerequisites: ['out-2-1-1'], params: { max: 99 } },
  { id: 'out-2-1-3', code: 'M.2.1.3', title: 'Sayı Karşılaştırma', description: "100'e kadar sayıları karşılaştırır.", unitId: 'unit-2-1', order: 3, icon: '⚖️', color: G2, topic: 'comparison', realLifeContexts: ['Yaş karşılaştırma', 'Sıcaklık'], prerequisites: ['out-2-1-1'] },
  { id: 'out-2-2-1', code: 'M.2.2.1', title: 'Eldesiz Toplama', description: 'İki basamaklı eldesiz toplama yapar.', unitId: 'unit-2-2', order: 1, icon: '➕', color: '#3498DB', topic: 'addition', realLifeContexts: ['Alışveriş toplamı', 'Sınıf mevcudu', 'Puan toplama'], prerequisites: ['out-2-1-2'], params: { a: 23, b: 15 } },
  { id: 'out-2-2-2', code: 'M.2.2.2', title: 'Eldeli Toplama', description: 'Eldeli toplama yapar.', unitId: 'unit-2-2', order: 2, icon: '➕', color: '#3498DB', topic: 'addition', realLifeContexts: ['Market hesabı', 'Kumbara birikimi', 'Okul gezisi listesi'], prerequisites: ['out-2-2-1'], params: { a: 28, b: 17 } },
  { id: 'out-2-2-3', code: 'M.2.2.3', title: 'Çıkarma İşlemleri', description: 'İki basamaklı çıkarma yapar.', unitId: 'unit-2-2', order: 3, icon: '➖', color: '#3498DB', topic: 'subtraction', realLifeContexts: ['Para üstü hesabı', 'Kalan gün sayısı', 'Eksilen malzeme'], prerequisites: ['out-2-2-1'], params: { total: 45, take: 18 } },
  { id: 'out-2-3-1', code: 'M.2.3.1', title: 'Tekrarlı Toplama', description: 'Çarpmayı tekrarlı toplama olarak anlar.', unitId: 'unit-2-3', order: 1, icon: '✖️', color: '#9B59B6', topic: 'multiplication', realLifeContexts: ['Sıra düzeni', 'Paket sayma'], prerequisites: ['out-2-2-1'], params: { factor: 3, times: 4 } },
  { id: 'out-2-3-2', code: 'M.2.3.2', title: 'Çarpma İşlemi', description: "5'e kadar çarpım tablosunu bilir.", unitId: 'unit-2-3', order: 2, icon: '📋', color: '#9B59B6', topic: 'multiplication', realLifeContexts: ['Çikolata kutusu', 'Yumurta kolisi'], prerequisites: ['out-2-3-1'], params: { factor: 5, times: 5 } },
  { id: 'out-2-4-1', code: 'M.2.4.1', title: 'Bütün ve Yarım', description: 'Bütün ve yarım kavramını bilir.', unitId: 'unit-2-4', order: 1, icon: '🍕', color: '#E67E22', topic: 'fractions', realLifeContexts: ['Pizza paylaşma', 'Ekmek kesme'], prerequisites: [] },
  { id: 'out-2-4-2', code: 'M.2.4.2', title: 'Çeyrek Kavramı', description: 'Çeyrek kavramını bilir.', unitId: 'unit-2-4', order: 2, icon: '🥧', color: '#E67E22', topic: 'fractions', realLifeContexts: ['Portakal dilimi', 'Saat çeyrek'], prerequisites: ['out-2-4-1'] },
  { id: 'out-2-5-1', code: 'M.2.5.1', title: 'Geometrik Şekiller', description: 'Temel geometrik şekilleri tanır ve çizer.', unitId: 'unit-2-5', order: 1, icon: '📐', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Mimari', 'Sanat'], prerequisites: [] },
  { id: 'out-2-5-2', code: 'M.2.5.2', title: 'Simetri', description: 'Simetrik şekilleri tanır.', unitId: 'unit-2-5', order: 2, icon: '🦋', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Kelebek', 'Yaprak'], prerequisites: ['out-2-5-1'] },
  { id: 'out-2-6-1', code: 'M.2.6.1', title: 'Para Ölçme', description: 'TL ve kuruş kavramını bilir.', unitId: 'unit-2-6', order: 1, icon: '💰', color: '#F39C12', topic: 'measurement', realLifeContexts: ['Kantin', 'Bozuk para'], prerequisites: [] },
  { id: 'out-2-6-2', code: 'M.2.6.2', title: 'Zaman Ölçme', description: 'Saat ve takvim okur.', unitId: 'unit-2-6', order: 2, icon: '🕐', color: '#F39C12', topic: 'measurement', realLifeContexts: ['Ders programı', 'Doğum günü'], prerequisites: [] },
]);

// ─── 3. SINIF ───────────────────────────────────────────────
const grade3Units = units(3, [
  { id: 'unit-3-1', title: 'Sayılar', description: "1000'e kadar sayılar", order: 1, icon: '🔢', color: G3, outcomeIds: ['out-3-1-1', 'out-3-1-2', 'out-3-1-3'] },
  { id: 'unit-3-2', title: 'Çarpma', description: 'Çarpım tablosu ve işlemler', order: 2, icon: '✖️', color: '#3498DB', outcomeIds: ['out-3-2-1', 'out-3-2-2', 'out-3-2-3'] },
  { id: 'unit-3-3', title: 'Bölme', description: 'Bölme işlemi ve paylaştırma', order: 3, icon: '➗', color: '#E74C3C', outcomeIds: ['out-3-3-1', 'out-3-3-2', 'out-3-3-3'] },
  { id: 'unit-3-4', title: 'Kesirler', description: 'Kesir kavramı ve karşılaştırma', order: 4, icon: '🍕', color: '#E67E22', outcomeIds: ['out-3-4-1', 'out-3-4-2'] },
  { id: 'unit-3-5', title: 'Geometri', description: 'Çevre ve alan', order: 5, icon: '📐', color: '#1ABC9C', outcomeIds: ['out-3-5-1', 'out-3-5-2'] },
  { id: 'unit-3-6', title: 'Ölçme', description: 'Uzunluk, ağırlık ve sıvı', order: 6, icon: '⚖️', color: '#F39C12', outcomeIds: ['out-3-6-1', 'out-3-6-2'] },
]);

const grade3Outcomes = outcomes(3, [
  { id: 'out-3-1-1', code: 'M.3.1.1', title: "1000'e Kadar Sayma", description: "1000'e kadar sayıları okur ve yazar.", unitId: 'unit-3-1', order: 1, icon: '🔢', color: G3, topic: 'counting', realLifeContexts: ['Nüfus sayısı', 'Mesafe'], prerequisites: [], params: { max: 1000 } },
  { id: 'out-3-1-2', code: 'M.3.1.2', title: 'Üç Basamaklı Sayılar', description: 'Yüzlük, onluk, birlik basamağını bilir.', unitId: 'unit-3-1', order: 2, icon: '🏗️', color: G3, topic: 'counting', realLifeContexts: ['Fiyat etiketi', 'Kilometre'], prerequisites: ['out-3-1-1'], params: { max: 999 } },
  { id: 'out-3-1-3', code: 'M.3.1.3', title: 'Sayı Örüntüleri', description: 'Sayı örüntülerini tanır ve devam ettirir.', unitId: 'unit-3-1', order: 3, icon: '🔁', color: G3, topic: 'patterns', realLifeContexts: ['Merdiven basamakları', 'Fiyat artışı'], prerequisites: ['out-3-1-1'] },
  { id: 'out-3-2-1', code: 'M.3.2.1', title: 'Çarpım Tablosu', description: "10'a kadar çarpım tablosunu bilir.", unitId: 'unit-3-2', order: 1, icon: '📋', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Çikolata paketi', 'Sınıf sırası'], prerequisites: [], params: { factor: 7, times: 8 } },
  { id: 'out-3-2-2', code: 'M.3.2.2', title: 'İki Basamaklı Çarpma', description: 'İki basamaklı sayılarla çarpma yapar.', unitId: 'unit-3-2', order: 2, icon: '✖️', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Toplu alışveriş', 'Sınıf sıraları', 'Koli hesabı'], prerequisites: ['out-3-2-1'], params: { factor: 12, times: 3 } },
  { id: 'out-3-2-3', code: 'M.3.2.3', title: 'Çarpma Problemleri', description: 'Çarpma gerektiren problemleri çözer.', unitId: 'unit-3-2', order: 3, icon: '📝', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Bilet hesabı', 'Tarif çoğaltma'], prerequisites: ['out-3-2-2'], params: { factor: 6, times: 9 } },
  { id: 'out-3-3-1', code: 'M.3.3.1', title: 'Bölme Kavramı', description: 'Bölme işleminin anlamını bilir.', unitId: 'unit-3-3', order: 1, icon: '➗', color: '#E74C3C', topic: 'division', realLifeContexts: ['Şeker paylaşma', 'Eşit bölme'], prerequisites: ['out-3-2-1'], params: { total: 12, groups: 3 } },
  { id: 'out-3-3-2', code: 'M.3.3.2', title: 'Bölme İşlemi', description: 'Kalansız bölme yapar.', unitId: 'unit-3-3', order: 2, icon: '➗', color: '#E74C3C', topic: 'division', realLifeContexts: ['Grup oluşturma', 'Takım kurma', 'Eşit paylaşım'], prerequisites: ['out-3-3-1'], params: { total: 24, groups: 6 } },
  { id: 'out-3-3-3', code: 'M.3.3.3', title: 'Kalanlı Bölme', description: 'Kalanlı bölme yapar.', unitId: 'unit-3-3', order: 3, icon: '🔢', color: '#E74C3C', topic: 'division', realLifeContexts: ['Kalan paylaşma', 'Otobüse binme', 'Artan malzeme'], prerequisites: ['out-3-3-2'], params: { total: 17, groups: 5 } },
  { id: 'out-3-4-1', code: 'M.3.4.1', title: 'Kesir Kavramı', description: 'Birim kesirleri tanır.', unitId: 'unit-3-4', order: 1, icon: '🍕', color: '#E67E22', topic: 'fractions', realLifeContexts: ['Pasta dilimi', 'Su bardağı'], prerequisites: [] },
  { id: 'out-3-4-2', code: 'M.3.4.2', title: 'Kesir Karşılaştırma', description: 'Kesirleri karşılaştırır.', unitId: 'unit-3-4', order: 2, icon: '⚖️', color: '#E67E22', topic: 'fractions', realLifeContexts: ['Pizza karşılaştırma', 'Meyve dilimleri', 'Su bardağı seviyesi'], prerequisites: ['out-3-4-1'] },
  { id: 'out-3-5-1', code: 'M.3.5.1', title: 'Çevre Hesaplama', description: 'Şekillerin çevresini hesaplar.', unitId: 'unit-3-5', order: 1, icon: '📐', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Bahçe çiti', 'Resim çerçevesi'], prerequisites: [] },
  { id: 'out-3-5-2', code: 'M.3.5.2', title: 'Alan Hesaplama', description: 'Kare ve dikdörtgenin alanını hesaplar.', unitId: 'unit-3-5', order: 2, icon: '⬜', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Halı alanı', 'Oda boyutu'], prerequisites: ['out-3-5-1'] },
  { id: 'out-3-6-1', code: 'M.3.6.1', title: 'Uzunluk Ölçme', description: 'cm, m, km birimlerini kullanır.', unitId: 'unit-3-6', order: 1, icon: '📏', color: '#F39C12', topic: 'measurement', realLifeContexts: ['Boy ölçme', 'Yol mesafesi'], prerequisites: [] },
  { id: 'out-3-6-2', code: 'M.3.6.2', title: 'Ağırlık ve Sıvı', description: 'kg, g ve litre kavramlarını bilir.', unitId: 'unit-3-6', order: 2, icon: '⚖️', color: '#F39C12', topic: 'measurement', realLifeContexts: ['Market alışverişi', 'Su şişesi'], prerequisites: [] },
]);

// ─── 4. SINIF ───────────────────────────────────────────────
const grade4Units = units(4, [
  { id: 'unit-4-1', title: 'Sayılar', description: "10000'e kadar sayılar", order: 1, icon: '🔢', color: G4, outcomeIds: ['out-4-1-1', 'out-4-1-2'] },
  { id: 'unit-4-2', title: 'Dört İşlem', description: 'Toplama, çıkarma, çarpma, bölme', order: 2, icon: '🔢', color: '#3498DB', outcomeIds: ['out-4-2-1', 'out-4-2-2', 'out-4-2-3', 'out-4-2-4'] },
  { id: 'unit-4-3', title: 'Kesirler ve Ondalık', description: 'Kesir işlemleri ve ondalık sayılar', order: 3, icon: '🍕', color: '#9B59B6', outcomeIds: ['out-4-3-1', 'out-4-3-2', 'out-4-3-3'] },
  { id: 'unit-4-4', title: 'Geometri', description: 'Açı, simetri ve şekiller', order: 4, icon: '📐', color: '#1ABC9C', outcomeIds: ['out-4-4-1', 'out-4-4-2', 'out-4-4-3'] },
  { id: 'unit-4-5', title: 'Ölçme', description: 'Alan, hacim ve zaman', order: 5, icon: '⚖️', color: '#F39C12', outcomeIds: ['out-4-5-1', 'out-4-5-2'] },
  { id: 'unit-4-6', title: 'Veri ve Grafik', description: 'Veri toplama ve grafik okuma', order: 6, icon: '📊', color: '#E74C3C', outcomeIds: ['out-4-6-1', 'out-4-6-2'] },
]);

const grade4Outcomes = outcomes(4, [
  { id: 'out-4-1-1', code: 'M.4.1.1', title: "10000'e Kadar Sayma", description: "10000'e kadar sayıları okur ve yazar.", unitId: 'unit-4-1', order: 1, icon: '🔢', color: G4, topic: 'counting', realLifeContexts: ['Nüfus', 'Bütçe'], prerequisites: [], params: { max: 10000 } },
  { id: 'out-4-1-2', code: 'M.4.1.2', title: 'Sayıları Yuvarlama', description: 'Sayıları en yakın onluğa ve yüzlüğe yuvarlar.', unitId: 'unit-4-1', order: 2, icon: '🎯', color: G4, topic: 'counting', realLifeContexts: ['Fiyat yuvarlama', 'Tahmin'], prerequisites: ['out-4-1-1'], params: { max: 9999 } },
  { id: 'out-4-2-1', code: 'M.4.2.1', title: 'Çok Basamaklı Toplama', description: 'Üç ve daha fazla basamaklı toplama yapar.', unitId: 'unit-4-2', order: 1, icon: '➕', color: '#3498DB', topic: 'addition', realLifeContexts: ['Aylık harcama', 'Okul bütçesi', 'Nüfus toplamı'], prerequisites: ['out-4-1-1'], params: { a: 234, b: 567 } },
  { id: 'out-4-2-2', code: 'M.4.2.2', title: 'Çok Basamaklı Çıkarma', description: 'Üç ve daha fazla basamaklı çıkarma yapar.', unitId: 'unit-4-2', order: 2, icon: '➖', color: '#3498DB', topic: 'subtraction', realLifeContexts: ['Kalan para', 'Yol mesafesi', 'Kalan gün'], prerequisites: ['out-4-2-1'], params: { total: 850, take: 327 } },
  { id: 'out-4-2-3', code: 'M.4.2.3', title: 'Çok Basamaklı Çarpma', description: 'Üç basamaklı sayılarla çarpma yapar.', unitId: 'unit-4-2', order: 3, icon: '✖️', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Toplu bilet', 'Sınıf malzemesi', 'Üretim hesabı'], prerequisites: ['out-4-2-1'], params: { factor: 25, times: 12 } },
  { id: 'out-4-2-4', code: 'M.4.2.4', title: 'Çok Basamaklı Bölme', description: 'Üç basamaklı sayılarla bölme yapar.', unitId: 'unit-4-2', order: 4, icon: '➗', color: '#3498DB', topic: 'division', realLifeContexts: ['Eşit paylaşım', 'Otobüs kapasitesi', 'Günlük ortalama'], prerequisites: ['out-4-2-3'], params: { total: 144, groups: 12 } },
  { id: 'out-4-3-1', code: 'M.4.3.1', title: 'Denk Kesirler', description: 'Denk kesirleri tanır.', unitId: 'unit-4-3', order: 1, icon: '🍕', color: '#9B59B6', topic: 'fractions', realLifeContexts: ['Pizza dilimleri', 'Pasta paylaşımı', 'Ölçü kabı'], prerequisites: [] },
  { id: 'out-4-3-2', code: 'M.4.3.2', title: 'Kesir Toplama', description: 'Paydaları eşit kesirleri toplar.', unitId: 'unit-4-3', order: 2, icon: '➕', color: '#9B59B6', topic: 'fractions', realLifeContexts: ['Tarif birleştirme', 'Su miktarı', 'Zaman dilimleri'], prerequisites: ['out-4-3-1'] },
  { id: 'out-4-3-3', code: 'M.4.3.3', title: 'Ondalık Sayılar', description: 'Ondalık gösterimi bilir.', unitId: 'unit-4-3', order: 3, icon: '🔢', color: '#9B59B6', topic: 'fractions', realLifeContexts: ['Market fiyatı', 'Boy ölçüsü'], prerequisites: ['out-4-3-1'] },
  { id: 'out-4-4-1', code: 'M.4.4.1', title: 'Açı Kavramı', description: 'Dar, dik ve geniş açıları tanır.', unitId: 'unit-4-4', order: 1, icon: '📐', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Saat açısı', 'Kapı açısı'], prerequisites: [] },
  { id: 'out-4-4-2', code: 'M.4.4.2', title: 'Simetri ve Öteleme', description: 'Simetri ve öteleme dönüşümlerini bilir.', unitId: 'unit-4-4', order: 2, icon: '🦋', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Karo deseni', 'Ayna görüntüsü'], prerequisites: ['out-4-4-1'] },
  { id: 'out-4-4-3', code: 'M.4.4.3', title: 'Üçgen ve Dörtgen', description: 'Üçgen ve dörtgen özelliklerini bilir.', unitId: 'unit-4-4', order: 3, icon: '🔺', color: '#1ABC9C', topic: 'geometry', realLifeContexts: ['Çatı yapısı', 'Pencere'], prerequisites: ['out-4-4-1'] },
  { id: 'out-4-5-1', code: 'M.4.5.1', title: 'Alan ve Hacim', description: 'Alan ve hacim ölçer.', unitId: 'unit-4-5', order: 1, icon: '📦', color: '#F39C12', topic: 'measurement', realLifeContexts: ['Kutu hacmi', 'Havuz alanı'], prerequisites: [] },
  { id: 'out-4-5-2', code: 'M.4.5.2', title: 'Zaman Problemleri', description: 'Saat ve takvim problemlerini çözer.', unitId: 'unit-4-5', order: 2, icon: '🕐', color: '#F39C12', topic: 'measurement', realLifeContexts: ['Yolculuk süresi', 'Proje planı'], prerequisites: [] },
  { id: 'out-4-6-1', code: 'M.4.6.1', title: 'Veri Toplama', description: 'Veri toplar ve düzenler.', unitId: 'unit-4-6', order: 1, icon: '📊', color: '#E74C3C', topic: 'data', realLifeContexts: ['Sınıf anketi', 'Hava durumu'], prerequisites: [] },
  { id: 'out-4-6-2', code: 'M.4.6.2', title: 'Grafik Okuma', description: 'Sütun ve çizgi grafiklerini okur.', unitId: 'unit-4-6', order: 2, icon: '📈', color: '#E74C3C', topic: 'data', realLifeContexts: ['Sıcaklık grafiği', 'Satış raporu'], prerequisites: ['out-4-6-1'] },
]);

export const grade1Curriculum = buildCurriculum(1, '1. Sınıf Matematik', grade1Units, grade1Outcomes);
export const grade2Curriculum = buildCurriculum(2, '2. Sınıf Matematik', grade2Units, grade2Outcomes);
export const grade3Curriculum = buildCurriculum(3, '3. Sınıf Matematik', grade3Units, grade3Outcomes);
export const grade4Curriculum = buildCurriculum(4, '4. Sınıf Matematik', grade4Units, grade4Outcomes);

export const allCurricula = [grade1Curriculum, grade2Curriculum, grade3Curriculum, grade4Curriculum];

export function getCurriculumStats() {
  return allCurricula.map((c) => ({
    grade: c.grade,
    title: c.title,
    units: c.units.length,
    outcomes: c.outcomes.length,
    activities: c.outcomes.reduce((sum, o) => sum + o.activities.length, 0),
  }));
}
