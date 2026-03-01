// Scroll reveal using IntersectionObserver
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // reveal all immediately if user prefers reduced motion
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // optionally unobserve to improve performance
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // simple parallax on hero background
  const heroBg = document.querySelector('.hero-bg');
  document.addEventListener('mousemove', (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = (e.clientX / w - 0.5) * 12; // tweak intensity
    const y = (e.clientY / h - 0.5) * 8;
    heroBg.style.transform = `translate(${x}px, ${y}px)`;
  });
})();