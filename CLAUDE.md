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
| `libguides-1-custom-css.css` | **Dev phase (current):** not pasted into Admin — loaded via `<link>` in `libguides-3-header-html.html` from this repo's own Amplify deploy. See "CSS hosting" below. |
| `libguides-2-custom-js.js` | Admin → System Settings → Look & Feel → Custom JS/CSS → Custom JS |
| `libguides-3-header-html.html` | Admin → System Settings → Look & Feel → Header & Footer → Header |
| `libguides-4-footer-html.html` | Admin → System Settings → Look & Feel → Header & Footer → Footer |
| `libguides-5-box*.html` | Homepage guide → individual Rich Text/HTML boxes (one file per box) |
| `subsites/[subsite]/header.html` | Group → Look & Feel → Header (one per subsite group) |
| `subsites/[subsite]/footer.html` | Group → Look & Feel → Footer (one per subsite group) |
| `subsites/[subsite]/hero.html` | Individual box in that subsite's homepage guide, with Floating Box checked |

### Version tracking

Every paste-target file above carries a hand-maintained `Version: N` line in its top comment block. Bump it by 1 whenever you edit that specific file (each file has its own independent counter — editing the CSS doesn't bump the JS's version). This lets the version number pasted into a LibGuides Admin field be visually compared against the repo's current version to tell whether that field is stale, without needing git access from inside Admin. `libguides-5-homepage-content.html` is excluded (it's reference-only, not a paste target — see below). `libguides-1-custom-css.css` still carries its own `Version: N` even though it's no longer pasted into Admin (see below) — it still documents what changed, and it's not worth special-casing out of the convention.

### CSS hosting (dev phase, 2026-11–)

`libguides-1-custom-css.css` outgrew the Admin Custom CSS field's ~59K character limit (see below). This repo is itself connected to Amplify (the `updates` branch, same branch all dev work happens on), so instead of pasting the file into Admin, `libguides-3-header-html.html` loads it directly via `<link rel="stylesheet" href="https://updates.d1owbq5psbdlss.amplifyapp.com/libguides/libguides-1-custom-css.css">` — confirmed live that Amplify serves the raw repo tree with correct `text/css` content-type. Amplify invalidates its CDN cache on every deploy, so a `git push` to `updates` is live within moments, no manual re-paste and no cache-busting needed.

**The file has no `<style>`/`</style>` wrapper right now** — unlike every other Admin-pasted file in this repo. A linked stylesheet must be pure CSS, and a leading `<style>` tag with no clean boundary before the `:root{}` block right after it makes browsers discard the *entire* `:root` block as part of one broken rule (confirmed live 2026-11: every color/font/spacing custom property silently went empty, while hardcoded-value rules kept working — this shipped and was caught on the live site, not in testing). If you ever revert to the Admin-paste method, add `<style>` as a new first line and `</style>` as a new last line first — the file is not paste-ready as-is anymore.

This means CSS edits no longer need a Header re-paste — just push to `updates`. The Custom CSS Admin field itself should be **empty** while this is in place; don't maintain a pasted copy alongside the linked one, they'll fight each other.

This is explicitly a dev-phase convenience, not the intended long-term home — a separate Amplify-backed repo (`comet.csplib.io`) already hosts other static assets (images) and is the likely production target once the redesign stabilizes and the codebase gets consolidated/condensed. Don't treat the `updates.d1owbq5psbdlss.amplifyapp.com` URL as a permanent production dependency.

## Critical LibGuides Constraints

- **No `@import` in Custom CSS** — LibGuides strips them. All external CDN dependencies (Bootstrap 5, Bootstrap Icons, Google Fonts) are loaded via `<link>` tags in `libguides-3-header-html.html` only.
- **Custom CSS character limit is ~59K characters** — confirmed by a live truncation (not the ~50–100K originally assumed). The Admin field silently cuts off anything past this length *without* closing the `<style>` tag, which breaks the entire page (everything after becomes inert text inside the unclosed style element — the page renders blank). Always verify after pasting that the field didn't truncate. No base64 data URIs; use hosted image URLs. **Not a live constraint right now** — see "CSS hosting" above — but still applies to every other Admin-pasted field, and to the CSS file too if it's ever reverted to the paste method.
- A "retro terminal mode" easter egg (a `body.retro-mode`-scoped CSS block, a "Go retro" footer link, and a JS toggle) existed briefly and was removed (2026-10) specifically because it pushed the CSS file past this character limit and broke the live site. Don't re-add a similar feature without first confirming there's headroom under the ~59K limit.
- **Full-bleed sections** require wrapping in `<div class="s-lg-box-wrapper-hero">` and checking "Floating Box" on the box.
- **`toggleSubNav()`** must stay in global scope in `libguides-2-custom-js.js` — it is called via inline `onclick` attributes on subsite nav toggle buttons and cannot be inside `DOMContentLoaded`.

## Design System

### Token Reference (defined in `:root` in `libguides-1-custom-css.css`)

Brand colors: `--csp-navy` (#003055), `--csp-gold` (#E6B222), `--csp-teal` (#00A9A3), `--csp-gray` (#E1E8EC), `--csp-page-bg` (#f5f4f2), plus `-80/-60/-40/-20/-10` navy tints and `-hover/-light/-mid` gold/teal variants.

Text-safe tokens (QA-003/004): never put white text on `--csp-teal` (2.92:1). Use `--csp-teal-action` / `--csp-teal-action-hover` for teal buttons with white text, and `--csp-on-navy-muted` for secondary text on navy. Don't drop white text on navy below .55 opacity (4.5:1 needs about .5).

Skip links: the system header has no skip link of its own. LibGuides renders `#s-lg-public-skiplink` → `#s-lg-guide-main` first in `<body>`, and the footer's Back to top targets that link. Don't reintroduce `#main-content`; that ID doesn't exist on LibGuides pages.

Typography: `--font-display` (Barlow Condensed — headings, nav, CTAs, eyebrows) and `--font-body` (Barlow — body copy). Easing: `--ease` (not `--csp-ease`). Gray border color: `--csp-gray` (not `--csp-gray-light`).

The Google Fonts `<link>` for Barlow Condensed/Barlow lives only in `libguides-3-header-html.html` (the system-wide header), not in any subsite file. Subsite CSS classes (`.hero-heading`, `.csp-sub-name`, etc., all in `libguides-1-custom-css.css`) already reference the same `var(--font-display)`/`var(--font-body)` tokens as the main site — don't add separate font declarations or Google Fonts links to a subsite header. Fonts match automatically as long as the system-wide header is actually inheriting on that page (see the Subsite Accent Pattern section below if it isn't).

### Subsite Accent Pattern

Apply one accent class to the root element (`<nav>`, `<footer>`, `<section class="hero">`). All color variations cascade from that single class:
- `accent-teal` — CIC (Curriculum & Instruction Center)
- `accent-gold` — Writing Center, Tutoring Support
- `accent-navy` — Archives & Special Collections

Writing Center and Tutoring intentionally (as of 2026-11) share `accent-gold` — nothing in the system requires each subsite to have a unique color, but it does mean the two won't be visually distinguishable by accent alone. Revisit if that turns out to matter once both are live.

Each `.accent-teal`/`.accent-gold`/`.accent-navy` class defines three custom properties (`libguides-1-custom-css.css`, "Accent tokens"): `--accent-color` and `--accent-light` for use on light/white backgrounds (dropdown panels, hero quick-link tiles, mobile menus), and `--accent-on-dark` for use against the navy nav-band specifically — navy's own `--accent-color` is literally that band's background color, so anything using it there would be invisible; `--accent-on-dark` substitutes a lighter navy tint instead. Any new subsite component that needs to read the subsite's accent color should use one of these three vars (with a sensible fallback), not hardcode a color.

Each subsite needs its own `subsites/[subsite]/header.html` (group Custom Header), `footer.html` (group Custom Footer), and optionally `hero.html` (floating box on the subsite homepage). The system-wide header/footer from `libguides/` renders on every page — the group-level header appears **above** the system-wide header. Confirmed working (2026-10) on a CIC guide placed in its own dedicated Group with the Group's own Look & Feel → Header/Footer set to `subsites/cic/group/header.html` / `footer.html`: the system-wide header/footer rendered correctly above/below it.

If a guide's system-wide header *doesn't* seem to be inheriting (no `.csp-navbar`, no Google Fonts link, body falls back to LibGuides' default theme font), the likely cause is that the guide doesn't belong to a Group with its own properly-configured Header/Footer — e.g. an ad-hoc duplicated ("Copy of …") guide, or one sitting in a Group that still has legacy/pre-redesign header settings. Fix it by moving the guide into (or creating) a Group whose Look & Feel is set up per this table, rather than trying to fix it in code — this is an Admin configuration issue, not a template bug. Custom CSS, by contrast, is a System-wide setting and reliably applies everywhere regardless of Group.

**Subsite headers/footers must not include their own "back to library" link, logo, or breadcrumb.** Early versions of `subsites/cic/group/header.html` and `subsites/writing/header.html` each had one (`.csp-sub-crumb-band`/`.csp-sub-crumb-link` or `.csp-crumb`), on the assumption they might need to stand alone. Now that the system-wide header is confirmed to reliably render above the group header, that affordance is already provided by the system header's own logo/nav — a second one on the subsite nav is pure duplication. These classes were removed from the CSS entirely; don't reintroduce them in a new subsite header.

### Subsite Header CTA Visibility

Each subsite's outer nav wrapper (`.csp-subsite-nav` in its `header.html`) carries a `subsite-[name]` class (e.g. `subsite-cic`) alongside its accent class. This lets `libguides-1-custom-css.css` hide the system-wide navbar's Hours/Get Help buttons (`.csp-nav-cta-hours` / `.csp-nav-cta-help` in `libguides-3-header-html.html`) on a per-subsite basis via `body:has(.csp-subsite-nav.subsite-[name]) .csp-navbar .csp-nav-cta-*` — used for CIC, since its own nav already has an equivalent "Get Support" CTA. To opt another subsite in or out, add/remove its block in the CSS's "Subsite header CTA visibility" section; no JS or per-subsite markup beyond the one class is needed.

### Hero Variants

The main library homepage hero (Box 1) includes a OneSearch form and feature bar. Subsite heroes replace the search form with `.hero-ctas` (primary + ghost CTA buttons) and keep `.hero-search-alts` for quick links. The background image is set inline on `.hero-bg` so each subsite can use a different photo without touching the CSS — if a subsite doesn't have its own photo yet, leave the inline override off entirely and it inherits the default (main site) photo baked into `.hero-bg` in the CSS, rather than hardcoding that URL as a placeholder (see `subsites/tutoring/guide/hero.html`).

A third hero option, `.hero-quick-grid`/`.hero-quick-tile`, is a responsive icon-tile grid (CSS grid with `auto-fit`, no manual breakpoints) for a subsite that wants several quick-link destinations in the hero instead of (or alongside) `.hero-ctas` — built for Tutoring Support's six "quick access" tiles, moved into the hero from the legacy page and rebuilt with Bootstrap Icons instead of the original raster icon images. Not Tutoring-specific; any subsite hero can use it. The tile icon (`.hero-quick-tile i.bi`) background uses `var(--accent-color)`, so it recolors automatically per subsite.

Each tile is a flat `<a class="hero-quick-tile"><i class="bi ..."></i>Label text</a>` — **no wrapping `<span>`s around the icon or label.** An earlier version wrapped each in its own `<span>` and it broke the first time it was actually pasted into a guide: LibGuides' Rich Text box has two paste paths — the plain WYSIWYG view, and "Edit HTML Source" (the `<>` toolbar button) for raw markup. Pasting into the WYSIWYG view runs the content through a sanitizer that doesn't like that nesting and silently splits each tile's two children into 3 separate orphaned elements, breaking the whole grid (confirmed live, 2026-11). **Every subsite header/footer/hero file in this repo must be pasted via "Edit HTML Source," never the WYSIWYG view** — and keep inline markup flat (`<a><i></i>text</a>`, no wrapping `<span>`s) in anything new, matching `.csp-sub-dropdown-item`'s already-proven-safe shape, as a second line of defense in case a box ever does get re-saved through the WYSIWYG view by mistake.

## Repo Structure

`working/` contains reference demos and design mockups (not paste targets):
- `csp-subsite-nav-pattern2.html` — full demo showing all three subsite nav variants side-by-side; use as the template when adding a new subsite
- `cic-subsite-nav.html` — CIC-specific demo with parent nav context for visual comparison
- `csp-homepage-global-style.html`, `csp-brand-comparison.html` — design reference mockups
- `tutoring-preview.html` — same-origin preview harness: assembles a subsite's header/hero/footer with the real system header and custom JS at runtime via `fetch()` (works because this file and the files it loads are served from the same Amplify deploy — no CORS issue, unlike fetching them cross-origin from library.csp.edu). Nothing in it is hand-copied from the real files, so it can't drift out of sync. Built for Tutoring since it has no Group/guide in Admin yet to test against directly; reusable for any subsite by changing the three subsite paths at the bottom of the file. If you fetch `libguides-2-custom-js.js` this way, strip its `<script>`/`</script>` wrapper before using the text as a dynamically-created script element's content — and build that wrapper string via concatenation, not as a literal `<script>`/`</script>` substring, or the *outer* file's own inline script gets cut short by its own HTML parser (confirmed live: this exact mistake silently truncated the harness's script block and broke every dropdown).

**`libguides-5-homepage-content.html` is NOT a paste target** — it's the original monolithic file the `box1`–`box6` files were split out of (May 2026), kept only as a single-file reference for reading the whole homepage at once. The **`box1`–`box6` files are the only ones actually pasted into LibGuides**, per the table above. This file is not updated automatically when the box files change — if you edit a box file's content, manually mirror the change here too, or this file silently goes stale (it already has once: a fix landed in a box file but not here, and the stale copy got mistaken for the source of truth, pointing a re-paste at the wrong file entirely). When in doubt about which is current, diff this file's section against the corresponding box file rather than assuming either is right.

`subsites/` contains per-subsite paste targets, one directory per subsite:
- `cic/` — Curriculum & Instruction Center (header ✓, footer ✓, hero ✓). Split into `group/` (header.html, footer.html — pasted at the Group level) and `guide/` (hero.html — pasted at the individual guide level), since those are two different Admin locations. Other subsites haven't been split this way yet; do it as each one picks up a hero/guide-level file of its own.
- `writing/` — Writing Center (header ✓; footer and hero pending)
- `archives/` — Archives & Special Collections (not yet started)
- `tutoring/` — Tutoring Support (header ✓, footer ✓, hero ✓). Split into `group/` (header.html, footer.html) and `guide/` (hero.html) from the start, following CIC's pattern — not yet confirmed live on an actual LibGuides page (no dedicated Group/guide set up in Admin yet).
- `digital-scholarship/` — Digital Scholarship (not yet started)

## Subsite Status

| Subsite | header.html | footer.html | hero.html |
|---|---|---|---|
| CIC | ✓ `subsites/cic/group/` | ✓ `subsites/cic/group/` | ✓ `subsites/cic/guide/` |
| Writing Center | ✓ `subsites/writing/` | not yet created | not yet created |
| Archives | not yet created | not yet created | not yet created |
| Tutoring | ✓ `subsites/tutoring/group/` | ✓ `subsites/tutoring/group/` | ✓ `subsites/tutoring/guide/` |
| Digital Scholarship | not yet created | not yet created | not yet created |

Tutoring's nav/footer links and content were scraped from the live legacy page (`https://library.csp.edu/tutoring-support/home`, 2026-11) — three dropdowns (Meet with a Tutor / Students / Faculty), matching CIC's three-dropdown shape. Not yet pasted into an actual LibGuides Group/guide, so — unlike CIC — not yet confirmed working end-to-end on a real page; verified instead via `working/tutoring-preview.html` (see below).

Table above tracks whether the files exist in this repo, not whether they're live. CIC is the only subsite confirmed working end-to-end on an actual LibGuides page (a guide in its own dedicated Group, system header correctly inheriting above the group header) — that's the known-good reference setup to replicate for the others. The production `/cic/home` guide (no dev group) is still on LibGuides' old default theme and hasn't been migrated.

## Known Issues / Pending

- CIC `footer.html`: "Contact CIC" now uses `mailto:cic@csp.edu` (confirmed from old footer).
- CIC `hero.html`: resolved (2026-11) — the CIC-specific photo (a building-entrance shot, 1500px wide) is now hosted at `https://comet.csplib.io/csp-library-hero-cic.jpg` and is live in the hero. This is a third image host alongside the dev Amplify URL and LibGuides file assets (see below) — worth folding into whatever the eventual single image host ends up being, rather than leaving three hosts in play.
- Writing Center URL paths need verification in LibGuides (especially `/writing-center/apa` and `/writing-center/faculty-resources/tutor`).
- Hero and card images are hosted on a dev Amplify URL (`main.dy1n2ifa5qdl6.amplifyapp.com`) or, for the CIC hero, `comet.csplib.io` — should be migrated to a single permanent host (e.g. LibGuides file assets, `libapps.s3.amazonaws.com/customers/955/images/`) before going live.
