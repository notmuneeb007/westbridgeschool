/* ===== CHARTS & GRAPHS — Westbridge School ===== */

var ChartsApp = (function () {

  /* ── Color palette ── */
  var COLORS = {
    green:     '#1a3a6b',
    greenDark: '#0f2745',
    gold:      '#d4a017',
    goldLight: '#fef3cd',
    blue:      '#3b82f6',
    sky:       '#0ea5e9',
    emerald:   '#10b981',
    amber:     '#f59e0b',
    rose:      '#ef4444',
    purple:    '#8b5cf6',
    teal:      '#14b8a6',
    indigo:    '#6366f1',
    pink:      '#ec4899',
    orange:    '#f97316',
    lime:      '#84cc16',
    cyan:      '#06b6d4'
  };

  var DARK_COLORS = {
    green:     '#60a5fa',
    gold:      '#fbbf24',
    blue:      '#60a5fa',
    text:      '#f1f5f9',
    textMuted: '#94a3b8',
    grid:      'rgba(148,163,184,0.1)',
    bg:        '#1e293b'
  };

  /* ── Utility ── */
  function isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }

  function getTextColor() {
    return isDarkMode() ? DARK_COLORS.text : '#1c1c1c';
  }

  function getMutedColor() {
    return isDarkMode() ? DARK_COLORS.textMuted : '#5a5a5a';
  }

  function getGridColor() {
    return isDarkMode() ? DARK_COLORS.grid : 'rgba(0,0,0,0.06)';
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  /* ── Common Chart.js defaults ── */
  function setDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = "'Source Sans 3', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.color = getTextColor();
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.animation.duration = 1200;
    Chart.defaults.animation.easing = 'easeOutQuart';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
  }

  /* ══════════════════════════════════════════════
     HOME PAGE CHARTS
  ══════════════════════════════════════════════ */

  /* 1. Enrollment Trend — Line Chart */
  function renderEnrollmentTrend(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
    var students = [420, 480, 550, 620, 710, 780, 850];

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Students Enrolled',
          data: students,
          borderColor: COLORS.gold,
          backgroundColor: hexToRgba(COLORS.gold, 0.1),
          borderWidth: 3,
          pointBackgroundColor: COLORS.gold,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            titleFont: { weight: '700' },
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor() }
          },
          y: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor() },
            beginAtZero: false
          }
        }
      }
    });
  }

  /* 2. Subject Distribution — Doughnut Chart */
  function renderSubjectDistribution(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var labels = ['Science', 'Arts', 'Religious', 'Language', 'Others'];
    var data = [30, 15, 20, 25, 10];
    var colors = [COLORS.green, COLORS.gold, COLORS.emerald, COLORS.blue, COLORS.purple];

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: isDarkMode() ? '#1e293b' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 20, font: { size: 12 } }
          },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                return ctx.label + ': ' + ctx.parsed + '%';
              }
            }
          }
        }
      }
    });
  }

  /* 3. Teacher Experience — Horizontal Bar */
  function renderTeacherExperience(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (typeof TEACHERS === 'undefined') return;

    var names = TEACHERS.map(function (t) { return t.name; });
    var exps = TEACHERS.map(function (t) { return parseInt(t.experience) || 0; });

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Years of Experience',
          data: exps,
          backgroundColor: exps.map(function (e) {
            if (e >= 15) return COLORS.gold;
            if (e >= 10) return COLORS.green;
            return COLORS.blue;
          }),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 24
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) { return ctx.parsed.x + ' years'; }
            }
          }
        },
        scales: {
          x: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor() }
          },
          y: {
            grid: { display: false },
            ticks: { color: getTextColor(), font: { weight: '600' } }
          }
        }
      }
    });
  }

  /* 4. Class-wise Students — Bar Chart */
  function renderClassStrength(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var classes = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    var counts = [45, 52, 68, 75, 80, 82, 78, 74, 65, 58, 48, 45];
    var colors = classes.map(function (_, i) {
      return i < 4 ? COLORS.emerald : (i < 8 ? COLORS.blue : COLORS.gold);
    });

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: classes.map(function (c) { return 'Class ' + c; }),
        datasets: [{
          label: 'Students',
          data: counts,
          backgroundColor: colors.map(function (c) { return hexToRgba(c, 0.75); }),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function (ctx) { return ctx.parsed.y + ' students'; }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: getMutedColor(), font: { size: 11 } }
          },
          y: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor() },
            beginAtZero: true
          }
        }
      }
    });
  }

  /* ══════════════════════════════════════════════
     RESULTS PAGE CHARTS
  ══════════════════════════════════════════════ */

  /* 5. Exam Performance — Grouped Bar */
  function renderExamPerformance(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var subjects = ['Math', 'English', 'Urdu', 'Physics', 'Chem', 'Bio', 'CS', 'PakSt'];
    var firstTerm = [78, 72, 80, 68, 65, 70, 82, 75];
    var secondTerm = [82, 78, 85, 74, 72, 76, 88, 80];

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: subjects,
        datasets: [
          {
            label: '1st Term',
            data: firstTerm,
            backgroundColor: hexToRgba(COLORS.blue, 0.7),
            borderColor: COLORS.blue,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          },
          {
            label: '2nd Term',
            data: secondTerm,
            backgroundColor: hexToRgba(COLORS.gold, 0.7),
            borderColor: COLORS.gold,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '%'; }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: getMutedColor() }
          },
          y: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor(), callback: function (v) { return v + '%'; } },
            beginAtZero: false,
            min: 40,
            max: 100
          }
        }
      }
    });
  }

  /* 6. Grade Distribution — Pie */
  function renderGradeDistribution(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var grades = ['A+ (90%+)', 'A (80-89%)', 'B (70-79%)', 'C (60-69%)', 'D (50-59%)', 'F (<50%)'];
    var counts = [85, 160, 220, 180, 120, 85];
    var colors = [COLORS.emerald, COLORS.blue, COLORS.gold, COLORS.amber, COLORS.orange, COLORS.rose];

    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: grades,
        datasets: [{
          data: counts,
          backgroundColor: colors,
          borderColor: isDarkMode() ? '#1e293b' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { size: 12 } }
          },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                var pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ctx.label + ': ' + ctx.parsed + ' students (' + pct + '%)';
              }
            }
          }
        }
      }
    });
  }

  /* 7. Subject Averages — Radar Chart */
  function renderSubjectAverages(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var subjects = ['Math', 'English', 'Urdu', 'Physics', 'Chemistry', 'Biology', 'Computer', 'Islamiyat'];
    var averages = [76, 72, 82, 68, 70, 74, 85, 80];
    var toppers = [92, 88, 95, 86, 84, 90, 96, 94];

    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: subjects,
        datasets: [
          {
            label: 'Class Average',
            data: averages,
            backgroundColor: hexToRgba(COLORS.green, 0.15),
            borderColor: COLORS.green,
            borderWidth: 2,
            pointBackgroundColor: COLORS.green,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
          },
          {
            label: 'Top Performers',
            data: toppers,
            backgroundColor: hexToRgba(COLORS.gold, 0.15),
            borderColor: COLORS.gold,
            borderWidth: 2,
            pointBackgroundColor: COLORS.gold,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
          }
        ]
      },
      options: {
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.r + '%'; }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: false,
            min: 40,
            max: 100,
            grid: { color: getGridColor() },
            angleLines: { color: getGridColor() },
            pointLabels: { color: getTextColor(), font: { size: 12, weight: '600' } },
            ticks: { color: getMutedColor(), backdropColor: 'transparent', stepSize: 10 }
          }
        }
      }
    });
  }

  /* 8. Yearly Improvement — Line Chart */
  function renderYearlyImprovement(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    var passRate = [72, 75, 78, 82, 85, 88];
    var avgScore = [62, 65, 68, 71, 74, 76];

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Pass Rate (%)',
            data: passRate,
            borderColor: COLORS.emerald,
            backgroundColor: hexToRgba(COLORS.emerald, 0.1),
            borderWidth: 3,
            pointBackgroundColor: COLORS.emerald,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Average Score (%)',
            data: avgScore,
            borderColor: COLORS.purple,
            backgroundColor: hexToRgba(COLORS.purple, 0.1),
            borderWidth: 3,
            pointBackgroundColor: COLORS.purple,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '%'; }
            }
          }
        },
        scales: {
          x: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor() }
          },
          y: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor(), callback: function (v) { return v + '%'; } },
            min: 50,
            max: 100
          }
        }
      }
    });
  }

  /* 9. Gender Distribution — Doughnut */
  function renderGenderDistribution(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Male Students', 'Female Students'],
        datasets: [{
          data: [460, 390],
          backgroundColor: [COLORS.blue, COLORS.pink],
          borderColor: isDarkMode() ? '#1e293b' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        cutout: '55%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 20, font: { size: 13 } }
          },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                var pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ctx.label + ': ' + ctx.parsed + ' (' + pct + '%)';
              }
            }
          }
        }
      }
    });
  }

  /* 10. Top Performers — Horizontal Bar */
  function renderTopPerformers(canvasId) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var students = ['Ahmed R.', 'Fatima K.', 'Bilal T.', 'Sara W.', 'Zainab M.', 'Hassan J.', 'Ayesha S.', 'Omar F.'];
    var scores = [94, 92, 91, 89, 88, 87, 86, 85];

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: students,
        datasets: [{
          label: 'Score %',
          data: scores,
          backgroundColor: scores.map(function (s, i) {
            if (i < 2) return COLORS.gold;
            if (i < 5) return COLORS.green;
            return COLORS.blue;
          }),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 22
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDarkMode() ? '#1e293b' : '#0f2745',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) { return ctx.parsed.x + '%'; }
            }
          }
        },
        scales: {
          x: {
            grid: { color: getGridColor() },
            ticks: { color: getMutedColor(), callback: function (v) { return v + '%'; } },
            min: 60,
            max: 100
          },
          y: {
            grid: { display: false },
            ticks: { color: getTextColor(), font: { weight: '600' } }
          }
        }
      }
    });
  }

  /* ══════════════════════════════════════════════
     INITIALIZATION
  ══════════════════════════════════════════════ */

  var chartInstances = {};

  function initHomeCharts() {
    if (typeof Chart === 'undefined') return;
    setDefaults();
    chartInstances.enrollment = renderEnrollmentTrend('enrollmentChart');
    chartInstances.subjectDist = renderSubjectDistribution('subjectDistChart');
    chartInstances.teacherExp = renderTeacherExperience('teacherExpChart');
    chartInstances.classStrength = renderClassStrength('classStrengthChart');
  }

  function initResultsCharts() {
    if (typeof Chart === 'undefined') return;
    setDefaults();
    chartInstances.examPerf = renderExamPerformance('examPerformanceChart');
    chartInstances.gradeDist = renderGradeDistribution('gradeDistChart');
    chartInstances.subjectAvg = renderSubjectAverages('subjectAvgChart');
    chartInstances.yearlyImprove = renderYearlyImprovement('yearlyImproveChart');
    chartInstances.genderDist = renderGenderDistribution('genderDistChart');
    chartInstances.topPerformers = renderTopPerformers('topPerformersChart');
  }

  function destroyAll() {
    Object.keys(chartInstances).forEach(function (key) {
      if (chartInstances[key]) {
        chartInstances[key].destroy();
      }
    });
    chartInstances = {};
  }

  /* ── Dark mode re-render ── */
  function handleThemeChange() {
    destroyAll();
    if (document.getElementById('enrollmentChart')) {
      initHomeCharts();
    }
    if (document.getElementById('examPerformanceChart')) {
      initResultsCharts();
    }
  }

  /* ── Public API ── */
  return {
    initHomeCharts: initHomeCharts,
    initResultsCharts: initResultsCharts,
    destroyAll: destroyAll,
    handleThemeChange: handleThemeChange
  };

})();

/* ── Auto-init on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('enrollmentChart')) {
    ChartsApp.initHomeCharts();
  }
  if (document.getElementById('examPerformanceChart')) {
    ChartsApp.initResultsCharts();
  }

  /* Re-render charts on dark mode toggle */
  var themeToggle = document.getElementById('themeToggle');
  var darkToggle = document.getElementById('darkToggle');
  function onThemeToggle() {
    setTimeout(function () { ChartsApp.handleThemeChange(); }, 100);
  }
  if (themeToggle) themeToggle.addEventListener('click', onThemeToggle);
  if (darkToggle) darkToggle.addEventListener('click', onThemeToggle);
});
