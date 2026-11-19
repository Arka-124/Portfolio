import { initAudio, playClick } from './sfx.js';

export function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      initAudio();
      playClick();
      const filter = tab.getAttribute('data-filter') || 'all';

      filterTabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        const catTokens = category.trim().split(/\s+/);
        if (filter === 'all' || catTokens.includes(filter)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

export function initCardTilt() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 960) {
    return;
  }

  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    let isHovered = false;
    let tiltTicking = false;
    let mouseX = 0;
    let mouseY = 0;

    let glareEl = card.querySelector('.project-card-glare');
    if (!glareEl) {
      glareEl = document.createElement('div');
      glareEl.className = 'project-card-glare';
      card.appendChild(glareEl);
    }

    function updateTilt() {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

      if (glareEl) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareEl.style.background = `radial-gradient(circle 280px at ${glareX}% ${glareY}%, var(--accent-dim), transparent 70%)`;
        glareEl.style.opacity = '1';
      }

      tiltTicking = false;
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    card.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!tiltTicking) {
        requestAnimationFrame(updateTilt);
        tiltTicking = true;
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.style.transform = '';
      if (glareEl) {
        glareEl.style.opacity = '0';
      }
    });
  });
}
