/* main.js — render functions only, no scroll/navbar logic (features.js handles that) */

var animObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.animate-left,.animate-right,.animate-up,.animate-fadeup').forEach(function (el) {
  animObserver.observe(el);
});

function renderTeachers(containerId, limit) {
  var grid = document.getElementById(containerId);
  if (!grid || typeof TEACHERS === 'undefined') return;
  var list = (typeof limit === 'number' && limit > 0) ? TEACHERS.slice(0, limit) : TEACHERS;
  var base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  grid.innerHTML = list.map(function (t) {
    var badgeText = t.subjects.length > 2 ? t.subjects.length + ' Subjects' : t.experience.replace('Years', 'Yrs');
    return '<a href="' + base + 'teacher-detail.html?id=' + t.id + '" class="teacher-card animate-up" data-tooltip="View ' + t.name + ' Profile" data-tooltip-pos="top">'
      + '<div class="teacher-card-top"><div class="teacher-avatar">' + t.emoji + '</div>'
      + '<span class="badge badge-teacher">' + badgeText + '</span></div>'
      + '<div class="teacher-card-body">'
      + '<div class="teacher-name">' + t.name + '</div>'
      + '<p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.5rem;">' + t.qualification + ' · ' + t.experience + '</p>'
      + '<div class="teacher-subjects">' + t.subjects.map(function(s){ return '<span>'+s+'</span>'; }).join('') + '</div>'
      + '</div></a>';
  }).join('');
  grid.querySelectorAll('.animate-up').forEach(function (el) { animObserver.observe(el); });
}

function renderSubjects(containerId) {
  var grid = document.getElementById(containerId);
  if (!grid || typeof SUBJECTS === 'undefined') return;
  grid.innerHTML = SUBJECTS.map(function (s) {
    return '<div class="subject-card animate-up"><div class="subject-icon">' + s.icon + '</div><div class="subject-name">' + s.name + '</div></div>';
  }).join('');
  grid.querySelectorAll('.animate-up').forEach(function (el) { animObserver.observe(el); });
}

function renderNotices() {
  var board = document.getElementById('noticeBoard');
  if (!board || typeof NOTICES === 'undefined') return;
  board.innerHTML = NOTICES.map(function (n) {
    return '<div class="notice-item animate-up"><div class="notice-date">' + n.date + '</div>'
      + '<div class="notice-text"><h4>' + n.title + '</h4><p>' + n.text + '</p></div></div>';
  }).join('');
  board.querySelectorAll('.animate-up').forEach(function (el) { animObserver.observe(el); });
}

document.addEventListener('DOMContentLoaded', function () {
  /* teachersGrid is handled by features.js skeleton — do NOT touch it here */
  renderSubjects('subjectsGrid');
  renderNotices();
  renderTeachers('allTeachersGrid', 0);
  renderSubjects('allSubjectsGrid');
});

