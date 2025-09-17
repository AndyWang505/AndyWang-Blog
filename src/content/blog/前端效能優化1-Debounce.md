---
title: '前端效能優化(1) - Debounce'
description: 'Debounce 是一種常見的效能優化方式，主要用於限制高頻事件的觸發次數，例如：當你使用 Google 搜尋某個關鍵字，它並不會在你輸入過程不斷搜尋，而是當你停下輸入後才去做搜尋的動作。'
pubDate: 'July 17 2024'
heroImage: '/React-Image1.png'
tags: ['Notes', 'JavaScript', 'Frontend']
category: 'JavaScript'
---

Debounce 是一種常見的效能優化方式，主要用於限制高頻事件的觸發次數，例如當你使用 Google 搜尋某個關鍵字
，它並不會在你輸入過程不斷搜尋，而是當你停下輸入後才去做搜尋的動作。

## 防抖 ( Debounce )

防抖 ( Debounce ) 主要用途在先前描述已經有簡單介紹過，當然不僅僅是用在搜尋上

常見的用途還有：
* 滾動事件處理
* 拖拽事件
* 表單提交
* 自動保存
* API 請求

透過 Debounce 就能夠減少不必要的操作或請求

主要關鍵還是在控制執行頻率，同時又不影響功能正常運作的場景，比較適合用於不需要立即回應，可以稍微延遲的操作

## 實作

要實作 Debounce 主要方向有：
* closure
* setTimeout
* 通常接收兩個參數：要被 debounce 的原始函式和 delay 時間

範例：

```js
function debounce(func, delay = 1000) {
  let timer;
  // ...args 用於接收所有參數
  return function(...args) {
    // 清除舊的 timer 後重新計時
    clearTimeout(timer);
    // delay 時間到執行 func
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 原始函式
function handleSearch(query) {
  console.log("Searching for:", query);
}

// 使用方法
const debouncedSearch = debounce(handleSearch, 1500);
searchInput.addEventListener('input', debouncedSearch);
```

這邊的核心概念就是透過 `clearTimeout()`，當每次觸發事件時去清除舊的 timer 後再重新計時，直到停下來沒有再觸發，它就會在新 `setTimeout()` 中等待到計時結束，呼叫 `func()`

Debounce 技術的應用場景非常多，上述的程式碼只需要根據你的需求去調整原始函式和 delay 時間就可以了～

## 封裝成 React Hook

這邊也可以將它封裝成 Hook 來去做應用，未來也便做 Unit Test

建立一個 `/hooks` 資料夾，創建 `useDebounce.js`

```jsx
// ./useDebounce.js
import { useCallback, useRef } from 'react';

function useDebounce(func, delay = 1000) {
  const timerRef = useRef(null);

  return useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
}

export default useDebounce;
```

在 Component 中直接匯入就可以使用了

```jsx
import React, { useState } from 'react';
import useDebounce from './useDebounce'; // 先前封裝的 hook

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  // 原始函式
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // 這裡可以根據需求做調整
  };

  // 使用方式
  const debouncedSearch = useDebounce(handleSearch, 1500);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    debouncedSearch(newValue);
  };

  return (
    <input 
      type="text"
      value={searchTerm}
      onChange={handleInputChange}
      placeholder="Search..."
    />
  );
}
```