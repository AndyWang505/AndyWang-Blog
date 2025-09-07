---
title: '貫穿所有軟體開發的 SOLID 原則'
description: 'SOLID 是一組通用的軟體設計原則，當系統規模不斷擴大時，維護和擴充的工作會越來越困難，而 SOLID 能引導開發者設計更靈活、更易於維護與擴充的軟體架構。'
pubDate: 'August 1 2024'
heroImage: '/SOLID.png'
tags: ['心得', 'OOP', 'SOLID']
category: 'Clean Code'
---

SOLID 是一組通用的軟體設計原則，當系統規模不斷擴大時，維護和擴充的工作會越來越困難，而 SOLID 能引導開發者設計更靈活、更易於維護與擴充的軟體架構。

## S.O.L.I.D

雖然大多 SOLID 和 OOP 比較有關，但背後的概念其實可以套用到各種軟體設計模式下。

SOLID 主要由 5 個設計原則組成：

* 單一職責原則 ( Single-Responsibility Principle，SRP )

* 開放封閉原則 ( Open–Closed Principle，OCP )

* 里氏替換原則 ( Liskov Substitution Principle，LSP )

* 介面切離原則 ( Interface Segregation Principle，ISP )

* 依賴反轉原則 ( Dependency Inversion Principle，DIP )

取開頭字母組合起來就是 S.O.L.I.D

## 單一職責原則 ( Single-Responsibility Principle，SRP )

> 原文定義：A class should have only one reason to change.

翻譯成中文就是說，一個模組應有且只有一個理由會使其改變。

不過這跟後來得出的定義有些不同，其中原文是將 職責（responsibility）定義成 one reason to change.

後來再經過一些推導之後才得出我們現在所知道的 單一職責原則。

雖然大家對 SRP 都有不同的理解，但大多都遵循一個核心概念，就是

**＂一個類別或函式應該只負責一個單一職責。＂**

更簡單的說就是，**一個類別或函式只做一件事。**

以 Clean Code 書上範例來說：

假如我們的任務是撰寫一個小型日曆，可能會實作兩個不同的抽象

```js
class Calender {}
class Event {}
```

`Event` 類別主要包含了關於事件的時間和 Metadata，而 `Calendar` 類別則包含這些事件，你可以在 `Calendar` 新增一個或多個 `Event` 類別的實例，也可以刪除它們

```js
class Calender {
  addEvent(event) { ... }
  removeEvent(event) { ... }
}
```

隨著時間的推移，`Calendar` 為因應需求新增了其他功能，如：搜尋特定日期的事件，以及輸出成其他格式的功能

```js
class Calendar {
  addEvent(event) { ... }
  removeEvent(event) { ... }
  getEventBetween(stateDate, endDate) { ... }

  setTimeOfEvent(event, startTime, endTime) { ... }
  setTitleOfEvent(event, title) { ... }

  exportFilteredEventsToXML(filter) { ... }
  exportFilteredEventsToJSON(filter) { ... }
}
```

接著會發現，這個 `Calendar` 的複雜度越來越高，同時也衍生了，高耦合度、測試困難、擴充性差等問題。

如果今天需要更改其中的功能，像是需要修改事件的儲存方式，可能會引發連鎖反應，
影響到 `addEvent`、`removeEvent`、`getEventBetween`方法，甚至可能影響到輸出格式的功能。

而這些就是潛在風險，只要有變更都有可能引入新的 Bug，而 SRP 有做好的話就能避免不必要的變更，減少 Bug 出現的風險。

如果將不同職責的功能拆開並封裝，可以重構成以下的結構：

```js
class EventManager {
  addEvent(event) { ... }
  removeEvent(event) { ... }
  getEventBetween(startDate, endDate) { ... }
}

class EventModifier {
  setTimeOfEvent(event, startTime, endTime) { ... }
  setTitleOfEvent(event, title) { ... }
}

class EventExporter {
  exportToXML(events, filter) { ... }
  exportToJSON(events, filter) { ... }
}

class Calendar {
  constructor() {
    this.eventManager = new EventManager();
    this.eventModifier = new EventModifier();
    this.eventExporter = new EventExporter();
  }
  ...
}
```

這樣的結構也更符合單一職責原則，使每個抽象更具凝聚力，也更易於維護與擴充。

不過上面看起來似乎不難（？

其實 SRP 比較難實現的地方在於，什麼時候該劃分職責，這個劃分時機的定義通常會因為需求或環境而改變，如果硬是要實現 SRP 也可能會讓程式碼更複雜，所以其實很難完美的在專案中實現。


## 開放封閉原則 ( Open–Closed Principle，OCP )

> 原文定義：Software entities (class, modules, functions, etc.) should be open for extension, but closed for modification.

翻成中文就是說，軟體實體 ( 類別、模組、函數等 ) 應該對擴展開放，對修改封閉。

這段話有兩個重點：
* 開放擴展 ( Open for extension )：這代表系統應該要是靈活的，能夠輕易地擴充新功能或新行為到現有的程式碼中。

* 封閉修改 ( Closed for modification )：表示擴充新功能時，不應該修改到現有的程式碼，原本經過測試和部屬的程式碼應保持穩定。

這個原則的核心概念是

**＂當需求變化時，應該透過加入新的程式碼來擴充該系統的功能，而不是去修改現有的程式碼。＂**

這裡用一個處理支付方式的例子解釋：

```js
class PaymentProcessor {
  processPayment(paymentType, amount) {
    if (paymentType === 'credit_card') {
      // 處理信用卡支付
      console.log(`Processing credit card payment of $${amount}`);
    } else if (paymentType === 'paypal') {
      // 處理PayPal支付
      console.log(`Processing PayPal payment of $${amount}`);
    }
    //...
  }
}

const processor = new PaymentProcessor();
processor.processPayment('credit_card', 100);
processor.processPayment('paypal', 50);
```

在這個例子中，如果要新增新的支付方式，就必須更改 `PaymentProcessor`，這可能造成現有的邏輯被破壞，也可能會有後續像是版控合併、測試困難等問題

使用 OCP 重構的話：

```js
class PaymentProcessor {
  constructor() {
    this.paymentMethods = {};
  }
  // 用來提供外部註冊新的支付方式
  registerPaymentMethod(type, processor) {
    this.paymentMethods[type] = processor;
  }
  processPayment(paymentType, amount) {
    if (this.paymentMethods[paymentType]) {
      return this.paymentMethods[paymentType].process(amount);
    }
    throw new Error('Unsupported payment type');
  }
}

// 支付方式
class CreditCardPayment {
  process(amount) {
    console.log(`Processing credit card payment of $${amount}`);
  }
}
class PayPalPayment {
  process(amount) {
    console.log(`Processing PayPal payment of $${amount}`);
  }
}

const processor = new PaymentProcessor();
processor.registerPaymentMethod('credit_card', new CreditCardPayment());
processor.registerPaymentMethod('paypal', new PayPalPayment());

processor.processPayment('credit_card', 100);
processor.processPayment('paypal', 50);

// 增加新的支付方式
class ApplePayPayment {
  process(amount) {
    console.log(`Processing Apple Pay payment of $${amount}`);
  }
}

processor.registerPaymentMethod('apple_pay', new ApplePayPayment());
processor.processPayment('apple_pay', 75);
```

在這例子中，實現了 OCP 的對外擴展開放，對內修改封閉的原則，如果需要擴充新的支付方式，只需要創建一個新的類別，並註冊到 `PaymentProcessor` 中，不需要修改現有的程式碼。

## 里氏替換原則 ( Liskov Substitution Principle，LSP )

> 原文定義：Subtypes must be substitutable for their base types.

翻成中文就是，子類別要能替換掉父類別。

該定義指出，**所有類別都應該能夠被子類別替換，且不影響原有的功能**

從定義來看有點含糊，這裡直接用計算各種形狀面積的例子，並搭配程式碼來解釋

假設我們有一個類別 `Rectangle`，提供一些基本的方法，像是：

`setWidth()` 和 `setHeight()`，然後我們設計了 `Square` 類別繼承了 `Rectangle`，
但是 `Square` 因為自己的需求需要修改兩邊的長度，所以需要 override，但這就違反了 `Rectangle` 的定義，因為在 `Rectangle` 裡兩邊可以有不同的長度。

而這會造成其他繼承 `Rectangle` 的子類別無法正確地使用 `Rectangle` 成員函式

這就是違反了 LSP

```js
// 長方形
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}
// 方形
class Square extends Rectangle {
    constructor(size) {
        super(size, size);
    }
    setWidth(width) {
        this.width = width;
        this.height = width;
    }
    setHeight(height) {
        this.width = height;
        this.height = height;
    }
}

const square = new Square(2);
square.setWidth(5);
square.setHeight(6);
console.log(square.area());
```

由於 `Square` 的需求，導致它不能完全替代 `Rectangle`，而 LSP 是要求子類別可以替代父類別的情況下，不破壞原本的抽象

如果用 LSP 修改後：

```js
class Shape {
  // 定義方法
    area() {
        throw new Error("Method 'area()' must be implemented.");
    }
}
// 長方形
class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}
// 方形
class Square extends Shape {
    constructor(size) {
        super();
        this.size = size;
    }
    setSize(size) {
        this.size = size;
    }
    area() {
        return this.size ** 2;
    }
}
// 印出面積
function printArea(shape) {
    console.log(`Area: ${shape.area()}`);
}

const shapes = [new Rectangle(5, 10), new Square(5)];
shapes.forEach(shape => printArea(shape));
```

這段程式碼中，`Rectangle` 和 `Square` 都繼承了 `Shape`，並且實作了抽象方法 `area()`

* `Rectangle` 類別實作了 `area()` 方法來計算矩形面積。
* `Square` 類別實作了 `area()` 方法來計算正方形面積。

透過 `printArea()` 函式接收一個 `Shape` 物件，然後呼叫 `area()` 取得面積

從 `area()` 方法實作上來看，因為 `Square` 和 `Square` 物件在計算面積上是相同的行為，且能替代 `Shape` 物件，因此符合 LSP

## 介面切離原則 ( Interface Segregation Principle，ISP )

> 原文定義：Clients should not be forced to depend on methods that they do not use.

翻成中文是，客戶端不應該被強迫依賴他們不使用的方法。

該原則和「單一職責原則 SRP」有點類似，目標都是確保建立具高凝聚力的抽象

在 ISP 中有幾個關注點：
* 一個類別或介面不應該強迫其客戶端（使用該類別或介面的其他類別）依賴於它們不需要的方法。
* 介面應該是小而專注的，而不是大而全面的。
* 客戶端應該只需要知道它們實際使用的方法，而不是被迫了解整個大型介面。

在實際應用上應該將大型介面分解成更小更單一，減少系統耦合、提高程式碼維護與擴充性

以印表機舉例，如果有一個多功能的印表機介面，它可能包含列印、掃描、傳真等方法。但是，如果某個客戶端只需要列印功能，
它就不應該被強制實作或依賴於掃描和傳真的方法。

在這種情況下，將大的印表機介面分解成多個小介面 ( 如 Printer、Scanner、Fax ) 會更好。

這邊看程式，雖然 JS 沒有 Interface 的概念，但可以先用註解模擬介面行為：

```js
// 多功能印表機介面
class AllInOnePrinterInterface {
  print(document) {...}
  scan() {...}
  fax(document) {...}
  copyDocument() {...}
}

// 簡單印表機類別 ( 只需要列印 )
class SimplePrinter extends AllInOnePrinterInterface {
  print(document) {...}
  // 被迫實作不需要的方法
  scan() {...}
  fax(document) {...}
  copyDocument() {...}
}
```

這個問題在於，`AllInOnePrinterInterface` 介面過於龐大，包含太多功能

`SimplePrinter` 只需要列印功能，但被迫實作了所有的方法，即使它不支援，未來在使用上也可能誤用了這些功能，增加了程式的不穩定性

比較好的做法應該是：

```js
// 印表機介面
class PrinterInterface {
  print(document) {...}
}
// 掃描器介面
class ScannerInterface {
  scan() {...}
}
// 傳真機介面
class FaxInterface {
  fax(document) {...}
}

// 簡單印表機類別（只實作列印功能）
class SimplePrinter extends PrinterInterface {
  print(document) {...}
}

// 多功能印表機類別
class AllInOnePrinter extends PrinterInterface, ScannerInterface, FaxInterface {
  print(document) {...}
  scan() {...}
  fax(document) {...}
}
```

這邊定義了三個獨立的介面，`PrinterInterface`、`ScannerInterface`、`FaxInterface`

* `SimplePrinter` 因為只需要列印功能，所以實作了 `PrinterInterface`
* `AllInOnePrinter` 因為需要包含多種功能，所以實作了 `PrinterInterface`、`ScannerInterface`、`FaxInterface` 這三種介面

這樣的設計遵循了 ISP 原則，客戶端可以只依賴它們需要的介面。例如，只需要列印功能的客戶端可以使用 `SimplePrinter`，而不需要知道掃描或傳真的存在或它們怎麼實作的。

此概念也能夠套用到畫面 ( UI ) 的關注點分離上，建立具模組化、可維護和可重複利用的 component。

在 OOP 上比較有感的地方在，設計多型 ( Polymorphism ) 時，比較好為類別實作不同的應對方式。

## 依賴反轉原則 ( Dependency Inversion Principle，DIP )

> 原文定義：
> * High-level modules should not depend on low-level modules. Both should depend on abstractions.
> * Abstractions should not depend on details. Details should depend on abstractions.

翻成中文是：

* 「高階模組」不應該依賴於「低階模組」，兩者都應該依賴於「抽象」（介面）。

* 「抽象」不應該依賴於「具體實現」。「具體實現」應取決於「抽象」。

為何稱為「依賴反轉」？

* 在傳統的程式設計中，高階模組（如業務邏輯）通常直接依賴於低階模組（如資料接收、IO操作等），所以兩者具有依賴關係。

* 這種依賴關係通常需要承擔一定的風險，當低階模組變動時影響到高階模組，可能導致無法運作的狀況發生。

* 因此我們將其「反轉」，原本依賴於實體變為依賴於抽象，解開依賴關係，就稱為「依賴反轉」。

用簡單的咖啡機系統來舉例：

```js
// 具體的咖啡豆類型
class ArabicaCoffeeBean {
  grind() {
    return "磨碎阿拉比卡咖啡豆";
  }
}

// 咖啡機直接依賴於具體的咖啡豆類型
class CoffeeMachine {
  constructor() {
    this.coffeeBean = new ArabicaCoffeeBean();
  }

  brewCoffee() {
    const groundCoffee = this.coffeeBean.grind();
    console.log(`用${groundCoffee}沖泡咖啡`);
  }
}
```

這個例子的問題在於，咖啡機直接依賴於特定類型的咖啡豆（阿拉比卡）。

如果我們想使用不同種類的咖啡豆，就需要修改咖啡機的程式碼。

依賴反轉後：

```js
// 定義咖啡豆的抽象介面
class CoffeeBean {
  grind() {
    throw new Error("必須實現研磨方法");
  }
}

// 具體的咖啡豆類型
class ArabicaCoffeeBean extends CoffeeBean {
  grind() {
    return "磨碎阿拉比卡咖啡豆";
  }
}

class RobustaCoffeeBean extends CoffeeBean {
  grind() {
    return "磨碎羅布斯塔咖啡豆";
  }
}

// 咖啡機依賴於抽象的咖啡豆介面
class CoffeeMachine {
  constructor(coffeeBean) {
    this.coffeeBean = coffeeBean;
  }

  brewCoffee() {
    const groundCoffee = this.coffeeBean.grind();
    console.log(`用${groundCoffee}沖泡咖啡`);
  }
}
```

整理一下上述程式碼做了什麼
* 我們定義了一個抽象 `CoffeeBean` 類別，並定義了咖啡豆應該有的行為（研磨）。
* 具體的咖啡豆類型（如 `ArabicaCoffeeBean` 和 `RobustaCoffeeBean`）實作了這個抽象類別。
* `CoffeeMachine` 不再直接依賴於具體的咖啡豆類型，而是依賴於抽象的 `CoffeeBean`，也算是解耦合了。
* 我們可以在創建咖啡機時，注入任何依賴 `CoffeeBean` 抽象的咖啡豆。

這個例子實現了 DIP 原則的核心思想：高階模組（咖啡機）不應該依賴於低階模組（具體的咖啡豆類型），
兩者都應該依賴於抽象（咖啡豆介面）。

這樣我們就「反轉」了依賴關係，使系統更加靈活。

在 DIP 中還有其他觀念，像是：IoC（Inversion of Control，控制反轉）、DI（Dependency Injection，依賴注入）有興趣也可以了解一下

## 結語

這些原則裡面有幾個都有類似的概念，但事實上有很細微的差異，實作上大多是要到專案需要擴大或重構的階段時才比較能體會

這邊再整理一下 SOLID 5 大原則關注的重點：

* SRP：一個類別或函式應該只負責一個單一職責，降低改變影響的程度，減少出 Bug 的風險。
* OCP：當需求變化時，應該透過加入新的程式碼來擴充該系統的功能，而不是去修改現有的程式碼。
* LSP：所有類別都應該能夠被子類別替換，且不影響原有的功能。
* ISP：客戶端不應該被強迫依賴他們不使用的方法。
* DIP：高階模組不應該依賴於低階模組，兩者都應該依賴於抽象（介面），抽象不應該依賴於具體實現。具體實現應取決於抽象。 

仔細了解後，可以發現這幾個原則都在談 **＂改變＂** 這件事，所以 SOLID 它是在講述面對改變下不同的應對方式

不過也不是說要將 SOLID 當作一定要遵循的設計原則或聖旨什麼的

這樣反而會造成 **＂過度設計＂**，使系統變得過於複雜

在開發上也不用糾結一開始就要去實踐去寫得多完美拆得多乾淨（當然盡可能啦）

畢竟好的架構其實也是透過不斷的迭代慢慢實現的，最終找到最適合這個系統的架構。

## 參考來源：
* [SOLID：五則皆變](https://teddy-chen-tw.blogspot.com/2014/04/solid.html)
* [使人瘋狂的 SOLID 原則](https://medium.com/%E7%A8%8B%E5%BC%8F%E6%84%9B%E5%A5%BD%E8%80%85/%E4%BD%BF%E4%BA%BA%E7%98%8B%E7%8B%82%E7%9A%84-solid-%E5%8E%9F%E5%89%87-%E7%9B%AE%E9%8C%84-b33fdfc983ca)
* [看到 code 寫成這樣我也是醉了，不如試試重構？](https://ithelp.ithome.com.tw/users/20102562/ironman/1338)
* Clean Code 學派的風格實踐