import { initAudio, playClick, playHover } from './sfx.js';

export const TECH_DATA = {
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

export function initStackInspector() {
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
      `<a href="${p.link}" class="tech-project-chip">
        <span>${p.name}</span>
        <span style="color:#00f0ff;">&rarr;</span>
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
