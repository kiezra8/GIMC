/* =====================================================
   script.js — GIMC Interactive JavaScript
   ===================================================== */

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCarousel();
  initScrollReveal();
  initCounters();
  initContactForm();
  initBackToTop();
  initNavLinks();
});

// =====================================================
// NAVBAR — Scroll behavior + mobile toggle
// =====================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // Scroll handler
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.style.transform = open ? 'rotate(90deg)' : '';
  });

  // Close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.style.transform = '';
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
}

// =====================================================
// NAV SMOOTH SCROLL
// =====================================================
function initNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// =====================================================
// HERO CAROUSEL
// =====================================================
function initHeroCarousel() {
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.dot');
  const prevBtn  = document.getElementById('heroPrev');
  const nextBtn  = document.getElementById('heroNext');
  let current    = 0;
  let autoTimer  = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  // Touch/Swipe
  let touchStartX = 0;
  const carousel = document.getElementById('heroCarousel');
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });

  startAuto();
}

// =====================================================
// SCROLL REVEAL
// =====================================================
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// =====================================================
// COUNTER ANIMATION
// =====================================================
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target   = +el.getAttribute('data-target');
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.round(eased * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000 ? target.toLocaleString() + '+' : target + (target === 5 ? '' : '+');
  }

  requestAnimationFrame(step);
}

// =====================================================
// CONTACT FORM
// =====================================================
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const submit  = document.getElementById('contactSubmit');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    submit.disabled = true;
    submit.querySelector('.btn-text').textContent = 'Sending…';

    // Simulate async send
    setTimeout(() => {
      submit.disabled = false;
      submit.querySelector('.btn-text').textContent = 'Send Message';
      success.style.display = 'block';
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1500);
  });
}

// =====================================================
// BACK TO TOP
// =====================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================================================
// PARALLAX EFFECT — subtle depth on hero
// =====================================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    document.querySelectorAll('.hero-slide.active').forEach(slide => {
      slide.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
    });
  }
}, { passive: true });

// =====================================================
// IMAGE ERROR FALLBACK — use Unsplash if local missing
// =====================================================
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    const fallbacks = {
      'team.png':     'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
      'outreach1.png':'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'edu.png':      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      'prog_maternal.jpg': 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=800&q=80',
      'hero1.png':    'https://images.unsplash.com/photo-1626315869436-d3707ce3b6e4?w=1600&q=80',
      'hero2.png':    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1600&q=80',
      'hero3.png':    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600&q=80',
    };
    const filename = this.src.split('/').pop();
    if (fallbacks[filename]) {
      this.src = fallbacks[filename];
    }
  });
});

// =====================================================
// MISSION CARD BG fallback using data-mission-fallback
// =====================================================
document.querySelectorAll('.mission-bg[data-mission-fallback]').forEach(bg => {
  const style = bg.getAttribute('style') || '';
  const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
  const fallbackUrl = bg.getAttribute('data-mission-fallback');
  if (match && fallbackUrl) {
    const img = new Image();
    img.src = match[1];
    img.onerror = () => {
      bg.style.backgroundImage = `url('${fallbackUrl}')`;
    };
  }
});

// =====================================================
// PROGRAM CARD BG fallback using data-prog-fallback
// =====================================================
document.querySelectorAll('.program-bg[data-prog-fallback]').forEach(bg => {
  const style = bg.getAttribute('style') || '';
  const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
  const fallbackUrl = bg.getAttribute('data-prog-fallback');
  if (match && fallbackUrl) {
    const img = new Image();
    img.src = match[1];
    img.onerror = () => {
      bg.style.backgroundImage = `url('${fallbackUrl}')`;
    };
  }
});

// =====================================================
// HERO BG fallback using data-fallback attribute
// =====================================================
document.querySelectorAll('.hero-slide').forEach(slide => {
  const style = slide.getAttribute('style') || '';
  const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
  const fallbackUrl = slide.getAttribute('data-fallback');
  if (match && fallbackUrl) {
    const img = new Image();
    img.src = match[1];
    img.onerror = () => {
      slide.style.backgroundImage = `url('${fallbackUrl}')`;
    };
  }
});
