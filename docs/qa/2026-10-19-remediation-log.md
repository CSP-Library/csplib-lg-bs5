# QA remediation log

Baseline: [2026-10-19 audit](2026-10-19-baseline-audit.md) · [work orders](2026-10-19-remediation-work-orders.md)

## Status register

One row per audit finding. **Update this table in the same commit as any fix**, then add or extend the detailed section below it.

Status values (from the work orders' completion template): **Open** · **Owner decision** (blocked on a named owner) · **Implemented** (in the repo, not pasted) · **Deployed, awaiting verification** (pasted, not re-tested on the live page) · **Verified** (tested on the live page after pasting; put the date in *Deployment check*) · **Accepted risk**.

*Deployment check* is the date someone tested the fix on the live page after pasting. "Code seen live" means the fixed code was found on the live homepage (`/bs5home?bs5=1`, 2026-10-21) but the acceptance tests weren't rerun there. Group-level fields (CIC/Writing headers) can't be seen from the homepage and are noted separately.

| ID | Pri | Finding | Status | Commits | Deployment check | Details | Notes / blocker |
|---|---|---|---|---|---|---|---|
| QA-001 | P1 | Search button fails | Deployed, awaiting verification | `d67c01f` | Not checked (code seen live 2026-10-21) | [log](#qa-001) · [audit](2026-10-19-baseline-audit.md#qa-001--p1--search-button-fails-confirmed-live-and-source) | Owner question: Primo view URL. Edge-case searches untested. |
| QA-002 | P1 | Desktop dropdowns need a pointer | Deployed, awaiting verification | `d67c01f`, `0673777` | Not checked (system nav seen live 2026-10-21) | [log](#qa-002) · [audit](2026-10-19-baseline-audit.md#qa-002--p1--desktop-dropdowns-require-a-pointer-confirmed-live-and-source) | CIC group header not checked live. Screen-reader check pending (W7). |
| QA-003 | P1 | Teal buttons fail contrast | Implemented | `462b10b` | Not deployed | [log](#qa-003) · [audit](2026-10-19-baseline-audit.md#qa-003--p1--teal-actions-fail-text-contrast-confirmed-livesource) | Brand owner may prefer navy-on-teal instead. |
| QA-004 | P1 | Footer text too faint | Implemented | `462b10b` | Not deployed | [log](#qa-004) · [audit](2026-10-19-baseline-audit.md#qa-004--p1--footer-text-is-deliberately-too-faint-confirmed-livesource) | — |
| QA-005 | P1 | Broken skip / back-to-top targets | Implemented | `462b10b` | Not deployed | [log](#qa-005) · [audit](2026-10-19-baseline-audit.md#qa-005--p1--invalid-skipback-to-top-targets-confirmed-livesource) | — |
| QA-006 | P2 | Horizontal overflow (full bleed) | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-006--p2--horizontal-overflow-in-full-bleed-layout-confirmed-live-wcag-failure-pending-exact-test) | W4 |
| QA-007 | P1 | Closed subsite nav still focusable | Deployed in part, awaiting verification | `d67c01f` | Not checked (system CSS/JS seen live 2026-10-21) | [log](#qa-007) · [audit](2026-10-19-baseline-audit.md#qa-007--p1--collapsed-subsite-navigation-retains-focusable-links-confirmed-source-live-subsite-validation-needed) | CIC and Writing group headers not checked live. |
| QA-008 | P2 | Extra Bootstrap layer | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-008--p2--extra-bootstrap-layer-can-conflict-with-platform-assets-confirmed-asset-inventory-behavioral-risk) | W4 |
| QA-009 | P2 | Global chrome hiding | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-009--p2--global-chrome-suppression-has-broad-regression-potential-confirmed-source) | W4 |
| QA-010 | P2 | News/events placeholders | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-010--p2--newsevents-are-public-developer-placeholders-confirmed-livesource) | W5 |
| QA-011 | P2 | Hardcoded time-sensitive claims | Owner decision | — | — | [audit](2026-10-19-baseline-audit.md#qa-011--p2--time-sensitive-claims-are-hardcoded-confirmed-livesource) | W5. Needs current hours/chat wording from service owners. |
| QA-012 | P2 | Inconsistent link destinations | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-012--p2--link-destinations-are-inconsistent-and-incompletely-verified-confirmed-source-reachability-open) | W5. Needs owners to confirm intended destinations. |
| QA-013 | P2 | Images on dev Amplify host | Owner decision | — | — | [audit](2026-10-19-baseline-audit.md#qa-013--p2--production-visuals-depend-on-a-development-asset-host-confirmed-sourcelive-hero) | W5. Needs an approved permanent image host. |
| QA-014 | P2 | Branding docs vs current site | Owner decision | — | — | [audit](2026-10-19-baseline-audit.md#qa-014--p2--branding-documentation-no-longer-matches-the-current-comparison-site-confirmed-visual-comparison) | W6. Needs brand owner sign-off. |
| QA-015 | P2 | README points to stale files | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-015--p2--readme-sends-editors-to-stalereference-content-confirmed-source) | W6 |
| QA-016 | P2 | No deployment provenance | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-016--p2--deployment-provenance-and-regression-gates-are-absent-confirmed-repository-treesource) | W6 |
| QA-017 | P2 | Analytics and security headers | Owner decision | — | — | [audit](2026-10-19-baseline-audit.md#qa-017--p2--analyticsconsent-and-security-headers-need-administrator-verification-risk) | W7. Platform/analytics admins. |
| QA-018 | P3 | Inline handlers, DOM assumptions | Open (partly fixed) | `d67c01f`, `462b10b` | — | [audit](2026-10-19-baseline-audit.md#qa-018--p3--inline-handlers-and-dom-assumptions-make-maintenancecsp-harder-confirmed-source) | Search and footer Admin handlers removed. Subsite toggle onclicks remain. |
| QA-019 | P3 | Icons in link names | Deployed, awaiting verification | `d67c01f` | Not checked (code seen live 2026-10-21) | [log](#qa-019) · [audit](2026-10-19-baseline-audit.md#qa-019--p3--decorative-icons-contaminate-accessible-link-names-confirmed-livesource) | Screen-reader check pending (W7). |
| QA-020 | P3 | Motion and target size | Open | — | — | [audit](2026-10-19-baseline-audit.md#qa-020--p3--motion-and-target-size-coverage-is-incomplete-confirmed-source-aa-outcomes-unverified) | W4 |

---

# Remediation log — W1/W2 pass

Baseline: [2026-10-19 audit](2026-10-19-baseline-audit.md) + [work orders](2026-10-19-remediation-work-orders.md).
Source at start of this pass: a9fc0bf (2 commits ahead of the audit's pinned f66ccfa — see note below).
This pass covers W1 and W2 only. W3–W7 are untouched.

## Note on baseline drift

The audit's pinned baseline (f66ccfa) predates a commit already on `updates` when this pass started: a9fc0bf, "Add dropdown menus to CIC subsite nav." That commit added new desktop dropdown triggers to `subsites/cic/header.html` using the same hover-only interaction model as the (flawed) system nav controller it mirrored — i.e. it reproduced the QA-002 pattern in code the audit never saw. Since `subsites/cic/header.html` was already listed as an allowed file under W2, this pass treats that as in-scope rather than a separate finding, and fixes it alongside the system nav.

<a id="qa-001"></a>

## W1 — QA-001 (P1) — implemented, deployment verification pending

- Changed: `libguides/libguides-5-box1-hero.html` (div→form, button type=button→submit, removed inline onclick), `libguides/libguides-2-custom-js.js` (single submit handler, removed scoped `doSearch`/separate Enter listener).
- Reproduced before: clicking Search threw `ReferenceError: doSearch is not defined` (doSearch was scoped inside the DOMContentLoaded closure, unreachable from the inline onclick). Enter worked via a separate in-scope keydown listener.
- Verified after (live browser test against the actual repo files, not just read): button click, with input "fermentation", navigates to `.../nde/search?...&query=fermentation` — same destination the audit recorded for Enter. No console errors.
- Not changed: URL/view semantics (CSP legacy view, redirects to NDE) — left exactly as-is per the work order's explicit instruction to get owner confirmation before changing that. See "Open questions" below.
- Acceptance not yet covered by this pass: ampersand/apostrophe/non-ASCII/blank-input edge cases, and the live LibGuides-deployed field (this was verified against the repo source only, per the operating contract's repository-vs-deployment separation).

<a id="qa-002"></a>

## W2 — QA-002 (P1) — implemented, deployment verification pending

Files: `libguides/libguides-2-custom-js.js` (system nav controller + the CIC subsite dropdown controller added in a9fc0bf), `libguides/libguides-3-header-html.html`, `subsites/cic/header.html`.

- System nav: desktop click handler no longer returns early; clicking/Enter/Space on a trigger now opens its panel. Click only ever opens (never toggles closed) specifically to avoid self-cancelling a hover-opened panel — closing is Escape, outside click (existing backdrop-click), or a new `focusout` listener that closes only once focus actually leaves the item (so Tab can traverse the panel's own links without closing it).
- Same fix applied to the CIC subsite dropdowns added in a9fc0bf, since they reproduced the identical pattern (see note above).
- Added a `resize` listener closing any open system-nav panel, to avoid stale state across the 991/992 breakpoint (no equivalent gap existed for the subsite controller — it already resets correctly on an actual breakpoint crossing, verified below).
- Removed `aria-haspopup="true"` from all 6 triggers (3 system, 3 CIC) per the work order's item 4 — none of these implement real ARIA menu/menuitem roles or arrow-key navigation, so the attribute was overclaiming.
- Verified live: first click opens + sets aria-expanded=true; a second click does not close it (self-cancel fixed); focus moving to a link inside the panel keeps it open; focus moving to another top-level trigger closes it; Escape closes and returns focus to the trigger; resize closes an open panel. Confirmed for both the system nav (Find Resources) and the CIC subsite nav (Policies).
- One environment note: testing this required overriding `window.innerWidth` and forcing `.navbar-collapse` visible in the test harness, because Bootstrap's own `@media (min-width:992px)` rule (not just this codebase's `isDesktop()` check) gates the nav's visibility at the real automation window's width (960px). Real users at genuine desktop widths aren't affected; this was purely a test-environment constraint.

<a id="qa-007"></a>

## W2 — QA-007 (P1) — implemented, deployment verification pending

Files: `libguides/libguides-1-custom-css.css`, `libguides/libguides-2-custom-js.js`, `subsites/cic/header.html`, `subsites/writing/header.html`.

- `.csp-sub-collapse` and `.csp-sub-mobile-dropdown` (the CIC dropdown mobile accordion added in a9fc0bf) now carry a `hidden` attribute by default. `toggleSubNav`/`toggleSubDropdown` (unified into one `toggleDisclosurePanel` to avoid duplicating the timing logic, both names kept for the existing inline-onclick references) remove `hidden` before animating open and restore it only after the close transition's `transitionend` fires — so closed content is genuinely untabbable/invisible to the accessibility tree, not just visually clipped. This was the literal defect: desktop previously had the mobile link set sitting in the tab order at zero height behind the visible desktop link set.
- Bumped `.csp-sub-collapse.is-open` max-height 480px→2000px and `.csp-sub-mobile-dropdown.is-open` 320px→1000px, per item 5's "prevent 480px content clipping at enlarged text" — these numbers only drive the animation now (hidden does the real hiding), so there's no longer a reason for a tight cap that could clip at 200%+ text zoom.
- Closing the outer `.csp-sub-collapse` now also immediately resets any nested `.csp-sub-mobile-dropdown`/trigger inside it (hidden + aria-expanded=false) — found via live testing that without this, reopening the outer panel could resurface a nested accordion item stuck showing "expanded" from before it was last closed. Not a focus leak (the outer panel being hidden already made it unreachable) but a real instance of the acceptance matrix's "closing parent clears child state."
- Removed hardcoded `is-active`/implicit "Home is always active" from both CIC's and Writing's Home links (desktop + mobile); added a small current-page-detection block to the JS that compares each `.csp-sub-link`/`.csp-sub-mobile-link`'s `.pathname` against `location.pathname` and sets `.is-active`/`aria-current="page"` dynamically. Guards against matching the dropdown trigger buttons (which share these classes for styling, not navigation).
- Verified live (served the assembled page at a `/cic/home`-shaped path so `location.pathname` matching could be tested realistically): Home correctly marked active + `aria-current="page"` at that path; a Policies link correctly not marked active; outer panel correctly hidden by default, reachable only once open, re-hidden once the close transition ends; same for the nested accordion; resize-triggered hard reset also sets `hidden` directly.
- Writing Center's header got the same `is-active`/`hidden` fixes but was **not** otherwise touched — it's still on the older single-band nav layout (pre-dates CIC's two-band refactor) and has no dropdown items, so none of the dropdown-specific work applied there. Not re-platforming it to match CIC was a deliberate scope decision (unrelated redesign), not an oversight.

<a id="qa-019"></a>

## W2 — QA-019 (P3) — implemented, deployment verification pending

- Added `aria-hidden="true"` to all 22 previously-bare decorative `<i class="bi ...">` icons in the system header's dropdown/mega-menu items, and to the 7 bare chevron-right icons in Box 2. Not independently re-verified with an actual screen reader (VoiceOver/NVDA) in this pass — the work order's acceptance for QA-019 explicitly calls for that, and it's listed as needing real AT testing under W7, not something a static-analysis pass can certify.

## Open questions (owner-dependent, not acted on)

- **QA-001 item 4**: should the search form target the CSP Primo view (current, legacy-redirects-to-NDE) directly, or go straight to the NDE view/URL? Left unchanged pending an answer — this is a service-owner decision, not something to infer from code.
- Everything in W3–W7 is untouched and still open, including the genuinely owner-blocked items (summer-hours copy accuracy, brand reference sign-off, link-destination verification, image host migration, analytics/security header inspection) — none of these were acted on or assumed.

## Not yet done from W2's stated acceptance matrix

- Full 320/390/768/991/992/1280/1440 responsive sweep, 200% text and 400% zoom checks (that's W4's territory, not started).
- Real assistive-technology verification (VoiceOver+Safari, NVDA+Chrome) — explicitly flagged in the work orders as needing a human AT tester, not a browser accessibility-tree read.
- The deployed-field verification itself (pasting these files into LibGuides Admin) — not done; per the operating contract, repository edits and deployment are separate operations, and this pass did not get authorization to paste into Admin fields.

---

# Remediation log — W3 pass (2026-10-21)

Source at start of this pass: ddd4aad (`updates`). This pass covers W3 only (QA-003, QA-004, QA-005). W1/W2 open items above are unchanged; W4–W7 are untouched.

Files changed: `libguides/libguides-1-custom-css.css` (Version 1→2), `libguides/libguides-3-header-html.html` (1→2), `libguides/libguides-4-footer-html.html` (1→2). Subsite HTML files were not edited; their fixes come through the shared CSS.

Custom CSS after this pass: 49,380 characters / ~53.5K bytes, against the ~59K-character Admin cutoff. `<style>` first line and `</style>` last line intact.

## How this was verified

Contrast ratios were measured in Chrome against a composed copy of the live homepage (fetched 2026-10-21) with the repo's CSS, JS, header and footer swapped in, served from the dev VM. Alpha text was composited over the nearest solid ancestor background using WCAG sRGB luminance. Subsite rules (CIC/teal) were checked by injecting sample `.accent-teal` CTA, hero and footer markup into that page, since the homepage doesn't render them. This is a **source/pre-deployment** check, not a post-paste verification.

<a id="qa-003"></a>

## W3 — QA-003 (P1) — implemented, deployment verification pending

- Added `--csp-teal-action` (#007f7b, the existing teal-hover value) and `--csp-teal-action-hover` (#00635F) as text-safe action tokens. `--csp-teal` (#00A9A3) is unchanged and still used for decorative borders, eyebrows, icons and accent stripes, so there was no global brand-color change.
- Moved white-text teal buttons onto the action tokens: `.cta-teal` (homepage Research Assistance CTA), `.accent-teal .csp-sub-cta` / `.csp-sub-mobile-cta` (CIC Get Support), `.accent-teal .hero-cta-primary` (CIC hero; same failing pairing, not named in the audit).
- Added `:visited` color coverage for these (`color:#fff !important`), matching the pattern already used for navy CTAs, so platform visited-link rules can't override them.
- Measured: white on #007f7b = **4.86:1** default/visited; hover #00635F = 7.12:1 (previously 2.92:1).
- **Design note for the owner:** the teal buttons render visibly darker. The other option the work order allowed (navy text on brand teal, 4.64:1) keeps the brighter teal but has no obvious hover state that passes. Either is easy to swap if the brand owner prefers it.

<a id="qa-004"></a>

## W3 — QA-004 (P1) — implemented, deployment verification pending

- Added `--csp-on-navy-muted` = rgba(255,255,255,.6), **5.78:1** on navy, and applied it to every failing small text on solid navy: `.footer-brand p` (.50), `.footer-address` (.38), `.footer-bottom p`/`a`/`:visited` (.30), `.feature-bar-learn`/`:visited` (.45, measured 3.9:1; not named in the audit but the same defect), `.csp-sub-footer-tagline` (.50), `.csp-sub-footer-bottom p`/`a`/`:visited` (.30).
- Admin link: removed inline `color:rgba(255,255,255,.2)` (1.83:1) and the `onmouseover`/`onmouseout` handlers (also part of QA-018); it now uses a `.footer-admin` class and inherits the muted token. It's still visually secondary through its smaller size (.72rem).
- Hover/focus on footer-bottom links now goes to `#fff !important`. Before, the `!important` visited rule beat the plain hover rule, so visited links never changed on hover.
- The existing .55 footer links (5.10:1) were left alone, per the audit.
- Measured minimum across all footer/feature-bar text on the composed page: 5.10:1.

<a id="qa-005"></a>

## W3 — QA-005 (P1) — implemented, deployment verification pending

- Removed both custom skip links from the system header: the duplicate to `#s-lg-guide-main` and the broken one to `#main-content`. The single bypass is now LibGuides' own `#s-lg-public-skiplink` → `#s-lg-guide-main`, which the platform renders as the first element of `<body>` and shows on focus (bordered white box, platform CSS). Removed the now-unused `.skip-link` CSS.
- Back to top now targets `#s-lg-public-skiplink` instead of the missing `#main-content`. That's the real top of every LibGuides page, above any group header, so it also works on subsite pages.
- Added `scroll-margin-top` on `#s-lg-guide-main` so a skip-link landing isn't hidden under the sticky navbar. Without it, main landed at y=0 behind the ~76px navbar, which is relevant to WCAG 2.4.11.
- Verified (keyboard, real Enter key presses): every `href="#…"` on the page resolves to exactly one element. Back to top → focus on the skip link at the top of the page, visible. Enter on the skip link → focus on `#s-lg-guide-main`, landing at the navbar's bottom edge (before the 16px buffer was added).

## Not done / residual for W3

- Hero text over the photo (`.hero-sub` .65, `.hero-alt-link` .5) can't be measured from source because the background is an image under a gradient overlay. It needs a live pixel-level check at several widths; not changed.
- Focus-indicator contrast (1.4.11) for controls was not swept; the work order's item 6 (search input outline) was left as is, since the audit observed a working live outline.
- Post-paste verification in LibGuides Admin (these three fields) has not been done.
