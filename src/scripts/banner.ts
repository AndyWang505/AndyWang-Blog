/**
 * banner system management
 * handle the banner height calculation, animation and page transition
 */

import { 
  BANNER_CONFIG, 
  BANNER_HEIGHT, 
  BANNER_HEIGHT_HOME, 
  BANNER_HEIGHT_EXTEND 
} from '../config/banner';

// path equal check
function pathsEqual(path1: string, path2: string): boolean {
  const normalize = (path: string) => path.replace(/\/+$/, '') || '/';
  return normalize(path1) === normalize(path2);
}

// banner display function
function showBanner(): void {
  if (!BANNER_CONFIG.enable) return;
  
  const banner = document.getElementById('banner');
  if (!banner) {
    console.error('Banner element not found');
    return;
  }
  
  // ensure banner display
  banner.classList.remove('opacity-0', 'scale-105');
  banner.classList.add('opacity-100', 'scale-100');
  
  // after loading, add loaded class, stop loading animation
  setTimeout(() => {
    banner.classList.add('loaded');
  }, 800); // sync with animation time
}

// banner and page transition initialization
export function initBannerAndTransitions(): void {
  const bannerEnabled = !!document.getElementById('banner-wrapper');
  
  // set content delay
  document.documentElement.style.setProperty('--content-delay', '0ms');

  const setup = () => {
    // handle link click
    (window as any).swup.hooks.on('link:click', () => {
      // remove content delay
      document.documentElement.style.setProperty('--content-delay', '0ms');
      
      // prevent element from overlapping with navbar
      if (!bannerEnabled) return;
      
      const navbar = document.getElementById('navbar-wrapper');
      
      if (!navbar || !document.body.classList.contains('is-home')) {
        return;
      }
      
      // Use banner-height based detection
      const NAVBAR_HEIGHT = 72;
      
      // Use appropriate banner height for threshold calculation
      const bannerHeightForThreshold = window.innerWidth > 768 ? BANNER_HEIGHT_HOME : BANNER_HEIGHT;
      const bannerHeightPx = window.innerHeight * (bannerHeightForThreshold / 100);
      const threshold = bannerHeightPx - NAVBAR_HEIGHT - 20;
      
      if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold) {
        navbar.classList.add('navbar-hidden');
      }
    });

    // handle visit start - prepare animation
    (window as any).swup.hooks.on('visit:start', () => {
      // increase page height to prevent scrolling jump
      const heightExtend = document.getElementById('page-height-extend');
      if (heightExtend) {
        heightExtend.classList.remove('hidden');
      }
    });

    // handle content replace - trigger banner resize AFTER new content is in DOM
    // so the transition is visible during the new page's fade-in, not the old page's fade-out
    (window as any).swup.hooks.on('content:replace', () => {
      const currentPath = window.location.pathname;
      const isTargetHome = pathsEqual(currentPath, '/');
      const hasIsHome = document.body.classList.contains('is-home');

      if (isTargetHome && !hasIsHome) {
        document.body.classList.add('is-home');
      } else if (!isTargetHome && hasIsHome) {
        document.body.classList.remove('is-home');
      }
    });

    // handle visit end
    (window as any).swup.hooks.on('visit:end', () => {
      setTimeout(() => {
        // hide temporary height element
        const heightExtend = document.getElementById('page-height-extend');
        if (heightExtend) {
          heightExtend.classList.add('hidden');
        }

        // reinitialize banner display
        const banner = document.getElementById('banner');
        if (banner && BANNER_CONFIG.enable) {
          banner.style.opacity = '1';
          banner.style.transform = 'scale(1)';
        }
      }, 500); // sync with CSS transition time
    });
  };

  if ((window as any)?.swup?.hooks) {
    setup();
  } else {
    document.addEventListener('swup:enable', setup);
  }

  showBanner();
}

// ensure banner display after DOM load
export function ensureBannerDisplay(): void {
  setTimeout(() => {
    const banner = document.getElementById('banner');
    if (banner && BANNER_CONFIG.enable) {
      banner.classList.remove('opacity-0', 'scale-105');
      banner.classList.add('opacity-100', 'scale-100');
    }
  }, 100);
}