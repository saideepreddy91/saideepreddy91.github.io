# Portfolio Redesign — Design Spec

**Date:** 2026-05-18
**Project:** saideepreddy91.github.io
**Status:** Approved (design + full prototype validated in visual companion)

## Goal

Rebuild the personal portfolio as a world-class, recruiter-facing site for an
ML Engineer at Apple. Optimize for recruiters and hiring managers at top ML/AI
companies: credibility, scannability, and clear impact within the first
10 seconds.

## Decisions (locked)

| Area | Decision |
|---|---|
| Scope | Full modern rebuild — replace the Bootstrap/Now UI Kit/jQuery/AOS template entirely |
| Tech | Plain HTML/CSS/JS, no build step, no dependencies; deploys to GitHub Pages as-is |
| Code org | Approach #1: single `index.html` + `style.css` + `app.js` |
| Visual direction | Dark Technical + Editorial Minimal blend; dark-only (no theme toggle) |
| Hero background | Locked v3: 5-layer orchestrated-agents canvas animation |
| Content | Restructure/tighten existing content; placeholders for gaps the user fills |
| Resume CTA | None for now — hero CTAs are "View work" + "Contact" + GitHub/LinkedIn |
| Section order | Hero → Impact bar → About → Experience → Projects → Skills → Publications → Education → Tutorials → Contact |

## Architecture

### File layout

```
index.html             # single page, semantic sections, clear section comments
style.css              # design tokens (CSS custom properties) + all styles
app.js                 # nav scrolled-state, scroll-spy, mobile menu, hero canvas, reveal-on-scroll
images/saideep.jpg     # retained; unused template images removed
tests/scroll.spec.js   # updated for new section IDs + new assertions
playwright.config.js   # retained as-is (python http.server on :8080)
```

Removed: `css/`, `js/`, `scripts/`, `styles/` template assets (Bootstrap, Now UI
Kit, jQuery, AOS), `index.html.bak`. Google Analytics gtag snippet is preserved
in `<head>`.

### Design system (CSS custom properties in `:root`)

- **Palette:** `--bg:#0a0c10`, `--surface:#0e1117`, `--surface2:#11151c`,
  `--border:#232a36`, `--text:#e6e6e6`, `--muted:#9aa4b2`, `--accent:#5eead4`.
- **Type:** display = serif stack (`Georgia, 'Times New Roman', serif`) for name
  and section headings; body = system sans (`-apple-system, Inter, …`);
  eyebrows/labels/nav = monospace (`ui-monospace, SFMono-Regular, …`). No
  webfonts (zero font network cost).
- **Scale:** fluid type via `clamp()`; 8px spacing rhythm; max content width
  ~1080px; generous whitespace.
- **Motion:** reveal-on-scroll (opacity + small translate via IntersectionObserver),
  gated behind `prefers-reduced-motion: reduce` (static fallback).

## Components

### Nav
- Fixed top, transparent over hero; on `scrollY > 60` adds `.scrolled`
  (blurred dark bg + hairline bottom border, reduced padding).
- Mono `SR` brand left; section links right.
- Scroll-spy: IntersectionObserver sets the active link as sections enter view.
- Mobile (`<780px`): hamburger toggles a full-height overlay menu; links hidden
  in the bar.

### Hero (locked animation)
- Full-viewport (`min-height:100vh`), flex-centered content. Foreground
  (z-index above canvas):
  mono eyebrow "ML Engineer · Apple", serif `<h1>` "Saideep Reddy", value-prop
  line, "View work" + "Contact" buttons, GitHub/LinkedIn links.
- Background `<canvas id="heroCanvas">` absolutely positioned, `aria-hidden="true"`.

#### Hero canvas spec (`initHeroCanvas()` in `app.js`)
- Topology: 5 layers — orchestrator(1) → planner(2) → agent(4) → tool(2) →
  aggregate(1). Positions are fractions of canvas W/H (compressed in X, spread
  in Y so it is not horizontally elongated). Edges fully connect adjacent layers.
- Animation: every ~170 frames a cycle fires; each layer boundary emits teal
  pulses to the next layer, staggered ~260ms per boundary. Receiving nodes glow
  and decay (`glow *= 0.95`).
- Crisp rendering: backing store sized to `clientSize * max(2, devicePixelRatio)`,
  context scaled by dpr; resizes on window resize.
- Tunable named constants: node radius, pulse speed, cycle interval, opacities.
- Performance: pause via IntersectionObserver when hero leaves viewport;
  `cancelAnimationFrame` when tab hidden (`visibilitychange`).
- Reduced motion: if `prefers-reduced-motion: reduce`, render one static frame
  (nodes + edges, no loop, no pulses).

### Sections
Each section: serif `<h2>` with a mono numeric index (`01`…`08`), card surfaces
with hairline borders. IDs: `about`, `experience`, `projects`, `skills`,
`publications`, `education`, `tutorials`, `contact` (plus `impact`, `top`).

- **Impact bar** — 4 stat chips (number + mono label). Placeholders for the
  user-supplied number (`10M+ users`) and years; `Apple · Vision Products` and
  `UC San Diego · MS` are real.
- **About** — two cards: tightened bio (placeholder for expansion) + contact
  quick-facts (email, GitHub, LinkedIn — real values).
- **Experience** — vertical timeline (left border + accent dots); each role:
  title, mono meta (org · location · dates), metric-led impact bullets.
  Apple featured first; prior roles are placeholders.
- **Projects** — responsive 2-col card grid (1-col mobile); each: title,
  one-line problem→impact, mono tech tags, links. Migrate "Real-time News
  Category Classification" (dead Heroku link stays removed); others placeholder.
- **Skills** — 4 grouped columns: ML/AI · Infrastructure · Languages · Tools.
  No progress-bar gimmicks.
- **Publications** — citation card: "Approximating convex envelopes using
  linear programming", ANOR-D-16-01198, PDF link (`ANOR-D-18-01280.pdf` if
  present, else placeholder link).
- **Education** — UC San Diego MS (real) + undergrad (placeholder), 2-col cards.
- **Tutorials** — kept per user request; card list of tutorial title +
  description + link (placeholders).
- **Contact** — centered: large serif `mailto:` link, social row, footer
  (`© 2026 Saideep Reddy`).

Placeholder content carries a visible marker class (`.ph`, dashed outline) in
the prototype; in the shipped site placeholders are real-looking copy clearly
flagged in an HTML comment so the user knows what to replace. No `.ph` dashed
styling ships — production uses normal styling with `TODO:` HTML comments.

## Data flow

Static site, no runtime data. Section IDs drive: (1) in-page anchor smooth
scroll, (2) IntersectionObserver scroll-spy active-link state, (3) Playwright
scroll tests. Nav links and section IDs must stay in sync — this is the single
contract in the page.

## Error / edge handling

- `prefers-reduced-motion` → static hero, no scroll-reveal animation.
- Hidden tab / hero off-screen → animation loop suspended (no CPU burn).
- No JS (canvas unsupported / JS disabled) → hero text fully readable on the
  dark background; canvas is purely decorative and `aria-hidden`.
- Small viewports → grids collapse to 1–2 columns; nav switches to overlay menu.
- Missing publication PDF → link points to a placeholder `#` with a TODO comment.

## Accessibility

- Semantic landmarks: `<nav> <header> <main>`-equivalent sections `<footer>`.
- Exactly one `<h1>` (name); logical heading order; section `<h2>`s.
- Decorative canvas `aria-hidden="true"`; all content readable without it.
- Visible focus states; keyboard-operable nav and mobile menu; color contrast
  meets WCAG AA against the dark palette.

## Performance

- Zero CSS/JS dependencies; system + serif font stacks (no webfont fetch).
- Single image (`saideep.jpg`) with explicit dimensions; `loading="lazy"` if
  below the fold. Target: sub-1s load, ~100 Lighthouse.

## Testing

- Update `tests/scroll.spec.js` to new IDs: about, experience, projects, skills,
  publications, education, tutorials, contact.
- Add assertions:
  - Clicking each nav link scrolls the target section into the viewport
    (existing pattern).
  - Nav gains `.scrolled` class after scrolling down.
  - Scroll-spy: active link reflects the section in view.
  - Mobile menu (narrow viewport) opens and closes.
  - `#heroCanvas` element is present.
  - With `prefers-reduced-motion: reduce` emulated, the hero animation loop
    does not run (assert via a flag the script sets, e.g.
    `window.__heroAnimating === false`).
- Reuse existing `playwright.config.js` (python `http.server` on :8080).

## Out of scope (YAGNI)

- Resume PDF / download CTA (explicitly deferred).
- Light/dark theme toggle (dark-only is the identity).
- Blog/CMS, SSG, or any build pipeline.
- Backend, forms, analytics changes (existing gtag retained unchanged).

## Open items for the user to fill post-build

Bio expansion; impact-bar numbers (users, years); Apple + prior experience
bullets with metrics; full project list with impact lines; undergrad education;
tutorial entries; confirm/skills accuracy; publication PDF file.
