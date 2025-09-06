---
title: '淺談 JavaScript 單執行緒語言如何做到異步運算'
description: 'JavaScript 是單執行緒語言，照理來說應該一次只能做一件事情，但他卻能做到非同步進程，不讓程式被 blocked，這要歸功於 Event Loop，但 Event Loop 並不存在語言本身，而是由 runtime 來實現。'
pubDate: 'June 20 2024'
heroImage: '/JS-Image2.png'
tags: ['Notes','JavaScript','Asynchronous']
category: 'JavaScript'
---

JavaScript 是單執行緒語言，照理來說應該一次只能做一件事情，但他卻能做到非同步進程，不讓程式被 blocked，這要歸功於 Event Loop，但 Event Loop 並不存在語言本身，而是由 runtime 來實現。

## 同步與非同步

首先先釐清同步與非同步的概念

### 同步 ( synchronous )

JavaScript 屬於單執行緒語言，就是程式碼是逐一執行，必須先完成當前的任務才能繼續執行下一段任務，此概念就是同步

而這樣設計的好處就是不會有 Race condition 和 Deadlock 問題

但當程式需要做一些複雜且耗時的操作時，可能就會讓程式整個 blocking，等待至該程式執行完才會繼續往下執行

例如：向後端發送 api request，等待期間可能就會造成主執行緒阻塞，無法執行其他程式

大家或多或少應該也有過在使用某個平台，但程式整個卡住的情況吧，大概就像那樣

> #補充：Deadlock 是由多執行緒在等待彼此釋放資源的情況，造成這些執行緒無法繼續執行，與 Blocking 不同，Blocking 是因主執行緒在執行某些耗時的操作，造成阻塞無法繼續執行

### 非同步 ( asynchronous )

而非同步概念，則是當碰到需要等待或運算的工作時，不用在那邊去等待他完成，可以直接先往下執行

過去還不清楚的時候，滿多人會將非同步和多執行緒混淆，但這兩者其實完全不一樣，非同步並不會產生出一條執行緒

多執行緒的工作方式是平行處理 ( Parallel Computing )，主執行緒會將工作分配給其他執行緒去分工，而這些執行緒都是同時進行的

那回到 JavaScript 的非同步，先前有講到，JavaScript 是單執行緒語言，那他是怎麼做到非同步進程還不會造成阻塞的

這就要說到 JavaScript 的 Event Loop

## Event Loop

Event Loop 主要是為了避免網頁因為處理耗時的工作而造成瀏覽器阻塞，而其機制並不存在於語言本身，而是在 runtime 上 ( 如瀏覽器的 V8 引擎或 Node.js )

其中有幾個概念需要了解：

* 堆疊 ( Stack )：抽象的資料結構，採用後進後出的規則 ( LIFO )，執行期間將函式與變數都 push 到 Stack 中，當程式執行完時將其 pop 出來，直到 Stack 清空。

* 佇列 ( Queue )：抽象的資料結構，採用先進先出的規則 ( FIFO )，在執行期間將需要等待處理的事件或任務放在 Queue 中，直到 Stack 清空後才被取出來處理。

* 堆積 ( Heap )：一個動態分配記憶體的區域，物件和變數在程式運行時可以被分配在這裡。

* 事件循環 ( Event Loop )：事件循環會不斷監控 Stack 的狀態，如果 Stack 已清空，則將 Queue 之中的程式 push 到 Stack 中執行。

![image](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop/the_javascript_runtime_environment_example.svg)

## 執行流程

在了解每個抽象概念如何運作後，可以來看幾個範例

### Call Stack

在同步的過程中，JavaScript 執行時，會先將執行到的任務放入 Call Stack 中，等待執行完畢後再將任務移出，直到清空

```js=
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  var squared = square(n);
  console.log(squared);
}

printSquare(4);
```

![image](/material/event-loop1.png)

你也可以用遞迴的方式來呼叫，想當然就是 Call Stack 有著永遠都處理不完的任務

```js=
function foo() {
  return foo();
}
foo();
```

### Callback Queue

再來看看非同步 setTimeout 怎麼運作的，這邊就會用到 Event Loop 和 Callback Queue 來處理了

下面流程圖我就用數字表示了，不然要畫太多w

```js=
console.log('1');

setTimeout(function cb() {
  console.log('2');
}, 5000);

console.log('3');

// 最終 console 的執行結果是 1 3 2
```

另外，因為 setTimeout 這類的 API 是瀏覽器提供的，他並不存在 V8 引擎中，所以可以看到他是在 Web API 上運行

![image](/material/event-loop2.png)

上述流程圖步驟：

1. `mian()` 主程式先進來
2. `console.log('1')` 進入 Call Stack
3. `console.log('1')` 執行完印出 1 後 pop
4. `setTimeout` 函式進入 Call Stack
5. `setTimeout` 函式呼叫 Web APIs 設定 5000ms 的 timer
6. `setTimeout` 函式呼叫完後 pop
7. `console.log('3')` 進入 Call Stack
8. `console.log('3')` 執行完印出 3 後 pop
9. `main()` 主程式結束 pop
10. Web APIs 計時結束，`cb` 函式加到 Callback Queue
11. Event Loop 檢查 Call Stack 是否已清空，確定清空後將 `cb` 回調函式加進 Call Stack
12. `cb` 回調函式加進 Call Stack
13. `console.log('2')` 進來
14. `console.log('2')` 執行完印出 2 後 pop
15. `cb` 回調函式執行完後 pop

可能有人會說因為 setTimeout 5000ms 的關係，那就把 setTimeout 改成 0，執行結果也還會是 1 3 2，當然現實不可能這樣寫

## Macro Task 與 Micro Task

在 JavaScript 中的非同步任務其實還有細分成 宏任務 ( Macro Task ) 與微任務 ( Micro Task )

而兩者的執行順序不同，如果不清楚其中的差別，很容易出現不符合預期的執行結果

* 宏任務 ( Macro Task )：指一般的非同步任務，如：setTimeout、setInterval、DOM Event、Ajax，而這些都是透過 Web APIs 來提供的，當完成後會加到 Callback Queue 排隊。

* 微任務 ( Micro Task )：指比 Macro Task 還更小的任務，像是：Promise、MutationObserver、queueMicrotask，和 Macro Task 不同的是，他們是由 JavaScript 引擎本身執行，而不是在 Web APIs，且完成後也不會加到 Callback Queue，而是優先權更高的 Micro Task Queue。

範例：

```js=
console.log('1');

setTimeout(function () {
  console.log('2');
}, 0);

Promise.resolve()
  .then(function () {
    console.log('3');
  })
  .then(function () {
    console.log('4');
  }); 

// 執行結果為 1 3 4 2
```

## 參考來源

* [所以說event loop到底是什麼玩意兒？](https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=116s)
* [what-is-event-loop](https://www.explainthis.io/zh-hant/swe/what-is-event-loop)
* [The event loop](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Event_loop)
* [理解 JavaScript 的 Event Loop 機制: 並行處理(Concurrency)的秘密](https://notes.boshkuo.com/docs/Javascript/js-event-loop)