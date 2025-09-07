---
title: 'jQuery 濃縮精華'
description: 'jQuery是HTML、CSS、JavaScript撰寫出來的library，用來製作動畫效果，雖然撰寫上很方便，但當程式碼龐大時會因寫法的關係較難維護'
pubDate: 'December 05 2021'
heroImage: '/JS-Image1.jpg'
tags: ['jQuery','Notes']
category: 'JavaScript'
---

jQuery是HTML、CSS、JavaScript撰寫出來的library，用來製作動畫效果，雖然撰寫上很方便，但當程式碼龐大時會因寫法的關係較難維護

## 前情提要

jQuery 1.x與2.x版本的差異，在[官網](https://jquery.com/browser-support/)Browser Support有提到1.x可支援到ie6以上，2.x可支援到ie9以上，其他還有

* Chrome、Edge、Firefox (Current - 1) and Current
* Safari (Current - 1) and Current
* IOS 7+
* Android 4.0+

## 起手式

```javascript
$(document).ready(function(){
    //確保jQuery載入瀏覽器中才執行當中的程式
})
```
## 選擇器與事件

寫法

```javascript
$(document).ready(function(){
    $(".header h1").hide();
    //選擇器用法，原生 document.queryselector(".header h1")
})
```
## 互動效果

### [字典查閱](https://oscarotero.com/jquery/)

### 隱藏或顯示

hide/show

```javascript
$(document).ready(function(){
    $(".header h1").hide();
    //隱藏
    $(".header h2").show();
    //顯示
})
```
toggle

```javascript
$(document).ready(function(){
    $(".button").click(function{
        $(".header").toggle();    
        //toggle切換開啟或隱藏
    })
})
```
### 滑動

slideDown/slideUp

```javascript
$(document).ready(function(){
    $(".button").click(function(event){
        $(".header").slideDown(1000);    
        //slide滑動效果，可帶transition參數毫秒
    })
})
```
### 淡入淡出

fadeToggle/fadeIn/fadeOut

```javascript
$(document).ready(function(){
    $(".button").click(function(event){
        $(".text").fadeToggle();    
        //fadeToggle淡入淡出，也可帶參數
        //fadeIn預設隱藏的東西打開
        //fadeOut預設隱藏的東西關閉
    })
})
```
### 自訂效果(新增或移除class)

toggleClass

```javascript
$(document).ready(function(){
    $(".button").click(function(event){
        $(".text").toggleClass("active");    
        //假設active是一個效果，按下button後，若已存在active則會移除，否則新增
    })
})
```
### 鏈式寫法

```javascript
$(document).ready(function(){
    $(".button").click(function(event){
        $(".header").slideDown(1000).slideUp(1000);
        //透過鏈式寫法可串連多個效果
    })
})
```
### 取消默認行為

preventDefault

```javascript
$(document).ready(function(){
    $(".close").click(function(event){
        event.preventDefault();  
        //取消了點擊後的行為
    })
})
```
### 載入CSS Style

.css()

```javascript
$(document).ready(function(){
    $(".box").css("width","500px");
    //box class載入了寬度500px
})
```
### 延遲

delay

```javascript
$(document).ready(function(){
    $(".close").click(function(event){
        $(".box").delay(500).slideUp(); 
        //延遲0.5秒後向下滑動
    })
})
```
### 中斷動畫效果

stop

效果可看[codepen](https://codepen.io/zuqpbbgu-the-encoder/pen/yLpxzre)

```javascript
$(document).ready(function(){
    $(".close").click(function(event){
        $(".box").stop().slideToggle(3000); 
        //點擊可以中斷動畫
    })
})
```
## 操控網頁元素

### this操作本身元素

this

```javascript
$(document).ready(function(){
    //功能：希望點擊到該點擊的元素會有新增active效果
    $(".menu li").click(function(event){
        // $(".menu li").addClass('active');
        //會使所有li套用active效果
        $(this).addClass('active');
        //會使該被點擊的li套用active效果
    })
})
```
### parent父階層元素

parent()

```javascript
$(document).ready(function(){
    //功能：希望點擊到該點擊元素的父元素會有新增active效果
    $(".addCart").click(function(event){
        $(this).parent.toggleClass('active');
        //該被點擊元素的父元素會新增active，如果已存在active將移除
    })
})
```
### siblings同層元素

siblings()

```javascript
$(document).ready(function(){
    //功能：希望只有該被點擊元素才有active效果
    $(".addCart").click(function(event){
        $(this).addClass("active").siblings().removeClass("active");
        //該被點擊元素會先新增active class，並將自己以外的同層移除active class
    })
})
```
### find尋找子元素

find()

```javascript
$(document).ready(function(){
    //功能：希望指定該被點擊的元素增加active效果
    $(".cart li").click(function(event){
        $(this).find("h3").toggleClass("active");
        //點擊元素後尋找元素內的h3，新增或移除active
    })
})
```
### html/text載入內容

```javascript
$(document).ready(function(){
    $(".box").html("<h1>hello world</h1>");
    //新增html h1
    $(".box h1").text("hello world");
    //在h1中新增文字
})
```
### click/on差別

```javascript
$(document).ready(function() {
  // click範例
  $(".box").click(function(event) {
    event.preventDefault();
    //要執行的程式碼
  });

  // on 範例
  $('body').on('click', '.selector', function(event) {
    event.preventDefault();
    //要執行的程式碼
  });
});
```
## 常用小技巧

### attr動態新增html標籤屬性

```javascript
$(document).ready(function() {
    $("img").attr("width","50");
    //img新增寬度50px
    //一次性新增標籤屬性
});
```

### top置頂滑動

animate

```javascript
$(document).ready(function() {
    $(".top a").click(function(event){
        event.preventDefault();
        $("html,body").animate({
            scrollTop: 0
        },700);
        //滑動0.7秒到置頂
    });
});
```

##### 以上皆為自己整理的筆記，供參考與複習使用。