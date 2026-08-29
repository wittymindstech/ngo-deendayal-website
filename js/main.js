/**
 * Deen Dyaal Sewa Bharti - Main JavaScript File
 * Handles Navigation, Mobile Drawer, Sticky Header, Counters, Form Handling, Tabs
 */

(function () {
  'use strict';

  // 1. Sticky Navigation & Scroll Spy
  function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      // Scroll Spy
      let currentSectionId = '';
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });

    // Mobile Hamburger Menu Toggle
    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener('click', function () {
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
          navMenu.classList.remove('open');
          hamburgerBtn.classList.remove('open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        } else {
          navMenu.classList.add('open');
          hamburgerBtn.classList.add('open');
          hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
      });

      // Close menu on link click
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          hamburgerBtn.classList.remove('open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // 2. Animated Numerical Counters
  function initCounters() {
    const countElements = document.querySelectorAll('[data-counter]');
    if (!countElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-counter'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800; // ms
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counterInterval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(targetNum * easeOutQuad(progress));

            el.textContent = currentCount + suffix;

            if (frame === totalFrames) {
              clearInterval(counterInterval);
              el.textContent = targetNum + suffix;
            }
          }, frameDuration);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countElements.forEach(el => observer.observe(el));
  }

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  // 3. Transparency Section Tabs (Documents vs Financials)
  function initTransparencyTabs() {
    const tabButtons = document.querySelectorAll('.transparency-tabs .tab-btn');
    const tabPanels = document.querySelectorAll('.transparency-panel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(button => {
      button.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        tabPanels.forEach(panel => {
          if (panel.id === targetTab) {
            panel.style.display = 'block';
            setTimeout(() => {
              panel.style.opacity = '1';
            }, 10);
          } else {
            panel.style.opacity = '0';
            panel.style.display = 'none';
          }
        });

        // Rebind lightbox triggers
        if (window.AppLightbox && typeof window.AppLightbox.bindTriggers === 'function') {
          window.AppLightbox.bindTriggers();
        }
      });
    });
  }

  // 4. Contact Form Submission (Frontend Handling with clear user feedback)
  function initContactForm() {
    const form = document.getElementById('ngoContactForm');
    const successAlert = document.getElementById('formSuccessAlert');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = form.querySelector('#userName');
      const phoneInput = form.querySelector('#userPhone');
      const messageInput = form.querySelector('#userMessage');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      if (!nameVal || !phoneVal) {
        alert('कृपया अपना नाम और संपर्क नंबर अवश्य दर्ज करें।');
        return;
      }

      // Show submit state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'संदेश भेजा जा रहा है...';
      submitBtn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        if (successAlert) {
          successAlert.classList.add('show');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 700);
    });
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCounters();
    initTransparencyTabs();
    initContactForm();
  });
})();
