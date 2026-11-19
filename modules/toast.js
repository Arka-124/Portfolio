import { playSuccessArpeggio, initAudio } from './sfx.js';

let toastTimer = null;

export function showCyberToast(msg) {
  const toast = document.getElementById('cyber-toast');
  const toastMsg = document.getElementById('cyber-toast-msg');
  if (!toast) return;
  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    playSuccessArpeggio();
    showCyberToast(`[✓] COPIED ${label.toUpperCase()}`);
  } catch {
    showCyberToast(`[!] FAILED TO COPY`);
  }
  document.body.removeChild(ta);
}

export function copyToClipboard(text, label = 'Text') {
  initAudio();
  const cleanText = text.trim();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cleanText).then(() => {
      playSuccessArpeggio();
      showCyberToast(`[✓] COPIED ${label.toUpperCase()}`);
    }).catch(() => {
      fallbackCopy(cleanText, label);
    });
  } else {
    fallbackCopy(cleanText, label);
  }
}
