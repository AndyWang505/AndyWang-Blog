---
title: '關於 Domain-Driven Design (DDD)'
description: '自數位轉型年代開始，軟體開發領域開始流行 DDD 一詞的說法，所謂領域驅動設計 Domain-Driven Design (DDD) 是一種軟體設計方法論，核心目的是讓程式設計與商業邏輯緊密對齊，以便未來因應商業需求變更。'
pubDate: 'September 20 2025'
heroImage: ''
tags: ['DDD', 'Clean-Architecture', 'X-Driven']
category: 'SystemDesign'
---

自數位轉型年代開始，軟體開發領域開始流行 DDD 一詞的說法，所謂領域驅動設計 Domain-Driven Design (DDD) 是一種軟體設計方法論，核心目的是讓程式設計與商業邏輯緊密對齊，以便未來因應商業需求變更。

不過這只是比較簡單的說法，這個方法論涉及的概念與層次的範圍太大，現實的情境往往更複雜且多樣，很難有一個標準化範例能完全套用。

此篇主要初步介紹 DDD，有興趣就可以根據關鍵字往下深入研究。

## 前言

其實現今在軟體開發中，應該大部分都是往 DDD 靠攏了，在面對快速變化的商業節奏，不斷擴增的系統規模，勢必是需要一個有效的管理方式，以利於未來維護與擴充，免得當一個新的需求下來時，形成牽一髮動全身的情境。

不過 DDD 沒有想像中那麼簡單，現實層面可能還需要融入像 Clean-Architecture 裡的一些概念，通過像是 Dependency Injection (DI)、Dependency inversion principle (DIP) 等來實現低耦合，並確保每個模組符合 Single responsibility principle (SRP)。

## Domain 是什麼

在開始之前，先了解在 Domain-Driven Design 中的 Domain 是什麼？

> a specified sphere of "activity" or "knowledge".
> 
> 一個明確界定的活動與知識範圍。

它可以是一個產業（例如金融、電商），也可以是更細的子領域（例如支付、訂單管理）。

* Activity：活動涉及 stakeholders（利害關係人），他們的行為、決策定義了業務運作的邊界。 
* Knowledge：知識代表 know-how，也就是包含問題與解決方案。

而一個好的 Domain 模型應該具備 高內聚、低耦合。

表示說它的邏輯與資料應該緊密相依，並與其他領域獨立。


## 為什麼需要 DDD

在 2003 年 Eric Evans 出版的《Domain-Driven Design: Tackling Complexity in the Heart of Software》書中就有提到，DDD 並非一組框架或工具，而是一種「以領域模型為核心的思考方式」，目標是處理軟體開發中複雜的業務需求。

自從軟體開發從技術導向慢慢走向 業務導向（business-oriented），開發團隊也開始意識到，許多失敗的專案並非技術不足，而是開發者與業務人員之間缺乏共通語言。

它強調團隊應建立一套 **Ubiquitous Language（通用語言）**，讓商業邏輯能直接映射到模型與程式碼中，減少認知落差與溝通成本。

![Ubiquitous Language](https://softengbook.org/articles/figs/ubiquitous-language.svg)

Ref: [Domain-Driven Design (DDD): 1.2 Ubiquitous Language](https://softengbook.org/articles/ddd)

## DDD 的實務重點

1. 與領域專家 (domain expert) 密切合作，建立通用語言（Ubiquitous Language）
   
    定期舉行 [事件風暴（Event Storming）](https://zh.wikipedia.org/zh-tw/%E4%BA%8B%E4%BB%B6%E9%A2%A8%E6%9A%B4)，讓技術與非技術人員共同參與，快速識別業務流程與痛點。

2. 根據複雜度切分子領域，專注核心領域（Core Domain）
   
    將整體業務劃分為三類子領域：
    - 核心領域（Core Domain）：最具競爭力的部分，應由內部團隊主導開發。
    - 支援子領域（Supporting Subdomain）：可使用現成解決方案，如 ERP 或 CRM。
    - 通用子領域（Generic Subdomain）：如身份驗證、支付等，可考慮外包或使用第三方服務。

3. 以商業邊界為基礎劃分限界上下文（[Bounded Context](https://martinfowler.com/bliki/BoundedContext.html)）
   
    在大型系統中，應根據商業邏輯劃分限界上下文，每個上下文擁有獨立的模型與語言。

4. 採用 [戰術設計模式](https://learn.microsoft.com/zh-tw/azure/architecture/microservices/model/tactical-ddd)，強化模型一致性與可維護性
   
    這個下面會提到，DDD 提供了多種戰術設計模式，主要是為了協助開發團隊實現高內聚、低耦合的系統架構。

5. 採用事件風暴與 [Specification by Example](https://en.wikipedia.org/wiki/Specification_by_example) 的方式，確保系統與需求一致性
   
    主要是透過這些方法讓開發團隊與業務人員可以共同定義需求與測試案例，確保系統開發與業務需求的一致性。

## 戰略設計 & 戰術設計

![DDD](/public/ddd.png)

Ref: [Domain-Driven Design Reference](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf)

在 DDD 中所有設計模式主要可以分成兩類：

上半是 戰術設計 (Tactical Design)，下半是 戰略設計 (Strategic Design)，中間透過 Ubiquitous Language 溝通。

### 戰略設計 (Strategic Design)
  - **領域（Domain）**：指企業或系統所處的業務範圍與知識集合，是模型構建的核心。領域通常會再進一步被拆分為 子領域（Subdomain），如 核心子領域（Core Subdomain）、支援子領域（Supporting Subdomain）、通用子領域（Generic Subdomain），協助劃分重點與分工。
  - **限界上下文（Bounded Context）**：為了避免模型混亂，DDD 強調每個子系統都應有明確的語意邊界。每個上下文都有自己的一套模型與語言，透過 Context Map 描述彼此的協作與依賴關係。
  - **通用語言（Ubiquitous Language）**：開發與業務共同維護的語言，確保討論、設計與程式碼命名一致。例如「訂單（Order）」在會議、文件、程式中都應有相同語意。透過事件風暴（Event Storming）等方式持續演化語言，可大幅降低溝通成本與誤解。

### 戰術設計 (Tactical Design)
  - **聚合（Aggregate）**：將高度相關的實體（Entity）與值物件（Value Object）組合為一個邏輯單位，維護業務規則的一致性（invariant consistency）。每個聚合應控制在單一交易邊界內，避免把太多東西放進一個聚合中（God Aggregate）。
  - **聚合根（Aggregate Root）**：為聚合的入口點，外部只能透過聚合根操作內部狀態。聚合根負責維護不變條件與商業邏輯，例如 Order 可確保所有訂單項目金額總和正確。
  - **實體（Entity）**：具有唯一識別（ID）的物件，其狀態會隨時間改變。實體應該擁有行為與邏輯，而非只是資料表映射。
  - **值物件（Value Object）**：無唯一識別，用來描述屬性或概念，如 Money、Address、DateRange。通常設計為不可變（immutable），比較時以值相等為準，可在多個聚合間重用。
  - **領域事件（Domain Event）**：用來描述「業務上發生的事」，如 OrderPlaced 或 PaymentCompleted。事件可作為不同上下文之間的整合手段，支援事件驅動與最終一致性。
  - **倉儲（Repository）**：提供對聚合的持久化存取介面，隔離資料庫或 ORM 細節。Repository 應避免包含太多查詢邏輯或複雜過濾條件。
  - **工廠（Factory）**：專門負責建立複雜物件或聚合，封裝初始化邏輯。例如 OrderFactory.createFrom(cart) 可在建立過程中檢查業務規則，確保狀態一致。

## 什麼時候不要用 DDD


- 問題領域過於簡單：
  
  如果系統主要是做資料的增刪改查 (CRUD)，沒有複雜的商業規則、不變條件也不多，就用 DDD 的各種模式（聚合、事件、上下文界定等）反而會造成設計過度（over-engineering），且帶來較高的維護成本。

- 問題夠複雜，但屬於非核心領域：
  
  有些系統挑戰在於性能、分散式系統、資料流、第三方整合或基礎設施等，而非業務需求，這些情況 DDD 的模型抽象對解決這種技術性挑戰幫助就會相對較少，有時還反而會阻礙對技術問題的直接處理。

- 缺乏領域專家 (Domain Expert) 或領域知識不足：
  
  DDD 的一大關鍵是通用語言 (Ubiquitous Language) 與領域專家的密切合作，如果沒辦法得到明確與持續的領域知識，就會造成模型模糊，還容易產生誤解。

- 短期專案，快速交付為導向：
  
  如果專案時間短、資源有限、需求變化小，但時程壓力大，用 DDD 的抽象／設計／設計模型迭代等可能會花費額外開發與協調成本，這些可能造成專案超時或成本超出預期。

- 組織文化或流程不支持演化與協作：
  
  因為 DDD 要求開發者、業務、架構師之間頻繁溝通、持續重構模型、適應變化。如果組織流程固定、變動少或對變動（refactoring）會抵抗，這些阻力可能就會讓 DDD 的成本被放大。


## 參考來源
* [第一隻豬:DDD的Domain是什麼意思](https://www.youtube.com/watch?v=Bn2T0Z1KSTM)
* [關於 Domain-Driven Design 以及他的魅力](https://ithelp.ithome.com.tw/m/articles/10216645)
* [DDD 學習路徑與資源分享](https://ithelp.ithome.com.tw/m/articles/10216792)