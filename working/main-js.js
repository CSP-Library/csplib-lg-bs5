/* ==========================================================================
   CSP Library — Shared Subsite Nav JS
   Paste into: LibGuides Admin → Look & Feel → Custom CSS/JS → Custom JS tab

   Note: LibGuides' Custom JS field expects raw JavaScript (no <script> tags).
   ========================================================================== */

function toggleSubNav(btn, panelId) {
  var panel    = document.getElementById(panelId);
  var expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  panel.classList.toggle('is-open', !expanded);
}

/* Close all mobile panels when the viewport widens past the mobile breakpoint */
window.addEventListener('resize', function () {
  if (window.innerWidth > 767) {
    document.querySelectorAll('.csp-sub-collapse').forEach(function (p) {
      p.classList.remove('is-open');
    });
    document.querySelectorAll('.csp-sub-toggle').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
  }
}, { passive: true });
