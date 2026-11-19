import { initAudio, initSfxControls } from './modules/sfx.js';
import { initTheme } from './modules/themes.js';
import { initResumeModal, closeResumeModal } from './modules/resume.js';
import { initCommandPalette, openCommandPalette, closeCommandPalette } from './modules/commands.js';
import { initProjectFilters, initCardTilt } from './modules/projects.js';
import { initStackInspector } from './modules/stack.js';
import {
  initLiveIstClock,
  initRadarProximity,
  initRadarClickPing,
  initMagneticHeroChips,
  initHeroTextScramble
} from './modules/hero.js';
import { initAboutSpotlight, initAboutActionPills, initTileHoverSfx } from './modules/about.js';

function initAll() {
  initSfxControls();
  initTheme();
  initResumeModal();
  initCommandPalette();
  initProjectFilters();
  initCardTilt();
  initStackInspector();
  initLiveIstClock();
  initRadarProximity();
  initRadarClickPing();
  initMagneticHeroChips();
  initHeroTextScramble();
  initAboutSpotlight();
  initAboutActionPills();
  initTileHoverSfx();

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const bd = document.getElementById('cmd-palette-backdrop');
      if (bd && bd.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape') {
      const bd = document.getElementById('cmd-palette-backdrop');
      if (bd && bd.classList.contains('open')) {
        closeCommandPalette();
      }
      const rbd = document.getElementById('resume-modal-backdrop');
      if (rbd && rbd.classList.contains('open')) {
        closeResumeModal();
      }
    }
  });

  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, initAudio, { passive: true });
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
}
