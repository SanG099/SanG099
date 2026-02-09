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
  initTypingEffect();
  initTiltCards();
  initMagneticButtons();
  initParallaxFloat();
  initSectionCountReveal();
  initDataScramble();
  initDataTicker();
  initSectionTitleDecode();
  initFloatCardDataStream();
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

  // Star colors — mix of white, green, red, and warm tints
  const starColors = [
    { r: 255, g: 255, b: 255 },   // white
    { r: 0,   g: 200, b: 83  },   // green
    { r: 229, g: 57,  b: 53  },   // red
    { r: 255, g: 111, b: 97  },   // coral
    { r: 200, g: 230, b: 200 },   // light green
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
          ctx.strokeStyle = `rgba(0, 200, 83, ${opacity})`;
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


/* =============================================
   11. TYPING EFFECT — Hero Subtitle
   ============================================= */
function initTypingEffect() {
  const heroTag = document.querySelector('.hero-tag');
  if (!heroTag) return;

  const originalText = heroTag.textContent;
  heroTag.textContent = '';
  heroTag.style.borderRight = '2px solid var(--mint)';
  heroTag.style.display = 'inline-block';

  let i = 0;
  const speed = 40;

  function type() {
    if (i < originalText.length) {
      heroTag.textContent += originalText.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Blink cursor then remove
      setTimeout(() => {
        heroTag.style.borderRight = 'none';
      }, 1500);
    }
  }

  // Start typing after a short delay
  setTimeout(type, 600);
}


/* =============================================
   12. TILT EFFECT — Cards on Mouse Move
   ============================================= */
function initTiltCards() {
  const cards = document.querySelectorAll('.tech-card, .project-card, .float-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}


/* =============================================
   13. MAGNETIC BUTTONS — Pull towards cursor
   ============================================= */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn, .filter-btn, .theme-toggle, .nav-link--cta');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}


/* =============================================
   14. PARALLAX FLOAT — Hero elements on scroll
   ============================================= */
function initParallaxFloat() {
  const hero = document.querySelector('.hero');
  const floatCards = document.querySelectorAll('.float-card');
  const heroGraphic = document.querySelector('.hero-graphic');
  if (!hero || !floatCards.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroBottom = hero.offsetHeight;

    if (scrollY < heroBottom) {
      const progress = scrollY / heroBottom;

      floatCards.forEach((card, index) => {
        const speed = 0.3 + (index * 0.15);
        const yOffset = scrollY * speed;
        const rotate = progress * (index % 2 === 0 ? 3 : -3);
        card.style.transform = `translateY(${-yOffset * 0.2}px) rotate(${rotate}deg)`;
      });

      if (heroGraphic) {
        heroGraphic.style.transform = `translateY(${scrollY * 0.08}px)`;
      }
    }
  }, { passive: true });
}


/* =============================================
   15. STAGGERED CHILDREN REVEAL — Section extras
   ============================================= */
function initSectionCountReveal() {
  // Animate insight metrics on scroll
  const insightMetrics = document.querySelectorAll('.insight-metric');
  if (insightMetrics.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const metrics = entry.target.querySelectorAll('.insight-metric');
            metrics.forEach((metric, i) => {
              metric.style.opacity = '0';
              metric.style.transform = 'translateY(20px)';
              setTimeout(() => {
                metric.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                metric.style.opacity = '1';
                metric.style.transform = 'translateY(0)';
              }, i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const metricsContainer = document.querySelector('.insight-metrics');
    if (metricsContainer) observer.observe(metricsContainer);
  }

  // Animate project tech tags on hover
  document.querySelectorAll('.project-card').forEach(card => {
    const tags = card.querySelectorAll('.project-tech-tags span');

    card.addEventListener('mouseenter', () => {
      tags.forEach((tag, i) => {
        tag.style.transition = `all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`;
        tag.style.transform = 'translateY(-2px)';
        tag.style.borderColor = 'rgba(0, 200, 83, 0.3)';
        tag.style.color = 'var(--mint)';
      });
    });

    card.addEventListener('mouseleave', () => {
      tags.forEach(tag => {
        tag.style.transform = '';
        tag.style.borderColor = '';
        tag.style.color = '';
      });
    });
  });

  // Smooth number scramble for stat numbers
  document.querySelectorAll('.stat-number').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const target = parseInt(el.getAttribute('data-target'));
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = Math.floor(Math.random() * target * 1.2).toLocaleString();
        iterations++;
        if (iterations > 8) {
          clearInterval(interval);
          el.textContent = target.toLocaleString();
        }
      }, 50);
    });
  });
}


/* =============================================
   16. DATA SCRAMBLE — Matrix-style text decode
   ============================================= */
function initDataScramble() {
  const dataChars = '█▓▒░01{}[]<>|/\\#$%&@!?+=-_.,:;~^*αβγδΣΔΩπ∞∑∏√∫≈≠≤≥';
  const scrambles = document.querySelectorAll('.data-scramble');
  if (!scrambles.length) return;

  scrambles.forEach(el => {
    const finalText = el.getAttribute('data-final') || el.textContent;
    el.textContent = '';
    el.setAttribute('data-final', finalText);

    // Create character spans
    const chars = [];
    for (let i = 0; i < finalText.length; i++) {
      const span = document.createElement('span');
      span.className = 'char scrambling';
      span.textContent = dataChars[Math.floor(Math.random() * dataChars.length)];
      span.dataset.final = finalText[i];
      span.dataset.index = i;
      el.appendChild(span);
      chars.push(span);
    }

    // Add blinking cursor at the end
    const cursor = document.createElement('span');
    cursor.className = 'data-cursor';
    el.appendChild(cursor);

    // Scramble animation — characters resolve left-to-right
    let resolved = 0;
    const totalDuration = 1800; // ms total for full text
    const perCharDelay = totalDuration / finalText.length;

    function scrambleLoop() {
      // Rapidly cycle unresolved characters
      chars.forEach((span, i) => {
        if (i >= resolved) {
          span.textContent = dataChars[Math.floor(Math.random() * dataChars.length)];
        }
      });

      if (resolved < chars.length) {
        requestAnimationFrame(scrambleLoop);
      }
    }

    // Start after page loads
    setTimeout(() => {
      scrambleLoop();

      // Resolve characters one by one
      chars.forEach((span, i) => {
        setTimeout(() => {
          span.textContent = span.dataset.final;
          span.classList.remove('scrambling');
          span.classList.add('resolved');
          resolved++;
        }, 400 + i * perCharDelay);
      });

      // Remove cursor after all resolved
      setTimeout(() => {
        cursor.style.transition = 'opacity 0.5s';
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 500);
      }, 400 + chars.length * perCharDelay + 500);
    }, 800);
  });
}


/* =============================================
   17. DATA TICKER — Live data stream
   ============================================= */
function initDataTicker() {
  const ticker = document.getElementById('dataTicker');
  if (!ticker) return;

  const dataPoints = [
    { label: 'REVENUE',    value: '+24.3%',   cls: 'tick-value' },
    { label: 'CHURN',      value: '-18.2%',   cls: 'tick-down' },
    { label: 'ACCURACY',   value: '91.4%',    cls: 'tick-value' },
    { label: 'ROWS',       value: '500,247',  cls: 'tick-neutral' },
    { label: 'F1_SCORE',   value: '0.884',    cls: 'tick-value' },
    { label: 'P_VALUE',    value: '0.003',    cls: 'tick-value' },
    { label: 'ROI',        value: '3.2×',     cls: 'tick-value' },
    { label: 'TIME_SAVED', value: '-42%',     cls: 'tick-down' },
    { label: 'FEATURES',   value: '15',       cls: 'tick-neutral' },
    { label: 'CUSTOMERS',  value: '12,847',   cls: 'tick-neutral' },
    { label: 'SEGMENTS',   value: '8',        cls: 'tick-neutral' },
    { label: 'R²',         value: '0.923',    cls: 'tick-value' },
  ];

  // Create two copies for seamless loop
  let html = '';
  for (let copy = 0; copy < 3; copy++) {
    dataPoints.forEach(dp => {
      html += `<span class="tick-item">${dp.label}: <span class="${dp.cls}">${dp.value}</span></span>`;
    });
  }

  ticker.innerHTML = html;

  // Animate — shift left continuously
  let position = 0;
  const speed = 0.5;

  function scrollTicker() {
    position -= speed;
    const totalWidth = ticker.scrollWidth / 3;
    if (Math.abs(position) >= totalWidth) {
      position = 0;
    }
    ticker.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(scrollTicker);
  }

  scrollTicker();

  // Randomly update a value every 3s to simulate live data
  setInterval(() => {
    const allValues = ticker.querySelectorAll('.tick-value, .tick-down');
    if (!allValues.length) return;
    const randomEl = allValues[Math.floor(Math.random() * allValues.length)];

    // Flash effect
    randomEl.style.transition = 'none';
    randomEl.style.textShadow = '0 0 10px currentColor';
    randomEl.style.transform = 'scale(1.1)';

    // Parse and slightly change value
    const original = randomEl.textContent;
    const numMatch = original.match(/[\\d.]+/);
    if (numMatch) {
      const num = parseFloat(numMatch[0]);
      const delta = (Math.random() - 0.5) * num * 0.05;
      const newNum = (num + delta).toFixed(original.includes('.') ? original.split('.')[1]?.replace(/[^\\d]/g, '').length || 1 : 0);
      randomEl.textContent = original.replace(numMatch[0], newNum);
    }

    setTimeout(() => {
      randomEl.style.transition = 'all 0.5s';
      randomEl.style.textShadow = '';
      randomEl.style.transform = '';
    }, 300);
  }, 3000);
}


/* =============================================
   18. SECTION TITLE DECODE — Data viz reveal
   ============================================= */
function initSectionTitleDecode() {
  const dataChars = '0123456789#$%&@!?█▓▒░{}[]<>';
  const sectionTitles = document.querySelectorAll('.section-title');
  if (!sectionTitles.length) return;

  sectionTitles.forEach(title => {
    // Skip hero title
    if (title.closest('.hero-content')) return;

    const originalText = title.textContent;
    title.textContent = '';

    // Wrap each character
    for (let i = 0; i < originalText.length; i++) {
      const span = document.createElement('span');
      span.className = 'char-reveal';
      span.textContent = originalText[i];
      span.dataset.final = originalText[i];
      span.dataset.index = i;
      title.appendChild(span);
    }
  });

  // Observe each section title
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chars = entry.target.querySelectorAll('.char-reveal');

          chars.forEach((span, i) => {
            const delay = i * 30;

            // Phase 1: Show with random data character
            setTimeout(() => {
              span.classList.add('visible', 'decoding');
              span.textContent = span.dataset.final === ' ' ? ' ' : dataChars[Math.floor(Math.random() * dataChars.length)];
            }, delay);

            // Phase 2: Scramble 2-3 times
            setTimeout(() => {
              if (span.dataset.final !== ' ') {
                span.textContent = dataChars[Math.floor(Math.random() * dataChars.length)];
              }
            }, delay + 60);

            // Phase 3: Resolve to final character
            setTimeout(() => {
              span.textContent = span.dataset.final;
              span.classList.remove('decoding');
            }, delay + 120);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  sectionTitles.forEach(title => {
    if (!title.closest('.hero-content')) {
      observer.observe(title);
    }
  });
}


/* =============================================
   19. FLOAT CARD DATA STREAM — Randomize readouts
   ============================================= */
function initFloatCardDataStream() {
  const readouts = document.querySelectorAll('.data-readout');
  if (!readouts.length) return;

  const streamChars = '█▓▒░▁▂▃▄▅▆▇◆◇●○■□▪▫';

  readouts.forEach(readout => {
    const base = readout.textContent;

    setInterval(() => {
      let newText = '';
      for (let i = 0; i < base.length; i++) {
        if (base[i] === ' ' || Math.random() < 0.6) {
          newText += base[i];
        } else {
          newText += streamChars[Math.floor(Math.random() * streamChars.length)];
        }
      }
      readout.textContent = newText;
    }, 150);
  });
}
