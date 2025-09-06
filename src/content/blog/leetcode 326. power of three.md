---
title: 'Leetcode 326. Power of Three'
description: 'Power of Three，主要想記錄看到一個很有趣的解法，這題非常簡單，就是找到3的冪次方，回傳 true，要挑戰的就是不要用迴圈來完成。'
pubDate: 'July 20 2025'
heroImage: ''
tags: ['Leetcode', 'Algorithm', 'Data Structure']
category: 'Leetcode'
---

主要想記錄看到一個很有趣的解法，這題非常簡單，就是找到3的冪次方，回傳 true，要挑戰的就是不要用迴圈來完成。

## Power of Three

> Given an integer n, return true if it is a power of three. Otherwise, return false.
> An integer n is a power of three, if there exists an integer x such that n == 3x.

一般思路：

* 不斷除3，直到被整除且無法再除
    * n % 3 == 0 代表還能再除，每次迭代 n /= 3 (n=n/3)
* 先排除不可能的情況
    * 如果 n < = 0，一定不是 3 的冪次
* return condition
    * 如果最後 n 剩下 1，就代表原本是 3 的冪次
    * 如果中途有餘數，或者最後不是 1，那就不是

所以實作出來後大概是下面這樣：


```js
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function(n) {
  if (n <= 0) return false
  while (n % 3 === 0) {
    n /= 3
  }
  return n === 1
}
```

## 巧妙的數學技巧

那有沒有辦法不靠迴圈來整除就可以知道他是 3 的冪次呢

看到一個很有趣的投機取巧的方法，而且也是最快的方法

直接定義一個最大的 3 的冪次，然後看 n 能不能被整除就知道了

```js
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function(n) {
    return n > 0 && 1162261467 % n === 0
}
```

這裡的 1162261467 不是亂寫的，他是3^19 是在 32-bit 整數範圍內最大的 3 的冪次。

原理就是：

* 如果 n 是 3 的冪，那麼最大的 3 的冪（3^19）一定能被 n 整除。
* 反之，如果 n 不是 3 的冪，那 3^19 % n 會有餘數。

```js
n = 27
1162261467 % 27 = 0 → true

n = 9
1162261467 % 9 = 0 → true

n = 45
1162261467 % 45 ≠ 0 → false
```