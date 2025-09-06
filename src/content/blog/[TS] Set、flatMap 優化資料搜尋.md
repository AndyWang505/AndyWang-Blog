---
title: '[TS] Set、flatMap 優化資料搜尋'
description: '最近在工作中遇到需要從複雜的資料結構中提取特定資料的問題，面對這種多層結構的資料直接暴力搜尋效能明顯不太理想，正確的方式應該是先將資料做扁平化處理，再透過更高效的搜尋策略來提升效能。'
pubDate: 'December 30 2024'
heroImage: '/TS-Image.png'
tags: ['Notes', 'TypeScript', 'map']
category: 'TypeScript'
---

最近在工作中遇到需要從複雜的資料結構中提取特定資料的問題，面對這種多層結構的資料直接暴力搜尋效能明顯不太理想，正確的方式應該是先將資料做「扁平化處理」，再透過更高效的搜尋策略來提升效能。

## 情境與實作

最近工作上碰到需要從一個多層結構的資料中撈出特定資料，然後從另一筆資料中撈出 id 互相匹配後，再組合出一個乾淨的資料做渲染。

假設現在需要從 product_variation 的 categories 中先撈出 giveaways，其中會夾雜不同資料，你需要透過 isGiveaway 去判斷。

結構可能會長這樣：

```json
{
  "categories": [
    {
      "id": 1,
      "name": "優惠活動",
      "subcategories": [
        {
          "id": 11,
          "name": "滿額贈品",
          "products": [
            {
              "product_id": 102456,
              "name": "高級禮盒",
              "isGiveaway": true,
              "details": {
                "price": 0,
                "attributes": {
                  "color": "紅色",
                  "size": "大"
                },
                "availability": {
                  "inStock": true,
                  "limitedEdition": false
                }
              }
            },
            {
              "product_id": 102457,
              "name": "豪華贈品",
              "isGiveaway": true,
              "details": {
                "price": 0,
                "attributes": {
                  "color": "金色",
                  "size": "中"
                },
                "availability": {
                  "inStock": false,
                  "limitedEdition": true
                }
              }
            }
          ]
        }
      ]
    },
    {
      ...
    }
  ]
}
```

另外一個 product_id 已經提供，只需要從 selectedProducts 中撈出即可。

```json=
{
  "selectedProducts": [
    {
      "product_id": 102780,
      "name": "智能手機",
      "isGiveaway": false
    },
    {
      "product_id": 102457,
      "name": "豪華贈品",
      "isGiveaway": true
    },
  ],
}
```

大致看一下結構有三層，至少需要先用三個迭代，再透過搜尋撈出特定資料後進行匹配。

```ts=
const giveaways = productTable.categories.map((category) =>
  category.subcategories.map((subcategory) =>
    subcategory.products.filter((product) =>
      productSelected.selectedProducts?.some((selectedProduct) =>
        selectedProduct.product_id === product.product_id && selectedProduct.isGiveaway
      )
    )
  )
).flat(2) // 使用 flat 將資料扁平化成二維
```

結果可能會像這樣

但這樣的寫法效能是很差的，過程中使用了兩個 map 又一個 filter 和 some，雖然最後有使用了 flat 將資料攤平，但還有很大的優化空間。

1. 盡量避免嵌套式結構，必要時寫成一個 constants

2. flat 和 map 可以整合成 flatMap

3. 搜尋策略可以改用效能更高的 set

優化後的結果：

```ts=
const selectedProductIds = new Set(
  productSelected.selectedProducts.map((selectedProduct) => selectedProduct.product_id)
)
const subcategoriesMap = productTable.categories.flatMap((category) => category.subcategories)
const allProducts = subcategoriesMap.flatMap((subcategory) => subcategory.products)
const giveaways = allProducts.filter((product) => 
  selectedProductIds.has(product.product_id) && product.isGiveaway
)
```

來說說這段優化的過程中做了什麼

1. 將 selectedProducts 的 product_id 抽出來到 Set 中，Set 有更高的搜尋效率（後續會解釋），減少查找 product_id 的時間成本。

2. 使用 flatMap 來將每個 category 中的 subcategories 做扁平化處理，這樣我們就得到了所有的子類別資料，而不需要在內部多次嵌套 map。

3. 接著再使用 flatMap 來將每個 subcategory 中的 products 提取出來，這樣所有產品都在一個扁平化的陣列中，避免了多次遍歷和過多的嵌套（這邊 flatMap 其實也可以寫在一起，讓扁平化只做一次，不過抽出來的可讀性與維護性更高）。

4. 最後使用 filter 來檢查每個產品是否在 selectedProductIds 中，並且判斷是否為贈品。

這樣優化過後程式碼也變得更簡潔易讀，且在資料量更大時能有更高的效能。

## 關於 Set 和 flatMap

為何 Set 相較 some 或 find 的效能更高？

### Set 的優勢

首先 Set 是一種「無重複的集合」，在搜尋以及去重複的情境具高效能。

它的底層是使用「Hash Table」來實作資料儲存，其搜尋的時間複雜度最高為 𝑂(1)。

而 some 或 find 是基於 Array 實現的，這表示說它們是線性搜尋 𝑂(n) 的，會一個個地遍歷陣列中的元素，直到找到符合條件的元素為止，或者遍歷完整個陣列。

因此在大數據集合中，檢查某個元素是否存在的速度，Set 會比遍歷整個陣列的 some 或 find 快得非常多。

應用情境：

* 去重複：

    ```ts=
    const setA = [1, 2, 3, 4];
    const setB = [3, 4, 5, 6];
    const combinedData = new Set([...setA, ...setB]);
    console.log([...combinedData]); // [1, 2, 3, 4, 5, 6]
    ```

    這段也可以使用 filter 和 indexOf 實作，但 Set 去重複效能比兩者來的更高其時間複雜度從 𝑂(𝑛^2)（基於 filter + indexOf）降低到 𝑂(𝑛)。

### flatMap 的優勢

flatMap 是一個合併了 map 和 flat 操作的方法，如果是分別使用 flat 和 map 就需要遍歷兩次，合併後通過一次遍歷就能完成兩個操作，提高效能。  

較適合需要對陣列進行多層處理及扁平化處理的情境。

例如： 

```ts=
const employees = [
  { department: 'IT', members: ['Alice', 'Bob'] },
  { department: 'HR', members: ['Carol', 'David'] },
];
const allMembers = employees.flatMap((employee) => employee.members);
// ['Alice', 'Bob', 'Carol', 'David']
```

## 總結

遇到複雜的資料結構可以先嘗試將資料攤平，做扁平化處理後再透過更高效的搜尋策略來過濾出對應的資料。

* Set：

    * 底層使用 Hash Table 實作，善於處理重複數據和集合操作，時間複雜度更低。
    * 適合需要頻繁搜尋和比較的情境。

* flatMap：

    * 合併 flat 和 map 方法，在單次遍歷中同時完成映射和扁平化，降低記憶體和時間的消耗。
    * 適合處理嵌套結構的資料，將資料映射並進行扁平化處理，從而有效簡化處理過程。

## 參考來源

* [Set - JavaScript - MDN Web Docs - Mozilla](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
* [在 JavaScript 中如何使用 flat() 和 flatMap() 方法展平数组](https://www.freecodecamp.org/chinese/news/flat-and-flatmap-javascript-array-methods/)