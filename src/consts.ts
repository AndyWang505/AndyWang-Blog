// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'AndyWang′s Blog';
export const SITE_DESCRIPTION =
  '這裡是 AndyWang 的部落格，主要記錄著我的開發經驗以及技術筆記相關文章，偶爾也會分享或討論一些技術議題。';

// Default images
export const DEFAULT_BLOG_IMAGE = 'https://avatars.githubusercontent.com/u/71600455?v=4';
export const DEFAULT_AVATAR = 'https://avatars.githubusercontent.com/u/71600455?v=4';

// Footer background images
export const FOOTER_BG_LIGHT = '/back-footer/cave.foothold1.1.0.png';
export const FOOTER_BG_DARK = '/back-footer/enH1.1.png';

// Banner configuration
export const BANNER_CONFIG = {
  enable: true,
  src: "/banner/134578282_p0_master1200.jpg", // Path to your banner image
  position: "center", // 'top', 'center', 'bottom'
  height: {
    home: 65, // Banner height on home page (vh)
    other: 30  // Banner height on other pages (vh)
  },
  credit: {
    enable: false,
    text: "",
    url: "",
  },
};

// Banner constants
export const BANNER_HEIGHT = BANNER_CONFIG.height.other;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME = BANNER_CONFIG.height.home;
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 7; // 增加重疊高度，讓 main 內容更深入 banner 下方
