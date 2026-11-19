/**
 * Procedural Web Audio SFX Engine
 * Zero external audio dependencies. Generates real-time sound synthesized via Web Audio API.
 */
let audioCtx = null;
let sfxEnabled = typeof window !== 'undefined' && localStorage.getItem('arka_portfolio_sfx') === 'true';
let lastHoverTime = 0;

export function initAudio() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
}

export function isSfxEnabled() {
  return sfxEnabled;
}

export function playHover() {
  if (!sfxEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const now = performance.now();
  if (now - lastHoverTime < 25) return;
  lastHoverTime = now;

  try {
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch {
    // AudioContext fallback
  }
}

export function playClick() {
  if (!sfxEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch {
    // AudioContext fallback
  }
}

export function playChirp() {
  if (!sfxEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1800, now + 0.04);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // AudioContext fallback
  }
}

export function playThemeChime() {
  if (!sfxEnabled) return;
  initAudio();
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  } catch {
    // AudioContext fallback
  }
}

export function playSuccessArpeggio() {
  if (!sfxEnabled) return;
  initAudio();
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
    notes.forEach((freq, idx) => {
      const start = audioCtx.currentTime + idx * 0.04;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.045, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.08);
    });
  } catch {
    // AudioContext fallback
  }
}

export function updateSfxToggleBtn() {
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  if (!sfxBtn) return;
  const label = sfxBtn.querySelector('.sfx-label');
  const icon = sfxBtn.querySelector('.sfx-icon');
  sfxBtn.setAttribute('aria-pressed', sfxEnabled ? 'true' : 'false');
  if (sfxEnabled) {
    sfxBtn.classList.add('sfx-active');
    if (label) label.textContent = 'SFX: ON';
    if (icon) icon.textContent = '🔊';
  } else {
    sfxBtn.classList.remove('sfx-active');
    if (label) label.textContent = 'SFX: OFF';
    if (icon) icon.textContent = '🔇';
  }
}

export function toggleSfx() {
  initAudio();
  sfxEnabled = !sfxEnabled;
  localStorage.setItem('arka_portfolio_sfx', sfxEnabled ? 'true' : 'false');
  updateSfxToggleBtn();
  if (sfxEnabled) {
    playChirp();
  }
}

export function initSfxControls() {
  updateSfxToggleBtn();
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  if (sfxBtn) {
    sfxBtn.addEventListener('click', toggleSfx);
  }
}
