# Phase 5 verification

Phase 5 replaces the remaining Bootstrap layout dependency with focused local
CSS while preserving the established responsive design.

## Changes

- Replaced Bootstrap container, row, column, and form classes with local layout
  classes that describe the page's actual needs.
- Preserved the 768px column breakpoint and Bootstrap-compatible container
  widths and gutters.
- Moved the small set of required reset and form-normalization rules into the
  site's stylesheet.
- Removed the Bootstrap stylesheet and vendored asset.

## Verification

The reusable [browser proof](browser-proof.mjs) runs at four representative
widths: 390px phone, 768px tablet, 1440px laptop, and 1920px wide screen. It
confirms that:

- no Bootstrap stylesheet, request, or legacy grid class remains;
- About, capability, highlight, and contact layouts stack on phones;
- About, highlight, and contact layouts use columns from 768px upward;
- no viewport has horizontal overflow or failed local requests; and
- all expected content blocks remain present.

With a local server running at port 4173 and Playwright installed, run:

```sh
node docs/phase-5/browser-proof.mjs
```

Set `SITE_URL` to use another server URL or `PLAYWRIGHT_MODULE` to point to an
existing Playwright module installation. Machine-readable results are in
[results.json](results.json), with full-page and focused screenshots for each
viewport in this directory.

## Proof-first result

The proof first ran against Phase 4 and failed because Bootstrap was loaded and
31 legacy grid-class instances remained. It passed after the local layout rules
replaced that dependency.
