---
title: 'Using SWR for Better Data Fetching'
description: '傳統 API Data Fetching 經常需要依賴 state、redux 管理狀態，同時也要為效能優化去實作，如：Cache、Revalidate、Asynchronous、Dependent Fetching 等機制，但這些都可以透過 SWR 來簡化。'
pubDate: 'October 16 2024'
heroImage: '/React-Image1.png'
tags: ['Notes', 'React', 'SWR']
category: 'React'
---

傳統 API Data Fetching 經常需要依賴 state、redux 管理狀態，同時也要為效能優化去實作，如：Cache、Revalidate、Asynchronous、Dependent Fetching 等機制，但這些都可以透過 SWR 來簡化。

## 前言

最近工作上討論到過去專案上如何去優化載入速度及減少請求時，認識到 SWR 這個東西

因為當時的頁面反應速度非常慢，加上還是 Server Side Rendering (SSR) 的架構，導致每次載入頁面或做任何行為，
都會向後端發送請求，直到拿到新的頁面後再重新 Render。

據同事所說，當時每切換一個頁面需要花 2~3 秒時間才會載入，如果又同時在頁面上操作其他行為，還會不斷發送其他請求，更別提這是一個 EC，它還需要能夠乘載高併發流量，這根本不可能吧！

雖然在我入職後已經是前後端分離，且 SSR CSR 時機有明確定義，也用了 cache 加速載入，但還是覺得這故事很有趣！

## SWR（stale-while-revalidate）

先來認識一下 SWR

SWR 是 Next.js 團隊 Vercel 所開發的 Custom Hook

名稱源自於 stale-while-revalidate，是來自 [HTTP RFC 5861](https://datatracker.ietf.org/doc/html/rfc5861) 一種快取策略。

這種策略的核心概念是：

在第一次載入發送 API request 時，先將 response 的資料存入快取中，當又有相同的 request 時，就可以直接返回的快取資料（stale），同時在 backgorund 去 revalidate 快取是否過期。

如果資料發生變動時，就會再 fetch 一次取得新的資料並更新快取中的資料，這樣用戶也就不會在等待過程看到一片空白的畫面，而是由舊的變成新的。

![image](/swr.png)

這樣的機制能夠確保資料的即時性，還能有效減少伺服器的負擔和頻繁的請求，從而提高效能。

## HTTP Cache-Control

不過其實 [HTTP Cache-Control](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Headers/Cache-Control) 本身就能做到 stale-while-revalidate 並交給瀏覽器來處理了，那為何還要再用 SWR 這種套件再做一次相同的事情呢？

主要是因為 HTTP Cache-Control 比較適合管理靜態資源，像 API 這種比較屬於 dynamic data，透過 HTTP Cache-Control 只能 cache data，在一段時間內不需要再向 Server 請求，這機制比較屬於靜態的「緩存」行為。

因此當 API 資料需要根據不同頁面或行為更新時，HTTP Cache 就無法滿足需求了。

## 一般的 Data Fetching

一般在寫 fetch api 時通常會用 useEffect 在第一次載入時去觸發，然後存在 state 中

可能像這樣：

```js=
function Component() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setData(response);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (isLoading) return <p>Loading...</p>;
  return <div>{data}</div>;
}
```

不過當 API 一多重複性就高，你可能就會把它封裝成 Custom Hook

```js=
function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading };
}

export default useFetch;
```

然後在各別元件中使用

```js=
function Component() {
  const { data, error, isLoading } = useFetch('https://api.example.com/data');

  if (error) return <p>Error: {error}</p>;
  if (isLoading) return <p>Loading...</p>;
  return <div>{data}</div>;
}
```

而 SWR 套件也是這樣哦！

不過它多幫你實作了 Cache、Revalidate、Asynchronous、Dependent Fetching 等機制，讓你能很方便的運用他們。

## useSWR

最基本的用法就是 `useSWR`

主要接受兩個參數：

* key：唯一的鍵值，SWR 會根據 key 來做 cache，有點像快取的識別證，當 key 相同時，會直接從快取拿請求過的舊的資料。

* fetcher：用來負責執行 request，並返回 response 的函式。你可以自訂這個函式，SWR 會去呼叫他來處理 Data Fetching，並將結果傳回 useSWR 的 data。
    ```js=
    // 定義 fetcher 函式
    const fetcher = url => fetch(url).then(res => res.json());
    ```
綜合範例：

```js=
function Component() {
  const fetcher = url => fetch(url).then(res => res.json());
  const { data, error } = useSWR('https://api.example.com/data', fetcher);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;
  return <div>{data}</div>;
}
```

另外還有一個很棒的機制，通常會把 Data Fetching 封裝成 Hook 在不同元件中去複用，但這樣照理來說會有非常多個相同的 API request 對吧？

可實際上 SWR 因為是依賴「Global Cache」和「Deduplication」，所以原本多個相同的請求會只變成一個。

什麼是 Deduplication？

Deduplication 是 [重複數據刪除技術](https://zh.wikipedia.org/zh-tw/%E9%87%8D%E5%A4%8D%E6%95%B0%E6%8D%AE%E5%88%A0%E9%99%A4)，Deduplication 主要用於在短時間內「合併」相同的請求。

而在 SWR 中 softRevalidate 就是依賴 Deduplication 將重複的 API request 合併，避免觸發相同的 request。

這樣即便在載入過程中有多個元件同時需要相同的資料，SWR 也只會發出一次請求，之後相同的請求會直接從快取中取得結果。

## 參考來源

* [SWR: React Hooks for Data Fetching](https://swr.vercel.app/)
* [#09 No-code 之旅 — 怎麼在 Client-side 抓取資料？SWR 簡介](https://ithelp.ithome.com.tw/m/articles/10271427)
* [了解 SWR 的運作機制，How this async state manager works ?](https://medium.com/onedegree-tech-blog/%E4%BA%86%E8%A7%A3-swr-%E7%9A%84%E9%81%8B%E4%BD%9C%E6%A9%9F%E5%88%B6-how-these-async-state-managers-work-6236fc4f9f6)
* [Day27 X Stale While Revalidate Cache Policy](https://ithelp.ithome.com.tw/articles/10280724)