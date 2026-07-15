/* =====================================================
   PAYSAGE LORENA — interactions
   ===================================================== */
(function () {
  'use strict';

  /* Contato comercial — CONFIRMAR número/inbox do Paysage com a construtora. */
  var WHATS_NUMBER = '5512997897215'; // (12) 99789-7215

  /* Endpoint de captura de leads → Google Sheets (Google Apps Script Web App).
     Cole aqui a URL /exec gerada ao publicar o Apps Script (ver
     assets/apps-script/README-planilha.md). Deixe vazio para usar só o WhatsApp.
     O lead é enviado por POST (fire-and-forget) e o WhatsApp abre em seguida. */
  var LEAD_ENDPOINT = ''; // ex.: 'https://script.google.com/macros/s/AKfycb.../exec'

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  var closeMenu = function () {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  };
  var openMenu = function () {
    nav.classList.add('open');
    toggle.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  };
  toggle.addEventListener('click', function () {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); }
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hide floating WhatsApp over contato/footer ---------- */
  var floatBtn = document.querySelector('.whats-float');
  var footerEl = document.querySelector('.site-footer');
  var contatoEl = document.getElementById('contato');
  if (floatBtn && 'IntersectionObserver' in window) {
    var nearBottom = { contato: false, footer: false };
    var floatIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === contatoEl) nearBottom.contato = e.isIntersecting;
        if (e.target === footerEl) nearBottom.footer = e.isIntersecting;
      });
      floatBtn.classList.toggle('float-hidden', nearBottom.contato || nearBottom.footer);
    }, { threshold: 0.25 });
    if (contatoEl) floatIO.observe(contatoEl);
    if (footerEl) floatIO.observe(footerEl);
  }

  /* ---------- Tabs (plantas) — WAI-ARIA tabs pattern ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = document.querySelectorAll('.panel');

  function activateTab(tab, setFocus) {
    var id = tab.getAttribute('data-tab');
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (p) {
      var match = p.id === id;
      p.classList.toggle('is-active', match);
      if (match) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    if (setFocus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var idx = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') idx = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') idx = 0;
      else if (e.key === 'End') idx = tabs.length - 1;
      if (idx !== null) { e.preventDefault(); activateTab(tabs[idx], true); }
    });
  });

  /* ---------- "Tenho interesse" -> prefill form ---------- */
  document.querySelectorAll('[data-interest]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-interest');
      var sel = document.getElementById('interesse');
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === val || sel.options[i].text === val) { sel.selectedIndex = i; break; }
        }
      }
    });
  });

  /* ---------- Carrossel de ambientes (plantas) ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var main = car.querySelector('.rc-main');
    var thumbs = Array.prototype.slice.call(car.querySelectorAll('.rc-thumb'));
    var counter = car.querySelector('.rc-counter');
    var prev = car.querySelector('.rc-prev');
    var next = car.querySelector('.rc-next');
    var baseAlt = (main && main.getAttribute('alt')) || '';
    var srcs = thumbs.map(function (t) { var i = t.querySelector('img'); return i ? i.getAttribute('src') : ''; });
    var i = 0;

    if (srcs.length <= 1) { car.classList.add('is-single'); return; }

    function go(n) {
      i = (n + srcs.length) % srcs.length;
      main.src = srcs[i];
      main.alt = baseAlt + ' — imagem ' + (i + 1) + ' de ' + srcs.length;
      if (counter) counter.textContent = (i + 1) + ' / ' + srcs.length;
      thumbs.forEach(function (t, k) { t.classList.toggle('is-active', k === i); });
    }
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    // swipe (touch)
    var x0 = null;
    car.querySelector('.rc-stage').addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    car.querySelector('.rc-stage').addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
      x0 = null;
    }, { passive: true });
    go(0);
  });

  /* ---------- Lightbox gallery (modal dialog w/ focus trap) ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var current = 0;
  var lastFocused = null;
  var focusables = [lbPrev, lbClose, lbNext];

  function show(i) {
    current = (i + items.length) % items.length;
    var it = items[current];
    lbImg.src = it.getAttribute('data-src');
    lbImg.alt = it.getAttribute('data-cap') || '';
    lbCap.textContent = it.getAttribute('data-cap') || '';
  }
  function openLb(i) {
    lastFocused = document.activeElement;
    show(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    lb.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    // defer focus past the click's default focus + visibility transition
    setTimeout(function () { lbClose.focus(); }, 30);
  }
  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lb.removeAttribute('aria-modal');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  items.forEach(function (it, i) {
    it.setAttribute('tabindex', '0');
    it.setAttribute('role', 'button');
    it.addEventListener('click', function () { openLb(i); });
    it.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
    });
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { show(current - 1); });
  lbNext.addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab') {
      // focus trap among the dialog controls
      e.preventDefault();
      var pos = focusables.indexOf(document.activeElement);
      if (pos === -1) pos = 0;
      var nextPos = e.shiftKey ? (pos - 1 + focusables.length) % focusables.length
                               : (pos + 1) % focusables.length;
      focusables[nextPos].focus();
    }
  });

  /* ---------- Lead form ---------- */
  var form = document.getElementById('leadForm');
  var note = document.getElementById('formNote');

  function setNote(msg, cls) { note.textContent = msg; note.className = 'form-note ' + (cls || ''); }

  function buildWhatsText(d) {
    return 'Olá! Tenho interesse no *Paysage Lorena* e gostaria de agendar uma visita.%0A%0A' +
      '*Nome:* ' + encodeURIComponent(d.nome) + '%0A' +
      '*E-mail:* ' + encodeURIComponent(d.email) + '%0A' +
      '*Telefone:* ' + encodeURIComponent(d.telefone) + '%0A' +
      '*Tipologia:* ' + encodeURIComponent(d.interesse) +
      (d.mensagem ? '%0A*Mensagem:* ' + encodeURIComponent(d.mensagem) : '');
  }
  function openWhats(d) {
    var url = 'https://wa.me/' + WHATS_NUMBER + '?text=' + buildWhatsText(d);
    var win = window.open(url, '_blank');
    if (!win) {
      // popup blocked — give the user a manual link so the lead is never lost
      setNote('Tudo certo! Toque aqui para concluir no WhatsApp.', 'ok');
      note.innerHTML = 'Tudo certo! <a href="' + url + '" target="_blank" rel="noopener" style="text-decoration:underline">Toque aqui para concluir no WhatsApp.</a>';
    } else {
      setNote('Tudo certo! Abrimos o WhatsApp para concluir seu contato.', 'ok');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.nome, email = form.email, tel = form.telefone, consent = document.getElementById('consent');
    var ok = true;
    [nome, email, tel].forEach(function (f) {
      var valid = f.value.trim() !== '' && f.checkValidity();
      f.classList.toggle('invalid', !valid);
      f.setAttribute('aria-invalid', String(!valid));
      if (!valid) ok = false;
    });
    if (!consent.checked) ok = false;
    if (!ok) { setNote('Por favor, preencha os campos obrigatórios e autorize o contato.', 'err'); return; }

    var data = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      telefone: tel.value.trim(),
      interesse: form.interesse.value || 'Não informada',
      mensagem: (form.mensagem.value || '').trim(),
      origem: 'paysagelorena.com.br',
      data: new Date().toISOString()
    };

    // Safety net: persist locally so a lead is never silently lost.
    try {
      var saved = JSON.parse(localStorage.getItem('paysage_leads') || '[]');
      saved.push(data); localStorage.setItem('paysage_leads', JSON.stringify(saved));
    } catch (err) { /* storage indisponível — segue para o WhatsApp */ }

    // Grava na planilha (Google Sheets via Apps Script), sem bloquear o fluxo.
    // 'no-cors' + text/plain evita o preflight que o Apps Script não trata;
    // a linha é gravada mesmo sem podermos ler a resposta.
    if (LEAD_ENDPOINT && LEAD_ENDPOINT.indexOf('http') === 0) {
      try {
        fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data),
          mode: 'no-cors',
          keepalive: true
        }).catch(function () {});
      } catch (err) { /* ignora — o WhatsApp segue como rede de segurança */ }
    }

    openWhats(data); form.reset();
    [nome, email, tel].forEach(function (f) { f.removeAttribute('aria-invalid'); });
  });

  /* ---------- Animated count-up stats ---------- */
  var specGrid = document.getElementById('specGrid');
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function formatNum(n, el) {
    if (el.hasAttribute('data-thousands')) return n.toLocaleString('pt-BR');
    if (el.hasAttribute('data-pad')) return String(n).padStart(parseInt(el.getAttribute('data-pad'), 10), '0');
    return String(n);
  }
  function setNumText(el, str) {
    // preserve a trailing <small> (e.g. m²) by writing only the first text node
    if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = str;
    else el.insertBefore(document.createTextNode(str), el.firstChild);
  }
  function runCounters() {
    var nums = specGrid.querySelectorAll('.spec-num[data-count]');
    nums.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (prefersReduced) { setNumText(el, formatNum(target, el)); return; }
      var dur = 1400, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setNumText(el, formatNum(Math.round(target * eased), el));
        if (p < 1) requestAnimationFrame(step);
        else setNumText(el, formatNum(target, el));
      }
      requestAnimationFrame(step);
    });
  }
  if (specGrid && 'IntersectionObserver' in window) {
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); cIO.disconnect(); } });
    }, { threshold: 0.4 });
    cIO.observe(specGrid);
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
