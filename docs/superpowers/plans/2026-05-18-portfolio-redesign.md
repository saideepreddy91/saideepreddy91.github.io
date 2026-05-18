# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild saideepreddy91.github.io as a recruiter-facing, dark-technical + editorial single-page portfolio with an animated orchestrated-agents hero, plain HTML/CSS/JS, no build step.

**Architecture:** One `index.html` (semantic sections), one `style.css` (CSS custom-property design tokens + all styles), one `app.js` (nav state, scroll-spy, mobile menu, reveal-on-scroll, hero canvas animation). All template dependencies (Bootstrap, Now UI Kit, jQuery, AOS) removed. Playwright tests updated to the new section IDs plus new behavioral assertions. Deploys to GitHub Pages as static files.

**Tech Stack:** HTML5, modern CSS (custom properties, `clamp()`, grid), vanilla ES5-safe JS, Canvas 2D, Playwright (existing config: python `http.server` on :8080).

**Reference spec:** `docs/superpowers/specs/2026-05-18-portfolio-redesign-design.md`

---

### Task 1: Remove template assets and create the design-system stylesheet

**Files:**
- Delete: `css/`, `js/`, `scripts/`, `styles/`, `index.html.bak`
- Create: `style.css`

- [ ] **Step 1: Back up the current index.html for content reference**

```bash
cp index.html /tmp/old-index-reference.html
```

This preserves the real content (publication text, links, bio) for Task 2. `/tmp` is intentional — it must not be committed.

- [ ] **Step 2: Delete old template asset directories and the stray backup**

```bash
git rm -r css js scripts styles
git rm index.html.bak
```

Expected: git stages deletions. Bootstrap/Now UI Kit/jQuery/AOS are gone.

- [ ] **Step 3: Create `style.css` with the full design system**

Create `style.css`:

```css
:root{
  --bg:#0a0c10; --surface:#0e1117; --surface2:#11151c; --border:#232a36;
  --text:#e6e6e6; --muted:#9aa4b2; --accent:#5eead4;
  --mono:ui-monospace,SFMono-Regular,'JetBrains Mono',Menlo,monospace;
  --serif:Georgia,'Times New Roman',serif;
  --sans:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;
  --max:1080px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.wrap{max-width:var(--max);margin:0 auto;padding:0 28px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--accent)}
h2.sec{font-family:var(--serif);font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:-1px;margin:8px 0 32px;display:flex;align-items:baseline;gap:14px}
h2.sec .idx{font-family:var(--mono);font-size:14px;color:var(--muted);font-weight:400}
section{padding:96px 0;border-top:1px solid var(--border)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px}
.muted{color:var(--muted)}
.tag{font-family:var(--mono);font-size:11px;color:var(--accent);border:1px solid var(--border);border-radius:5px;padding:3px 9px;display:inline-block;margin:4px 6px 0 0}

nav{position:fixed;top:0;left:0;right:0;z-index:50;transition:.3s;padding:18px 0}
nav.scrolled{background:rgba(10,12,16,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:12px 0}
nav .wrap{display:flex;justify-content:space-between;align-items:center}
.brand{font-family:var(--mono);font-weight:700;color:var(--accent)}
.links{display:flex;gap:24px;font-size:13px;font-family:var(--mono)}
.links a{color:var(--muted);transition:.2s}
.links a:hover,.links a.active{color:var(--accent)}
.menu-btn{display:none;background:none;border:1px solid var(--border);color:var(--accent);font-family:var(--mono);font-size:13px;padding:8px 12px;border-radius:6px;cursor:pointer}
.mobile-menu{position:fixed;inset:0;background:var(--bg);z-index:60;display:none;flex-direction:column;align-items:center;justify-content:center;gap:28px;font-family:var(--mono);font-size:18px}
.mobile-menu.open{display:flex}
.mobile-menu a{color:var(--muted)}
.mobile-menu .close{position:absolute;top:24px;right:28px;font-size:14px;color:var(--accent);background:none;border:none;cursor:pointer;font-family:var(--mono)}
@media(max-width:780px){.links{display:none}.menu-btn{display:block}}

.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
#heroCanvas{position:absolute;inset:0;width:100%;height:100%}
.hero .wrap{position:relative;z-index:2}
.hero h1{font-family:var(--serif);font-size:clamp(44px,8vw,84px);font-weight:700;letter-spacing:-2px;line-height:1.05;margin:16px 0 12px}
.hero p.vp{font-size:clamp(16px,2vw,20px);color:var(--muted);max-width:540px}
.cta{margin-top:32px;font-family:var(--mono);font-size:14px}
.btn{padding:12px 22px;border-radius:7px;display:inline-block;margin:0 12px 12px 0}
.btn-p{background:var(--accent);color:#08090c;font-weight:600}
.btn-s{border:1px solid var(--border);color:var(--accent)}
.social{margin-top:28px;display:flex;gap:18px;font-family:var(--mono);font-size:13px}
.social a{color:var(--muted)}.social a:hover{color:var(--accent)}

.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.stat{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:22px;text-align:center}
.stat .n{font-family:var(--serif);font-size:26px;color:var(--accent)}
.stat .l{font-family:var(--mono);font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:6px}
@media(max-width:780px){.stats{grid-template-columns:repeat(2,1fr)}}

.tl{border-left:2px solid var(--border);padding-left:28px;display:flex;flex-direction:column;gap:36px}
.tl .role{position:relative}
.tl .role::before{content:'';position:absolute;left:-35px;top:6px;width:10px;height:10px;border-radius:50%;background:var(--accent)}
.tl h3{font-size:18px}
.tl .meta{font-family:var(--mono);font-size:12px;color:var(--muted);margin:4px 0 10px}
.tl ul{margin-left:18px;color:var(--muted)}
.tl li{margin:5px 0}

.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
@media(max-width:780px){.grid{grid-template-columns:1fr}}
.proj h3{font-size:17px;margin-bottom:6px}
.proj p{color:var(--muted);font-size:14px}

.skills{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
@media(max-width:780px){.skills{grid-template-columns:repeat(2,1fr)}}
.skills h4{font-family:var(--mono);font-size:12px;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.skills ul{list-style:none}
.skills li{color:var(--muted);font-size:14px;padding:4px 0}

.bigmail{font-family:var(--serif);font-size:clamp(24px,4vw,40px);color:var(--accent)}
footer{padding:60px 0;border-top:1px solid var(--border);text-align:center;color:var(--muted);font-family:var(--mono);font-size:12px}

.reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
.reveal.in{opacity:1;transform:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .reveal{opacity:1;transform:none;transition:none}
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove template assets, add design-system stylesheet

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Rebuild index.html with all sections

**Files:**
- Create (overwrite): `index.html`
- Reference: `/tmp/old-index-reference.html` (real content), spec section "Sections"

- [ ] **Step 1: Overwrite `index.html` with the full production markup**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-131768223-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-131768223-1');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Saideep Reddy — ML Engineer</title>
<meta name="description" content="Saideep Reddy — Machine Learning Engineer at Apple. Computer vision and ML infrastructure.">
<link rel="stylesheet" href="style.css">
</head>
<body id="top">

<nav id="nav"><div class="wrap">
  <a class="brand" href="#top">SR</a>
  <div class="links" id="navlinks">
    <a href="#about">about</a><a href="#experience">experience</a><a href="#projects">projects</a>
    <a href="#skills">skills</a><a href="#publications">publications</a><a href="#education">education</a>
    <a href="#tutorials">tutorials</a><a href="#contact">contact</a>
  </div>
  <button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">menu</button>
</div></nav>

<div class="mobile-menu" id="mobileMenu">
  <button class="close" id="menuClose" aria-label="Close menu">close ✕</button>
  <a href="#about">about</a><a href="#experience">experience</a><a href="#projects">projects</a>
  <a href="#skills">skills</a><a href="#publications">publications</a><a href="#education">education</a>
  <a href="#tutorials">tutorials</a><a href="#contact">contact</a>
</div>

<header class="hero">
  <canvas id="heroCanvas" aria-hidden="true"></canvas>
  <div class="wrap">
    <div class="eyebrow">ML Engineer · Apple</div>
    <h1>Saideep&nbsp;Reddy</h1>
    <p class="vp">I build computer-vision &amp; ML infrastructure that ships to millions — and the agentic systems that orchestrate it.</p>
    <div class="cta">
      <a class="btn btn-p" href="#projects">View work</a>
      <a class="btn btn-s" href="#contact">Contact</a>
    </div>
    <div class="social">
      <a href="https://github.com/saideepreddy91">GitHub ↗</a>
      <a href="https://www.linkedin.com/in/saideep-reddy">LinkedIn ↗</a>
    </div>
  </div>
</header>

<main>
<section id="impact" style="border-top:none">
  <div class="wrap"><div class="stats reveal">
    <!-- TODO(content): confirm real users-impacted number -->
    <div class="stat"><div class="n">10M+</div><div class="l">users impacted</div></div>
    <div class="stat"><div class="n">Apple</div><div class="l">Vision Products Group</div></div>
    <div class="stat"><div class="n">UC San Diego</div><div class="l">MS · ML &amp; Data Science</div></div>
    <!-- TODO(content): confirm years of CV/ML experience -->
    <div class="stat"><div class="n">5+ yrs</div><div class="l">CV / ML systems</div></div>
  </div></div>
</section>

<section id="about">
  <div class="wrap">
    <h2 class="sec"><span class="idx">01</span>About</h2>
    <div class="grid reveal">
      <div class="card">
        <!-- TODO(content): expand bio — focus areas, what you ship, what you care about -->
        <p>Hello! I'm Saideep Reddy, a Machine Learning Engineer at Apple (Vision Products Group) with an MS in Machine Learning &amp; Data Science from UC San Diego. I work on computer-vision models and the ML infrastructure that takes them to production at scale.</p>
      </div>
      <div class="card">
        <p><strong>Email</strong><br><span class="muted">saideepreddy91@gmail.com</span></p>
        <p style="margin-top:14px"><strong>GitHub</strong><br><a class="muted" href="https://github.com/saideepreddy91">github.com/saideepreddy91</a></p>
        <p style="margin-top:14px"><strong>LinkedIn</strong><br><a class="muted" href="https://www.linkedin.com/in/saideep-reddy/">linkedin.com/in/saideep-reddy</a></p>
      </div>
    </div>
  </div>
</section>

<section id="experience">
  <div class="wrap">
    <h2 class="sec"><span class="idx">02</span>Experience</h2>
    <div class="tl reveal">
      <div class="role">
        <h3>Machine Learning Engineer — Apple</h3>
        <div class="meta">Vision Products Group · Cupertino, CA · present</div>
        <!-- TODO(content): replace with real metric-led impact bullets -->
        <ul>
          <li>Built and shipped computer-vision models powering features used by millions of users.</li>
          <li>Developed ML infrastructure for training and serving vision models at scale.</li>
        </ul>
      </div>
      <div class="role">
        <!-- TODO(content): prior role(s) — title, org, dates, quantified bullets -->
        <h3>Prior Role — Company</h3>
        <div class="meta">Team · Location · dates</div>
        <ul><li>Quantified impact bullet.</li></ul>
      </div>
    </div>
  </div>
</section>

<section id="projects">
  <div class="wrap">
    <h2 class="sec"><span class="idx">03</span>Selected Projects</h2>
    <div class="grid reveal">
      <div class="card proj">
        <h3>Real-time News Category Classification</h3>
        <p>Streaming text classifier categorizing live news into topics in real time.</p>
        <div><span class="tag">NLP</span><span class="tag">Python</span><span class="tag">Streaming</span></div>
      </div>
      <!-- TODO(content): add real projects with one-line problem→impact + tags + links -->
      <div class="card proj">
        <h3>Project Two</h3>
        <p>One line: problem solved and measurable impact.</p>
        <div><span class="tag">CV</span><span class="tag">PyTorch</span></div>
      </div>
      <div class="card proj">
        <h3>Project Three</h3>
        <p>One line: problem solved and measurable impact.</p>
        <div><span class="tag">MLOps</span></div>
      </div>
      <div class="card proj">
        <h3>Project Four</h3>
        <p>One line: problem solved and measurable impact.</p>
        <div><span class="tag">Infra</span></div>
      </div>
    </div>
  </div>
</section>

<section id="skills">
  <div class="wrap">
    <h2 class="sec"><span class="idx">04</span>Skills</h2>
    <!-- TODO(content): confirm skill accuracy -->
    <div class="skills reveal">
      <div><h4>ML / AI</h4><ul><li>Computer Vision</li><li>Deep Learning</li><li>LLMs / Agents</li><li>Classical ML</li></ul></div>
      <div><h4>Infrastructure</h4><ul><li>ML Pipelines</li><li>Distributed Training</li><li>Model Serving</li><li>Cloud</li></ul></div>
      <div><h4>Languages</h4><ul><li>Python</li><li>C++</li><li>SQL</li><li>JS/TS</li></ul></div>
      <div><h4>Tools</h4><ul><li>PyTorch</li><li>Docker / K8s</li><li>Spark</li><li>Git</li></ul></div>
    </div>
  </div>
</section>

<section id="publications">
  <div class="wrap">
    <h2 class="sec"><span class="idx">05</span>Publications</h2>
    <div class="card reveal">
      <p><strong>Approximating convex envelopes using linear programming</strong></p>
      <p class="muted" style="margin-top:8px">Developed a linear program using Oberman's characterization of the convex envelope for approximating any non-convex function with a convex envelope. Submitted to <em>Annals of Operations Research</em> (ANOR-D-16-01198). <a style="color:var(--accent)" href="ANOR-D-18-01280.pdf">PDF ↗</a></p>
    </div>
  </div>
</section>

<section id="education">
  <div class="wrap">
    <h2 class="sec"><span class="idx">06</span>Education</h2>
    <div class="grid reveal">
      <div class="card"><h3>UC San Diego</h3><p class="muted">MS — Machine Learning &amp; Data Science</p></div>
      <!-- TODO(content): undergraduate institution, degree, year -->
      <div class="card"><h3>Undergraduate</h3><p class="muted">Institution · Degree · year</p></div>
    </div>
  </div>
</section>

<section id="tutorials">
  <div class="wrap">
    <h2 class="sec"><span class="idx">07</span>Tutorials</h2>
    <!-- TODO(content): real tutorial titles, descriptions, links -->
    <div class="grid reveal">
      <div class="card"><h3>Tutorial title</h3><p class="muted">Short description · <a style="color:var(--accent)" href="#">link ↗</a></p></div>
      <div class="card"><h3>Tutorial title</h3><p class="muted">Short description · <a style="color:var(--accent)" href="#">link ↗</a></p></div>
    </div>
  </div>
</section>

<section id="contact">
  <div class="wrap" style="text-align:center">
    <h2 class="sec" style="justify-content:center"><span class="idx">08</span>Contact</h2>
    <a class="bigmail" href="mailto:saideepreddy91@gmail.com">saideepreddy91@gmail.com</a>
    <div class="social" style="justify-content:center;margin-top:24px">
      <a href="https://github.com/saideepreddy91">GitHub ↗</a>
      <a href="https://www.linkedin.com/in/saideep-reddy">LinkedIn ↗</a>
    </div>
  </div>
</section>
</main>

<footer>© 2026 Saideep Reddy · built with plain HTML/CSS/JS</footer>

<script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the publication PDF reference**

Run: `ls ANOR-D-18-01280.pdf 2>/dev/null && echo EXISTS || echo MISSING`

If `MISSING`, edit the publications link in `index.html` from `href="ANOR-D-18-01280.pdf"` to `href="#"` and add `<!-- TODO(content): attach publication PDF -->` immediately before that `<p class="muted">` line. If `EXISTS`, leave as-is.

- [ ] **Step 3: Sanity-check the page serves**

Run: `python3 -m http.server 8090 >/dev/null 2>&1 & sleep 1; curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/index.html; kill %1`
Expected: `200`

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: rebuild index.html — semantic single-page portfolio

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Create app.js (nav state, scroll-spy, mobile menu, reveal, hero canvas)

**Files:**
- Create: `app.js`

- [ ] **Step 1: Create `app.js`**

`window.__heroAnimating` is the test hook: `true` while the rAF loop runs, `false` under reduced motion.

```js
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
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        if (byId[e.target.id]) byId[e.target.id].classList.add('active');
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
  }
  function closeMenu() {
    mMenu.classList.remove('open');
    mBtn.setAttribute('aria-expanded', 'false');
  }
  mBtn.addEventListener('click', openMenu);
  mClose.addEventListener('click', closeMenu);
  mMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
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
      L(0.965, [0.5], 'aggregate', 'start', 5)
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
            layers[i].forEach(function (a) {
              a.glow = 1;
              layers[i + 1].forEach(function (b) {
                pulses.push({ a: a, b: b, t: 0, s: 0.02 });
              });
            });
          }, i * 260);
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
      if (++timer > 170) { timer = 0; cycle(); }
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
```

- [ ] **Step 2: Verify no JS syntax errors**

Run: `node --check app.js`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add app.js — nav, scroll-spy, mobile menu, hero canvas

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Update and extend the Playwright test suite

**Files:**
- Modify (overwrite): `tests/scroll.spec.js`

- [ ] **Step 1: Overwrite `tests/scroll.spec.js`**

```js
// @ts-check
const { test, expect } = require('@playwright/test');

const sections = [
  { link: 'about', id: 'about' },
  { link: 'experience', id: 'experience' },
  { link: 'projects', id: 'projects' },
  { link: 'skills', id: 'skill'.replace('skill', 'skills') },
  { link: 'publications', id: 'publications' },
  { link: 'education', id: 'education' },
  { link: 'tutorials', id: 'tutorials' },
  { link: 'contact', id: 'contact' },
];

for (const { id } of sections) {
  test(`nav link scrolls #${id} into view`, async ({ page }) => {
    await page.goto('/');
    await page.click(`#navlinks a[href="#${id}"]`);
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5000 });
  });
}

test('nav gains scrolled class after scrolling down', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#nav')).not.toHaveClass(/scrolled/);
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect(page.locator('#nav')).toHaveClass(/scrolled/);
});

test('scroll-spy sets the active nav link', async ({ page }) => {
  await page.goto('/');
  await page.click('#navlinks a[href="#projects"]');
  await expect(page.locator('#navlinks a[href="#projects"]'))
    .toHaveClass(/active/, { timeout: 5000 });
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 900 });
  await page.goto('/');
  await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
  await page.click('#menuBtn');
  await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
  await page.click('#menuClose');
  await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
});

test('hero canvas is present and animating by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#heroCanvas')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.__heroAnimating))
    .toBe(true);
});

test('reduced motion disables the hero animation loop', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('#heroCanvas')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.__heroAnimating))
    .toBe(false);
  await ctx.close();
});
```

Note: the `skills` entry uses a literal `'skills'` id; the `.replace` is removed in Step 2.

- [ ] **Step 2: Fix the skills id to a clean literal**

Edit `tests/scroll.spec.js`: replace the line
`  { link: 'skills', id: 'skill'.replace('skill', 'skills') },`
with
`  { link: 'skills', id: 'skills' },`

- [ ] **Step 3: Run the full suite**

Run: `npx playwright test 2>&1 | tail -15`
Expected: all tests pass (8 scroll + scrolled-class + scroll-spy + mobile menu + canvas present + reduced motion). If any fail, fix the implementation file the failure points to (not the test) and re-run.

- [ ] **Step 4: Commit**

```bash
git add tests/scroll.spec.js
git commit -m "test: update scroll suite + add nav/menu/canvas/reduced-motion tests

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Final verification and cleanup

**Files:**
- Verify only; no new files.

- [ ] **Step 1: Confirm no template references remain**

Run: `grep -rn "bootstrap\|now-ui\|jquery\|aos\." index.html app.js style.css || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 2: Confirm the repo tree is the intended minimal set**

Run: `git ls-files | grep -vE '^(\.|docs/|tests/|node_modules)' | sort`
Expected: includes `index.html`, `style.css`, `app.js`, `playwright.config.js`, `package.json`, `images/saideep.jpg`; does NOT include `css/`, `js/`, `scripts/`, `styles/`, `index.html.bak`.

- [ ] **Step 3: Manual visual check**

Run: `python3 -m http.server 8090 >/dev/null 2>&1 & echo "open http://localhost:8090 — verify hero animation, scroll-spy, mobile menu at narrow width; Ctrl+C server (kill %1) when done"`
Confirm visually: hero agents animate; nav highlights active section on scroll; sections reveal; mobile menu works at <780px. Then `kill %1`.

- [ ] **Step 4: Full test run + final commit**

Run: `npx playwright test 2>&1 | tail -5`
Expected: all pass.

```bash
git add -A
git commit -m "chore: portfolio redesign complete — verified

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>" --allow-empty
```

---

## Self-Review

**Spec coverage:**
- Remove template assets → Task 1 ✓
- Design-system tokens/palette/type/motion → Task 1 (`style.css`) ✓
- File layout (index.html/style.css/app.js) → Tasks 1–3 ✓
- Nav scrolled state + scroll-spy + mobile menu → Task 3 + tested Task 4 ✓
- Hero locked 5-layer canvas, dpr-crisp, reduced-motion static, visibility/IO pause → Task 3 ✓
- All sections + IDs + real content + TODO placeholders → Task 2 ✓
- gtag preserved → Task 2 ✓
- Accessibility (aria-hidden canvas, focus-visible, semantic landmarks, single h1) → Tasks 1–2 ✓
- Performance (no deps, system/serif fonts) → Tasks 1–2 ✓
- Testing (new IDs + scrolled + spy + menu + canvas + reduced-motion) → Task 4 ✓
- Out of scope (no resume, no theme toggle, no build) → respected ✓

**Placeholder scan:** Content `TODO(content)` markers are intentional per spec (user fills post-build) and are real-looking copy, not plan placeholders. No "implement later" / vague steps; all code is complete.

**Type consistency:** `window.__heroAnimating` set in Task 3 (`true` running, `false` reduced/stop) and asserted identically in Task 4. Element IDs (`nav`, `navlinks`, `menuBtn`, `mobileMenu`, `menuClose`, `heroCanvas`) consistent between Task 2 markup, Task 3 JS, Task 4 tests. Section IDs (`about`,`experience`,`projects`,`skills`,`publications`,`education`,`tutorials`,`contact`) consistent across Tasks 2/3/4.

No gaps found.
