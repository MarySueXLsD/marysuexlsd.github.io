/* Inner pages and the blog: film grain, pixel eyes, lazy looping previews, copy-link button. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const d = x.createImageData(256, 256);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    d.data[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  document.documentElement.style.setProperty('--noise', `url(${c.toDataURL()})`);

  // pixel eye glyphs
  const EYE = ['..XXXXXXX..', '.X.......X.', 'X...XXX...X', 'X..XX.XX..X', 'X...XXX...X', '.X.......X.', '..XXXXXXX..'];
  let outline = '', iris = '';
  EYE.forEach((row, y) => [...row].forEach((ch, xx) => {
    if (ch !== 'X') return;
    const r = `<rect x="${xx}" y="${y}" width="1.02" height="1.02"/>`;
    if (y >= 2 && y <= 4 && xx >= 3 && xx <= 7) iris += r; else outline += r;
  }));
  const svg = `<svg viewBox="0 0 11 7" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${outline}<g class="iris">${iris}</g></svg>`;
  document.querySelectorAll('[data-pix-eye]').forEach(el => { el.innerHTML = svg; });

  // lazy, visibility-driven looping videos
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.getAttribute('src')) v.src = v.dataset.lazy;
      if (!reduce) v.play().catch(() => {});
    } else {
      v.pause();
    }
  }), { rootMargin: '200px 0px' });
  document.querySelectorAll('video[data-lazy]').forEach(v => io.observe(v));

  // copy link
  document.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', async () => {
    const label = b.textContent;
    try { await navigator.clipboard.writeText(location.href.split('?')[0]); b.textContent = b.dataset.done || 'Link copied'; }
    catch (err) { b.textContent = 'Copy failed: use the address bar'; }
    setTimeout(() => { b.textContent = label; }, 2200);
  }));
  // banner corners: a live clock and a running tape counter
  const pad = n => String(n).padStart(2, '0');
  const clocks = document.querySelectorAll('[data-clock]'), counters = document.querySelectorAll('[data-counter]');
  const t0 = Date.now();
  const tick = () => {
    const d = new Date();
    clocks.forEach(el => { el.textContent = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; });
    const s = Math.floor((Date.now() - t0) / 1000);
    counters.forEach(el => { el.textContent = `${Math.floor(s / 3600)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; });
  };
  if (clocks.length || counters.length) { tick(); setInterval(tick, 1000); }

  // trailer modal
  document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => {
    const dlg = document.querySelector(btn.dataset.open);
    if (!dlg) return;
    const v = dlg.querySelector('video');
    if (v && !v.getAttribute('src')) v.src = v.dataset.src;
    dlg.showModal();
    if (v) v.play().catch(() => {});
  }));
  document.querySelectorAll('.tb-dialog').forEach(dlg => {
    const stop = () => { const v = dlg.querySelector('video'); if (v) v.pause(); };
    dlg.addEventListener('close', stop);
    dlg.addEventListener('click', ev => { if (ev.target === dlg || ev.target.closest('[data-close]')) dlg.close(); });
  });
})();
