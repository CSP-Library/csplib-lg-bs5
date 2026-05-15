# CSP Library Website Redesign
### Library & Academic Support Services — Concordia University, St. Paul

Bootstrap 5.3 redesign of the CSP Library website, built on top of Springshare's **LibGuides** platform. This repository contains all deployment-ready code for the site-wide header, footer, custom CSS/JS, and homepage content, along with reference mockup files and optimized image assets.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Design System](#design-system)
4. [LibGuides Deployment](#libguides-deployment)
5. [File Reference](#file-reference)
6. [Navigation Architecture](#navigation-architecture)
7. [Homepage Content Boxes](#homepage-content-boxes)
8. [Images](#images)
9. [How To: Common Updates](#how-to-common-updates)
10. [LibGuides Platform Notes](#libguides-platform-notes)
11. [Known Considerations](#known-considerations)

---

## Project Overview

The redesign replaces the existing Bootstrap 3 LibGuides theme with a Bootstrap 5.3 implementation that:

- Matches the visual language of **global.csp.edu** (Barlow Condensed display type, bold all-caps headings, navy/gold palette, full-bleed photo sections)
- Introduces a **Stripe-style mega-menu** primary navigation with hover-triggered dropdowns
- Establishes a **federated subsite navigation pattern** (Pattern 2) for semi-independent guide groups such as the Writing Center, CIC, and Archives
- Provides a full-bleed **hero section** with integrated OneSearch, plus a **feature bar** for promoting tools and services
- Is structured for clean handoff to LibGuides' Custom Header/Footer/CSS/JS fields

**Live dev preview:** https://library.csp.edu/bs5home?bs5=1

---

## Repository Structure

```
csp-library-website/
│
├── README.md
│
├── libguides/                          # Files that go directly into LibGuides admin
│   ├── libguides-1-custom-css.css      → Admin → Look & Feel → Custom JS/CSS → Custom CSS
│   ├── libguides-2-custom-js.js        → Admin → Look & Feel → Custom JS/CSS → Custom JS
│   ├── libguides-3-header-html.html    → Admin → Look & Feel → Header & Footer → Header
│   ├── libguides-4-footer-html.html    → Admin → Look & Feel → Header & Footer → Footer
│   └── libguides-5-homepage-content.html → Homepage guide → individual content boxes
│
├── working/                          # Various working and reference files
│
└── images/                             # Web-optimized image assets
    ├── csp-library-hero.jpg            # Homepage hero (1800×1200px, ~496KB)
    ├── csp-library-card-cic.jpg        # CIC card (900×600px, ~64KB)
    ├── csp-library-card-archives.jpg   # Archives card (900×600px, ~129KB)
    └── csp-library-card-itdesk.jpg     # IT Help Desk card (900×600px, ~105KB)
```

---

## Design System

### Color Tokens

All colors are defined as CSS custom properties in `:root` inside `libguides-1-custom-css.css`. To retheme the site, edit values here — they propagate everywhere.

| Token | Value | Usage |
|---|---|---|
| `--csp-navy` | `#003055` | Primary brand color, nav, headings |
| `--csp-navy-80` | `#1A496D` | Hover states, darker accents |
| `--csp-navy-60` | `#4A6889` | Subheadings, muted text |
| `--csp-navy-40` | `#7A8FAA` | Disabled states, placeholder text |
| `--csp-navy-20` | `#B3BDCE` | Borders, dividers |
| `--csp-navy-10` | `#dce4ec` | Light backgrounds, icon tiles |
| `--csp-gold` | `#E6B222` | Primary accent, CTAs, active indicators |
| `--csp-gold-hover` | `#c99c1a` | Gold hover state |
| `--csp-gold-light` | `#F9EBCE` | Hover backgrounds, subtle highlights |
| `--csp-gold-mid` | `#EFCC7D` | Eyebrows, secondary gold text |
| `--csp-teal` | `#00A9A3` | Research Assistance accent |
| `--csp-teal-hover` | `#007f7b` | Teal hover state |
| `--csp-gray` | `#E1E8EC` | Page gray (brand PMS 656C) |
| `--csp-page-bg` | `#f5f4f2` | Page body background (warm off-white) |

### Typography

| Variable | Value | Usage |
|---|---|---|
| `--font-display` | `'Barlow Condensed'` | All headings, nav labels, CTAs, eyebrows |
| `--font-body` | `'Barlow'` | Body copy, descriptions, nav links |

Both loaded from Google Fonts via `@import` at the top of the CSS file, or via `<link>` tags in the Header HTML.

### Nav Logo

The nav uses the white CSP Library logo with a CSS filter to convert it to navy:
```css
filter: brightness(0) saturate(100%) invert(11%) sepia(85%)
         saturate(1088%) hue-rotate(190deg) brightness(97%) contrast(101%);
```
To use the blue PNG file instead: upload `CSP_Library-02.png` to LibGuides Admin → Files, copy the URL, replace the `<img src>` in the Header HTML, and remove the filter rule from the CSS.

The footer logo uses `filter: brightness(0) invert(1)` to render it white on the navy footer background.

---

## LibGuides Deployment

### Prerequisites

- LibGuides BS5 must be enabled (Admin → Look & Feel → Bootstrap 5 Transition Tool)
- The site must be in or switching to BS5 mode

### Step-by-step deployment

#### 1. Custom CSS
**Admin → System Settings → Look & Feel → Custom JS/CSS → Custom CSS**

Paste the full contents of `libguides-1-custom-css.css`.

> **Important:** The CSS file references the hero background image by URL. If the image URL changes, find the line containing `.hero-bg` and update the `background-image: url(...)` value.

> **LibGuides Content Customizations setting:** Go to Admin → Look & Feel → Content Customizations → Boxes and set:
> - Background Color: `#f5f4f2`
> - Header Background Color: `#f5f4f2`
> - Border Width: `0`
>
> This prevents LibGuides' white box background from showing through in gaps between content sections.

#### 2. Custom JS
**Admin → System Settings → Look & Feel → Custom JS/CSS → Custom JS**

Paste the full contents of `libguides-2-custom-js.js`. Do **not** include `<script>` tags — LibGuides wraps the contents automatically.

#### 3. Header HTML
**Admin → System Settings → Look & Feel → Header & Footer → Header**

Paste the full contents of `libguides-3-header-html.html`. This loads Bootstrap 5.3, Bootstrap Icons, Google Fonts, and renders the announcement bar and primary navigation.

#### 4. Footer HTML
**Admin → System Settings → Look & Feel → Header & Footer → Footer**

Paste the full contents of `libguides-4-footer-html.html`.

The LibGuides default footer (`#s-lib-footer-public`) is hidden via CSS. Our custom footer includes a low-visibility Admin login link (`/libapps/login.php`) to the right of "Back to top."

#### 5. Homepage Guide Content
**Homepage guide → individual Rich Text/HTML boxes**

See [Homepage Content Boxes](#homepage-content-boxes) section for the full box-by-box breakdown.

#### 6. Suppress the default LibGuides nav
The CSS already includes:
```css
#s-lib-public-nav { display: none !important; }
```
This hides LibGuides' built-in navigation globally.

#### 7. Hide guide title bar and breadcrumbs
The CSS hides the guide title/breadcrumb bar that appears on guide pages:
```css
#s-lg-guide-header-info,
#s-lg-guide-info,
#s-lg-bc { display: none !important; }
```
If CSS alone doesn't suppress these, change the guide's template to a **"No Header"** layout under Guide Settings → Template.

---

## File Reference

### `libguides-1-custom-css.css`
The complete site stylesheet. Contains:
- CSS custom property token definitions (`:root`)
- Bootstrap overrides
- Nav and dropdown styles
- Hero, feature bar, and all page section styles
- Footer styles
- LibGuides chrome suppression rules (nav, footer, guide header, box borders/padding)
- Full-bleed section escape rules (`.s-lg-box-wrapper-hero`)

### `libguides-2-custom-js.js`
The nav dropdown controller and OneSearch handler. Contains:
- `doSearch()` — submits the hero search bar to the Ex Libris Primo discovery layer
- Nav dropdown controller — handles hover open/close with grace period, keyboard navigation (ESC), mobile toggle fallback, and scroll shadow on the navbar
- Wrapped in `DOMContentLoaded` to avoid timing conflicts with LibGuides' own scripts

### `libguides-3-header-html.html`
Site-wide header. Contains:
- CDN `<link>` tags for Bootstrap 5.3 CSS, Bootstrap Icons, and Google Fonts
- Bootstrap 5.3 JS bundle (loaded in the header since LibGuides has no reliable end-of-body injection point)
- Accessibility skip link
- Announcement bar (gold strip — edit text or set `display:none` to hide)
- Backdrop overlay div for dropdown dimming
- Full primary navigation with three dropdown menus and two CTA buttons

### `libguides-4-footer-html.html`
Site-wide footer. Contains:
- 4-column grid: brand/address/social | Find Resources links | Services links | Contact
- Admin login link (low-opacity, hover-visible)
- "Back to top" link targets `#s-lg-guide-main` (LibGuides' native main content anchor)

### `libguides-5-homepage-content.html`
Homepage guide content, organized as copy-paste sections for individual LibGuides boxes. See [Homepage Content Boxes](#homepage-content-boxes) for the full section map.

---

## Navigation Architecture

### Primary nav (parent site)

Three dropdown triggers:

| Menu | Type | Contents |
|---|---|---|
| Find Resources | Simple dropdown | Research Guides, OneSearch, Databases, Journals, Newspapers, Ebooks, Archives |
| Services | **Mega menu** (4 columns) | Library Support / Tutoring & Writing / Faculty Support / Other Services |
| About | Simple dropdown | Contact, Staff, News & Updates, Policies |

Plus two CTA buttons: **Hours** (ghost/outlined) and **Get Help** (filled navy).

The mega menu anchors to `.container` via `position: static` on the Services `<li>`, allowing it to span the full container width while simple dropdowns anchor to their own `<li>`.

### Subsite navigation (Pattern 2)

Defined in `csp-subsite-nav-pattern2.html`. Each semi-independent guide group (Writing Center, CIC, Archives) gets its own compact nav bar featuring:
- **Parent crumb** — small CSP Library logo + "CSP Library" label with a left-pointing chevron; links back to library.csp.edu/home
- **Subsite identity** — colored icon tile + subsite name
- **Local nav links** — section links for that guide group
- **Subsite CTA** — primary action specific to that subsite (e.g., "Make an Appointment" for Writing Center)
- **Mobile toggle** — collapses links with a CSS `max-height` transition; CTA anchors at bottom of the collapsed panel

Each subsite uses one of three accent variants applied via a class on the `<nav>` element:
- `accent-teal` — CIC
- `accent-gold` — Writing Center
- `accent-navy` — Archives

To deploy: paste the subsite `<nav>` block into the guide group's **Custom Header** field (Admin → LibGuides → Groups → [Group] → Look & Feel → Header).

---

## Homepage Content Boxes

The homepage guide uses a **1-column, no-sidebar layout**. All boxes should have **Floating Box checked** in the Edit Box dialog.

| Box # | Internal name | Content | Full-bleed? |
|---|---|---|---|
| 1 | Homepage Hero | Hero section + Feature bar | ✓ wrap in `<div class="s-lg-box-wrapper-hero">` |
| 2 | Core Services | Research Assistance / Tutoring / Writing Center cards | — |
| 3 | Audience Selector | "I'm a…" pill navigation | ✓ wrap in `<div class="s-lg-box-wrapper-hero">` |
| 4 | More at the Library | CIC / Archives / IT Help Desk image cards | ✓ wrap in `<div class="s-lg-box-wrapper-hero">` |
| 5 | Popular Resources | 8-item quick-link grid | — |
| 6 | News & Events | Two-column layout | ✓ wrap in `<div class="s-lg-box-wrapper-hero">` |
| 7 | Library News | **Native LibGuides Blog box** | — |
| 8 | Upcoming Events | **Native LibCal Events widget** | — |

### Full-bleed wrapper

Boxes 1, 3, 4, and 6 need their content wrapped in:
```html
<div class="s-lg-box-wrapper-hero">
  <!-- section HTML here -->
</div>
```
This escapes LibGuides' content column constraint using `width: 100vw; position: relative; left: 50%; transform: translateX(-50%)`.

### Restoring hero status tiles

The hero currently shows a centered single-column layout without the at-a-glance status tiles (hours, chat, tutoring). To restore them, find the `.hero-inner` div in Box 1 and add:
```html
style="max-width:1200px; display:grid; grid-template-columns:1fr 300px; gap:48px 64px; align-items:start; padding:72px 24px 60px;"
```
Then re-add the `<aside class="hero-stats">` block after the `</nav>` at the bottom of the left column.

### Swapping the feature bar promo

Replace only the contents of `.feature-bar-inner` in Box 1. The shell, layout, and CSS stay the same. Current promo: **OneSearch Research Assistant**.

---

## Images

All images are stored in the `images/` directory and hosted externally for LibGuides compatibility (LibGuides' Custom CSS field has a character limit that prevents data URI embedding).

| File | Dimensions | Size | Used in | Current URL |
|---|---|---|---|---|
| `csp-library-hero.jpg` | 1800×1200px | 496KB | Hero background | `https://main.dy1n2ifa5qdl6.amplifyapp.com/csp-library-hero.jpg` |
| `csp-library-card-cic.jpg` | 900×600px | 64KB | CIC card | `https://main.dy1n2ifa5qdl6.amplifyapp.com/csp-library-card-cic.jpg` |
| `csp-library-card-archives.jpg` | 900×600px | 129KB | Archives card | `https://main.dy1n2ifa5qdl6.amplifyapp.com/csp-library-card-archives.jpg` |
| `csp-library-card-itdesk.jpg` | 900×600px | 105KB | IT Help Desk card | `https://main.dy1n2ifa5qdl6.amplifyapp.com/csp-library-card-itdesk.jpg` |

> **Note:** Current image URLs point to an Amplify dev deployment (`main.dy1n2ifa5qdl6.amplifyapp.com`). These should be migrated to a permanent host — LibGuides file assets (`libapps.s3.amazonaws.com/customers/955/images/`) is the recommended location. To update: upload each image via Admin → Files, copy the URL, and update the corresponding reference in the CSS (hero) or homepage content HTML (cards).

### Updating the hero image

1. Add the new image to `images/` at 1800px wide, JPEG quality ~78
2. Upload to LibGuides file assets
3. In `libguides-1-custom-css.css`, find `.hero-bg` and update `background-image: url(...)`
4. Adjust `background-position` if needed (currently `center 45%`)
5. Adjust the overlay gradient opacity in `.hero-overlay` if the image has different brightness characteristics

### Updating card images

1. Add images to `images/` at 900×600px, JPEG quality ~80
2. Upload to LibGuides file assets
3. In `libguides-5-homepage-content.html`, find the relevant `.more-card-bg` div and update its `background-image` inline style

---

## How To: Common Updates

### Change the announcement bar text
In `libguides-3-header-html.html`, find:
```html
<div class="announcement-bar" ...>
```
Update the text inside. To hide it entirely, change `style="display:block"` to `style="display:none"`.

### Add or change a nav dropdown item
In `libguides-3-header-html.html`, find the relevant dropdown section (Find Resources, Services mega menu, or About) and add/edit `<a class="csp-dropdown-item">` or `<a class="csp-mega-link">` elements.

### Change nav CTA button labels or URLs
In `libguides-3-header-html.html`, find the two `<li>` elements near the bottom of `<ul class="navbar-nav">`:
```html
<a class="csp-btn-ghost" href="...">Hours</a>
<a class="csp-btn-primary" href="...">Get Help</a>
```

### Update footer contact info
In `libguides-4-footer-html.html`, find the Contact column (4th grid column) and update phone, email, and hours links.

### Swap the feature bar promo
In `libguides-5-homepage-content.html` (Box 1), find `<div class="feature-bar-inner">` and replace its contents. Keep the wrapper div — only replace what's inside.

### Add a new subsite nav
1. Copy one of the existing subsite `<nav>` blocks from `csp-subsite-nav-pattern2.html`
2. Choose or create an accent class (`accent-teal`, `accent-gold`, `accent-navy`, or add a new one with 5 CSS rules)
3. Update the subsite name, icon, links, and CTA
4. Paste into the guide group's Custom Header field

### Update brand colors
Edit the `:root` token block at the top of `libguides-1-custom-css.css`. Official CSP brand values:
- University Navy `#003055` (PMS 540)
- Comet Gold `#E6B222` (PMS 110)
- Seafoam Green `#00A9A3` (PMS 7467C)
- Gray `#E1E8EC` (PMS 656C)

---

## LibGuides Platform Notes

### BS5 transition
The site is built for LibGuides **Bootstrap 5** mode. The BS5 Transition Tool (Admin → Look & Feel → Bootstrap 5 Transition Tool) allows previewing BS5 changes before going live. Current dev URL appends `?bs5=1` to force BS5 rendering.

### Custom CSS character limit
LibGuides' Custom CSS field has a character limit of approximately 50,000–100,000 characters. Avoid embedding images as base64 data URIs in the CSS — use hosted URLs instead.

### Box settings
Every homepage content box should have:
- **Floating Box** ✓ — removes LibGuides' default border, padding, and title chrome
- **Draft Mode** unchecked when ready to go live

### Content Customizations (Boxes panel)
**Admin → Look & Feel → Content Customizations → Boxes:**
- Background Color: `#f5f4f2`
- Header Background Color: `#f5f4f2`
- Border Width: `0`

This setting controls LibGuides' inline box background, which CSS cannot reliably override.

### Guide title bar
Hidden via CSS on the homepage. If it persists, change the guide template to a **"No Header"** layout under Guide Settings → Template. To re-enable on specific guides:
```css
body.s-lib-guide-GUIDEID #s-lg-guide-header-info { display: block !important; }
```

### Subsite guide groups
Each guide group has its own Look & Feel settings under Admin → LibGuides → Groups. The subsite nav goes in the group-level Custom Header, not the system-level header.

---

## Known Considerations

- **Amplify image URLs** — Hero and card images are currently hosted on a dev Amplify deployment. These should be migrated to a permanent host before going live.
- **LibCal hours API** — The hero status tiles (when re-enabled) currently show static text. These can be made live by calling the LibCal hours API and LibAnswers/LibChat status endpoints.
- **News & Events boxes** — Boxes 7 and 8 use native LibGuides Blog and LibCal widget types. The `libguides-5-homepage-content.html` file includes styled placeholder divs for these; in production, replace them with the native LibGuides box types.
- **Admin login link** — Points to `/libapps/login.php`. Verify this is the correct path for your LibApps instance.
- **Announcement bar** — Currently set to `display:block` with summer hours messaging. Set to `display:none` when no announcement is active.
- **Microsoft Entra ID / Azure AD SSO** — The nav's "Get Help" and related buttons use direct LibGuides URLs. If SSO is configured, some URLs may need updating to route through the SSO flow.
