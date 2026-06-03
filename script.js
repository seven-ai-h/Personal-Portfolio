/* =============================================
   THEME TOGGLE
   ============================================= */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* =============================================
   MOBILE NAV
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =============================================
   NAVBAR SCROLL
   ============================================= */
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  // Navbar shadow
  navbar.classList.toggle('scrolled', scrollY > 20);

  // Progress bar
  scrollProgress.style.width = `${(scrollY / maxScroll) * 100}%`;

  // Back to top
  backTop.classList.toggle('visible', scrollY > 400);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* =============================================
   COUNTER ANIMATION
   ============================================= */
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1600;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const tick = () => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current);
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* =============================================
   TYPEWRITER EFFECT
   ============================================= */
const words = [
  'data pipelines.',
  'ML models.',
  'scalable systems.',
  'ETL workflows.',
  'REST APIs.',
  'real-time analytics.',
];
const twEl = document.getElementById('typewriter');
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function type() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    twEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 45;
  } else {
    twEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 85;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typingSpeed = 1600;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingSpeed = 400;
  }

  setTimeout(type, typingSpeed);
}
setTimeout(type, 800);

/* =============================================
   HERO PARTICLE CANVAS
   ============================================= */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '99,170,255' : '139,92,246';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
  particles = Array.from({ length: count }, () => new Particle());
}

function drawLines() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99,170,255,${0.06 * (1 - dist / maxDist)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  animFrame = requestAnimationFrame(animateCanvas);
}

resizeCanvas();
initParticles();
animateCanvas();

const resizeObserver = new ResizeObserver(() => {
  resizeCanvas();
  initParticles();
});
resizeObserver.observe(canvas);

/* =============================================
   PROJECT CARD MOUSE GLOW
   ============================================= */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.querySelector('.project-glow').style.setProperty('--mx', `${x}%`);
    card.querySelector('.project-glow').style.setProperty('--my', `${y}%`);
  });
});

/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .contact-item, .pill').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

/* =============================================
   FOOTER YEAR
   ============================================= */
document.getElementById('footerYear').textContent = new Date().getFullYear();
