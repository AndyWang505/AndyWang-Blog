---
title: '在 CSS 中的權重'
description: '在 CSS 中經常會遇到需要覆蓋樣式的情況，這通常涉及到 CSS 的權重問題。當多個 CSS 使用在同一個元素並且產生衝突時，就會根據權重來決定最終的樣式為何'
pubDate: 'March 26 2022'
heroImage: '/CSS-Image1.jpg'
tags: ['CSS','Notes']
category: 'CSS'
---

在 CSS 中經常會遇到需要覆蓋樣式的情況，這通常涉及到 CSS 的權重問題。當多個 CSS 使用在同一個元素並且產生衝突時，就會根據權重來決定最終的樣式為何。

## 權重比

首先要先知道在CSS選擇器中的各個權重

> 選擇器：ID ＞ Class ＞ HTML標籤
> 
> 比值：100 : 10 : 1

### EX.1：

```css
.header .title h1{ /* 權重為10+10+1 */
    font-size: 24px;
}
```

### EX.2：

```css
#menu{ /* 權重為100 */
    display: flex;
    justify-content: space-between;
}
```

## 若權重相同

在選擇器的權重都相同時

最後面的會覆蓋掉前面的

### EX.1：

```css
.wrap{
    background-color: #000000;
}
.wrap{ /* 覆蓋 background-color: #000000; */
    background-color: #f92672;
}
```

## !important

但如果你的CSS寫到權重非常大，階層非常多時

你會變得很難去覆蓋掉它

可以使用important

前面講的ID、Class、HTML權重都沒有important來的高

> important的權重為10000

### 使用方法

```css
.footer{
    color: black !important; /* 權重10000，優先度最高 */
    font-size: 24px !important; /* 權重10000，優先度最高 */
}
```

但通常到這時候，程式在維護或擴充時也會很困難麻煩

所以還是要盡量避免使用!important比較好

##### 以上皆為自己整理的筆記，僅供參考與複習使用。

