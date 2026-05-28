/* ==========================================================================
   HARRY MUSIC PORTFOLIO REDESIGN - HIGH-PERFORMANCE ANIMATIONS DRIVER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     1. THEME SWITCHER SYSTEM
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve previous choice or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    // Smooth cursor pulse accent on toggling
    const cursor = document.getElementById('customCursor');
    const glow = document.getElementById('cursorGlow');
    if (cursor && glow) {
      gsap.to(cursor, { scale: 2.2, duration: 0.12, yoyo: true, repeat: 1 });
      gsap.to(glow, { scale: 1.6, duration: 0.12, yoyo: true, repeat: 1 });
    }
  });

  /* ==========================================================================
     2. IMMEDIATE CINEMATIC ENTRANCE
     ========================================================================== */
  // Trigger butter-smooth landing entrance immediately on load
  runHeroEntrance();

  /* ==========================================================================
     3. HERO BUTTER-SMOOTH ENTRANCE TIMELINE
     ========================================================================== */
  function runHeroEntrance() {
    const heroTl = gsap.timeline();
    
    // Curved capsule Nav Bar slides down
    heroTl.fromTo('.navbar', 
      { y: -120, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out' }
    );

    // Profile orbital bubble zooms and rotates smoothly
    heroTl.fromTo('.profile-glow-ring',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.4, ease: 'elastic.out(1, 0.75)' },
      "-=0.7"
    );

    // Fade-in floating bubble accents
    heroTl.fromTo('.floating-bubble-accent',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
      "-=0.9"
    );

    // Hero title text revealing
    heroTl.fromTo('.hero-subtitle-top',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      "-=1.1"
    );

    heroTl.fromTo('.hero-title',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
      "-=1.0"
    );

    heroTl.fromTo('.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      "-=0.9"
    );

    heroTl.fromTo('.hero-slogan',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
      "-=0.8"
    );

    // CTA glass buttons stagged slide-up
    heroTl.fromTo('.hero-cta-group .cta-btn',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      "-=0.8"
    );

    // Scroll Down indicator fades
    heroTl.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power1.out' },
      "-=0.4"
    );
  }

  /* ==========================================================================
     4. ELASTIC CUSTOM CURSOR TRACKING
     ========================================================================== */
  const cursor = document.getElementById('customCursor');
  const glow = document.getElementById('cursorGlow');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    // Standard tracking for center pointer
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;
    
    // Smooth elastic lag tracking for outer circle aura
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    if (cursor && glow) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Scale cursor aura on hovering link/button cards
  const interactives = document.querySelectorAll('a, button, select, input, textarea, .genre-pill, .music-card-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      glow.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      glow.classList.remove('hovered');
    });
  });

  /* ==========================================================================
     5. RESPONSIVE CANVAS WAVEFORM SIMULATOR
     ========================================================================== */
  const canvas = document.getElementById('wavesCanvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Sinusoidal Wave configurations
  let waveSpeed = 0.012;
  let waveInc = 0;
  
  let targetAmplitude = 30;
  let currentAmplitude = 30;
  
  // Track scroll speed dynamics
  let lastScrollTop = 0;
  let scrollSpeed = 0;
  
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    scrollSpeed = Math.min(Math.abs(st - lastScrollTop) * 0.9, 130);
    lastScrollTop = st <= 0 ? 0 : st;
  });

  function drawSinewave(y, frequency, amplitude, phase, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    for (let x = 0; x < width; x++) {
      const offset = Math.sin(x * frequency + phase) * amplitude;
      
      // Curved mouse attraction mathematics
      const mouseDist = Math.abs(mouseX - x);
      const mouseInfluence = mouseDist < 300 ? (300 - mouseDist) / 300 : 0;
      const mouseOffset = Math.sin((mouseY - y) * 0.004) * mouseInfluence * 22;

      if (x === 0) {
        ctx.moveTo(x, y + offset + mouseOffset);
      } else {
        ctx.lineTo(x, y + offset + mouseOffset);
      }
    }
    ctx.stroke();
  }

  function renderWaves() {
    ctx.clearRect(0, 0, width, height);

    // Responsive spring-like amplitude change
    targetAmplitude = 25 + scrollSpeed;
    currentAmplitude += (targetAmplitude - currentAmplitude) * 0.08;
    scrollSpeed *= 0.94; // Decay scroll acceleration

    const phaseShift = waveInc;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Tailored light/dark colors
    const colorGold = isDark ? 'rgba(255, 215, 0, 0.12)' : 'rgba(197, 160, 89, 0.16)';
    const colorViolet = isDark ? 'rgba(200, 80, 255, 0.06)' : 'rgba(0, 122, 255, 0.06)';
    const colorMuted = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.02)';

    // Render 4 layered wavy threads
    drawSinewave(height * 0.44, 0.0018, currentAmplitude * 1.3, phaseShift, colorGold, 2.5);
    drawSinewave(height * 0.49, 0.0028, currentAmplitude * 0.7, -phaseShift * 1.6, colorViolet, 1.5);
    drawSinewave(height * 0.54, 0.0012, currentAmplitude * 1.6, phaseShift * 0.7, colorMuted, 3);
    drawSinewave(height * 0.47, 0.0035, currentAmplitude * 0.4, phaseShift * 2.2, colorGold, 1);

    waveInc += waveSpeed;
    requestAnimationFrame(renderWaves);
  }
  renderWaves();

  /* ==========================================================================
     6. NAVBAR RESIZING & BLUR
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     7. MOBILE DRAWER MENUS TOGGLE
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  /* ==========================================================================
     8. ABOUT BIO TEXT REVEAL TIMELINES
     ========================================================================== */
  const bioParas = document.querySelectorAll('.about-bio-text .reveal-text');
  bioParas.forEach((p, idx) => {
    gsap.fromTo(p,
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Bio Badges Cascading entrance
  gsap.fromTo('.bio-badge',
    { x: -30, opacity: 0, scale: 0.9 },
    {
      x: 0, opacity: 1, scale: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.bio-badge-row',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }
  );

  /* ==========================================================================
     9. STATS INTEGRATION COUNTING MATH
     ========================================================================== */
  const statsList = document.querySelectorAll('.stat-number');
  
  statsList.forEach(stat => {
    const targetVal = parseInt(stat.getAttribute('data-target'));
    const appendStr = stat.getAttribute('data-append') || '';
    if (isNaN(targetVal)) return;

    const countObj = { val: 0 };
    
    gsap.to(countObj, {
      val: targetVal,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 92%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        stat.innerText = Math.floor(countObj.val) + appendStr;
      }
    });
  });

  // Staggered Fade-in and Zoom for the Stat Cards
  gsap.fromTo('.stat-card',
    { y: 30, opacity: 0, scale: 0.95 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '#statsGrid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );

  /* ==========================================================================
     10. GENRES GRID CASCADING ENTRANCE
     ========================================================================== */
  gsap.fromTo('.genre-pill',
    { y: 30, opacity: 0, scale: 0.9 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#genreTicker',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );

  /* ==========================================================================
     11. SERVICES CASCADE STAGGERED FADE-IN
     ========================================================================== */
  gsap.fromTo('.service-card',
    { y: 35, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );

  /* ==========================================================================
     12. DYNAMIC GENRE FILTERING FOR SHOWCASE CARDS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const musicCards = document.querySelectorAll('.music-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-filter');

      // Smooth exit scaling of cards
      gsap.to('.music-card-item', {
        scale: 0.9,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          musicCards.forEach(card => {
            const genres = card.getAttribute('data-genres').split(' ');
            
            if (filterType === 'all' || genres.includes(filterType)) {
              card.style.display = 'block';
              // Staggered entrance timeline
              gsap.fromTo(card,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out' }
              );
            } else {
              card.style.display = 'none';
            }
          });
          ScrollTrigger.refresh();
        }
      });
    });
  });

  /* ==========================================================================
     13. TWO TESTIMONIAL SLIDES CAROUSEL LOOP
     ========================================================================== */
  const testimonialsWrapper = document.getElementById('testimonialsWrapper');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const sliderDots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function goToSlide(slideIdx) {
    if (slideIdx < 0 || slideIdx >= testimonialCards.length) return;

    currentSlide = slideIdx;

    // Shift wrapper
    gsap.to(testimonialsWrapper, {
      xPercent: -100 * currentSlide,
      duration: 0.75,
      ease: 'power3.out'
    });

    // Update active states
    testimonialCards.forEach((card, idx) => {
      if (idx === currentSlide) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update dots indicators
    sliderDots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  sliderDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-slide'));
      goToSlide(target);
    });
  });

  // Autoplay Testimonial slider every 6.5 seconds
  let autoplaySlider = setInterval(() => {
    let nextSlide = currentSlide + 1;
    if (nextSlide >= testimonialCards.length) {
      nextSlide = 0;
    }
    goToSlide(nextSlide);
  }, 6500);

  // Pause autoplay on manual hover
  const sliderContainer = document.querySelector('.testimonials-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(autoplaySlider);
    });
    sliderContainer.addEventListener('mouseleave', () => {
      autoplaySlider = setInterval(() => {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= testimonialCards.length) {
          nextSlide = 0;
        }
        goToSlide(nextSlide);
      }, 6500);
    });
  }

  // Refresh ScrollTrigger positions after all external widgets (Spotify iframe, cover arts) have loaded
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

});
