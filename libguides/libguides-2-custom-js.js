<script>
/* ═══════════════════════════════════════════════════════════════════
   CSP LIBRARY — CUSTOM JS
   LibGuides Admin → System Settings → Look & Feel → Custom JS/CSS → Custom JS

   INSTRUCTIONS:
   Paste the entire contents of this file into the Custom JS field,
   including the opening and closing <script> tags — LibGuides does
   NOT wrap this field automatically, so the tags have to be pasted in
   manually (same as the Custom CSS field's <style>/</style> wrapper).
   Forgetting them leaves this raw text sitting unexecuted in <head>,
   which browsers then relocate into visible page text at the top of
   <body> — every nav/search/dropdown behavior on the site silently
   stops working, with no console error to flag it.
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── OneSearch ─────────────────────────────────────────────────────
     QA-001: a single submit handler on a real <form> covers button
     click, Enter in the input, and Enter/Space on the focused submit
     button — one code path instead of an inline onclick (which threw
     ReferenceError: doSearch is not defined, since doSearch was scoped
     inside this closure) plus a separate Enter listener. */
  var heroSearchForm = document.getElementById('heroSearchForm');
  var heroSearch     = document.getElementById('heroSearch');
  if (heroSearchForm && heroSearch) {
    heroSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = heroSearch.value.trim();
      if (!q) return;
      window.location.href =
        'https://clic-concordia.primo.exlibrisgroup.com/discovery/search' +
        '?query=any,contains,' + encodeURIComponent(q) +
        '&vid=01CLIC_CONCORDIA:CSP&lang=en&search_scope=MyInst_and_CI';
    });
  }

  /* ─── Subsite nav: mark the current page active (QA-007) ───────────
     Each subsite's header.html is one static fragment pasted into every
     page in that guide group, so "Home" can't be hardcoded is-active in
     the markup — it would show as active on every page, not just Home.
     Compare each link's path against the current page instead. */
  (function () {
    var links = document.querySelectorAll('.csp-sub-link, .csp-sub-mobile-link');
    if (!links.length) return;
    var currentPath = location.pathname.replace(/\/$/, '');
    links.forEach(function (a) {
      if (a.tagName !== 'A') return; /* skip dropdown trigger buttons, which share these classes for styling only */
      var isCurrent = a.pathname.replace(/\/$/, '') === currentPath;
      a.classList.toggle('is-active', isCurrent);
      if (isCurrent) { a.setAttribute('aria-current', 'page'); }
      else { a.removeAttribute('aria-current'); }
    });
  })();

    /* ─── Nav dropdown controller ─────────────────────────────────── */
    (function () {
      'use strict';
      var DESKTOP = 992, DELAY = 120;
      var navbar   = document.getElementById('cspNavbar');
      var backdrop = document.getElementById('cspBackdrop');
      var items    = document.querySelectorAll('.csp-nav-item[id]');
      var openItem = null, closeTimer = null;

      function isDesktop() { return window.innerWidth >= DESKTOP; }
      function getDrop(item) { return item.querySelector('.csp-dropdown'); }
      function getTrig(item) { return item.querySelector('.csp-nav-link'); }

      function open(item) {
        if (!isDesktop()) return;
        clearTimeout(closeTimer);
        if (openItem && openItem !== item) closeNow(openItem);
        var drop = getDrop(item), trig = getTrig(item);
        if (!drop) return;
        openItem = item; item.classList.add('is-open');
        trig.setAttribute('aria-expanded', 'true');
        drop.style.display = 'block';
        backdrop.classList.add('is-shown');
        requestAnimationFrame(function() { requestAnimationFrame(function() {
          drop.classList.add('is-visible'); backdrop.classList.add('is-visible');
        }); });
      }

      function schedule(item) {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function() { closeNow(item); }, DELAY);
      }

      function closeNow(item) {
        if (!item) return;
        var drop = getDrop(item), trig = getTrig(item);
        if (!drop) return;
        item.classList.remove('is-open'); trig.setAttribute('aria-expanded', 'false');
        drop.classList.remove('is-visible'); backdrop.classList.remove('is-visible');
        setTimeout(function() { if (!item.classList.contains('is-open')) drop.style.display = ''; }, 220);
        setTimeout(function() {
          if (!document.querySelector('.csp-nav-item.is-open')) { backdrop.classList.remove('is-shown'); openItem = null; }
        }, 220);
      }

      items.forEach(function(item) {
        var drop = getDrop(item), trig = getTrig(item);
        if (!drop || !trig) return;
        item.addEventListener('mouseenter', function() { if (isDesktop()) open(item); });
        item.addEventListener('mouseleave', function() { if (isDesktop()) schedule(item); });
        drop.addEventListener('mouseenter', function() { clearTimeout(closeTimer); });
        drop.addEventListener('mouseleave', function() { if (isDesktop()) schedule(item); });
        trig.addEventListener('click', function(e) {
          e.preventDefault();
          if (isDesktop()) {
            /* QA-002: click only opens here (never toggles closed) — hover
               already serves mouse users, and toggling closed on click
               would immediately re-close a panel a hover just opened.
               This is also what fires on Enter/Space for a focused
               button, so keyboard users can now open these panels at
               all. Closing is handled by Escape, outside click, and
               focusout below. */
            open(item);
            return;
          }
          if (item.classList.contains('is-open')) { closeNow(item); } else {
            if (openItem) closeNow(openItem);
            openItem = item; item.classList.add('is-open'); trig.setAttribute('aria-expanded', 'true');
            drop.style.display = 'block';
            requestAnimationFrame(function() { requestAnimationFrame(function() { drop.classList.add('is-visible'); }); });
          }
        });
        item.addEventListener('focusout', function(e) {
          /* QA-002: keep the panel open while Tab moves through its own
             links; close only once focus actually leaves this item. */
          if (isDesktop() && item.classList.contains('is-open') && !item.contains(e.relatedTarget)) {
            closeNow(item);
          }
        });
      });

      backdrop.addEventListener('click', function() { if (openItem) closeNow(openItem); });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && openItem) { closeNow(openItem); getTrig(openItem) && getTrig(openItem).focus(); }
      });
      document.getElementById('cspNavCollapse') &&
        document.getElementById('cspNavCollapse').addEventListener('hide.bs.collapse', function() {
          if (openItem) closeNow(openItem);
        });
      window.addEventListener('scroll', function() {
        navbar.classList.toggle('is-scrolled', window.scrollY > 8);
      }, { passive: true });
      window.addEventListener('resize', function() {
        /* QA-002: no stale open panel/ARIA state when crossing the
           desktop/mobile breakpoint in either direction. */
        if (openItem) closeNow(openItem);
      }, { passive: true });
    })();

}); /* end DOMContentLoaded */

/* ─── Subsite nav — mobile disclosure panels ────────────────────────
   QA-007: max-height:0/overflow:hidden alone only visually clips a
   closed panel — its links stay in the tab order and accessibility
   tree (confirmed as both a focus leak and, on desktop, duplicate
   invisible nav links sitting behind the visible desktop link set).
   Each panel now also carries a `hidden` attribute by default; this
   function keeps it in sync with the open/close transition instead
   of relying on max-height to hide it:
     open  — remove hidden immediately, then add .is-open next frame
             so the max-height transition actually animates.
     close — remove .is-open to animate back to 0, then set hidden
             once the max-height transition finishes, so the content
             is unreachable for the whole time it's not visible.
   toggleSubNav (the group's hamburger → .csp-sub-collapse) and
   toggleSubDropdown (a dropdown-capable item's mobile trigger →
   .csp-sub-mobile-dropdown, nested inside that collapse panel) both
   call this. Both names stay in global scope — each is referenced by
   inline onclick in the relevant subsite header.html. */
function toggleDisclosurePanel(btn, panelId) {
  var panel    = document.getElementById(panelId);
  var expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  if (!expanded) {
    panel.hidden = false;
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
  } else {
    panel.classList.remove('is-open');
    /* Closing this panel resets any nested accordion items inside it
       immediately — no transition needed, since they're going inert
       along with their parent anyway — so a parent reopened later
       doesn't resurface a child that's stuck showing as expanded. */
    panel.querySelectorAll('.csp-sub-mobile-dropdown').forEach(function (p) {
      p.classList.remove('is-open');
      p.hidden = true;
    });
    panel.querySelectorAll('.csp-sub-mobile-trigger').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    var onEnd = function (e) {
      if (e.target === panel && e.propertyName === 'max-height') {
        panel.hidden = true;
        panel.removeEventListener('transitionend', onEnd);
      }
    };
    panel.addEventListener('transitionend', onEnd);
  }
}
function toggleSubNav(btn, panelId) { toggleDisclosurePanel(btn, panelId); }
function toggleSubDropdown(btn, panelId) { toggleDisclosurePanel(btn, panelId); }

/* ─── Subsite nav dropdowns — desktop (hover + click) ────────────────
   Operates on .csp-sub-item/.csp-sub-trigger/.csp-sub-dropdown, which
   live inside each subsite's own Custom Header. Independent of the
   system-wide nav controller above — different classes, own state —
   so the two dropdown systems never conflict, even on the same page. */
(function () {
  'use strict';
  var MOBILE = 767, DELAY = 120;
  var items = document.querySelectorAll('.csp-sub-item');
  var openItem = null, closeTimer = null;

  function isDesktop() { return window.innerWidth > MOBILE; }
  function getDrop(item) { return item.querySelector('.csp-sub-dropdown'); }
  function getTrig(item) { return item.querySelector('.csp-sub-trigger'); }

  function open(item) {
    if (!isDesktop()) return;
    clearTimeout(closeTimer);
    if (openItem && openItem !== item) closeNow(openItem);
    openItem = item; item.classList.add('is-open');
    getTrig(item).setAttribute('aria-expanded', 'true');
  }

  function schedule(item) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () { closeNow(item); }, DELAY);
  }

  function closeNow(item) {
    if (!item) return;
    item.classList.remove('is-open');
    getTrig(item).setAttribute('aria-expanded', 'false');
    if (openItem === item) openItem = null;
  }

  items.forEach(function (item) {
    var drop = getDrop(item), trig = getTrig(item);
    if (!drop || !trig) return;
    item.addEventListener('mouseenter', function () { if (isDesktop()) open(item); });
    item.addEventListener('mouseleave', function () { if (isDesktop()) schedule(item); });
    trig.addEventListener('click', function (e) {
      /* QA-002, applied here too: click/Enter/Space only opens — never
         toggles closed, so it can't immediately re-close a hover-opened
         panel. Closing is Escape, outside click, or focusout below. */
      e.preventDefault();
      if (isDesktop()) open(item);
    });
    item.addEventListener('focusout', function (e) {
      if (isDesktop() && item.classList.contains('is-open') && !item.contains(e.relatedTarget)) {
        closeNow(item);
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (openItem && !openItem.contains(e.target)) closeNow(openItem);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openItem) {
      var trig = getTrig(openItem);
      closeNow(openItem);
      trig && trig.focus();
    }
  });
})();

/* Close all subsite mobile panels when the viewport widens past mobile,
   and reset desktop dropdown state when it narrows into mobile */
window.addEventListener('resize', function () {
  if (window.innerWidth > 767) {
    /* Hard reset, not animated: set hidden directly rather than waiting
       on a transitionend that a resize-triggered close may never fire. */
    document.querySelectorAll('.csp-sub-collapse').forEach(function (p) {
      p.classList.remove('is-open');
      p.hidden = true;
    });
    document.querySelectorAll('.csp-sub-toggle').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.csp-sub-mobile-dropdown').forEach(function (p) {
      p.classList.remove('is-open');
      p.hidden = true;
    });
    document.querySelectorAll('.csp-sub-mobile-trigger').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
  } else {
    document.querySelectorAll('.csp-sub-item.is-open').forEach(function (i) {
      i.classList.remove('is-open');
    });
    document.querySelectorAll('.csp-sub-trigger').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
  }
}, { passive: true });
</script>
