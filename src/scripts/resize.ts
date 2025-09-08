/**
 * window size change handling system
 * handle the recalculation of responsive design
 */

import { BANNER_HEIGHT_EXTEND } from '../config/banner';

export function initResizeHandling(): void {
  window.addEventListener('resize', () => {
    // recalculate --banner-height-extend
    let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
    offset = offset - offset % 4;
    document.documentElement.style.setProperty('--banner-height-extend', `${offset}px`);
  });
}