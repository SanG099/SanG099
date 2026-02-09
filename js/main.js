/* =============================================
   MAIN.JS — Interactions, Animations & Canvas
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initScrollReveal();
  initTechBars();
  initProjectFilters();
  initCountUp();
  initBackgroundCanvas();
  initSmoothScroll();
  initActiveNavTracking();
});


/* =============================================
   1. NAVBAR — Scroll Effect
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load
}


/* =============================================
   2. MOBILE MENU — Hamburger Toggle
   ============================================= */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}


/* =============================================
   3. THEME TOGGLE — Dark / Light Mode
   ============================================= */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'dark'); // default dark

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', next);

    // Restart canvas with new colors
    reinitCanvas();
  });
}

function reinitCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  // Canvas will pick up new CSS opacity; re-trigger particle colors on next frame
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  canvas.style.opacity = isLight ? '0.15' : '0.4';
}


/* =============================================
   4. SCROLL REVEAL — Intersection Observer
   ============================================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}


/* =============================================
   5. TECH SKILL BARS — Animate on Scroll
   ============================================= */
function initTechBars() {
  const bars = document.querySelectorAll('.tech-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
}


/* =============================================
   6. PROJECT FILTERS — Category Toggle
   ============================================= */
function initProjectFilters() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fade-in-up 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}


/* =============================================
   7. COUNT-UP ANIMATION — Hero Stats
   ============================================= */
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.getAttribute('data-target'));
  const duration = 2000; // ms
  const start    = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}


/* =============================================
   8. BACKGROUND CANVAS — Blinking Stars & Constellations
   ============================================= */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, stars, animationId;
  let mouse = { x: null, y: null };
  const CONNECTION_DIST = 140;
  const MOUSE_RADIUS = 200;

  // Star colors — mix of white, mint, blue, and purple tints
  const starColors = [
    { r: 255, g: 255, b: 255 },   // white
    { r: 0,   g: 229, b: 160 },   // mint
    { r: 59,  g: 130, b: 246 },   // blue
    { r: 167, g: 139, b: 250 },   // purple
    { r: 200, g: 220, b: 255 },   // ice-blue
  ];

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStars() {
    const count = Math.floor((width * height) / 9000);
    stars = [];

    for (let i = 0; i < count; i++) {
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      stars.push({
        x:  Math.random() * width,
        y:  Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        baseR: Math.random() * 1.8 + 0.3,
        r: 0,
        // Blink properties
        blinkSpeed: Math.random() * 0.02 + 0.005,
        blinkPhase: Math.random() * Math.PI * 2,
        brightness: 0,
        // Color
        color: color,
        // Some stars are "bright" — they pulse more dramatically
        isBright: Math.random() < 0.15,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // ---- Draw constellation connections ----
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = 0.12 * (1 - dist / CONNECTION_DIST);
          // Blend both star colors for the connection line
          const cA = stars[i].color;
          const cB = stars[j].color;
          const mr = Math.round((cA.r + cB.r) / 2);
          const mg = Math.round((cA.g + cB.g) / 2);
          const mb = Math.round((cA.b + cB.b) / 2);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${opacity * Math.min(stars[i].brightness, stars[j].brightness)})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }

    // ---- Mouse constellation: connect nearby stars to cursor ----
    if (mouse.x !== null) {
      stars.forEach(s => {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const opacity = 0.25 * (1 - dist / MOUSE_RADIUS);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 229, 160, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }
      });
    }

    // ---- Draw stars ----
    stars.forEach(s => {
      // Blink: oscillate brightness
      const blinkVal = Math.sin(time * s.blinkSpeed + s.blinkPhase);
      // Map sin(-1..1) to brightness(0.2..1)
      s.brightness = 0.3 + 0.7 * ((blinkVal + 1) / 2);

      // Bright stars get bigger pulse
      const sizeMultiplier = s.isBright ? (0.6 + 0.4 * ((blinkVal + 1) / 2)) : (0.8 + 0.2 * ((blinkVal + 1) / 2));
      s.r = s.baseR * sizeMultiplier;

      const c = s.color;
      const alpha = s.brightness * (s.isBright ? 0.9 : 0.6);

      // Glow for bright stars
      if (s.isBright && s.brightness > 0.7) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
      ctx.fill();

      // Move slowly (drifting stars)
      s.x += s.vx;
      s.y += s.vy;

      // Wrap around edges
      if (s.x < -10) s.x = width + 10;
      if (s.x > width + 10) s.x = -10;
      if (s.y < -10) s.y = height + 10;
      if (s.y > height + 10) s.y = -10;

      // Gentle mouse repulsion
      if (mouse.x !== null) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          s.x += dx / dist * force * 0.5;
          s.y += dy / dist * force * 0.5;
        }
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      createStars();
      draw(0);
    }, 200);
  });

  // Init
  resize();
  createStars();
  draw(0);
}


/* =============================================
   9. SMOOTH SCROLL — Anchor Links
   ============================================= */
function initSmoothScroll() {
  const allNavLinks = document.querySelectorAll('.nav-link');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Immediately highlight clicked nav link
      if (this.classList.contains('nav-link') && !this.classList.contains('nav-link--cta')) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* =============================================
   10. ACTIVE NAV TRACKING — Scroll Spy
   ============================================= */
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  if (!sections.length || !navLinks.length) return;

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let currentSection = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    // Also check if at the very bottom (footer/contact)
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
      currentSection = 'contact';
    }

    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // Run on load
}
