/* ================================================
   new-features.js  |  Westbridge School
   All missing interactive features
   ================================================ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
      SCROLL PROGRESS INDICATOR
   ═══════════════════════════════════════════ */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var total = h.scrollHeight - h.clientHeight;
      bar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     HERO PARALLAX
  ═══════════════════════════════════════════ */
  function initParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          hero.style.backgroundPositionY = (y * -0.35) + 'px';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     LIGHTBOX
  ═══════════════════════════════════════════ */
  function initLightbox() {
    var overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;
    var img = overlay.querySelector('.lightbox-content img');
    var caption = overlay.querySelector('.lightbox-caption');
    var close = overlay.querySelector('.lightbox-close');
    var prevBtn = overlay.querySelector('.lightbox-prev');
    var nextBtn = overlay.querySelector('.lightbox-next');
    var items = [];
    var currentIdx = 0;

    function open(idx) {
      if (!items.length || idx < 0 || idx >= items.length) return;
      currentIdx = idx;
      var item = items[idx];
      if (item.tagName === 'IMG') {
        img.src = item.src;
        caption.textContent = item.alt || '';
      } else {
        img.src = item.dataset.src || item.querySelector('img')?.src || '';
        caption.textContent = item.dataset.caption || item.querySelector('.gallery-card-body h4')?.textContent || '';
      }
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      updateNav();
    }

    function updateNav() {
      if (prevBtn) prevBtn.style.display = currentIdx > 0 ? 'flex' : 'none';
      if (nextBtn) nextBtn.style.display = currentIdx < items.length - 1 ? 'flex' : 'none';
    }

    function next() { if (currentIdx < items.length - 1) open(currentIdx + 1); }
    function prev() { if (currentIdx > 0) open(currentIdx - 1); }

    if (close) close.addEventListener('click', function () { overlay.classList.remove('open'); document.body.style.overflow = ''; });
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
    });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') { overlay.classList.remove('open'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    var galleryItems = document.querySelectorAll('[data-lightbox]');
    galleryItems.forEach(function (el, i) {
      items.push(el);
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open(i);
      });
    });
  }

  /* ═══════════════════════════════════════════
     FLOATING ACTION BUTTON
  ═══════════════════════════════════════════ */
  function initFAB() {
    var fab = document.getElementById('fabBtn');
    if (!fab) return;
    fab.addEventListener('click', function () {
      var admModal = document.getElementById('admissionModal');
      if (admModal) admModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  /* ═══════════════════════════════════════════
     SEARCH WITH AUTOCOMPLETE
  ═══════════════════════════════════════════ */
  function initSearch() {
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    if (!input || !results) return;

    var allPages = [
      { title: 'Home', url: 'index.html', icon: 'fa-home' },
      { title: 'About Us', url: 'pages/about.html', icon: 'fa-school' },
      { title: 'Teachers', url: 'pages/teachers.html', icon: 'fa-chalkboard-teacher' },
      { title: 'Subjects', url: 'pages/subjects.html', icon: 'fa-book-open' },
      { title: 'Contact', url: 'pages/contact.html', icon: 'fa-envelope' },

      { title: 'Results', url: 'pages/results.html', icon: 'fa-trophy' },
      { title: 'Admission', url: 'pages/admission.html', icon: 'fa-user-graduate' },
    ];
    if (typeof TEACHERS !== 'undefined') {
      TEACHERS.forEach(function (t) {
        allPages.push({ title: t.name + ' - Teacher', url: 'pages/teacher-detail.html?id=' + t.id, icon: 'fa-chalkboard-teacher' });
      });
    }

    var selectedIdx = -1;

    function filter(query) {
      var q = query.toLowerCase().trim();
      if (!q) return [];
      return allPages.filter(function (p) {
        return p.title.toLowerCase().includes(q);
      }).slice(0, 8);
    }

    function render(matches) {
      if (!matches.length) { results.classList.remove('open'); return; }
      results.innerHTML = matches.map(function (m, i) {
        return '<div class="search-result-item" data-index="' + i + '" data-url="' + m.url + '">'
          + '<i class="fas ' + m.icon + '"></i> '
          + highlight(m.title, input.value)
          + '</div>';
      }).join('');
      results.classList.add('open');

      results.querySelectorAll('.search-result-item').forEach(function (el) {
        el.addEventListener('click', function () {
          var url = this.dataset.url;
          if (url) window.location.href = url;
        });
      });
    }

    function highlight(text, q) {
      if (!q) return escaped(text);
      var idx = text.toLowerCase().indexOf(q.toLowerCase());
      if (idx === -1) return escaped(text);
      return escaped(text.substring(0, idx)) + '<mark>' + escaped(text.substring(idx, idx + q.length)) + '</mark>' + escaped(text.substring(idx + q.length));
    }
    function escaped(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    input.addEventListener('input', function () {
      selectedIdx = -1;
      var matches = filter(this.value);
      render(matches);
    });

    input.addEventListener('keydown', function (e) {
      var items = results.querySelectorAll('.search-result-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedIdx < items.length - 1) selectedIdx++;
        updateActive(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIdx > 0) selectedIdx--;
        updateActive(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIdx >= 0 && items[selectedIdx]) {
          var url = items[selectedIdx].dataset.url;
          if (url) window.location.href = url;
        }
      } else if (e.key === 'Escape') {
        results.classList.remove('open');
      }
    });

    function updateActive(items) {
      items.forEach(function (el, i) { el.classList.toggle('active', i === selectedIdx); });
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrapper')) results.classList.remove('open');
    });
  }

  /* ═══════════════════════════════════════════
     PASSWORD TOGGLE & STRENGTH
  ═══════════════════════════════════════════ */
  function initPasswordFeatures() {
    document.querySelectorAll('.password-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = this.parentElement.querySelector('input');
        if (!input) return;
        var isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        this.innerHTML = isPass ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      });
    });

    document.querySelectorAll('[data-strength]').forEach(function (input) {
      var wrapper = input.closest('.password-wrapper') || input.parentElement;
      var indicator = wrapper.querySelector('.password-strength');
      var text = wrapper.querySelector('.password-strength-text');
      if (!indicator) return;

      input.addEventListener('input', function () {
        var val = this.value;
        var strength = 0;
        if (val.length >= 6) strength++;
        if (val.length >= 10) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        indicator.className = 'password-strength';
        text.className = 'password-strength-text';
        if (val.length === 0) {
          text.textContent = '';
          return;
        }
        if (strength <= 2) {
          indicator.classList.add('pw-weak');
          text.textContent = 'Weak';
          text.style.color = '#ef4444';
        } else if (strength <= 3) {
          indicator.classList.add('pw-medium');
          text.textContent = 'Medium';
          text.style.color = '#f59e0b';
        } else {
          indicator.classList.add('pw-strong');
          text.textContent = 'Strong';
          text.style.color = '#10b981';
        }
      });
    });
  }

  /* ═══════════════════════════════════════════
     OTP INPUT
  ═══════════════════════════════════════════ */
  function initOTP() {
    document.querySelectorAll('.otp-wrapper').forEach(function (wrapper) {
      var inputs = wrapper.querySelectorAll('.otp-input');
      inputs.forEach(function (input, idx) {
        input.addEventListener('input', function () {
          this.classList.toggle('filled', this.value.length > 0);
          if (this.value.length === 1 && idx < inputs.length - 1) {
            inputs[idx + 1].focus();
          }
        });
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !this.value && idx > 0) {
            inputs[idx - 1].focus();
          }
          if (e.key === 'ArrowLeft' && idx > 0) inputs[idx - 1].focus();
          if (e.key === 'ArrowRight' && idx < inputs.length - 1) inputs[idx + 1].focus();
        });
        input.addEventListener('paste', function (e) {
          e.preventDefault();
          var paste = (e.clipboardData || window.clipboardData).getData('text');
          var digits = paste.replace(/\D/g, '').split('');
          inputs.forEach(function (inp, i) {
            if (i < digits.length) {
              inp.value = digits[i];
              inp.classList.toggle('filled', true);
            }
          });
          if (digits.length < inputs.length) {
            inputs[digits.length].focus();
          } else {
            inputs[inputs.length - 1].focus();
          }
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     TAG INPUT (CHIPS)
  ═══════════════════════════════════════════ */
  function initTagInput() {
    document.querySelectorAll('.tag-input-wrapper').forEach(function (wrapper) {
      var input = wrapper.querySelector('.tag-input-native');
      var hiddenInput = wrapper.querySelector('input[type="hidden"]');
      var tags = [];

      function render() {
        wrapper.querySelectorAll('.tag-chip').forEach(function (c) { c.remove(); });
        tags.forEach(function (tag, i) {
          var chip = document.createElement('span');
          chip.className = 'tag-chip';
          chip.innerHTML = tag + ' <span class="tag-chip-remove" data-index="' + i + '">&times;</span>';
          wrapper.insertBefore(chip, input);
        });
        if (hiddenInput) hiddenInput.value = tags.join(',');
        input.value = '';
        input.focus();
      }

      input.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ',') && this.value.trim()) {
          e.preventDefault();
          var val = this.value.trim().replace(/,/g, '');
          if (val && tags.indexOf(val) === -1) {
            tags.push(val);
            render();
          }
        }
        if (e.key === 'Backspace' && !this.value && tags.length) {
          tags.pop();
          render();
        }
      });

      wrapper.addEventListener('click', function (e) {
        if (e.target.classList.contains('tag-chip-remove')) {
          var idx = parseInt(e.target.dataset.index);
          if (!isNaN(idx)) { tags.splice(idx, 1); render(); }
        } else {
          input.focus();
        }
      });
    });
  }

  /* ═══════════════════════════════════════════
     FILE UPLOAD WITH DRAG & DROP
  ═══════════════════════════════════════════ */
  function initFileUpload() {
    document.querySelectorAll('.file-drop-zone').forEach(function (zone) {
      var input = zone.querySelector('input[type="file"]');
      var list = zone.parentElement.querySelector('.file-list');
      var files = [];

      function updateUI() {
        if (!list) return;
        if (!files.length) { list.innerHTML = ''; return; }
        list.innerHTML = files.map(function (f, i) {
          var size = f.size > 1024 ? (f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : (f.size / 1024).toFixed(1) + ' KB') : f.size + ' B';
          return '<div class="file-item">'
            + '<span class="file-item-name"><i class="fas fa-file"></i> ' + esc(f.name) + '</span>'
            + '<span class="file-item-size">' + size + '</span>'
            + '<button class="file-item-remove" data-index="' + i + '"><i class="fas fa-times"></i></button>'
            + '</div>';
        }).join('');
        list.querySelectorAll('.file-item-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(this.dataset.index);
            if (!isNaN(idx)) { files.splice(idx, 1); updateUI(); }
          });
        });
      }
      function esc(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

      function addFiles(newFiles) {
        for (var i = 0; i < newFiles.length; i++) {
          if (files.length < 5) files.push(newFiles[i]);
        }
        updateUI();
        var dt = new DataTransfer();
        files.forEach(function (f) { dt.items.add(f); });
        if (input) input.files = dt.files;
      }

      if (input) {
        input.addEventListener('change', function () { addFiles(this.files); });
      }

      zone.addEventListener('click', function () { if (input) input.click(); });

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
        zone.addEventListener(evt, function (e) { e.preventDefault(); e.stopPropagation(); });
      });
      zone.addEventListener('dragenter', function () { zone.classList.add('dragover'); });
      zone.addEventListener('dragleave', function (e) {
        if (!zone.contains(e.relatedTarget)) zone.classList.remove('dragover');
      });
      zone.addEventListener('drop', function (e) {
        zone.classList.remove('dragover');
        addFiles(e.dataTransfer.files);
      });
    });
  }

  /* ═══════════════════════════════════════════
     RICH TEXT EDITOR (WYSIWYG)
  ═══════════════════════════════════════════ */
  function initRTE() {
    document.querySelectorAll('.rte-toolbar').forEach(function (toolbar) {
      var editor = toolbar.parentElement.querySelector('.rte-editor');
      if (!editor) return;
      var hiddenInput = toolbar.parentElement.querySelector('input[type="hidden"]');

      toolbar.querySelectorAll('button[data-cmd]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cmd = this.dataset.cmd;
          var val = this.dataset.value || null;
          editor.focus();
          if (cmd === 'insertHTML' && val) {
            document.execCommand('insertHTML', false, val);
          } else {
            document.execCommand(cmd, false, val);
          }
          updateHidden();
        });
      });

      editor.addEventListener('input', updateHidden);
      editor.addEventListener('keyup', updateHidden);

      function updateHidden() { if (hiddenInput) hiddenInput.value = editor.innerHTML; }

      editor.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
      });
    });

    document.querySelectorAll('.rich-editor').forEach(function (container) {
      var toolbar = container.querySelector('.rich-toolbar');
      var editor = container.querySelector('.rich-editor-content');
      if (!toolbar || !editor) return;

      toolbar.querySelectorAll('button[data-cmd]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cmd = this.dataset.cmd;
          var val = this.dataset.value || null;
          editor.focus();
          if (cmd === 'insertHTML' && val) {
            document.execCommand('insertHTML', false, val);
          } else {
            document.execCommand(cmd, false, val);
          }
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     CAPTCHA
  ═══════════════════════════════════════════ */
  function initCaptcha() {
    document.querySelectorAll('.captcha-wrapper').forEach(function (wrapper) {
      var challengeEl = wrapper.querySelector('.captcha-challenge');
      var refreshBtn = wrapper.querySelector('.captcha-refresh');
      var hiddenInput = wrapper.querySelector('input[type="hidden"]');
      var checkbox = wrapper.querySelector('.captcha-checkbox input');

      function generate() {
        var a = Math.floor(Math.random() * 20) + 1;
        var b = Math.floor(Math.random() * 20) + 1;
        var ops = ['+', '-'];
        var op = ops[Math.floor(Math.random() * 2)];
        var result = op === '+' ? a + b : a - b;
        challengeEl.textContent = a + ' ' + op + ' ' + b + ' = ?';
        challengeEl.dataset.answer = result;
        if (hiddenInput) hiddenInput.value = '';
        if (checkbox) checkbox.checked = false;
      }

      if (refreshBtn) refreshBtn.addEventListener('click', generate);
      if (checkbox) {
        checkbox.addEventListener('change', function () {
          if (this.checked) {
            var answer = parseInt(challengeEl.dataset.answer);
            if (hiddenInput) hiddenInput.value = answer;
          } else {
            if (hiddenInput) hiddenInput.value = '';
          }
        });
      }

      generate();
    });
  }

  /* ═══════════════════════════════════════════
     DATE PICKER (simple)
  ═══════════════════════════════════════════ */
  function initDatePicker() {
    document.querySelectorAll('.date-picker-wrapper').forEach(function (wrapper) {
      var input = wrapper.querySelector('input');
      var popup = wrapper.querySelector('.date-picker-popup');
      if (!popup) return;

      var currentDate = new Date();
      var selectedDate = null;
      var viewMonth = currentDate.getMonth();
      var viewYear = currentDate.getFullYear();

      function build() {
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
        var firstDay = new Date(viewYear, viewMonth, 1).getDay();
        var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        var today = new Date();

        var html = '<div class="date-picker-header">'
          + '<button class="dp-prev"><i class="fas fa-chevron-left"></i></button>'
          + '<span class="date-picker-month">' + months[viewMonth] + ' ' + viewYear + '</span>'
          + '<button class="dp-next"><i class="fas fa-chevron-right"></i></button>'
          + '</div>'
          + '<div class="date-picker-grid">';
        days.forEach(function (d) { html += '<div class="date-picker-day-header">' + d + '</div>'; });
        for (var i = 0; i < firstDay; i++) {
          html += '<div></div>';
        }
        for (var d = 1; d <= daysInMonth; d++) {
          var isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          var isSelected = selectedDate && d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();
          var cls = 'date-picker-day';
          if (isToday) cls += ' today';
          if (isSelected) cls += ' selected';
          html += '<button class="' + cls + '" data-day="' + d + '">' + d + '</button>';
        }
        html += '</div>';
        popup.innerHTML = html;

        popup.querySelectorAll('.date-picker-day').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var day = parseInt(this.dataset.day);
            selectedDate = new Date(viewYear, viewMonth, day);
            input.value = (viewMonth + 1).toString().padStart(2,'0') + '/' + day.toString().padStart(2,'0') + '/' + viewYear;
            popup.classList.remove('open');
          });
        });
        popup.querySelector('.dp-prev').addEventListener('click', function () { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } build(); });
        popup.querySelector('.dp-next').addEventListener('click', function () { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } build(); });
      }

      input.addEventListener('focus', function () { build(); popup.classList.add('open'); });
      document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) popup.classList.remove('open');
      });
    });
  }

  /* ═══════════════════════════════════════════
     RANGE SLIDER
  ═══════════════════════════════════════════ */
  function initRangeSlider() {
    document.querySelectorAll('.range-slider').forEach(function (slider) {
      var valDisplay = slider.parentElement.querySelector('.range-value');
      if (!valDisplay) return;
      function update() { valDisplay.textContent = slider.value + (slider.dataset.suffix || ''); }
      slider.addEventListener('input', update);
      update();
    });
  }

  /* ═══════════════════════════════════════════
     COLOR PICKER
  ═══════════════════════════════════════════ */
  function initColorPicker() {
    document.querySelectorAll('.color-picker-wrapper').forEach(function (wrapper) {
      var input = wrapper.querySelector('input[type="color"]');
      var valueEl = wrapper.querySelector('.color-picker-value');
      var swatches = wrapper.querySelectorAll('.color-swatch');

      if (input && valueEl) {
        input.addEventListener('input', function () {
          valueEl.textContent = this.value;
        });
      }

      swatches.forEach(function (swatch) {
        swatch.addEventListener('click', function () {
          var color = this.dataset.color;
          swatches.forEach(function (s) { s.classList.remove('selected'); });
          this.classList.add('selected');
          if (input) input.value = color;
          if (valueEl) valueEl.textContent = color;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     PHONE INPUT WITH COUNTRY CODE
  ═══════════════════════════════════════════ */
  function initPhoneInput() {
    var countries = [
      { code: '+92', name: 'PK', flag: '🇵🇰' },
      { code: '+1', name: 'US', flag: '🇺🇸' },
      { code: '+44', name: 'UK', flag: '🇬🇧' },
      { code: '+91', name: 'IN', flag: '🇮🇳' },
      { code: '+971', name: 'AE', flag: '🇦🇪' },
      { code: '+966', name: 'SA', flag: '🇸🇦' },
      { code: '+93', name: 'AF', flag: '🇦🇫' },
      { code: '+86', name: 'CN', flag: '🇨🇳' },
      { code: '+49', name: 'DE', flag: '🇩🇪' },
      { code: '+61', name: 'AU', flag: '🇦🇺' },
    ];

    document.querySelectorAll('.phone-input-wrapper').forEach(function (wrapper) {
      var trigger = wrapper.querySelector('.phone-country-trigger');
      var dropdown = wrapper.querySelector('.phone-country-dropdown');
      var codeInput = wrapper.querySelector('input[name="country-code"]');
      var phoneInput = wrapper.querySelector('input[type="tel"]');

      if (!trigger || !dropdown) return;

      countries.forEach(function (c) {
        var opt = document.createElement('div');
        opt.className = 'phone-country-option';
        opt.innerHTML = '<span class="flag-icon">' + c.flag + '</span> ' + c.code + ' ' + c.name;
        opt.dataset.code = c.code;
        opt.dataset.flag = c.flag;
        opt.addEventListener('click', function () {
          trigger.innerHTML = '<span class="flag-icon">' + c.flag + '</span> ' + c.code + ' <i class="fas fa-chevron-down"></i>';
          dropdown.classList.remove('open');
          if (codeInput) codeInput.value = c.code;
          if (phoneInput) phoneInput.placeholder = c.code + ' 300 1234567';
        });
        dropdown.appendChild(opt);
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      document.addEventListener('click', function () { dropdown.classList.remove('open'); });
    });
  }

  /* ═══════════════════════════════════════════
     FORM AUTO-SAVE (localStorage)
  ═══════════════════════════════════════════ */
  function initFormAutoSave() {
    document.querySelectorAll('[data-autosave]').forEach(function (form) {
      var key = form.dataset.autosave;
      var indicator = form.querySelector('.auto-save-indicator');
      var timer = null;

      function save() {
        var data = {};
        form.querySelectorAll('input, textarea, select').forEach(function (el) {
          if (el.type !== 'password' && el.type !== 'file') {
            data[el.id || el.name] = el.value;
          }
        });
        try { localStorage.setItem('autosave-' + key, JSON.stringify(data)); } catch(e) {}
        if (indicator) {
          indicator.innerHTML = '<i class="fas fa-check-circle"></i> Auto-saved';
          indicator.className = 'auto-save-indicator saved';
        }
      }

      function load() {
        try {
          var raw = localStorage.getItem('autosave-' + key);
          if (!raw) return;
          var data = JSON.parse(raw);
          form.querySelectorAll('input, textarea, select').forEach(function (el) {
            var id = el.id || el.name;
            if (data[id] !== undefined && el.type !== 'password' && el.type !== 'file') {
              el.value = data[id];
            }
          });
        } catch(e) {}
      }

      load();

      form.addEventListener('input', function () {
        clearTimeout(timer);
        if (indicator) { indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; indicator.className = 'auto-save-indicator saving'; }
        timer = setTimeout(save, 1000);
      });

      form.addEventListener('submit', function () {
        try { localStorage.removeItem('autosave-' + key); } catch(e) {}
      });
    });
  }

  /* ═══════════════════════════════════════════
     CUSTOM SELECT
  ═══════════════════════════════════════════ */
  function initCustomSelect() {
    document.querySelectorAll('.custom-select-wrapper').forEach(function (wrapper) {
      var trigger = wrapper.querySelector('.custom-select-trigger');
      var dropdown = wrapper.querySelector('.custom-select-dropdown');
      var hiddenInput = wrapper.querySelector('input[type="hidden"]');
      if (!trigger || !dropdown) return;

      dropdown.querySelectorAll('.custom-select-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
          var val = this.dataset.value;
          var text = this.textContent;
          trigger.innerHTML = text + ' <i class="fas fa-chevron-down"></i>';
          if (hiddenInput) hiddenInput.value = val;
          dropdown.querySelectorAll('.selected').forEach(function (s) { s.classList.remove('selected'); });
          this.classList.add('selected');
          wrapper.classList.remove('open');
        });
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.custom-select-wrapper.open').forEach(function (w) {
          if (w !== wrapper) w.classList.remove('open');
        });
        wrapper.classList.toggle('open');
      });

      document.addEventListener('click', function () { wrapper.classList.remove('open'); });
    });
  }

  /* ═══════════════════════════════════════════
     CHECKBOX & RADIO STYLING (init)
  ═══════════════════════════════════════════ */
  function initStyledChecks() {
    /* Already handled by CSS — just ensure existing native inputs with .form-check work */
  }

  /* ═══════════════════════════════════════════
     KEYBOARD NAVIGATION ENHANCEMENTS
  ═══════════════════════════════════════════ */
  function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        var skipLink = document.querySelector('.skip-link');
        if (skipLink && document.activeElement === skipLink) {
          e.preventDefault();
          var target = document.querySelector(skipLink.getAttribute('href'));
          if (target) target.setAttribute('tabindex', '-1');
          if (target) target.focus();
        }
      }
    });

    document.querySelectorAll('[tabindex]:not(.skip-link)').forEach(function (el) {
      el.addEventListener('focus', function () {
        this.style.outline = '2px solid var(--gold)';
        this.style.outlineOffset = '2px';
      });
      el.addEventListener('blur', function () {
        this.style.outline = '';
      });
    });
  }

  /* ═══════════════════════════════════════════
     CUSTOM 404 PAGE TWEAKS
  ═══════════════════════════════════════════ */
  function init404() {
    /* Nothing needed beyond what's in the HTML */
  }

  /* ═══════════════════════════════════════════
     (removed: infinite scroll)
  ═══════════════════════════════════════════ */

  /* ═══════════════════════════════════════════
     PROGRESS BAR ANIMATION
  ═══════════════════════════════════════════ */
  function initProgressBars() {
    var bars = document.querySelectorAll('.progress-bar-fill[data-target]');
    if (!bars.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          bar.style.width = bar.dataset.target + '%';
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (bar) { obs.observe(bar); });
  }

  /* ═══════════════════════════════════════════
     INTERACTIVE STAR RATING
  ═══════════════════════════════════════════ */
  function initStarRating() {
    var wrappers = document.querySelectorAll('.star-rating-input');
    wrappers.forEach(function (wrapper) {
      var stars = wrapper.querySelectorAll('.star-rating-star');
      var input = wrapper.querySelector('.star-rating-value');
      stars.forEach(function (star) {
        star.addEventListener('click', function () {
          var val = parseInt(this.dataset.value);
          if (input) input.value = val;
          stars.forEach(function (s) {
            var v = parseInt(s.dataset.value);
            s.classList.toggle('filled', v <= val);
          });
        });
        star.addEventListener('mouseenter', function () {
          var val = parseInt(this.dataset.value);
          stars.forEach(function (s) {
            var v = parseInt(s.dataset.value);
            s.classList.toggle('hover', v <= val);
          });
        });
        star.addEventListener('mouseleave', function () {
          stars.forEach(function (s) { s.classList.remove('hover'); });
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     COMPREHENSIVE FORM VALIDATION
  ═══════════════════════════════════════════ */
  function initFormValidation() {
    document.querySelectorAll('[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var valid = true;
        form.querySelectorAll('[required]').forEach(function (field) {
          var error = field.parentElement.querySelector('.field-error');
          if (!error) {
            error = document.createElement('span');
            error.className = 'field-error';
            field.parentElement.appendChild(error);
          }
          if (!field.value.trim()) {
            error.textContent = field.dataset.error || 'This field is required';
            field.classList.add('field-invalid');
            valid = false;
          } else {
            error.textContent = '';
            field.classList.remove('field-invalid');
          }
          if (field.type === 'email' && field.value.trim()) {
            var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(field.value.trim())) {
              error.textContent = 'Please enter a valid email address';
              field.classList.add('field-invalid');
              valid = false;
            }
          }
          if (field.dataset.pattern && field.value.trim()) {
            var re = new RegExp(field.dataset.pattern);
            if (!re.test(field.value.trim())) {
              error.textContent = field.dataset.patterntip || 'Invalid format';
              field.classList.add('field-invalid');
              valid = false;
            }
          }
        });
        if (!valid) e.preventDefault();
      });
    });
  }

  /* ═══════════════════════════════════════════
     MODAL FOCUS TRAP
  ═══════════════════════════════════════════ */
  function initFocusTrap() {
    document.querySelectorAll('.modal-overlay').forEach(function (modal) {
      modal.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var focusable = modal.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    });
  }

  /* ═══════════════════════════════════════════
     SKELETON LOADER (shared across all pages)
  ═══════════════════════════════════════════ */
  function initSkeletonLoader() {
    setTimeout(function () {
      var s = document.getElementById('pageSkeleton');
      if (s) { s.style.transition = 'opacity 0.3s'; s.style.opacity = '0'; setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 300); }
    }, 1000);
  }

  /* ═══════════════════════════════════════════
     ACTIVE LINK HIGHLIGHT
  ═══════════════════════════════════════════ */
  function initActiveLink() {
    var path = window.location.pathname;
    var page = path.split('/').pop();
    if (!page) page = 'index.html';
    var isHome = (page === 'index.html' || page === '');
    document.querySelectorAll('.sidebar-link, .sidebar-sub-link').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href === '#') return;
      // On homepage skip hash links (scroll-spy handles them)
      if (isHome && href.charAt(0) === '#') return;
      var target = href.split('/').pop().split('?')[0].split('#')[0];
      if (target === page) {
        a.classList.add('active');
        // Open parent dropdown if sub-link
        if (a.classList.contains('sidebar-sub-link')) {
          var dropdown = a.closest('.sidebar-dropdown');
          if (dropdown) dropdown.classList.add('open');
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     SCROLL-SPY ACTIVE LINK (index.html sections)
     Jaise jaise scroll ho, us section wala link
     sidebar/navbar me highlight ho jayega
  ═══════════════════════════════════════════ */
  function initScrollSpy() {
    var page = (window.location.pathname.split('/').pop()) || 'index.html';
    if (page !== 'index.html' && page !== '') return; // sirf home page pe chalega

    var sectionIds = ['home', 'aboutSection', 'teachersFullSection', 'subjectsFullSection', 'applicationSection', 'contactSection', 'contactMapSection', 'chartsSection', 'resultsSection'];
    var sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    var allLinks = Array.prototype.slice.call(
      document.querySelectorAll('.sidebar-link[href^="#"], .sidebar-sub-link[href^="#"], .nav-links a[href^="#"]')
    );

    function setActive(id) {
      var activeDropdowns = [];
      allLinks.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        var isMatch = href === '#' + id;
        a.classList.toggle('active', isMatch);
        if (isMatch) {
          var dropdown = a.closest('.sidebar-dropdown');
          if (dropdown) activeDropdowns.push(dropdown);
        }
      });
      document.querySelectorAll('.sidebar-dropdown-toggle').forEach(function (t) {
        t.classList.remove('active');
      });
      activeDropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('.sidebar-dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      });
    }

    var currentId = 'home';
    var ticking = false;

    function updateOnScroll() {
      var navbar = document.getElementById('navbar');
      var offset = (navbar ? navbar.offsetHeight : 0) + 40;
      var scrollPos = window.scrollY + offset;

      var found = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollPos) found = sections[i].id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        found = sections[sections.length - 1].id;
      }
      if (found !== currentId) {
        currentId = found;
        setActive(currentId);
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    }, { passive: true });

    setActive(currentId);
  }

  /* ═══════════════════════════════════════════
     BOOT — DOMContentLoaded
  ═══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    initSkeletonLoader();
    initActiveLink();
    initScrollSpy();
    initScrollProgress();
    initParallax();
    initLightbox();
    initFAB();
    initSearch();
    initPasswordFeatures();
    initOTP();
    initTagInput();
    initFileUpload();
    initRTE();
    initCaptcha();
    initDatePicker();
    initRangeSlider();
    initColorPicker();
    initPhoneInput();

    initFormAutoSave();
    initCustomSelect();
    initKeyboardNav();
    initProgressBars();
    initStarRating();
    initFormValidation();
    initFocusTrap();
  });

})();

/* ═══════════════════════════════════════════
   INFINITE SCROLL — TEACHERS GRID
═══════════════════════════════════════════ */
(function () {
  var BATCH = 4; // kitne cards ek baar load hon
  var loadedCount = 0;
  var loading = false;

  function getTeachers() {
    return (typeof TEACHERS !== 'undefined') ? TEACHERS : [];
  }

  function buildCard(t, isNew) {
    var base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    var badgeText = t.subjects.length > 2
      ? t.subjects.length + ' Subjects'
      : t.experience.replace('Years', 'Yrs');
    var card = document.createElement('a');
    card.href = base + 'teacher-detail.html?id=' + t.id;
    card.className = 'teacher-card' + (isNew ? ' is-new' : '');
    card.setAttribute('data-tooltip', 'View ' + t.name + ' Profile');
    card.setAttribute('data-tooltip-pos', 'top');
    card.innerHTML =
      '<div class="teacher-card-top">'
      + '<div class="teacher-avatar">' + t.emoji + '</div>'
      + '<span class="badge badge-teacher">' + badgeText + '</span>'
      + '</div>'
      + '<div class="teacher-card-body">'
      + '<div class="teacher-name">' + t.name + '</div>'
      + '<p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.5rem;">' + t.qualification + ' · ' + t.experience + '</p>'
      + '<div class="teacher-subjects">' + t.subjects.map(function(s){ return '<span>' + s + '</span>'; }).join('') + '</div>'
      + '</div>';
    return card;
  }

  function loadNextBatch() {
    var teachers = getTeachers();
    var grid = document.getElementById('teachersGrid');
    var loader = document.getElementById('teachersLoader');
    var endMsg = document.getElementById('teachersEnd');
    if (!grid || loading) return;

    if (loadedCount >= teachers.length) return;

    loading = true;
    if (loader) loader.style.display = 'inline-flex';

    // Simulate slight delay for smooth feel
    setTimeout(function () {
      var slice = teachers.slice(loadedCount, loadedCount + BATCH);
      slice.forEach(function (t, i) {
        var card = buildCard(t, true);
        // Stagger animation
        card.style.animationDelay = (i * 80) + 'ms';
        grid.appendChild(card);
      });
      loadedCount += slice.length;

      if (loader) loader.style.display = 'none';
      loading = false;

      if (loadedCount >= teachers.length) {
        if (endMsg) endMsg.style.display = 'block';
        if (sentinel) observer.unobserve(sentinel);
      }
    }, 600);
  }

  var sentinel = document.getElementById('teachersSentinel');
  var observer = null;

  function initInfiniteScroll() {
    var grid = document.getElementById('teachersGrid');
    sentinel = document.getElementById('teachersSentinel');
    if (!grid || !sentinel) return;

    // Only run on index.html (where teachersGrid is the infinite scroll grid)
    // Check it's not the slide-track (pages/teachers.html has allTeachersGrid)
    if (grid.closest('.slide')) return;

    // Intersection Observer for sentinel
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadNextBatch();
          }
        });
      }, { rootMargin: '200px' });
      observer.observe(sentinel);
    }

    // Initial load
    loadNextBatch();
  }

  // Wait for TEACHERS data (may load after DOMContentLoaded)
  document.addEventListener('DOMContentLoaded', function () {
    // Give data.js time to define TEACHERS
    setTimeout(initInfiniteScroll, 100);
  });
})();

/* ═══════════════════════════════════════════
   ACTIVE LINK HIGHLIGHT — NAVBAR + SIDEBAR
   (Override/supplement features.js)
═══════════════════════════════════════════ */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var cur = location.pathname.split('/').pop() || 'index.html';

    // Navbar links
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      var f = h.split('/').pop() || 'index.html';
      if (f === cur) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });

    // Sidebar main links (page-based matching, skip hash links on homepage – scroll-spy handles those)
    document.querySelectorAll('.sidebar-link[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (h === '#' || h === '') return;
      // On index.html, skip hash links (scroll-spy manages them)
      if ((cur === 'index.html' || cur === '') && h.charAt(0) === '#') return;
      var f = h.split('/').pop() || 'index.html';
      a.classList.toggle('active', f === cur);
    });

    // Sidebar sub links (dropdown items)
    document.querySelectorAll('.sidebar-sub-link[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (h === '#' || h === '') return;
      // On index.html, skip hash links (scroll-spy manages them)
      if ((cur === 'index.html' || cur === '') && h.charAt(0) === '#') return;
      var f = h.split('/').pop() || 'index.html';
      if (f === cur) {
        a.classList.add('active');
        // Parent dropdown bhi open rakhein
        var dropdown = a.closest('.sidebar-dropdown');
        if (dropdown) dropdown.classList.add('open');
      } else {
        a.classList.remove('active');
      }
    });
  });
})();
