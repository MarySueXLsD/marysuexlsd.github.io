/* Loosy Tale Studio — site behaviour. No build step; Lenis is optional. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const T = text => (window.LT_I18N && window.LT_I18N[text]) || text;   // filled on translated pages

  /* ---------- grain texture ---------- */
  {
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
    root.style.setProperty('--noise', `url(${c.toDataURL()})`);
  }

  /* ---------- pixel eye glyphs ---------- */
  const EYE = ['..XXXXXXX..', '.X.......X.', 'X...XXX...X', 'X..XX.XX..X', 'X...XXX...X', '.X.......X.', '..XXXXXXX..'];
  const eyeSvg = (() => {
    let outline = '', iris = '';
    EYE.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch !== 'X') return;
      const rect = `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`;
      if (y >= 2 && y <= 4 && x >= 3 && x <= 7) iris += rect; else outline += rect;
    }));
    return `<svg viewBox="0 0 11 7" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${outline}<g class="iris">${iris}</g></svg>`;
  })();
  document.querySelectorAll('[data-pix-eye]').forEach(el => { el.innerHTML = eyeSvg; });

  /* ---------- clock ---------- */
  const clocks = document.querySelectorAll('[data-clock]');
  const stamps = document.querySelectorAll('[data-stamp]');
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    const hms = `${pad(d.getHours())} : ${pad(d.getMinutes())} : ${pad(d.getSeconds())}`;
    clocks.forEach(c => { c.textContent = hms; });
    const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}  ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    stamps.forEach(s => { s.textContent = stamp; });
  };
  tick();
  setInterval(tick, 1000);

  /* ---------- split giant headings into words ---------- */
  document.querySelectorAll('[data-split]').forEach(h => {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
  });

  /* ---------- smooth scroll ---------- */
  // Smooth scrolling is an extra: the page works at once, and Lenis switches on whenever its script arrives.
  let lenis = null;
  const initLenis = () => {
    if (lenis || !window.Lenis || reduce) return;
    lenis = new window.Lenis({ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  if (window.Lenis) initLenis(); else window.__ltLenis = initLenis;
  const scrollToEl = (el, offset = 0) => {
    if (lenis) lenis.scrollTo(el, { offset });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  const menuFocusables = () => [menuBtn, ...menu.querySelectorAll('a')];
  const openMenu = () => {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    if (lenis) lenis.stop();
    const current = menu.querySelector('.menu__links a.is-current') || menu.querySelector('a');
    setTimeout(() => current && current.focus({ preventScroll: true }), 30);
  };
  const closeMenu = (returnFocus = false) => {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    if (lenis) lenis.start();
    if (returnFocus) menuBtn.focus({ preventScroll: true });
  };
  menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu(true)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMenu(true); closeWhat(); }
    if (e.key === 'Tab' && !menu.hidden) {           // keep keyboard focus inside the open menu
      const f = menuFocusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // the menu marks the section you are in
  const secLinks = [...menu.querySelectorAll('[data-sec]')];
  const secIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    secLinks.forEach(l => l.classList.toggle('is-current', l.dataset.sec === en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secLinks.forEach(l => { const s = document.getElementById(l.dataset.sec); if (s) secIO.observe(s); });

  // One handler for every in-page link (also the ones the What & Why panel creates).
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.startsWith('#what-')) { e.preventDefault(); closeMenu(); openWhat(id.slice(6)); return; }
    const target = id === '#top' || id === '#' ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    closeWhat();
    if (target.classList.contains('row')) {
      document.querySelectorAll('.row.is-open').forEach(r => { if (r !== target) setRow(r, false); });
      setRow(target, true);
      setTimeout(() => scrollToEl(target, -84), 380);
    } else {
      scrollToEl(target);
      if (target.id === 'main') target.focus({ preventScroll: true });   // skip link
    }
  });

  /* ---------- back to top, games hint, gallery arrows ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { toTop.classList.toggle('is-on', scrollY > innerHeight * 1.2); ticking = false; });
    }, { passive: true });
  }
  const gamesHint = document.getElementById('gamesHint');
  if (gamesHint && !finePointer) gamesHint.textContent = T('[ TAP A GAME FOR ITS TRAILER ]');
  document.querySelectorAll('[data-gal]').forEach(b => b.addEventListener('click', () => {
    const g = document.getElementById('camGallery');
    if (g) g.scrollBy({ left: Number(b.dataset.gal) * g.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- nav label follows the section in view (only if the page has one) ---------- */
  const navLabel = document.getElementById('navLabel');
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?';
  let current = navLabel ? navLabel.textContent : '';
  let scrambleRaf = 0;
  const scramble = to => {
    if (to === current) return;
    current = to;
    cancelAnimationFrame(scrambleRaf);
    if (reduce) { navLabel.textContent = to; return; }
    const len = Math.max(navLabel.textContent.length, to.length);
    let f = 0;
    const total = 16;
    const run = () => {
      f++;
      let out = '';
      for (let i = 0; i < len; i++) {
        if (f / total > i / len) out += to[i] || '';
        else out += to[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      navLabel.textContent = out;
      if (f < total) scrambleRaf = requestAnimationFrame(run);
      else navLabel.textContent = to;
    };
    run();
  };
  if (navLabel) {
    const navIO = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) scramble(e.target.dataset.nav);
    }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('[data-nav]').forEach(s => navIO.observe(s));
  }

  /* ---------- the little eye up top: iris follows the pointer, blinks now and then ---------- */
  (function topEye() {
    const eye = document.querySelector('[data-top-eye]');
    if (!eye) return;
    const iris = eye.querySelector('.iris');
    if (iris && !reduce) {
      addEventListener('pointermove', e => {
        const r = eye.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        const x = Math.max(-1.6, Math.min(1.6, dx * 4.2)), y = Math.max(-0.8, Math.min(0.8, dy * 2.6));
        iris.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      });
    }
    if (reduce) return;
    const blink = () => {
      eye.classList.add('is-blink');
      setTimeout(() => eye.classList.remove('is-blink'), 150);
      setTimeout(blink, 2600 + Math.random() * 4200);
    };
    setTimeout(blink, 3200);
  })();

  /* ---------- What & Why panel ---------- */
  const WHAT = window.WHAT || [];
  const whatEl = document.getElementById('what');
  const whatVid = document.getElementById('whatVideo');
  const whatImg = document.getElementById('whatImg');
  const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let whatIdx = -1, whatReturn = null;

  function fillWhat(i) {
    const w = WHAT[i];
    whatIdx = i;
    const group = WHAT.filter(x => x.group === w.group);
    document.getElementById('whatCrumb').textContent = `[ ${w.group} · ${pad(group.indexOf(w) + 1)} / ${pad(group.length)} ]`;
    document.getElementById('whatTitle').textContent = w.title;
    document.getElementById('whatWhat').textContent = w.what;
    document.getElementById('whatWhy').textContent = w.why;
    document.getElementById('whatLinks').innerHTML = w.links.map(([label, href]) => href.startsWith('#')
      ? `<a href="${escHtml(href)}">${escHtml(label)} ↓</a>`
      : `<a href="${escHtml(href)}" target="_blank" rel="noopener">${escHtml(label)} ↗</a>`).join('');
    if (/\.mp4$/i.test(w.media)) {
      whatImg.hidden = true;
      whatVid.hidden = false;
      if (!whatVid.src.endsWith(w.media)) whatVid.src = w.media;
      if (!reduce) whatVid.play().catch(() => {});
    } else {
      whatVid.pause();
      whatVid.removeAttribute('src');
      whatVid.hidden = true;
      whatImg.hidden = false;
      whatImg.src = w.media;
    }
  }

  function openWhat(id) {
    const i = WHAT.findIndex(w => w.id === id);
    if (i < 0 || !whatEl) return;
    const wasOpen = whatEl.classList.contains('is-open');
    if (!wasOpen) whatReturn = document.activeElement;
    if (wasOpen && !reduce) {
      whatEl.classList.add('is-swapping');
      setTimeout(() => { fillWhat(i); whatEl.classList.remove('is-swapping'); }, 230);
    } else {
      fillWhat(i);
    }
    whatEl.classList.add('is-open');
    whatEl.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    history.replaceState(null, '', `#what-${id}`);
    if (!wasOpen) setTimeout(() => whatEl.querySelector('.what__close').focus({ preventScroll: true }), 60);
  }

  function closeWhat() {
    if (!whatEl || !whatEl.classList.contains('is-open')) return;
    whatEl.classList.remove('is-open');
    whatEl.setAttribute('aria-hidden', 'true');
    whatVid.pause();
    if (lenis) lenis.start();
    if (location.hash.startsWith('#what-')) history.replaceState(null, '', location.pathname + location.search);
    if (whatReturn && whatReturn.focus) whatReturn.focus({ preventScroll: true });
  }

  if (whatEl) {
    const step = d => openWhat(WHAT[(whatIdx + d + WHAT.length) % WHAT.length].id);
    whatEl.querySelectorAll('[data-what-close]').forEach(b => b.addEventListener('click', closeWhat));
    document.getElementById('whatPrev').addEventListener('click', () => step(-1));
    document.getElementById('whatNext').addEventListener('click', () => step(1));
    addEventListener('keydown', e => {
      if (!whatEl.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
    addEventListener('hashchange', () => { if (location.hash.startsWith('#what-')) openWhat(location.hash.slice(6)); });
    if (location.hash.startsWith('#what-')) setTimeout(() => openWhat(location.hash.slice(6)), 1500);
  }

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal], [data-split]').forEach(el => {
    if (!el.closest('.hero')) revealIO.observe(el);
  });

  /* ---------- lazy, visibility-driven looping videos ---------- */
  const vidIO = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.getAttribute('src')) { v.preload = reduce ? 'metadata' : 'auto'; v.src = v.dataset.lazy; }
      if (!reduce) v.play().catch(() => {});
    } else {
      v.pause();
    }
  }), { rootMargin: '200px 0px' });
  document.querySelectorAll('video[data-lazy]').forEach(v => vidIO.observe(v));

  /* ---------- game rows: expand for the trailer ---------- */
  const preview = document.getElementById('preview');
  const previewVid = preview.querySelector('video');
  const hidePreview = () => { preview.classList.remove('is-on'); previewVid.pause(); };

  const setRow = (row, open) => {
    const head = row.querySelector('.row__head');
    const trailer = row.querySelector('.row__trailer');
    row.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
    row.querySelector('.row__toggle').textContent = open ? '( − )' : '( + )';
    const isVideo = trailer && trailer.tagName === 'VIDEO';
    if (open && isVideo && !trailer.getAttribute('src')) trailer.src = trailer.dataset.src;
    if (!open && isVideo) trailer.pause();
  };
  document.querySelectorAll('.row').forEach(row => {
    const head = row.querySelector('.row__head');
    head.addEventListener('click', () => {
      const open = !row.classList.contains('is-open');
      document.querySelectorAll('.row.is-open').forEach(r => { if (r !== row) setRow(r, false); });
      setRow(row, open);
      if (open) {
        hidePreview();
        setTimeout(() => scrollToEl(row, -70), 320);
      }
    });

    if (finePointer) {
      head.addEventListener('mouseenter', () => {
        if (row.classList.contains('is-open')) return;
        const src = row.dataset.preview;
        if (!src) return;
        if (!previewVid.src.endsWith(src)) previewVid.src = src;
        if (!reduce) previewVid.play().catch(() => {});
        preview.classList.add('is-on');
      });
      head.addEventListener('mouseleave', hidePreview);
    }
  });

  if (finePointer) {
    let px = innerWidth / 2, py = innerHeight / 2, tx = px, ty = py;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY - 150; });
    const follow = () => {
      px += (tx - px) * 0.16;
      py += (ty - py) * 0.16;
      preview.style.left = `${px}px`;
      preview.style.top = `${py}px`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- background loops are ambient only: no menu, no picture-in-picture ---------- */
  document.querySelectorAll('.tale__bg, .footer__mark video, #heroSource').forEach(v => {
    v.addEventListener('contextmenu', e => e.preventDefault());
  });

  /* ---------- ordered-dither renderer ("seen through the eye") ---------- */
  const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map(v => (v + 0.5) / 64);
  const INK = [243, 238, 228], VOID = [18, 19, 19], RED = [226, 56, 44];

  function coverDraw(ctx, src, sw, sh, W, H) {
    const s = Math.max(W / sw, H / sh);
    const w = sw * s, h = sh * s;
    ctx.drawImage(src, (W - w) / 2, (H - h) / 2, w, h);
  }

  /* Hero: the showreel, dithered, with a giant pixel eye that follows the pointer. */
  try { (function hero() {
    const canvas = document.getElementById('heroDither');
    const video = document.getElementById('heroSource');
    const ctx = canvas.getContext('2d');
    const off = document.createElement('canvas');
    const octx = off.getContext('2d', { willReadFrequently: true });
    let W = 0, H = 0, out = null;
    let mx = 0.5, my = 0.5, ex = 0.5, ey = 0.5;
    let blinkT = -1, nextBlink = performance.now() + 2500;
    let visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const rw = r.width || innerWidth || 1280, rh = r.height || innerHeight || 720;
      W = Math.max(160, Math.round(rw / (rw < 700 ? 3.2 : 4.4)));
      H = Math.max(90, Math.min(1200, Math.round(W * rh / rw)));
      canvas.width = off.width = W;
      canvas.height = off.height = H;
      out = ctx.createImageData(W, H);
    };
    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; });
    new IntersectionObserver(es => es.forEach(e => {
      visible = e.isIntersecting;
      if (visible && !reduce) video.play().catch(() => {}); else video.pause();
    })).observe(canvas);

    const render = now => {
      const portrait = W < H * 1.1;
      const cx = W * (portrait ? 0.5 : 0.66), cy = H * (portrait ? 0.34 : 0.42);
      const ew = W * (portrait ? 0.42 : 0.25), eh = ew * 0.55;
      if (!finePointer && !reduce) { mx = 0.5 + Math.sin(now / 1700) * 0.35; my = 0.45 + Math.sin(now / 2300) * 0.2; }
      ex += (mx - ex) * 0.08;
      ey += (my - ey) * 0.08;

      // blink
      let open = 1;
      if (!reduce) {
        if (now > nextBlink && blinkT < 0) blinkT = now;
        if (blinkT >= 0) {
          const t = (now - blinkT) / 220;
          open = t < 1 ? Math.abs(1 - 2 * t) : 1;
          if (t >= 1) { blinkT = -1; nextBlink = now + 2200 + Math.random() * 3800; }
        }
      }

      // source luminance
      let src = null;
      if (video.readyState >= 2) {
        coverDraw(octx, video, video.videoWidth, video.videoHeight, W, H);
        src = octx.getImageData(0, 0, W, H).data;
      }
      const ix = cx + (ex - 0.5) * ew * 0.9, iy = cy + (ey - 0.5) * eh * 0.9;
      const ir = eh * 0.62, pr = ir * 0.42;
      const d = out.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          let L;
          if (src) {
            const k = i * 4;
            L = (0.2126 * src[k] + 0.7152 * src[k + 1] + 0.0722 * src[k + 2]) / 255;
            L = Math.min(1, Math.max(0, (L - 0.08) * 1.25)) * 0.78;
          } else {
            L = 0.18 + 0.12 * Math.sin(x * 0.05 + now / 900) * Math.cos(y * 0.07 - now / 1300);
          }
          let col = INK;
          const dx = (x - cx) / ew, dy = (y - cy) / eh;
          const lid = (1 - dx * dx) * open;
          if (lid > 0) {
            const edge = Math.abs(dy) - lid;
            if (edge < 0) {
              const rx = x - ix, ry = y - iy, r = Math.sqrt(rx * rx + ry * ry);
              if (r < pr) L = 0.02;
              else if (r < ir) { L = 0.36 + 0.22 * Math.sin(r * 0.9 + Math.atan2(ry, rx) * 6) + (src ? L * 0.2 : 0); col = RED; }
              else L = 0.9 - L * 0.25;
              const hx = x - (ix - pr * 0.9), hy = y - (iy - pr * 0.9);
              if (hx * hx + hy * hy < pr * pr * 0.18) { L = 1; col = INK; }
            }
            if (Math.abs(edge) < 0.07) L = 0.0;
          }
          const on = L > BAYER[(y & 7) * 8 + (x & 7)];
          const c = on ? col : VOID;
          const o = i * 4;
          d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    let last = 0;
    const loop = now => {
      if (visible && now - last > 33) { render(now); last = now; }
      if (!reduce) requestAnimationFrame(loop);
    };
    if (reduce) {
      video.pause();
      video.addEventListener('loadeddata', () => render(performance.now()), { once: true });
      render(performance.now());
    } else {
      requestAnimationFrame(loop);
    }
  })(); } catch (err) { console.warn('hero dither disabled:', err); }

  /* "What we make": a still from The Elder's Saga, dithered once. */
  (function makeBg() {
    const canvas = document.getElementById('makeDither');
    if (!canvas) return;
    const img = new Image();
    img.src = '/media/games/elders-saga/poster.jpg';
    const draw = () => {
      const r = canvas.getBoundingClientRect();
      const W = Math.round(r.width / 4), H = Math.round(W * r.height / r.width);
      if (!W || !H) return;
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      coverDraw(ctx, img, img.naturalWidth, img.naturalHeight, W, H);
      const im = ctx.getImageData(0, 0, W, H), d = im.data;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const o = (y * W + x) * 4;
        const L = (0.2126 * d[o] + 0.7152 * d[o + 1] + 0.0722 * d[o + 2]) / 255;
        const c = L * 1.4 > BAYER[(y & 7) * 8 + (x & 7)] ? INK : VOID;
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
      }
      ctx.putImageData(im, 0, 0);
    };
    img.onload = draw;
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => img.complete && draw(), 200); });
  })();


  /* ---------- Project Bodycam: the tape grows to full screen as you scroll ---------- */
  (function bodycam() {
    const cam = document.getElementById('bodycam');
    const pin = document.getElementById('camPin');
    const frame = document.getElementById('camFrame');
    const video = document.getElementById('camVideo');
    const play = document.getElementById('camPlay');
    if (!cam || !pin) return;
    const startTape = () => {
      cam.classList.add('is-playing');
      frame.style.setProperty('--p', 1);
      video.src = '';
      video.muted = false;
      video.loop = false;
      video.controls = true;
      video.play().catch(() => {});
    };
    if (play) play.addEventListener('click', startTape);
    video.addEventListener('contextmenu', e => e.preventDefault());
    if (reduce) { frame.style.setProperty('--p', 1); return; }
    const update = () => {
      const r = pin.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight && !cam.classList.contains('is-playing')) {
        const span = Math.max(1, (r.height - innerHeight) * 0.62);
        const p = Math.min(1, Math.max(0, -r.top / span));
        frame.style.setProperty('--p', (1 - Math.pow(1 - p, 3)).toFixed(4));
      }
      requestAnimationFrame(update);
    };
    update();
  })();

  /* Evidence locker: drag to scroll */
  (function gallery() {
    const g = document.getElementById('camGallery');
    if (!g) return;
    let down = false, sx = 0, sl = 0, moved = 0;
    g.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = g.scrollLeft;
      g.classList.add('is-dragging');
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      g.scrollLeft = sl - dx * 1.4;
    });
    addEventListener('pointerup', () => { down = false; g.classList.remove('is-dragging'); });
    g.addEventListener('click', e => { if (moved > 6) e.preventDefault(); }, true);
  })();

  /* Giant band: drifts on its own, speeds up and leans with scroll velocity */
  (function band() {
    const track = document.getElementById('bandTrack');
    if (!track || reduce) return;
    let x = 0, lastY = scrollY, vel = 0, visible = false;
    new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; })).observe(track);
    const loop = () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      vel += (dy - vel) * 0.12;
      if (visible) {
        x -= 1.1 + Math.abs(vel) * 0.35;
        const third = track.scrollWidth / 3;
        if (-x > third) x += third;
        const skew = Math.max(-14, Math.min(14, vel * 0.35));
        track.style.transform = `translate3d(${x}px, 0, 0) skewX(${-skew}deg)`;
      }
      requestAnimationFrame(loop);
    };
    loop();
  })();

  /* Stats count up when they come into view */
  (function stats() {
    const nums = document.querySelectorAll('[data-count]');
    if (reduce) return;
    nums.forEach(n => { n.textContent = '0'; });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const end = +e.target.dataset.count, t0 = performance.now();
      const step = now => {
        const t = Math.min(1, (now - t0) / 1300);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    nums.forEach(n => io.observe(n));
  })();

  /* ---------- contact form -> /api/contact -> Telegram ---------- */
  (function contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const nameIn = document.getElementById('cName'), reply = document.getElementById('cReply'), msg = document.getElementById('cMessage');
    const count = document.getElementById('cCount'), status = document.getElementById('cStatus'), send = document.getElementById('cSend');
    const trap = form.querySelector('input[name="website"]');
    const say = (text, kind) => { status.textContent = text; status.className = 'contact__status label' + (kind ? ` is-${kind}` : ''); };
    msg.addEventListener('input', () => { count.textContent = `${msg.value.length} / 3000`; msg.removeAttribute('aria-invalid'); });
    reply.addEventListener('input', () => reply.removeAttribute('aria-invalid'));
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (!reply.value.trim()) { reply.setAttribute('aria-invalid', 'true'); reply.focus(); return say(T('Tell us how to reply: an email or a Telegram @username.'), 'err'); }
      if (msg.value.trim().length < 5) { msg.setAttribute('aria-invalid', 'true'); msg.focus(); return say(T('Write a little more: at least 5 characters.'), 'err'); }
      if (document.querySelector('meta[name="lt-static"]')) {
        // static host (GitHub Pages): no server to relay the message, so hand it to Telegram
        const text = `${nameIn.value ? nameIn.value + ' here. ' : ''}${msg.value}

Reply to: ${reply.value}`;
        try { navigator.clipboard.writeText(text); } catch (err) { /* clipboard blocked: the link still works */ }
        status.className = 'contact__status label is-ok';
        status.innerHTML = `${T('Your message is copied.')} <a href="https://t.me/marysue" target="_blank" rel="noopener">${T('Open Telegram')}</a> ${T('and paste it to @marysue.')}`;
        window.open('https://t.me/marysue', '_blank', 'noopener');
        return;
      }
      send.disabled = true;
      say(T('Sending…'));
      try {
        const r = await fetch('/api/contact', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameIn.value, reply: reply.value, message: msg.value, website: trap.value }),
        });
        const j = await r.json().catch(() => ({}));
        if (r.ok) {
          form.reset();
          count.textContent = '0 / 3000';
          say(T('Sent. Thank you! MarySue will get back to you.'), 'ok');
        } else {
          say((j.error && j.error.message) || T('Something went wrong. Please try again.'), 'err');
        }
      } catch (err) {
        say(T('Could not reach the server. Check your connection and try again.'), 'err');
      } finally {
        send.disabled = false;
      }
    });
  })();

  /* ---------- loader: a red slit grows, then the eye opens ---------- */
  const loader = document.getElementById('loader');
  const count = document.getElementById('loaderCount');
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    loader.classList.add('is-done');
    setTimeout(() => {
      document.querySelectorAll('.hero [data-split], .hero [data-reveal]').forEach(el => el.classList.add('is-in'));
    }, 380);
    setTimeout(() => loader.classList.add('is-gone'), 1300);
  };
  // The intro plays once per visit; any click, key or scroll skips it.
  let seenIntro = false;
  try { seenIntro = sessionStorage.getItem('lt-intro') === '1'; sessionStorage.setItem('lt-intro', '1'); } catch (err) { /* storage blocked */ }
  if (reduce || seenIntro) { loader.classList.add('is-gone'); finish(); return; }
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, finish, { once: true, passive: true }));
  const t0 = performance.now();
  const step = now => {
    if (finished) return;
    const t = Math.min(1, Math.max(0, (now - t0) / 900));
    const e = 1 - Math.pow(1 - t, 2);
    count.textContent = String(Math.round(t * 100)).padStart(3, '0');
    loader.style.setProperty('--p', e.toFixed(3));
    if (t < 1) requestAnimationFrame(step); else setTimeout(finish, 120);
  };
  requestAnimationFrame(step);
  setTimeout(finish, 2000); // never leave the eye shut, even if animation frames are paused
})();
