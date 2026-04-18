---
title: 'Leetcode 96. Unique Binary Search Trees'
description: '題是經典的 Catalan Number / Unique BST 問題，給你 1～n 不同數字，問可以組出多少種不同結構的 BST（Binary Search Tree），主要想記錄一下 DP 的練習題。'
pubDate: 'August 15 2025'
heroImage: ''
tags: ['Leetcode', 'Algorithm', 'Data-Structure']
category: 'LeetCode'
---

## Unique Binary Search Trees

> Given an integer n, return the number of structurally unique BST's (binary search trees) which has exactly n nodes of unique values from 1 to n.

> Example : Input: n = 3 , Output: 5

這題是經典的 Catalan Number / Unique BST 問題，給你 1～n 不同數字，問可以組出多少種不同結構的 BST（Binary Search Tree）。

換句話說，也就是說有幾種 BST 樹。

所以我的思路一開始是想先瓊舉所有組合，如果 n = 3，可以有 5 種： [1, 2, 3], [1, 3, 2], [2, 1, 3], [3, 2, 1], [3, 1, 2]。

畫出圖來會像是這樣：

```bash
1        1         2         3         3
 \        \       / \       /         /
  2        3     1   3     1         2
   \      /                 \         /
    3    2                   2       1
```

回顧一下 BST 的規則：

- 左子樹所有節點 < root
- 右子樹所有節點 > root
 
所以如果假設 root = i，左子樹是　1 ~ i-1，右子樹是 i+1 ~ n。

當把樹建出來之後會發現，左邊會形成一棵 BST（大小 i-1），右邊會形成一棵 BST（大小 n-i）

假設 root = 2：

```bash
    2
   / \
  1   3
```

左右子樹會自然被切開，各自獨立，所以如果左子樹有 A 種可能，右子樹有 B 種可能，那以 i 為 root 的總組合就是 A x B。

所以最後 final return 會是 `BST(left ~ i-1) × BST(i+1 ~ right)`

到這裡我們已經得到一個很明確的遞迴關係，且已經把問題拆成 `BST(left ~ i-1)` 跟 `BST(i+1 ~ right)` 兩個子問題了，而在這兩個子問題都在算「一段區間可以組成幾種 BST」，例如：

- bst(1,3)
- bst(2,4)
- bst(1,2)

符合 Divide and conquer，所以很適合用 DP 解，也可以避免重複計算。

第一步：建立 DP（memoization）結構

首先我們需要一個用來記錄「區間答案」的 table。

```js
const map = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0))
```

這個 map[left][right] 的意義是：

在值域 [left, right] 之間，可以組成多少種 BST。

初始化為 0，代表還沒有被計算過。

第二步：實作核心遞迴函式 bst(left, right)

```js
function bst(left, right) {
    if (left > right) return 1
    if (map[left][right] !== 0) return map[left][right]

    let total = 0

    for (let root = left; root <= right; root++) {
        const leftCount = bst(left, root - 1)
        const rightCount = bst(root + 1, right)

        total += leftCount * rightCount
    }

    map[left][right] = total
    return total
}
```

這裡做了兩件事：

- 每個 root 都會把區間切成兩半，左子樹 [left, root - 1]，右子樹 [root + 1, right]
- 組合數相乘 A x B

第三步：處理邊界與 DP 的儲存

(1) 空區間

```js
if (left > right) return 1
```

這個代表「空樹」只有一種可能（很重要的定義），否則乘法會被破壞。

(2) memoization

```js
if (map[left][right] !== 0) return map[left][right]
```

避免重複計算相同區間，例如：

bst(1,3)
bst(2,4)
bst(1,2)

這些子問題會重疊出現很多次，如果沒有 cache，可能會爆炸成指數時間。

```js

/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function(n) {
    // 3 -> [1, 2, 3], [1, 3, 2], [2, 1, 3], [3, 2, 1], [3, 1, 2]
    // root = 1, left: 1, right: 2
    // root = 2, left: 1, right: 1
    // root = 3, left: 2, right: 1
    const map = Array.from({ length: n + 2 }, () => Array(n + 2).fill(0))

    function bst(left, right) {
        if (left > right) return 1
        if (map[left][right] !== 0) return map[left][right]
        // total = left * right
        let total = 0
        for (let root=left; root <= right; root++) {
            const leftCount = bst(left, root - 1)
            const rightCount = bst(root + 1, right)
            // 1*2
            // 1*1
            // 2*1
            total += leftCount * rightCount
        }
        map[left][right] = total
        return total
    }
    return bst(1, n)
};
```