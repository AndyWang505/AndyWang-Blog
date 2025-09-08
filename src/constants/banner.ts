// 所有高度單位: vh (viewport height)

// 基礎 banner 高度
export const BANNER_HEIGHT = 35;

// 延伸高度 - 僅用於首頁
export const BANNER_HEIGHT_EXTEND = 30;

// 首頁完整 banner 高度 = 基礎高度 + 延伸高度
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// 主要內容區域與 banner 重疊高度，單位: rem
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5;

export const PAGE_WIDTH = 75;

// Banner 配置
export const BANNER_CONFIG = {
  enable: true,
  src: "/banner/banner_0907.jpg", // 放置在 public 目錄下
  position: "center", // "top" | "center" | "bottom"
  showOnHomePage: true,
  showOnOtherPages: true,
  smoothTransition: true,
  transitionDuration: 500,
  credit: {
    enable: false,
    text: "",
    url: ""
  }
};