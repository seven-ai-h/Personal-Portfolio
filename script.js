// ===== Mobile nav =====
const burger = document.getElementById('navBurger');
const links = document.getElementById('navLinks');
if (burger && links) {
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

// ===== Theme toggle (light/dark) =====
const toggle = document.getElementById('modeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);
if (toggle) {
  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ===== Scroll-in animations =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => io.observe(el));

// ===== Contact form (front-end only) =====
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', () => {
    alert('Thanks! This demo form is front-end only. You can wire it to Formspree or a serverless endpoint.');
    form.reset();
  });
}

// ===== Year in footer =====
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Project flip cards: tap/click + keyboard (mobile + accessibility)
(function(){
  const cards = document.querySelectorAll('.project-card.flip');

  function toggle(card){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { card.classList.toggle('is-flipped'); return; }
    card.classList.toggle('is-flipped');
  }

  cards.forEach(card => {
    card.setAttribute('tabindex','0');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // allow link clicks if you add them
      // Only toggle on click for touch/pen devices or small screens
      const isTouch = matchMedia('(hover: none)').matches || window.innerWidth < 980;
      if (isTouch) toggle(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(card); }
      if (e.key === 'Escape') card.classList.remove('is-flipped');
    });
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card.flip')) {
      cards.forEach(c => c.classList.remove('is-flipped'));
    }
  });
})();
