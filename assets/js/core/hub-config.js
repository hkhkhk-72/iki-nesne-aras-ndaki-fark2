(function () {
  'use strict';

  /**
   * MB-UI-002 — Sınıf odaklı hub yapılandırması
   * Rotalar mevcut modüllere bağlanır; yoksa yakinda:true
   */

  const PROGRAM_DERSLERI = {
    1: [
      { id: 'turkce', ad: 'Türkçe' },
      { id: 'matematik', ad: 'Matematik' },
      { id: 'hayatBilgisi', ad: 'Hayat Bilgisi' },
      { id: 'gorselSanatlar', ad: 'Görsel Sanatlar' },
      { id: 'muzik', ad: 'Müzik' },
      { id: 'bedenEgitimi', ad: 'Oyun ve Fiziki Etkinlikler' }
    ],
    2: [
      { id: 'turkce', ad: 'Türkçe' },
      { id: 'matematik', ad: 'Matematik' },
      { id: 'hayatBilgisi', ad: 'Hayat Bilgisi' },
      { id: 'ingilizce', ad: 'Yabancı Dil (İngilizce)' },
      { id: 'gorselSanatlar', ad: 'Görsel Sanatlar' },
      { id: 'muzik', ad: 'Müzik' },
      { id: 'bedenEgitimi', ad: 'Oyun ve Fiziki Etkinlikler' }
    ],
    3: [
      { id: 'turkce', ad: 'Türkçe' },
      { id: 'matematik', ad: 'Matematik' },
      { id: 'hayatBilgisi', ad: 'Hayat Bilgisi' },
      { id: 'fen', ad: 'Fen Bilimleri' },
      { id: 'ingilizce', ad: 'Yabancı Dil (İngilizce)' },
      { id: 'gorselSanatlar', ad: 'Görsel Sanatlar' },
      { id: 'muzik', ad: 'Müzik' },
      { id: 'bedenEgitimi', ad: 'Oyun ve Fiziki Etkinlikler' }
    ],
    4: [
      { id: 'turkce', ad: 'Türkçe' },
      { id: 'matematik', ad: 'Matematik' },
      { id: 'fen', ad: 'Fen Bilimleri' },
      { id: 'sosyal', ad: 'Sosyal Bilgiler' },
      { id: 'ingilizce', ad: 'Yabancı Dil (İngilizce)' },
      { id: 'dinKulturu', ad: 'Din Kültürü ve Ahlak Bilgisi' },
      { id: 'gorselSanatlar', ad: 'Görsel Sanatlar' },
      { id: 'muzik', ad: 'Müzik' },
      { id: 'bedenEgitimi', ad: 'Oyun ve Fiziki Etkinlikler' },
      { id: 'trafikGuvenligi', ad: 'Trafik Güvenliği' },
      { id: 'insanHaklari', ad: 'İnsan Hakları, Vatandaşlık ve Demokrasi' }
    ]
  };

  const HUB = [
    {
      id: 'planlar',
      ad: 'Planlar',
      lead: 'Yıllık, günlük ve destek planları — ilgili motorla.',
      items: [
        { ad: 'Yıllık Plan', href: 'modules/yillik-plan.html', motor: 'MB-YPM' },
        { ad: 'Günlük Plan', href: 'modules/gunluk-plan.html', motor: 'MB-GPM' },
        { ad: 'İYEP Planı', href: 'modules/iyep.html', motor: 'MB-İYEP' },
        { ad: 'BEP Planı', href: 'documents/olustur.html?id=bep', motor: 'MB-DEM' },
        { ad: 'Destek Eğitim Planı', href: 'modules/destek-egitim.html', motor: 'MB-DEM' },
        { ad: 'Egzersiz Planı', href: 'modules/egzersiz.html', motor: 'MB-EGZ' },
        { ad: 'Kulüp Planı', href: 'modules/kulup.html', motor: 'MB-KEM' },
        { ad: 'Rehberlik Planı', href: 'modules/rehberlik.html', motor: 'MB-RM' },
        { ad: 'Tema / Ünite Planı', href: 'documents/olustur.html?id=unite-plani', motor: 'MB-YPM' }
      ]
    },
    {
      id: 'sinif-islemleri',
      ad: 'Sınıf İşlemleri',
      lead: 'Sınıf içi belgeler ve takip yüzeyleri.',
      items: [
        { ad: 'Oturma Planı', href: 'documents/index.html?q=oturma', yakinda: true },
        { ad: 'Sınıf Listesi', href: 'documents/olustur.html?id=sinif-listesi' },
        { ad: 'Yoklama / Devamsızlık', href: 'documents/olustur.html?id=devamsizlik-takip' },
        { ad: 'Sınıf Defteri — Günlük Kazanımlar', href: 'modules/gunluk-kazanimlar.html', motor: 'KazanimEngine' },
        { ad: 'Öğrenci Bilgileri', href: 'documents/olustur.html?id=ogrenci-gozlem' },
        { ad: 'Kitaplık Defteri', href: 'documents/index.html?q=kitaplik', yakinda: true },
        { ad: 'Davranış Takibi', href: 'documents/olustur.html?id=davranis-takip' },
        { ad: 'Rehberlik Çalışmaları', href: 'modules/rehberlik.html' },
        { ad: 'Veli Görüşmeleri', href: 'documents/olustur.html?id=veli-gorusme' },
        { ad: 'Gözlem Formları', href: 'documents/olustur.html?id=ogrenci-gozlem' },
        { ad: 'Ödev Takibi', href: 'documents/olustur.html?id=odev-takip' }
      ]
    },
    {
      id: 'ders-islemleri',
      ad: 'Ders İşlemleri',
      lead: 'Öğretim programı ve öğrenme çıktısı gezgini.',
      items: [
        { ad: 'Öğretim Programı', href: 'modules/ogretim-programi.html', motor: 'MB-TPM' },
        { ad: 'Öğrenme Çıktıları / Kazanımlar', href: 'modules/gunluk-kazanimlar.html', motor: 'KazanimEngine' },
        { ad: 'Ölçme ve Değerlendirme', href: 'modules/olcme.html' },
        { ad: 'Rubrikler', href: 'documents/olustur.html?id=performans-degerlendirme' },
        { ad: 'Kontrol Listeleri', href: 'documents/olustur.html?id=kontrol-listesi' },
        { ad: 'İçerik Çerçevesi', href: 'modules/ogretim-programi.html' },
        { ad: 'Beceriler / Değerler / Eğilimler', href: 'modules/ogretim-programi.html' }
      ]
    },
    {
      id: 'evrak-merkezi',
      ad: 'Evrak Merkezi',
      lead: 'Resmî evraklar — belge motoru ile.',
      items: [
        { ad: 'Tüm Evraklar', href: 'documents/index.html', motor: 'MB-BM' },
        { ad: 'Zümre Evrakları', href: 'modules/zumre.html' },
        { ad: 'ŞÖK Evrakları', href: 'documents/index.html?q=sok', yakinda: true },
        { ad: 'Veli Evrakları', href: 'documents/index.html?q=veli' },
        { ad: 'Kulüp Evrakları', href: 'modules/kulup.html' },
        { ad: 'Belirli Gün ve Haftalar', href: 'modules/belirli-gun.html' },
        { ad: 'Tören Programları', href: 'documents/index.html?q=toren', yakinda: true },
        { ad: 'Rehberlik Evrakları', href: 'modules/rehberlik.html' },
        { ad: 'Resmî Yazılar / Dilekçeler', href: 'documents/index.html?q=resmi' },
        { ad: 'Tutanaklar / Formlar', href: 'documents/index.html?q=tutanak' },
        { ad: 'Envanter', href: 'modules/envanter.html' }
      ]
    },
    {
      id: 'raporlar',
      ad: 'Raporlar',
      lead: 'İlerleme, kapsama ve üretim özetleri.',
      items: [
        { ad: 'Öğretmen / Genel Raporlar', href: 'modules/raporlar.html' },
        { ad: 'Plan Raporları', href: 'modules/raporlar.html' },
        { ad: 'Evrak Raporları', href: 'modules/raporlar.html' },
        { ad: 'Ölçme Raporları', href: 'modules/olcme.html' }
      ]
    },
    {
      id: 'ayarlar',
      ad: 'Ayarlar',
      lead: 'Okul, öğretmen ve yazdırma bağlamı.',
      items: [
        { ad: 'Öğretmen Bilgileri', href: 'modules/hesabim.html' },
        { ad: 'Okul Bilgileri', href: 'modules/hesabim.html' },
        { ad: 'Platform Ayarları', href: 'modules/ayarlar.html' },
        { ad: 'Akademik Takvim', href: 'modules/takvim.html' },
        { ad: 'Components Lab', href: 'modules/components-lab.html' },
        { ad: 'MiniBilge AI', href: 'modules/ai.html' }
      ]
    }
  ];

  function derslerForSinif(sinif) {
    return PROGRAM_DERSLERI[String(sinif)] || PROGRAM_DERSLERI['1'];
  }

  window.MiniBilgeHub = { HUB, PROGRAM_DERSLERI, derslerForSinif };
})();
