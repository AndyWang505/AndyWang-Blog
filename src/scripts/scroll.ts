/**
 * scroll handling system
 * handle the navbar hidden, back-to-top button, etc. scroll related features
 */

import { BANNER_HEIGHT, BANNER_HEIGHT_HOME } from '../config/banner';

export function initScrollHandling(): void {
  const bannerEnabled = !!document.getElementById('banner-wrapper');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const navbar = document.getElementById('navbar-wrapper');
  
  function scrollFunction() {
    const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);
    
    // Back to top button handling
    if (backToTopBtn) {
      if (document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight) {
        backToTopBtn.classList.remove('hide');
      } else {
        backToTopBtn.classList.add('hide');
      }
    }
    
    // Navbar hidden handling
    if (!bannerEnabled || !navbar) return;
    
    const NAVBAR_HEIGHT = 72;
    const MAIN_PANEL_EXCESS_HEIGHT = 3.5 * 16; // 3.5rem to px
    
    let currentBannerHeight = BANNER_HEIGHT;
    if (document.body.classList.contains('is-home')) {
      currentBannerHeight = BANNER_HEIGHT_HOME;
    }
    
    const threshold = window.innerHeight * (currentBannerHeight / 100) - NAVBAR_HEIGHT - MAIN_PANEL_EXCESS_HEIGHT - 16;
    
    if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold) {
      navbar.classList.add('navbar-hidden');
    } else {
      navbar.classList.remove('navbar-hidden');
    }
  }
  
  window.addEventListener('scroll', scrollFunction);
}