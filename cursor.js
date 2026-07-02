const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (!isTouchDevice) {
  /* All interactive elements across index.html and contact.html */
  const hoverTriggers = document.querySelectorAll(
    'a, button, .project-card, .stack-icon-item, .hero-chip, ' +
    '.marquee-card, #glass-button-container, #github-toggle'
  );

  let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    (function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top  = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    })();

    hoverTriggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      trigger.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

} else {
  if (cursorDot)     cursorDot.style.display = 'none';
  if (cursorOutline) cursorOutline.style.display = 'none';
  document.body.style.cursor = 'auto';
}
