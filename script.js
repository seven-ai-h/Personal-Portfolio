/* ============================================================
   HIRO — JS: nav toggle, theme toggle, mosaic, photo shuffle,
   tilt effect, contact demo
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Mobile Nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- Current Year ---------- */
  const y = document.getElementById('current-year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Contact Form (demo) ---------- */
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-message');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending...'; msg.textContent = '';
      try { await new Promise(r => setTimeout(r, 900)); msg.textContent = 'Thanks! Your message has been sent.'; }
      catch { msg.textContent = 'Something went wrong. Please try again.'; }
      finally { btn.disabled = false; btn.textContent = original; form.reset(); }
    });
  }

  /* ---------- Theme Toggle ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  let theme = saved || root.dataset.theme || 'dark';

  function applyTheme(t){
    root.dataset.theme = t;
    if (themeBtn) themeBtn.textContent = (t === 'light') ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('theme', t);
  }
  applyTheme(theme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      theme = (root.dataset.theme === 'light') ? 'dark' : 'light';
      applyTheme(theme);
    });
  }

  /* ---------- Light-mode Generative Mosaic ---------- */
  (function(){
    const art = document.getElementById('hero-art');
    if (!art) return;

    function rand(a, b){ return Math.floor(Math.random()*(b-a+1))+a; }
    function palette(){
      const colors = ['#111111','#e63946','#457b9d','#1d3557','#ffb703','#fb8500','#2a9d8f','#e76f51','#a8dadc','#f1faee'];
      return colors.sort(()=>Math.random()-0.5).slice(0,8);
    }
    function draw(){
      const cols = palette(); const size = 8; const cell = 100/size;
      let svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' shape-rendering='crispEdges'>`;
      for (let y=0; y<size; y++){
        for (let x=0; x<size; x++){
          const c = cols[(x+y+rand(0,cols.length-1))%cols.length];
          const t = rand(0,2); const px = x*cell, py = y*cell, s = cell;
          if (t===0){
            svg += `<rect x='${px}' y='${py}' width='${s}' height='${s}' fill='${c}'/>`;
          } else if (t===1){
            const r = s; const cx = px + (rand(0,1)?0:s), cy = py + (rand(0,1)?0:s);
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
    function maybeDraw(){ if (root.getAttribute('data-theme') === 'light') draw(); }
    art.addEventListener('click', draw);
    const mo = new MutationObserver(maybeDraw);
    mo.observe(root, { attributes:true, attributeFilter:['data-theme'] });
    maybeDraw();
  })();

  /* ---------- Dark-mode Photo Shuffle ---------- */
  (function(){
    const wrap = document.getElementById('hero-shuffle');
    if (!wrap) return;

    // Replace with your actual files
    const HERO_IMAGES = [
      'pictures/seattletower.JPG',
      'pictures/seattle wheels.JPG',
      'pictures/ximending.JPG',
      'pictures/shifen.jpg',
      'pictures/trainpic.jpg',
      'pictures/ximending2.jpg'
    ];

    // preload
    HERO_IMAGES.forEach(src => { const i = new Image(); i.src = src; });

    const imgA = wrap.querySelector('.hs-current');
    const imgB = wrap.querySelector('.hs-next');
    const btn  = document.getElementById('shuffle-btn');
    const caption = document.getElementById('hs-caption');

    let current = -1;
    const pickNext = () => {
      if (HERO_IMAGES.length <= 1) return 0;
      let idx; do { idx = Math.floor(Math.random()*HERO_IMAGES.length); } while (idx === current);
      return idx;
    };
    const label = (src) => src.split('/').pop().replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');

    function show(idx){
      const nextSrc = HERO_IMAGES[idx]; const nextAlt = label(nextSrc);
      imgB.src = nextSrc; imgB.alt = nextAlt;
      wrap.classList.add('fading-in');
      setTimeout(() => { imgA.src = nextSrc; imgA.alt = nextAlt; wrap.classList.remove('fading-in'); }, 520);
      caption.textContent = `${nextAlt} — click to shuffle`;
      current = idx;
    }
    function shuffle(){ show(pickNext()); }

    function ensureDarkInit(){
      const isDark = root.getAttribute('data-theme') !== 'light';
      wrap.style.display = isDark ? '' : 'none';
      if (isDark && current === -1) shuffle();
    }

    wrap.addEventListener('click', shuffle);
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); shuffle(); });

    const obs = new MutationObserver(ensureDarkInit);
    obs.observe(root, { attributes:true, attributeFilter:['data-theme'] });
    ensureDarkInit();
  })();

  /* ---------- Tilt Parallax for .tilt-parallax ---------- */
  document.querySelectorAll('.tilt-parallax').forEach(el => {
    const damp = 30, max = 6;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / r.width, dy = (e.clientY - cy) / r.height;
      const rx = Math.max(Math.min((-dy) * damp, max), -max);
      const ry = Math.max(Math.min(( dx) * damp, max), -max);
      el.style.transform = `perspective(800px) rotateX(${rx/10}deg) rotateY(${ry/10}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
});
