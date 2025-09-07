---
title: '[TS] Enhancing React Views with Enums'
description: '在設計元件時，面對不同的情境通常會需要撰寫各種不同的表達式。一般除了使用物件來定義之外，Enums 的寫法也是一種既優雅又高效的選擇。'
pubDate: 'December 1 2024'
heroImage: '/TS-Image.png'
tags: ['Notes', 'TypeScript', 'Enums']
category: 'TypeScript'
---

在設計元件時，面對不同的情境通常會需要撰寫各種不同的表達式。一般除了使用物件來定義之外，Enums 的寫法也是一種既優雅又高效的選擇。

## Enum

Enum 是在 TypeScript 中的語法，稱作「列舉」

在種類上也區分了 Numeric、String、Heterogeneous、Const、Reverse，基本用法可以參考 [文件](https://www.typescriptlang.org/docs/handbook/enums.html)，這邊就不贅述了。 

通常 Enum 在實作上會用來定義一組具「Immutability（不可變性）」且有意義的「集合」，例如：狀態、角色、事件等等。

而 Enums 的最大優勢就是在他的「可讀性」與「維護性」，假設今天有個情境需要同時 handle 不同角色下的權限，以及對應的事件...

你可能會使用物件表達的方式來設計，但物件是可變的，當今天在很多不同模組下去使用時，有可能因為一些限制必須在某個地方去做修改，這個物件也會變得越來越不穩定。

而相較之下，Enum 則能提供一種更穩定且結構化的方式來管理這類不可變的值。

優點：
* Enums 具不可變性，定義後就不能被修改，因此從根本上避免了值被意外改動的風險。
* TypeScript 的型別檢查能確保 Enum 的值只能取自預定義的範圍，減少意外錯誤。
* Enums 提供語意化的名稱，讓程式碼更直觀，便於理解和維護。

缺點：
* 使用一般的 Enums 時，Compile 後的程式碼會包含相關的映射，可能導致代碼體積略微增加（const enum 可解決此問題）。
* Enums 是靜態的，無法在執行時動態新增或修改值，不適合頻繁變動的場景。

## 使用情境

直接看例子：

假設你正在開發一個電商的結帳系統，這個系統需要根據使用者選擇的配送方式顯示不同的表單頁面。

最簡單無腦的寫法，你也可以用 switch case，但實際上差不多，雖然還是好閱讀的，但程式碼攏長，且太多重複性的結構，未來也不好在上面加以擴充。

```ts
export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState('selectDelivery');

  const renderStep = () => {
    if (currentStep === 'selectDelivery') {
      return <SelectDelivery />;
    } else if (currentStep === 'deliveryAddress') {
      return <DeliveryAddress />;
    } else if (currentStep === 'sevenStore') {
      return <SevenStore />;
    } else if (currentStep === 'reviewOrder') {
      return <ReviewOrder />;
    }
    return null;
  };

  return <div>{renderStep()}</div>;
};
```

進一步優化成物件表達的方式：

```ts
export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState('selectDelivery');

  const stepComponents: Record<string, JSX.Element> = {
    selectDelivery: <SelectDelivery />,
    deliveryAddress: <DeliveryAddress />,
    sevenStore: <SevenStore />,
    reviewOrder: <ReviewOrder />,
  };

  return <div>{stepComponents[currentStep]}</div>;
};
```

相較之下，已經省去攏長的 if else，程式碼也更簡潔，也更易於擴充，符合 clean code。

但要注意物件具傳參考的特性，如果未來沒有好好維護的話，有可能會在其他模組被誤用，影響原始物件。

而 TypeScript Enum 的型別安全性以及鍵值的不可變性，直接從根本上解決了誤用的問題。

使用 Enum 重構：

```ts
export enum CheckoutStep {
  SelectDelivery = 'selectDelivery',
  DeliveryAddress = 'deliveryAddress',
  SevenStore = 'sevenStore',
  ReviewOrder = 'reviewOrder'
}

// 對應的元件
const stepComponents: Record<CheckoutStep, JSX.Element> = {
  [CheckoutStep.SelectDelivery]: <SelectDelivery />,
  [CheckoutStep.DeliveryAddress]: <DeliveryAddress />,
  [CheckoutStep.SevenStore]: <SevenStore />,
  [CheckoutStep.ReviewOrder]: <ReviewOrder />,
};

export const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SelectDelivery);
  // 當取得對應的 key 後直接 render 對應的元件
  return <div>{stepComponents[currentStep]}</div>;
};
```

且你也能在元件中去傳遞 props，然後在個別元件中去做些操作。

## 總結

|   | 原始 if-else 寫法                      | 使用物件映射方法                                | 使用 Enum 優化後                  |
|----------|--------------------------------------|--------------------------------------------|-------------------------------------------|
| 可讀性   | if-else 結構較攏長                    | 利用物件簡化結構，但每個人寫法風格不同，可讀性差異大      | 利用 Record 將結構扁平化，簡潔易讀        |
| 型別安全性 | 任意字串均可作為鍵值                  | 任意字串作為鍵值，無類型安全保護            | 受 Enum 約束，防止不合法的值傳入            |
| 擴充性 | 每次新增都需手動修改多處邏輯          | 每次新增只需在物件中新增一個鍵值對          | Enum 與對應物件讓新增步驟變得簡單           |
| 程式碼結構 | 重複的 if-else 結構                  | 無重複結構，但需要手動處理邏輯映射           | 使用列舉和映射物件統一管理邏輯              |
| 維護性   | 隨著需求變動，if-else 需要修改多處     | 修改時需注意物件的管理，可能造成誤用         | Enum 與映射物件管理，修改時只需更新 Enum   |

## 參考來源

* [TypeScript: Handbook - Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
* [TypeScript | 善用 Enum 提高程式的可讀性 - 基本用法 feat. JavaScript](https://medium.com/enjoy-life-enjoy-coding/typescript-%E5%96%84%E7%94%A8-enum-%E6%8F%90%E9%AB%98%E7%A8%8B%E5%BC%8F%E7%9A%84%E5%8F%AF%E8%AE%80%E6%80%A7-%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95-feat-javascript-b20d6bbbfe00)
* [Conditional rendering component using Enums in ReactJS](https://www.geeksforgeeks.org/conditional-rendering-component-using-enums-in-reactjs/)