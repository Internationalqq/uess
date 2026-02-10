/* Форма: отправка в Telegram */
(function() {
  try {
    window.CONTACT_FORM_API_URL = window.CONTACT_FORM_API_URL || 'https://uess-fivb.vercel.app/api/telegram';

    window.sendContactForm = function() {
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');
  var btn = document.getElementById('submit-btn');
  function show(msg, err) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (err ? 'error' : 'success');
    statusEl.style.display = 'block';
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (!form || !statusEl) {
    show('Ошибка: форма не найдена.', true);
    return;
  }
  var apiUrl = (window.CONTACT_FORM_API_URL || '').toString().trim().replace(/\/+$/, '');
  if (!apiUrl) apiUrl = '/api/telegram';
  else if (apiUrl.indexOf('/api/telegram') === -1) apiUrl = apiUrl + '/api/telegram';
  var nameEl = form.querySelector('[name="name"]');
  var phoneEl = form.querySelector('[name="phone"]');
  if (nameEl && !nameEl.value.trim()) { show('Введите имя.', true); nameEl.focus(); return; }
  if (phoneEl && !phoneEl.value.trim()) { show('Введите телефон.', true); phoneEl.focus(); return; }
  show('Отправка...', false);
  if (btn) btn.disabled = true;
  var data = {
    name: (form.querySelector('[name="name"]') || {}).value || '',
    phone: (form.querySelector('[name="phone"]') || {}).value || '',
    email: (form.querySelector('[name="email"]') || {}).value || '',
    message: (form.querySelector('[name="message"]') || {}).value || ''
  };
  var done = false;
  var t = setTimeout(function() {
    if (done) return;
    done = true;
    show('Нет ответа за 15 сек. Проверьте Vercel.', true);
    if (btn) btn.disabled = false;
  }, 15000);
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(r) {
    return r.text().then(function(txt) {
      var body = {};
      try { body = txt ? JSON.parse(txt) : {}; } catch (_) {}
      return { status: r.status, body: body };
    });
  }).then(function(r) {
    if (done) return;
    done = true;
    clearTimeout(t);
    if (r.status === 200 && r.body && r.body.ok) {
      show('Заявка отправлена! Мы свяжемся с вами.', false);
      form.reset();
    } else if (r.status === 404) {
      show('Ошибка 404: API не найден. Задеплойте на Vercel репозиторий с папкой api/.', true);
    } else if (r.status === 500) {
      show('Ошибка 500: ' + (r.body && r.body.error ? r.body.error : 'Задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в Vercel.'), true);
    } else {
      show((r.body && r.body.error) || 'Ошибка ' + r.status, true);
    }
  }).catch(function(e) {
    if (done) return;
    done = true;
    clearTimeout(t);
    show('Ошибка сети: ' + (e.message || 'не удалось отправить'), true);
  }).finally(function() { if (btn) btn.disabled = false; });
    };
  } catch (e) {
    window.sendContactForm = function() {
      var s = document.getElementById('form-status');
      if (s) {
        s.textContent = 'Ошибка скрипта: ' + (e && e.message ? e.message : String(e));
        s.className = 'form-status error';
        s.style.display = 'block';
      }
    };
  }

  /* Маска телефона +7 и ограничение ввода в полях */
  function initFormFilters() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var phoneEl = form.querySelector('[name="phone"]');
    var nameEl = form.querySelector('[name="name"]');
    var emailEl = form.querySelector('[name="email"]');
    var messageEl = form.querySelector('[name="message"]');

    if (phoneEl) {
      function formatPhone(val) {
        var digits = val.replace(/\D/g, '');
        if (digits.charAt(0) === '8') digits = '7' + digits.slice(1);
        if (digits.charAt(0) !== '7') digits = '7' + digits;
        digits = digits.slice(0, 11);
        if (digits.length <= 1) return digits ? '+7' : '+7 ';
        var d = digits.slice(1, 4);
        var e = digits.slice(4, 7);
        var f = digits.slice(7, 9);
        var g = digits.slice(9, 11);
        var out = '+7';
        if (d.length) out += ' (' + d;
        if (e.length) out += ') ' + e;
        if (f.length) out += '-' + f;
        if (g.length) out += '-' + g;
        return out;
      }
      phoneEl.addEventListener('focus', function() {
        if (!this.value.trim()) this.value = '+7 ';
      });
      phoneEl.addEventListener('input', function() {
        var pos = this.selectionStart;
        var oldLen = this.value.length;
        this.value = formatPhone(this.value);
        var newLen = this.value.length;
        this.setSelectionRange(Math.min(pos + (this.value.length - oldLen), this.value.length), this.selectionEnd);
      });
      phoneEl.addEventListener('paste', function(e) {
        e.preventDefault();
        var pasted = (e.clipboardData || window.clipboardData).getData('text');
        this.value = formatPhone(pasted);
      });
    }

    if (nameEl) {
      nameEl.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
      });
      nameEl.setAttribute('maxlength', '100');
    }

    if (emailEl) {
      emailEl.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9@._\-+]/g, '');
      });
      emailEl.setAttribute('maxlength', '100');
    }

    if (messageEl) {
      messageEl.addEventListener('input', function() {
        this.value = this.value.replace(/[\x00-\x1F\x7F]/g, '');
              });
      messageEl.setAttribute('maxlength', '2000');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormFilters);
  } else {
    initFormFilters();
  }
})();
