import { initBannerAndTransitions, ensureBannerDisplay } from './banner';
import { initScrollHandling } from './scroll';
import { initResizeHandling } from './resize';
import { initPhotoSwipe } from './photoswipe';

export function initializeApp(): void {
  initBannerAndTransitions();
  initScrollHandling();
  initResizeHandling();
  initPhotoSwipe();
}

initializeApp();

// ensure that the DOM is loaded and execute once
document.addEventListener('DOMContentLoaded', () => {
  ensureBannerDisplay();
});