---
title: 'CA: Data Transfer Object (DTO)'
description: '為了解決層與層之間的耦合，內部核心 Entities、Use Cases 去依賴外部格式，可能會造成今天欄位異動，連動核心需要跟著去修改，違反了依賴反轉原則（DIP），日後要擴充或是重構也是一大挑戰。'
pubDate: 'September 11 2025'
heroImage: ''
tags: ['Notes', 'DTO', 'Clean Architecture']
category: 'Clean Architecture'
---

為了解決層與層之間的耦合，內部核心 Entities、Use Cases 去依賴外部格式，可能會造成今天欄位異動，連動核心需要跟著去修改，違反了依賴反轉原則（DIP），日後要擴充或是重構也是一大挑戰。

## 前言

DTO 在 Pattern of Enterprise Application Architecture（PoEAA）與 Clean Architecture（CA）書中也都曾提到，但兩者的語意其實不太一樣。

目前大家在系統設計或規劃（Planning）階段所說的 DTO 通常是指 CA 裡的 DTO，也是本文要介紹的主題，如果對分散式系統有興趣也可以研究看看 PoEAA 這本書。

## PoEAA 與 CA 之 DTO

- **PoEAA 的 DTO**  
    Martin Fowler 在 2002 年的 PoEAA 中提出 DTO，主要用在分散式系統。那時候遠端呼叫成本高（例如 EJB、CORBA），一個簡單的查詢可能要多次網路 round-trip。  
    DTO 在這裡的目的是 **效能最佳化**：把多個欄位或物件封裝成一個單純的資料結構，序列化後一次傳送，減少頻繁的呼叫。

- **CA 的 DTO**  
    在 Uncle Bob 的 Clean Architecture 中，DTO 的定位完全不同。它並不是為了解決效能問題，而是為了 **降低層與層之間的耦合**。  
    在這裡，DTO 用來定義「Use Case 輸入與輸出的資料結構」，避免核心邏輯去依賴資料庫 schema、ORM entity 或 API 的 request/response 格式。

同樣叫 DTO，但 PoEAA 解決的是「網路傳輸效能」問題，而 CA 解決的是「架構耦合」問題。

## DTO 究竟何物

抽象來說，DTO 是 **一個沒有行為的資料容器**，它只有欄位，沒有業務邏輯。  
它的目標不是「聰明的物件」，而是「乾淨的資料結構」。  

在 CA 裡，DTO 的價值在於：  
- 幫助 Use Case 定義「輸入輸出契約」  
- 保證核心層與外部框架解耦  
- 減少資料洩漏（不會把敏感欄位傳到 UI 或 API）

以餐廳來比喻的話： 

> 如果把「資料庫 schema」比喻成餐廳的冷凍庫（裡面有各種原材料），那麼 DTO 就像「端上餐桌的菜」。 客人（前端或 API 使用者）只需要看到準備好的餐點，而不是廚房裡的食材細節。

## 分層架構裡 DTO 的職責

在 Clean Architecture 的典型分層架構中，系統可以視為由核心往外擴展同心圓結構，主要分成四層：

### 分層架構

1. **Entities（Enterprise Business Rules）**：最內層，定義核心業務規則，與外部技術完全無關。

1. **Use Cases（Application Business Rules）**：定義應用邏輯，描述系統要完成的動作與流程，並規範輸入與輸出的需求。

2. **Interface Adapters**：負責「轉換」資料格式，使得核心層（Entities、Use Cases）能和外部溝通。這層通常會再進一步被拆分成：
    - Controllers：把外部請求轉成 Use Case 能理解的輸入（例如 API request → Input DTO）。
    - Presenters：把 Use Case 的輸出轉換成外部能使用的格式（例如 Output DTO → ViewModel / API response）。
    - Gateways：作為資料存取介面，將核心層需要的資料抽象化，避免直接依賴資料庫或 ORM。

3. **Frameworks & Drivers**：最外層的具體實作，包括資料庫、Web 框架、UI、裝置等等。

![image](/ca.jpg)

而在這個架構中，DTO（Data Transfer Object）主要存在於 Use Cases 與 Interface Adapters 的交互之間，目的是為了：

- **定義輸入輸出結構**：Use Case 不需要知道 HTTP request 或資料庫 schema，只需要透過 Input DTO 與 Output DTO 來定義「需要什麼資料」與「會回傳什麼資料」。

- **降低耦合**：Use Case 不會直接依賴 ORM 或 API 格式，而是依賴 DTO。這樣外部改變（例如 API 欄位調整、DB schema 變動）不會直接衝擊核心邏輯。

- **保護核心與資料安全**：DTO 能過濾敏感或不必要的欄位（例如 passwordHash 或 createdAt），避免洩漏內部實作細節給外部使用者。

## 實務面

假設以前端來說好了

在開發中，API Response 往往直接來自後端資料庫或服務，格式可能包含：

- 命名習慣不一致（例如 `snake_case` vs `camelCase`）
- 額外的技術性欄位（例如 `updated_at`、`internalNotes`）
- 甚至包含 敏感資料（例如 `passwordHash`）

如果這些 Response 被直接傳遞到 業務邏輯層或 UI Component，會導致：

- 耦合性過高：後端一旦改動 schema，前端大範圍受影響。
- 資料安全問題：敏感資料欄位容易被誤用或直接被顯示。
- 可維護性差：畫面與資料層混亂，測試困難。

好的做法 With DTO：

```typescript
// DTO
export interface OrderDTO {
  id: string;
  userId: string;
  totalAmount: number;
  createdAt: Date;
}

// Mapping function：從 API Response → DTO
function mapOrderResponseToDTO(response: any): OrderDTO {
  return {
    id: response.id,
    userId: response.user_id,
    totalAmount: response.total_amount,
    createdAt: new Date(response.created_at),
  };
}

// React Component 
function OrderCard(props: { order: OrderDTO }) {
  return (
    <div>
      <p>Order #{props.order.id}</p>
      <p>Total: {props.order.totalAmount}</p>
      <p>Created: {props.order.createdAt.toLocaleDateString()}</p>
    </div>
  );
}

// fetch API
async function fetchOrders(): Promise<OrderDTO[]> {
  const res = await fetch("/api/orders");
  const data = await res.json();
  return data.map(mapOrderResponseToDTO);
}

```

每位角色的職責：

- `mapOrderResponseToDTO`

    扮演「轉換層」的角色，負責處理 API Response 與前端 DTO 的差異。

    這層只會寫一次，但好處是 集中管理格式轉換，未來 API schema 改動時，不會影響所有 component。

- `OrderDTO`

    是「前端業務邏輯與 UI 的標準格式」。

    這裡把 createdAt 強制轉為 Date，代表前端統一用物件處理日期，而不是到處解析字串。

- `OrderCard`
  
    是消費 DTO 的 component，完全不需要知道 API 格式。

    專注於「如何顯示訂單資訊」。

- `fetchOrders`

    作為資料取得的入口，回傳的型別就是 `OrderDTO[]`。

    這意味著 所有業務邏輯或 UI 都只需要處理乾淨的 DTO。

## 參考來源

* [再談Clean Architecture三原則](https://teddy-chen-tw.blogspot.com/2020/08/clean-architecture.html)
* [PoEAA：Data Transfer Object](https://www.youtube.com/watch?v=Ob9tQTRd04A)
* [沒有要給你知道那麼多—DTO 設計應用](https://ithelp.ithome.com.tw/articles/10353906)