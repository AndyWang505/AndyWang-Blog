---
title: '前端效能優化(2) - Throttle'
description: 'Throttle 也是一種常見的效能優化方式，與 Debounce 類似，但不同的地方在 Throttle 能確保一個函式在一段時間內只會觸發一次，無論該函式被呼叫幾次。'
pubDate: 'July 19 2024'
heroImage: '/React-Image1.png'
tags: ['Notes', 'JavaScript', 'Frontend']
category: 'JavaScript'
---

Throttle 也是一種常見的效能優化方式，與 Debounce 類似，但不同的地方在 Throttle 能確保一個函式在一段時間內只會觸發一次，無論該函式被呼叫幾次。

## 節流 ( Throttle )

舉一個常見的例子

當在滑 Twitter 時，一個長頁面下需要監聽滾動同時又需要新增內容，因為要判斷是否已經滾動到接近底部再去新增內容，所以會在滾動的過程不斷去計算範圍

但使用 Throttle 可以有效的控制事件觸發的頻率，減少過度頻繁的計算與不必要的 api request

其他常見的用途還有：

* 即時搜尋
* 即時數據更新
* 調整視窗大小時重新布局
* 快速點擊事件
* 拖拽元素

## Throttle 與 Debounce 比較

* Throttle：執行過程中固定時間間隔內執行一次。適合需要持續反饋但又不希望過於頻繁的場景。

* Debounce：停下來等待一段時間後執行，如果在等待期間再次調用則重新計時。適合等待用戶操作完成後再執行的場景。

## 實作

實作 Throttle 的方向跟 Debounce 類似：
* closure
* setTimeout
* 接收兩個參數：要執行 Throttle 的 callback function 和 delay 時間

```js
function throttle(func, delay = 1000) {
  let timer = null;
  // ...args 用於接收所有參數
  return (...args) => {
    // 如果 timer 還在秒數內則直接 return
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    // 確保 func 能立即執行
    func.apply(this, args);
  };
}

// callback function
function handleScroll() {
  let clientHeight - document.documentElement.clientHeight;
  let scrollTop - document.documentElement.scrollTop;
  let scrollHeight - document.documentElement.scrollHeight;
  // 判斷到達底部 90% 位置新增內容
  if ((scrollTop + clientHeight) / scrollHeight >= 0.9) {
    for(let i=0; i<=10; i++) {
      console.log("一段新內容");
    }
  }
}

// 使用方法
const throttledHandleScroll = throttle(handleScroll, 1500);
window.addEventListener('scroll', throttledHandleScroll);
```

Throttle 的目的是限制某個函數在一段時間內只能執行一次

一開始將 timer 設為 null 表示沒有在計時，如果 timer 不是 null 代表正在計時，則直接 return。

如果 timer 為 null 則執行 `setTimeout()` 開始計時，當 `setTimeout()` 計時結束會重製 timer
，所以 `func()` 在每個 delay 時間內只會執行一次，即使 timer 不斷觸發。

## 封裝成 React Hook

通常 Throttle 有兩種情況

* 立即執行：在第一次呼叫的時候執行，然後透過 timer 在 delay 時間內阻止函式再次執行。
* 延遲執行：在一段時間內只執行一次，通常是在 delay 時間結束後執行最後一次函式，在這段時間內的多次事件觸發將被忽略。

可以根據自己需求調整 `func()` 要寫在哪

如果想改成立即執行，可以寫在 `setTimeout()` 外，但要注意 hook 可能會被頻繁使用，因此建議寫在 `setTimeout()` 內

建立 `/hooks` 資料夾，創建 `useThrottle.js` 檔案

```js
import { useEffect, useRef } from 'react';

function useThrottle(func, delay) {
  const timerRef = useRef(null);

  const throttledFunc = (...args) => {
    if (timerRef.current) return;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      // 一段時間執行一次
      func(...args);
    }, delay);
  };

  return throttledFunc;
}

export default useThrottle;
```

匯入到 Component 中就可以使用了

```jsx
import React, { useEffect } from 'react';
import useThrottle from './useThrottle'; // useThrottle hook

function ScrollComponent() {
  const handleScroll = () => {
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;

    if ((scrollTop + clientHeight) / scrollHeight >= 0.9) {
      for (let i = 0; i <= 10; i++) {
        console.log("一段新內容");
      }
    }
  };

  // 使用 useThrottle 來限制 handleScroll 的執行頻率
  const throttledHandleScroll = useThrottle(handleScroll, 1500);

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return <div>ScrollComponent</div>;
}

export default ScrollComponent;
```