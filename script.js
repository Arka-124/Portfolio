/**
 * Core UI Behaviors: Scroll-reveal, Parallax, Nav Scroll-tint, Drawer & Popups
 */
document.addEventListener('DOMContentLoaded', () => {

  /* Footer year */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* Scroll-reveal — .reveal / .active */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Project cards — click to open detail page */
  document.querySelectorAll('.project-card[data-link], .marquee-card[data-link], .floating-badge[data-link]').forEach(card => {
    const url = card.getAttribute('data-link');
    if (!url) return;

    if (!card.hasAttribute('role')) card.setAttribute('role', 'link');
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

    card.addEventListener('click', () => {
      window.location.href = url;
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = url;
      }
    });
  });

  /* GSAP hero parallax + footer wordmark */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.getElementById('hero');
    const heroText = document.getElementById('hero-text');
    const heroRight = document.getElementById('hero-right');

    if (hero && heroText && heroRight) {
      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(heroText, { y: -120, scale: 0.92, opacity: 0.85, ease: 'power2.out' }, 0)
      .to(heroRight, { y: -80, opacity: 0, ease: 'power2.out' }, 0);

      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => hero.classList.add('hero-active'),
        onLeave: () => hero.classList.remove('hero-active'),
        onEnterBack: () => hero.classList.add('hero-active'),
        onLeaveBack: () => hero.classList.remove('hero-active')
      });
    }

    gsap.from('.footer-name', {
      scrollTrigger: {
        trigger: '.site-footer',
        start: 'top 90%'
      },
      x: -200,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    });
  }

  /* Nav scroll-tint + Hero background parallax + About background parallax */
  const SPEED = 0.5;
  const header = document.getElementById('site-header');
  const hero = document.getElementById('hero');
  const aboutSection = document.getElementById('experience');
  const aboutBgLayer = document.getElementById('about-bg-layer');

  let ticking = false;

  function updateOnScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }

    if (hero) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 960) {
        hero.style.setProperty('--hero-bg-y', '0px');
        hero.style.setProperty('--hero-cutout-y', '0px');
      } else {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > 0 && heroRect.top <= 0) {
          const scrolled = -heroRect.top;
          hero.style.setProperty('--hero-bg-y', `${scrolled * 0.35}px`);
          hero.style.setProperty('--hero-cutout-y', `${scrolled * 0.22}px`);
        } else if (heroRect.top > 0) {
          hero.style.setProperty('--hero-bg-y', '0px');
          hero.style.setProperty('--hero-cutout-y', '0px');
        }
      }
    }

    if (aboutSection && aboutBgLayer) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        aboutBgLayer.style.transform = '';
        aboutBgLayer.style.visibility = 'visible';
        aboutBgLayer.style.opacity = '1';
      } else {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.bottom <= 0) {
          aboutBgLayer.style.visibility = 'hidden';
          aboutBgLayer.style.opacity = '0';
        } else if (rect.top >= window.innerHeight) {
          aboutBgLayer.style.transform = 'translate3d(0, 0px, 0)';
          aboutBgLayer.style.visibility = 'hidden';
          aboutBgLayer.style.opacity = '0';
        } else {
          aboutBgLayer.style.visibility = 'visible';
          aboutBgLayer.style.opacity = '1';
          const scrolledPx = Math.max(-rect.top, 0);
          const maxOffset = aboutSection.offsetHeight;
          const translateY = Math.min(scrolledPx * SPEED, maxOffset);
          aboutBgLayer.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('hashchange', () => {
    requestAnimationFrame(updateOnScroll);
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      setTimeout(updateOnScroll, 100);
      setTimeout(updateOnScroll, 400);
      setTimeout(updateOnScroll, 800);
    });
  });

  updateOnScroll();

  /* Hamburger navigation drawer */
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  const overlay = document.getElementById('drawer-overlay');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    if (btn) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    if (btn) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  if (btn && drawer && overlay) {
    btn.addEventListener('click', () =>
      drawer.classList.contains('open') ? closeDrawer() : openDrawer()
    );
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeDrawer)
    );
  }

  /* GitHub repository details popup */
  const toggle = document.getElementById('github-toggle');
  const popup = document.getElementById('github-popup');
  const closeBtn = popup ? popup.querySelector('.popup-close') : null;

  if (toggle && popup) {
    toggle.addEventListener('click', () => popup.classList.toggle('visible'));
  }
  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => popup.classList.remove('visible'));
  }
});
