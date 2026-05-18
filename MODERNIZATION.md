# Site modernization plan

Prioritized backlog for [jeanpaulruizvallejo.com](https://jeanpaulruizvallejo.com) (GitHub Pages). Work through items top to bottom; check off as completed.

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## P0 — High impact (credibility & function)

### 1. Replace placeholder portfolio with real work

**Problem:** “My Work” uses generic Pexels stock photos ([PHOTOS.md](./PHOTOS.md)). Lightbox titles are all `"Caption"`. Reads as an unfilled template, not a senior engineer portfolio.

**Suggested approach:**
- [ ] Decide: showcase real projects, link to GitHub repos, or remove/simplify the section until assets exist
- [ ] Replace `portfolio-01.jpg` … `portfolio-06.jpg` with project screenshots or branded visuals
- [ ] Add meaningful titles, descriptions, and links (demo, repo, write-up) per item
- [ ] Update lightbox `data-title` (and captions) per project
- [ ] Update or retire [PHOTOS.md](./PHOTOS.md) if stock attribution is no longer needed

**Files:** `index.html`, `assets/images/portfolio-*.jpg`, optionally `PHOTOS.md`

---

### 2. Fix or remove dead “Read More” links

**Problem:** Both About Me blocks use `href="#"` — buttons look actionable but do nothing.

**Suggested approach (pick one per block or both):**
- [ ] Remove the buttons if there is no expanded content
- [ ] Link to another on-page section (e.g. skills, contact)
- [ ] Add expandable copy or a dedicated subsection

**Files:** `index.html` (lines ~112, ~127)

---

### 3. Contact form improvements

**Problem:** Email field uses `type="text"`; feedback uses browser `alert()`; live behavior depends on EmailJS + reCAPTCHA domain config.

**Tasks:**
- [ ] Change email input to `type="email"` (browser validation)
- [ ] Replace `alert()` with inline success/error messages in the form area
- [ ] Verify EmailJS service/template still works on production domain
- [ ] Verify reCAPTCHA v2 site key is allowed for `jeanpaulruizvallejo.com` (and `jpruiz114.github.io` if testing on Pages default URL)
- [ ] Confirm rate limiting / domain restrictions in EmailJS and Google reCAPTCHA consoles (no secret keys in repo)

**Files:** `index.html` (contact section + `submitForm` script)

---

### 4. SEO: meta description & page summary

**Problem:** `<meta name="description" content="">` is empty — hurts search snippets and unfurl previews.

**Tasks:**
- [ ] Write a concise description (name, title, focus: software, security, bilingual, etc.)
- [ ] Align with `<title>` and About Me copy

**Files:** `index.html` (`<head>`)

---

## P1 — Medium impact (quality & accessibility)

### 5. Image accessibility (`alt` text)

**Problem:** Empty or generic `alt` attributes (`alt=""`, `alt="sq-sample26"` on portfolio).

**Tasks:**
- [ ] Author photo: descriptive alt (e.g. name + role)
- [ ] About section images: describe content/context
- [ ] Portfolio thumbnails: project name + short description (after P0 #1)

**Files:** `index.html`

---

### 6. Optimize profile image size

**Problem:** `assets/images/author-image.png` is ~783 KB — slow on mobile.

**Tasks:**
- [ ] Resize to display dimensions used in CSS
- [ ] Compress (optimized PNG or WebP with fallback if desired)
- [ ] Confirm visual quality in sidebar

**Files:** `assets/images/author-image.png`, possibly `templatemo-style.css` if dimensions change

---

### 7. Align navigation and section headings

**Problem:** Sidebar says “What I’m good at”; section heading is “My Skills and Expertise”.

**Tasks:**
- [ ] Pick one label and use it in nav + `h2` (or intentional difference with clearer nav label)

**Files:** `index.html`

---

### 8. Refresh bio and skills copy

**Problem:** Copy is broad/generic; “15+ years” may need updating.

**Tasks:**
- [ ] Update tenure (“15+ years”) if inaccurate
- [ ] Replace vague stacks (“Python, Java, or Node.js”) with your actual primary stack
- [ ] Tighten About Me / skills paragraphs to match current role and goals
- [ ] Optional: mention recent focus (data science, ETL, security) with specifics

**Files:** `index.html`

---

### 9. Branding consistency (domain / copyright)

**Problem:** Footer shows `JeanPaulRuizVallejo.com`; [CNAME](./CNAME) is `jeanpaulruizvallejo.com`.

**Tasks:**
- [ ] Confirm DNS/GitHub Pages custom domain is correct
- [ ] Align displayed domain casing/branding in footer if desired
- [ ] Copyright year: already **2026** — use range (e.g. `2010–2026`) only if you prefer

**Files:** `index.html`, `CNAME`

---

## P2 — Lower priority (polish & maintainability)

### 10. Fix HTML typo: social icons class

**Problem:** `class="soial-icons"` should be `social-icons` (styling still works via `.social-network`).

**Files:** `index.html`

---

### 11. Favicon

**Problem:** No site favicon — browser tab shows default icon.

**Tasks:**
- [ ] Add `favicon.ico` (and/or PNG/SVG)
- [ ] Link in `<head>`: `<link rel="icon" href="...">`

**Files:** new asset under repo root or `assets/images/`, `index.html`

---

### 12. Open Graph / social preview tags

**Problem:** No `og:*` tags — poor previews when sharing on LinkedIn, etc.

**Tasks:**
- [ ] Add `og:title`, `og:description`, `og:url`, `og:image` (use author image or dedicated share image)
- [ ] Optional: `twitter:card` meta tags

**Files:** `index.html`, share image asset

---

### 13. External links: new tab + security

**Problem:** GitHub/LinkedIn open in same tab; no `rel="noopener noreferrer"` if using `target="_blank"`.

**Tasks:**
- [ ] Decide same-tab vs new-tab behavior
- [ ] If new tab: add `target="_blank"` and `rel="noopener noreferrer"` to GitHub and LinkedIn

**Files:** `index.html`

---

### 14. Dependency & stack modernization (planned upgrade)

**Problem:** Older stack — Bootstrap 4.2, Font Awesome 4, EmailJS v2 CDN, jQuery-heavy template.

**Not urgent** for a static personal site; schedule when doing a larger refresh.

**Tasks:**
- [ ] Evaluate Bootstrap 5 migration or lighter CSS approach
- [ ] Upgrade Font Awesome or replace icons with SVG
- [ ] Move EmailJS to current SDK/docs if API changes
- [ ] Audit unused JS (e.g. owl carousel if unused)
- [ ] Remove duplicate/unminified vendor files if only `.min` is loaded

**Files:** `vendor/`, `assets/js/`, `assets/css/`, `index.html`

---

### 15. Security hygiene (informational checklist)

**No code change required** — verify in provider dashboards:

- [ ] reCAPTCHA: site key public in HTML is OK; **secret key** only on server-side (N/A for pure client form — be aware of bot risk)
- [ ] EmailJS: domain allowlist, template limits, monitor abuse
- [ ] Rotate keys if repo was ever public with overly permissive settings
- [ ] Never commit `.env`, secret keys, or private reCAPTCHA secrets

---

## Completed (session history)

- [x] Copyright year: 2025 → 2026 (`index.html`)
- [x] LinkedIn URL: `jean-paul-ruiz` → `jeanpaulruiz` (`index.html`)

---

## How we’ll execute

1. You review this file and adjust priorities or wording.
2. Tell me which item number to implement (e.g. “do P0 #3”).
3. We implement, test locally or on Pages, then mark the checkbox `[x]` in this file.

**Quick wins to start with:** P0 #2, P0 #4, P1 #5, P1 #6, P2 #10 — small diffs, immediate improvement.  
**Largest lift:** P0 #1 (real portfolio content needs your input).
