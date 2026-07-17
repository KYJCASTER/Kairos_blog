/* SWIMMING — small enhancements */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dive clock — mm:ss counted up since page load, framed as "time underwater"
(function diveClock() {
  const el = document.getElementById('diveClock');
  if (!el) return;
  const start = performance.now();
  function update() {
    const elapsed = Math.floor((performance.now() - start) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
})();

// Scroll reveal
(function reveal() {
  const targets = document.querySelectorAll(
    '.chapter__header, .prose, .prose--wide, .margin, .lede, .pullquote, .sample-list, ' +
    '.track-entry, .score, .after__inner > *, .cover-concept__grid, .outro__inner > *'
  );
  targets.forEach((t) => t.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach((t) => io.observe(t));
})();

// Kinetic split — wrap chapter title words for staggered reveal
(function kineticTitles() {
  const titles = document.querySelectorAll('.chapter__title, .after__title');
  titles.forEach((el) => {
    const walk = (node, wordIndex) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.nodeValue.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(p));
            } else if (p.length) {
              const span = document.createElement('span');
              span.className = 'kinetic-word';
              span.style.setProperty('--w', wordIndex.value++);
              span.textContent = p;
              frag.appendChild(span);
            }
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child, wordIndex);
        }
      });
    };
    walk(el, { value: 0 });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('kinetic-ready');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  titles.forEach((t) => io.observe(t));
})();

// Ink cursor — teal dot + lagging halo
(function inkCursor() {
  if (reduceMotion) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const cursor = document.querySelector('.ink-cursor');
  if (!cursor) return;
  const dot = cursor.querySelector('.ink-cursor__dot');
  const ring = cursor.querySelector('.ink-cursor__ring');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let active = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!active) {
      active = true;
      cursor.classList.add('is-active');
      document.body.classList.add('ink-active');
    }
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => {
    active = false;
    cursor.classList.remove('is-active');
    document.body.classList.remove('ink-active');
  });

  document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
  document.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

  const hoverSel = 'a, button, .track-entry, .score, .cover-frame, .porthole-ring';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
  });

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

// Scroll progress bar
(function scrollProgress() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const pct = Math.max(0, Math.min(1, scrollTop / max));
    bar.style.width = (pct * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// Rising bubbles — a slow, sparse ambient layer (skipped under reduced motion)
(function bubbles() {
  if (reduceMotion) return;
  const host = document.getElementById('bubbles');
  if (!host) return;
  const COUNT = 16;
  for (let i = 0; i < COUNT; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const size = 6 + Math.random() * 22;
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 16;
    const delay = -Math.random() * (duration);
    const drift = (Math.random() - 0.5) * 60;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = left + 'vw';
    b.style.setProperty('--drift', drift + 'px');
    b.style.animationDuration = duration + 's';
    b.style.animationDelay = delay + 's';
    host.appendChild(b);
  }
})();

// Per-track sparkline — deterministic pseudo-waveform, unique per row
(function sparklines() {
  const waves = document.querySelectorAll('[data-wave]');
  const BARS = 28;
  waves.forEach((host, trackIndex) => {
    for (let i = 0; i < BARS; i++) {
      const t = i / (BARS - 1);
      const env = Math.sin(Math.PI * t) * 0.8 + 0.2;
      const noise = Math.sin(i * 1.9 + trackIndex * 3.7) * 0.5 + Math.sin(i * 0.6 + trackIndex) * 0.5;
      const h = Math.max(0.12, Math.min(1, env * (0.55 + noise * 0.5)));
      const bar = document.createElement('span');
      bar.style.height = (h * 100) + '%';
      host.appendChild(bar);
    }
  });
})();
