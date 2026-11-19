import { initAudio, playClick, playHover, playChirp, toggleSfx, isSfxEnabled } from './sfx.js';
import { openResumeModal } from './resume.js';
import { copyToClipboard } from './toast.js';
import { applyTheme, cycleTheme, getCurrentTheme } from './themes.js';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const COMMAND_ITEMS = [
  {
    group: 'Projects',
    id: 'proj-zeroegress',
    title: 'ZeroEgress — Air-Gapped File Utilities',
    desc: 'Air-gapped local processing suite & native distribution portal',
    badge: 'Systems / Security',
    action: () => { window.location.href = 'projects/zeroegress.html'; }
  },
  {
    group: 'Projects',
    id: 'proj-fogbot',
    title: 'FogBot — Autonomous Pilot Rover',
    desc: 'SIH 2026 (NMDC Limited) autonomous scout rover & 3D WebGL twin',
    badge: 'Robotics / IoT',
    action: () => { window.location.href = 'projects/fogbot.html'; }
  },
  {
    group: 'Projects',
    id: 'proj-movie-qa',
    title: 'AI Chatbot for Movie Reviews',
    desc: 'FastAPI NLP agent developed during IIT Kanpur AI/ML internship',
    badge: 'AI / ML',
    action: () => { window.location.href = 'projects/movie-review-qa.html'; }
  },
  {
    group: 'Projects',
    id: 'proj-toll-gate',
    title: 'Automated Toll Gate Development',
    desc: 'Sensor arrays & microcontroller automated vehicle transit',
    badge: 'Robotics',
    action: () => { window.location.href = 'projects/toll-gate.html'; }
  },
  {
    group: 'Projects',
    id: 'proj-arm',
    title: 'Miniature 4 DOF Robotic Arm',
    desc: 'Master-slave potentiometer mimic control with forward kinematics',
    badge: 'Robotics',
    action: () => { window.location.href = 'projects/robotic-arm.html'; }
  },
  {
    group: 'Projects',
    id: 'proj-vm',
    title: 'VM Automobiles Website',
    desc: 'Luxury car brand experience with cinematic 3-pane overlay navigation',
    badge: 'Web Dev',
    action: () => { window.location.href = 'projects/vm-automobiles.html'; }
  },
  {
    group: 'Navigation',
    id: 'nav-projects',
    title: 'Jump to Featured Projects',
    desc: 'Scroll directly to the main projects grid',
    badge: 'Page Nav',
    action: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    group: 'Navigation',
    id: 'nav-experience',
    title: 'Jump to Experience & Education',
    desc: 'Explore academic background and engineering internships',
    badge: 'Page Nav',
    action: () => { document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    group: 'Navigation',
    id: 'nav-stack',
    title: 'Jump to Tech Stack',
    desc: 'Languages, frameworks, and hardware engineering tools',
    badge: 'Page Nav',
    action: () => { document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' }); }
  },
  {
    group: 'Quick Links',
    id: 'link-resume-modal',
    title: 'Executive Resume & Candidate Dossier',
    desc: 'Open official ATS resume, verified credentials & direct PDF download',
    badge: 'Official CV',
    action: () => {
      closeCommandPalette();
      openResumeModal();
    }
  },
  {
    group: 'Quick Links',
    id: 'link-contact',
    title: "Let's Connect (Contact Page)",
    desc: 'Direct correspondence, email, and social coordinates',
    badge: 'Contact',
    action: () => { window.location.href = 'contact.html'; }
  },
  {
    group: 'Quick Links',
    id: 'link-github',
    title: 'GitHub Profile (@Arka-124)',
    desc: 'Explore open-source repositories and code commits',
    badge: 'External',
    action: () => { window.open('https://github.com/Arka-124', '_blank', 'noopener,noreferrer'); }
  },
  {
    group: 'Quick Links',
    id: 'link-linkedin',
    title: 'LinkedIn Profile',
    desc: 'Professional network, endorsements, and credentials',
    badge: 'External',
    action: () => { window.open('https://www.linkedin.com/in/arka-datta-88a961381/', '_blank', 'noopener,noreferrer'); }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-whoami',
    title: 'whoami',
    desc: 'Display engineering dossier and robotics background',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => 'ARKA DATTA // Robotics Engineer & Full-Stack Developer\nB.Tech Automation & Robotics (3rd Year, GGSIPU)\nSpecialization: Autonomous Systems, LiDAR, ROS, Air-Gapped Local Software'
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-skills',
    title: 'skills',
    desc: 'Print primary systems & software capabilities',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => 'PRIMARY SYSTEMS:\n- Robotics & Hardware: C, C++, ROS, Arduino, LiDAR Sensor Fusion, Kinematics\n- Full-Stack: Node.js, Express, React 19, TypeScript, MongoDB, Three.js/WebGL\n- AI & Data: Python, PyTorch, NLP, Scikit-learn, SQL, Tableau'
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-status',
    title: 'status',
    desc: 'Run system diagnostics & live IST telemetry',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => `SYSTEM HEALTH // REV 2.6\nCOORDINATES: 28.6139° N, 77.2090° E (Delhi)\nLOCAL TIME: ${new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' })} IST\nNETWORK EGRESS: 0 B/s (Air-Gapped)\nSTATUS: ONLINE & ACTIVE`
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-sfx',
    title: 'sfx',
    desc: 'Toggle procedural audio micro-interactions on/off',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      toggleSfx();
      return `AUDIO SFX: ${isSfxEnabled() ? 'ENABLED' : 'MUTED'}`;
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-resume',
    title: 'resume',
    desc: 'Open official candidate dossier & download ATS PDF',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      setTimeout(() => {
        closeCommandPalette();
        openResumeModal();
      }, 300);
      return 'OPENING EXECUTIVE RESUME & OFFICIAL DOSSIER SUITE...';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-cv',
    title: 'cv',
    desc: 'Alias for resume — open candidate dossier',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      setTimeout(() => {
        closeCommandPalette();
        openResumeModal();
      }, 300);
      return 'OPENING EXECUTIVE RESUME & OFFICIAL DOSSIER SUITE...';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-theme-cycle',
    title: 'theme',
    desc: 'Cycle HUD tactical theme [cyan -> amber -> green -> mono]',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      cycleTheme();
      return `THEME SWITCHED -> ${getCurrentTheme().toUpperCase()}`;
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-theme-cyan',
    title: 'theme cyan',
    desc: 'Set HUD palette to Cyber Cyan (Default)',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      applyTheme('cyan', true);
      return 'HUD THEME SET: CYBER CYAN (#00f0ff)';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-theme-amber',
    title: 'theme amber',
    desc: 'Set HUD palette to Tactical Amber',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      applyTheme('amber', true);
      return 'HUD THEME SET: TACTICAL AMBER (#ffb000)';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-theme-green',
    title: 'theme green',
    desc: 'Set HUD palette to Matrix Green',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      applyTheme('green', true);
      return 'HUD THEME SET: MATRIX GREEN (#00ff66)';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-theme-mono',
    title: 'theme mono',
    desc: 'Set HUD palette to Pure Monochrome',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      applyTheme('mono', true);
      return 'HUD THEME SET: PURE MONOCHROME (#ffffff)';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-copy-email',
    title: 'copy email',
    desc: 'Copy arkadatta1531@gmail.com to clipboard',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      copyToClipboard('arkadatta1531@gmail.com', 'Email');
      return 'COPIED TO CLIPBOARD: arkadatta1531@gmail.com';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-copy-phone',
    title: 'copy phone',
    desc: 'Copy +91 62972 49529 to clipboard',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      copyToClipboard('+916297249529', 'Phone');
      return 'COPIED TO CLIPBOARD: +91 62972 49529';
    }
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-sudo',
    title: 'sudo',
    desc: 'Execute tactical override with root privileges',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => '[AUTHENTICATED] Welcome, Operator Arka. Tactical control unlocked. ZeroEgress security protocol bypass not permitted.'
  },
  {
    group: 'Terminal Commands',
    id: 'cmd-matrix',
    title: 'matrix',
    desc: 'Follow the white rabbit into the digital construct',
    badge: 'CLI Command',
    isTerminal: true,
    action: () => {
      applyTheme('green', true);
      return 'WAKE UP, NEO...\nHUD shifted to Matrix Green. The construct is active.';
    }
  }
];

let selectedIndex = 0;
let filteredItems = [...COMMAND_ITEMS];

export function openCommandPalette() {
  initAudio();
  playClick();
  const backdrop = document.getElementById('cmd-palette-backdrop');
  const input = document.getElementById('cmd-search-input');
  const terminalBox = document.getElementById('cmd-terminal-box');
  if (!backdrop) return;

  backdrop.classList.add('open');
  if (terminalBox) terminalBox.classList.remove('visible');
  if (input) {
    input.value = '';
    input.focus();
  }
  filterCommandItems('');
}

export function closeCommandPalette() {
  const backdrop = document.getElementById('cmd-palette-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  playClick();
}

function renderCommandItems() {
  const list = document.getElementById('cmd-results-list');
  if (!list) return;

  if (filteredItems.length === 0) {
    list.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: rgba(255,255,255,0.4); font-family: monospace; font-size: 0.85rem;">No matching commands or projects found.</div>';
    return;
  }

  let html = '';
  let currentGroup = '';

  filteredItems.forEach((item, index) => {
    if (item.group !== currentGroup) {
      currentGroup = item.group;
      html += `<div class="cmd-group-label">${escapeHtml(currentGroup)}</div>`;
    }

    const isSelected = index === selectedIndex;
    html += `
      <div class="cmd-item ${isSelected ? 'selected' : ''}" data-index="${index}">
        <div class="cmd-item-left">
          <span class="cmd-item-title">${escapeHtml(item.title)}</span>
          <span class="cmd-item-desc">${escapeHtml(item.desc)}</span>
        </div>
        <span class="cmd-item-badge">${escapeHtml(item.badge)}</span>
      </div>
    `;
  });

  list.innerHTML = html;

  list.querySelectorAll('.cmd-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const idx = parseInt(el.getAttribute('data-index') || '0', 10);
      selectedIndex = idx;
      updateSelectedCmdItem();
      playHover();
    });
    el.addEventListener('click', () => {
      executeSelectedCommand();
    });
  });
}

function updateSelectedCmdItem() {
  const list = document.getElementById('cmd-results-list');
  if (!list) return;
  list.querySelectorAll('.cmd-item').forEach((el, idx) => {
    el.classList.toggle('selected', idx === selectedIndex);
  });
}

function filterCommandItems(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    filteredItems = [...COMMAND_ITEMS];
  } else {
    filteredItems = COMMAND_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q)
    );
  }
  selectedIndex = 0;
  renderCommandItems();
}

function executeSelectedCommand() {
  if (filteredItems.length === 0 || selectedIndex < 0 || selectedIndex >= filteredItems.length) return;
  const item = filteredItems[selectedIndex];

  if (item.isTerminal) {
    const terminalBox = document.getElementById('cmd-terminal-box');
    if (terminalBox) {
      terminalBox.classList.add('visible');
      terminalBox.textContent = '> ' + item.title + '\n' + (typeof item.action === 'function' ? item.action() : '');
    }
    playChirp();
  } else {
    closeCommandPalette();
    playChirp();
    item.action();
  }
}

export function initCommandPalette() {
  const cmdBtn = document.getElementById('cmd-palette-btn');
  if (cmdBtn) {
    cmdBtn.addEventListener('click', openCommandPalette);
  }

  const backdrop = document.getElementById('cmd-palette-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCommandPalette();
    });
  }

  const searchInput = document.getElementById('cmd-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterCommandItems(e.target.value);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredItems.length;
          updateSelectedCmdItem();
          playHover();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredItems.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
          updateSelectedCmdItem();
          playHover();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelectedCommand();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      }
    });
  }
}
