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
const grade1Units = units(1, [
  { id: 'unit-1-1', title: 'Sayılar ve Sayma', description: "1'den 20'ye kadar sayılar", order: 1, icon: '🔢', color: G1, outcomeIds: ['out-1-1-1', 'out-1-1-2', 'out-1-1-3', 'out-1-1-4'] },
  { id: 'unit-1-2', title: 'Karşılaştırma ve Sıralama', description: 'Daha fazla, az, eşit ve sıralama', order: 2, icon: '⚖️', color: '#2ECC71', outcomeIds: ['out-1-2-1', 'out-1-2-2'] },
  { id: 'unit-1-3', title: 'Toplama', description: "10'a kadar toplama", order: 3, icon: '➕', color: '#9B59B6', outcomeIds: ['out-1-3-1', 'out-1-3-2'] },
  { id: 'unit-1-4', title: 'Çıkarma', description: "10'a kadar çıkarma", order: 4, icon: '➖', color: '#E74C3C', outcomeIds: ['out-1-4-1', 'out-1-4-2'] },
  { id: 'unit-1-5', title: 'Geometri', description: 'Temel şekiller', order: 5, icon: '📐', color: '#F39C12', outcomeIds: ['out-1-5-1', 'out-1-5-2'] },
  { id: 'unit-1-6', title: 'Ölçme', description: 'Uzunluk ve zaman', order: 6, icon: '📏', color: '#1ABC9C', outcomeIds: ['out-1-6-1', 'out-1-6-2'] },
]);

const grade1Outcomes = outcomes(1, [
  { id: 'out-1-1-1', code: 'M.1.1.1', title: "1'den 10'a Kadar Sayma", description: "1'den 10'a kadar sayıları tanır ve sırayla sayar.", unitId: 'unit-1-1', order: 1, icon: '🔢', color: G1, topic: 'counting', realLifeContexts: ['Oyuncak sayma', 'Merdiven sayma', 'Meyve sayma'], prerequisites: [], params: { max: 10 } },
  { id: 'out-1-1-2', code: 'M.1.1.2', title: "11'den 20'ye Kadar Sayma", description: "11'den 20'ye kadar sayıları tanır.", unitId: 'unit-1-1', order: 2, icon: '🔟', color: G1, topic: 'counting', realLifeContexts: ['Para sayma', 'Sayfa numaraları'], prerequisites: ['out-1-1-1'], params: { max: 20 } },
  { id: 'out-1-1-3', code: 'M.1.1.3', title: 'Sayı Sırası', description: 'Sayıların sırasını bilir.', unitId: 'unit-1-1', order: 3, icon: '📊', color: G1, topic: 'counting', realLifeContexts: ['Sıra numarası', 'Asansör katları'], prerequisites: ['out-1-1-1'], params: { max: 10 } },
  { id: 'out-1-1-4', code: 'M.1.1.4', title: 'Rakam ve Sayı Kavramı', description: 'Rakam ile sayı arasındaki farkı bilir.', unitId: 'unit-1-1', order: 4, icon: '🔤', color: G1, topic: 'counting', realLifeContexts: ['Telefon numarası', 'Ev numarası'], prerequisites: ['out-1-1-1'], params: { max: 9 } },
  { id: 'out-1-2-1', code: 'M.1.2.1', title: 'Daha Fazla – Daha Az – Eşit', description: 'İki grubu karşılaştırır.', unitId: 'unit-1-2', order: 1, icon: '⚖️', color: '#2ECC71', topic: 'comparison', realLifeContexts: ['Oyuncak karşılaştırma', 'Meyve miktarı'], prerequisites: ['out-1-1-1'] },
  { id: 'out-1-2-2', code: 'M.1.2.2', title: 'Sıralama', description: 'Nesneleri büyükten küçüğe sıralar.', unitId: 'unit-1-2', order: 2, icon: '📏', color: '#2ECC71', topic: 'comparison', realLifeContexts: ['Boy sıralaması', 'Ağırlık karşılaştırma'], prerequisites: ['out-1-2-1'] },
  { id: 'out-1-3-1', code: 'M.1.3.1', title: 'Toplama Kavramı', description: 'Toplama işleminin anlamını bilir.', unitId: 'unit-1-3', order: 1, icon: '➕', color: '#9B59B6', topic: 'addition', realLifeContexts: ['Oyuncak birleştirme', 'Grup oluşturma'], prerequisites: ['out-1-1-1'], params: { a: 2, b: 3 } },
  { id: 'out-1-3-2', code: 'M.1.3.2', title: "10'a Kadar Toplama", description: "10'a kadar toplama yapar.", unitId: 'unit-1-3', order: 2, icon: '🔢', color: '#9B59B6', topic: 'addition', realLifeContexts: ['Alışveriş', 'Oyuncak toplama'], prerequisites: ['out-1-3-1'], params: { a: 4, b: 5 } },
  { id: 'out-1-4-1', code: 'M.1.4.1', title: 'Çıkarma Kavramı', description: 'Çıkarma işleminin anlamını bilir.', unitId: 'unit-1-4', order: 1, icon: '➖', color: '#E74C3C', topic: 'subtraction', realLifeContexts: ['Paylaşma', 'Eksiltme'], prerequisites: ['out-1-3-1'], params: { total: 7, take: 3 } },
  { id: 'out-1-4-2', code: 'M.1.4.2', title: "10'a Kadar Çıkarma", description: "10'a kadar çıkarma yapar.", unitId: 'unit-1-4', order: 2, icon: '🔢', color: '#E74C3C', topic: 'subtraction', realLifeContexts: ['Harçlık harcama', 'Kalan bulma'], prerequisites: ['out-1-4-1'], params: { total: 9, take: 4 } },
  { id: 'out-1-5-1', code: 'M.1.5.1', title: 'Temel Şekiller', description: 'Kare, üçgen, daire ve dikdörtgeni tanır.', unitId: 'unit-1-5', order: 1, icon: '⬜', color: '#F39C12', topic: 'geometry', realLifeContexts: ['Yol işaretleri', 'Oyuncak şekilleri'], prerequisites: [] },
  { id: 'out-1-5-2', code: 'M.1.5.2', title: 'Şekil Eşleştirme', description: 'Şekilleri çevresindeki nesnelerle eşleştirir.', unitId: 'unit-1-5', order: 2, icon: '🔷', color: '#F39C12', topic: 'geometry', realLifeContexts: ['Pencere', 'Top', 'Kitap'], prerequisites: ['out-1-5-1'] },
  { id: 'out-1-6-1', code: 'M.1.6.1', title: 'Uzunluk Karşılaştırma', description: 'Nesneleri uzunluklarına göre karşılaştırır.', unitId: 'unit-1-6', order: 1, icon: '📏', color: '#1ABC9C', topic: 'measurement', realLifeContexts: ['Kalem ve silgi', 'Ayak izi'], prerequisites: ['out-1-2-1'] },
  { id: 'out-1-6-2', code: 'M.1.6.2', title: 'Zaman Kavramı', description: 'Günler, sabah-öğle-akşam kavramlarını bilir.', unitId: 'unit-1-6', order: 2, icon: '🕐', color: '#1ABC9C', topic: 'measurement', realLifeContexts: ['Okul saati', 'Yemek saati'], prerequisites: [] },
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
  { id: 'out-2-2-1', code: 'M.2.2.1', title: 'Eldesiz Toplama', description: 'İki basamaklı eldesiz toplama yapar.', unitId: 'unit-2-2', order: 1, icon: '➕', color: '#3498DB', topic: 'addition', realLifeContexts: ['Alışveriş toplamı'], prerequisites: ['out-2-1-2'], params: { a: 23, b: 15 } },
  { id: 'out-2-2-2', code: 'M.2.2.2', title: 'Eldeli Toplama', description: 'Eldeli toplama yapar.', unitId: 'unit-2-2', order: 2, icon: '➕', color: '#3498DB', topic: 'addition', realLifeContexts: ['Market hesabı'], prerequisites: ['out-2-2-1'], params: { a: 28, b: 17 } },
  { id: 'out-2-2-3', code: 'M.2.2.3', title: 'Çıkarma İşlemleri', description: 'İki basamaklı çıkarma yapar.', unitId: 'unit-2-2', order: 3, icon: '➖', color: '#3498DB', topic: 'subtraction', realLifeContexts: ['Para üstü hesabı'], prerequisites: ['out-2-2-1'], params: { total: 45, take: 18 } },
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
  { id: 'out-3-2-2', code: 'M.3.2.2', title: 'İki Basamaklı Çarpma', description: 'İki basamaklı sayılarla çarpma yapar.', unitId: 'unit-3-2', order: 2, icon: '✖️', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Toplu alışveriş'], prerequisites: ['out-3-2-1'], params: { factor: 12, times: 3 } },
  { id: 'out-3-2-3', code: 'M.3.2.3', title: 'Çarpma Problemleri', description: 'Çarpma gerektiren problemleri çözer.', unitId: 'unit-3-2', order: 3, icon: '📝', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Bilet hesabı', 'Tarif çoğaltma'], prerequisites: ['out-3-2-2'], params: { factor: 6, times: 9 } },
  { id: 'out-3-3-1', code: 'M.3.3.1', title: 'Bölme Kavramı', description: 'Bölme işleminin anlamını bilir.', unitId: 'unit-3-3', order: 1, icon: '➗', color: '#E74C3C', topic: 'division', realLifeContexts: ['Şeker paylaşma', 'Eşit bölme'], prerequisites: ['out-3-2-1'], params: { total: 12, groups: 3 } },
  { id: 'out-3-3-2', code: 'M.3.3.2', title: 'Bölme İşlemi', description: 'Kalansız bölme yapar.', unitId: 'unit-3-3', order: 2, icon: '➗', color: '#E74C3C', topic: 'division', realLifeContexts: ['Grup oluşturma'], prerequisites: ['out-3-3-1'], params: { total: 24, groups: 6 } },
  { id: 'out-3-3-3', code: 'M.3.3.3', title: 'Kalanlı Bölme', description: 'Kalanlı bölme yapar.', unitId: 'unit-3-3', order: 3, icon: '🔢', color: '#E74C3C', topic: 'division', realLifeContexts: ['Kalan paylaşma'], prerequisites: ['out-3-3-2'], params: { total: 17, groups: 5 } },
  { id: 'out-3-4-1', code: 'M.3.4.1', title: 'Kesir Kavramı', description: 'Birim kesirleri tanır.', unitId: 'unit-3-4', order: 1, icon: '🍕', color: '#E67E22', topic: 'fractions', realLifeContexts: ['Pasta dilimi', 'Su bardağı'], prerequisites: [] },
  { id: 'out-3-4-2', code: 'M.3.4.2', title: 'Kesir Karşılaştırma', description: 'Kesirleri karşılaştırır.', unitId: 'unit-3-4', order: 2, icon: '⚖️', color: '#E67E22', topic: 'fractions', realLifeContexts: ['Pizza karşılaştırma'], prerequisites: ['out-3-4-1'] },
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
  { id: 'out-4-2-1', code: 'M.4.2.1', title: 'Çok Basamaklı Toplama', description: 'Üç ve daha fazla basamaklı toplama yapar.', unitId: 'unit-4-2', order: 1, icon: '➕', color: '#3498DB', topic: 'addition', realLifeContexts: ['Aylık harcama'], prerequisites: ['out-4-1-1'], params: { a: 234, b: 567 } },
  { id: 'out-4-2-2', code: 'M.4.2.2', title: 'Çok Basamaklı Çıkarma', description: 'Üç ve daha fazla basamaklı çıkarma yapar.', unitId: 'unit-4-2', order: 2, icon: '➖', color: '#3498DB', topic: 'subtraction', realLifeContexts: ['Kalan para'], prerequisites: ['out-4-2-1'], params: { total: 850, take: 327 } },
  { id: 'out-4-2-3', code: 'M.4.2.3', title: 'Çok Basamaklı Çarpma', description: 'Üç basamaklı sayılarla çarpma yapar.', unitId: 'unit-4-2', order: 3, icon: '✖️', color: '#3498DB', topic: 'multiplication', realLifeContexts: ['Toplu bilet'], prerequisites: ['out-4-2-1'], params: { factor: 25, times: 12 } },
  { id: 'out-4-2-4', code: 'M.4.2.4', title: 'Çok Basamaklı Bölme', description: 'Üç basamaklı sayılarla bölme yapar.', unitId: 'unit-4-2', order: 4, icon: '➗', color: '#3498DB', topic: 'division', realLifeContexts: ['Eşit paylaşım'], prerequisites: ['out-4-2-3'], params: { total: 144, groups: 12 } },
  { id: 'out-4-3-1', code: 'M.4.3.1', title: 'Denk Kesirler', description: 'Denk kesirleri tanır.', unitId: 'unit-4-3', order: 1, icon: '🍕', color: '#9B59B6', topic: 'fractions', realLifeContexts: ['Pizza dilimleri'], prerequisites: [] },
  { id: 'out-4-3-2', code: 'M.4.3.2', title: 'Kesir Toplama', description: 'Paydaları eşit kesirleri toplar.', unitId: 'unit-4-3', order: 2, icon: '➕', color: '#9B59B6', topic: 'fractions', realLifeContexts: ['Tarif birleştirme'], prerequisites: ['out-4-3-1'] },
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
