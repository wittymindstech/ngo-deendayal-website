/**
 * Deen Dyaal Sewa Bharti - Lightbox Module
 * Accessible, keyboard-navigable image and document viewer
 */

(function () {
  'use strict';

  let currentItems = [];
  let currentIndex = 0;
  let modalElement = null;
  let imgElement = null;
  let titleElement = null;
  let captionElement = null;
  let counterElement = null;
  let prevBtn = null;
  let nextBtn = null;
  let closeBtn = null;

  function initLightbox() {
    // Create or find lightbox DOM elements
    modalElement = document.getElementById('lightboxModal');
    if (!modalElement) return;

    imgElement = modalElement.querySelector('.lightbox-image');
    titleElement = modalElement.querySelector('.lightbox-title');
    captionElement = modalElement.querySelector('.lightbox-caption-text');
    counterElement = modalElement.querySelector('.lightbox-counter');
    prevBtn = modalElement.querySelector('.lightbox-prev-btn');
    nextBtn = modalElement.querySelector('.lightbox-next-btn');
    closeBtn = modalElement.querySelector('.lightbox-close-btn');

    // Event listeners
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', showPrev);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', showNext);
    }

    // Close on background click
    modalElement.addEventListener('click', function (e) {
      if (e.target === modalElement) {
        closeLightbox();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (!modalElement.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });

    // Bind triggers across the page
    bindTriggers();
  }

  function bindTriggers() {
    const triggerElements = document.querySelectorAll('[data-lightbox]');
    
    triggerElements.forEach((el, index) => {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', el.getAttribute('data-caption') || 'चित्र देखें');

      const clickHandler = function (e) {
        e.preventDefault();
        const galleryName = el.getAttribute('data-lightbox');
        openGallery(galleryName, el);
      };

      el.addEventListener('click', clickHandler);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clickHandler(e);
        }
      });
    });
  }

  function openGallery(galleryName, activeElement) {
    const selector = `[data-lightbox="${galleryName}"]`;
    const nodeList = document.querySelectorAll(selector);
    
    currentItems = Array.from(nodeList).filter(item => {
      // Filter out hidden elements if inside filter tabs
      return item.offsetParent !== null || item.closest('.gallery-card, .news-card, .doc-card, .fin-card');
    });

    if (currentItems.length === 0) {
      currentItems = [activeElement];
    }

    currentIndex = currentItems.indexOf(activeElement);
    if (currentIndex === -1) currentIndex = 0;

    renderCurrentItem();
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function renderCurrentItem() {
    if (!currentItems[currentIndex]) return;

    const el = currentItems[currentIndex];
    const src = el.getAttribute('data-src') || el.querySelector('img')?.src;
    const title = el.getAttribute('data-title') || 'दीन दयाल सेवा भारती';
    const caption = el.getAttribute('data-caption') || el.querySelector('img')?.alt || '';

    if (imgElement) {
      imgElement.src = src;
      imgElement.alt = caption;
    }

    if (titleElement) {
      titleElement.textContent = title;
    }

    if (captionElement) {
      captionElement.textContent = caption;
    }

    if (counterElement) {
      counterElement.textContent = `${currentIndex + 1} / ${currentItems.length}`;
    }

    // Hide navigation buttons if only 1 item
    if (prevBtn && nextBtn) {
      const showNav = currentItems.length > 1;
      prevBtn.style.display = showNav ? 'flex' : 'none';
      nextBtn.style.display = showNav ? 'flex' : 'none';
    }
  }

  function showPrev() {
    if (currentItems.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    renderCurrentItem();
  }

  function showNext() {
    if (currentItems.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentItems.length;
    renderCurrentItem();
  }

  function closeLightbox() {
    if (modalElement) {
      modalElement.classList.remove('active');
      document.body.style.overflow = '';
      if (imgElement) imgElement.src = '';
    }
  }

  // Expose to window
  window.AppLightbox = {
    init: initLightbox,
    bindTriggers: bindTriggers,
    open: openGallery,
    close: closeLightbox
  };

  document.addEventListener('DOMContentLoaded', initLightbox);
})();
