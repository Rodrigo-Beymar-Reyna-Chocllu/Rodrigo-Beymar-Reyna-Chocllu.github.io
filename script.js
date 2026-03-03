/* =============================================
   script.js — Animaciones e Interactividad
   ============================================= */

/* ── 1. PARTÍCULAS EN CANVAS ─────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.a  = Math.random() * 0.5 + 0.1;
      this.da = (Math.random() - 0.5) * 0.003;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if (this.a <= 0.05 || this.a >= 0.7) this.da *= -1;
      if (this.y < -10) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.a);
      ctx.fillStyle   = '#00c8ff';
      ctx.shadowBlur  = 6;
      ctx.shadowColor = 'rgba(0,200,255,0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function makeParticles() {
    const count = Math.floor((W * H) / 18000);
    particles = Array.from({ length: Math.min(count, 90) }, () => new Particle());
  }

  /* Líneas de conexión entre partículas cercanas */
  function drawLines() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - d / maxDist) * 0.12;
          ctx.strokeStyle = '#00c8ff';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); makeParticles(); });
  resize();
  makeParticles();
  loop();
})();


/* ── 2. PARALLAX SUAVE EN EL HERO ───────────────── */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const glowL = document.querySelector('.hero__glow-left');
  const glowR = document.querySelector('.hero__glow-right');

  document.addEventListener('mousemove', e => {
    if (window.scrollY > window.innerHeight) return;
    const cx = e.clientX / window.innerWidth  - 0.5;  // -0.5 … 0.5
    const cy = e.clientY / window.innerHeight - 0.5;

    if (glowL) glowL.style.transform = `translate(${cx * 30}px, calc(-50% + ${cy * 20}px))`;
    if (glowR) glowR.style.transform = `translate(${cx * -20}px, ${cy * 15}px)`;

    /* leve movimiento de la cuadrícula de fondo */
    const overlay = document.querySelector('.hero__circuit-overlay');
    if (overlay) {
      overlay.style.backgroundPosition = `${cx * 15}px ${cy * 15}px`;
    }
  });
})();


/* ── 3. SCROLL REVEAL ───────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        /* stagger por orden entre hermanos */
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const delay    = siblings.indexOf(entry.target) * 100;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();


/* ── 4. BARRAS DE IDIOMA (animación por scroll) ─── */
(function initLangBars() {
  const fills = document.querySelectorAll('.lang-bar__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--pct') ||
          getComputedStyle(entry.target).getPropertyValue('--pct');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => {
    el.style.width = '0%';
    observer.observe(el);
  });
})();


/* ── 5. SECCIÓN ACTIVA (highlight header logos) ─── */
(function initActiveSection() {
  const sections = document.querySelectorAll('.cv-section, .hero');
  if (!sections.length) return;

  const logoUniv = document.querySelector('.hero__logo--univ');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && logoUniv) {
        logoUniv.style.filter =
          entry.target.id === 'top'
            ? 'drop-shadow(0 0 12px rgba(0,200,255,0.35))'
            : 'drop-shadow(0 0 18px rgba(0,200,255,0.55)) brightness(1.1)';
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(s => observer.observe(s));
})();


/* ── 6. TYPING EFFECT en el eyebrow del hero ────── */
(function initTyping() {
  const el = document.querySelector('.hero__eyebrow');
  if (!el) return;

  const original = el.innerText;
  el.innerText = '';
  el.style.opacity = '1';

  setTimeout(() => {
    let i = 0;
    const interval = setInterval(() => {
      el.innerText += original[i];
      i++;
      if (i >= original.length) clearInterval(interval);
    }, 55);
  }, 900);
})();


/* ── 7. SMOOTH SCROLL desde cualquier ancla ──────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
