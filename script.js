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
   PHOTO LIGHTBOX
   ============================================= */
const photos = [
  { src: 'pictures/portrait.jpg',       alt: 'Hiro' },
  { src: 'pictures/sakuraberk.jpg',     alt: 'Sakura at Berkeley' },
  { src: 'pictures/jiufensunset1.JPG',  alt: 'Jiufen Sunset' },
  { src: 'pictures/jiufen1.JPG',        alt: 'Jiufen' },
  { src: 'pictures/shifen.jpg',         alt: 'Shifen' },
  { src: 'pictures/ximending.JPG',      alt: 'Ximending' },
  { src: 'pictures/taiwanstreet.jpg',   alt: 'Taiwan Street' },
  { src: 'pictures/seattletower.JPG',   alt: 'Seattle Tower' },
  { src: 'pictures/doggiesakura.JPG',   alt: 'Doggie & Sakura' },
  { src: 'pictures/trainpic.jpg',       alt: 'Train' },
];

const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbThumbs  = document.getElementById('lbThumbs');
const lbCounter = document.getElementById('lbCounter');
let currentIdx  = 0;

function buildThumbs() {
  photos.forEach((p, i) => {
    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.alt;
    img.className = 'lb-thumb';
    img.addEventListener('click', () => goTo(i));
    lbThumbs.appendChild(img);
  });
}

function goTo(idx) {
  currentIdx = (idx + photos.length) % photos.length;
  lbImg.classList.add('switching');
  setTimeout(() => {
    lbImg.src = photos[currentIdx].src;
    lbImg.alt = photos[currentIdx].alt;
    lbImg.classList.remove('switching');
  }, 180);
  lbCounter.textContent = `${currentIdx + 1} / ${photos.length}`;
  lbThumbs.querySelectorAll('.lb-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentIdx);
  });
  // scroll active thumb into view
  const active = lbThumbs.querySelectorAll('.lb-thumb')[currentIdx];
  active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function openLightbox(startIdx = 0) {
  if (!lbThumbs.children.length) buildThumbs();
  goTo(startIdx);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('avatarBtn').addEventListener('click', () => openLightbox(0));
document.getElementById('avatarBtn').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(0); }
});
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => goTo(currentIdx - 1));
document.getElementById('lbNext').addEventListener('click', () => goTo(currentIdx + 1));

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   goTo(currentIdx - 1);
  if (e.key === 'ArrowRight')  goTo(currentIdx + 1);
});

// Touch swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) goTo(currentIdx + (dx < 0 ? 1 : -1));
}, { passive: true });

/* =============================================
   FOOTER YEAR
   ============================================= */
document.getElementById('footerYear').textContent = new Date().getFullYear();
