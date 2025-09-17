---
title: 'Claude Code CLI：真正的 AI 開發代理人'
description: '近期各個 AI 都開始推出自己的 CLI 工具，像是 Cursor、Gemini、Claude，但在架構化協作、與建立完整開發流程下還是 Claude Code 更勝一籌。這篇主要紀錄我在團隊每週 AI 分享會的內容。'
pubDate: 'August 7 2025'
heroImage: '/ClaudeCode.png'
tags: ['Claude', '心得']
category: 'Tools'
---

近期各個 AI 都開始推出自己的 CLI 工具，像是 Cursor、Gemini、Claude，但在架構化協作、與建立完整開發流程下還是 Claude Code 更勝一籌。這篇主要紀錄我在團隊每週 AI 分享會的內容。

## 核心概念與運作原理

- Claude Code 是一個純粹的代理人 Agent，Agent 架構導向，結合強大的工具（如檔案編輯、終端機操作）和模型指令，讓模型在迴圈中持續運作直到任務完成。
- 它不使用傳統的全文索引或嵌入搜索（RAG），而是透過類似人類開發者的「探索式搜尋」（genetic search），利用 glob、grep 等 CLI 工具在程式碼庫中搜尋並理解內容。
- 具備輕量級 UI，能即時顯示 Claude 的操作過程，並有權限管理機制，防止危險操作自動執行。

> Claude Code 像是你身邊總是在操作 Terminal 的同事，從來不碰 GUI，經常做出一些很屌的 bash 指令，爆改 Vim 介面或使用方法之類，每當你經過他身邊都會覺得，哇！真厲害！

## 主要應用場景

工作流：探索 → 規劃 → 撰寫程式 → 提交

- 探索（Discovery）：快速熟悉新程式碼庫，查找功能實現位置，分析 git 歷史等。
- 建構（Build）：從零開始建立應用，也能在既有程式碼庫中高效開發，特別擅長撰寫單元測試和生成良好的 commit/PR 訊息。
- 重構（Refactor）與支援：協助大型程式碼庫遷移、除錯，並能操作各種 CLI 工具（Git、Docker、BigQuery 等），提升開發效率。


## 最佳實踐

- **使用 CLAUDE.md**：這是與 Claude 共享狀態和指令的主要方式，放置於專案目錄或使用者主目錄，包含專案結構、測試指令、風格指南等資訊，幫助 Claude 更好地理解專案。
- **權限管理**：讀取操作自動允許，寫入或執行命令時會跳出確認，使用者可設定自動接受特定命令，提升工作效率。
- **整合 CLI 工具與 MCP 伺服器**：推薦直接安裝並使用 CLI 工具，並可透過 MCP 擴充功能，讓 Claude 能操作更多工具。
- **上下文管理**：利用 slashclear 清除上下文，slashcompact 進行會話摘要，避免超出模型上下文限制。
- **高效工作流程**：利用計畫與待辦清單功能，讓 Claude 先規劃再執行，採用測試驅動開發，分步驟小改動並持續 commit，避免失控。
- **其他應用**：可貼入截圖或圖片檔案，讓 Claude 參考設計稿等非文字資訊。

## Claude Code vs Cursor

| 項目 | Claude Code | Cursor |
| --- | --- | --- |
| 主體 | Anthropic Claude | OpenAI GPT-4o |
| 整合方式 | 需搭配 CLI 工具啟動 agent，與 IDE 分離（目前整合 VS Code、JetBrains IDE） | 原生整合 VS Code，類似 Copilot Labs UI |
| 行為邏輯 | 類人探索 + 會話控制（可規劃+執行） | 基於 VS Code UI 操作與語境，偏提示驅動 |
| 任務導向 | 設定目標，規劃後逐步執行（agent loop） | 使用者明確輸入 prompt 後執行，非自動循環 |
| 可觀察性 | 可見 Claude 在「看什麼、做什麼」，並決定是否執行 | 多為黑箱執行，結果呈現在介面上 |
| 多模態 | 支援貼圖參考 UI/設計 | GPT-4o 有圖像輸入能力，但 UI 上使用限制多 |

| 能力 | Cursor | Claude Code  |
| --- | --- | --- |
| 程式碼生成 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 架構設計 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 系統分析 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 商業邏輯理解 | ⭐⭐ | ⭐⭐⭐⭐ |
| 即時性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## Quick Start

1. `npm install -g @anthropic-ai/claude-code` or `curl -fsSL [claude.ai/install.sh](http://claude.ai/install.sh) | bash`

2. `claude` 啟動 claude code 關鍵字

3. choose the text style that looks best with your terminal
    1. 隨便選一個喜歡的（選 light 都不是人）

4. select login method 授權方式可選訂閱或 api key
    1. claude account with subscription（pro or max）
    2. anthropic console account

5. 因為我是訂閱用戶所以選1，接著會給一串網址需要 OAuth 授權，授權完畢會產生一段 oauth code，複製起來貼到 terminal

6. Use Claude Code's terminal setup?
    1. Yes, use recommended settings（預設推薦）
    2. No, maybe later with /terminal-setup

7. Do you trust the files in this folder? 
    1. Yes, proceed
    
    成功後建議重啟 terminal，讓 claude code 可以正確注入 shell script
    
    其他疑難雜症 [https://luka.tw/claude-code-mac-an-zhuang-zhi-nan/#疑難排解](https://luka.tw/claude-code-mac-an-zhuang-zhi-nan/#%E7%96%91%E9%9B%A3%E6%8E%92%E8%A7%A3)
    
8. `/init` 建立 CLAUDE.md
    
    指令集
    
    https://docs.anthropic.com/en/docs/claude-code/slash-commands

## 其他工具

可以看 claude code token 使用量 & 花多少錢

https://ccusage.com/guide/

![ccusage.png](/ccusage.png)

平均一個小任務的 prompt 大概 1k ~ 3k 的 token，中任務大概 3k ~ 10幾k，如果太大也可能表示拆的顆粒不夠小

claude pro 會員訂閱方案已經涵蓋在裡面，超過不會額外產生費用，不過還是會限制使用量，過一段時間後才能繼續使用

## 延伸閱讀

[鞭斥 Claude Code：從碼農進化成奴隸主的八大法則](https://rainboltz.medium.com/%E9%9E%AD%E6%96%A5-claude-code-%E5%BE%9E%E7%A2%BC%E8%BE%B2%E9%80%B2%E5%8C%96%E6%88%90%E5%A5%B4%E9%9A%B8%E4%B8%BB%E7%9A%84%E5%85%AB%E5%A4%A7%E6%B3%95%E5%89%87-158fe50a5a5b)

這是我前幾個禮拜在滑 threads 時看到的，我覺得滿有趣的，分享給大家 XDD

目的是為了成為『雙手解放、每天喝咖啡看網飛的奴隸主』

1. 打造一個人機都懂的「完整專案開發文件」── CLAUDE.md
2. 簡單任務、大量奴役
3. 先審核計畫，再准許動工
    1. 白板題最標準的流程就是「**先提問釐清問題、確認各項 scope**」，然後「**跟面試官討論解法、確認方向正確性**」，最後就是「**執行**」和「**寫測項驗證成果**」。這四個步驟其實與上述「**探索、計畫、編碼、測試**」的操作和順序相同，是軟體工程中最標準定義與解決問題的 SOP。
    2. 如果 AI 開始產生幻覺或行為偏差，立即停止重新開啟新 session 是最有效率的辦法，不要一直跟智障對話。
4. 命令的藝術：清晰、具體、不容置疑
    1. 「我的程式碼好像壞了。」⭢「執行 pnpm dev 後，主控台顯示 TypeError，錯誤指向 Nav.tsx 第 20 行。這是檔案內容和錯誤截圖，立刻分析問題並修好它。」
    2. 完成任務後記得 /clear
5. 用「視覺」與「連結」讓他閉嘴照做
6. 無情地「推翻」與「鞭策」
    1. 你不只是在跟他 pair programming，你是在驗收成果。
    2. **挑戰它的效能：**「這個巢狀迴圈爛透了，效能跟屎一樣。立刻用 Map 重構，把時間複雜度從 O(n²) 降到 O(n)。」
    3. **要求更好的命名：**「data 和 item？這種命名是三歲小孩寫的嗎？分別改成 userProfile 和 post，讓它看起來像人寫的。」
    4. **追求程式碼的簡潔：**「這段 if/else 寫得又臭又長。用三元運算子或更簡潔的方式重寫，我不想在我的專案裡看到這種垃圾。」
7. 進階玩法：解開鎖鏈 ( — safe-yolo) 與自動化奴役
    1. 將 Claude 指令寫入你的 shell 腳本，建立自動化奴役流水線
8. 不要忘記你跟奴隸的差別，避免推翻蘇丹的登高一呼

## 參考來源

* [Claude Code 最佳實踐](https://www.youtube.com/watch?v=6qGFP7HkIcY)
* [Claude Code 概述](https://docs.anthropic.com/zh-TW/docs/claude-code/overview)
