/* ═════════════════════════════════════════════
   script.js — Animaciones completas
═════════════════════════════════════════════ */

/* ── 1. PARTÍCULAS ──────────────────────────── */
(function particles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Pt {
    constructor() { this.init(true); }
    init(rand) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : H + 8;
      this.r  = Math.random() * 1.4 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.22;
      this.vy = -(Math.random() * 0.35 + 0.08);
      this.a  = Math.random() * 0.45 + 0.08;
      this.da = (Math.random() - 0.5) * 0.0025;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if (this.a < 0.05 || this.a > 0.65) this.da *= -1;
      if (this.y < -10) this.init(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.a);
      ctx.fillStyle   = '#00c8ff';
      ctx.shadowBlur  = 7;
      ctx.shadowColor = 'rgba(0,200,255,0.55)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function makePoints() {
    const n = Math.min(Math.floor(W * H / 16000), 100);
    pts = Array.from({ length: n }, () => new Pt());
  }

  function drawLines() {
    const maxD = 130;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          ctx.save();
          ctx.globalAlpha = (1 - d / maxD) * 0.1;
          ctx.strokeStyle = '#00c8ff';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.step(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); makePoints(); });
  resize();
  makePoints();
  loop();
})();


/* ── 2. PARALLAX SUAVE HERO ─────────────────── */
(function parallax() {
  const glowL = document.querySelector('.hero__glow-l');
  const glowR = document.querySelector('.hero__glow-r');
  const overlay = document.querySelector('.hero__grid-overlay');

  document.addEventListener('mousemove', e => {
    if (window.scrollY > window.innerHeight * 0.6) return;
    const cx = e.clientX / window.innerWidth  - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    if (glowL) glowL.style.transform = `translate(${cx * 28}px, calc(40% + ${cy * 18}px))`;
    if (glowR) glowR.style.transform = `translate(${cx * -18}px, ${cy * 12}px)`;
  });
})();


/* ── 3. SCROLL REVEAL (fade + slide-up) ─────── */
(function scrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      /* stagger entre hermanos */
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal')
      );
      const idx   = siblings.indexOf(entry.target);
      const delay = idx * 90;
      entry.target.style.transitionDelay = delay + 'ms';
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  items.forEach(el => io.observe(el));
})();


/* ── 4. BARRAS DE IDIOMA ────────────────────── */
(function langBars() {
  const fills = document.querySelectorAll('.lang-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const pct = entry.target.dataset.w || '0';
      entry.target.style.width = pct + '%';
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  fills.forEach(el => {
    el.style.width = '0%';
    io.observe(el);
  });
})();


/* ── 5. EFECTO DE ESCRITURA EN EYEBROW ──────── */
(function typingEffect() {
  const el = document.querySelector('.hero__eyebrow');
  if (!el) return;

  /* guardar texto y dots */
  const text = 'Presentación Personal';
  const dots = el.querySelectorAll('.e-dot');

  /* ocultar texto pero dejar dots */
  const span = document.createElement('span');
  span.className = 'eyebrow-typed';
  el.insertBefore(span, dots[1]);
  span.textContent = '';

  /* eliminar texto nodo de texto directo */
  el.childNodes.forEach(node => {
    if (node.nodeType === 3) node.textContent = '';
  });

  let i = 0;
  const interval = setInterval(() => {
    span.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 60);
})();


/* ── 6. SMOOTH SCROLL en anclas internas ─────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
