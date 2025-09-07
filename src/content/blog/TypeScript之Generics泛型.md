---
title: 'TypeScript 之 Generics 泛型'
description: 'Generics 泛型是一種高靈活性定義行為或結構的一種方法，當你定義了不重複但有相似內容的結構時，泛型是個很好的選擇，而 JS 本身並不支援泛型，直到 TS 出現才引入泛型的特性。'
pubDate: 'September 20 2024'
heroImage: '/TS-Image.png'
tags: ['Notes', 'TypeScript', 'Generics']
category: 'TypeScript'
---

Generics 泛型是一種高靈活性定義行為或結構的一種方法，當你定義了不重複但有相似內容的結構時，泛型是個很好的選擇，而 JS 本身並不支援泛型，直到 TS 出現才引入泛型的特性。

## 前言

不過泛型早在 C++、Java、C# 等語言就已經有了，像是 C++ 就使用 Template 模板來撰寫處理不同類型的資料

```c++
#include <iostream>
using namespace std;

template <typename T>
T getMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    int a = 10, b = 20;
    double x = 5.5, y = 2.3;
    // int
    cout << "Max of a and b: " << getMax(a, b) << endl;
    // double
    cout << "Max of x and y: " << getMax(x, y) << endl;
    return 0;
}
```
```output
Max of a and b: 20
Max of x and y: 5.5
```

也能夠處理類別或函式

```c++
#include <iostream>
using namespace std;

// 定義一個 Pair 類別 
template <typename T>
class Pair {
private:
    T first, second;
    
public:
    Pair(T a, T b) : first(a), second(b) {}
    
    T getFirst() const { return first; }
    T getSecond() const { return second; }
};

int main() {
    Pair<int> p1(10, 20);     // int 型別的 Pair
    Pair<double> p2(3.14, 2.71); // double 型別的 Pair

    cout << "p1: " << p1.getFirst() << ", " << p1.getSecond() << endl;
    cout << "p2: " << p2.getFirst() << ", " << p2.getSecond() << endl;
    return 0;
}
```
```output
p1: 10, 20
p2: 3.14, 2.71
```

那通過前面的範例應該很明顯為何需要泛型了吧？

主要是它能讓你避免撰寫具重複性質的程式碼，以清晰的結構來表達意圖。

## TypeScript Generics

Generics 泛型是指在定義 Function、Interface 或 Class 的時候，不預先指定具體的型別，而在使用的時候再指定型別的一種特性。

用法就是在函式、類別或介面之後加上 `<>`，通常會寫 `<T>` 或 `<Type>`，當然也可以自訂命名 `<List>` 等等。

### 泛型介面

首先先來看泛型介面

假設今天定義了兩個相似的介面

```typescript
interface DataA {
  id: number;
  key: string;
  value: string;
}

interface DataB {
  id: number;
  key: string;
  value: number;
}
```

而不一樣的只有 value，其他的都一樣，這時候能夠使用泛型，將 id 和 key 抽出來重構

```typescript
interface GenericData<T> {
  id: number;
  key: string;
  value: T;
}

type DataA = GenericData<string>
type DataB = GenericData<number>
```

這樣的話我們可以透過 GenericData 泛型去實例不同類型的介面

### 泛型組合

泛型組合是指在 TypeScript 中使用多個泛型參數或型別結合來創建複雜的型別結構。
這樣的組合可以讓開發者更加靈活地設計函式、類別和介面，並滿足特定的型別需求。

* 交叉型別

  使用 `&` 來合併多個型別，使結果型別擁有所有參與合併的型別的屬性。

  ```typescript
  interface Person {
      name: string;
      age: number;
  }

  interface Employee {
      employeeId: number;
  }

  type PersonEmployee = Person & Employee;

  const worker: PersonEmployee = {
      name: "Alice",
      age: 30,
      employeeId: 12345,
  };

  console.log(worker);
  ```

* 聯合型別

  使用 `|` 來定義一個型別可以是多種型別中的一種。

  ```typescript
  function logId(id: number | string) {
      console.log(`ID: ${id}`);
  }

  logId(123);      // 輸出: ID: 123
  logId("abc123"); // 輸出: ID: abc123
  ```

### 泛型函式

假設今天要做一個簡單的排序，但你需要應對兩種不同型別參數去做排序

可能會像下面範例這樣

```typescript
function sortNumbers(arr: number[]): number[] {
    return arr.sort((a, b) => a - b);
}

function sortStrings(arr: string[]): string[] {
    return arr.sort();
}

const numArr = sortNumbers([10, 5, 3]);
const strArr = sortStrings(["banana", "apple", "cherry"]);
```

那你可能會提出幾種解法，我直接在一個函式中去撰寫針對不同型別做排序就好了阿

但面對大型應用時，這可能會導致這個函式具高耦合且參雜各種不同邏輯

如果拆開那又會造成有許多類似的函式在做相同的行為

所以這時候就適合使用泛型來解決

```typescript
function sortArray<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
    return arr.sort(compareFn);
}

// 排序數字（升序）
const numArr = sortArray([10, 5, 3], (a, b) => a - b);
// 排序字串（升序）
const strArr = sortArray(["banana", "apple", "cherry"], (a, b) => a.localeCompare(b));

console.log(numArr);  // 輸出結果 [3, 5, 10]
console.log(strArr);  // 輸出結果 ["apple", "banana", "cherry"]
```

這邊我們定義了一個 arr 參數，以及 compareFn 參數（預期回傳一個 number 用於 sort 做升降序），透過泛型讓它可以去對不同類型參數做排序。

不過這種排序是一種比較精簡的寫法，詳細可以查閱這篇 [文章](https://ithelp.ithome.com.tw/articles/10225733)。

> #補充：這段有使用到 [localeCompare()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) 這個方法，
該方法主要根據字母順序或語言規範來比較字串的先後順序，並回傳一個數字，如：apple 會比 banana 前面，因為 a 比 b 更靠前。

### 泛型參數的預設型別

在 TypeScript 2.3 以後，新增了對型別參數指定預設型別的功能。

當呼叫函式或類別時，沒有提供特定型別，則會使用預設型別，這樣可以提高程式碼的穩定性，並幫助避免一些型別不匹配的錯誤。

```typescript
function logValue<T = number>(value: T): void {
    console.log(value);
}

// 使用預設型別
logValue(42); // 預設型別為 number
logValue("Hello"); // 會顯示錯誤，因為預設型別是 number

// 指定型別
logValue<string>("Hello"); // 指定型別為 string
```

### 泛型約束

泛型約束是 TypeScript 中的一個功能，用來限制泛型參數 T 的型別。透過泛型約束，可以確保傳入的型別符合某些條件。

定義泛型約束的方法，是使用 `extends` 關鍵字來約束 T，使 T 必須符合該介面的型別

如下面的範例，創建一個 Person 介面，使用 extends 約束 T 必須符合 Person 的型別

```typescript
interface Person {
    name: string;
    age: number;
}

function greet<T extends Person>(person: T): string {
    return `Hello, ${person.name}`;
}

const person1 = { name: "Alice", age: 25 };
const person2 = { name: "Bob", age: 30, occupation: "Engineer" };

console.log(greet(person1)); // 輸出結果 Hello, Alice
console.log(greet(person2)); // 輸出結果 Hello, Bob
```

## 參考來源

* [泛型|TypeScript 新手指南 - Will保哥IT創業之路](https://willh.gitbook.io/typescript-tutorial/advanced/generics)
* [Day21:【TypeScript 學起來】Generics 泛型](https://ithelp.ithome.com.tw/m/articles/10278375)