import { initAudio, playClick, playHover } from './sfx.js';
import { copyToClipboard } from './toast.js';

export function openResumeModal() {
  initAudio();
  playClick();
  const backdrop = document.getElementById('resume-modal-backdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

export function closeResumeModal() {
  const backdrop = document.getElementById('resume-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playClick();
  }
}

export function initResumeModal() {
  const resumeBtns = document.querySelectorAll('.resume-btn');
  resumeBtns.forEach((btn) => {
    btn.addEventListener('click', openResumeModal);
    btn.addEventListener('mouseenter', playHover);
  });

  const heroCvBadge = document.getElementById('hero-cv-badge');
  if (heroCvBadge) {
    heroCvBadge.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
    heroCvBadge.addEventListener('mouseenter', playHover);
  }

  const closeBtn = document.getElementById('resume-modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeResumeModal);
  }

  const backdrop = document.getElementById('resume-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeResumeModal();
    });
  }

  const copyAllBtn = document.getElementById('dossier-copy-all-btn');
  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', () => {
      const text = `ARKA DATTA — ROBOTICS ENGINEER & FULL-STACK DEVELOPER
Email: arkadatta1531@gmail.com | Phone: +91 62972 49529
Location: New Delhi, India | Portfolio: https://arka-124.github.io/Portfolio/
GitHub: https://github.com/Arka-124 | LinkedIn: https://www.linkedin.com/in/arka-datta-88a961381/

EDUCATION:
- B.Tech in Automation and Robotics (2024 - 2028)
  University School of Automation and Robotics (USAR), GGSIPU, Delhi (CGPA: 9.26)

EXPERIENCE & HONORS:
- Winner: Smart India Hackathon (SIH) 2026 — NMDC Limited (Autonomous Scout Rover "FogBot")
- AI/ML Research Intern: IIT Kanpur (FastAPI, Scikit-Learn, NLP)
- IBM SkillsBuild AI & Data Intern

FLAGSHIP PROJECTS:
1. FogBot (Autonomous Pilot Rover): Multi-sensor fusion (LiDAR, ultrasonic, IMU), obstacle avoidance, 3D WebGL twin.
2. ZeroEgress: Local air-gapped file utilities with zero network telemetry.
3. 4-DOF Robotic Arm: Dual-mode potentiometer mimic telemetry with ATmega328P.`;
      copyToClipboard(text, 'Full Dossier');
    });
  }

  // Bind all copy-coord buttons
  document.querySelectorAll('.copy-coord-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const copyText = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Coordinate';
      if (copyText) {
        copyToClipboard(copyText, label);
      }
    });
  });
}
