---
title: '關於 cherry-pick 時機與常見誤區'
description: '在還沒有實際遇到分支管理問題之前，其實很少用到 cherry-pick，第一次真正使用到它，是在剛入職一段時間處理 hotfix 的時候。按照正常流程，hotfix 應該要從 master 開 branch，修完之後合回 master，再 sync 回 release。'
pubDate: 'May 30 2025'
heroImage: ''
tags: ['Git', '心得']
category: 'Git'
---

## 前言

在還沒有實際遇到分支管理問題之前，其實很少用到 cherry-pick，第一次真正使用到它，是在剛入職一段時間處理 hotfix 的時候。

按照正常流程，hotfix 應該要從 master 開 branch，修完之後合回 master，再 sync 回 release。

但那次我一不小心從 release 開出了 hotfix，修完之後合回 release 才發現我開錯了，如果再合進去前至少還能 rebase。所以這時候就遇到了一個問題：

* 如果直接把 hotfix 分支合進 master，會把 release 上一些不必要的變更帶進去。
* 但如果只需要那個 bugfix，就得「挑」出來。

所以最後就是使用 cherry-pick，把那個 commit 提交所做的變更引入 master（會在 master 產生一個新的提交）。

最後，為了避免之後 release 之後需要進 master 發生衝突，所以還需要再把 master 的更新同步回 release。

cherry-pick 雖然很方便，能快速解決當下需求。

但它只是權宜之計，真正的解法還是要維持分支策略的正確性，避免不必要的衝突。

## cherry-pick 由來

「cherry-pick」這個詞其實來自農業隱喻。

在農場裡採櫻桃時，你不會把整棵樹的果實都摘下來，而是挑選成熟、好吃的櫻桃。

Git 的設計者 Linus Torvalds 借用這個比喻來形容：

* 你不需要把一個分支的所有 commit 都合併過來（那可能會帶來許多不必要的變更），
* 你只挑選「那幾顆有用的 commit」帶到目標分支。

因此才叫 cherry-pick。

## cherry-pick 的常見誤區

### 誤區一：把 cherry-pick 當成日常分支同步手段

很多人會習慣用 cherry-pick 把某些 commit 一直「搬來搬去」，覺得這樣可以避免不必要的變更。

但這麼做會造成：

* commit 歷史混亂：同一個修正會在不同分支生成多個不同的 commit（因為 hash 不一樣）。
* 後續合併衝突更難解：當你最終還是要合併分支時，Git 會認不出那是同一個修正，容易重複套用或衝突。

正確的做法是：

* 如果是臨時 bug 熱修（hotfix），用 cherry-pick 是完全沒問題且正確的。
* 如果是日常同步，應該使用 merge 或 rebase，保持分支間的一致性。

### 誤區二：以為 cherry-pick 就是 rebase

這是新手最容易混淆的地方。雖然兩者都會「重新套用 commit」，但概念完全不同：

* cherry-pick
    * 針對單一（或一組）commit。
    * 適合「我只要這個修正，不要整個分支」。
    * 套用後會產生新的 commit hash。

* rebase
    * 是把整個分支的一系列 commit「搬到」另一個分支上。
    * 適合「我要保持分支歷史線性，完整移動一段提交」。
    * 也會產生新的 commit hash，但會保留 commit 順序。