// Banner configuration - all height units: vh (viewport height)

// Banner height configuration
export const BANNER_HEIGHTS = {
  base: 35,
  extend: 30,
  overlaps: 3.5,
};

// Page width configuration
export const PAGE_WIDTH = 75;

// Calculated height (exported as numbers for calculations)
export const BANNER_HEIGHT: number = BANNER_HEIGHTS.base;
export const BANNER_HEIGHT_EXTEND: number = BANNER_HEIGHTS.extend;
export const BANNER_HEIGHT_HOME: number = BANNER_HEIGHTS.base + BANNER_HEIGHTS.extend;
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT: number = BANNER_HEIGHTS.overlaps;

// Banner main configuration
export const BANNER_CONFIG = {
  enable: true,
  src: "/banner/banner.webp",
  position: "center" as const,
  credit: {
    enable: true,
    text: "夏生(なつお)@nathuo101102",
    url: "https://x.com/nathuo101102"
  }
} as const;