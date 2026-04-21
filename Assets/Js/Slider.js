document.addEventListener('DOMContentLoaded', function () {

  /* ── SLIDER ─────────────────────────────────────────── */
  const slides    = document.querySelectorAll('.slide');
  const dots      = document.querySelectorAll('.dot');
  const figLabel  = document.getElementById('sliderFig');
  const counter   = document.getElementById('sliderCounter');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const frame     = document.getElementById('sliderFrame');

  const total = slides.length;
  let current = 0;
  let timer;
  const INTERVAL = 4000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    const label = slides[current].dataset.label || '';
    const fig   = String(current + 1).padStart(2, '0');
    const tot   = String(total).padStart(2, '0');
    if (figLabel) figLabel.textContent = `FIG. ${fig} — ${label}`;
    if (counter)  counter.textContent  = `${fig} / ${tot}`;
  }

  function start() { timer = setInterval(() => goTo(current + 1), INTERVAL); }
  function stop()  { clearInterval(timer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stop(); goTo(current + 1); start(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stop(); goTo(i); start(); });
  });

  // Pause on hover
  if (frame) {
    frame.addEventListener('mouseenter', stop);
    frame.addEventListener('mouseleave', start);
  }

  // Keyboard navigation (only when frame is focused/hovered)
  document.addEventListener('keydown', function (e) {
    if (!frame) return;
    if (e.key === 'ArrowLeft')  { stop(); goTo(current - 1); start(); }
    if (e.key === 'ArrowRight') { stop(); goTo(current + 1); start(); }
  });

  goTo(0);
  start();


  /* ── NAVBAR SCROLL STATE ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ── HAMBURGER MENU ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
  }


  /* ── INTERSECTION OBSERVER — REVEAL ─────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealEls = document.querySelectorAll('.reveal-section, .reveal-item');
    const observer  = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger reveal-items within a parent
          const delay = entry.target.classList.contains('reveal-item')
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal-item')).indexOf(entry.target) * 50
            : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal-section, .reveal-item')
      .forEach(el => el.classList.add('visible'));
  }


  /* ── STAT COUNTERS ───────────────────────────────────── */
  const statEls = document.querySelectorAll('.hero__stat-value');

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target);
    const suffix  = el.dataset.suffix  || '';
    const decimal = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1500;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value  = target * eased;
      el.textContent = value.toFixed(decimal) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimal) + suffix;
    }

    requestAnimationFrame(step);
  }

  if (!prefersReduced && statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(el => statObserver.observe(el));
  } else {
    statEls.forEach(el => {
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix  || '';
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      el.textContent = target.toFixed(decimal) + suffix;
    });
  }

});
