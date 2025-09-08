/**
 * banner system management
 * handle the banner height calculation, animation and page transition
 */

import { 
  BANNER_CONFIG, 
  BANNER_HEIGHT, 
  BANNER_HEIGHT_HOME, 
  BANNER_HEIGHT_EXTEND 
} from '../constants/banner';

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
      
      const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 72 - 16;
      const navbar = document.getElementById('navbar-wrapper');
      
      if (!navbar || !document.body.classList.contains('is-home')) {
        return;
      }
      
      if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold) {
        navbar.classList.add('navbar-hidden');
      }
    });

    // handle visit start - prepare animation
    (window as any).swup.hooks.on('visit:start', (visit: {to: {url: string}}) => {
      const bodyElement = document.querySelector('body');
      const targetUrl = new URL(visit.to.url);
      const isTargetHome = pathsEqual(targetUrl.pathname, '/');
      const isCurrentHome = bodyElement?.classList.contains('is-home');
      
      // set height change in advance to achieve smooth transition
      if (isTargetHome && !isCurrentHome) {
        // go to home: delay adding class to start height transition
        setTimeout(() => {
          bodyElement?.classList.add('is-home');
        }, 50);
      } else if (!isTargetHome && isCurrentHome) {
        // leave home: delay removing class to start height transition
        setTimeout(() => {
          bodyElement?.classList.remove('is-home');
        }, 50);
      }

      // increase page height to prevent scrolling jump
      const heightExtend = document.getElementById('page-height-extend');
      if (heightExtend) {
        heightExtend.classList.remove('hidden');
      }
    });

    // handle page view
    (window as any).swup.hooks.on('page:view', () => {
      // keep page height extend visible
      const heightExtend = document.getElementById('page-height-extend');
      if (heightExtend) {
        heightExtend.classList.remove('hidden');
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

// initialize Banner height variables
export function initBannerHeight(): void {
  let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
  offset = offset - offset % 4;
  document.documentElement.style.setProperty('--banner-height-extend', `${offset}px`);
  
  document.documentElement.style.setProperty('--banner-height', `${BANNER_HEIGHT}vh`);
  document.documentElement.style.setProperty('--banner-height-home', `${BANNER_HEIGHT_HOME}vh`);
  
  const currentPath = window.location.pathname;
  const isHome = currentPath === '/' || currentPath === '';
  if (isHome && !document.body.classList.contains('is-home')) {
    document.body.classList.add('is-home');
  } else if (!isHome && document.body.classList.contains('is-home')) {
    document.body.classList.remove('is-home');
  }
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