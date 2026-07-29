(function () {
  'use strict';

  /**
   * MB-UI-003 / MD-026 — Sade hub (sonraki nesil)
   * Planlar · Sınıf İşlemleri · Evraklar · Takvim · MiniBilge AI
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
      lead: 'Yalnızca planlar — her biri kendi motoruyla üretir.',
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
      id: 'sinif-islemleri',
      ad: 'Sınıf İşlemleri',
      lead: 'Sınıf içi işlemler — seçili sınıfa bağlı.',
      items: [
        { ad: 'Yoklama', href: 'documents/olustur.html?id=devamsizlik-takip' },
        { ad: 'Öğrenci Listesi', href: 'documents/olustur.html?id=sinif-listesi' },
        { ad: 'Oturma Planı', href: 'documents/index.html?q=oturma', yakinda: true },
        { ad: 'Rehberlik', href: 'modules/rehberlik.html' },
        { ad: 'Gözlem', href: 'documents/olustur.html?id=ogrenci-gozlem' },
        { ad: 'Davranış Takibi', href: 'documents/olustur.html?id=davranis-takip' },
        { ad: 'Ölçme', href: 'modules/olcme.html', motor: 'MB-AIE' },
        { ad: 'Süreç Değerlendirme', href: 'documents/olustur.html?id=performans-degerlendirme' },
        { ad: 'Günlük Kazanımlar', href: 'modules/gunluk-kazanimlar.html', motor: 'KazanimEngine' }
      ]
    },
    {
      id: 'evraklar',
      ad: 'Evraklar',
      lead: 'Tüm resmî belgeler tek merkezde — dağılmaz.',
      items: [
        { ad: 'Tüm Evraklar', href: 'documents/index.html', motor: 'MB-BM' },
        { ad: 'Zümre', href: 'modules/zumre.html' },
        { ad: 'ŞÖK', href: 'documents/index.html?q=sok', yakinda: true },
        { ad: 'Veli', href: 'documents/index.html?q=veli' },
        { ad: 'Kulüp', href: 'modules/kulup.html' },
        { ad: 'Belirli Gün ve Haftalar', href: 'modules/belirli-gun.html' },
        { ad: 'Tören / Program', href: 'documents/index.html?q=toren', yakinda: true },
        { ad: 'Rehberlik Evrakları', href: 'modules/rehberlik.html' },
        { ad: 'Resmî Yazı / Dilekçe', href: 'documents/index.html?q=resmi' },
        { ad: 'Tutanak / Form', href: 'documents/index.html?q=tutanak' },
        { ad: 'Envanter', href: 'modules/envanter.html' }
      ]
    },
    {
      id: 'takvim',
      ad: 'Takvim',
      lead: 'Takvim Motoru — tatil, belirli gün, program.',
      items: [
        { ad: 'Akademik Takvim', href: 'modules/takvim.html', motor: 'MB-TKM' },
        { ad: 'Ders Programı', href: 'modules/hesabim.html' },
        { ad: 'Nöbet', href: 'documents/index.html?q=nobet', yakinda: true },
        { ad: 'Ajanda', href: 'modules/takvim.html', motor: 'MB-TKM' },
        { ad: 'Belirli Gün ve Haftalar', href: 'modules/belirli-gun.html' },
        { ad: 'Resmî Tatiller', href: 'modules/takvim.html', motor: 'MB-TKM' }
      ]
    },
    {
      id: 'ai',
      ad: 'MiniBilge AI',
      lead: 'Doğal dil ile plan, kazanım ve materyal üret.',
      items: [
        { ad: 'AI Asistan', href: 'modules/ai.html', motor: 'MB-AI' },
        { ad: 'Yıllık plan iste', href: 'modules/ai.html?q=yillik', motor: 'MB-AI' },
        { ad: 'Günlük plan iste', href: 'modules/ai.html?q=gunluk', motor: 'MB-AI' },
        { ad: 'Çalışma kâğıdı iste', href: 'modules/ai.html?q=calisma', motor: 'MB-AI' },
        { ad: 'Components Lab', href: 'modules/components-lab.html' }
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

  function derslerForSinif(sinif) {
    return PROGRAM_DERSLERI[String(sinif)] || PROGRAM_DERSLERI['1'];
  }

  window.MiniBilgeHub = { HUB, PROGRAM_DERSLERI, PIPELINE, derslerForSinif };
})();
