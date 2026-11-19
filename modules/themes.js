import { playThemeChime, playHover } from './sfx.js';
import { showCyberToast } from './toast.js';

function safeGetStorage(key, fallback = null) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (_) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {}
}

export const THEMES = ['cyan', 'amber', 'green', 'mono'];

export const THEME_NAMES = {
  cyan: 'CYAN',
  amber: 'AMBER',
  green: 'MATRIX',
  mono: 'MONO'
};

export function getCurrentTheme() {
  if (typeof window === 'undefined') return 'cyan';
  return safeGetStorage('arka_portfolio_theme', 'cyan');
}

export function applyTheme(themeName, playSound = false) {
  const valid = THEMES.includes(themeName) ? themeName : 'cyan';
  document.documentElement.setAttribute('data-theme', valid);
  safeSetStorage('arka_portfolio_theme', valid);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: valid } }));

  document.querySelectorAll('.theme-label').forEach((el) => {
    el.textContent = THEME_NAMES[valid];
  });

  if (playSound) {
    playThemeChime();
    showCyberToast(`[✓] HUD THEME: ${THEME_NAMES[valid]}`);
  }
}

export function cycleTheme() {
  const current = getCurrentTheme();
  const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
  applyTheme(THEMES[nextIdx], true);
}

export function initTheme() {
  applyTheme(getCurrentTheme(), false);
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach((btn) => {
    btn.addEventListener('click', cycleTheme);
    btn.addEventListener('mouseenter', playHover);
  });
}
