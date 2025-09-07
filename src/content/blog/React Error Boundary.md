---
title: 'Handling Errors Gracefully in React'
description: '錯誤處理對開發者一直都是門課題，不論系統穩定性或使用者體驗都十分重要。而在 React 16 中引入了 Error Boundaries 能夠用來捕捉渲染錯誤進而導致頁面崩潰的問題。'
pubDate: 'October 14 2024'
heroImage: '/React-Image1.png'
tags: ['Notes', 'React', 'ErrorBoundary']
category: 'React'
---

錯誤處理對開發者一直都是門課題，不論系統穩定性或使用者體驗都十分重要。而在 React 16 中引入了 Error Boundaries 能夠用來捕捉渲染錯誤進而導致頁面崩潰的問題。

## 前言

最近開始碰專案看到前人寫的 code，發現在 Router 進入點的地方都有多一層 ErrorBoundary 的 Component，也藉此認識到 ErrorBoundary 這個名詞。

後來我在查資料時左思右想，突然想起來，之前在我面試的時候好像也有被問到過，你是如何去 Handle Error 的，但我當時只描述了透過 try...catch 的做法

但其實 try...catch 是比較適用於命令式程式碼（imperative code），而 React 是聲明式（declarative code），所以錯誤捕捉是沒辦法用 try...catch 去替代的。

## 命令式與聲明式

什麼是命令式與聲明式？

* 命令式（Imperative）：
    命令式的撰寫風格通常是一步一步描述程式應該做什麼才能達到我的目的，用於處理明確、可預期的行為。

* 聲明式（Declarative）：
    聲明式則是只需要描述你想要什麼，表達意圖，不需要過多的步驟，只重視於想要的結果，相較命令式寫法也更簡潔。

舉個例子：

如果要寫一個過濾符合條件的式子，一般可能會去寫個迴圈遍歷整個 Array，找出符合條件的值，這就是命令式

```js
const arr = [1,5,2,3,7,9,0];
const target = 5;
let result = null;
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
        result = arr[i];
        break;
    }
}
```

而聲明式則是直接透過 HOF（High Order Function），像是 filter，告訴它我的條件，直接取得我想要的值

```js
const arr = [1,5,2,3,7,9,0];
const target = 5;
const result = arr.filter(item => item === target) || null;
```

這樣的寫法也是比較符合 FP（Functional Programming） 的，不過這個主題比較大，可能未來讀有一些內容後再分享～
    
## ErrorBoundary

在官方文件中也有講述到...

因為 React 的設計是聲明式的，因此它主要關注的是 UI 的渲染邏輯

在元件的渲染過程和生命週期方法中發生的錯誤，是發生在 React 自行管理的渲染階段中，try...catch 是沒辦法捕捉到的。

所以為了解決這個問題，React 才引入了 Error Boundaries

ErrorBoundary 是一種特殊的元件，主要來捕捉子元件樹中的錯誤，特別是在巢狀元件中發生錯誤時，可以防止整個頁面崩潰，並顯示一個 fallback 來提示用戶。

該元件寫法像這樣：

```js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 捕捉子元件的錯誤
  static getDerivedStateFromError(error) {
    // 更新 state 以顯示替代的 UI
    return { hasError: true };
  }

  // 用於記錄錯誤資訊
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
    // 你可以在這裡做錯誤記錄，例如傳到監控服務
  }

  render() {
    if (this.state.hasError) {
      // 當發生錯誤時，渲染替代 UI
      return <h1>出了點問題。請稍後再試。</h1>;
    }

    // 正常渲染子元件
    return this.props.children; 
  }
}

export default ErrorBoundary;
```

然後你可以把它當 Provider Component 來使用

```js
<ErrorBoundary>
  <Layout>
    <Home />
  </Layout>
</ErrorBoundary>
```

另外，目前 ErrorBoundary 只能透過 Class Component 來實作

因為 `componentDidCatch()` 方法只能在 Class Component 中使用的關係

且 React 目前為止也尚未提供一個原生的 Hooks 來替代這個功能，因此如果想捕捉子元件錯誤只能透過 Class Component。

所以你可能會發生一個狀況，你的程式碼架構中有一部分是 Class Component 用於處理 ErrorBoundary，另一部分是 Functional Component 用於處理畫面邏輯。

## 適用情境

ErrorBoundary 主要用途是用來捕捉渲染階段發生的錯誤

只會捕捉本身底下 Component Tree 裡的 Component 錯誤，且也無法捕捉本身引發的錯誤

所以需要注意，並不是幾乎所有情境下的錯誤捕捉都適合

無法捕捉的錯誤類型有：

* Event Handler

* Asynchronous Web API

* Server Side Rendering

* Error Boundaries 本身的錯誤

這些情況建議使用 try...catch 來捕捉就可以了。

## 參考來源

* [Catching rendering errors with an error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
* [React 捕捉錯誤｜使用原生函式 componentDidCatch + Error Boundaries 來捕捉元件錯誤](https://molly1024.medium.com/react-%E6%8D%95%E6%8D%89%E9%8C%AF%E8%AA%A4-%E4%BD%BF%E7%94%A8%E5%8E%9F%E7%94%9F%E5%87%BD%E5%BC%8F-componentdidcatch-error-boundaries-%E4%BE%86%E6%8D%95%E6%8D%89%E5%85%83%E4%BB%B6%E9%8C%AF%E8%AA%A4-6577cd4ed78d)
* [錯誤邊界-React](https://zh-hant.legacy.reactjs.org/docs/error-boundaries.html)