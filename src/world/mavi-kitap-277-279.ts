/**
 * Mavi Kitap Karar 277 · 278 · 279
 *
 * Ürün sahibi metni — bağlayıcı.
 */

export const KARAR_277 = {
  id: 'MB-277' as const,
  title: 'Karakter Soruyu Yaşar, Söylemez',
  rule:
    'Karakterler önce davranışlarıyla soru oluşturur. ' +
    'Yazılı veya sözlü yönlendirme yalnızca davranışın ardından ve gerçekten gerekli olduğunda kullanılır.',
};

export const KARAR_278 = {
  id: 'MB-278' as const,
  title: 'Beklemek Öğretimin Bir Parçasıdır',
  rule:
    'Çocuğun düşünmesi için bırakılan sessiz süre eğitimin aktif bileşenidir. ' +
    'Sistem gereksiz yönlendirme yapmaz.',
};

export const KARAR_279 = {
  id: 'MB-279' as const,
  title: 'Merak Cevaptan Önce Gelir',
  rule:
    'Her yeni matematik kavramı önce merak ve gözlemle zihinde yer edinir; ' +
    'kavram adı ancak bu süreç tamamlandıktan sonra tanıtılır.',
};

/** Karar 279 — erken sahnelerde yasak kavram adı duyuruları. */
export const EARLY_CONCEPT_ANNOUNCE = [
  'bu bir toplama',
  'bu bir çıkarma',
  'bugün öğreneceğiz',
  'kazanım',
  'matematik dersi',
  'kavramı şudur',
] as const;
