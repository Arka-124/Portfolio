import { playHover, playClick } from './sfx.js';

export function initAboutSpotlight() {
  const aboutGrid = document.querySelector('.about-grid');
  if (!aboutGrid) return;

  aboutGrid.addEventListener('mousemove', (e) => {
    const rect = aboutGrid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    aboutGrid.style.setProperty('--about-spotlight-x', `${x}px`);
    aboutGrid.style.setProperty('--about-spotlight-y', `${y}px`);
  }, { passive: true });
}

export function initAboutActionPills() {
  const scrollStackBtn = document.getElementById('about-scroll-stack-btn');
  if (scrollStackBtn) {
    scrollStackBtn.addEventListener('click', () => {
      playClick();
      const stackSection = document.getElementById('stack');
      if (stackSection) {
        stackSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

const CLICKABLE_TILES_SELECTOR = [
  '.project-card',
  '.marquee-card',
  '.stack-icon-item',
  '.filter-tab',
  '.hero-chip',
  '.floating-badge',
  '.stat-item',
  '.hero-stat',
  '.cmd-palette-btn',
  '.sfx-toggle-btn',
  '.cmd-item',
  '.tech-project-chip',
  '.btn-sm',
  '.drawer-contact',
  '#glass-button-container',
  '#github-toggle',
  '#hamburger',
  '.hero-title',
  '.about-action-pill',
  '.timeline-item',
  '.nav-links a',
  '.nav-drawer a',
  '.footer-nav-col a',
  '.footer-socials-col a',
  '.popup-close',
  '.popup-link',
  '.resume-btn',
  '.theme-toggle-btn',
  '.hero-cv-badge',
  '.copy-coord-btn'
].join(', ');

export function initTileHoverSfx() {
  document.addEventListener('mouseover', (e) => {
    const tile = e.target.closest && e.target.closest(CLICKABLE_TILES_SELECTOR);
    if (!tile) return;
    const related = e.relatedTarget;
    if (!related || !tile.contains(related)) {
      playHover();
    }
  });
}
