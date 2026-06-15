/* MALCOLM — small enhancements */

// Pittsburgh time clock
(function clock() {
  const el = document.getElementById('clock');
  if (!el) return;
  function update() {
    const now = new Date();
    // Pittsburgh: UTC-4 (EDT) approx
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/New_York' };
    el.textContent = new Intl.DateTimeFormat('en-US', opts).format(now);
  }
  update();
  setInterval(update, 30000);
})();

// Scroll reveal
(function reveal() {
  const targets = document.querySelectorAll(
    '.chapter__header, .prose, .margin, .album, .card, .discog li, .pullquote, .lede, .after__inner > *'
  );
  targets.forEach(t => t.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => io.observe(t));
})();

// Subtle parallax on hero name letters
(function nameParallax() {
  const letters = document.querySelectorAll('.hero__name .letter');
  if (!letters.length) return;
  let raf = null;
  let armed = false;
  // Wait for entrance choreography to finish before parallax takes over
  setTimeout(() => { armed = true; }, 1900);
  document.addEventListener('mousemove', (e) => {
    if (!armed) return;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      letters.forEach((l, i) => {
        const factor = (i % 2 === 0 ? 1 : -1) * (4 + i * 0.6);
        l.style.transform = `translate(${dx * factor}px, ${dy * factor * 0.5}px)`;
      });
      raf = null;
    });
  });
})();

// Waveform bars (deterministic + subtle live shimmer)
(function waveform() {
  const host = document.getElementById('waveBars');
  if (!host) return;
  const COUNT = 96;
  // Pseudo-musical envelope: build then taper, with small variations
  const heights = [];
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    // shape like a song's loudness envelope: rises, plateau, decays
    const env = Math.sin(Math.PI * t) * 0.85 + 0.15;
    // variation
    const noise = (Math.sin(i * 1.7) + Math.sin(i * 0.43) + Math.sin(i * 3.1)) / 3;
    const h = Math.max(0.08, Math.min(1, env * (0.6 + noise * 0.55)));
    heights.push(h);
  }
  heights.forEach((h) => {
    const bar = document.createElement('span');
    bar.style.height = (h * 100) + '%';
    host.appendChild(bar);
  });
  // gentle live shimmer
  const bars = host.children;
  let phase = 0;
  setInterval(() => {
    phase += 0.12;
    for (let i = 0; i < bars.length; i++) {
      const wobble = 1 + Math.sin(phase + i * 0.18) * 0.08;
      bars[i].style.transform = `scaleY(${wobble})`;
    }
  }, 80);
})();

// Now-playing rotator
(function nowPlaying() {
  const el = document.getElementById('nowTrack');
  const btn = document.getElementById('nextTrack');
  if (!el) return;
  const tracks = [
    'Mac Miller — Self Care',
    'Mac Miller — 2009',
    'Mac Miller — Good News',
    'Mac Miller — Come Back to Earth',
    'Mac Miller — Wedding',
    'Mac Miller — Surf',
    'Mac Miller — Funeral',
    'Mac Miller — Diablo',
    'Mac Miller — Best Day Ever'
  ];
  let i = 0;
  function set(idx) {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = tracks[idx];
      el.style.opacity = '1';
    }, 240);
  }
  el.style.transition = 'opacity 0.3s';
  setInterval(() => { i = (i + 1) % tracks.length; set(i); }, 7000);
  if (btn) btn.addEventListener('click', () => { i = (i + 1) % tracks.length; set(i); });
})();

// Scroll progress + player auto-fade near footer
(function scrollPolish() {
  const bar = document.getElementById('scrollBar');
  const player = document.querySelector('.player');
  const foot = document.querySelector('.foot');
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const pct = Math.max(0, Math.min(1, scrollTop / max));
    if (bar) bar.style.width = (pct * 100).toFixed(2) + '%';
    if (player && foot) {
      const r = foot.getBoundingClientRect();
      const nearFoot = r.top < window.innerHeight - 80;
      player.classList.toggle('player--quiet', nearFoot);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

/* ===================== ITERATION 4 MOTION ===================== */

// Honor reduced motion
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Index hero letters for staggered drop-in animation
(function indexHeroLetters() {
  document.querySelectorAll('.hero__name .letter').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });
})();

// Ink cursor — navy dot + lagging halo
(function inkCursor() {
  if (reduceMotion) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const cursor = document.querySelector('.ink-cursor');
  if (!cursor) return;
  const dot = cursor.querySelector('.ink-cursor__dot');
  const ring = cursor.querySelector('.ink-cursor__ring');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my; // ring lags
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
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-down'));

  // hover state on interactive elements
  const hoverSel = 'a, button, .card, .album, .polaroid, .discog li, .player__btn, .nav__links a';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
  });

  // Smooth ring follow
  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

// Kinetic split — wrap chapter title words for staggered reveal
(function kineticTitles() {
  const titles = document.querySelectorAll('.chapter__title, .after__title, .swimming__title, .words__head h2, .sideb__head h2');
  titles.forEach((el) => {
    // Walk children: split text nodes; preserve inline tags like <em>
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

  // Reveal when in viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('kinetic-ready');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  titles.forEach(t => io.observe(t));
})();

// Album 3D tilt on hover
(function albumTilt() {
  if (reduceMotion) return;
  document.querySelectorAll('.album').forEach((card) => {
    const cover = card.querySelector('.album__cover');
    if (!cover) return;
    card.addEventListener('mousemove', (e) => {
      const r = cover.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      const rx = (-y * 10).toFixed(2);
      const ry = ( x * 12).toFixed(2);
      cover.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      cover.style.transform = '';
    });
  });
})();

// Discog year count-up on enter
(function discogCountUp() {
  if (reduceMotion) return;
  const items = document.querySelectorAll('.discog__year');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const node = e.target;
      const target = parseInt(node.textContent, 10);
      if (isNaN(target)) { io.unobserve(node); return; }
      const start = target - 8;
      const dur = 700;
      const t0 = performance.now();
      function step(t) {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        node.textContent = Math.round(start + (target - start) * eased);
        if (k < 1) requestAnimationFrame(step);
        else node.textContent = target;
      }
      requestAnimationFrame(step);
      io.unobserve(node);
    });
  }, { threshold: 0.4 });
  items.forEach(i => io.observe(i));
})();

// Magnetic nav links — subtle pull toward cursor
(function magneticNav() {
  if (reduceMotion) return;
  document.querySelectorAll('.nav__links a').forEach((link) => {
    link.addEventListener('mousemove', (e) => {
      const r = link.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      link.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });
})();

// Footer monogram — rotate slowly with overall scroll progress
(function footerMonogramRot() {
  if (reduceMotion) return;
  const mark = document.querySelector('.foot__bigmark');
  if (!mark) return;
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const pct = Math.max(0, Math.min(1, scrollTop / max));
    mark.style.setProperty('--mark-rot', (pct * 18 - 4).toFixed(2) + 'deg');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
