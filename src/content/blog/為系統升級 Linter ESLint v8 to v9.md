---
title: '為系統升級 Linter: ESLint v8 to v9'
description: '近期有機會幫團隊專案升級一下 Linter，特別記錄下升級這類工具前需要進行的前置作業，包括盤點 dependencies 的相容性與升級流程，方便日後升級或維護時參考。'
pubDate: 'April 20 2025'
heroImage: '/linter.png'
tags: ['Linter', '心得', 'ESLint']
category: '心得'
---

近期有機會幫團隊專案升級一下 Linter，特別記錄下升級這類工具前需要進行的前置作業，包括盤點 dependencies 的相容性與升級流程，方便日後升級或維護時參考。

## 前言

為了能夠支援更新的 ECMAScript 語法及更完整的 ESLint Rules，團隊在前陣子已經先將 Node.js 版本從 18 升級至 20，為後續工具升級打下基礎。

而這次也接著將 ESLint 從 8 升至 9，剛好 ESLint v9 起官方已明確不再支援 Node.js 18 以下的版本，所以這次升級也算順勢淘汰了舊環境，讓整體工具鏈更現代化且一致。

另外小小提到 ESLint v9 的重點，就是相較 v8 來說更加精簡與模組化，同時也移除了對傳統 `.eslintrc` 配置格式（如 `.eslintrc.js`, `.eslintrc.json`）的支援，改為採用 Flat Config 模式，也就是使用 `eslint.config.js` 的方式進行配置。

改用 Flat Config 的優點就是只使用標準 JavaScript 模組語法（支援 ESM & CommonJS），不需額外針對格式去解析（JSON、YAML、JS），且結構也改走扁平化（flat）結構，讓每一筆設定更獨立、清晰，有助於追蹤與維護，避免過往設定能繼承或合併產生的混淆與衝突。

## 盤點 dependencies 相容性

在升級 ESLint 前，通常建議先盤點專案中與 ESLint 相關的相依套件版本，可能需要一併升級，像常見的 React 或 Next 專案中可能包含：

- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-jsx-a11y
- eslint-plugin-import
- eslint-plugin-unused-imports
- eslint-config-next（for Next.js）
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser（for TypeScript）

這些套件通常會針對特定 ESLint 主版本（如 v8 或 v9）做版本相依，因此在升級 ESLint 到 v9 時，也可能需要同步升級上述套件到對應支援版本，以避免出現版本衝突或規則無效的問題。

如果專案使用的是 `eslint-config-airbnb`、`eslint-config-prettier`、`eslint-config-standard` 等 Preset，這些也有可能依賴特定的 ESLint 主版本，建議檢查其對 ESLint v9 的支援情況或是否已有新版再做升級。

## 快樂升級

升級的流程當時有參考一下官方的 [升級指南 Migrate to v9.x](https://eslint.org/docs/latest/use/migrate-to-9.0.0#drop-old-node)，大致上可以分為以下幾個重點：

1. Node.js 版本要求提升

    ESLint v9 不再支援 Node.js 18.18 以下與 v19，請確保你的 Node.js 至少為 v18.18 或更新版本。

2. 新預設設定格式：Flat Config

    v9 起預設只支援 `eslint.config.js`（Flat Config），不再自動讀取 `.eslintrc` 系列設定檔。建議將設定檔轉換為 Flat Config 格式。

    官方也有提供一段 command 來協助轉換，可以參考 [Migrate Your Config File](https://eslint.org/docs/latest/use/configure/migration-guide#migrate-your-config-file)。

    ```bash
    npx @eslint/migrate-config .eslintrc.json
    ```

3. 部分格式化工具與規則移除

    官方移除了多個內建 formatter 及部分規則（如 require-jsdoc、valid-jsdoc），如有需要請改用對應的 npm 套件。

4. Preset 與 Plugin 相依性

    若專案有用到如 `eslint-config-airbnb`、`@typescript-eslint` 等 preset 或 plugin，請一併升級到支援 v9 的版本，避免相容性問題。

5. 其他 Breaking Changes

    - `eslint:recommended` 規則有更新
    - CLI 行為有些微調整（如 --quiet、--output-file 等）
    - 多個 `/* eslint */` 註解不再允許重複設定同一規則

## V9 才有的 Rules

ESLint v9 除了升級底層架構，也針對部分規則做了加強與調整，讓靜態檢查更嚴謹、更貼近現代 JavaScript/TypeScript 開發需求：

1. 更嚴謹的 no-unused-vars

    `no-unused-vars` 現在預設會檢查 catch 區塊的錯誤參數（`caughtErrors: "all"`），避免 try-catch 裡的錯誤參數被宣告但沒用到。

    像以前常常 catch (err) 但沒用到 err，現在會被提醒，減少多餘變數。

2. no-useless-computed-key

    會自動抓出 class 裡那種多餘的中括號 key（像是 `class { ['foo']() {} }`），提醒你可以直接寫 `foo()`。

3. no-implicit-coercion

    型別隱式轉換的檢查更全面，像是 `!!foo`、`+bar` 這種寫法就會被提醒，減少隱性 bug。

4. no-constructor-return 與 no-sequences

    這兩個規則的 schema 更嚴謹，像是 constructor 不該 return 東西、多重逗號運算（,）這類出 bug 都很難排查，而這些也都會被 ESLint 抓出來。

5. no-inner-declarations

    function/class 宣告的位置檢查更彈性，以前有時 function 寫在 if 裡會被警告，現在可以根據團隊需求調整。

    > 在 ES5 以前，function declaration（宣告式函式）只能出現在程式的最頂層（global scope）或另一個 function 內，不能直接寫在區塊（如 if、for）裡。雖然有些瀏覽器允許這樣寫，但不同瀏覽器的行為可能不一樣，會導致出現不如預期的 bug。

6. no-invalid-regexp

    會檢查正則表達式的 flag 是否正確（像是 `RegExp('a', 'gg')` 這種錯誤 flag 會被抓），減少 typo，寫錯就不會等到 runtime 才發現。

7. camelcase

    allow 選項現在只接受 string array，避免誤用，讓命名規則更一致。

8. 多個 `/* eslint */` 註解不再允許重複設定同一規則

    以前同一行可以重複寫多個 eslint 註解，現在不行了，規則覆蓋行為更直觀。

## 參考來源

* [Configuration Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
* [Migrate to v9.x](https://eslint.org/docs/latest/use/migrate-to-9.0.0#drop-old-node)
