import { playClick, playHover } from './sfx.js';

export function initLiveIstClock() {
  const clockEl = document.getElementById('live-ist-clock');
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    const istTime = now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.textContent = `${istTime} IST`;
  }

  tick();
  setInterval(tick, 1000);
}

export function initRadarProximity() {
  const radar = document.querySelector('.hero-radar');
  if (!radar || window.innerWidth <= 960) return;

  let ticking = false;
  let lastClientX = 0;
  let lastClientY = 0;

  window.addEventListener('mousemove', (e) => {
    lastClientX = e.clientX;
    lastClientY = e.clientY;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const rect = radar.getBoundingClientRect();
        const radarCenterX = rect.left + rect.width / 2;
        const radarCenterY = rect.top + rect.height / 2;

        const dx = lastClientX - radarCenterX;
        const dy = lastClientY - radarCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 650;
        if (dist < maxDist) {
          const proximity = 1 - (dist / maxDist);
          const speed = Math.max(3.2, 18 - proximity * 14.8);
          const glow = 0.25 + proximity * 0.75;

          radar.style.setProperty('--radar-speed', `${speed.toFixed(2)}s`);
          radar.style.setProperty('--radar-glow', glow.toFixed(2));
          radar.classList.add('proximity-active');
        } else {
          radar.style.setProperty('--radar-speed', '18s');
          radar.style.setProperty('--radar-glow', '0.25');
          radar.classList.remove('proximity-active');
        }
        ticking = false;
      });
    }
  }, { passive: true });
}

export function initRadarClickPing() {
  window.addEventListener('pointerdown', () => {
    playClick();
  });
}

export function initMagneticHeroChips() {
  const chips = document.querySelectorAll('.hero-chip.magnetic');
  chips.forEach((chip) => {
    chip.addEventListener('mousemove', (e) => {
      const rect = chip.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.32;
      const dy = (e.clientY - centerY) * 0.32;
      chip.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(1.06)`;
    });

    chip.addEventListener('mouseleave', () => {
      chip.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });

    function activateChip() {
      playClick();
      const cat = chip.getAttribute('data-category');
      if (!cat) return;

      const filterBtn = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
      if (filterBtn) {
        filterBtn.click();
      }

      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    chip.addEventListener('click', activateChip);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateChip();
      }
    });
  });
}

const CYBER_GLYPHS = '0123456789ABCDEF#@_<>[]~*';

function runTextGlitch(element, originalText, duration = 380) {
  if (!element || element.dataset.glitching === 'true') return;
  element.dataset.glitching = 'true';
  element.classList.add('is-glitching', 'scramble-active');

  const chars = originalText.split('');
  const len = chars.length;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const resolveIndex = Math.floor(progress * (len + 1));

    let result = '';
    for (let i = 0; i < len; i++) {
      if (i < resolveIndex || chars[i] === ' ' || chars[i] === '&') {
        result += chars[i];
      } else {
        result += CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
      }
    }

    element.textContent = result;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = originalText;
      element.classList.remove('is-glitching', 'scramble-active');
      element.dataset.glitching = 'false';
    }
  }

  requestAnimationFrame(step);
}

export function initHeroTextScramble() {
  const titleEl = document.querySelector('.hero-title');
  const titleLines = document.querySelectorAll('.hero-title .title-line');
  const eyebrowEl = document.querySelector('.hero-eyebrow');

  const eyebrowOriginal = eyebrowEl ? eyebrowEl.textContent.trim() : 'Robotics Engineer & Developer';
  const lineTexts = [];
  titleLines.forEach((l) => lineTexts.push(l.textContent.trim()));

  function triggerTitleGlitch() {
    playHover();
    titleLines.forEach((line, idx) => {
      const orig = lineTexts[idx] || line.textContent.trim();
      setTimeout(() => {
        runTextGlitch(line, orig, 360 + idx * 60);
      }, idx * 70);
    });
    if (titleEl) {
      titleEl.classList.add('is-glitching');
      setTimeout(() => titleEl.classList.remove('is-glitching'), 460);
    }
  }

  function triggerEyebrowGlitch() {
    if (!eyebrowEl) return;
    playHover();
    runTextGlitch(eyebrowEl, eyebrowOriginal, 380);
  }

  setTimeout(triggerEyebrowGlitch, 220);
  setTimeout(triggerTitleGlitch, 420);

  let lastTitleHover = 0;
  if (titleEl) {
    titleEl.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastTitleHover > 1800) {
        lastTitleHover = now;
        triggerTitleGlitch();
      }
    });
  }

  let lastEyebrowHover = 0;
  if (eyebrowEl) {
    eyebrowEl.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastEyebrowHover > 1800) {
        lastEyebrowHover = now;
        triggerEyebrowGlitch();
      }
    });
  }
}
