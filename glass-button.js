import * as THREE from './vendor/three.module.min.js';

/**
 * Shared Three.js Glass Button & Fluid Glass Renderer
 * Handles WebGL rendering, off-screen pausing via IntersectionObserver,
 * visibilitychange tab pausing, and prefers-reduced-motion.
 */

const THEME_HEX_MAP = {
  cyan: 0x00f0ff,
  amber: 0xffb000,
  green: 0x00ff66,
  mono: 0xffffff
};

function getThemeAccentHex() {
  const theme = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'cyan';
  return THEME_HEX_MAP[theme] || 0x00f0ff;
}

export function initGlassButton(container, linkTarget = 'contact.html') {
  if (!container) return;
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(100, 100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dl = new THREE.DirectionalLight(0xffffff, 3);
    dl.position.set(2, 5, 5);
    scene.add(dl);
    const pl = new THREE.PointLight(getThemeAccentHex(), 2.5);
    pl.position.set(-2, -2, 3);
    scene.add(pl);

    // Dynamic HUD theme synchronization for 3D rim lighting
    const themeObserver = new MutationObserver(() => {
      pl.color.setHex(getThemeAccentHex());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.38, 80, 16),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.95,
        thickness: 2.5,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        opacity: 0.92,
        transparent: true
      })
    );
    scene.add(mesh);

    let isVisible = true;
    let isTabActive = true;
    let animId = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate() {
      if (!isVisible || !isTabActive) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(animate);
      if (!reducedMotion) {
        mesh.rotation.x += 0.006;
        mesh.rotation.y += 0.009;
      }
      renderer.render(scene, camera);
    }

    function start() {
      if (!animId) animate();
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
      if (isTabActive) start();
    });

    start();

    if (linkTarget) {
      container.style.cursor = 'pointer';
      container.addEventListener('click', () => {
        window.location.href = linkTarget;
      });
    }
  } catch (err) {
    console.warn('WebGL initialization skipped for glass button:', err);
  }
}

export function initFluidGlass(container) {
  if (!container) return;
  try {
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 3);
    dl.position.set(2, 5, 5);
    scene.add(dl);
    const pl = new THREE.PointLight(getThemeAccentHex(), 2.5);
    pl.position.set(-2, -2, 5);
    scene.add(pl);

    // Dynamic HUD theme synchronization for 3D rim lighting
    const themeObserver = new MutationObserver(() => {
      pl.color.setHex(getThemeAccentHex());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.1, 0.7, 80, 16),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.05,
        transmission: 0.95,
        thickness: 4.0,
        ior: 1.2,
        clearcoat: 1,
        clearcoatRoughness: 0.05
      })
    );
    scene.add(mesh);

    window.addEventListener('resize', () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    let isVisible = true;
    let isTabActive = true;
    let animId = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate() {
      if (!isVisible || !isTabActive) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(animate);
      if (!reducedMotion) {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    }

    function start() {
      if (!animId) animate();
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
      if (isTabActive) start();
    });

    start();
  } catch (err) {
    console.warn('WebGL initialization skipped for fluid glass:', err);
  }
}

// Auto-initialize default containers when DOM is loaded
if (typeof window !== 'undefined') {
  const setup = () => {
    const btn = document.getElementById('glass-button-container');
    if (btn) initGlassButton(btn, 'contact.html');
    const fluid = document.getElementById('fluid-glass-container');
    if (fluid) initFluidGlass(fluid);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}
