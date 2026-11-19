(function () {
  'use strict';

  /* ============================================================
     1. PROCEDURAL WEB AUDIO SFX ENGINE
     ============================================================ */
  let audioCtx = null;
  let sfxEnabled = localStorage.getItem('arka_portfolio_sfx') === 'true';
  let lastHoverTime = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  function playHover() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = performance.now();
    if (now - lastHoverTime < 25) return;
    lastHoverTime = now;

    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
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

  function playClick() {
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

  function playChirp() {
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

  function playThemeChime() {
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

  function playSuccessArpeggio() {
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

  function updateSfxToggleBtn() {
    const sfxBtn = document.getElementById('sfx-toggle-btn');
    if (!sfxBtn) return;
    const label = sfxBtn.querySelector('.sfx-label');
    const icon = sfxBtn.querySelector('.sfx-icon');
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

  function toggleSfx() {
    initAudio();
    sfxEnabled = !sfxEnabled;
    localStorage.setItem('arka_portfolio_sfx', sfxEnabled ? 'true' : 'false');
    updateSfxToggleBtn();
    if (sfxEnabled) {
      playChirp();
    }
  }

  /* ============================================================
     TOAST NOTIFICATION ENGINE
     ============================================================ */
  let toastTimer = null;
  function showCyberToast(msg) {
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

  function copyToClipboard(text, label) {
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

  /* ============================================================
     TACTICAL HUD THEMES
     ============================================================ */
  const THEMES = ['cyan', 'amber', 'green', 'mono'];
  const THEME_NAMES = {
    cyan: 'CYAN',
    amber: 'AMBER',
    green: 'MATRIX',
    mono: 'MONO'
  };

  function getCurrentTheme() {
    return localStorage.getItem('arka_portfolio_theme') || 'cyan';
  }

  function applyTheme(themeName, playSound = false) {
    const valid = THEMES.includes(themeName) ? themeName : 'cyan';
    document.documentElement.setAttribute('data-theme', valid);
    localStorage.setItem('arka_portfolio_theme', valid);

    document.querySelectorAll('.theme-label').forEach((el) => {
      el.textContent = THEME_NAMES[valid];
    });

    if (playSound) {
      playThemeChime();
      showCyberToast(`[✓] HUD THEME: ${THEME_NAMES[valid]}`);
    }
  }

  function cycleTheme() {
    const current = getCurrentTheme();
    const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
    applyTheme(THEMES[nextIdx], true);
  }

  function initTheme() {
    applyTheme(getCurrentTheme(), false);
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    themeBtns.forEach((btn) => {
      btn.addEventListener('click', cycleTheme);
      btn.addEventListener('mouseenter', playHover);
    });
  }

  /* ============================================================
     OFFICIAL RESUME & EXECUTIVE DOSSIER SUITE
     ============================================================ */
  function openResumeModal() {
    initAudio();
    playClick();
    const backdrop = document.getElementById('resume-modal-backdrop');
    if (backdrop) {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    const backdrop = document.getElementById('resume-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      playClick();
    }
  }

  function initResumeModal() {
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
- B.Tech in Automation and Robotics (2023 - 2027)
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

    // Bind all copy-coord buttons across the document
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

  /* ============================================================
     5. COMMAND PALETTE (CTRL+K / CMD+K)
     ============================================================ */
  const COMMAND_ITEMS = [
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
        return `AUDIO SFX: ${sfxEnabled ? 'ENABLED' : 'MUTED'}`;
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

  function openCommandPalette() {
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

  function closeCommandPalette() {
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
        html += `<div class="cmd-group-label">${currentGroup}</div>`;
      }

      const isSelected = index === selectedIndex;
      html += `
        <div class="cmd-item ${isSelected ? 'selected' : ''}" data-index="${index}">
          <div class="cmd-item-left">
            <span class="cmd-item-title">${item.title}</span>
            <span class="cmd-item-desc">${item.desc}</span>
          </div>
          <span class="cmd-item-badge">${item.badge}</span>
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

  /* ============================================================
     3. PROJECT CATEGORY FILTER & 3D GLARE TILT
     ============================================================ */
  function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        initAudio();
        playClick();
        const filter = tab.getAttribute('data-filter') || 'all';

        filterTabs.forEach((t) => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category') || '';
          const catTokens = category.trim().split(/\s+/);
          if (filter === 'all' || catTokens.includes(filter)) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 960) {
      return;
    }

    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
      let isHovered = false;
      let tiltTicking = false;
      let lastX = 0;
      let lastY = 0;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
        card.style.setProperty('--glare-opacity', '1');
        playHover();
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        lastX = e.clientX;
        lastY = e.clientY;

        if (!tiltTicking) {
          tiltTicking = true;
          requestAnimationFrame(() => {
            if (!isHovered) {
              tiltTicking = false;
              return;
            }
            const rect = card.getBoundingClientRect();
            const x = lastX - rect.left;
            const y = lastY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = ((y - centerY) / centerY) * -7;
            const tiltY = ((x - centerX) / centerX) * 7;

            card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
            card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
            card.style.setProperty('--glare-x', `${x}px`);
            card.style.setProperty('--glare-y', `${y}px`);
            tiltTicking = false;
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        tiltTicking = false;
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--glare-opacity', '0');
      });
    });
  }

  /* ============================================================
     4. TECH STACK CROSS-LINK INSPECTOR
     ============================================================ */
  const TECH_DATA = {
    html5: {
      title: 'HTML5',
      role: 'Semantic Web Architecture',
      desc: 'Foundation for all responsive web projects, brutalist grids, and canvas viewports.',
      projects: [
        { name: 'VM Automobiles', link: 'projects/vm-automobiles.html' },
        { name: 'FogBot Haul Roads', link: 'projects/fogbot.html' }
      ]
    },
    css3: {
      title: 'CSS3',
      role: 'Design Systems & Glassmorphism',
      desc: 'Bespoke animations, CSS Grid brutalist layouts, and hardware-accelerated transforms.',
      projects: [
        { name: 'VM Automobiles', link: 'projects/vm-automobiles.html' },
        { name: 'Portfolio HUD', link: '#hero' }
      ]
    },
    js: {
      title: 'JavaScript (ES6+)',
      role: 'Reactive Client Runtime',
      desc: 'Asynchronous event loops, Canvas radar graphics, WebGL drivers, and DOM orchestration.',
      projects: [
        { name: 'FogBot Digital Twin', link: 'projects/fogbot.html' },
        { name: 'ZeroEgress Engine', link: 'projects/zeroegress.html' }
      ]
    },
    nodejs: {
      title: 'Node.js',
      role: 'High-Concurrency Runtime',
      desc: 'Microservices, REST APIs, telemetry streams, and buffered POSIX file handles.',
      projects: [
        { name: 'FogBot IoT Command Center', link: 'projects/fogbot.html' },
        { name: 'ZeroEgress Web Engine', link: 'projects/zeroegress.html' }
      ]
    },
    express: {
      title: 'Express.js',
      role: 'Production Backend Routing',
      desc: 'REST endpoints, reCAPTCHA validation, bcrypt security, and connection pooling.',
      projects: [
        { name: 'FogBot Backend', link: 'projects/fogbot.html' },
        { name: 'VM Automobiles Search API', link: 'projects/vm-automobiles.html' }
      ]
    },
    mongodb: {
      title: 'MongoDB',
      role: 'NoSQL Document Store',
      desc: 'Schemaless telemetry indexing, user authentication records, and vehicle states.',
      projects: [
        { name: 'FogBot Telemetry DB', link: 'projects/fogbot.html' }
      ]
    },
    java: {
      title: 'Java',
      role: 'Object-Oriented Systems',
      desc: 'Data structures, algorithm complexity optimization, and enterprise software foundations.',
      projects: [
        { name: 'Academic Algorithms', link: '#experience' }
      ]
    },
    python: {
      title: 'Python',
      role: 'AI / Machine Learning & NLP',
      desc: 'PyTorch neural networks, TF-IDF vectorization, scikit-learn models, and automation scripts.',
      projects: [
        { name: 'Movie Review Q&A Agent', link: 'projects/movie-review-qa.html' },
        { name: 'IIT Kanpur ML Models', link: '#projects' }
      ]
    },
    c: {
      title: 'C',
      role: 'Bare-Metal Embedded Computing',
      desc: 'Microcontroller firmware, hardware timer interrupts, and sensor bus communication.',
      projects: [
        { name: 'Automated Toll Gate', link: 'projects/toll-gate.html' },
        { name: 'Robotic Arm Firmware', link: 'projects/robotic-arm.html' }
      ]
    },
    cpp: {
      title: 'C++',
      role: 'Robotics Kinematics & Systems',
      desc: 'Forward/inverse kinematics calculation, real-time potentiometer mimic loops, and ROS nodes.',
      projects: [
        { name: '4-DOF Miniature Arm', link: 'projects/robotic-arm.html' }
      ]
    },
    git: {
      title: 'Git',
      role: 'Version Control & Release Delivery',
      desc: 'Deterministic version tagging, multi-branch collaboration, and GitHub Pages pipelines.',
      projects: [
        { name: 'ZeroEgress Portal', link: 'projects/zeroegress.html' },
        { name: 'FogBot Repository', link: 'projects/fogbot.html' }
      ]
    }
  };

  function initStackInspector() {
    const stackItems = document.querySelectorAll('.stack-icon-item');
    const descCol = document.querySelector('.stack-desc-col');
    if (!stackItems.length || !descCol) return;

    let inspector = null;

    function closeInspector() {
      stackItems.forEach((it) => it.classList.remove('active-tech'));
      if (inspector) inspector.style.display = 'none';
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach((c) => c.classList.remove('highlight-pulse'));
    }

    function renderInspector(techKey) {
      const data = TECH_DATA[techKey];
      if (!data) return;

      if (!inspector) {
        inspector = document.createElement('div');
        inspector.id = 'stack-inspector-card';
        inspector.className = 'stack-inspector-card';
        descCol.appendChild(inspector);
      }
      inspector.style.display = 'flex';

      const projectChips = data.projects.map((p) =>
        `<a href="${p.link}" class="tech-project-chip" data-target-name="${p.name}">
          <span>${p.name}</span>
          <span style="color:#00e5ff;">&rarr;</span>
        </a>`
      ).join('');

      inspector.innerHTML = `
        <div class="inspector-header">
          <div class="inspector-tech-title">
            <span>${data.title}</span>
            <span class="inspector-role-badge">${data.role}</span>
          </div>
          <button class="inspector-close-btn" aria-label="Close details" style="background:none;border:none;color:var(--muted);font-size:1.1rem;cursor:pointer;padding:0.2rem 0.5rem;line-height:1;">&times;</button>
        </div>
        <p class="inspector-desc">${data.desc}</p>
        <div class="inspector-projects-row">
          <span class="inspector-projects-label">Applied In:</span>
          ${projectChips}
        </div>
      `;

      inspector.querySelector('.inspector-close-btn')?.addEventListener('click', () => {
        closeInspector();
        playClick();
      });

      inspector.querySelectorAll('.tech-project-chip').forEach((chip) => {
        chip.addEventListener('mouseenter', playHover);
        chip.addEventListener('click', (e) => {
          const target = chip.getAttribute('href');
          if (target && target.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

    stackItems.forEach((item) => {
      function toggleItem() {
        initAudio();
        playClick();
        const techKey = item.getAttribute('data-tech-id') || '';
        const wasActive = item.classList.contains('active-tech');

        closeInspector();

        if (wasActive) {
          return;
        }

        item.classList.add('active-tech');
        renderInspector(techKey);

        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((c) => c.classList.remove('highlight-pulse'));

        const data = TECH_DATA[techKey];
        if (data && data.projects.length) {
          projectCards.forEach((card) => {
            const cardName = card.querySelector('.project-name')?.textContent || '';
            const isMatch = data.projects.some((p) => cardName.includes(p.name.split(' ')[0]));
            if (isMatch) {
              card.classList.add('highlight-pulse');
              setTimeout(() => card.classList.remove('highlight-pulse'), 3200);
            }
          });
        }
      }

      item.addEventListener('click', toggleItem);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem();
        }
      });
    });

    // Close on click outside of #stack
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#stack')) {
        closeInspector();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeInspector();
      }
    });
  }

  /* ============================================================
     5. CLICKABLE TILE HOVER SFX (DELEGATED)
     ============================================================ */
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
    '.popup-link'
  ].join(', ');

  function initTileHoverSfx() {
    document.addEventListener('mouseover', (e) => {
      const tile = e.target.closest && e.target.closest(CLICKABLE_TILES_SELECTOR);
      if (!tile) return;
      const related = e.relatedTarget;
      if (!related || !tile.contains(related)) {
        playHover();
      }
    });
  }

  /* ============================================================
     5. LIVE TELEMETRY, RADAR PROXIMITY & CURSOR CLICK PING
     ============================================================ */
  function initLiveIstClock() {
    const clockEl = document.getElementById('live-ist-clock');
    if (!clockEl) return;

    function tick() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false
      });
      clockEl.textContent = `${timeStr} IST`;
    }

    tick();
    setInterval(tick, 1000);
  }

  function initRadarProximity() {
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

  function initRadarClickPing() {
    window.addEventListener('pointerdown', () => {
      initAudio();
      playClick();
    });
  }

  /* ============================================================
     HERO: 1. MAGNETIC HUD CHIPS & DIRECT PROJECT TELEPORT
     ============================================================ */
  function initMagneticHeroChips() {
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

  /* ============================================================
     HERO: 2. REFINED CYBERNETIC TEXT GLITCH & SCRAMBLE
     ============================================================ */
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

  function initHeroTextScramble() {
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

    // Auto-glitch once on page load (staggered & non-disruptive)
    setTimeout(triggerEyebrowGlitch, 220);
    setTimeout(triggerTitleGlitch, 420);

    // Hover triggers with generous cooldowns (prevents layout jumping)
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

  /* ============================================================
     6. ABOUT / EXPERIENCE SECTION SPOTLIGHT & SHORTCUTS
     ============================================================ */
  function initAboutSpotlight() {
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

  function initAboutActionPills() {
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

  /* ============================================================
     GLOBAL EVENT LISTENERS & BOOTSTRAP
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    updateSfxToggleBtn();

    const sfxBtn = document.getElementById('sfx-toggle-btn');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', toggleSfx);
    }

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

    initTheme();
    initResumeModal();
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

    ['pointerdown', 'click', 'keydown', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, initAudio, { passive: true });
    });
  });
})();
