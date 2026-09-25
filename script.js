// script.js

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNav();
  initScrollSpy();
  initCounters();
  initLoginForm();
  initSignupForm();
  initReportForm();
});

/* --------------------------------------------------------------------
   Navbar: darken/blur/shadow once the page has scrolled past the hero
   -------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  const applyScrollState = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(applyScrollState);
      ticking = true;
    }
  }, { passive: true });

  applyScrollState(); // correct state on load, e.g. after a refresh mid-page
}

/* --------------------------------------------------------------------
   Mobile menu: toggle the dropdown, close on link click / outside click / Esc
   -------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    const clickedInsideNav = event.target.closest('.navbar');
    if (!clickedInsideNav && menu.classList.contains('open')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

/* --------------------------------------------------------------------
   Scroll-spy: highlight the nav link for whichever homepage section is
   in view. On pages without these section ids (login, signup, etc.)
   `sections` is simply empty and this quietly does nothing.
   -------------------------------------------------------------------- */
function initScrollSpy() {
  const sectionIds = ['home', 'challenges', 'how-it-works', 'impact', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length === 0) return;

  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------
   Impact stats: count up from 0 to each target once the section is visible.
   No-ops on pages with no .stat-number elements.
   -------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* --------------------------------------------------------------------
   Login form (login.html): no backend yet, so submitting just reveals
   the inline success message.
   -------------------------------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const successMessage = document.getElementById('loginSuccess');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (successMessage) successMessage.classList.add('visible');
  });
}

/* --------------------------------------------------------------------
   Signup form (signup.html): checks that Password and Confirm Password
   match before showing success — this is client-side only, no backend.
   -------------------------------------------------------------------- */
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const passwordField = document.getElementById('signupPassword');
  const confirmField = document.getElementById('signupConfirm');
  const successMessage = document.getElementById('signupSuccess');
  const errorMessage = document.getElementById('signupError');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const passwordsMatch = passwordField.value === confirmField.value;

    if (passwordsMatch) {
      if (successMessage) successMessage.classList.add('visible');
      if (errorMessage) errorMessage.classList.remove('visible');
    } else {
      if (errorMessage) errorMessage.classList.add('visible');
      if (successMessage) successMessage.classList.remove('visible');
    }
  });
}

/* --------------------------------------------------------------------
   Report Problem form (report-problem.html): shows the chosen file's
   name, and on submit shows the success message and resets the form.
   No backend yet.
   -------------------------------------------------------------------- */
function initReportForm() {
  const form = document.getElementById('reportForm');
  if (!form) return;

  const imageInput = document.getElementById('reportImage');
  const fileNameDisplay = document.getElementById('reportFileName');
  const successMessage = document.getElementById('reportSuccess');

  if (imageInput && fileNameDisplay) {
    imageInput.addEventListener('change', () => {
      fileNameDisplay.textContent = imageInput.files.length ? imageInput.files[0].name : '';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (successMessage) successMessage.classList.add('visible');
    form.reset();
    if (fileNameDisplay) fileNameDisplay.textContent = '';
  });
}