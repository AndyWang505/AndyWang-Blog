---
title: 'Astro 圖片優化策略'
description: '近期在重構部落格時，發現過去一直都有靜態資源載入的問題，例如 layout structure 先出來了，但圖片還在 loading，後來也發現其實 astro 有針對這類靜態資源做優化。'
pubDate: 'September 8 2025'
heroImage: ''
tags: ['blog', 'performance']
category: 'Astro'
---

近期在重構部落格時，發現過去一直都有靜態資源載入的問題，例如 layout structure 先出來了，但圖片還在 loading，後來也發現其實 astro 有針對這類靜態資源做優化。

## 常見問題

在開發中，圖片往往是影響載入速度和使用者體驗的主要因素，常見的問題包括：

- 圖片檔案過大：例如，一張 4000px 的原始相片被直接放到網頁橫幅區，但實際顯示只有 1200px 寬。這會造成多餘的下載流量，特別在行動網路下效能很差。
- CLS（Cumulative Layout Shift）：若 `<img>` 沒有指定 width 和 height，瀏覽器在圖片載入前不知道該保留多少空間。結果文字或按鈕先載入，因此在圖片載入後會把內容往下推擠，讓畫面產生位移。
- 缺乏響應式設計：一張 PC 用的大橫幅圖（例如 300KB），在手機上可能只需要 50KB。若沒有針對不同 viewport 提供適合的圖像，會造成小螢幕載入時間冗長。
- 延遲載入處理：如果所有圖片在首頁就開始載入，即使是畫面外的圖片，也會影響網頁載入變慢。在沒有使用 loading="lazy" 時，用戶會需要等到全部圖片下載完才能互動。

## 原生作法

一般在沒有其他工具協助的情況下，最原生的處理方法：

- 手動壓縮圖片：透過 Photoshop、ImageOptim、Squoosh 等工具，每次新增圖片都要自己輸出壓縮版本，繁瑣且難以維護。
- 自行生成多個尺寸版本：針對電腦、平板、手機手動輸出不同解析度的圖片，然後用 `<picture>` 或 `srcset` 配合 `sizes` 來顯示對應圖片。例如：
    ```html
    <picture>
        <source srcset="banner-1200w.jpg" media="(min-width: 1024px)">
        <source srcset="banner-600w.jpg" media="(max-width: 600px)">
        <img src="banner-800w.jpg" alt="網站橫幅">
    </picture>
    ```
    雖然可解決行動裝置載入大圖的問題，但圖片版本一多，維護成本也是會隨之上升。

- 在 `<img>` 標籤加屬性：例如 loading="lazy" 可讓非首頁圖片延後載入，而 decoding="async" 可以非同步解碼圖片，避免主執行緒阻塞。
- 使用 CDN 動態調整：透過 Cloudflare Images、Imgix、Cloudinary 等服務，根據 URL 參數裁切或壓縮圖片。例如：
    ```bash
    https://res.cloudinary.com/demo/image/upload/w_600,h_400,c_fill/sample.jpg
    ```

## astro 針對圖片的處理

Astro 在 v2 之後提供了 `astro:assets` 模組，讓圖片優化變得自動化。它的特點是在建構時預處理，以及需求渲染（on-demand rendering），不但能壓縮格式，還能避免 CLS（Cumulative Layout Shift）。

> CLS 是 Google Core Web Vitals 的一個指標，用來衡量網頁在載入過程中，畫面元素是否發生「跳動、位移」，這會造成使用體驗很差，可能因此點錯東西。有興趣可以參考 [累計版面配置位移 (CLS)](https://web.dev/articles/cls?hl=zh-tw)。

### `<Image />`

可顯示來自 `src/` 或已經授權遠端來源的圖檔。

該元件可在 build 時（或需求渲染時）轉換尺寸、格式與品質（預設會轉為 WebP），並包含 `alt`、`loading`、`decoding` 等屬性，能夠自動推斷出寬高以避免布局偏移（CLS）。

```astro title="index.astro"
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.png';
---
<Image src={hero} alt="部落格封面圖片" />
```

### `<Picture />`

自 Astro v3.3.0 起開始支援。

可以生成 `<picture>` 元件，支援多種格式與 fallback，可避免圖檔損毀時造成畫面不協調。

跟 `Image` 元件相同，build 時預處理圖檔，支援需求渲染。

```astro title="index.astro"
---
import { Picture } from 'astro:assets';
import cover from '../assets/cover.png';
---
<Picture src={cover} formats={['avif', 'webp']} alt="文章封面" />
```

生成後的 HTML 會自帶 `<source>` 與 fallback 機制，適合做「進階響應式圖片」。

```html
<picture>
  <source srcset="...avif" type="image/avif"/>
  <source srcset="...webp" type="image/webp"/>
  <img src="...png" width="1600" height="900" decoding="async" loading="lazy" alt="文章封面" />
</picture>
```

> 響應式圖像行為（Responsive image behavior），可依訪客裝置大小與解析度調整大小，Astro 會自動生成 `srcset` 與 `sizes`，並套用適當樣式。不過要注意在 `/public` 下的圖檔不會被優化，也不支援響應式，將以原檔輸出。

### `getImage()`

適用於希望圖像被用於非 HTML 顯示的場合，例如 API 路由，或 `<Image />`、`<Picture />` 不支援的選項時，可使用 getImage() 創建自訂圖檔邏輯。

```astro title="index.astro"
---
import { getImage } from 'astro:assets';
import logo from '../assets/logo.png';

const logoData = await getImage({ src: logo, width: 200 });
---
<img src={logoData.src} alt="Logo" />
```

## 靜態資源管理

接下來講一下關於 Astro 在靜態資源上的管理，主要分成 `/src` 與 `/public` 這兩個資料夾層級。

### `/src`

主要放程式碼相關資源（components、pages、樣式、圖片、字體等）

它的特性就是在 `/src` 底下的檔案都會經過 Vite / Astro 的打包處理。

圖片如果放在 /src/assets，用 Astro 的 `<Image />` 或 import 引入，Astro 也會自動幫你壓縮、產生不同尺寸及 hash（避免快取問題）。

舉例來說，如果 import 一張圖片可能是這樣：

```astro
---
import banner from '../assets/banner.png';
---
<img src={banner} alt="橫幅圖">
```

編譯後 Astro 會把它轉換成 `/_astro/banner.[hash].png`，確保部署時不會出現路徑錯誤。

### `/public`

這裡主要放純靜態檔案，在 `/public` 下的檔案不會經過打包。

這些檔案會在 build 時，原封不動複製到輸出的 `/dist` 資料夾下，因此引入方式是用絕對路徑。

比較適合放 favicon、robots.txt、sitemap.xml 這類不會變動的檔案。

## 參考來源

* [Images | Docs](https://docs.astro.build/en/guides/images/)
* [了解 Astro 圖片處理 (Image)](https://ithelp.ithome.com.tw/m/articles/10314783)
