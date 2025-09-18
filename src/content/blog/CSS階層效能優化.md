---
title: 'CSS 階層效能優化'
description: '其實CSS階層在瀏覽器上會影響效能，但因為現今電腦性能極佳，電腦跑起來可能沒有明顯差異，就算對於電腦影響看似不大，也會衍伸出程式上的管理問題'
pubDate: 'March 27 2022'
heroImage: '/CSS-Image1.jpg'
tags: ['CSS','Notes']
category: 'Performance'
---
其實CSS階層在瀏覽器上會影響效能

但因為現今電腦性能極佳，電腦跑起來可能沒有明顯差異

就算對於電腦影響看似不大，也會衍伸出程式上的管理問題

## CSS階層差異

舉例來說今天有一個這樣的結構

![](https://i.imgur.com/3hYdqas.png)

而一個寫了6個階層，一個寫了2層

而6層的可能會影響到瀏覽器效能

```css
/* bad */
.wrap header .menu ul li a{
    font-size: 16px;
}
/* better */
.menu a{
    font-size: 16px;
}
```
瀏覽器會將CSS解析成一個叫CSSOM的結構，最後與DOM匹配成我們看到的樣式style

這樣的階層會讓瀏覽器匹配的效能變差

## 瀏覽器建構版面﹑繪製方式

在 [google開發文件](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-tw) 中有提到

* 瀏覽器會先解析HTML和CSS，產生一個DOM樹狀結構和CSSOM樹狀結構
* CSSOM會和DOM匹配合併成轉譯樹狀結構Render Tree
* Render Tree這結構上的節點包含網頁所有的DOM資訊，也同時包含CSSOM樣式資訊
* 當有Render Tree結構後，會進到「版面配置」階段，計算每個節點的幾何形狀，輸出結果稱「盒模型」

  ![](https://i.imgur.com/HzHMV1Z.png)
* 最後將所有Render Tree上所有節點的資訊做為輸入，轉為螢幕上的像素，這階段稱為「繪製」

![](https://i.imgur.com/rWtL8RP.png)

## 優化做法

[文件](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?hl=zh-tw)中有詳細說明如何減少計算的範圍與複雜性

最簡單的例子是當你在設定樣式時，僅用一個選擇器就好

```css
.title {
  /* styles */
}
```

但當專案在不斷的擴充功能或需求時，可能往往變成這樣

```css
.box:nth-last-child(-n+1) .title {
  /* styles */
}
```
瀏覽器會花更多的時間去詢問該類別中的某項的某元素...

更好的方式則是

```css
.final-box-title {
  /* styles */
}
```
雖然會衍伸名稱變長或命名結構混亂等問題，但對瀏覽器來說工作起來更簡單了，效能也較佳

## 各選擇器所花費時間

可以看到HTML標籤花費4.8毫秒，Class是3.6毫秒，兩層Class花費4.5毫秒，相當於一個HTML標籤

![](https://i.imgur.com/wQFEX5q.png)

## 補充：Chrome DevTools

Chrome DevTools也可以用於觀察CSS渲染所花的時間

![](https://i.imgur.com/XF1r0hC.png)

##### 參考來源

[Render-tree Construction, Layout, and Paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)

[Reduce the Scope and Complexity of Style Calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)

[iT邦幫忙 第12屆iThome鐵人賽 CSS 階層效能優化建議](https://ithelp.ithome.com.tw/articles/10237687)

[Optimizing CSS: ID Selectors and Other Myths](https://www.sitepoint.com/optimizing-css-id-selectors-and-other-myths/)

##### 以上皆為自己整理的筆記，僅供參考與複習使用。