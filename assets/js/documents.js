(function () {
  'use strict';

  const PERIODS = {
    'yil-basi': { label: 'Yıl Başı', icon: '🌱', months: 'Eylül – Ekim' },
    'donem-ici': { label: 'Dönem İçi', icon: '📅', months: 'Ekim – Mart' },
    'olcme': { label: 'Ölçme & Değerlendirme', icon: '📊', months: 'Tüm Yıl' },
    'veli': { label: 'Veli İletişimi', icon: '👨‍👩‍👧', months: 'Tüm Yıl' },
    'yil-sonu': { label: 'Yıl Sonu', icon: '🎓', months: 'Haziran' },
    'idari': { label: 'İdari Belgeler', icon: '📋', months: 'Tüm Yıl' }
  };

  const COMMON_FIELDS = [
    { id: 'okulAdi', label: 'Okul Adı', type: 'text', default: '' },
    { id: 'ogretmenAdi', label: 'Öğretmen Adı Soyadı', type: 'text', default: '' },
    { id: 'sinif', label: 'Sınıf / Şube', type: 'text', default: '4/A' },
    { id: 'egitimYili', label: 'Eğitim-Öğretim Yılı', type: 'text', default: '2025-2026' },
    { id: 'tarih', label: 'Tarih', type: 'date', default: () => new Date().toISOString().slice(0, 10) }
  ];

  const DOCUMENTS = [
    {
      id: 'sinif-listesi',
      title: 'Sınıf Listesi',
      icon: '📋',
      period: 'yil-basi',
      desc: 'Öğrenci adı, numara, cinsiyet ve iletişim bilgileriyle sınıf listesi.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const rows = Array.from({ length: n }, (_, i) => `
          <tr>
            <td>${i + 1}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>`).join('');
        return docHeader(d, 'SINIF LİSTESİ') + `
          <table class="doc-table">
            <thead><tr>
              <th>No</th><th>Adı Soyadı</th><th>Okul No</th><th>Cinsiyet</th><th>Veli Tel.</th><th>Adres</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p class="doc-footer">Toplam öğrenci: ${n} &nbsp;|&nbsp; Öğretmen: ${esc(d.ogretmenAdi)}</p>`;
      }
    },
    {
      id: 'ogrenci-bilgi-formu',
      title: 'Öğrenci Bilgi Formu',
      icon: '📝',
      period: 'yil-basi',
      desc: 'Her öğrenci için detaylı bilgi toplama formu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'ÖĞRENCİ BİLGİ FORMU') + `
        <div class="form-grid">
          <div class="form-field"><label>Öğrenci Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Doğum Tarihi</label><div class="line"></div></div>
          <div class="form-field"><label>TC Kimlik No</label><div class="line"></div></div>
          <div class="form-field"><label>Okul Numarası</label><div class="line"></div></div>
          <div class="form-field"><label>Anne Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Baba Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Veli Telefonu</label><div class="line"></div></div>
          <div class="form-field"><label>Acil Durum Tel.</label><div class="line"></div></div>
          <div class="form-field full"><label>Ev Adresi</label><div class="line"></div></div>
          <div class="form-field full"><label>Sağlık Bilgileri / Alerjiler</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Özel Durumlar</label><div class="line tall"></div></div>
        </div>
        <div class="sign-row"><span>Veli İmzası: _______________</span><span>Tarih: ${fmtDate(d.tarih)}</span></div>`
    },
    {
      id: 'sinif-kurallari',
      title: 'Sınıf Kuralları',
      icon: '📜',
      period: 'yil-basi',
      desc: 'Sınıf kuralları ve öğrenci taahhütnamesi.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'kurallar', label: 'Sınıf Kuralları (her satıra bir kural)', type: 'textarea', default: 'Derse zamanında geliriz.\nBirbirimize saygılı davranırız.\nSınıf malzemelerine özen gösteririz.\nÖğretmenimizi dinleriz.\nTemiz ve düzenli çalışırız.' }
      ],
      render: (d) => {
        const rules = (d.kurallar || '').split('\n').filter(Boolean);
        return docHeader(d, 'SINIF KURALLARI') + `
          <p class="doc-intro">${esc(d.sinif)} sınıfı öğrencileri olarak aşağıdaki kurallara uymayı kabul ediyoruz:</p>
          <ol class="rules-list">${rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
          <div class="sign-grid">
            <div><p>Öğretmen</p><div class="sign-line"></div><p>${esc(d.ogretmenAdi)}</p></div>
            <div><p>Öğrenci</p><div class="sign-line"></div><p>Adı Soyadı</p></div>
            <div><p>Veli</p><div class="sign-line"></div><p>Adı Soyadı</p></div>
          </div>
          <p class="doc-footer">Tarih: ${fmtDate(d.tarih)}</p>`;
      }
    },
    {
      id: 'veli-toplantisi-davet',
      title: 'Veli Toplantısı Davetiyesi',
      icon: '✉️',
      period: 'yil-basi',
      desc: 'Veli toplantısı davet mektubu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'toplantiTarihi', label: 'Toplantı Tarihi', type: 'date', default: () => new Date().toISOString().slice(0, 10) },
        { id: 'toplantiSaati', label: 'Toplantı Saati', type: 'text', default: '18:30' },
        { id: 'konu', label: 'Toplantı Konusu', type: 'text', default: 'Eğitim-Öğretim Yılı Tanışma ve Bilgilendirme Toplantısı' }
      ],
      render: (d) => docHeader(d, 'VELİ TOPLANTI DAVETİYESİ') + `
        <p class="doc-body">Sayın Velimiz,</p>
        <p class="doc-body">${esc(d.egitimYili)} eğitim-öğretim yılı ${esc(d.sinif)} sınıfı <strong>${esc(d.konu)}</strong> aşağıda belirtilen tarih ve saatte okulumuzda yapılacaktır.</p>
        <div class="info-box">
          <p><strong>Tarih:</strong> ${fmtDate(d.toplantiTarihi)}</p>
          <p><strong>Saat:</strong> ${esc(d.toplantiSaati)}</p>
          <p><strong>Yer:</strong> ${esc(d.okulAdi)} – ${esc(d.sinif)} Sınıfı</p>
        </div>
        <p class="doc-body">Katılımınız bizler için önemlidir. Saygılarımızla,</p>
        <p class="doc-body" style="margin-top:24px;"><strong>${esc(d.ogretmenAdi)}</strong><br>Sınıf Öğretmeni</p>`
    },
    {
      id: 'okul-aile-isbirligi',
      title: 'Okul-Aile İşbirliği Planı',
      icon: '🤝',
      period: 'yil-basi',
      desc: 'Yıllık okul-aile işbirliği etkinlik planı.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'OKUL-AİLE İŞBİRLİĞİ PLANI') + `
        <table class="doc-table">
          <thead><tr><th>Ay</th><th>Etkinlik</th><th>Sorumlu</th><th>Durum</th></tr></thead>
          <tbody>
            ${['Eylül','Ekim','Kasım','Aralık','Ocak','Şubat','Mart','Nisan','Mayıs','Haziran'].map(m => `
              <tr><td>${m}</td><td></td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>
        <p class="doc-footer">Hazırlayan: ${esc(d.ogretmenAdi)} &nbsp;|&nbsp; Onay: _______________</p>`
    },
    {
      id: 'sinif-meclisi-tutanagi',
      title: 'Sınıf Meclisi Seçim Tutanağı',
      icon: '🗳️',
      period: 'yil-basi',
      desc: 'Sınıf başkanı ve meclis üyeleri seçim tutanağı.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'SINIF MECLİSİ SEÇİM TUTANAĞI') + `
        <p class="doc-body">${esc(d.sinif)} sınıfında ${fmtDate(d.tarih)} tarihinde sınıf meclisi seçimleri yapılmıştır.</p>
        <table class="doc-table">
          <thead><tr><th>Görev</th><th>Adı Soyadı</th><th>İmza</th></tr></thead>
          <tbody>
            ${['Sınıf Başkanı','Başkan Yardımcısı','Yazman','Sayman','Üye 1','Üye 2','Üye 3'].map(g =>
              `<tr><td>${g}</td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>
        <div class="sign-row"><span>Öğretmen: ${esc(d.ogretmenAdi)}</span><span>İmza: _______________</span></div>`
    },
    {
      id: 'gunluk-ders-plani',
      title: 'Günlük Ders Planı',
      icon: '📖',
      period: 'donem-ici',
      desc: 'Günlük ders planı şablonu (tüm dersler).',
      fields: [
        ...COMMON_FIELDS,
        { id: 'gun', label: 'Gün', type: 'text', default: 'Pazartesi' },
        { id: 'hafta', label: 'Hafta', type: 'text', default: '1' }
      ],
      render: (d) => docHeader(d, 'GÜNLÜK DERS PLANI') + `
        <p class="doc-meta">Gün: <strong>${esc(d.gun)}</strong> &nbsp;|&nbsp; Hafta: <strong>${esc(d.hafta)}</strong> &nbsp;|&nbsp; Tarih: ${fmtDate(d.tarih)}</p>
        <table class="doc-table plan-table">
          <thead><tr><th>Ders</th><th>Konu / Kazanım</th><th>Etkinlik</th><th>Materyal</th><th>Değerlendirme</th></tr></thead>
          <tbody>
            ${['Türkçe','Matematik','Hayat Bilgisi / Sosyal','Fen Bilimleri','İngilizce','Görsel Sanatlar','Müzik','Beden Eğitimi','Rehberlik'].map(ders =>
              `<tr><td><strong>${ders}</strong></td><td></td><td></td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>
        <p class="doc-footer">Öğretmen: ${esc(d.ogretmenAdi)}</p>`
    },
    {
      id: 'haftalik-ders-plani',
      title: 'Haftalık Ders Planı',
      icon: '🗓️',
      period: 'donem-ici',
      desc: 'Haftalık ders planı tablosu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'hafta', label: 'Hafta No', type: 'text', default: '1' },
        { id: 'tarihAraligi', label: 'Tarih Aralığı', type: 'text', default: '15 – 19 Eylül 2025' }
      ],
      render: (d) => docHeader(d, 'HAFTALIK DERS PLANI') + `
        <p class="doc-meta">Hafta: <strong>${esc(d.hafta)}</strong> &nbsp;|&nbsp; ${esc(d.tarihAraligi)}</p>
        <table class="doc-table plan-table">
          <thead><tr><th>Ders</th><th>Pzt</th><th>Sal</th><th>Çar</th><th>Per</th><th>Cum</th></tr></thead>
          <tbody>
            ${['Türkçe','Matematik','Hayat Bilgisi','Fen Bilimleri','İngilizce'].map(ders =>
              `<tr><td><strong>${ders}</strong></td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>`
    },
    {
      id: 'yillik-plan',
      title: 'Yıllık Plan Çerçevesi',
      icon: '📆',
      period: 'donem-ici',
      desc: 'Ders bazında yıllık plan tablosu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ders', label: 'Ders Adı', type: 'text', default: 'Matematik' }
      ],
      render: (d) => docHeader(d, 'YILLIK PLAN ÇERÇEVESİ') + `
        <p class="doc-meta">Ders: <strong>${esc(d.ders)}</strong> &nbsp;|&nbsp; Sınıf: <strong>${esc(d.sinif)}</strong></p>
        <table class="doc-table">
          <thead><tr><th>Ünite</th><th>Konu</th><th>Hafta</th><th>Süre</th><th>Kazanım</th></tr></thead>
          <tbody>${Array.from({length:12}, (_,i) =>
            `<tr><td>${i+1}</td><td></td><td></td><td></td><td></td></tr>`).join('')}</tbody>
        </table>`
    },
    {
      id: 'unite-plani',
      title: 'Ünite Planı',
      icon: '📚',
      period: 'donem-ici',
      desc: 'Ünite bazlı detaylı ders planı şablonu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ders', label: 'Ders', type: 'text', default: 'Türkçe' },
        { id: 'unite', label: 'Ünite Adı', type: 'text', default: '' },
        { id: 'sure', label: 'Süre (Hafta)', type: 'text', default: '4' }
      ],
      render: (d) => docHeader(d, 'ÜNİTE PLANI') + `
        <div class="form-grid">
          <div class="form-field"><label>Ders</label><p>${esc(d.ders)}</p></div>
          <div class="form-field"><label>Ünite</label><p>${esc(d.unite) || '—'}</p></div>
          <div class="form-field"><label>Süre</label><p>${esc(d.sure)} hafta</p></div>
        </div>
        <h3 class="doc-sub">Kazanımlar</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">İçerik Çerçevesi</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Etkinlikler</h3>
        <table class="doc-table">
          <thead><tr><th>Hafta</th><th>Konu</th><th>Etkinlik</th><th>Materyal</th></tr></thead>
          <tbody>${Array.from({length:4}, (_,i) =>
            `<tr><td>${i+1}</td><td></td><td></td><td></td></tr>`).join('')}</tbody>
        </table>`
    },
    {
      id: 'etkinlik-plani',
      title: 'Etkinlik Planı',
      icon: '🎨',
      period: 'donem-ici',
      desc: 'Sınıf içi veya dışı etkinlik planı.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'etkinlikAdi', label: 'Etkinlik Adı', type: 'text', default: '' },
        { id: 'etkinlikTarihi', label: 'Etkinlik Tarihi', type: 'date', default: () => new Date().toISOString().slice(0, 10) }
      ],
      render: (d) => docHeader(d, 'ETKİNLİK PLANI') + `
        <div class="form-grid">
          <div class="form-field full"><label>Etkinlik Adı</label><p>${esc(d.etkinlikAdi) || '—'}</p></div>
          <div class="form-field"><label>Tarih</label><p>${fmtDate(d.etkinlikTarihi)}</p></div>
          <div class="form-field"><label>Süre</label><div class="line"></div></div>
          <div class="form-field full"><label>Amaç</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Materyaller</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Yapılacaklar</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Değerlendirme</label><div class="line"></div></div>
        </div>`
    },
    {
      id: 'devamsizlik-takip',
      title: 'Devamsızlık Takip Çizelgesi',
      icon: '📅',
      period: 'olcme',
      desc: 'Aylık devamsızlık takip tablosu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ay', label: 'Ay', type: 'text', default: 'Eylül' },
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const days = Array.from({length: 20}, (_, i) => `<th>${i+1}</th>`).join('');
        const rows = Array.from({length: n}, (_, i) => `
          <tr><td>${i+1}</td><td></td>${Array.from({length:20}, () => '<td></td>').join('')}<td></td></tr>`).join('');
        return docHeader(d, 'DEVAMSIZLIK TAKİP ÇİZELGESİ') + `
          <p class="doc-meta">Ay: <strong>${esc(d.ay)}</strong></p>
          <table class="doc-table compact">
            <thead><tr><th>No</th><th>Adı Soyadı</th>${days}<th>Toplam</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p class="doc-note">İ = İzinli &nbsp; Ö = Özürsüz &nbsp; Öz = Özürlü</p>`;
      }
    },
    {
      id: 'not-cizelgesi',
      title: 'Not / Puan Çizelgesi',
      icon: '📊',
      period: 'olcme',
      desc: 'Ders bazlı not giriş çizelgesi.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ders', label: 'Ders', type: 'text', default: 'Matematik' },
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const rows = Array.from({length: n}, (_, i) => `
          <tr><td>${i+1}</td><td></td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>`).join('');
        return docHeader(d, 'NOT / PUAN ÇİZELGESİ') + `
          <p class="doc-meta">Ders: <strong>${esc(d.ders)}</strong></p>
          <table class="doc-table">
            <thead><tr>
              <th>No</th><th>Adı Soyadı</th>
              <th>1. Yazılı</th><th>2. Yazılı</th><th>Performans 1</th><th>Performans 2</th>
              <th>Proje</th><th>Sözlü</th><th>Ort.</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>`;
      }
    },
    {
      id: 'sinav-kagidi',
      title: 'Sınav Kağıdı',
      icon: '📄',
      period: 'olcme',
      desc: 'Yazılı sınav kağıdı şablonu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ders', label: 'Ders', type: 'text', default: 'Matematik' },
        { id: 'sinavTuru', label: 'Sınav Türü', type: 'text', default: '1. Yazılı Sınavı' },
        { id: 'sure', label: 'Süre (dk)', type: 'text', default: '40' },
        { id: 'soruSayisi', label: 'Soru Sayısı', type: 'number', default: 5, min: 1, max: 20 }
      ],
      render: (d) => {
        const n = parseInt(d.soruSayisi, 10) || 5;
        const questions = Array.from({length: n}, (_, i) => `
          <div class="question-block">
            <p><strong>Soru ${i+1}.</strong> (____ puan)</p>
            <div class="answer-area"></div>
          </div>`).join('');
        return docHeader(d, esc(d.sinavTuru).toUpperCase()) + `
          <div class="exam-info">
            <span>Ders: <strong>${esc(d.ders)}</strong></span>
            <span>Sınıf: <strong>${esc(d.sinif)}</strong></span>
            <span>Süre: <strong>${esc(d.sure)} dk</strong></span>
            <span>Tarih: <strong>${fmtDate(d.tarih)}</strong></span>
          </div>
          <div class="student-info-row">
            <span>Adı Soyadı: _______________________</span>
            <span>No: ______</span>
          </div>
          ${questions}
          <p class="doc-footer">Başarılar dilerim. — ${esc(d.ogretmenAdi)}</p>`;
      }
    },
    {
      id: 'ogrenci-gozlem',
      title: 'Öğrenci Gözlem Formu',
      icon: '👁️',
      period: 'olcme',
      desc: 'Öğrenci davranış ve gelişim gözlem formu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'ÖĞRENCİ GÖZLEM FORMU') + `
        <div class="form-grid">
          <div class="form-field"><label>Öğrenci Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Gözlem Tarihi</label><p>${fmtDate(d.tarih)}</p></div>
          <div class="form-field full"><label>Gözlem Konusu</label><div class="line"></div></div>
          <div class="form-field full"><label>Gözlem Notları</label><div class="line tall"></div><div class="line tall"></div><div class="line tall"></div></div>
          <div class="form-field full"><label>Değerlendirme / Öneriler</label><div class="line tall"></div></div>
        </div>
        <div class="sign-row"><span>Gözlemleyen: ${esc(d.ogretmenAdi)}</span><span>İmza: _______________</span></div>`
    },
    {
      id: 'sozlu-sinav',
      title: 'Sözlü Sınav Değerlendirme',
      icon: '🗣️',
      period: 'olcme',
      desc: 'Sözlü sınav puanlama formu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ders', label: 'Ders', type: 'text', default: 'Türkçe' },
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const rows = Array.from({length: n}, (_, i) => `
          <tr><td>${i+1}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('');
        return docHeader(d, 'SÖZLÜ SINAV DEĞERLENDİRME FORMU') + `
          <p class="doc-meta">Ders: <strong>${esc(d.ders)}</strong> &nbsp;|&nbsp; Tarih: ${fmtDate(d.tarih)}</p>
          <table class="doc-table">
            <thead><tr><th>No</th><th>Adı Soyadı</th><th>Bilgi (40)</th><th>Anlatım (30)</th><th>Dil (30)</th><th>Toplam</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>`;
      }
    },
    {
      id: 'performans-degerlendirme',
      title: 'Performans Değerlendirme Rubriği',
      icon: '✅',
      period: 'olcme',
      desc: 'Performans görevi değerlendirme ölçütleri.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'gorev', label: 'Performans Görevi', type: 'text', default: '' }
      ],
      render: (d) => docHeader(d, 'PERFORMANS DEĞERLENDİRME RUBRİĞİ') + `
        <p class="doc-meta">Görev: <strong>${esc(d.gorev) || '—'}</strong></p>
        <table class="doc-table">
          <thead><tr><th>Ölçüt</th><th>Çok İyi (4)</th><th>İyi (3)</th><th>Geliştirilmeli (2)</th><th>Başlanmadı (1)</th></tr></thead>
          <tbody>
            ${['İçerik doğruluğu','Düzen ve sunum','Zamanında teslim','Özgünlük / yaratıcılık','İş birliği'].map(o =>
              `<tr><td><strong>${o}</strong></td><td></td><td></td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>
        <div class="form-grid" style="margin-top:16px;">
          <div class="form-field"><label>Öğrenci</label><div class="line"></div></div>
          <div class="form-field"><label>Toplam Puan</label><div class="line"></div></div>
        </div>`
    },
    {
      id: 'odev-takip',
      title: 'Ödev Takip Çizelgesi',
      icon: '📒',
      period: 'olcme',
      desc: 'Haftalık ödev takip tablosu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'hafta', label: 'Hafta', type: 'text', default: '1' },
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const rows = Array.from({length: n}, (_, i) => `
          <tr><td>${i+1}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('');
        return docHeader(d, 'ÖDEV TAKİP ÇİZELGESİ') + `
          <p class="doc-meta">Hafta: <strong>${esc(d.hafta)}</strong></p>
          <table class="doc-table">
            <thead><tr><th>No</th><th>Adı Soyadı</th><th>Pzt</th><th>Sal</th><th>Çar</th><th>Per</th><th>Cum</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p class="doc-note">✓ = Yaptı &nbsp; ✗ = Yapmadı &nbsp; E = Eksik</p>`;
      }
    },
    {
      id: 'veli-toplanti-tutanagi',
      title: 'Veli Toplantı Tutanağı',
      icon: '📝',
      period: 'veli',
      desc: 'Veli toplantısı tutanak formu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'toplantiTarihi', label: 'Toplantı Tarihi', type: 'date', default: () => new Date().toISOString().slice(0, 10) },
        { id: 'konu', label: 'Gündem Konusu', type: 'text', default: '' }
      ],
      render: (d) => docHeader(d, 'VELİ TOPLANTI TUTANAĞI') + `
        <div class="form-grid">
          <div class="form-field"><label>Toplantı Tarihi</label><p>${fmtDate(d.toplantiTarihi)}</p></div>
          <div class="form-field"><label>Katılımcı Sayısı</label><div class="line"></div></div>
          <div class="form-field full"><label>Gündem Konusu</label><p>${esc(d.konu) || '—'}</p></div>
          <div class="form-field full"><label>Görüşülen Konular</label><div class="line tall"></div><div class="line tall"></div></div>
          <div class="form-field full"><label>Alınan Kararlar</label><div class="line tall"></div><div class="line tall"></div></div>
        </div>
        <div class="sign-row"><span>Tutanak Yazmanı: _______________</span><span>Öğretmen: ${esc(d.ogretmenAdi)}</span></div>`
    },
    {
      id: 'veli-gorusme',
      title: 'Veli Görüşme Formu',
      icon: '💬',
      period: 'veli',
      desc: 'Bireysel veli görüşme kayıt formu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'VELİ GÖRÜŞME FORMU') + `
        <div class="form-grid">
          <div class="form-field"><label>Öğrenci</label><div class="line"></div></div>
          <div class="form-field"><label>Veli Adı</label><div class="line"></div></div>
          <div class="form-field"><label>Görüşme Tarihi</label><p>${fmtDate(d.tarih)}</p></div>
          <div class="form-field"><label>Görüşme Türü</label><div class="line"></div></div>
          <div class="form-field full"><label>Görüşme Konusu</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Görüşme Notları</label><div class="line tall"></div><div class="line tall"></div></div>
          <div class="form-field full"><label>Karar / Öneriler</label><div class="line tall"></div></div>
        </div>
        <div class="sign-row"><span>Öğretmen: ${esc(d.ogretmenAdi)}</span><span>Veli: _______________</span></div>`
    },
    {
      id: 'veli-bilgilendirme',
      title: 'Veli Bilgilendirme Mektubu',
      icon: '📧',
      period: 'veli',
      desc: 'Genel veli bilgilendirme mektubu şablonu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'konu', label: 'Konu', type: 'text', default: '' },
        { id: 'icerik', label: 'Mektup İçeriği', type: 'textarea', default: 'Sayın Velimiz,\n\nBu mektupla sizleri bilgilendirmek istiyoruz.\n\nSaygılarımızla,' }
      ],
      render: (d) => docHeader(d, 'VELİ BİLGİLENDİRME MEKTUBU') + `
        <p class="doc-meta">Konu: <strong>${esc(d.konu) || '—'}</strong></p>
        <div class="doc-body letter-body">${(d.icerik || '').split('\n').map(p => `<p>${esc(p)}</p>`).join('')}</div>
        <p class="doc-body" style="margin-top:32px;"><strong>${esc(d.ogretmenAdi)}</strong><br>${esc(d.sinif)} Sınıf Öğretmeni<br>${esc(d.okulAdi)}</p>`
    },
    {
      id: 'davranis-takip',
      title: 'Davranış Takip Formu',
      icon: '⭐',
      period: 'veli',
      desc: 'Öğrenci davranış takip ve ödül sistemi.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const rows = Array.from({length: n}, (_, i) => `
          <tr><td>${i+1}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('');
        return docHeader(d, 'DAVRANIŞ TAKİP FORMU') + `
          <table class="doc-table">
            <thead><tr><th>No</th><th>Adı Soyadı</th><th>Olumlu (+)</th><th>Olumsuz (-)</th><th>Toplam</th><th>Not</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p class="doc-note">Haftalık davranış takibi için kullanılır.</p>`;
      }
    },
    {
      id: 'rehberlik-gorusme',
      title: 'Rehberlik Görüşme Formu',
      icon: '🧭',
      period: 'veli',
      desc: 'PDR / rehberlik görüşme kayıt formu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'REHBERLİK GÖRÜŞME FORMU') + `
        <div class="form-grid">
          <div class="form-field"><label>Öğrenci</label><div class="line"></div></div>
          <div class="form-field"><label>Sınıf</label><p>${esc(d.sinif)}</p></div>
          <div class="form-field"><label>Görüşme Tarihi</label><p>${fmtDate(d.tarih)}</p></div>
          <div class="form-field"><label>Görüşmeyi Yapan</label><div class="line"></div></div>
          <div class="form-field full"><label>Başvuru Nedeni</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Görüşme Özeti</label><div class="line tall"></div><div class="line tall"></div></div>
          <div class="form-field full"><label>Sonuç ve Öneriler</label><div class="line tall"></div></div>
        </div>`
    },
    {
      id: 'karne-not-giris',
      title: 'Karne Not Giriş Çizelgesi',
      icon: '🎓',
      period: 'yil-sonu',
      desc: 'Tüm dersler için karne not giriş tablosu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'ogrenciSayisi', label: 'Öğrenci Sayısı', type: 'number', default: 24, min: 1, max: 40 }
      ],
      render: (d) => {
        const n = parseInt(d.ogrenciSayisi, 10) || 24;
        const dersler = ['Türkçe','Matematik','Hayat Bilgisi','Fen','İngilizce','Görsel San.','Müzik','Beden Eğ.','Rehberlik'];
        const rows = Array.from({length: n}, (_, i) => `
          <tr><td>${i+1}</td><td></td>${dersler.map(() => '<td></td>').join('')}</tr>`).join('');
        return docHeader(d, 'KARNE NOT GİRİŞ ÇİZELGESİ') + `
          <table class="doc-table compact">
            <thead><tr><th>No</th><th>Adı Soyadı</th>${dersler.map(d => `<th>${d}</th>`).join('')}</tr></thead>
            <tbody>${rows}</tbody>
          </table>`;
      }
    },
    {
      id: 'sinif-basari-analizi',
      title: 'Sınıf Başarı Analizi',
      icon: '📈',
      period: 'yil-sonu',
      desc: 'Ders bazında sınıf başarı analiz tablosu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'SINIF BAŞARI ANALİZİ') + `
        <table class="doc-table">
          <thead><tr><th>Ders</th><th>Sınıf Ort.</th><th>En Yüksek</th><th>En Düşük</th><th>Başarı %</th><th>Değerlendirme</th></tr></thead>
          <tbody>
            ${['Türkçe','Matematik','Hayat Bilgisi','Fen Bilimleri','İngilizce','Görsel Sanatlar','Müzik','Beden Eğitimi'].map(ders =>
              `<tr><td>${ders}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>
        <div class="form-field full" style="margin-top:16px;"><label>Genel Değerlendirme</label><div class="line tall"></div></div>`
    },
    {
      id: 'yil-sonu-degerlendirme',
      title: 'Yıl Sonu Değerlendirme Raporu',
      icon: '📑',
      period: 'yil-sonu',
      desc: 'Sınıf yıl sonu genel değerlendirme raporu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'YIL SONU DEĞERLENDİRME RAPORU') + `
        <div class="form-grid">
          <div class="form-field"><label>Öğrenci Sayısı</label><div class="line"></div></div>
          <div class="form-field"><label>Başarı Ortalaması</label><div class="line"></div></div>
          <div class="form-field full"><label>Eğitim-Öğretim Faaliyetleri</label><div class="line tall"></div><div class="line tall"></div></div>
          <div class="form-field full"><label>Sosyal Etkinlikler</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Karşılaşılan Sorunlar</label><div class="line tall"></div></div>
          <div class="form-field full"><label>Öneriler</label><div class="line tall"></div></div>
        </div>
        <div class="sign-row"><span>Hazırlayan: ${esc(d.ogretmenAdi)}</span><span>İmza: _______________</span></div>`
    },
    {
      id: 'ogrenci-gelisim-raporu',
      title: 'Öğrenci Gelişim Raporu',
      icon: '🌟',
      period: 'yil-sonu',
      desc: 'Bireysel öğrenci gelişim değerlendirme raporu.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'ÖĞRENCİ GELİŞİM RAPORU') + `
        <div class="form-grid">
          <div class="form-field"><label>Öğrenci Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Okul No</label><div class="line"></div></div>
        </div>
        <h3 class="doc-sub">Akademik Gelişim</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Sosyal Gelişim</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Güçlü Yönler</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Geliştirilmesi Gereken Yönler</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Öneriler</h3>
        <div class="line tall"></div>
        <div class="sign-row"><span>Öğretmen: ${esc(d.ogretmenAdi)}</span><span>Tarih: ${fmtDate(d.tarih)}</span></div>`
    },
    {
      id: 'gezi-izin-formu',
      title: 'Okul Gezisi İzin Formu',
      icon: '🚌',
      period: 'idari',
      desc: 'Veli onaylı okul gezisi izin formu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'geziYeri', label: 'Gezi Yeri', type: 'text', default: '' },
        { id: 'geziTarihi', label: 'Gezi Tarihi', type: 'date', default: () => new Date().toISOString().slice(0, 10) }
      ],
      render: (d) => docHeader(d, 'OKUL GEZİSİ İZİN FORMU') + `
        <div class="info-box">
          <p><strong>Gezi Yeri:</strong> ${esc(d.geziYeri) || '—'}</p>
          <p><strong>Tarih:</strong> ${fmtDate(d.geziTarihi)}</p>
          <p><strong>Sınıf:</strong> ${esc(d.sinif)}</p>
        </div>
        <p class="doc-body">Yukarıda bilgileri verilen geziye öğrencimin katılmasına izin veriyorum. Gezi süresince oluşabilecek durumlardan okul idaresinin sorumlu olmadığını kabul ederim.</p>
        <div class="form-grid" style="margin-top:24px;">
          <div class="form-field"><label>Öğrenci Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Veli Adı Soyadı</label><div class="line"></div></div>
          <div class="form-field"><label>Telefon</label><div class="line"></div></div>
          <div class="form-field"><label>Tarih</label><div class="line"></div></div>
        </div>
        <p class="doc-body" style="margin-top:16px;">Veli İmzası: _______________________</p>`
    },
    {
      id: 'kulup-faaliyet-raporu',
      title: 'Kulüp Faaliyet Raporu',
      icon: '🎭',
      period: 'idari',
      desc: 'Kulüp / sosyal etkinlik faaliyet raporu.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'kulupAdi', label: 'Kulüp Adı', type: 'text', default: '' }
      ],
      render: (d) => docHeader(d, 'KULÜP FAALİYET RAPORU') + `
        <p class="doc-meta">Kulüp: <strong>${esc(d.kulupAdi) || '—'}</strong></p>
        <table class="doc-table">
          <thead><tr><th>Tarih</th><th>Faaliyet</th><th>Katılımcı</th><th>Açıklama</th></tr></thead>
          <tbody>${Array.from({length:8}, () => '<tr><td></td><td></td><td></td><td></td></tr>').join('')}</tbody>
        </table>
        <div class="sign-row"><span>Sorumlu Öğretmen: ${esc(d.ogretmenAdi)}</span><span>İmza: _______________</span></div>`
    },
    {
      id: 'zumre-toplanti',
      title: 'Zümre Toplantı Tutanağı',
      icon: '👥',
      period: 'idari',
      desc: 'Zümre öğretmenleri toplantı tutanağı.',
      fields: [
        ...COMMON_FIELDS,
        { id: 'zumre', label: 'Zümre Adı', type: 'text', default: '' },
        { id: 'toplantiTarihi', label: 'Toplantı Tarihi', type: 'date', default: () => new Date().toISOString().slice(0, 10) }
      ],
      render: (d) => docHeader(d, 'ZÜMRE TOPLANTI TUTANAĞI') + `
        <p class="doc-meta">Zümre: <strong>${esc(d.zumre) || '—'}</strong> &nbsp;|&nbsp; Tarih: ${fmtDate(d.toplantiTarihi)}</p>
        <h3 class="doc-sub">Katılımcılar</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Gündem</h3>
        <div class="line tall"></div>
        <h3 class="doc-sub">Görüşülen Konular</h3>
        <div class="line tall"></div><div class="line tall"></div>
        <h3 class="doc-sub">Alınan Kararlar</h3>
        <div class="line tall"></div><div class="line tall"></div>
        <div class="sign-row"><span>Toplantı Başkanı: _______________</span><span>Tutanak Yazmanı: _______________</span></div>`
    },
    {
      id: 'sinif-temsilcisi',
      title: 'Sınıf Temsilcisi Görev Dağılımı',
      icon: '🏅',
      period: 'idari',
      desc: 'Sınıf görev dağılımı ve sorumluluklar.',
      fields: COMMON_FIELDS,
      render: (d) => docHeader(d, 'SINIF GÖREV DAĞILIMI') + `
        <table class="doc-table">
          <thead><tr><th>Görev</th><th>Öğrenci</th><th>Sorumluluk</th></tr></thead>
          <tbody>
            ${['Sınıf Başkanı','Başkan Yardımcısı','Fen Sorumlusu','Matematik Sorumlusu','Türkçe Sorumlusu','Temizlik Sorumlusu','Tahta Sorumlusu','Kitaplık Sorumlusu'].map(g =>
              `<tr><td>${g}</td><td></td><td></td></tr>`).join('')}
          </tbody>
        </table>
        <p class="doc-footer">Öğretmen: ${esc(d.ogretmenAdi)} &nbsp;|&nbsp; ${fmtDate(d.tarih)}</p>`
    }
  ];

  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      const [y, m, day] = d.split('-');
      const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
      return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
    } catch {
      return d;
    }
  }

  function docHeader(d, title) {
    return `
      <div class="doc-letterhead">
        <div class="letterhead-top">
          <div>
            <p class="school-name">${esc(d.okulAdi) || 'OKUL ADI'}</p>
            <p class="school-sub">${esc(d.egitimYili)} Eğitim-Öğretim Yılı</p>
          </div>
          <div class="letterhead-right">
            <p>Sınıf: <strong>${esc(d.sinif)}</strong></p>
            <p>Tarih: ${fmtDate(d.tarih)}</p>
          </div>
        </div>
        <h1 class="doc-title">${title}</h1>
      </div>`;
  }

  function getDocument(id) {
    return DOCUMENTS.find(d => d.id === id);
  }

  function getDefaultValues(doc) {
    const vals = {};
    doc.fields.forEach(f => {
      vals[f.id] = typeof f.default === 'function' ? f.default() : (f.default ?? '');
    });
    return vals;
  }

  function loadSavedProfile() {
    try {
      if (window.MiniBilgeStorage) {
        const p = MiniBilgeStorage.getProfile();
        const s = MiniBilgeStorage.getSchool();
        return {
          okulAdi: s.okulAdi || '',
          ogretmenAdi: p.adSoyad || '',
          sinif: (MiniBilgeStorage.getSettings().varsayilanSinif || '1') + '/A',
          egitimYili: s.egitimYili || '2025-2026'
        };
      }
      return JSON.parse(localStorage.getItem('dijitalOgretmenProfile') || '{}');
    } catch {
      return {};
    }
  }

  function saveProfile(data) {
    if (window.MiniBilgeStorage) {
      MiniBilgeStorage.saveProfile({ adSoyad: data.ogretmenAdi });
      MiniBilgeStorage.saveSchool({ okulAdi: data.okulAdi, egitimYili: data.egitimYili });
      return;
    }
    localStorage.setItem('dijitalOgretmenProfile', JSON.stringify(data));
  }
  window.BelgeMerkezi = {
    PERIODS,
    DOCUMENTS,
    getDocument,
    getDefaultValues,
    loadSavedProfile,
    saveProfile,
    renderDocument: (id, data) => {
      const doc = getDocument(id);
      if (!doc) return '';
      return doc.render(data);
    }
  };
})();
