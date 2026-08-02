# Phase 0 browser baseline

Captured August 1, 2026 against the repository served locally at `http://127.0.0.1:4173/`.

## Captures

- [Desktop, 1440 × 1000](./desktop-1440x1000.png)
- [Mobile, 390 × 844](./mobile-390x844.png)
- [Machine-readable results](./results.json)

Both viewports rendered all four sections without horizontal overflow, uncaught page errors, missing local resources, or HTTP error responses.

## Interaction baseline

| Flow | Result |
|------|--------|
| Desktop section navigation | Pass — selecting Capabilities updates the active navigation item and scrolls the page |
| Portfolio filter | Pass — selecting Security reduces six items to two visible items |
| Portfolio lightbox | Pass — opens the selected 570-pixel-wide source image |
| Mobile menu open | Pass |
| Mobile section navigation | Partial — navigation and active-state update work, but the menu remains open |
| Contact form CAPTCHA guard | Pass — an incomplete CAPTCHA prevents submission |
| Successful contact delivery | Not exercised — Phase 0 does not send an external message |

## Existing defects and constraints

1. **Mobile menu does not close after navigation on initial load.** The click-to-close handler is registered only inside a window `resize` callback. At a 390 × 844 initial viewport, choosing a section leaves `#menu.open` in place until the close control is used.
2. **Native email validation is absent.** `#email` uses `type="text"`; consequently, the browser considers `not-an-email` valid when all required fields are populated.
3. **Contact feedback uses modal browser alerts.** The CAPTCHA guard produced `Please complete the reCAPTCHA verification.` as an `alert()` rather than inline status text.
4. **Local reCAPTCHA execution logs third-party browser-policy errors.** Chromium reported storage-access and report-only frame-policy messages, plus a blocked Google CSP-report request. The CAPTCHA iframe still rendered. Treat these as local/third-party integration observations; verify the allowlisted production domain separately in Phase 3.

## Baseline method

- Chromium via Playwright 1.62.1
- Full-page screenshots at exact viewport widths
- Browser-console, page-error, failed-request, and HTTP-error capture
- Automated navigation, filtering, lightbox, mobile-menu, native-validation, and incomplete-CAPTCHA checks
- No production deployment and no external contact message

Use these captures and results when evaluating Phase 1. A visual change is expected where content is deliberately replaced; navigation, responsiveness, and unaffected flows should remain functional.
