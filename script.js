/* ================================================================
   MD Aslam Kawari — Portfolio
   script.js
   ================================================================ */

/* ── Particle System ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 204, ${this.alpha})`;
    ctx.fill();
  };

  function init() {
    resize();
    const count = Math.min(120, Math.floor((W * H) / 12000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 204, ${0.06 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 255, 204, ${0.15 * (1 - d / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  init();
  animate();
})();

/* ── Typing Effect ── */
(function () {
  const roles = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'IT Student @ SAIM',
    'Club President',
    'Problem Solver',
  ];
  const el  = document.getElementById('typedRole');
  let ri = 0, ci = 0, deleting = false, wait = 0;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; wait = 60; }
    } else {
      if (--wait > 0) { setTimeout(type, 20); return; }
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }

  setTimeout(type, 600);
})();

/* ── Scroll Animations (IntersectionObserver) ── */
(function () {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          animateSkillBars(e.target);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  function animateSkillBars(container) {
    const fills = container.querySelectorAll
      ? container.querySelectorAll('.skill-fill')
      : [];
    fills.forEach(fill => {
      const pct = fill.getAttribute('data-pct');
      if (pct) setTimeout(() => { fill.style.width = pct + '%'; }, 300);
    });
  }

  const allSkillCards = document.querySelectorAll('.skill-card');
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-fill');
        const pct  = fill && fill.getAttribute('data-pct');
        if (pct) setTimeout(() => { fill.style.width = pct + '%'; }, 200);
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  allSkillCards.forEach(c => skillObs.observe(c));
})();

/* ── Active Nav Dot on Scroll ── */
(function () {
  const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];
  const dots     = document.querySelectorAll('.nav-dot');

  function setActive(id) {
    dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + id));
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ── Smooth internal link scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Card tilt on hover (subtle) ── */
document.querySelectorAll('.skill-card, .cert-card, .tl-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
