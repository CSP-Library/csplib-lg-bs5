/* ═══════════════════════════════════════════════════════════════════
   CSP LIBRARY — CUSTOM JS
   LibGuides Admin → System Settings → Look & Feel → Custom JS/CSS → Custom JS
   ═══════════════════════════════════════════════════════════════════

   INSTRUCTIONS:
   Paste the entire contents of this file into the Custom JS field.
   Do NOT include script tags — paste only the JavaScript itself.
   LibGuides wraps this in its own script block automatically.
════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── OneSearch ─────────────────────────────────────────────────── */
  var heroSearch = document.getElementById('heroSearch');
  if (heroSearch) {
    function doSearch() {
      var q = heroSearch.value.trim();
      if (!q) return;
      window.location.href =
        'https://clic-concordia.primo.exlibrisgroup.com/discovery/search' +
        '?query=any,contains,' + encodeURIComponent(q) +
        '&vid=01CLIC_CONCORDIA:CSP&lang=en&search_scope=MyInst_and_CI';
    }
    heroSearch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doSearch();
    });
  }

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
          if (isDesktop()) return;
          e.preventDefault();
          if (item.classList.contains('is-open')) { closeNow(item); } else {
            if (openItem) closeNow(openItem);
            openItem = item; item.classList.add('is-open'); trig.setAttribute('aria-expanded', 'true');
            drop.style.display = 'block';
            requestAnimationFrame(function() { requestAnimationFrame(function() { drop.classList.add('is-visible'); }); });
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
    })();

}); /* end DOMContentLoaded */

/* ─── Subsite nav ─────────────────────────────────────────────────
   toggleSubNav is called via inline onclick on each group's mobile
   toggle button. Must stay in global scope. */
function toggleSubNav(btn, panelId) {
  var panel    = document.getElementById(panelId);
  var expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  panel.classList.toggle('is-open', !expanded);
}

/* ─── Subsite nav dropdowns — mobile accordion ──────────────────────
   toggleSubDropdown is called via inline onclick on each dropdown-
   capable item's mobile trigger, inside a subsite's .csp-sub-collapse
   panel (see e.g. subsites/cic/header.html). Must stay in global
   scope, like toggleSubNav. */
function toggleSubDropdown(btn, panelId) {
  var panel    = document.getElementById(panelId);
  var expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  panel.classList.toggle('is-open', !expanded);
}

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
    document.querySelectorAll('.csp-sub-collapse').forEach(function (p) {
      p.classList.remove('is-open');
    });
    document.querySelectorAll('.csp-sub-toggle').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.csp-sub-mobile-dropdown').forEach(function (p) {
      p.classList.remove('is-open');
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
