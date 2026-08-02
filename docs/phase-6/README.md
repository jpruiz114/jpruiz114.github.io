# Phase 6 verification and maintenance policy

Phase 6 closes the modernization work with production/local audits and a small
content-polish pass.

## Improvements from the audit

- Preserved the natural aspect ratio of the About images on narrow screens.
- Converted the background and About images to WebP, reducing their combined
  transfer size from about 116 KiB to 46 KiB.
- Corrected section heading order from `h2` to `h3` and replaced the sidebar
  name's misleading heading markup with styled text.
- Removed the duplicate Google Fonts request, enabled `display=swap`, and added
  connection hints.
- Moved EmailJS to the end of the document so it no longer blocks initial HTML
  parsing.
- Balanced the four capability descriptions and made all four cards equal
  height at multi-column widths.

## Automated results

The reusable [browser audit](browser-audit.mjs) runs axe-core at phone and
laptop widths. It confirms:

- zero WCAG 2 A/AA and 2.1 AA violations;
- no console errors, page errors, failed local or external requests, or HTTP errors;
- no missing in-page link targets, skipped heading levels, or horizontal overflow;
- preserved image aspect ratios; and
- equal capability-card heights at multi-column widths.

The deterministic reCAPTCHA stub renders a representative 304-by-78-pixel
placeholder so responsive overflow checks still exercise the widget's layout.
The exact EmailJS and reCAPTCHA script URLs are stubbed; other third-party
requests remain visible to the audit.

[Lighthouse results](lighthouse-summary.json) improved from a production
baseline of 91/98/93/100 to 99/100/100/100 on the final local build for
performance/accessibility/best-practices/SEO.

The external-link audit returned 200 for GitHub, Docker Hub, the bridge demo,
Google Fonts, EmailJS, and reCAPTCHA. Stack Overflow returned 403 and LinkedIn
999 to automated curl requests; both are bot-policy responses, and the URLs are
the existing canonical public profiles. Google Fonts preconnect origins return
404 when fetched as pages, which is expected for connection-hint origins.

The secret-pattern scan found no private keys or credential-shaped tokens.
EmailJS public/service/template identifiers and the reCAPTCHA site key are
browser-public configuration, not secrets.

## Remaining operator checks

- After deployment, rerun Lighthouse against the production URL.
- Confirm EmailJS and reCAPTCHA dashboard domain allowlists.
- Send one real production contact message and confirm it arrives exactly once.

These checks require deployed code or provider-dashboard access and should not
be replaced by committing credentials or sending an unsolicited test message.

## Run locally

With a server on port 4173, Playwright, and axe-core installed outside the
repository:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
AXE_PATH=/path/to/axe-core/axe.min.js \
node docs/phase-6/browser-audit.mjs
```

No package manifest is intentionally added to this static site.
