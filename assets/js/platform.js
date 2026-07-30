(function () {
  'use strict';

  const STORAGE_KEY = 'dijitalOgretmenProgress';

  const ACTIVITIES = [
    {
      id: 'abc-baglamaca',
      title: 'ABC Bağlamaca',
      icon: '🔤',
      desc: 'Aynı harfleri birbirine bağla, tüm kareleri doldur. Zeka geliştiren klasik bağlama bulmacası.',
      category: 'zeka',
      grades: ['1', '2', '3', '4'],
      levels: 5,
      url: 'activities/abc-baglamaca.html',
      accent: '#e53935'
    },
    {
      id: 'matematik-quiz',
      title: 'Matematik Quiz',
      icon: '🔢',
      desc: 'Toplama ve çıkarma sorularıyla hızlı matematik pratiği yap. Seviyene uygun sorular.',
      category: 'matematik',
      grades: ['1', '2', '3'],
      levels: 10,
      url: 'activities/matematik-quiz.html',
      accent: '#1e88e5'
    },
    {
      id: 'kelime-eslestirme',
      title: 'Kelime Eşleştirme',
      icon: '📝',
      desc: 'Kelimeleri anlamlarıyla eşleştir. Türkçe kelime dağarcığını geliştir.',
      category: 'turkce',
      grades: ['2', '3', '4'],
      levels: 8,
      url: 'activities/kelime-eslestirme.html',
      accent: '#43a047'
    },
    {
      id: 'sayi-siralama',
      title: 'Sayı Sıralama',
      icon: '🎯',
      desc: 'Karışık sayıları küçükten büyüğe sırala. Sayı kavramını pekiştir.',
      category: 'matematik',
      grades: ['1', '2'],
      levels: 6,
      url: 'activities/sayi-siralama.html',
      accent: '#8e24aa'
    }
  ];

  const CATEGORIES = {
    all: 'Tümü',
    zeka: 'Zeka Oyunları',
    matematik: 'Matematik',
    turkce: 'Türkçe'
  };

  const GRADE_LABELS = {
    '1': '1. Sınıf',
    '2': '2. Sınıf',
    '3': '3. Sınıf',
    '4': '4. Sınıf'
  };

  let currentRole = 'student';
  let currentFilter = 'all';
  let currentGrade = 'all';

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getActivityProgress(id) {
    const progress = loadProgress();
    return progress[id] || { completed: 0, total: ACTIVITIES.find(a => a.id === id)?.levels || 0 };
  }

  function markLevelComplete(activityId, level) {
    const progress = loadProgress();
    if (!progress[activityId]) {
      const act = ACTIVITIES.find(a => a.id === activityId);
      progress[activityId] = { completed: 0, total: act?.levels || 0, levels: [] };
    }
    if (!progress[activityId].levels) progress[activityId].levels = [];
    if (!progress[activityId].levels.includes(level)) {
      progress[activityId].levels.push(level);
      progress[activityId].completed = progress[activityId].levels.length;
    }
    saveProgress(progress);
  }

  function getTotalStats() {
    const progress = loadProgress();
    let completed = 0;
    let total = 0;
    ACTIVITIES.forEach(a => {
      const p = progress[a.id];
      completed += p?.completed || 0;
      total += a.levels;
    });
    return { completed, total, activities: ACTIVITIES.length };
  }

  function renderStats() {
    const stats = getTotalStats();
    const el = document.getElementById('statsRow');
    if (!el) return;
    el.innerHTML = `
      <div class="stat-card">
        <div class="value">${stats.activities}</div>
        <div class="label">Etkinlik</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.completed}</div>
        <div class="label">Tamamlanan Seviye</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</div>
        <div class="label">Genel İlerleme</div>
      </div>
    `;
  }

  function renderFilters() {
    const catEl = document.getElementById('categoryFilters');
    const gradeEl = document.getElementById('gradeFilters');
    if (!catEl || !gradeEl) return;

    catEl.innerHTML = Object.entries(CATEGORIES).map(([key, label]) =>
      `<button class="filter-btn${key === currentFilter ? ' active' : ''}" data-filter="${key}">${label}</button>`
    ).join('');

    gradeEl.innerHTML = `<button class="filter-btn${currentGrade === 'all' ? ' active' : ''}" data-grade="all">Tüm Sınıflar</button>` +
      Object.entries(GRADE_LABELS).map(([key, label]) =>
        `<button class="filter-btn${currentGrade === key ? ' active' : ''}" data-grade="${key}">${label}</button>`
      ).join('');

    catEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        renderFilters();
        renderActivities();
      });
    });

    gradeEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentGrade = btn.dataset.grade;
        renderFilters();
        renderActivities();
      });
    });
  }

  function renderActivities() {
    const grid = document.getElementById('activityGrid');
    if (!grid) return;

    const filtered = ACTIVITIES.filter(a => {
      const catMatch = currentFilter === 'all' || a.category === currentFilter;
      const gradeMatch = currentGrade === 'all' || a.grades.includes(currentGrade);
      return catMatch && gradeMatch;
    });

    grid.innerHTML = filtered.map(a => {
      const p = getActivityProgress(a.id);
      const done = p.completed >= a.levels;
      const gradeTags = a.grades.map(g => GRADE_LABELS[g]).join(', ');
      return `
        <article class="activity-card" style="--card-accent: ${a.accent}" data-url="${a.url}">
          <div class="icon">${a.icon}</div>
          <h3>${a.title}</h3>
          <p class="desc">${a.desc}</p>
          <div class="activity-meta">
            <span class="tag">${CATEGORIES[a.category]}</span>
            <span class="tag">${a.levels} Seviye</span>
            ${done ? '<span class="tag done">Tamamlandı</span>' : `<span class="tag">${p.completed}/${a.levels}</span>`}
          </div>
          <p class="desc" style="font-size:0.75rem;margin-top:-4px;">${gradeTags}</p>
          <button class="play-btn" type="button">▶ Başla</button>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.activity-card').forEach(card => {
      const go = () => { window.location.href = card.dataset.url; };
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.play-btn')) go();
      });
      card.querySelector('.play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        go();
      });
    });
  }

  function renderTeacherPanel() {
    const list = document.getElementById('teacherProgressList');
    if (!list) return;

    const progress = loadProgress();
    list.innerHTML = ACTIVITIES.map(a => {
      const p = progress[a.id] || { completed: 0, total: a.levels };
      const pct = a.levels > 0 ? Math.round((p.completed / a.levels) * 100) : 0;
      return `
        <div class="progress-item">
          <span>${a.icon} ${a.title}</span>
          <div class="progress-bar-wrap">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
          <span>${p.completed}/${a.levels}</span>
        </div>
      `;
    }).join('');
  }

  function setRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === role);
    });
    document.getElementById('studentPanel')?.classList.toggle('hidden', role !== 'student');
    document.getElementById('teacherPanel')?.classList.toggle('visible', role === 'teacher');

    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    if (role === 'teacher') {
      if (heroTitle) heroTitle.textContent = 'Öğretmen Paneli';
      if (heroDesc) heroDesc.textContent = 'Belge Merkezi ile yıl boyunca ihtiyacınız olan tüm belgeleri oluşturun. Öğrenci ilerlemesini takip edin ve etkinlikleri yönetin.';
      renderTeacherPanel();
    } else {
      if (heroTitle) heroTitle.textContent = 'Eğlenerek Öğren!';
      if (heroDesc) heroDesc.textContent = 'Sınıfına uygun etkinlikleri seç, oyna ve ilerlemeni takip et. Her etkinlik farklı bir beceri geliştirir.';
    }
  }

  function init() {
    renderStats();
    renderFilters();
    renderActivities();

    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => setRole(btn.dataset.role));
    });

    document.getElementById('btnResetProgress')?.addEventListener('click', () => {
      if (confirm('Tüm ilerleme verileri silinecek. Emin misiniz?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderStats();
        renderActivities();
        renderTeacherPanel();
      }
    });
  }

  window.DijitalOgretmen = {
    ACTIVITIES,
    loadProgress,
    saveProgress,
    getActivityProgress,
    markLevelComplete,
    getTotalStats
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
