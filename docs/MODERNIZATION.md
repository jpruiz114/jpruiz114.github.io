# Site modernization plan

**Site:** [jeanpaulruizvallejo.com](https://jeanpaulruizvallejo.com) (GitHub Pages, [CNAME](../CNAME))

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## Strategy (what this site is for)

This is **not** a design-portfolio or a gallery of GitHub repos. At 15+ years, the site should work like a **personal landing page and resume**: who you are, what you do well, how to reach you—with light proof links for people who want to dig deeper.

### Primary goals

1. **Clarity in ~30 seconds** — A recruiter or hiring manager understands role, seniority, and focus (software + security) without clicking around.
2. **Credible senior positioning** — Specific strengths and domains, not template blurbs (“Python, Java, or Node.js”).
3. **Trust, not theater** — Real copy, working contact, professional links; no stock-photo “portfolio” that implies client work you didn’t do.
4. **Optional depth** — GitHub, live demos, and profiles are **supporting evidence**, not the main story.

### What we are *not* optimizing for

- Six-tile project walls or lightbox galleries (unless you later want 1–2 **highlight** links with context).
- Competing with a full LinkedIn profile (the site should complement [LinkedIn](https://www.linkedin.com/in/jeanpaulruiz/), not duplicate it verbatim).

### Success looks like

- Someone lands from LinkedIn or a resume PDF → gets your positioning → contacts you or opens GitHub/LinkedIn.
- No dead UI (`Read More` → `#`), no misleading stock imagery, no empty SEO meta.

---

## Reflecting your career on the site

Use your public footprint as **source material**, not as the page structure. Pull facts and themes from [GitHub](https://github.com/jpruiz114), [LinkedIn](https://www.linkedin.com/in/jeanpaulruiz/), and your existing domain content—then edit into your voice.

### Positioning line (sidebar + meta)

One sentence you’re comfortable owning, e.g.:

> Senior software engineer with a security and DevOps focus—building reliable systems, improving code quality, and applying ML and data tooling where it matters.

Adjust after you review; it should match how you want to be hired **now**, not every skill you’ve ever touched.

### Career themes to weave in (pick what’s still true)

| Theme | Why it belongs on the site | Where it could live |
|--------|----------------------------|---------------------|
| **Software engineering (full-stack)** | Ruby/Sinatra, PHP, JavaScript/Webpack, testing culture (ATDD/BDD, RSpec, Cucumber) | About + one “capabilities” block |
| **Security & quality** | SonarQube automation, secure SDLC, vulnerability-minded delivery | About + capabilities (not a fake “portfolio tile”) |
| **DevOps / automation** | Scanner containers, CI-adjacent tooling | Capabilities or a single “Tools & open source” bullet |
| **Data & ML** | Neural network tutorials, Python, ETL interest from current bio | Short mention in About or one capability card |
| **Systems / performance** | C/C++/CUDA, HPC-adjacent work (`cpp-tests`) | Only if you still want that as a hiring signal |
| **Bilingual (Spanish)** | Differentiator for many roles | About intro line |
| **Open source & teaching** | GitHub activity, gists, tutorial repos | “Proof & links” — link out, don’t narrate every repo |
| **Florida / remote** | Optional, if relevant for opportunities | Sidebar or About, one line |

### Proof & links (supporting section, not a gallery)

Link out instead of embedding six projects:

| Resource | URL | Use on site |
|----------|-----|-------------|
| GitHub | https://github.com/jpruiz114 | Primary “see my code” |
| LinkedIn | https://www.linkedin.com/in/jeanpaulruiz/ | Already in sidebar |
| Stack Overflow | https://stackoverflow.com/users/5811638/jean-paul-ruiz | Optional icon/link |
| Docker Hub | https://hub.docker.com/u/jpruiz114 | Optional (DevOps signal) |
| Hugging Face | https://huggingface.co/jpruiz114 | Optional (ML signal) |
| ORCID | https://orcid.org/0009-0009-7426-6040 | Optional (research/publication signal) |
| Bridge simulation (live) | https://jeanpaulruizvallejo.com/physics-simulations/bridge-simulation-spring-mass-model/ | **At most one** “try it” highlight—not six cards |
| Gists | https://gist.github.com/jpruiz114 | Optional footnote |

**Rule of thumb:** If a link doesn’t reinforce the positioning line, skip it or tuck it in a compact “Elsewhere” row.

### Proposed page structure (maps to current template)

| Current section | Proposed direction |
|-----------------|------------------|
| Sidebar | Name, positioning line, nav, 2–6 social/proof icons |
| **About Me** | Career summary: tenure, industries, bilingual, how you combine build + security + quality |
| **What I’m good at** | Rename mentally to **Capabilities** — 4 focused areas (your real stacks/outcomes), not generic “front-end/back-end” template text |
| **My Work** | **Replace** — see P0 #1 below (highlights or proof links; remove stock photos & isotope) |
| **Contact Me** | Keep; improve UX (P0 #3) |

### Copy you’ll need to supply (we can draft together)

When we implement P0 #1 and P1 #8, have rough answers for:

- [ ] Current title(s) you want on the site
- [ ] Years of experience (confirm “15+” or update)
- [ ] 3–5 **primary** technologies you want to be known for today
- [ ] 2–3 **outcome-style** bullets (even anonymized): e.g. led X, improved Y, shipped Z
- [ ] Whether to mention employer names or keep it general
- [ ] Optional: one live demo link (bridge) vs GitHub-only proof

---

## P0 — High impact (credibility & function)

### 1. Replace “My Work” with resume-focused content

**Problem:** Section uses generic Pexels stock photos ([archived sources](./archive/PHOTOS.md)), isotope filters, and lightbox—reads as an unfilled agency template, not a senior engineer’s story.

**Direction (resume-first — recommended):**

- [ ] Remove stock portfolio grid, isotope toolbar, and lightbox usage for this section (may allow removing `lightbox.css` / `lightbox.js` later if unused elsewhere)
- [ ] Rename nav + heading (e.g. **“Focus & highlights”** or **“What I do”**)
- [ ] Replace with **scannable content**, e.g.:
  - Short bullet list of focus areas (software, security, DevOps, data/ML)
  - Optional: 1–2 lines each with outcomes, not repo names
  - Optional: compact **“Proof & links”** row (GitHub + at most one live demo)
- [ ] Retire or archive the [stock-photo sources](./archive/PHOTOS.md) when stock assets are gone

**Alternative (hybrid — only if you want it later):**

- [ ] Keep a **single** highlight card (e.g. bridge simulation) with one sentence + link—no six-image grid

**Files:** `index.html`, optionally remove `assets/images/portfolio-*.jpg`, `PHOTOS.md`, unused JS/CSS in a later cleanup (P2 #14)

---

### 2. Fix or remove dead “Read More” links

**Problem:** About blocks use `href="#"` — looks broken on a resume-style site.

**Suggested approach:**

- [ ] Remove both buttons (simplest for resume layout), **or**
- [ ] Point to `#section2` / `#section3` / `#section4` with clear labels (e.g. “See capabilities”, “Get in touch”)

**Files:** `index.html`

---

### 3. Contact form improvements

**Problem:** Email field uses `type="text"`; feedback uses `alert()`; depends on EmailJS + reCAPTCHA on production domain.

**Tasks:**

- [ ] `type="email"` on email input
- [ ] Inline success/error messages instead of `alert()`
- [ ] Verify EmailJS + reCAPTCHA on `jeanpaulruizvallejo.com` (and `*.github.io` if you test there)
- [ ] Confirm domain allowlists / abuse limits in provider dashboards (no secrets in repo)

**Files:** `index.html`

---

### 4. SEO: meta description & consistent positioning

**Problem:** Empty `meta description`; title and body copy should tell the same story.

**Tasks:**

- [ ] Write meta description aligned with positioning line (name, senior software + security, bilingual if desired)
- [ ] Set `meta name="author"` if useful
- [ ] Align `<title>` with how you want to appear in search/tab

**Files:** `index.html` (`<head>`)

---

## P1 — Medium impact (quality & clarity)

### 5. Rewrite About + capabilities in your voice (career copy)

**Problem:** Generic template paragraphs; skills section mirrors a theme demo, not your career.

**Tasks:**

- [ ] Replace About intro with career summary (see **Copy you’ll need to supply** above)
- [ ] Split or merge the two About columns: **engineering** vs **security** is fine if each has specific, honest detail—not filler
- [ ] Rewrite four capability cards around **your** pillars (e.g. application development, AppSec / quality, DevOps automation, data & ML)—with real stacks where possible
- [ ] Confirm or update “15+ years” and industries
- [ ] De-emphasize “or” lists (pick primary languages/tools)

**Files:** `index.html`

---

### 6. Image accessibility & honest imagery

**Problem:** Empty or generic `alt` text; section photos may still look stock after P0 #1.

**Tasks:**

- [ ] Descriptive `alt` on author photo
- [ ] About images: meaningful alt or remove/replace if they don’t add to a resume site
- [ ] No generic `sq-sample26` alts (removed with portfolio grid)

**Files:** `index.html`, `assets/images/`

---

### 7. Optimize profile image size

**Problem:** `author-image.png` ~783 KB.

**Tasks:**

- [ ] Resize/compress for sidebar display size

**Files:** `assets/images/author-image.png`

---

### 8. Align navigation labels with resume structure

**Problem:** Nav says “What I’m good at” / “My Work” while headings differ or sections change role.

**Tasks:**

- [ ] Unify nav + `h2` labels after P0 #1 (e.g. About → Capabilities → Focus & highlights → Contact)
- [ ] Update `data-section` anchors if section IDs/names change

**Files:** `index.html`

---

### 9. Expand proof links (sidebar or compact footer row)

**Problem:** Only GitHub + LinkedIn; your public profile lists more relevant signals.

**Tasks:**

- [ ] Add icons/links you want visible (Stack Overflow, Docker Hub, ORCID, Hugging Face—pick 2–4 max)
- [ ] `rel="noopener noreferrer"` if `target="_blank"`
- [ ] Don’t clutter sidebar—quality over quantity

**Files:** `index.html` (may need extra Font Awesome icons or SVG)

---

### 10. Branding consistency (domain / copyright)

**Tasks:**

- [ ] Confirm custom domain DNS / GitHub Pages settings
- [ ] Align footer display with `jeanpaulruizvallejo.com` if desired
- [x] Copyright year 2026

**Files:** `index.html`, `CNAME`

---

## P2 — Lower priority (polish & maintainability)

### 11. Fix HTML typo: `soial-icons` → `social-icons`

**Files:** `index.html`

---

### 12. Favicon

**Files:** new asset, `index.html`

---

### 13. Open Graph / social preview tags

**Tasks:** `og:title`, `og:description`, `og:url`, `og:image` (author photo or simple branded image)

**Files:** `index.html`

---

### 14. Dependency modernization and removal

**Decision:** Prefer deleting unnecessary dependencies over upgrading the legacy template stack. The likely end state is plain HTML, CSS, SVG, and JavaScript with EmailJS and reCAPTCHA as the only runtime integrations.

**Current dependency inventory (audited August 2026):**

| Dependency | Delivery | Purpose and maintenance policy |
|------------|----------|--------------------------------|
| Local HTML, CSS, SVG, and JavaScript | Repository | Primary site implementation; no framework or build step required |
| Lato | Google Fonts CSS2 API | Site typography; `display=swap` and preconnects limit rendering cost |
| EmailJS Browser SDK | jsDelivr, major version 4 | Contact delivery; public client identifiers only, with inline failure handling and throttling |
| reCAPTCHA v2 | Google-hosted script | Contact abuse prevention; the intentionally retained third-party payload is isolated to the form integration |
| GitHub Pages | Repository deployment | Static hosting for the custom domain |

No package manifest is needed. There are no repository-managed third-party
packages, and introducing npm solely to mirror two browser CDN integrations
would add maintenance surface without improving the static deployment.

**Tasks, in dependency order:**

- [x] Capture desktop and mobile screenshots and manually verify navigation, filtering, lightbox, and contact submission before changing dependencies
- [x] Remove unused Owl Carousel and FlexSlider files and initialization code
- [x] Remove the unused Bootstrap JavaScript bundle and unreferenced duplicate/source-map assets
- [x] Complete P0 #1, then remove Isotope, Lightbox, their styles, and their initialization code
- [x] Verify the contact form with mocked success, validation, reCAPTCHA, provider-error, timeout, and repeated-submission paths; retain a real production send as an operator check
- [x] Rewrite the remaining navigation, scrolling, and form DOM operations in native JavaScript; then remove jQuery
- [x] Replace Font Awesome with accessible inline SVG icons and remove its font/CSS assets
- [x] Replace Bootstrap’s grid/container usage with focused local CSS
- [x] Keep the static site package-free; document the purpose of the two retained browser CDN integrations

**Files:** `index.html`, `assets/js/custom.js`, `assets/js/`, `assets/css/`, `assets/fonts/`, `vendor/`

---

### 15. Security hygiene (checklist)

- [ ] EmailJS + reCAPTCHA domain restrictions and monitoring
- [ ] Never commit secret keys

---

## Completed (session history)

- [x] Copyright year: 2025 → 2026
- [x] LinkedIn URL → `https://www.linkedin.com/in/jeanpaulruiz/`
- [x] Strategy decided: **resume-first landing page**, not portfolio gallery

---

## Phased execution plan

Each phase should finish with a desktop/mobile browser check. Preserve the last known-good state so visual or contact-form regressions can be isolated to one phase.

### Phase 0 — Establish the baseline (complete)

- [x] Record desktop and mobile screenshots at representative widths
- [x] Verify navigation, responsive menu, portfolio filtering/lightbox, and contact submission
- [x] Record any existing defects separately so they are not attributed to modernization work

**Exit condition:** Current behavior and appearance are documented well enough to detect regressions.

### Phase 1 — Clarify the product and remove dead weight (complete)

- [x] Complete P0 #1: replace “My Work” with resume-focused highlights/proof links
- [x] Complete P0 #2 and P1 #5: remove dead actions and replace template copy
- [x] Remove Owl Carousel, FlexSlider, unused Bootstrap JavaScript, and unreferenced asset variants
- [x] Remove Isotope and Lightbox after their portfolio consumers are gone

**Exit condition:** The page communicates the intended professional positioning and no removed script or stylesheet is requested by the browser.

### Phase 2 — Strengthen identity, discovery, and accessibility (complete)

- [x] Complete P0 #4 and P1 #8–9: metadata, navigation labels, and proof links
- [x] Complete P1 #6–7: meaningful image alternatives and profile-image optimization
- [x] Complete P2 #11–13: typo, favicon, and Open Graph preview

**Exit condition:** The page is coherent in search/social previews, keyboard navigation, screen-reader semantics, and responsive layouts.

### Phase 3 — Modernize the contact integration (complete locally)

- [ ] Confirm EmailJS and reCAPTCHA dashboard allowlists on the production and test domains, then perform one real production send
- [x] Upgrade EmailJS, add inline status feedback, and prevent duplicate submissions
- [x] Test valid submission, invalid email, missing reCAPTCHA, provider failure, and repeated submission

**Exit condition:** Contact submission works without console errors and every outcome is communicated inline.

### Phase 4 — Remove the legacy JavaScript stack (complete)

- [x] Convert the remaining jQuery navigation, scrolling, and form interactions to native browser APIs
- [x] Remove jQuery and confirm there are no remaining `$`, `jQuery`, or plugin references
- [x] Replace Font Awesome with the small set of inline SVG icons actually used

**Exit condition:** The page loads no jQuery or icon-font assets and preserves the established baseline behavior.

### Phase 5 — Simplify the layout foundation (complete)

- [x] Inventory the Bootstrap grid and utility classes still used after the content redesign
- [x] Replace them with focused local CSS; use a Bootstrap 5 migration only if the retained component surface justifies it
- [x] Validate common phone, tablet, laptop, and wide-screen widths

**Exit condition:** Bootstrap is removed or intentionally current, with no layout regressions.

### Phase 6 — Final verification and maintenance policy (complete locally)

- [x] Check for missing local assets, browser console errors, broken links, and accidental secret material
- [x] Run accessibility and performance passes against production and the final local build
- [x] Update this document’s checkboxes and dependency inventory to match the shipped state
- [x] Document why dependency tooling is unnecessary for the package-free static build

**Exit condition:** The deployed site matches the plan, the contact path works, and every remaining dependency has an explicit purpose.

**Recommended first implementation slice:** Phase 0 plus Phase 1. This creates a verified baseline, delivers the largest credibility improvement, and safely eliminates the riskiest legacy plugin bundle before deeper refactoring.
