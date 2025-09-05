// Top-nav toggle, smooth current year, and simple form feedback

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close on link click (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Current year
  const y = document.getElementById('current-year');
  if (y) y.textContent = new Date().getFullYear();

  // Contact form (demo)
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-message');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending...'; msg.textContent = '';
      try {
        await new Promise(r => setTimeout(r, 900)); // simulate
        msg.textContent = 'Thanks! Your message has been sent.';
      } catch {
        msg.textContent = 'Something went wrong. Please try again.';
      } finally {
        btn.disabled = false; btn.textContent = original; form.reset();
      }
    });
  }
});
// ===== Theme Toggle (Dark / Light) =====
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  // Determine initial theme (saved > system > default dark)
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  let theme = saved || (prefersLight ? 'light' : 'dark');

  function applyTheme(t){
    if (t === 'light') {
      root.setAttribute('data-theme', 'light');
      if (btn) btn.textContent = '☀️ Light';
    } else {
      root.removeAttribute('data-theme');
      if (btn) btn.textContent = '🌙 Dark';
    }
  }

  applyTheme(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      theme = (root.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    });
  }
})();
// Subtle tilt for cards with .tilt-parallax
document.querySelectorAll('.tilt-parallax').forEach(el => {
  const damp = 30;   // lower = more tilt
  const max  = 6;    // deg clamp
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    const rx = Math.max(Math.min((-dy) * damp,  max), -max);
    const ry = Math.max(Math.min(( dx) * damp,  max), -max);
    el.style.transform = `perspective(800px) rotateX(${rx/10}deg) rotateY(${ry/10}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});
// Light-mode generative mosaic (Monica-style vibe)
(function(){
  const art = document.getElementById('hero-art');
  if (!art) return;

  function rand(a, b){ return Math.floor(Math.random()*(b-a+1))+a; }

  function palette(){
    // friendly primaries + a couple soft pastels
    const colors = ['#111111','#e63946','#457b9d','#1d3557','#ffb703','#fb8500','#2a9d8f','#e76f51','#a8dadc','#f1faee'];
    return colors.sort(()=>Math.random()-0.5).slice(0,8);
  }

  function draw(){
    const cols = palette();
    const size = 8; // 8x8 grid
    const cell = 100/size;
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' shape-rendering='crispEdges'>`;
    for (let y=0; y<size; y++){
      for (let x=0; x<size; x++){
        const c = cols[(x+y+rand(0,cols.length-1))%cols.length];
        // choose shape: square / quarter circle / half circle
        const t = rand(0,2);
        const px = x*cell, py = y*cell, s = cell;
        if (t===0){
          svg += `<rect x='${px}' y='${py}' width='${s}' height='${s}' fill='${c}'/>`;
        } else if (t===1){
          const r = s; const cx = px + (rand(0,1)?0:s), cy = py + (rand(0,1)?0:s);
          svg += `<path d='M ${px} ${py} h ${s} v ${s} h -${s} Z' fill='none'/>`;
          svg += `<path d='M ${cx} ${cy} A ${r} ${r} 0 0 0 ${px+(cx===px?px+s:px)} ${py+(cy===py?py+s:py)} L ${px+s/2} ${py+s/2} Z' fill='${c}' opacity='0.96'/>`;
        } else {
          const dir = rand(0,3);
          const arcs = [
            `M ${px} ${py} A ${s} ${s} 0 0 1 ${px+s} ${py} L ${px+s} ${py+s} A ${s} ${s} 0 0 1 ${px} ${py+s} Z`,
            `M ${px} ${py} A ${s} ${s} 0 0 1 ${px} ${py+s} L ${px+s} ${py+s} A ${s} ${s} 0 0 1 ${px+s} ${py} Z`,
            `M ${px} ${py} A ${s} ${s} 0 0 1 ${px+s} ${py+s} L ${px} ${py+s} Z`,
            `M ${px+s} ${py} A ${s} ${s} 0 0 1 ${px} ${py+s} L ${px+s} ${py+s} Z`,
          ];
          svg += `<path d='${arcs[dir]}' fill='${c}'/>`;
        }
      }
    }
    svg += `</svg>`;
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    art.style.backgroundImage = `url("${url}")`;
    art.style.backgroundSize = 'cover';
    art.style.backgroundPosition = 'center';
  }
  draw();
  art.addEventListener('click', draw);

  // If user switches theme to dark, we hide via CSS; regenerate when back to light
  const observer = new MutationObserver(() => {
    if (document.documentElement.getAttribute('data-theme') === 'light') draw();
  });
  observer.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
})();
// ===== Hero Photo Shuffle (Dark mode) =====
(function(){
  const wrap = document.getElementById('hero-shuffle');
  if (!wrap) return;

  // EDIT THIS LIST to your real files
  const HERO_IMAGES = [
    'photo-1.jpg',
    'photo-2.jpg',
    'photo-3.jpg',
    'thumb-tech-1.jpg',
    'thumb-tech-2.jpg',
    'thumb-tech-3.jpg'
  ];

  // Preload
  const cache = new Map();
  HERO_IMAGES.forEach(src => {
    const img = new Image(); img.src = src;
    cache.set(src, img);
  });

  const imgA = wrap.querySelector('.hs-current');
  const imgB = wrap.querySelector('.hs-next');
  const btn  = document.getElementById('shuffle-btn');
  const caption = document.getElementById('hs-caption');

  let current = -1;
  function pickNext(){
    if (HERO_IMAGES.length === 0) return -1;
    if (HERO_IMAGES.length === 1) return 0;
    let idx;
    do { idx = Math.floor(Math.random()*HERO_IMAGES.length); } while (idx === current);
    return idx;
  }

  function filenameToLabel(src){
    const base = src.split('/').pop().replace(/\.[^.]+$/, '');
    return base.replace(/[-_]/g, ' ');
  }

  function show(idx){
    if (idx < 0) return;
    const nextSrc = HERO_IMAGES[idx];
    const nextAlt = filenameToLabel(nextSrc);

    // prepare next
    imgB.src = nextSrc;
    imgB.alt = nextAlt;

    // animate
    wrap.classList.add('fading-in');
    // after transition, swap roles
    setTimeout(() => {
      imgA.src = nextSrc;
      imgA.alt = nextAlt;
      wrap.classList.remove('fading-in');
    }, 520);

    caption.textContent = `${nextAlt} — click to shuffle`;
    current = idx;
  }

  function shuffle(){
    const idx = pickNext();
    show(idx);
  }

  function ensureVisibleInDark(){
    // Only run when in dark mode
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    wrap.style.display = isDark ? '' : 'none';
    if (isDark && current === -1) shuffle();
  }

  // Init
  ensureVisibleInDark();

  // Click handlers (figure or button)
  wrap.addEventListener('click', (e) => {
    // avoid double fire when clicking the button (still fine if it does)
    shuffle();
  });
  if (btn) btn.addEventListener('click', (e) => {
    e.stopPropagation();
    shuffle();
  });

  // Respond to theme changes
  const obs = new MutationObserver(() => ensureVisibleInDark());
  obs.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
})();
