---
title: 'git rebase 錯了怎麼辦'
description: '在日常開發中，你可能會經常使用 rebase 來重新定義分支的基準點，讓 commit history 保持線性與乾淨。不過在第一次操作時，很多人會對它感到不安，擔心一不小心就把 commit 弄不見。但實際上，rebase 並不會真的刪除你的歷史 commit。'
pubDate: 'July 07 2025'
heroImage: ''
tags: ['Git']
category: 'Git'
---

在日常開發中，你可能會經常使用 rebase 來重新定義分支的基準點，讓 commit history 保持線性與乾淨。不過在第一次操作時，很多人會對它感到不安，擔心一不小心就把 commit 弄不見。

但實際上，rebase 並不會真的刪除你的歷史 commit。它的本質是「重新建立一條新的 commit 序列」，並將分支指向這條新的歷史線上，而原本的 commit 仍然存在於 Git 的物件資料中，只是變成不再被分支直接引用的狀態。

因此，即使操作 rebase，看起來像是歷史被改寫，但大多數情況下都可以透過 reflog 找回原本的狀態，不需要過度恐慌。

## 第一步：reflog

reflog 可以理解成 Git 的「時間軸紀錄」，它會記錄每一次 HEAD 的移動。

不管你是：
- rebase
- reset
- checkout
- commit

這些操作都會留下痕跡。

就算你 rebase 把歷史改壞了，reflog 幾乎一定能幫你找回來。

所以第一步就是先 `git reflog`

然後你會看到類似這樣的結果：

```shell=
a1b2c3d HEAD@{0}: rebase (finish): returning to main
d4e5f6g HEAD@{1}: rebase (start): checkout feature-branch
h7i8j9k HEAD@{2}: commit: add new feature
```

找到 `rebase (start)`，這表示「rebase 開始之前的那個位置」，也是你要回到的地方。

## 第二步：reset

找到對應的 HEAD@{n} 之後，直接執行：

注意 n 要對應你的 reflog

`git reset --hard HEAD@{1}`


這段指定會將 HEAD 移回去，把 working directory 一起還原，回到一開始還沒 rebase 前。

不出意外的話，這樣東西基本上就都救回來了。

## 心法

Git 很少真的刪東西，基本上都可以找得到，所以出問題了也不用太擔心或太慌張，AI 時代下也可以先問問 GPT、Gemini、Claude 找到解決方法。

不過雖然 reflog 很強，但還是有幾個例外：
* 你過了很久（預設約 90 天），reflog 被清掉
* 你手動做了 git gc 且已清除 unreachable commits
* 你在遠端 force push 覆蓋掉，且本地也沒有紀錄

但在一般開發流程中，當下發現 rebase 出錯幾乎都救得回來。