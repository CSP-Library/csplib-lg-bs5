# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A **static asset repo** — no build tools, no npm, no compilation. Every file in `libguides/` is a paste target for a specific field in LibGuides Admin. There is no local dev server; testing is done by pasting into LibGuides and previewing at `https://library.csp.edu/bs5home?bs5=1`.

## Deployment Model

Each `libguides/` file maps to exactly one Admin field. Never add `<style>` or `<script>` wrapper tags to CSS/JS files — LibGuides wraps them automatically.

| File | LibGuides destination |
|---|---|
| `libguides-1-custom-css.css` | Admin → System Settings → Look & Feel → Custom JS/CSS → Custom CSS |
| `libguides-2-custom-js.js` | Admin → System Settings → Look & Feel → Custom JS/CSS → Custom JS |
| `libguides-3-header-html.html` | Admin → System Settings → Look & Feel → Header & Footer → Header |
| `libguides-4-footer-html.html` | Admin → System Settings → Look & Feel → Header & Footer → Footer |
| `libguides-5-box*.html` | Homepage guide → individual Rich Text/HTML boxes (one file per box) |
| `libguides-6-retro-css.css` | Append to the Custom CSS paste (optional retro easter egg) |
| `subsites/[subsite]/header.html` | Group → Look & Feel → Header (one per subsite group) |
| `subsites/[subsite]/footer.html` | Group → Look & Feel → Footer (one per subsite group) |
| `subsites/[subsite]/hero.html` | Individual box in that subsite's homepage guide, with Floating Box checked |

## Critical LibGuides Constraints

- **No `@import` in Custom CSS** — LibGuides strips them. All external CDN dependencies (Bootstrap 5, Bootstrap Icons, Google Fonts) are loaded via `<link>` tags in `libguides-3-header-html.html` only.
- **Custom CSS character limit** — ~50–100K chars. No base64 data URIs; use hosted image URLs.
- **Full-bleed sections** require wrapping in `<div class="s-lg-box-wrapper-hero">` and checking "Floating Box" on the box.
- **`toggleSubNav()`** must stay in global scope in `libguides-2-custom-js.js` — it is called via inline `onclick` attributes on subsite nav toggle buttons and cannot be inside `DOMContentLoaded`.

## Design System

### Token Reference (defined in `:root` in `libguides-1-custom-css.css`)

Brand colors: `--csp-navy` (#003055), `--csp-gold` (#E6B222), `--csp-teal` (#00A9A3), `--csp-gray` (#E1E8EC), `--csp-page-bg` (#f5f4f2), plus `-80/-60/-40/-20/-10` navy tints and `-hover/-light/-mid` gold/teal variants.

Typography: `--font-display` (Barlow Condensed — headings, nav, CTAs, eyebrows) and `--font-body` (Barlow — body copy). Easing: `--ease` (not `--csp-ease`). Gray border color: `--csp-gray` (not `--csp-gray-light`).

### Subsite Accent Pattern

Apply one accent class to the root element (`<nav>`, `<footer>`, `<section class="hero">`). All color variations cascade from that single class:
- `accent-teal` — CIC (Curriculum & Instruction Center)
- `accent-gold` — Writing Center
- `accent-navy` — Archives & Special Collections

Each subsite needs its own `subsites/[subsite]/header.html` (group Custom Header), `footer.html` (group Custom Footer), and optionally `hero.html` (floating box on the subsite homepage). The system-wide header/footer from `libguides/` still loads on every page — the group-level header appears **above** the system-wide header.

### Hero Variants

The main library homepage hero (Box 1) includes a OneSearch form and feature bar. Subsite heroes replace the search form with `.hero-ctas` (primary + ghost CTA buttons) and keep `.hero-search-alts` for quick links. The background image is set inline on `.hero-bg` so each subsite can use a different photo without touching the CSS.

## Repo Structure

`working/` contains reference demos and design mockups (not paste targets):
- `csp-subsite-nav-pattern2.html` — full demo showing all three subsite nav variants side-by-side; use as the template when adding a new subsite
- `cic-subsite-nav.html` — CIC-specific demo with parent nav context for visual comparison
- `csp-homepage-global-style.html`, `csp-brand-comparison.html` — design reference mockups

`subsites/` contains per-subsite paste targets, one directory per subsite:
- `cic/` — Curriculum & Instruction Center (header ✓, footer ✓, hero ✓)
- `writing/` — Writing Center (header ✓; footer and hero pending)
- `archives/` — Archives & Special Collections (not yet started)
- `tutoring/` — Tutoring Support (not yet started)
- `digital-scholarship/` — Digital Scholarship (not yet started)

## Subsite Status

| Subsite | header.html | footer.html | hero.html |
|---|---|---|---|
| CIC | ✓ `subsites/cic/` | ✓ `subsites/cic/` | ✓ `subsites/cic/` |
| Writing Center | ✓ `subsites/writing/` | not yet created | not yet created |
| Archives | not yet created | not yet created | not yet created |
| Tutoring | not yet created | not yet created | not yet created |
| Digital Scholarship | not yet created | not yet created | not yet created |

## Known Issues / Pending

- CIC `footer.html`: "Contact CIC" now uses `mailto:cic@csp.edu` (confirmed from old footer).
- CIC `hero.html`: Background image is a placeholder (the main library photo) — needs a CIC-specific image.
- Writing Center URL paths need verification in LibGuides (especially `/writing-center/apa` and `/writing-center/faculty-resources/tutor`).
- Hero and card images are hosted on a dev Amplify URL (`main.dy1n2ifa5qdl6.amplifyapp.com`) — should be migrated to LibGuides file assets (`libapps.s3.amazonaws.com/customers/955/images/`) before going live.
