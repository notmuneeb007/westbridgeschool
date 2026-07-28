/* ================================================
   features.js  |  Westbridge School
   Sab kuch yahan hai — koi conflict nahi
   ================================================ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     UTILITY: Toast / Snackbar
  ═══════════════════════════════════════════ */
  function showToast(msg, type, ms) {
    type = type || 'success';
    ms   = ms   || 3000;
    var container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var icons = {
      success: 'fa-check-circle',
      error:   'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info:    'fa-info-circle'
    };
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<i class="fas ' + (icons[type] || icons.success) + '"></i><span>' + msg + '</span>';
    container.appendChild(toast);
    var tid = setTimeout(kill, ms);
    toast.addEventListener('click', function () { clearTimeout(tid); kill(); });
    function kill() {
      toast.classList.add('hiding');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
    }
  }
  window.showToast = showToast;

  /* ═══════════════════════════════════════════
     UTILITY: Modal open / close
  ═══════════════════════════════════════════ */
  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) { m.classList.remove('open'); });
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = overlay.querySelector('input, select, textarea');
      if (first) first.focus();
    }, 150);
  }

  function closeModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ═══════════════════════════════════════════
     SIDEBAR toggle
  ═══════════════════════════════════════════ */
  function initSidebar() {
    var sidebar  = document.getElementById('sidebar');
    var content  = document.getElementById('mainContent');
    var overlay  = document.getElementById('sidebarOverlay');
    var topHdr   = document.getElementById('topHeader');
    var navBar   = document.getElementById('navbar');
    var hbg      = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    if (!sidebar) return;

    function isOpen() {
      return window.innerWidth <= 768
        ? sidebar.classList.contains('mobile-open')
        : !sidebar.classList.contains('collapsed');
    }

    function syncBars() {
      var w = sidebar.classList.contains('collapsed') ? '68px' : '260px';
      if (window.innerWidth <= 768) w = '0px';
      if (topHdr) topHdr.style.left = w;
      if (navBar) navBar.style.left  = w;
    }

    function openSidebar() {
      if (window.innerWidth <= 768) {
        sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('show');
        /* also show nav-links on mobile */
        if (navLinks) navLinks.classList.add('open');
      } else {
        sidebar.classList.remove('collapsed');
        if (content) content.classList.remove('sidebar-collapsed');
        localStorage.setItem('wb-sc', '0');
        syncBars();
      }
      if (hbg) hbg.classList.add('is-open');
    }

    function closeSidebar() {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('show');
        if (navLinks) navLinks.classList.remove('open');
      } else {
        sidebar.classList.add('collapsed');
        if (content) content.classList.add('sidebar-collapsed');
        localStorage.setItem('wb-sc', '1');
        syncBars();
      }
      if (hbg) hbg.classList.remove('is-open');
    }

    function toggle() { isOpen() ? closeSidebar() : openSidebar(); }

    if (hbg) hbg.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });

    if (overlay) overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen()) closeSidebar();
    });

    if (window.innerWidth > 768 && localStorage.getItem('wb-sc') === '1') {
      sidebar.classList.add('collapsed');
      if (content) content.classList.add('sidebar-collapsed');
      if (hbg) hbg.classList.remove('is-open');
    } else if (window.innerWidth > 768) {
      if (hbg) hbg.classList.add('is-open');
    }
    syncBars();
    window.addEventListener('resize', syncBars);

    /* sidebar quick-action links */
    var sbNotice = document.getElementById('sb-notice');
    var sbTt     = document.getElementById('sb-timetable');
    var sbCon    = document.getElementById('sb-contact');
    var sbAcad   = document.getElementById('sb-academics');
    if (sbNotice) sbNotice.addEventListener('click', function(e){ e.preventDefault(); var ns=document.querySelector('.notice-section'); if(ns) ns.scrollIntoView({behavior:'smooth'}); });
    if (sbTt)     sbTt.addEventListener('click',     function(e){ e.preventDefault(); showToast('Timetable coming soon! \uD83D\uDCC5','info'); });
    if (sbCon)    sbCon.addEventListener('click',    function(e){ e.preventDefault(); openCon(); });
    if (sbAcad)   sbAcad.addEventListener('click',   function(e){ e.preventDefault(); this.closest('.sidebar-dropdown').classList.toggle('open'); });
  }

  /* ═══════════════════════════════════════════
     DARK MODE
  ═══════════════════════════════════════════ */
  function initDarkMode() {
    var btn = document.getElementById('darkToggle');
    var themeBtn = document.getElementById('themeToggle');
    if (!btn && !themeBtn) return;
    var saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') {
      document.body.classList.add('dark-mode');
      if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
      if (themeBtn) themeBtn.textContent = '☀️ Light';
    }
    function toggleDark() {
      var on = document.body.classList.toggle('dark-mode');
      var mode = on ? 'dark' : 'light';
      if (btn) btn.innerHTML = on ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      if (themeBtn) themeBtn.textContent = on ? '☀️ Light' : '🌙 Dark';
      localStorage.setItem('theme', mode);
    }
    if (btn) btn.addEventListener('click', toggleDark);
    if (themeBtn) themeBtn.addEventListener('click', toggleDark);
  }

  /* ═══════════════════════════════════════════
     ANIMATED COUNTERS
  ═══════════════════════════════════════════ */
  function initCounters() {
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      if (done) return;
      var visible = false;
      entries.forEach(function (e) { if (e.isIntersecting) visible = true; });
      if (!visible) return;
      done = true; io.disconnect();
      nums.forEach(function (el) {
        var target = parseInt(el.dataset.target) || 0;
        var suffix = target >= 100 ? '+' : '';
        var t0 = null;
        (function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 2000, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        })(performance.now());
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ═══════════════════════════════════════════
     MODALS — all button wiring (no onclick in HTML)
  ═══════════════════════════════════════════ */
  function initModals() {
    /* close on overlay background click */
    document.querySelectorAll('.modal-overlay').forEach(function (ov) {
      ov.addEventListener('click', function (e) {
        if (e.target === ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
      });
    });

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (m) { m.classList.remove('open'); });
        document.body.style.overflow = '';
      }
    });

    /* ── Admission modal (stepper) ── */
    function openAdm() {
      /* reset stepper */
      var modal = document.getElementById('admissionModal');
      if (!modal) return;
      modal.querySelectorAll('input, textarea, select').forEach(function(el) { el.value = ''; });
      goToStep(1);
      openModal('admissionModal');
    }
    function closeAdm() { closeModal('admissionModal'); }
    function goToStep(n) {
      var modal = document.getElementById('admissionModal');
      if (!modal) return;
      var panels = modal.querySelectorAll('.step-panel');
      var items  = modal.querySelectorAll('.step-item');
      panels.forEach(function(p) { p.classList.remove('active'); });
      items.forEach(function(it, i) {
        it.classList.remove('active', 'completed');
        if (i + 1 < n) it.classList.add('completed');
        if (i + 1 === n) it.classList.add('active');
      });
      var activePanel = modal.querySelector('.step-panel[data-step="' + n + '"]');
      if (activePanel) activePanel.classList.add('active');
      modal.querySelector('.step-buttons').dataset.step = n;
      /* show/hide buttons */
      var prevBtn  = document.getElementById('admPrevBtn');
      var nextBtn  = document.getElementById('admNextBtn');
      var subBtn   = document.getElementById('submitAdmModal');
      if (prevBtn) prevBtn.style.display = n === 1 ? 'none' : 'inline-flex';
      if (nextBtn) nextBtn.style.display = n === 3 ? 'none' : 'inline-flex';
      if (subBtn)  subBtn.style.display  = n === 3 ? 'inline-flex' : 'none';
      /* update review summary on step 3 */
      if (n === 3) updateReview();
    }
    function updateReview() {
      var modal = document.getElementById('admissionModal');
      if (!modal) return;
      function v(id) {
        if (id === 'admGender') {
          var checked = document.querySelector('input[name="admGenderRadio"]:checked');
          return checked ? checked.value : '—';
        }
        var el = document.getElementById(id);
        return el ? el.value || '—' : '—';
      }
      var map = {
        rStudent: 'admName', rDob: 'admDob', rGender: 'admGender', rClass: 'admClass',
        rParent: 'admParent', rPhone: 'admPhone', rEmail: 'admEmail', rAddress: 'admAddress'
      };
      for (var key in map) {
        var span = document.getElementById(key);
        if (span) span.textContent = v(map[key]);
      }
    }
    function nextStep() {
      var modal = document.getElementById('admissionModal');
      if (!modal) return;
      var cur = parseInt(modal.querySelector('.step-buttons').dataset.step) || 1;
      if (!validateStep(cur)) return;
      goToStep(cur + 1);
    }
    function prevStep() {
      var modal = document.getElementById('admissionModal');
      if (!modal) return;
      var cur = parseInt(modal.querySelector('.step-buttons').dataset.step) || 1;
      if (cur > 1) goToStep(cur - 1);
    }
    function validateStep(n) {
      var modal = document.getElementById('admissionModal');
      if (!modal) return false;
      var fields = modal.querySelectorAll('.step-panel[data-step="' + n + '"] [required]');
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].value.trim()) {
          fields[i].focus();
          fields[i].style.borderColor = '#dc2626';
          setTimeout(function(el) { el.style.borderColor = ''; }, 2000, fields[i]);
          showToast('Please fill all required fields', 'warning');
          return false;
        }
      }
      return true;
    }
    function submitAdm() {
      var modal = document.getElementById('admissionModal');
      if (!modal) return;
      if (!validateStep(3)) return;
      /* collect all data */
      var data = {
        student:   document.getElementById('admName')       ? document.getElementById('admName').value.trim() : '',
        dob:       document.getElementById('admDob')        ? document.getElementById('admDob').value : '',
        gender:    (document.querySelector('input[name="admGenderRadio"]:checked') || {}).value || '',
        class:     document.getElementById('admClass')      ? document.getElementById('admClass').value : '',
        parent:    document.getElementById('admParent')     ? document.getElementById('admParent').value.trim() : '',
        phone:     document.getElementById('admPhone')      ? document.getElementById('admPhone').value.trim() : '',
        email:     document.getElementById('admEmail')      ? document.getElementById('admEmail').value.trim() : '',
        address:   document.getElementById('admAddress')    ? document.getElementById('admAddress').value.trim() : ''
      };
      if (!data.student || !data.parent || !data.phone || !data.class) {
        showToast('Please fill all required fields', 'warning'); return;
      }
      modal.querySelectorAll('input, textarea, select').forEach(function(el) {
        if (el.type === 'radio') el.checked = false;
        else el.value = '';
      });
      goToStep(1);
      closeAdm();
      showToast('Application submitted! We will contact you soon. ✅', 'success', 4000);
    }

    /* hero Apply Now */
    var heroBtn = document.getElementById('hero-apply-btn');
    if (heroBtn) heroBtn.addEventListener('click', openAdm);

    /* admission section Apply Now */
    var admBtn = document.getElementById('adm-apply-btn');
    if (admBtn) admBtn.addEventListener('click', openAdm);

    /* quick registration form submit */
    var qrBtn = document.getElementById('quick-reg-btn');
    if (qrBtn) qrBtn.addEventListener('click', function() {
      var n  = document.getElementById('sName');
      var p  = document.getElementById('sParent');
      var ph = document.getElementById('sPhone');
      var cl = document.getElementById('sClass');
      if (!n||!p||!ph||!cl) return;
      if (!n.value.trim()||!p.value.trim()||!ph.value.trim()||!cl.value) {
        showToast('Tamam fields puri karen!', 'warning'); return;
      }
      [n,p,ph,cl].forEach(function(i){ i.value=''; });
      showToast('Registration ho gai! Hum jald contact karengy. ✅', 'success', 4000);
    });

    /* modal close button */
    var ca = document.getElementById('closeAdmModal');
    if (ca) ca.addEventListener('click', closeAdm);
    /* stepper buttons — listen globally via click delegation inside modal */
    var admModal = document.getElementById('admissionModal');
    if (admModal) {
      admModal.addEventListener('click', function(e) {
        if (e.target.id === 'admNextBtn' || e.target.closest('#admNextBtn')) nextStep();
        if (e.target.id === 'admPrevBtn' || e.target.closest('#admPrevBtn')) prevStep();
        if (e.target.id === 'submitAdmModal' || e.target.closest('#submitAdmModal')) submitAdm();
      });
    }

    /* ── Contact modal ── */
    function openCon() { openModal('contactModal'); }
    function closeCon() { closeModal('contactModal'); }
    function submitCon() {
      var n = document.getElementById('cName');
      var e = document.getElementById('cEmail');
      var p = document.getElementById('cPhone');
      var m = document.getElementById('cMsg');
      var rich = document.getElementById('cRichContent');
      if (!n) return;
      var msg = '';
      if (m && m.value.trim()) msg = m.value.trim();
      else if (rich && rich.textContent.trim()) msg = rich.textContent.trim();
      if (!n.value.trim()||!msg) { showToast('Tamam fields puri karen!','warning'); return; }

      var btn = document.getElementById('submitContactModal');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: n.value.trim(),
          email: e ? e.value.trim() : '',
          phone: p ? p.value.trim() : '',
          subject: 'Quick Contact',
          message: msg
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          n.value = '';
          if (e) e.value = '';
          if (p) p.value = '';
          if (m) m.value = '';
          if (rich) rich.innerHTML = '';
          closeCon();
          showToast('Message bhej diya! Jald jawab milega. 📨', 'success', 3500);
        } else {
          showToast(data.message || 'Failed to send', 'error');
        }
      })
      .catch(function(err) {
        showToast('Network error. Please try again.', 'error');
      })
      .finally(function() {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
      });
    }
    var cc = document.getElementById('closeContactModal'); if(cc) cc.addEventListener('click', closeCon);
    var xc = document.getElementById('cancelContactModal');if(xc) xc.addEventListener('click', closeCon);
    var sc = document.getElementById('submitContactModal');if(sc) sc.addEventListener('click', submitCon);

    /* quick links & navbar dropdown items */
    var qlAdm = document.getElementById('ql-admission');  if(qlAdm)  qlAdm.addEventListener('click',  function(e){ e.preventDefault(); openAdm(); });
    var ddAdm = document.getElementById('dd-admission');  if(ddAdm)  ddAdm.addEventListener('click',  function(e){ e.preventDefault(); openAdm(); });
    var ddCon = document.getElementById('dd-contact');    if(ddCon)  ddCon.addEventListener('click',   function(e){ e.preventDefault(); openCon(); });
    var ddTt  = document.getElementById('dd-timetable'); if(ddTt)   ddTt.addEventListener('click',    function(e){ e.preventDefault(); showToast('Timetable coming soon! 📅','info'); });
  }

  /* ═══════════════════════════════════════════
     DROPDOWNS
  ═══════════════════════════════════════════ */
  function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(function (dd) {
      var tog = dd.querySelector('.dropdown-toggle');
      if (!tog) return;
      tog.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        if (!wasOpen) dd.classList.add('open');
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    });
  }

  /* ═══════════════════════════════════════════
     SKELETON LOADING  (teachers grid)
  ═══════════════════════════════════════════ */
  function initSkeleton() {
    var grid = document.getElementById('teachersGrid');
    if (!grid) return;

    /* index.html uses infinite scroll — no skeleton needed there */
    if (!grid.closest('.slide')) return;

    /* show 4 skeleton cards */
    var skelHtml = '';
    for (var i = 0; i < 4; i++) {
      skelHtml += '<div class="skeleton-card">'
        + '<div class="skeleton-card-top"><div class="skeleton" style="height:100%;border-radius:0;"></div></div>'
        + '<div class="skeleton-card-body">'
        + '<div class="skeleton skeleton-line medium" style="margin-bottom:8px;"></div>'
        + '<div class="skeleton skeleton-line short"  style="margin-bottom:8px;"></div>'
        + '<div class="skeleton skeleton-line full"></div>'
        + '</div></div>';
    }
    grid.innerHTML = skelHtml;

    /* replace with real content after 1.6 s */
    setTimeout(function () {
      /* index.html: infinite scroll handles teachers grid — only run on pages with slide wrapper */
      if (grid.closest('.slide')) {
        if (typeof renderTeachers === 'function') renderTeachers('teachersGrid', 0);
        initSlide('teachersGrid', 'teachersDots');
      } else {
        /* clear skeleton; infinite scroll will populate */
        grid.innerHTML = '';
      }
    }, 300);
  }

  /* ═══════════════════════════════════════════
     SPINNER UTILITY
  ═══════════════════════════════════════════ */
  function showSpinner(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    /* store original content so we can restore it */
    if (!el.dataset.spinnerContent) el.dataset.spinnerContent = el.innerHTML;
    el.innerHTML = '<div class="spinner-container" id="spinner-' + containerId + '">'
      + '<div class="spinner"></div>'
      + '<div class="spinner-text">Loading...</div>'
      + '</div>';
  }
  function hideSpinner(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var orig = el.dataset.spinnerContent;
    if (orig) { el.innerHTML = orig; el.dataset.spinnerContent = ''; }
  }

  function initSlide(trackId, dotsId) {
    var track = document.getElementById(trackId);
    var dotsContainer = document.getElementById(dotsId);
    if (!track || track.children.length === 0) return;

    var slide = track.parentElement;
    var step = slide.classList.contains('slide-half') ? 50 : 100;
    var idx = 0;
    var timer = null;

    function total() { return track.children.length - (step === 50 ? 1 : 0); }

    function go(i) {
      idx = i;
      if (idx >= total()) idx = 0;
      if (idx < 0) idx = total() - 1;
      track.style.transform = 'translateX(-' + (idx * step) + '%)';
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (var i = 0; i < total(); i++) {
        var dot = document.createElement('button');
        dot.className = 'slide-dot' + (i === idx ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', (function (n) { return function () { reset(); go(n); }; })(i));
        dotsContainer.appendChild(dot);
      }
    }

    function reset() {
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 2000);
    }

    var slideEl = track.parentElement;
    var navEl = slideEl.parentElement.querySelector('.slide-nav');
    var prevBtn = navEl ? navEl.querySelector('.slide-btn-prev') : null;
    var nextBtn = navEl ? navEl.querySelector('.slide-btn-next') : null;

    if (prevBtn) prevBtn.addEventListener('click', function () { reset(); go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { reset(); go(idx + 1); });

    if (navEl) {
      navEl.addEventListener('mouseenter', function () { clearInterval(timer); });
      navEl.addEventListener('mouseleave', reset);
    }

    reset();
  }

  /* ═══════════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHT
  ═══════════════════════════════════════════ */
  function initActiveLinks() {
    var cur = location.pathname.split('/').pop() || 'index.html';
    var hash = location.hash || '#home';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var f = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
      a.classList.toggle('active', f === cur);
    });
    document.querySelectorAll('.sidebar-link[href], .sidebar-sub-link[href]').forEach(function (a) {
      a.classList.remove('active');
      var h = a.getAttribute('href') || '';
      if (h === '#') return;
      var aHash = h.split('#')[1];
      if (aHash && '#' + aHash === hash) { a.classList.add('active'); return; }
      var f = h.split('/').pop() || 'index.html';
      a.classList.toggle('active', f === cur);
    });
  }

  /* ═══════════════════════════════════════════
     SCROLL: navbar & top-header hide/show
  ═══════════════════════════════════════════ */
  function initScroll() {
    var topHdr = document.getElementById('topHeader');
    var navBar = document.getElementById('navbar');
    var last   = 0;
    window.addEventListener('scroll', function () {
      var cur = window.scrollY;
      if (cur > 80 && cur > last) {
        if (topHdr) topHdr.classList.add('hidden');
        if (navBar) navBar.classList.add('top-hidden');
      } else {
        if (topHdr) topHdr.classList.remove('hidden');
        if (navBar) navBar.classList.remove('top-hidden');
      }
      if (navBar) navBar.classList.toggle('scrolled', cur > 60);
      last = cur;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     FAQ COLLAPSE
  ═══════════════════════════════════════════ */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (other) { other.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ═══════════════════════════════════════════
     TOOLTIP OVERFLOW PREVENTION
     Jab tooltip page se bahar ja raha ho to
     position change karta hai
  ═══════════════════════════════════════════ */
  function initTooltipPositioning() {
    var fixed = {};
    var measureEl = null;

    function getTooltipWidth(text) {
      if (!measureEl) {
        measureEl = document.createElement('span');
        measureEl.style.cssText = 'position:fixed;visibility:hidden;white-space:normal;word-wrap:break-word;overflow-wrap:break-word;font-size:0.78rem;font-weight:600;padding:6px 14px;max-width:min(320px,90vw);letter-spacing:0.02em;';
        document.body.appendChild(measureEl);
      }
      measureEl.textContent = text;
      var w = measureEl.offsetWidth;
      var h = measureEl.offsetHeight;
      return { width: w, height: h };
    }

    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-tooltip]');
      if (!el) return;
      var orig = el.getAttribute('data-tooltip-pos-orig');
      if (!orig) {
        orig = el.getAttribute('data-tooltip-pos') || 'top';
        el.setAttribute('data-tooltip-pos-orig', orig);
      }
      var rect = el.getBoundingClientRect();
      var pos = el.getAttribute('data-tooltip-pos') || 'top';
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var text = el.getAttribute('data-tooltip') || '';
      var tw = text ? getTooltipWidth(text) : { width: 0, height: 0 };
      var newPos = pos;
      var margin = 12;

      if (pos === 'top' || pos === 'bottom') {
        if (rect.top < 100 && pos === 'top') newPos = 'bottom';
        else if (vh - rect.bottom < 100 && pos === 'bottom') newPos = 'top';
        if (newPos === 'top' || newPos === 'bottom') {
          var halfW = tw.width / 2;
          if (rect.left + rect.width / 2 - halfW < margin) newPos = 'right';
          else if (rect.left + rect.width / 2 + halfW > vw - margin) newPos = 'left';
        }
      } else if (pos === 'left') {
        if (rect.left < tw.width + margin + 20) newPos = 'right';
      } else if (pos === 'right') {
        if (vw - rect.right < tw.width + margin + 20) newPos = 'left';
      }

      if (newPos !== pos) {
        el.setAttribute('data-tooltip-pos', newPos);
        fixed[el] = newPos;
      }
    }, true);

    document.addEventListener('mouseout', function (e) {
      var el = e.target.closest('[data-tooltip]');
      if (!el || !fixed[el]) return;
      el.setAttribute('data-tooltip-pos', el.getAttribute('data-tooltip-pos-orig') || 'top');
      delete fixed[el];
    }, true);
  }

  /* ═══════════════════════════════════════════
     AUTH SYSTEM  (login / register / avatar)
  ═══════════════════════════════════════════ */
  function initAuth() {
    var navAvatar   = document.getElementById('navAvatar');
    var avatarCircle= document.getElementById('avatarCircle');
    var avatarName  = document.getElementById('avatarName');
    var userDropdown= document.getElementById('userDropdown');

    /* ── modals ── */
    var authModal    = document.getElementById('authModal');
    var avatarModal  = document.getElementById('avatarModal');

    /* auth tabs */
    var tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        document.querySelectorAll('.auth-panel').forEach(function (p) { p.classList.remove('active'); });
        var panel = document.getElementById(t.dataset.panel + 'Panel');
        if (panel) panel.classList.add('active');
        document.getElementById('authModalTitle').textContent =
          t.dataset.panel === 'login' ? 'Login' : 'Register';
        document.querySelectorAll('.auth-error').forEach(function (e) { e.classList.remove('show'); });
      });
    });

    function loadUser() {
      try { return JSON.parse(localStorage.getItem('wb-user')); } catch(e) { return null; }
    }

    function saveUser(u) {
      localStorage.setItem('wb-user', JSON.stringify(u));
    }

    function getUsers() {
      try { return JSON.parse(localStorage.getItem('wb-users')) || []; } catch(e) { return []; }
    }

    function saveUsers(list) {
      localStorage.setItem('wb-users', JSON.stringify(list));
    }

    function getInitial(name) {
      return (name || 'U').charAt(0).toUpperCase();
    }

    function getAvatarUrl(user) {
      if (user && user.avatar) return user.avatar;
      return null;
    }

    function updateNav() {
      var u = loadUser();
      if (u && u.name) {
        var img = avatarCircle.querySelector('img');
        var icon = avatarCircle.querySelector('i');
        if (img) img.remove();
        avatarCircle.classList.remove('guest');
        var url = getAvatarUrl(u);
        if (url) {
          avatarCircle.innerHTML = '<img src="' + url + '" alt="Avatar"/>';
        } else {
          avatarCircle.innerHTML = '<span>' + getInitial(u.name) + '</span>';
        }
        avatarName.textContent = u.name;
        navAvatar.dataset.tooltip = 'Your Account';
      } else {
        var img = avatarCircle.querySelector('img');
        var span = avatarCircle.querySelector('span');
        if (img) img.remove();
        if (span && !span.closest('.auth-modal') && !span.closest('#avatarModal')) span.remove();
        avatarCircle.classList.add('guest');
        avatarCircle.innerHTML = '<i class="fas fa-user"></i>';
        avatarName.textContent = 'Guest';
        navAvatar.dataset.tooltip = 'Login / Register';
      }
    }

    /* open auth modal */
    function openAuth(panel) {
      closeModal('avatarModal');
      tabs.forEach(function (t) {
        t.classList.toggle('active', t.dataset.panel === panel);
      });
      document.querySelectorAll('.auth-panel').forEach(function (p) { p.classList.remove('active'); });
      var target = document.getElementById(panel + 'Panel');
      if (target) target.classList.add('active');
      document.getElementById('authModalTitle').textContent =
        panel === 'login' ? 'Login' : 'Register';
      document.querySelectorAll('.auth-error').forEach(function (e) { e.classList.remove('show'); });
      /* refresh captcha on open */
      var captchaRefresh = document.querySelector('#loginCaptcha .captcha-refresh');
      if (captchaRefresh) captchaRefresh.click();
      openModal('authModal');
    }

    /* click avatar */
    navAvatar.addEventListener('click', function (e) {
      var dd = userDropdown;
      if (loadUser()) {
        dd.classList.toggle('open');
      } else {
        openAuth('login');
      }
      e.stopPropagation();
    });

    /* close user dropdown on outside click */
    document.addEventListener('click', function () {
      userDropdown.classList.remove('open');
    });

    /* ── register ── */
    var regAvatarData = null;
    window.regPendingEmail = null;

    function showRegStep(n) {
      var panel = document.getElementById('registerPanel');
      if (!panel) return;
      panel.querySelectorAll('.step-panel').forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-step') == n); });
      panel.querySelectorAll('.step-item').forEach(function(i) { i.classList.toggle('active', i.getAttribute('data-step') == n); });
      var prevBtn = document.getElementById('regPrevBtn');
      var nextBtn = document.getElementById('regNextBtn');
      var subBtn = document.getElementById('registerBtn');
      var buttons = document.getElementById('regStepButtons');
      if (prevBtn) prevBtn.style.display = n === 1 ? 'none' : '';
      if (nextBtn) nextBtn.style.display = n === 2 ? 'none' : '';
      if (subBtn) subBtn.style.display = n === 2 ? '' : 'none';
      if (buttons) buttons.setAttribute('data-step', n);
    }

    function setRegAvatar(file) {
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        regAvatarData = ev.target.result;
        var preview = document.getElementById('regAvatarPreview');
        if (preview) preview.innerHTML = '<img src="' + regAvatarData + '" alt=""/>';
        if (avatarClear) avatarClear.style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    }

    var avatarInput = document.getElementById('regAvatarInput');
    var avatarClear = document.getElementById('regAvatarClear');
    var avatarPreview = document.getElementById('regAvatarPreview');

    if (avatarInput) {
      avatarInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (file) setRegAvatar(file);
      });
    }

    if (avatarClear) {
      avatarClear.addEventListener('click', function () {
        regAvatarData = null;
        if (avatarInput) avatarInput.value = '';
        var preview = document.getElementById('regAvatarPreview');
        var name = document.getElementById('regName');
        if (preview) preview.innerHTML = '<span id="regAvatarInitial">' + getInitial(name ? name.value.trim() : 'U') + '</span>';
        this.style.display = 'none';
      });
    }

    var regNameInput = document.getElementById('regName');
    if (regNameInput) {
      regNameInput.addEventListener('input', function () {
        if (!regAvatarData) {
          var preview = document.getElementById('regAvatarPreview');
          if (preview) preview.innerHTML = '<span id="regAvatarInitial">' + getInitial(this.value) + '</span>';
        }
      });
    }

    var regDropZone = document.getElementById('regAvatarDropZone');
    if (regDropZone) {
      regDropZone.addEventListener('dragover', function (e) { e.preventDefault(); this.classList.add('dragover'); });
      regDropZone.addEventListener('dragleave', function () { this.classList.remove('dragover'); });
      regDropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
        var file = (e.dataTransfer || {}).files && e.dataTransfer.files[0];
        if (file) setRegAvatar(file);
      });
      regDropZone.addEventListener('click', function () { document.getElementById('regAvatarInput').click(); });
    }

    document.getElementById('registerBtn').addEventListener('click', function () {
      var err = document.getElementById('registerError');
      var otpInput = document.getElementById('regOtpValue');
      var otp = otpInput ? otpInput.value.trim() : '';

      if (!otp || otp.length !== 6) {
        if (err) { err.textContent = 'Please enter the 6-digit verification code'; err.classList.add('show'); }
        return;
      }
      if (err) err.classList.remove('show');

      var btn = document.getElementById('registerBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

      fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: window.regPendingEmail, otp: otp })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> &nbsp; Verify & Complete';
        if (data.success) {
          saveUser(data.user);
          window.regPendingEmail = null;
          regAvatarData = null;
          var avInp = document.getElementById('regAvatarInput');
          var avClr = document.getElementById('regAvatarClear');
          if (avInp) avInp.value = '';
          if (avClr) avClr.style.display = 'none';
          document.querySelectorAll('#registerPanel input[type="text"], #registerPanel input[type="email"], #registerPanel input[type="password"]').forEach(function(el) { el.value = ''; });
          document.querySelectorAll('#regOtpWrapper .otp-input').forEach(function(el) { el.value = ''; el.classList.remove('filled'); });
          closeModal('authModal');
          updateNav();
          showToast('Welcome, ' + data.user.name + '! Account verified. ✅', 'success');
        } else {
          if (err) { err.textContent = data.message || 'Invalid code'; err.classList.add('show'); }
        }
      })
      .catch(function() {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> &nbsp; Verify & Complete';
        if (err) { err.textContent = 'Network error. Please try again.'; err.classList.add('show'); }
      });
    });

    /* ── login ── */
    document.getElementById('loginBtn').addEventListener('click', function () {
      var emailEl = document.getElementById('loginEmail');
      var passEl = document.getElementById('loginPassword');
      var err = document.getElementById('loginError');
      var email = emailEl ? emailEl.value.trim() : '';
      var pass = passEl ? passEl.value.trim() : '';

      if (!email || !pass) {
        if (err) { err.textContent = 'Please enter email and password'; err.classList.add('show'); }
        return;
      }

      /* captcha validation */
      var captchaWrapper = document.getElementById('loginCaptcha');
      if (captchaWrapper) {
        var challenge = captchaWrapper.querySelector('.captcha-challenge');
        var captchaInput = captchaWrapper.querySelector('.captcha-input');
        var answer = challenge ? parseInt(challenge.dataset.answer) : null;
        var userAns = captchaInput ? parseInt(captchaInput.value.trim()) : null;
        if (answer === null || isNaN(answer) || userAns !== answer) {
          if (err) { err.textContent = 'Incorrect captcha result'; err.classList.add('show'); }
          var refreshBtn = captchaWrapper.querySelector('.captcha-refresh');
          if (refreshBtn) refreshBtn.click();
          if (captchaInput) captchaInput.value = '';
          return;
        }
      }

      var btn = document.getElementById('loginBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pass })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> &nbsp; Login';
        if (data.success) {
          saveUser(data.user);
          if (err) err.classList.remove('show');
          if (emailEl) emailEl.value = '';
          if (passEl) passEl.value = '';
          closeModal('authModal');
          updateNav();
          showToast('Welcome back, ' + data.user.name + '! 👋', 'success');
        } else if (data.needsVerification) {
          window.regPendingEmail = data.email;
          if (err) err.classList.remove('show');
          tabs.forEach(function (t) { t.classList.remove('active'); });
          document.querySelectorAll('.auth-panel').forEach(function (p) { p.classList.remove('active'); });
          var regTab = document.querySelector('.auth-tab[data-panel="register"]');
          if (regTab) regTab.classList.add('active');
          var regPanel = document.getElementById('registerPanel');
          if (regPanel) regPanel.classList.add('active');
          document.getElementById('authModalTitle').textContent = 'Register';
          showToast(data.message, 'info', 4000);
          showRegStep(2);
        } else {
          if (err) { err.textContent = data.message || 'Invalid email or password'; err.classList.add('show'); }
        }
      })
      .catch(function() {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> &nbsp; Login';
        if (err) { err.textContent = 'Network error. Please try again.'; err.classList.add('show'); }
      });
    });

    /* ── logout ── */
    document.getElementById('ud-logout').addEventListener('click', function () {
      userDropdown.classList.remove('open');
      openModal('logoutConfirmModal');
    });

    document.getElementById('confirmLogoutBtn').addEventListener('click', function () {
      localStorage.removeItem('wb-user');
      closeModal('logoutConfirmModal');
      updateNav();
      showToast('Logged out successfully', 'info');
    });

    document.getElementById('cancelLogoutBtn').addEventListener('click', function () {
      closeModal('logoutConfirmModal');
    });

    document.getElementById('closeLogoutModal').addEventListener('click', function () {
      closeModal('logoutConfirmModal');
    });

    /* ── change avatar ── */
    document.getElementById('ud-avatar').addEventListener('click', function () {
      userDropdown.classList.remove('open');
      var u = loadUser();
      if (!u) { showToast('Please login first', 'warning'); return; }
      var preview = document.getElementById('changeAvatarPreview');
      var url = getAvatarUrl(u);
      if (url) {
        preview.innerHTML = '<img src="' + url + '" alt=""/>';
      } else {
        preview.innerHTML = '<span>' + getInitial(u.name) + '</span>';
      }
      document.getElementById('resetAvatarBtn').style.display = u.avatar ? 'block' : 'none';
      openModal('avatarModal');
    });

    document.getElementById('changeAvatarInput').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var dataUrl = ev.target.result;
        var u = loadUser();
        if (!u) return;
        u.avatar = dataUrl;
        saveUser(u);
        fetch('/api/auth/update-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: u.email, avatar: dataUrl })
        }).catch(function() {});
        document.getElementById('changeAvatarPreview').innerHTML = '<img src="' + dataUrl + '" alt=""/>';
        document.getElementById('resetAvatarBtn').style.display = 'block';
        updateNav();
        showToast('Avatar updated! 📸', 'success');
      };
      reader.readAsDataURL(file);
    });

    /* ── drag & drop for avatar ── */
    var dropZone = document.getElementById('avatarDropZone');
    if (dropZone) {
      dropZone.addEventListener('dragover', function (e) { e.preventDefault(); this.classList.add('dragover'); });
      dropZone.addEventListener('dragleave', function () { this.classList.remove('dragover'); });
      dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
        var file = (e.dataTransfer || {}).files && e.dataTransfer.files[0];
        if (!file) return;
        document.getElementById('changeAvatarInput').files = e.dataTransfer.files;
        var evt = new Event('change', { bubbles: true });
        document.getElementById('changeAvatarInput').dispatchEvent(evt);
      });
      dropZone.addEventListener('click', function () { document.getElementById('changeAvatarInput').click(); });
    }

    document.getElementById('resetAvatarBtn').addEventListener('click', function () {
      var u = loadUser();
      if (!u) return;
      u.avatar = null;
      saveUser(u);
      fetch('/api/auth/update-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: u.email, avatar: null })
      }).catch(function() {});
      document.getElementById('changeAvatarPreview').innerHTML = '<span>' + getInitial(u.name) + '</span>';
      document.getElementById('resetAvatarBtn').style.display = 'none';
      updateNav();
      showToast('Avatar reset to initial', 'info');
    });

    /* close modals */
    document.getElementById('closeAuthModal').addEventListener('click', function () { closeModal('authModal'); });
    document.getElementById('closeAvatarModal').addEventListener('click', function () { closeModal('avatarModal'); });

    /* ── profile (just shows user info) ── */
    document.getElementById('ud-profile').addEventListener('click', function () {
      userDropdown.classList.remove('open');
      var u = loadUser();
      if (!u) { showToast('Please login first', 'warning'); return; }
      showToast('Logged in as ' + u.name + ' (' + u.email + ')', 'info', 4000);
    });

    updateNav();
  }

  /* ═══════════════════════════════════════════
     BOOT  —  DOMContentLoaded
  ═══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    initDarkMode();
    initCounters();
    initDropdowns();
    initModals();
    initSkeleton();
    initActiveLinks();
    initScroll();
    initFAQ();
    initAuth();
    initTooltipPositioning();
    initSlide('subjectsGrid', 'subjectsDots');
  });

})();
