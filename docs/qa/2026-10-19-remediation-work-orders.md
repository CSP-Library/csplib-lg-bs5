# AI-agent remediation work orders

Baseline: [2026-10-19 audit](2026-10-19-baseline-audit.md), source f66ccfa556c42a7965f40eb2d17626713cc6b1d1.
These instructions describe future work; **no implementation fixes were made by this audit**.

## Operating contract for the remediation agent

- Work only on updates, or a dedicated remediation branch based on updates if the owner requests one. Never modify main.
- Before editing, read README.md and CLAUDE.md, inspect current branch status, and compare the current source against the pinned baseline. Findings are not permission to overwrite newer changes.
- Canonical homepage targets are libguides/libguides-5-box1 through box6. The monolithic libguides-5-homepage-content.html is reference-only; repository policy currently requires manually mirroring relevant changes there. Never paste that reference as a replacement for individual boxes.
- Respect the existing static/paste deployment model. Do not introduce a framework/build requirement, unrequested redesign, vendor replacement, or unrelated cleanup.
- Preserve the CSS file's literal style wrappers required by this LibGuides setup; keep Custom JS free of script wrappers. No CSS @import. Maintain a conservative margin below the locally documented approximately 59K-character Admin-field cutoff; measure characters and bytes and verify closing style tag after paste.
- Repository edits and LibGuides deployment are separate operations. Do not paste into sitewide Admin fields without authorization for that deployment. Public dev preview does not make global settings isolated.
- Do not fabricate service hours, canonical paths, brand approvals, API endpoints, guide/group IDs, or consent/legal decisions. Record owner-dependent items as blocked with a specific question.
- Maintain a findings register under docs/qa/ with status, changed paths, commit, evidence, residual risks, and post-deployment result. A source fix alone is “implemented, deployment verification pending,” not “verified fixed.”
- Use existing public test terms only. Do not submit chat, appointment, email, contact, or account forms to test navigation.

## Work packages

### W1 — Restore search submission (QA-001)

Allowed implementation files: libguides/libguides-2-custom-js.js and libguides/libguides-5-box1-hero.html; mirror relevant reference markup.
Dependency: none.

1. Replace the search div/inline onclick coupling with a semantic form and submit button, preserving role/name and the existing visual class.
2. Bind one submit handler scoped to that form after DOM readiness. Prevent default only for the controlled search path. Remove the separate Enter listener to avoid duplicate navigation.
3. Trim input; handle whitespace-only values without navigation. Preserve encodeURIComponent or URLSearchParams encoding and the approved fixed Primo origin.
4. Keep the existing view/scope initially; verify whether the service owner prefers the direct NDE destination before changing URL semantics. Legacy Enter currently works by redirecting to NDE.
5. Make initialization safe on pages without the hero and avoid exposing a global doSearch merely to perpetuate an inline handler.

Acceptance: button click, Enter in input, and Enter/Space on submit all navigate once to equivalent results. Test fermentation; an ampersand; an apostrophe; non-ASCII text; leading/trailing spaces; blank; and repeated activation. Capture final URL and console result. If URL fallback without JS is implemented, verify it actually produces a correct Primo query rather than assuming ordinary form serialization matches legacy syntax.

### W2 — Repair navigation disclosures (QA-002, QA-007, QA-019)

Allowed files: system JS/header/CSS, CIC and Writing headers; update documentation describing behavior.
Dependencies: none; coordinate CSS with W3/W4.

1. Use native buttons with aria-expanded and aria-controls; toggle on click regardless of viewport. Enter/Space should work through button semantics.
2. Keep pointer hover as optional enhancement. Ensure focus stays in an opened disclosure while Tab traverses links; focusout should close only when focus leaves that disclosure.
3. Preserve Escape close/focus return, outside-click behavior, and one-open-panel policy. Handle rapid open/close timers and breakpoint changes without stale display or ARIA state.
4. Use navigation disclosure semantics. Do not use aria-haspopup=true to promise a menu widget unless the associated menu roles and keyboard model are intentionally implemented.
5. For subsite panels, use hidden or an equivalent tested mechanism to remove closed anchors from tab order and accessibility tree. max-height:0 is insufficient. Account for desktop versus mobile link sets and prevent 480px content clipping at enlarged text.
6. Set current navigation from the actual destination, with aria-current=page where appropriate; do not label Home active throughout a group.
7. Guard absent nav/backdrop/panel elements. Remove decorative glyphs from accessible names with aria-hidden.

Acceptance matrix:

| Mode | Required actions |
|---|---|
| Desktop keyboard | Open every trigger with Enter and Space; Tab through links; reverse with Shift+Tab; Escape restores trigger focus |
| Desktop pointer | Hover remains dismissible/hoverable/persistent where used; click and outside-click agree with expanded state |
| Touch at desktop width | Buttons open without hover support |
| Mobile | Main collapse and each disclosure open/close; no invisible links; closing parent clears child state |
| Resize | Open menus across 767/768 and 991/992 boundaries; no hidden focus or stale expanded values |
| Subsites | Closed panel absent from traversal, current page accurately marked, enlarged text fits |

### W3 — Correct color contrast and fragment navigation (QA-003/004/005)

Allowed files: system CSS/header/footer, subsite CSS rules; mirror any changed reference markup.
Dependencies: none.

1. Add purpose-specific accessible action/muted-text tokens. Keep decorative brand colors available.
2. Replace white-on-#00A9A3 CTA text pairing and all failing small-text opacity values. The measured footer .55 links pass; avoid unnecessary changes to them.
3. Remove inline Admin color and mouse handlers; use a readable base style with CSS hover/focus states.
4. Test visited rules and actual alpha compositing; a hover-only repair does not repair the default state.
5. Reconcile redundant skip links with the platform-provided link. Link main bypass to #s-lg-guide-main, and Back to top to a real top/header target with sensible focus behavior.
6. Keep the live search input outline working. Source outline:none does not prove a current live failure because platform rules supply an outline; explicitly preserving reliable focus styles is prudent.

Acceptance: 4.5:1 normal text; 3:1 large text where applicable; 3:1 relevant control/focus boundaries under 1.4.11. Record foreground/background/font size and state. Verify all fragment targets and keyboard destinations in the composed LibGuides DOM. Do not claim that WCAG 2.4.13 Focus Appearance is AA; it is AAA.

### W4 — Reflow and platform isolation (QA-006/008/009/020)

Allowed files: CSS/system header; platform dependency changes require evidence and compatibility notes.
Dependencies: W2 menu behavior should be stable before final responsive verification.

1. Find the precise overflow owner using bounding boxes and scrollWidth/clientWidth. Fix full-bleed width/offsets and contain decorative hero scaling within its visual section.
2. Avoid global overflow clipping that masks focus/content. Check long unbroken URLs, search minimum width, nav wrapping, card grids, and subsite name truncation.
3. Scope homepage chrome resets to the homepage root/guide identity. Inventory other guide templates before retaining global hiding and card resets.
4. Confirm vendor Bootstrap ownership/version with Springshare documentation/support or actual bundle inspection. The platform bs535 filename alone is not proof of exact plugin contents.
5. Test a candidate single-load strategy in an isolated preview before removing custom CDN assets. Preserve native components and document loading order.
6. Add prefers-reduced-motion behavior for smooth scrolling and decorative animations. Assess ongoing visible blinking separately.

Acceptance: widths 320, 390, 768, 991, 992, 1280, 1440; 200% text; 400% zoom; text-spacing overrides; portrait/landscape; desktop and subsite menus. Log actual CSS dimensions. No two-axis reading, clipped controls, or hidden focus. Include ordinary/multi-page/sidebar guides, A–Z list, tabs, accordion and modal if used. Target rectangles satisfy 24px minimum or documented WCAG 2.5.8 exceptions.

### W5 — Complete content and destinations (QA-010/011/012/013)

Allowed files: relevant six boxes, header/footer, image references; new docs inventories.
Dependencies: service owners provide current claims and approved destinations; Admin deployment separately authorized.

1. Produce a table of every unique href with source location, label, intended task/audience, final destination, redirect/auth behavior, checked date, and owner.
2. Specifically reconcile Research Guides, Databases, Brainfuse, undergraduate/graduate writing support, and CSP/NDE view URLs. Do not equate redirects with failures or successful HTTP responses with correct page intent.
3. Replace news/event placeholders with native integrations or approved user-facing empty states. Test populated, empty, slow, and failed states; remove code labels from public content.
4. Replace/expire the October summer announcement after verifying the actual intended message. Make live availability authoritative or use neutral text.
5. Migrate Amplify-hosted imagery to the approved permanent host; update CSS, Box 4, CIC hero, and intended references. Preserve originals; record dimensions, size, ownership and decorative/informational rationale.
6. Ensure user-facing task labels match destinations. An all-audience writing CTA should not silently imply that an undergraduate appointment is the only support option.

Acceptance: every unique nav/home/footer URL verified for purpose; no visible developer placeholders; no unsupported status promises; no dev-host dependency in deployed visuals; accessible feed states.

### W6 — Reconcile branding and maintainer documentation (QA-014/015/016)

Allowed files for future work: README.md, CLAUDE.md, docs/; implementation changes only after design decision.
Dependencies: brand owner decision.

1. Obtain the approved brand reference/version. Present current library versus central/global examples, including type case/width, logo treatment, colors, imagery, and CTA hierarchy. Current global.csp.edu differs from the README's claimed condensed all-caps reference.
2. Record approved variation rather than silently switching the site to a new visual identity.
3. Make README map box1–box6 correctly; replace misleading monolith edit instructions, @import advice, 50–100K cutoff estimate, and Box 7/8 feed references.
4. Resolve header/group order contradiction through a real composed page; record actual order and inheritance assumptions.
5. Add a release manifest template: source commit, each field/guide/group identifier, deployment timestamp/operator, text hash/length, rollback location, dependencies/version, and post-paste closing-tag check.
6. Add a lightweight QA checklist/validation path appropriate to fragment files. CSS has intentional style wrappers: do not “fix” it simply to satisfy a raw CSS parser.

Acceptance: maintainers can identify one canonical file per field; docs show the actual deployment model, rollback, size limit and known subsite migration status; brand decision has an owner/date.

### W7 — Platform security, privacy, and assistive-technology closure (QA-017/018 and coverage ledger)

Owners: platform/analytics administrators plus accessibility reviewer. No unapproved security-policy changes.
Dependencies: stable release candidate.

1. Inventory actual tracking requests and consent states in a clean browser session. Inspect GTM/GA configuration before declaring duplicate analytics. Record event counts and ensure search/form text is not unintentionally captured.
2. Inspect HTTP headers and cookies directly. Record CSP/HSTS/framing/referrer policy and Secure/HttpOnly/SameSite as applicable, separating vendor-controlled settings from custom code.
3. Plan CSP report-only validation with Springshare; do not add a strict policy blindly to a multi-vendor page. Remove inline handlers in custom code where practical.
4. Verify VoiceOver/Safari and NVDA/Chrome flows for headings, landmarks, search, nav, feeds, status messages, magnification and focus. Browser accessibility snapshots do not replace this.
5. Review linked authentication/booking processes for WCAG 3.3.7/3.3.8 with authorized testers; the homepage audit does not certify downstream services.
6. Evaluate all newly added widgets for accessibility, privacy, load failure, and performance.

Acceptance: evidence-backed header/analytics findings, assigned vendor limitations, no unsupported security assurances, and completed WCAG ledger or explicit residual blockers.

## Completion record template

For each QA ID record:

- Status: open / owner decision / implemented / deployed awaiting verification / verified / accepted risk.
- Current source SHA and changed paths.
- Actual reproduced result before and after.
- Browser, effective viewport, assistive technology where relevant.
- Source tests and live post-paste tests separately.
- Evidence location, owner, verification date, and remaining constraints.

## Release decision

Close all P1 findings, disposition P2 findings with accountable owners, complete the baseline coverage ledger, and verify the deployed field manifest before recommending launch. Do not mark this baseline “passed” because documents were committed or because an automated scanner reports no issues.
