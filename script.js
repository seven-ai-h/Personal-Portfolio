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

// ===== Scroll-in animations (now includes .reveal-slide) =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-slide').forEach(el => io.observe(el));

// ===== Year in footer =====
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ===== Project flip cards: tap/click + keyboard =====
(function(){
  const cards = document.querySelectorAll('.project-card.flip');

  function toggle(card){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { card.classList.toggle('is-flipped'); return; }
    card.classList.toggle('is-flipped');
  }

  cards.forEach(card => {
    card.setAttribute('tabindex','0');

    // Toggle on click for touch/small screens only — desktop flips on hover
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
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
