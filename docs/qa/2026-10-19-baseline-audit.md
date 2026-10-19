# CSP Library redesign — baseline QA audit

Date: 2026-10-19 (America/Chicago). Repository: CSP-Library/csplib-lg-bs5. Branch: updates.
Audited source commit: f66ccfa556c42a7965f40eb2d17626713cc6b1d1.
Live target: https://library.csp.edu/bs5home?bs5=1
Disposition: **hold launch pending high-priority corrections and completion of the verification matrix**.

This is a documentation-only audit. No implementation, LibGuides admin settings, or main-branch changes were made. GitHub source is not automatically deployed: the files are pasted into LibGuides fields. Findings below distinguish observed live defects, source defects, and risks needing further validation. This report is not a WCAG conformance certification or penetration test.

## Executive assessment

The research-first homepage, visible service groupings, audience shortcuts, coherent navy/gold palette, and clear heading hierarchy provide a useful foundation. Mobile primary navigation expands successfully. Enter in OneSearch reaches real Primo results. However, clicking its Search button fails, and keyboard users cannot open desktop dropdown navigation. Confirmed text contrast failures and dead fragment links also prevent launch readiness.

The documentation is unusually helpful about LibGuides constraints, but README guidance conflicts with CLAUDE.md and directs editors to a reference file rather than the deployed box files. Manual deployment needs a recorded source-to-field manifest and repeatable acceptance checks.

## Scope and evidence

Reviewed the complete text of the system CSS/JS, system header/footer, six individual homepage box files, monolithic homepage reference, CIC header/footer/hero, Writing Center header, README.md, and CLAUDE.md at the pinned commit. Inspected the repository tree, including the four working reference HTML files and image inventory; working files are design references, not deployment authority. No AGENTS.md or automated test/configuration files were present in the returned recursive tree. Binary image contents were not downloaded or independently optimized.

Browser review used the public development page: accessibility tree, rendered screenshots, read-only DOM/computed-style measurements, console errors, keyboard activation, mobile menu interaction, and an actual Enter search. Viewport overrides were requested at 1440×1000 and 390×844; the browser reported effective inner widths of 1309 and 354 during those checks. A later desktop measurement reported 1280. These are effective CSS dimensions, not a claim of exact device emulation. Overrides were reset. Visual inspection covered the hero, navigation, news placeholders, and footer; the page tree covered all sections. https://global.csp.edu/ was opened as the branding comparison named in README.

### Reproduced live checks

| Check | Result / evidence |
|---|---|
| OneSearch button | Filling “library QA test” and clicking Search leaves the homepage in place. Console: ReferenceError: doSearch is not defined, at HTMLButtonElement.onclick, live page line 1453. |
| OneSearch Enter | “fermentation” reaches /nde/search?vid=01CLIC_CONCORDIA:NDE&lang=en&search_scope=MyInst_and_CI&query=fermentation and rendered search results. Source starts with legacy /discovery/search and CSP view; the service redirects to NDE. |
| Desktop dropdown | Enter on Find Resources leaves aria-expanded=false and computed dropdown display:none. |
| Mobile dropdown | Main toggle expands; Find Resources expands and exposes its resource links. |
| Fragment targets | #s-lg-guide-main exists; #main-content does not. Three skip links were exposed, including the platform link. |
| Document structure | lang=en; no duplicate IDs in the sampled live document. One visible hero H1, H2 sections, H3 service/news subsections. Another platform H1 exists in hidden chrome; this alone is not a defect. |
| Search keyboard focus | Active element heroSearch had a visible solid 2px outline in the live computed style. Source outline:none must not be reported as an observed live focus failure. |
| Overflow | At effective mobile innerWidth 354: clientWidth 341, scrollWidth 347. At desktop 1280: clientWidth 1265, scrollWidth 1272. Full-bleed wrappers extended beyond the client edge; horizontal scrollbar visible. Exact 320px WCAG reflow test remains open. |
| Images / new windows | Both logo img elements loaded. CSS background images were visually present in the hero; they were not independently HTTP-tested. No live target=_blank link lacked noopener in the sampled DOM. |
| Loaded assets | Platform lg-public-bs535 CSS/JS plus custom Bootstrap 5.3.3 CSS/bundle; Bootstrap Icons 1.11.3; platform Poppins plus Barlow/Barlow Condensed; duplicate appearances of the same GA measurement ID among script URLs. See risks below. |

## Priority and confidence

P1 = correct before release; P2 = resolve or explicitly disposition before release; P3 = improvement.
“Confirmed live” means reproduced in this session. “Confirmed source” means directly supported by the pinned files. “Risk” does not assert a vulnerability or conformance failure.

## Detailed findings

### QA-001 — P1 — Search button fails (confirmed live and source)

Files: libguides/libguides-2-custom-js.js, OneSearch initialization; libguides/libguides-5-box1-hero.html, .hero-search-form.
The box button invokes inline onclick="doSearch()", but doSearch is declared inside the DOMContentLoaded callback and is not global. Enter uses an in-scope listener and works; clicking produces the ReferenceError above. This breaks the homepage’s primary action.

Remediation: replace the inline event with one form submit path bound in JS, used by both button and Enter. Preserve trimming, blank-input handling, query encoding, CSP resource scope, and a meaningful search name. Confirm intended Primo view with the service owner before changing legacy URLs. Mirror any necessary content changes in the reference file according to repository policy.
Acceptance: click, Enter, and Space on focused submit button each yield one equivalent search; blank input stays safely on page; punctuation, ampersands, Unicode, and repeated submissions work without console exceptions.

### QA-002 — P1 — Desktop dropdowns require a pointer (confirmed live and source)

Files: libguides/libguides-2-custom-js.js, nav controller; libguides/libguides-3-header-html.html, cspTriggerFind/Services/About.
The click handler explicitly returns when isDesktop(). Only mouseenter opens desktop panels. Enter activation of Find Resources leaves its panel hidden. Escape support does not compensate for inability to open. WCAG 2.1.1 Keyboard is implicated.

Remediation: use button activation to toggle disclosures at all widths; preserve optional hover enhancement. Keep aria-expanded and visibility synchronized; retain Escape and focus return, and close only after focus leaves the relevant disclosure. These are navigation disclosures, so remove misleading menu-popup semantics unless implementing a full menu pattern.
Acceptance: Tab/Shift+Tab, Enter, Space, Escape, pointer, and touch reach every nav destination at desktop and mobile widths; focus remains visible; panels persist while focus is inside; one open panel at a time.

### QA-003 — P1 — Teal actions fail text contrast (confirmed live/source)

File: libguides/libguides-1-custom-css.css, .cta-teal and .accent-teal .csp-sub-cta / .csp-sub-mobile-cta.
Live research CTA computed text is white at 13.6px over rgb(0,169,163). White on #00A9A3 is approximately **2.92:1**, below 4.5:1 for normal text and even below 3:1 for large text. CIC controls repeat the pairing in source. WCAG 1.4.3.

Remediation: use a verified darker teal action token or a dark text pairing while preserving the accent identity; do not globally darken decorative brand teal without a design decision.
Acceptance: normal, visited, hover, focus, active, and disabled treatment as applicable meet the correct contrast threshold. Record actual computed colors and ratios.

### QA-004 — P1 — Footer text is deliberately too faint (confirmed live/source)

Files: CSS .footer-address, .footer-bottom, .footer-brand p, subsite footer rules; system footer inline Admin styles.
On navy #003055, white at alpha .38 gives about **3.19:1** (address); .30 about **2.51:1** (bottom links/copyright); .20 about **1.83:1** (Admin); .50 about **4.47:1** (brand copy, just below 4.5). Values composite alpha over the solid navy, using WCAG sRGB luminance. The .55 footer links are about 5.10:1 and should not be blanket-labeled failures. WCAG 1.4.3.

Remediation: introduce readable muted-text tokens and remove inline low-opacity overrides and visited rules that restore failing values. Admin can be visually secondary while still readable.
Acceptance: all meaningful footer text and links meet 4.5:1 at their current small sizes, including visited states and subsite counterparts.

### QA-005 — P1 — Invalid skip/back-to-top targets (confirmed live/source)

Files: system header and footer. Both include #main-content, absent from the live DOM. Header additionally duplicates the valid #s-lg-guide-main skip link already supplied by LibGuides. A working platform skip mechanism exists, so this is not a blanket claim that the page offers no bypass mechanism.

Remediation: retain one coherent main-content bypass using the existing platform target; use a real top/header target for Back to top and manage focus appropriately. Avoid creating duplicate IDs or unnecessary duplicate links.
Acceptance: each retained fragment resolves exactly once; keyboard activation reaches useful content and subsequent Tab proceeds appropriately. Check WCAG 2.4.1 and 2.4.3 behavior.

### QA-006 — P2 — Horizontal overflow in full-bleed layout (confirmed live; WCAG failure pending exact test)

File: CSS .s-lg-box-wrapper-hero width:100vw/left:50%/translateX(-50%), hero scale and surrounding platform wrappers.
Measurements and scrollbar described above show content wider than the client viewport. Full-bleed wrappers extended past the right edge in mobile inspection. There is no exact 320px or 400% zoom result, so do not call WCAG 1.4.10 conclusively failed from these measurements alone.

Remediation: calculate full bleed against the available layout width; constrain decorative transforms at the appropriate section boundary. Do not conceal focusable content using a blanket body overflow-x:hidden.
Acceptance: measure document scrollWidth <= clientWidth (allow rounding tolerance of 1px) at 320, 390, 768, 991, 992, 1280, and 1440 CSS pixels; verify 400% zoom and WCAG text-spacing overrides without lost content or two-axis reading.

### QA-007 — P1 — Collapsed subsite navigation retains focusable links (confirmed source; live subsite validation needed)

Files: CSS .csp-sub-collapse; subsites/cic/header.html; subsites/writing/header.html; toggleSubNav().
Closed panels use max-height:0 and overflow:hidden, without hidden/display:none/inert. Their anchors remain in the DOM and default tab sequence. Desktop also has duplicate mobile nav links because the panel is only visually clipped. This risks invisible focus and duplicate navigation (WCAG 2.4.3 / 2.4.7).

Remediation: use a real disclosure visibility mechanism that removes closed content from focus and accessibility trees; synchronize aria-expanded; close/reset consistently across breakpoints. Avoid fixed 480px clipping of expanded text.
Acceptance: Tab cannot enter a closed mobile panel at any breakpoint; expanded links are visible; desktop has one useful link set; 200% text and narrow layouts do not clip the expanded menu. Source Home is-active is hardcoded on all pages: replace with actual current-page state and aria-current during the same work.

### QA-008 — P2 — Extra Bootstrap layer can conflict with platform assets (confirmed asset inventory; behavioral risk)

Files: system header CDN links/script and CSS Bootstrap overrides.
The live page loads platform lg-public-bs535.min.css/js and custom Bootstrap 5.3.3. This confirms overlapping asset layers; the exact contents of the vendor bundle were not unpacked, so duplicate plugin initialization is a risk rather than a proven cause. Main mobile collapse worked in this session.

Remediation: establish the vendor-supported Bootstrap ownership/version and loading order. Test platform components before removing the extra bundle; do not blindly delete a working dependency. Document a single approved compatibility strategy.
Acceptance: one intended collapse transition per action; platform tabs, accordions, modals, guide navigation, A–Z components, and group templates work with no version/initialization errors.

### QA-009 — P2 — Global chrome suppression has broad regression potential (confirmed source)

File: CSS selectors hiding #s-lg-guide-header, breadcrumbs, public navigation/footer, and zeroing all guide .card/.card-body/.card-header boxes.
Rules apply sitewide while homepage sections supply their own context/spacing. Other guide layouts may lose titles, location cues, box hierarchy, and standard navigation. No assertion is made that every guide is currently broken.

Remediation: scope homepage-specific resets to an explicit homepage/root class or guide identifier, and document deliberate global rules. Retain a visible equivalent title/location mechanism on ordinary guides.
Acceptance: compare homepage, multi-page guide, sidebar guide, database list, and each subsite; headings, navigation, box structure, and spacing remain usable.

### QA-010 — P2 — News/events are public developer placeholders (confirmed live/source)

File: libguides-5-box6-news-events.html.
Users see “Latest news ... appears here”, “s-lib-box: Blog / Recent Posts”, and “LibCal events widget”; these are not functioning feeds.
Remediation: supply native widgets or an intentional user-facing empty state; remove implementation instructions from visible content. Provide failure and no-events fallbacks.
Acceptance: populated, empty, slow, and failed feeds render meaningful content; dates/timezones and keyboard behavior verified. No developer placeholder text remains.

### QA-011 — P2 — Time-sensitive claims are hardcoded (confirmed live/source)

Files: header summer-hours announcement; Box 2 Live now badge / 24/7 CTA.
Summer hours remain announced on October 19. This is stale seasonal messaging unless specifically still applicable. “Live now” is static, not backed by a status check. The downstream Primo chat described expert support as 24/7, so the 24/7 claim is not presumed false.
Remediation: verify service wording/availability with owners; expire announcements and use an authoritative status source or neutral copy.
Acceptance: announcement has owner/end date; open/closed/error chat states never falsely claim live availability.

### QA-012 — P2 — Link destinations are inconsistent and incompletely verified (confirmed source; reachability open)

Header Research Guides uses /find/guides; hero/popular use /?b=s&group_id=28452. Brainfuse uses /tutor/brainfuse versus /brainfuse. Database nav uses /find/databases while primary shortcuts use /az.php. Writing’s generic appointment CTA goes to an undergraduate route despite separate graduate support in its subsite source.

Remediation: create a canonical destination inventory and verify final page intent, redirects, authentication, audience eligibility, and query parameters. Do not “repair” a URL simply because its spelling differs.
Acceptance: every unique homepage/header/footer URL has recorded result/date/owner; broken or wrong-intent destinations corrected consistently; no appointment/chat/message submissions required for link testing. Full link crawl was not performed in this session.

### QA-013 — P2 — Production visuals depend on a development asset host (confirmed source/live hero)

Files: CSS .hero-bg, Box 4 card backgrounds, CIC hero, images/.
Images reference main.dy1n2ifa5qdl6.amplifyapp.com. README and CLAUDE.md already identify this as pending migration. This is an availability/ownership risk, not evidence of compromise.
Remediation: move approved images to an institution-controlled permanent asset host; retain source files and image rights/alt rationale; update only canonical paste targets and intended references.
Acceptance: all deployed images load over HTTPS without the dev host, approved crops work across sizes, and no content jump or materially poorer load time occurs. Record dimensions/bytes; consider responsive modern formats for the roughly 508KB hero.

### QA-014 — P2 — Branding documentation no longer matches the current comparison site (confirmed visual comparison)

README describes global.csp.edu as Barlow Condensed with bold all-caps headings. The current site viewed in this session instead displays a broad, mixed-case “One Decision Changes Everything” headline. Both sites retain navy/gold, photography, and strong action hierarchy. This is not proof the library’s Barlow treatment violates an official brand standard.

Remediation: obtain the current approved CSP identity guide/logo assets and decide whether the library follows central CSP, CSP Global, or an approved library variation. Record typography, exact colors, logo clear space/minimum size, and approved teal usage. Prefer an approved navy logo asset to a CSS recoloring filter when available.
Acceptance: brand owner signs off a desktop/mobile comparison; README cites the approved reference/version. Keep research usability ahead of mimicking marketing page density.

### QA-015 — P2 — README sends editors to stale/reference content (confirmed source)

README structure and common-update instructions still point to libguides-5-homepage-content.html for cards/promos. CLAUDE.md says only box1–box6 are pasted and the monolith is a manually synchronized reference. README permits @import, while CLAUDE.md says it is stripped. README estimates CSS limit at 50–100K, versus the documented observed ~59K failure. News guidance refers to Boxes 7/8 although the current implementation has Box 6. CLAUDE.md’s group/system header ordering prose also contradicts itself.

Remediation: reconcile docs into one authoritative field map, explicit canonical files, dependency placement, measured character limit with safety margin, and verified header/group order. Preserve LibGuides-required style wrapper and unwrapped JS instructions.
Acceptance: a new maintainer can perform a dry-run deployment from docs without choosing the monolith, adding @import, or exceeding the field limit.

### QA-016 — P2 — Deployment provenance and regression gates are absent (confirmed repository tree/source)

No automated QA configuration or release manifest appears in the inspected tree. Manual pasting cannot establish which source revision is deployed. Current live search/focus details also show why source-only inference is unsafe.
Remediation: add source-to-admin-field mapping with guide/group IDs, revision/date, operator, content hashes, rollback copies, post-paste truncation check, and milestone QA records. Introduce lightweight validation suited to paste fragments, not a mandatory application build.
Acceptance: each deployed field is traceable; rollback is documented; search/nav/contrast/reflow smoke checks are repeatable. CSS size is measured as characters as well as bytes.

### QA-017 — P2 — Analytics/consent and security headers need administrator verification (risk)

Live script inventory contains GTM and two appearances of GA ID G-1NKPZ4K465. This does not prove double page views or tracking before consent: network request/event and consent-state behavior were not captured. The privacy notice mentions broad tracking categories. No HTTP response-header/cookie inspection was performed.

Remediation: have the platform/analytics owner inventory scripts and purposes, inspect actual events in a fresh consent session, remove unintended duplicate instrumentation, and document retention/access and consent behavior. Inspect CSP, HSTS, framing policy, referrer policy, and cookie flags through real HTTP responses. Coordinate CSP with Springshare; deploy report-only first where supported.
Acceptance: one intended page-view event per navigation, documented consent behavior, no collection of search/form text without an approved purpose, and recorded header/cookie results. Do not report missing headers or exploitable XSS without evidence.

### QA-018 — P3 — Inline handlers and DOM assumptions make maintenance/CSP harder (confirmed source)

System footer uses onmouseover/onmouseout; subsite toggles and search use inline onclick. Nav initializer assumes navbar/backdrop exist and toggleSubNav assumes its target exists. Fixed-origin encoded search navigation is a positive security property; no credential or untrusted HTML sink was identified in the reviewed custom JS.
Remediation: bind events through JS, use CSS pseudo-classes for appearance, guard optional roots/targets, and initialize idempotently. Preserve functioning pages that have no hero or no system nav.
Acceptance: missing optional elements produce no uncaught errors; repeated initialization does not duplicate listeners; CSP rollout does not require unsafe inline event handlers.

### QA-019 — P3 — Decorative icons contaminate accessible link names (confirmed live/source)

Header dropdown icons and several Box 2 chevrons omit aria-hidden. Live accessibility names contain private-use glyphs before Research Guides and after service links.
Remediation: mark decorative icon nodes aria-hidden=true; retain actual text and accessible labels for icon-only controls.
Acceptance: accessible link names contain human-readable intent without meaningless glyphs. Verify with VoiceOver rather than relying only on a DOM tree.

### QA-020 — P3 — Motion and target-size coverage is incomplete (confirmed source; AA outcomes unverified)

CSS contains smooth scrolling, long hero transforms, transitions, and blink animation without a prefers-reduced-motion block. Reduced motion is a useful improvement, not automatically an AA failure for every animation. Some footer links are under 24px high; WCAG 2.5.8 allows spacing and other exceptions, so size alone is not proof of failure.
Remediation: respect reduced-motion settings; measure actual target rectangles and spacing, and keep mobile nav usable with magnification.
Acceptance: reduced-motion preference disables unnecessary movement; targets meet 24×24 CSS pixels or a documented valid exception. Evaluate ongoing animation separately under WCAG 2.2.2 if visible for over five seconds.

## Security assessment limits and positives

This was a passive client/source review: no exploit attempts, credential testing, account changes, automated vulnerability scans, or form submissions that contact staff. HTTPS is used for the reviewed asset/navigation URLs. Bootstrap CSS/JS have integrity and crossorigin attributes. New-window links in the sampled live DOM include noopener. JS encodes the search term and navigates to a fixed origin. No conclusion about backend vulnerabilities, dependency CVEs, SSO, server headers, or cookie security is justified from this review. Pinning Bootstrap 5.3.3 alone does not establish a vulnerability.

## WCAG 2.2 AA coverage ledger

| Area | Current assessment | Required follow-up |
|---|---|---|
| 1.1.1 text alternatives | Logo text available; backgrounds treated as decorative in source | Verify image meanings, failed images, every subsite |
| 1.2 media | No homepage audiovisual player observed | Reassess embedded widgets/media when added |
| 1.3 structure / 3.1 language | Useful visible H1–H3 order; lang=en | Screen-reader landmarks and group templates |
| 1.4.3 contrast | Confirmed failures QA-003/004 | Measure all image-overlay and interaction states |
| 1.4.4 / 1.4.10 / 1.4.12 | Small overflow observed | Exact 320px, 200% text, 400% zoom, text spacing |
| 1.4.11 / 1.4.13 | Not fully tested | Focus/control contrast; hover dismissible/hoverable/persistent |
| 2.1.1 keyboard | Confirmed desktop disclosure failure | Entire page, widgets, group menus |
| 2.2 / 2.3 timing/animation | Source motion noted | Pause/stop applicability and flash check |
| 2.4 navigation/focus | Bad fragment confirmed; live input focus outline present | Full Tab order, sticky obstruction (2.4.11), page titles |
| 2.5.7 / 2.5.8 | No custom dragging observed; targets not fully measured | Spacing/exceptions and third-party widgets |
| 3.2 consistency/help | Help present in nav/footer | Cross-guide/subsite consistency incl. hidden CIC CTAs |
| 3.3 input/authentication | No sign-in or booking process audited | Errors/instructions, redundant entry, accessible authentication |
| 4.1 roles/status | Named controls mostly useful; icon noise and disclosure issues | VoiceOver + Safari, NVDA + Chrome; dynamic status announcements |

## Milestone review gates

1. Initial remediation: QA-001 through QA-007, then repeat search and keyboard tests.
2. Integration milestone: canonical links, widgets, vendor Bootstrap strategy, scoped guide CSS, asset migration, subsite templates.
3. Release candidate: complete the ledger, all unique link checks, current brand approval, manual screen-reader review, responsive matrix, analytics/header verification, and documented rollback.
4. After deployment: compare rendered fields to recorded hashes/revision; rerun critical tasks; record residual issues and owners here.

Primary references: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Bootstrap 5.3 JavaScript](https://getbootstrap.com/docs/5.3/getting-started/javascript/), and the current [CSP Global site](https://global.csp.edu/). These define criteria/reference behavior; they do not substitute for observations of this site.
