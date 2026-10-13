/**
 * ==============================================================================
 * PRINCE KUMAWAT PORTFOLIO — JAVASCRIPT (script.js)
 * Clean, universal JavaScript compatible with all modern browsers and legacy
 * script compilers (ES5/Universal JS).
 *
 * Features:
 * 1. Windows Script Host (WScript) Desktop Execution Safeguard
 * 2. Dark / Light (Blueish White) Theme Switching with LocalStorage
 * 3. Mobile Navigation Menu Toggle & Outside-Click Handling
 * 4. Sticky Header Elevation & ScrollSpy Active Section Detection
 * 5. Project Category Filtering with Smooth Transition
 * 6. Interactive Resume Modal Preview & Print Trigger
 * 7. One-Click Email Copy to Clipboard with Fallback
 * 8. Contact Form Live Validation & Simulated Async Submission
 * 9. Toast Notification System
 * 10. Scroll-to-Top Floating Trigger & Scroll Reveal Animations
 * ==============================================================================
 */

// --------------------------------------------------------------------------
// 1. WINDOWS SCRIPT HOST (WSCRIPT / CSCRIPT) RUNTIME SAFEGUARD
// --------------------------------------------------------------------------
// If script.js is double-clicked or executed directly in Windows (outside a
// browser), prevent runtime errors and display a helpful instruction message.
if (typeof WScript !== 'undefined') {
  WScript.Echo(
    "Prince Kumawat Portfolio\n\n" +
    "This JavaScript file (script.js) is designed to run in a web browser.\n" +
    "Please double-click 'index.html' to open and view the portfolio in\n" +
    "Google Chrome, Microsoft Edge, Mozilla Firefox, or your default browser."
  );
  WScript.Quit();
}

// --------------------------------------------------------------------------
// 2. DOM INITIALIZATION WRAPPER
// --------------------------------------------------------------------------
(function () {
  'use strict';

  // Helper function to run initialization once DOM is ready
  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  onReady(function () {

    /* ------------------------------------------------------------------------
     * THEME SWITCHER (DARK / LIGHT MODE WITH LOCALSTORAGE)
     * ------------------------------------------------------------------------ */
    var themeToggleBtn = document.getElementById('theme-toggle');
    var htmlRoot = document.documentElement;

    // Retrieve saved preference or default to 'dark'
    var savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem('prince_portfolio_theme') || 'dark';
    } catch (e) {
      savedTheme = 'dark';
    }
    htmlRoot.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function () {
        var currentTheme = htmlRoot.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlRoot.setAttribute('data-theme', newTheme);
        try {
          localStorage.setItem('prince_portfolio_theme', newTheme);
        } catch (e) {}

        var themeLabel = newTheme === 'dark' ? 'Dark' : 'Light (Blueish White)';
        showToast('Switched to ' + themeLabel + ' Theme', 'info');
      });
    }

    /* ------------------------------------------------------------------------
     * MOBILE NAVIGATION HAMBURGER MENU
     * ------------------------------------------------------------------------ */
    var hamburgerBtn = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    var navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener('click', function () {
        var isOpen = navMenu.classList.contains('open');
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });

      // Close mobile menu when any navigation link is clicked
      for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function () {
          hamburgerBtn.classList.remove('active');
          navMenu.classList.remove('open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
      }

      // Close menu when clicking anywhere outside
      document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
          hamburgerBtn.classList.remove('active');
          navMenu.classList.remove('open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ------------------------------------------------------------------------
     * STICKY HEADER & SCROLL SPY (ACTIVE NAV LINK HIGHLIGHT)
     * ------------------------------------------------------------------------ */
    var header = document.getElementById('header');
    var sections = document.querySelectorAll('section[id]');
    var scrollFloatingBtn = document.getElementById('scroll-top-floating');

    function handleScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      // Header shadow and blur styling
      if (header) {
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Floating Scroll-To-Top button visibility
      if (scrollFloatingBtn) {
        if (scrollY > 400) {
          scrollFloatingBtn.classList.add('visible');
        } else {
          scrollFloatingBtn.classList.remove('visible');
        }
      }

      // Active Section in Navigation
      for (var s = 0; s < sections.length; s++) {
        var currentSection = sections[s];
        var sectionHeight = currentSection.offsetHeight;
        var sectionTop = currentSection.offsetTop - 140;
        var sectionId = currentSection.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          for (var l = 0; l < navLinks.length; l++) {
            navLinks[l].classList.remove('active');
            if (navLinks[l].getAttribute('href') === '#' + sectionId) {
              navLinks[l].classList.add('active');
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Floating scroll button click handler
    if (scrollFloatingBtn) {
      scrollFloatingBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ------------------------------------------------------------------------
     * PROJECT CATEGORY FILTERING
     * ------------------------------------------------------------------------ */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    function setupFilterBtn(btn) {
      btn.addEventListener('click', function () {
        for (var b = 0; b < filterBtns.length; b++) {
          filterBtns[b].classList.remove('active');
        }
        btn.classList.add('active');

        var filterValue = btn.getAttribute('data-filter');

        for (var c = 0; c < projectCards.length; c++) {
          (function (card) {
            var category = card.getAttribute('data-category') || '';
            if (filterValue === 'all' || category.indexOf(filterValue) !== -1) {
              card.style.display = 'flex';
              card.style.opacity = '0';
              setTimeout(function () {
                card.style.opacity = '1';
              }, 50);
            } else {
              card.style.display = 'none';
            }
          })(projectCards[c]);
        }
      });
    }

    for (var f = 0; f < filterBtns.length; f++) {
      setupFilterBtn(filterBtns[f]);
    }

    /* ------------------------------------------------------------------------
     * RESUME MODAL & PRINT HANDLER
     * ------------------------------------------------------------------------ */
    var resumeModal = document.getElementById('resume-modal');
    var resumeBackdrop = document.getElementById('resume-backdrop');
    var resumeModalClose = document.getElementById('resume-modal-close');
    var closeResumeBottomBtn = document.getElementById('close-resume-bottom-btn');
    var printResumeBtn = document.getElementById('print-resume-btn');

    // Trigger buttons
    var heroResumeBtn = document.getElementById('hero-resume-btn');
    var aboutResumeBtn = document.getElementById('about-resume-download');
    var recruiterResumeBtn = document.getElementById('recruiter-resume-btn');

    function openResumeModal() {
      if (resumeModal) {
        resumeModal.classList.add('active');
        resumeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeResumeModal() {
      if (resumeModal) {
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    var resumeTriggers = [heroResumeBtn, aboutResumeBtn, recruiterResumeBtn];
    for (var rt = 0; rt < resumeTriggers.length; rt++) {
      if (resumeTriggers[rt]) {
        resumeTriggers[rt].addEventListener('click', openResumeModal);
      }
    }

    if (resumeModalClose) resumeModalClose.addEventListener('click', closeResumeModal);
    if (closeResumeBottomBtn) closeResumeBottomBtn.addEventListener('click', closeResumeModal);
    if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResumeModal);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (resumeModal && resumeModal.classList.contains('active')) {
          closeResumeModal();
        }
      }
    });

    // Print resume
    if (printResumeBtn) {
      printResumeBtn.addEventListener('click', function () {
        window.print();
      });
    }

    /* ------------------------------------------------------------------------
     * COPY EMAIL TO CLIPBOARD
     * ------------------------------------------------------------------------ */
    var copyEmailBtn = document.getElementById('copy-email-btn');
    var emailToCopy = 'prince.26been0136@jecrcu.edu.in';

    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(emailToCopy).then(
            function () {
              onCopySuccess();
            },
            function () {
              fallbackCopy(emailToCopy);
            }
          );
        } else {
          fallbackCopy(emailToCopy);
        }
      });
    }

    function onCopySuccess() {
      if (!copyEmailBtn) return;
      copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      showToast('Email address copied to clipboard!', 'success');
      setTimeout(function () {
        copyEmailBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
      }, 2500);
    }

    function fallbackCopy(text) {
      try {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          onCopySuccess();
        } else {
          showToast('Direct email: ' + text, 'info');
        }
      } catch (err) {
        showToast('Direct email: ' + text, 'info');
      }
    }

    /* ------------------------------------------------------------------------
     * CONTACT FORM VALIDATION & SIMULATION
     * ------------------------------------------------------------------------ */
    var contactForm = document.getElementById('contact-form');
    var submitBtn = document.getElementById('contact-submit-btn');
    var formStatus = document.getElementById('form-status');

    var nameInput = document.getElementById('form-name');
    var emailInput = document.getElementById('form-email');
    var subjectInput = document.getElementById('form-subject');
    var messageInput = document.getElementById('form-message');

    var nameError = document.getElementById('name-error');
    var emailError = document.getElementById('email-error');
    var subjectError = document.getElementById('subject-error');
    var messageError = document.getElementById('message-error');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;

        // Validate Name
        if (!nameInput.value || !nameInput.value.trim()) {
          if (nameError) nameError.classList.add('visible');
          isValid = false;
        } else {
          if (nameError) nameError.classList.remove('visible');
        }

        // Validate Email
        if (!emailInput.value || !emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
          if (emailError) emailError.classList.add('visible');
          isValid = false;
        } else {
          if (emailError) emailError.classList.remove('visible');
        }

        // Validate Subject
        if (!subjectInput.value || !subjectInput.value.trim()) {
          if (subjectError) subjectError.classList.add('visible');
          isValid = false;
        } else {
          if (subjectError) subjectError.classList.remove('visible');
        }

        // Validate Message
        if (!messageInput.value || !messageInput.value.trim() || messageInput.value.trim().length < 15) {
          if (messageError) messageError.classList.add('visible');
          isValid = false;
        } else {
          if (messageError) messageError.classList.remove('visible');
        }

        if (!isValid) {
          showToast('Please fill out all required fields correctly.', 'error');
          return;
        }

        // Simulate submission
        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
        }

        setTimeout(function () {
          if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
          }

          contactForm.reset();

          if (formStatus) {
            formStatus.className = 'form-status-msg success';
            formStatus.style.display = 'block';
            formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent to Prince Kumawat (prince.26been0136@jecrcu.edu.in). Expect a response shortly!';
          }

          showToast('Message sent successfully! Prince will reply soon.', 'success');

          setTimeout(function () {
            if (formStatus) {
              formStatus.style.display = 'none';
            }
          }, 6000);
        }, 1200);
      });
    }

    /* ------------------------------------------------------------------------
     * TOAST NOTIFICATION UTILITY
     * ------------------------------------------------------------------------ */
    function showToast(message, type) {
      type = type || 'info';
      var container = document.getElementById('toast-container');
      if (!container) return;

      var toast = document.createElement('div');
      toast.className = 'toast toast-' + type;

      var iconClass = 'fa-info-circle';
      if (type === 'success') iconClass = 'fa-check-circle';
      if (type === 'error') iconClass = 'fa-exclamation-triangle';

      toast.innerHTML = '<i class="fas ' + iconClass + '"></i><span>' + message + '</span>';

      container.appendChild(toast);

      setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(function () {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3500);
    }

    /* ------------------------------------------------------------------------
     * FOOTER CURRENT YEAR AUTOMATION
     * ------------------------------------------------------------------------ */
    var currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
      currentYearSpan.textContent = String(new Date().getFullYear());
    }

    /* ------------------------------------------------------------------------
     * SCROLL REVEAL ANIMATIONS
     * ------------------------------------------------------------------------ */
    var revealElements = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('revealed');
            observer.unobserve(entries[i].target);
          }
        }
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      for (var r = 0; r < revealElements.length; r++) {
        var el = revealElements[r];
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
      }

      var styleSheet = document.createElement('style');
      styleSheet.textContent = '[data-reveal].revealed { opacity: 1 !important; transform: translateY(0) !important; }';
      document.head.appendChild(styleSheet);
    } else {
      for (var k = 0; k < revealElements.length; k++) {
        revealElements[k].style.opacity = '1';
        revealElements[k].style.transform = 'none';
      }
    }

  });
})();
