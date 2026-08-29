/**
 * Deen Dyaal Sewa Bharti - Gallery Filtering Module
 */

(function () {
  'use strict';

  function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-card');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');

        // Update active class
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });

        // Rebind lightbox triggers if needed
        if (window.AppLightbox && typeof window.AppLightbox.bindTriggers === 'function') {
          window.AppLightbox.bindTriggers();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initGalleryFilters);
})();
