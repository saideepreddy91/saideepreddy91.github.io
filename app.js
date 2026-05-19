(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* nav scrolled state */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* scroll-spy: highlight active nav link */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('#navlinks a'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && byId[e.target.id]) {
        links.forEach(function (l) { l.classList.remove('active'); });
        byId[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) {
    spy.observe(s);
  });

  /* mobile menu */
  var mBtn = document.getElementById('menuBtn');
  var mMenu = document.getElementById('mobileMenu');
  var mClose = document.getElementById('menuClose');
  function openMenu() {
    mMenu.classList.add('open');
    mBtn.setAttribute('aria-expanded', 'true');
    mBtn.setAttribute('aria-label', 'Close menu');
    var first = mMenu.querySelector('a'); if (first) first.focus();
  }
  function closeMenu() {
    mMenu.classList.remove('open');
    mBtn.setAttribute('aria-expanded', 'false');
    mBtn.setAttribute('aria-label', 'Open menu');
    mBtn.focus();
  }
  mBtn.addEventListener('click', openMenu);
  mClose.addEventListener('click', closeMenu);
  mMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* reveal-on-scroll */
  if (reduce) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in');
    });
  } else {
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) {
      rev.observe(el);
    });
  }

  /* hero canvas — locked 5-layer orchestrated-agents animation */
  initHeroCanvas();

  function initHeroCanvas() {
    var cv = document.getElementById('heroCanvas');
    if (!cv || !cv.getContext) { window.__heroAnimating = false; return; }
    var x = cv.getContext('2d');
    var W, H, dpr;
    function resize() {
      var r = cv.getBoundingClientRect();
      dpr = Math.max(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.textBaseline = 'middle';
    }
    resize();
    window.addEventListener('resize', resize);

    var T = '#5eead4';
    function L(xr, ys, label, anchor, dy) {
      return ys.map(function (yy) {
        return { xr: xr, yr: yy, r: label === 'orchestrator' ? 6.5 : 5,
                 glow: 0, label: label, anchor: anchor || 'middle',
                 dy: dy || -14, x: 0, y: 0 };
      });
    }
    var layers = [
      L(0.55, [0.5], 'orchestrator', 'end', -16),
      L(0.66, [0.30, 0.70], 'planner', 'middle', -14),
      L(0.77, [0.16, 0.40, 0.60, 0.84], 'agent', 'middle', -14),
      L(0.88, [0.34, 0.66], 'tool', 'middle', 17),
      L(0.92, [0.5], 'aggregate', 'middle', 18)
    ];
    var edges = [];
    for (var i = 0; i < layers.length - 1; i++) {
      layers[i].forEach(function (a) {
        layers[i + 1].forEach(function (b) { edges.push({ a: a, b: b }); });
      });
    }
    var pulses = [], timer = 0, running = false, rafId = null;

    function place() {
      layers.forEach(function (ly) {
        ly.forEach(function (n) {
          n.x = n.xr * W;
          n.y = 0.12 * H + n.yr * 0.74 * H;
        });
      });
    }
    function cycle() {
      for (var i = 0; i < layers.length - 1; i++) {
        (function (i) {
          setTimeout(function () {
            if (!running) return;
            layers[i].forEach(function (a) {
              a.glow = 1;
              layers[i + 1].forEach(function (b) {
                pulses.push({ a: a, b: b, t: 0, s: 0.035 });
              });
            });
          }, i * 160);
        })(i);
      }
    }
    function node(n) {
      x.beginPath(); x.arc(n.x, n.y, n.r + 6 * n.glow, 0, 7);
      x.fillStyle = 'rgba(94,234,212,' + (0.10 * n.glow) + ')'; x.fill();
      x.beginPath(); x.arc(n.x, n.y, n.r, 0, 7);
      x.fillStyle = 'rgba(94,234,212,' + (0.30 + 0.5 * n.glow) + ')'; x.fill();
      x.font = '600 11px ui-monospace,monospace';
      x.textAlign = n.anchor;
      x.fillStyle = 'rgba(160,174,192,' + (0.45 + 0.45 * n.glow) + ')';
      var ox = n.anchor === 'end' ? -10 : n.anchor === 'start' ? 10 : 0;
      x.fillText(n.label, Math.round(n.x + ox), Math.round(n.y + n.dy));
      n.glow *= 0.95;
    }
    function staticFrame() {
      place();
      x.clearRect(0, 0, W, H);
      x.strokeStyle = 'rgba(120,140,160,0.09)'; x.lineWidth = 1;
      edges.forEach(function (e) {
        x.beginPath(); x.moveTo(e.a.x, e.a.y); x.lineTo(e.b.x, e.b.y); x.stroke();
      });
      layers.forEach(function (ly) { ly.forEach(node); });
    }
    function frame() {
      place();
      x.clearRect(0, 0, W, H);
      x.strokeStyle = 'rgba(120,140,160,0.09)'; x.lineWidth = 1;
      edges.forEach(function (e) {
        x.beginPath(); x.moveTo(e.a.x, e.a.y); x.lineTo(e.b.x, e.b.y); x.stroke();
      });
      if (++timer > 95) { timer = 0; cycle(); }
      pulses.forEach(function (p) {
        p.t += p.s;
        var px = p.a.x + (p.b.x - p.a.x) * p.t;
        var py = p.a.y + (p.b.y - p.a.y) * p.t;
        if (p.t >= 1) p.b.glow = 1;
        x.beginPath(); x.arc(px, py, 2.4, 0, 7);
        x.fillStyle = T; x.fill();
      });
      pulses = pulses.filter(function (p) { return p.t < 1; });
      layers.forEach(function (ly) { ly.forEach(node); });
      rafId = window.requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      window.__heroAnimating = true;
      rafId = window.requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      window.__heroAnimating = false;
      if (rafId) window.cancelAnimationFrame(rafId);
    }

    if (reduce) {
      window.__heroAnimating = false;
      staticFrame();
      window.addEventListener('resize', staticFrame);
      return;
    }
    /* pause when hero off-screen */
    var hero = document.querySelector('.hero');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) start(); else stop();
      });
    }, { threshold: 0.01 });
    io.observe(hero);
    /* pause on hidden tab */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (isHeroVisible()) start();
    });
    function isHeroVisible() {
      var r = hero.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }
    start();
  }
})();
