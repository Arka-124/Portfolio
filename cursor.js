const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (!isTouchDevice) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  let isMoving = false;

  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
      if (!isMoving) {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '0.6';
        isMoving = true;
      }
    });

    (function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top  = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    })();

    // Click feedback & radar ripple across all pages
    window.addEventListener('pointerdown', (e) => {
      document.body.classList.add('clicking');
      const wave = document.createElement('div');
      wave.className = 'radar-ping-wave';
      wave.style.left = e.clientX + 'px';
      wave.style.top = e.clientY + 'px';
      document.body.appendChild(wave);
      setTimeout(() => {
        if (wave && wave.parentNode) {
          wave.parentNode.removeChild(wave);
        }
      }, 650);
    });

    window.addEventListener('pointerup', () => {
      document.body.classList.remove('clicking');
    });

    // Delegated hover triggers covering index, contact, and all project subpages
    const INTERACTIVE_SELECTOR = [
      'a', 'button', 'video', 'input', 'textarea', 'select',
      '.project-card', '.contributor-card', '.stack-icon-item', '.hero-chip',
      '.marquee-card', '#glass-button-container', '#github-toggle',
      '.filter-tab', '.cmd-palette-btn', '.sfx-toggle-btn', '.cmd-item',
      '.tech-project-chip', '.detail-card', '.grid-item', '.tag',
      '.feature-item', '.repo-link', '.stat-item', '.hero-stat',
      '.header-bar a', '.preview-external-link', '.browser-action-btn',
      '.preview-browser-header', '[data-interactive="true"]', '[role="button"]',
      '.floating-badge', '.social-link', '.copy-btn', '.back-arrow',
      '.hero-title', '.hero-eyebrow'
    ].join(', ');

    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(INTERACTIVE_SELECTOR)) {
        document.body.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const related = e.relatedTarget;
      if (!related || !related.closest || !related.closest(INTERACTIVE_SELECTOR)) {
        document.body.classList.remove('hovering');
      }
    });
  }

} else {
  if (cursorDot)     cursorDot.style.display = 'none';
  if (cursorOutline) cursorOutline.style.display = 'none';
  document.body.style.cursor = 'auto';
}
