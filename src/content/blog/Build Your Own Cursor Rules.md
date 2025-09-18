---
title: 'Build Your Own Cursor Rules'
description: "Cursor 本身已經很好用了，但偶爾還是會犯下一些不太聰明的錯誤，你可以透過自訂 Cursor Rules 來降低這些錯誤的發生，讓開發體驗更舒適流暢，不必每次都來回花時間糾正。"
pubDate: 'April 29 2025'
heroImage: 'https://mintlify.s3.us-west-1.amazonaws.com/cursor/images/context/rules/rules-applied.png'
tags: ['Cursor', 'Cursor-Rules']
category: 'Tools'
---

Cursor 本身已經很好用了，但偶爾還是會犯下一些不太聰明的錯誤，你可以透過自訂 Cursor Rules 來降低這些錯誤的發生，讓開發體驗更舒適流暢，不必每次都來回花時間糾正。

## 為什麼需要 Cursor Rules

平常在開發時，或許你經常會遇到需要重複寫一些相似的程式碼，或是需要遵循特定的開發規範，你可能會通過些 LLM 工具幫你 General 出來，但結果經常不盡人意，像是：

- 生成的程式碼不符合你的商業需求
- 生成的程式碼不符合你的團隊風格
- 生成的程式碼不符合你的開發規範，每次都要附上給他，偶爾還是會失憶...

有了 Cursor Rules 後，你能自定義和優化你的開發環境，讓 Cursor 能夠記住你的偏好和規範，也讓生成出來的程式碼更符合你的需求，並確保程式碼一致性。

你可以：

- 自動化重複性的任務
- 根據專案需求調整編輯器行為
- 創建自定義的程式碼片段和模板
- 優化工作流程和生產力

## Cursor Rules 的三種類型

由於使用需求的不同，Cursor Rules 也提供了不同層級的規則設定，讓你可以根據需求選擇最適合的方式：

### 1. Project Rules
- 位置：`.cursor/rules` 目錄
- 特點：
  - 版本控制
  - 可針對特定程式碼庫
  - 支援 MDC 格式
- 適用場景：
  - 編碼特定領域知識
  - 自動化專案工作流程
  - 標準化風格和架構決策

### 2. User Rules
- 位置：Cursor Settings > Rules
- 特點：
  - 全域適用
  - 純文字格式
  - 可一直存在模型上下文中
- 適用場景：
  - 設定回應語言或語氣
  - 新增個人風格偏好

### 3. .cursorrules（Legacy）
- 位置：專案根目錄
- 狀態：Deprecated，建議遷移到 Project Rules

## 規則結構和類型

### MDC 格式
```markdown
---
description: 規則描述
globs: 檔案匹配模式
alwaysApply: false
---

- 規則內容
- 更多規則...

@referenced-file.ts
```

### 規則類型
1. Always：始終包含在模型上下文中
2. Auto Attached：當匹配檔案被引用時自動包含
3. Agent Requested：AI 可決定是否包含（需提供描述）
4. Manual：僅在使用 `@ruleName` 時包含

## 開發規則範例

官方也有提供一些範例模板 [Rules Examples](https://docs.cursor.com/context/rules#examples)，雖然就是基本的模板而已。

個人更推薦在 GitHub 社群維護的 [Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules?tab=readme-ov-file#rules)，有空可以去逛逛，可以找到許多品質不錯的模板。

這邊我也舉幾個常見的使用情境：

### 1. React/Next.js Rules

React Component Rules

這個規則適合用在你專案裡所有 React component，像是你希望大家都用 Function Component、TypeScript，或是遵循 Atomic Design、使用 Camel Case 等等，可以直接寫在這裡，AI 以後幫你產生 code 就會自動照做。

```markdown
---
description: React Component Standards
globs: src/components/**/*.tsx
alwaysApply: false
---

# Guidelines
- Use functional components with TypeScript
- Follow atomic design principles

@component-template.tsx
```

### 2. Golang Rules

HTTP Handler Rules

如果你是寫 Go 的，這個範例可以幫你規範 handler 的寫法，比如強制要有錯誤處理、要符合 RESTful 風格。以後不管誰寫 handler，大家的 coding style 都能統一。
```markdown
---
description: Go HTTP Handler Standards
globs: internal/handlers/**/*.go
alwaysApply: false
---

# Guidelines
- Use proper error handling
- Follow RESTful conventions

@handler-template.go
```

### 3. Generating rules

當然，其實也不用每條規則慢慢寫，你也能用 Agent 幫你生成規則。

直接把 Chat 模式切到 Agent，然後輸入 /Generate Cursor Rules，Cursor 就會根據你的專案自動幫你產生一份建議規則，你可以再根據自己的需求做微調。

## 最佳實踐建議

另外官方也有提到使用 Cursor Rules 時也需要注意一些最佳實踐：

1. **保持規則簡潔**
   - 目標保持在 500 行以內
   - 將大型概念拆分為多個可組合的規則
   - 提供具體範例或引用檔案

2. **避免模糊指導**
   - 像寫內部文檔一樣清晰
   - 提供具體的指導方針
   - 包含實際範例

3. **規則重用**
   - 當發現自己在聊天中重複提示時，創建規則
   - 使用 `@filename` 引用其他檔案
   - 組合多個規則以創建複雜的工作流程

4. **規則管理**
   - 使用版本控制管理規則
   - 定期審查和更新規則
   - 與團隊共享最佳實踐

## 參考來源

* [Cursor Rules](https://docs.cursor.com/context/rules)
* [Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules?tab=readme-ov-file#rules)
* [Mastering Cursor Rules: A Developer's Guide to Smart AI Integration](https://dev.to/dpaluy/mastering-cursor-rules-a-developers-guide-to-smart-ai-integration-1k65)
