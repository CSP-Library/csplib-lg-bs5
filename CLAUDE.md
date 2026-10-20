# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A **static asset repo** — no build tools, no npm, no compilation. Every file in `libguides/` is a paste target for a specific field in LibGuides Admin. There is no local dev server; testing is done by pasting into LibGuides and previewing at `https://library.csp.edu/bs5home?bs5=1`.

## Deployment Model

Each `libguides/` file maps to exactly one Admin field.

- **CSS files** (`libguides-1-custom-css.css`) must include their own `<style>`/`</style>` wrapper tags, written directly in the file (first and last lines). LibGuides does **not** add this wrapper automatically — it has to be pasted in manually.
- **JS files** (`libguides-2-custom-js.js`) must include their own `<script>`/`</script>` wrapper tags, written directly in the file (first and last lines) — same convention as the CSS file's `<style>` wrapper. LibGuides does **not** wrap the Custom JS field automatically (confirmed 2026-10: a paste missing the tags leaves the whole file sitting as unexecuted raw text relocated into visible page content, with every nav/search/dropdown behavior silently broken and no console error to flag it).

| File | LibGuides destination |
|---|---|
| `libguides-1-custom-css.css` | Admin → System Settings → Look & Feel → Custom JS/CSS → Custom CSS |
| `libguides-2-custom-js.js` | Admin → System Settings → Look & Feel → Custom JS/CSS → Custom JS |
| `libguides-3-header-html.html` | Admin → System Settings → Look & Feel → Header & Footer → Header |
| `libguides-4-footer-html.html` | Admin → System Settings → Look & Feel → Header & Footer → Footer |
| `libguides-5-box*.html` | Homepage guide → individual Rich Text/HTML boxes (one file per box) |
| `subsites/[subsite]/header.html` | Group → Look & Feel → Header (one per subsite group) |
| `subsites/[subsite]/footer.html` | Group → Look & Feel → Footer (one per subsite group) |
| `subsites/[subsite]/hero.html` | Individual box in that subsite's homepage guide, with Floating Box checked |

### Version tracking

Every paste-target file above carries a hand-maintained `Version: N` line in its top comment block. Bump it by 1 whenever you edit that specific file (each file has its own independent counter — editing the CSS doesn't bump the JS's version). This lets the version number pasted into a LibGuides Admin field be visually compared against the repo's current version to tell whether that field is stale, without needing git access from inside Admin. `libguides-5-homepage-content.html` is excluded (it's reference-only, not a paste target — see below).

## Critical LibGuides Constraints

- **No `@import` in Custom CSS** — LibGuides strips them. All external CDN dependencies (Bootstrap 5, Bootstrap Icons, Google Fonts) are loaded via `<link>` tags in `libguides-3-header-html.html` only.
- **Custom CSS character limit is ~59K characters** — confirmed by a live truncation (not the ~50–100K originally assumed). The Admin field silently cuts off anything past this length *without* closing the `<style>` tag, which breaks the entire page (everything after becomes inert text inside the unclosed style element — the page renders blank). Always verify after pasting that the field didn't truncate. No base64 data URIs; use hosted image URLs.
- A "retro terminal mode" easter egg (a `body.retro-mode`-scoped CSS block, a "Go retro" footer link, and a JS toggle) existed briefly and was removed (2026-10) specifically because it pushed the CSS file past this character limit and broke the live site. Don't re-add a similar feature without first confirming there's headroom under the ~59K limit.
- **Full-bleed sections** require wrapping in `<div class="s-lg-box-wrapper-hero">` and checking "Floating Box" on the box.
- **`toggleSubNav()`** must stay in global scope in `libguides-2-custom-js.js` — it is called via inline `onclick` attributes on subsite nav toggle buttons and cannot be inside `DOMContentLoaded`.

## Design System

### Token Reference (defined in `:root` in `libguides-1-custom-css.css`)

Brand colors: `--csp-navy` (#003055), `--csp-gold` (#E6B222), `--csp-teal` (#00A9A3), `--csp-gray` (#E1E8EC), `--csp-page-bg` (#f5f4f2), plus `-80/-60/-40/-20/-10` navy tints and `-hover/-light/-mid` gold/teal variants.

Typography: `--font-display` (Barlow Condensed — headings, nav, CTAs, eyebrows) and `--font-body` (Barlow — body copy). Easing: `--ease` (not `--csp-ease`). Gray border color: `--csp-gray` (not `--csp-gray-light`).

The Google Fonts `<link>` for Barlow Condensed/Barlow lives only in `libguides-3-header-html.html` (the system-wide header), not in any subsite file. Subsite CSS classes (`.hero-heading`, `.csp-sub-name`, etc., all in `libguides-1-custom-css.css`) already reference the same `var(--font-display)`/`var(--font-body)` tokens as the main site — don't add separate font declarations or Google Fonts links to a subsite header. Fonts match automatically as long as the system-wide header is actually inheriting on that page (see the Subsite Accent Pattern section below if it isn't).

### Subsite Accent Pattern

Apply one accent class to the root element (`<nav>`, `<footer>`, `<section class="hero">`). All color variations cascade from that single class:
- `accent-teal` — CIC (Curriculum & Instruction Center)
- `accent-gold` — Writing Center
- `accent-navy` — Archives & Special Collections

Each subsite needs its own `subsites/[subsite]/header.html` (group Custom Header), `footer.html` (group Custom Footer), and optionally `hero.html` (floating box on the subsite homepage). The system-wide header/footer from `libguides/` renders on every page — the group-level header appears **above** the system-wide header. Confirmed working (2026-10) on a CIC guide placed in its own dedicated Group with the Group's own Look & Feel → Header/Footer set to `subsites/cic/group/header.html` / `footer.html`: the system-wide header/footer rendered correctly above/below it.

If a guide's system-wide header *doesn't* seem to be inheriting (no `.csp-navbar`, no Google Fonts link, body falls back to LibGuides' default theme font), the likely cause is that the guide doesn't belong to a Group with its own properly-configured Header/Footer — e.g. an ad-hoc duplicated ("Copy of …") guide, or one sitting in a Group that still has legacy/pre-redesign header settings. Fix it by moving the guide into (or creating) a Group whose Look & Feel is set up per this table, rather than trying to fix it in code — this is an Admin configuration issue, not a template bug. Custom CSS, by contrast, is a System-wide setting and reliably applies everywhere regardless of Group.

**Subsite headers/footers must not include their own "back to library" link, logo, or breadcrumb.** Early versions of `subsites/cic/group/header.html` and `subsites/writing/header.html` each had one (`.csp-sub-crumb-band`/`.csp-sub-crumb-link` or `.csp-crumb`), on the assumption they might need to stand alone. Now that the system-wide header is confirmed to reliably render above the group header, that affordance is already provided by the system header's own logo/nav — a second one on the subsite nav is pure duplication. These classes were removed from the CSS entirely; don't reintroduce them in a new subsite header.

### Subsite Header CTA Visibility

Each subsite's outer nav wrapper (`.csp-subsite-nav` in its `header.html`) carries a `subsite-[name]` class (e.g. `subsite-cic`) alongside its accent class. This lets `libguides-1-custom-css.css` hide the system-wide navbar's Hours/Get Help buttons (`.csp-nav-cta-hours` / `.csp-nav-cta-help` in `libguides-3-header-html.html`) on a per-subsite basis via `body:has(.csp-subsite-nav.subsite-[name]) .csp-navbar .csp-nav-cta-*` — used for CIC, since its own nav already has an equivalent "Get Support" CTA. To opt another subsite in or out, add/remove its block in the CSS's "Subsite header CTA visibility" section; no JS or per-subsite markup beyond the one class is needed.

### Hero Variants

The main library homepage hero (Box 1) includes a OneSearch form and feature bar. Subsite heroes replace the search form with `.hero-ctas` (primary + ghost CTA buttons) and keep `.hero-search-alts` for quick links. The background image is set inline on `.hero-bg` so each subsite can use a different photo without touching the CSS.

## Repo Structure

`working/` contains reference demos and design mockups (not paste targets):
- `csp-subsite-nav-pattern2.html` — full demo showing all three subsite nav variants side-by-side; use as the template when adding a new subsite
- `cic-subsite-nav.html` — CIC-specific demo with parent nav context for visual comparison
- `csp-homepage-global-style.html`, `csp-brand-comparison.html` — design reference mockups

**`libguides-5-homepage-content.html` is NOT a paste target** — it's the original monolithic file the `box1`–`box6` files were split out of (May 2026), kept only as a single-file reference for reading the whole homepage at once. The **`box1`–`box6` files are the only ones actually pasted into LibGuides**, per the table above. This file is not updated automatically when the box files change — if you edit a box file's content, manually mirror the change here too, or this file silently goes stale (it already has once: a fix landed in a box file but not here, and the stale copy got mistaken for the source of truth, pointing a re-paste at the wrong file entirely). When in doubt about which is current, diff this file's section against the corresponding box file rather than assuming either is right.

`subsites/` contains per-subsite paste targets, one directory per subsite:
- `cic/` — Curriculum & Instruction Center (header ✓, footer ✓, hero ✓). Split into `group/` (header.html, footer.html — pasted at the Group level) and `guide/` (hero.html — pasted at the individual guide level), since those are two different Admin locations. Other subsites haven't been split this way yet; do it as each one picks up a hero/guide-level file of its own.
- `writing/` — Writing Center (header ✓; footer and hero pending)
- `archives/` — Archives & Special Collections (not yet started)
- `tutoring/` — Tutoring Support (not yet started)
- `digital-scholarship/` — Digital Scholarship (not yet started)

## Subsite Status

| Subsite | header.html | footer.html | hero.html |
|---|---|---|---|
| CIC | ✓ `subsites/cic/group/` | ✓ `subsites/cic/group/` | ✓ `subsites/cic/guide/` |
| Writing Center | ✓ `subsites/writing/` | not yet created | not yet created |
| Archives | not yet created | not yet created | not yet created |
| Tutoring | not yet created | not yet created | not yet created |
| Digital Scholarship | not yet created | not yet created | not yet created |

Table above tracks whether the files exist in this repo, not whether they're live. CIC is the only subsite confirmed working end-to-end on an actual LibGuides page (a guide in its own dedicated Group, system header correctly inheriting above the group header) — that's the known-good reference setup to replicate for the others. The production `/cic/home` guide (no dev group) is still on LibGuides' old default theme and hasn't been migrated.

## Known Issues / Pending

- CIC `footer.html`: "Contact CIC" now uses `mailto:cic@csp.edu` (confirmed from old footer).
- CIC `hero.html`: now uses a CIC-specific building-entrance photo (`images/csp-library-hero-cic.jpg`, 2026-10), replacing the main-library-photo placeholder. The source photo was only 1500px wide — short of the "at least 1600px" convention noted in the file's own comment (not upscaled, to avoid softening it). Swap in a wider original if one becomes available.
- Writing Center URL paths need verification in LibGuides (especially `/writing-center/apa` and `/writing-center/faculty-resources/tutor`).
- Hero and card images are hosted on a dev Amplify URL (`main.dy1n2ifa5qdl6.amplifyapp.com`) — should be migrated to LibGuides file assets (`libapps.s3.amazonaws.com/customers/955/images/`) before going live.
