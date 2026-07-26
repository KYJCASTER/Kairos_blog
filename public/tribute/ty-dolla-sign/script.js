/* TY DOLLA $IGN — page enhancements */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// LA clock — what time is it right now on the West Coast
(function laClock() {
  const el = document.getElementById('laClock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  function update() {
    el.textContent = fmt.format(new Date());
  }
  update();
  setInterval(update, 30 * 1000);
})();

// Scroll progress bar
(function progress() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;
  let ticking = false;
  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? doc.scrollTop / max : 0;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
})();

// Scroll reveal
(function reveal() {
  const targets = document.querySelectorAll(
    '.chapter__header, .lede, .prose, .pullquote, .margin, .timeline__item, ' +
    '.feature-card, .anatomy__row, .shelf__item, .stat, .outro__inner > *',
  );
  if (reduceMotion || typeof IntersectionObserver === 'undefined') return;
  targets.forEach((t) => t.classList.add('reveal'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  targets.forEach((t) => io.observe(t));
})();

// Stagger grids a little — cards inside the same grid arrive in sequence
(function stagger() {
  if (reduceMotion) return;
  document.querySelectorAll('.feature-grid, .shelf, .stat-strip, .timeline').forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
    });
  });
})();

// Bass strings — click (or tap) to pluck. Keyboard users can pluck the
// whole set with Enter when the hero CTA has focus… kept simple: strings
// are decorative (aria-hidden), pointer-only.
(function strings() {
  const wrap = document.getElementById('strings');
  if (!wrap || reduceMotion) return;
  wrap.querySelectorAll('.string').forEach((s) => {
    s.addEventListener('pointerdown', () => {
      s.classList.remove('is-plucked');
      // force restart of the animation
      void s.offsetWidth;
      s.classList.add('is-plucked');
    });
    s.addEventListener('animationend', () => s.classList.remove('is-plucked'));
  });
})();
