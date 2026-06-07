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
  const interactives = document.querySelectorAll('a, button, select, input, textarea, .genre-pill, .music-card-item, .sound-kit-album-wrapper');
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
     5. RESPONSIVE CANVAS MUSIC NOTES ANIMATION
     ========================================================================== */
  const canvas = document.getElementById('wavesCanvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Music Notes Configuration
  const noteSymbols = ['♪', '♫', '♬', '♭', '♮'];
  const notes = [];
  const maxNotes = window.innerWidth > 768 ? 40 : 20;

  class MusicNote {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 50;
      this.size = Math.random() * 24 + 12;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = -(Math.random() * 1.5 + 0.5);
      this.opacity = Math.random() * 0.4 + 0.1;
      this.symbol = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.dr = (Math.random() - 0.5) * 0.05;
      this.colorIndex = Math.random();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.dr;
      
      // Mouse interaction (repel slightly or attract? repel is usually cooler)
      const dist = Math.hypot(mouseX - this.x, mouseY - this.y);
      if (dist < 150) {
        this.x -= (mouseX - this.x) * 0.03;
        this.y -= (mouseY - this.y) * 0.03;
      }

      if (this.y < -50 || this.x < -50 || this.x > width + 50) {
        this.reset();
      }
    }

    draw(ctx, isDark) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      let color;
      if (isDark) {
        color = this.colorIndex > 0.6 ? `rgba(255, 215, 0, ${this.opacity})` : 
                this.colorIndex > 0.2 ? `rgba(200, 80, 255, ${this.opacity})` : `rgba(255, 255, 255, ${this.opacity * 0.5})`;
      } else {
        color = this.colorIndex > 0.6 ? `rgba(197, 160, 89, ${this.opacity})` : 
                this.colorIndex > 0.2 ? `rgba(0, 122, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity * 0.5})`;
      }

      ctx.fillStyle = color;
      ctx.font = `${this.size}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < maxNotes; i++) {
    notes.push(new MusicNote());
  }

  function renderNotes() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    notes.forEach(note => {
      note.update();
      note.draw(ctx, isDark);
    });

    requestAnimationFrame(renderNotes);
  }
  renderNotes();

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

  /* ==========================================================================
     14. UPCOMING RELEASE COUNTDOWN TIMER
     ========================================================================== */
  // Moved to inline script inside index.html to guarantee immediate caching-independent execution

  // Pre-Save Spotify Alert trigger
  const preSaveBtn = document.getElementById('preSaveBtn');
  if (preSaveBtn) {
    preSaveBtn.addEventListener('click', () => {
      // Instantly open the Smartlink URL in a new tab to bypass modern popup blockers
      const preSaveUrl = "https://api.ffm.to/sl/e/ps/broken-saahil-nawaz?cd=eyJ1YSI6eyJ1YSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDguMC4wLjAgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXIiOnsibmFtZSI6IkNocm9tZSIsInZlcnNpb24iOiIxNDguMC4wLjAiLCJtYWpvciI6IjE0OCJ9LCJjcHUiOnsiYXJjaGl0ZWN0dXJlIjoiYW1kNjQifSwiZGV2aWNlIjp7fSwiZW5naW5lIjp7Im5hbWUiOiJCbGluayIsInZlcnNpb24iOiIxNDguMC4wLjAifSwib3MiOnsibmFtZSI6IldpbmRvd3MiLCJ2ZXJzaW9uIjoiMTAifX0sImNsaWVudCI6eyJyaWQiOiJhMWQ5NDI2YS00ZmQ0LTQzOWMtYjE3YS0yOWIwY2U0MTg1MmIiLCJzaWQiOiIzMmYyYjFjOS0zOTk4LTRlOTItODU4MC1kNGY3NDczMjRmYTMiLCJpcCI6IjIyMy4xOTAuODEuMjE2IiwicmVmIjoiIiwiaG9zdCI6ImRpdHRvLmZtIiwibGFuZyI6ImVuLVVTIiwiaXBDb3VudHJ5IjoiSU4ifSwiaXNXZWJwU3VwcG9ydGVkIjp0cnVlLCJnZHByRW5mb3JjZSI6ZmFsc2UsImNvdW50cnlDb2RlIjoiSU4iLCJpc0JvdCI6ZmFsc2UsInVzZUFmZiI6Im9yaWdpbiIsInZpZCI6Ijg1ODNmY2IwLWE5MDEtNGVmOS04MWEzLTRhZTVjMWZkOWU5NSIsImlkIjoiNmExZGFhNWQyYTAwMDA5OTAwNTE1MGFkIiwicHJ2IjpmYWxzZSwiaXNQcmVSIjp0cnVlLCJ0em8iOm51bGwsImNoIjpudWxsLCJhbiI6bnVsbCwiZGVzdFVybCI6Imh0dHBzOi8vYWNjb3VudHMuc3BvdGlmeS5jb20vYXV0aG9yaXplP2NsaWVudF9pZD02NmQzY2RiNDQ4MDc0YTBkODhlOWIwOGJhYWYyZjNkNyZyZXNwb25zZV90eXBlPWNvZGUmcmVkaXJlY3RfdXJpPWh0dHBzJTNBJTJGJTJGYXBpLmZmbS50byUyRndlYmhvb2slMkZzcG90aWZ5JTJGYXV0aG9yaXplJnNjb3BlPXVzZXItcmVhZC1wcml2YXRlJTIwdXNlci1yZWFkLWJpcnRoZGF0ZSUyMHVzZXItcmVhZC1lbWFpbCUyMHVzZXItbGlicmFyeS1tb2RpZnklMjB1c2VyLWxpYnJhcnktcmVhZCUyMHVzZXItcmVhZC1yZWNlbnRseS1wbGF5ZWQlMjB1c2VyLWZvbGxvdy1yZWFkJTIwdXNlci1mb2xsb3ctbW9kaWZ5JTIwdXNlci10b3AtcmVhZCUyMHBsYXlsaXN0LW1vZGlmeS1wdWJsaWMlMjBwbGF5bGlzdC1yZWFkLXByaXZhdGUlMjBwbGF5bGlzdC1tb2RpZnktcHJpdmF0ZSZzdGF0ZT1leUprWWt4cGJtdEpaQ0k2SWpaaE1XUmhZVFZrTW1Fd01EQXdPVGt3TURVeE5UQmhaQ0lzSW1GamRHbHZibFI1Y0dVaU9tNTFiR3dzSW1OMFlTSTZJbEJ5WlMxVFlYWmxJaXdpZFhObGNrTnZkVzUwY25raU9pSkpUaUlzSW5Ob2IzSjBTV1FpT2lKaWNtOXJaVzR0YzJGaGFHbHNMVzVoZDJGNklpd2laRzl0WVdsdUlqb2lhSFIwY0hNNkx5OWthWFIwYnk1bWJTSXNJbk5sY25acFkyVk9ZVzFsSWpvaWMzQnZkR2xtZVNJc0luQnliMlIxWTNRaU9pSnpiV0Z5ZEd4cGJtc2lMQ0p5WldScGNtVmpkRlZ5YVNJNkltaDBkSEJ6T2k4dlpHbDBkRzh1Wm0wdlluSnZhMlZ1TFhOaFlXaHBiQzF1WVhkaGVpOXdjbVZ6WVhabFkyRnNiR0poWTJzaUxDSm1ZV3hzWW1GamExVnliQ0k2Ym5Wc2JDd2lhWE5RY21WU1pXeGxZWE5sSWpwMGNuVmxMQ0pwYzBaMWRIVnlaVkpsYkdWaGMyVWlPblJ5ZFdVc0ltRnlkR2x6ZEVsa0lqb2lOamxtTW1Ka01qQXlZakF3TURBek5EQXdabVkzWTJaaElpd2lZWEowYVhOMFQzZHVaWElpT2lJMVl6VXdZalV4WkRFME1EQXdNREU1TURBMk9EWTRPVEVpTENKaFkzUnBiMjVKWkNJNmJuVnNiQ3dpWjJSd2NrVnVabTl5WTJVaU9tWmhiSE5sTENKc2FXNXJWSGx3WlNJNmJuVnNiQ3dpZFhObGNrbFFJam9pTWpJekxqRTVNQzQ0TVM0eU1UWWlMQ0p5WlhkaGNtUlZjMlZ5U1dRaU9tNTFiR3dzSW5KbFptVnljbUZzU1dRaU9tNTFiR3dzSW5WMWFXUWlPaUk0TlRnelptTmlNQzFoT1RBeExUUmxaamt0T0RGaE15MDBZV1UxWXpGbVpEbGxPVFVpZlEmMTAxMWxqd0VIIiwic3J2YyI6InNwb3RpZnkiLCJwcm9kdWN0Ijoic21hcnRsaW5rIiwic2hvcnRJZCI6ImJyb2tlbi1zYWFoaWwtbmF3YXoiLCJpc0F1dGhvcml6YXRpb25SZXF1aXJlZCI6dHJ1ZSwib3duZXIiOiI1YzUwYjUxZDE0MDAwMDE5MDA2ODY4OTEiLCJ0ZW5hbnQiOiI1ZDJjMjk2M2YwZDUxZWViZDI0ZTc3ODciLCJhciI6IjY5ZjJiZDIwMmIwMDAwMzQwMGZmN2NmYSIsImlzU2hvcnRMaW5rIjpmYWxzZSwibmF0aXZlIjpmYWxzZX0=";
      window.open(preSaveUrl, "_blank");

      // Dynamic animation and loading state indicators on button
      preSaveBtn.disabled = true;
      preSaveBtn.innerHTML = `
        <svg class="animate-spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" style="margin-right: 8px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle><path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"></path></svg>
        <span>Syncing Spotify...</span>
      `;
      
      setTimeout(() => {
        preSaveBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="margin-right: 8px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          <span>Pre-Saved on Spotify!</span>
        `;
      }, 1500);
    });
  }

  /* ==========================================================================
     15. SHATTERED GLASS PARTICLE SIMULATOR FOR TEASER
     ========================================================================== */
  const tCanvas = document.getElementById('teaserCanvas');
  if (tCanvas) {
    const tCtx = tCanvas.getContext('2d');
    let tWidth = tCanvas.width = tCanvas.parentElement.clientWidth;
    let tHeight = tCanvas.height = tCanvas.parentElement.clientHeight;

    window.addEventListener('resize', () => {
      if (tCanvas.parentElement) {
        tWidth = tCanvas.width = tCanvas.parentElement.clientWidth;
        tHeight = tCanvas.height = tCanvas.parentElement.clientHeight;
      }
    });

    const particles = [];
    const particleCount = 20;

    class GlassShardParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * tWidth;
        this.y = Math.random() * tHeight;
        this.size = 5 + Math.random() * 15;
        this.speedX = -0.2 + Math.random() * 0.4;
        this.speedY = -0.1 - Math.random() * 0.3;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.points = [];
        
        // Generate random triangle shard points
        const sides = 3;
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides;
          const r = this.size * (0.6 + Math.random() * 0.4);
          this.points.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r
          });
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if goes off screen
        if (this.y < -30 || this.x < -30 || this.x > tWidth + 30) {
          this.reset();
          this.y = tHeight + 20;
        }
      }

      draw() {
        tCtx.save();
        tCtx.translate(this.x, this.y);
        tCtx.beginPath();
        tCtx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          tCtx.lineTo(this.points[i].x, this.points[i].y);
        }
        tCtx.closePath();
        
        // Shimmering color
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const color = isDark ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(225, 48, 108, ${this.opacity * 0.4})`;
        
        tCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(225,48,108,0.08)';
        tCtx.lineWidth = 1;
        tCtx.fillStyle = color;
        
        tCtx.fill();
        tCtx.stroke();
        tCtx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new GlassShardParticle());
    }

    function animateTeaserParticles() {
      tCtx.clearRect(0, 0, tWidth, tHeight);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateTeaserParticles);
    }
    animateTeaserParticles();
  }

  /* ==========================================================================
     16. LATEST DROPS PROMO TOASTER POPUPS (BOTTOM RIGHT)
     ========================================================================== */
  const promoToastSong = document.getElementById('promoToastSong');
  const promoToastKit = document.getElementById('promoToastKit');
  const closeToastSong = document.getElementById('closeToastSong');
  const closeToastKit = document.getElementById('closeToastKit');

  if (promoToastSong && promoToastKit && closeToastSong && closeToastKit) {
    const hasSeenPromoSong = sessionStorage.getItem('hasSeenPromoSong');
    const hasSeenPromoKit = sessionStorage.getItem('hasSeenPromoKit');
    
    // Song Toast (triggers first at 1.5s)
    if (!hasSeenPromoSong) {
      setTimeout(() => {
        promoToastSong.classList.add('active');
      }, 1500);
    }

    // Kit Toast (triggers second at 2.5s)
    if (!hasSeenPromoKit) {
      setTimeout(() => {
        promoToastKit.classList.add('active');
      }, 2500);
    }

    closeToastSong.addEventListener('click', () => {
      promoToastSong.classList.remove('active');
      sessionStorage.setItem('hasSeenPromoSong', 'true');
    });

    closeToastKit.addEventListener('click', () => {
      promoToastKit.classList.remove('active');
      sessionStorage.setItem('hasSeenPromoKit', 'true');
    });
  }

});
