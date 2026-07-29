(function () {
  'use strict';

  /**
   * MB-IA-001 — 8 ana modül (iş akışı merkezli)
   * Öğretmen belge aramaz; işi seçer → motor → belge.
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
      lead: 'İş seç → plan motoru çalışır → belge doğar.',
      items: [
        { ad: 'Yıllık Plan', href: 'modules/yillik-plan.html', motor: 'MB-YPM' },
        { ad: 'Günlük Plan', href: 'modules/gunluk-plan.html', motor: 'MB-GPM' },
        { ad: 'Haftalık Plan', href: 'modules/gunluk-plan.html', motor: 'MB-GPM' },
        { ad: 'İYEP Planı', href: 'modules/iyep.html', motor: 'MB-İYEP' },
        { ad: 'BEP Planı', href: 'documents/olustur.html?id=bep', motor: 'MB-DEM' },
        { ad: 'Destek Eğitim Planı', href: 'modules/destek-egitim.html', motor: 'MB-DEM' },
        { ad: 'Egzersiz Planı', href: 'modules/egzersiz.html', motor: 'MB-EGZ' },
        { ad: 'Kulüp Planları', href: 'modules/kulup.html', motor: 'MB-KEM' },
        { ad: 'Sosyal Etkinlik Planları', href: 'modules/belirli-gun.html', motor: 'MB-BM' },
        { ad: 'Öğretim Programı', href: 'modules/ogretim-programi.html', motor: 'MB-TPM' }
      ]
    },
    {
      id: 'sinif-yonetimi',
      ad: 'Sınıf Yönetimi',
      lead: 'Öğrenciler ve sınıf içi işlemler.',
      items: [
        { ad: 'Öğrenciler', href: 'documents/olustur.html?id=sinif-listesi' },
        { ad: 'Ders Yürütme (LEE)', href: 'modules/ders-yurutme.html', motor: 'MB-LEE' },
        { ad: 'Yoklama', href: 'documents/olustur.html?id=devamsizlik-takip' },
        { ad: 'Oturma Planı', href: 'documents/index.html?q=oturma', yakinda: true },
        { ad: 'Rehberlik', href: 'modules/rehberlik.html' },
        { ad: 'Davranış Takibi', href: 'documents/olustur.html?id=davranis-takip' },
        { ad: 'Veli Görüşmeleri', href: 'documents/olustur.html?id=veli-gorusme' },
        { ad: 'Dosyalar', href: 'documents/index.html?grup=sinif' },
        { ad: 'Günlük Kazanımlar', href: 'modules/gunluk-kazanimlar.html', motor: 'KazanimEngine' }
      ]
    },
    {
      id: 'olcme',
      ad: 'Ölçme',
      lead: 'Ölçme ve değerlendirme motoru (AIE).',
      items: [
        { ad: 'Rubrik', href: 'documents/olustur.html?id=performans-degerlendirme', motor: 'MB-AIE' },
        { ad: 'Kontrol Listesi', href: 'documents/olustur.html?id=kontrol-listesi', motor: 'MB-AIE' },
        { ad: 'Gözlem Formu', href: 'documents/olustur.html?id=ogrenci-gozlem', motor: 'MB-AIE' },
        { ad: 'Süreç Değerlendirme', href: 'modules/olcme.html', motor: 'MB-AIE' },
        { ad: 'Kazanım Değerlendirme', href: 'modules/gunluk-kazanimlar.html', motor: 'KazanimEngine' },
        { ad: 'Yazılı Analizi', href: 'modules/olcme.html', motor: 'MB-AIE' },
        { ad: 'Ölçme Raporları', href: 'modules/olcme.html', motor: 'MB-AIE' }
      ]
    },
    {
      id: 'resmi-evraklar',
      ad: 'Resmî Evraklar',
      lead: '~300 belge — tek merkez, dağılmaz.',
      items: [
        { ad: 'Tüm Evraklar', href: 'documents/index.html', motor: 'MB-BM' },
        { ad: 'Zümre', href: 'modules/zumre.html' },
        { ad: 'ŞÖK', href: 'documents/index.html?q=sok', yakinda: true },
        { ad: 'Tutanaklar', href: 'documents/index.html?q=tutanak' },
        { ad: 'Dilekçeler', href: 'documents/index.html?q=dilekce' },
        { ad: 'Kulüp Evrakları', href: 'modules/kulup.html' },
        { ad: 'Rehberlik Evrakları', href: 'modules/rehberlik.html' },
        { ad: 'Komisyon Evrakları', href: 'documents/index.html?q=komisyon', yakinda: true },
        { ad: 'Yazılar', href: 'documents/index.html?q=resmi' },
        { ad: 'Envanter', href: 'modules/envanter.html' }
      ]
    },
    {
      id: 'takvim',
      ad: 'Takvim',
      lead: 'Takvim Motoru — tatil, program, ajanda.',
      items: [
        { ad: 'Okul Takvimi', href: 'modules/takvim.html', motor: 'MB-TKM' },
        { ad: 'Ders Programı', href: 'modules/hesabim.html' },
        { ad: 'Nöbet', href: 'documents/index.html?q=nobet', yakinda: true },
        { ad: 'Ajanda', href: 'modules/takvim.html', motor: 'MB-TKM' },
        { ad: 'Resmî Tatiller', href: 'modules/takvim.html', motor: 'MB-TKM' },
        { ad: 'Belirli Günler', href: 'modules/belirli-gun.html' }
      ]
    },
    {
      id: 'etkinlikler',
      ad: 'Etkinlikler',
      lead: 'Kulüp, gezi, yarışma, proje.',
      items: [
        { ad: 'Kulüpler', href: 'modules/kulup.html' },
        { ad: 'Geziler', href: 'documents/index.html?q=gezi' },
        { ad: 'Yarışmalar', href: 'documents/index.html?q=yarisma', yakinda: true },
        { ad: 'Sosyal Etkinlikler', href: 'modules/belirli-gun.html' },
        { ad: 'Projeler', href: 'documents/index.html?q=proje', yakinda: true }
      ]
    },
    {
      id: 'raporlar',
      ad: 'Raporlar',
      lead: 'Gelişim, analiz ve istatistik.',
      items: [
        { ad: 'Gelişim Raporları', href: 'modules/raporlar.html' },
        { ad: 'Sınıf Analizi', href: 'modules/raporlar.html' },
        { ad: 'Başarı Analizi', href: 'modules/olcme.html' },
        { ad: 'Devamsızlık', href: 'documents/olustur.html?id=devamsizlik-takip' },
        { ad: 'İstatistikler', href: 'modules/raporlar.html' }
      ]
    },
    {
      id: 'ai',
      ad: 'MiniBilge AI',
      lead: 'Doğal dil → motor zinciri → belge.',
      items: [
        { ad: 'AI Asistan', href: 'modules/ai.html', motor: 'MB-AI' },
        { ad: 'Yıllık plan iste', href: 'modules/ai.html?q=yillik', motor: 'MB-AI' },
        { ad: 'Günlük plan iste', href: 'modules/ai.html?q=gunluk', motor: 'MB-AI' },
        { ad: 'Tutanak iste', href: 'modules/ai.html?q=tutanak', motor: 'MB-AI' },
        { ad: 'Çalışma kâğıdı iste', href: 'modules/ai.html?q=calisma', motor: 'MB-AI' },
        { ad: 'Components Lab / DNA', href: 'modules/components-lab.html' }
      ]
    }
  ];

  const PIPELINE = [
    'Yıllık Plan',
    'Günlük Plan',
    'Ödev',
    'Ölçme',
    'Kazanım',
    'Karne'
  ];

  const MOTOR_FLOW = [
    'Ders',
    'Program',
    'Takvim',
    'Kazanımlar',
    'Resmî Tatiller',
    'Haftalık Ders Saati',
    'Belge'
  ];

  function derslerForSinif(sinif) {
    return PROGRAM_DERSLERI[String(sinif)] || PROGRAM_DERSLERI['1'];
  }

  window.MiniBilgeHub = {
    HUB,
    PROGRAM_DERSLERI,
    PIPELINE,
    MOTOR_FLOW,
    derslerForSinif
  };
})();
