---
title: 'Kubernetes - Deployment Strategies'
description: '在軟體業工作一陣子後，一定都會碰到 Zero Downtime 的問題，特別是在版本更新時，如何確保系統穩定、不影響使用者體驗，如何解決是 DevOps 中的重要課題。'
pubDate: 'January 31 2025'
heroImage: '/Kubernetes.png'
tags: ['Notes', 'Kubernetes', 'Deployment']
category: 'Kubernetes'
---

在軟體業工作一陣子後，一定都會碰到 Zero Downtime 的問題，特別是在版本更新時，如何確保系統穩定、不影響使用者體驗，如何解決是 DevOps 中的重要課題。

其中，基本也最常見的兩種策略就是，Blue-Green Deployment 和 Rolling Update Deployment。

## 前言

由於過去對於完整的軟體開發流程不太熟悉，以為上版或是 hotfix 停機在多數情況下是件正常不過的事情。

雖然停機並非錯誤的做法，但 Recreate 需要較高的溝通成本，涉及跨部門協作與物流之間來回的溝通，多少帶來一些心智負擔，且以電商為例，還可能需要承擔訂單流失的風險。

既然如此，有沒有更好的部署策略，可以降低停機時間，並且確保業務不中斷呢？

而其中相對常見的就是 Blue-Green Deployment 和 Rolling Update Deployment。

## Deploy 的演變歷史

在早期的軟體部署，應用程式通常直接運行在物理伺服器上，由於無法有效限制應用程式的資源使用，因此造成資源分配不均，當時的解法就是分別將應用程式運行在獨立伺服器，確保穩定運行。

而這種方式帶來了兩大問題：

1. 高昂的維護成本：每台伺服器都需要獨立管理、維護，企業的 IT 營運成本隨著應用數量增長而飆升。

2. 資源浪費：當某台伺服器的應用資源需求較低時，閒置的資源無法共享給其他應用程式，導致資源浪費。

於是開發者開始思考一種方法，是否能在同一台伺服器為不同的應用程式提供「虛擬隔離」，以提高資源使用率，最終就催生了「虛擬化技術」。

後來虛擬化技術也被漸漸引入，允許在單個物理伺服器上運行多個虛擬環境，且應用程式與應用程式之前也被不同虛擬環境隔離，可以讓資源更有效的被利用，也減少了硬體設備的成本。

不過，雖然 VM 能成功地解決了應用隔離與資源浪費的問題，但還是存在一些限制：

* 系統啟動速度慢：每個 VM 都包含一個完整的作業系統，因此啟動時需要花費額外的時間與資源。
* 佔用較多系統資源：每個 VM 都需要獨立的 OS 核心與系統環境，導致系統開銷大。
* 移植性低：VM 的應用程式與系統環境完全綁定，也導致遷移與部署的過程十分繁瑣。

而後，就有了「容器化技術」，像是：Docker、Kubernetes（K8s）。相比之下容器化就具有，輕量化、快速啟動、高度可移植的特性。

## Kubernetes 解決了什麼問題

隨著企業開始採用 Docker 容器化技術，新的挑戰就變成了：

* 如何管理大量的容器
* 如何動態的分配資源、維持系統穩定性
* 如何應對應用程式的擴展需求，e.g. 高併發流量

而 Kubernetes 不僅是一個容器管理工具，更是 **微服務架構的核心管理系統**，讓它能夠在多台機器上實現自動化部署、管理、擴展和監控容器。

如果進到 Kubernetes 官網也可以看到簡單的介紹：

> Kubernetes, also known as K8s, is an open source system for automating deployment, scaling, and management of containerized applications.

其中最核心的能力就是自動化部署、擴展與管理容器化應用，幾乎涵蓋了 DevOps 所需的基礎架構管理，可以說是實現了 [Infrastructure as Code（IaC）](https://en.wikipedia.org/wiki/Infrastructure_as_code)。

## Blue-Green Deployment & Rolling Update Deployment

另外，Kubernetes 也提供多種 Zero Downtime Deployment 的策略來確保應用更新時不影響用戶體驗，其中最常見的兩種方式是 Blue-Green Deployment 和 Rolling Update Deployment。

### Blue-Green Deployment

Blue-Green Deployment 藍綠部署是一種「Zero-downtime」的部署方式，核心概念是同時維持兩個環境（藍色與綠色）：

* 藍色環境（Blue）：當前正在運行的版本。
* 綠色環境（Green）：新版本的應用，部署完成後會進行流量切換。

當新的綠色環境準備就緒後，Kubernetes 會將流量從藍色環境切換到綠色環境，確保應用更新過程中不影響用戶。若新版本出現問題，可以快速回滾到舊版本。

優點：
* 提供更安全的回滾機制，只需切換流量即可回到舊版本。
* 無中斷部署，確保用戶不受影響。

缺點：
* 需要維持兩個完整的環境，可能會導致資源浪費。

### Rolling Update Deployment

Rolling Update Deployment 滾動部署是一種逐步替換 Pod 的方式，確保應用在更新時保持可用：

* Kubernetes 逐步關閉舊版本的 Pod，並啟動新版本的 Pod。
* 每次替換一部分 Pod，直到所有舊版本的 Pod 都被新版本取代。
* 期間若發生異常，可立即回滾到上一版本。
* 這種方式適合大多數應用，因為它允許平滑過渡，避免一次性切換帶來的風險。

優勢：
* 更節省資源，不需要額外維持兩個完整環境。
* 滾動更新，確保服務不中斷，並允許持續監測新版本的穩定性。

缺點：
* 若新版本出現問題，部分用戶可能會遇到異常。
* 可能需要更長的時間來完成更新。

最後，官方也有提供以 Jenkins 為例的示範，有興趣可以參考：
* [Blue/green Deployment](https://kubernetes.io/blog/2018/04/30/zero-downtime-deployment-kubernetes-jenkins/#blue-green-deployment)。
* [Rolling Update](https://kubernetes.io/blog/2018/04/30/zero-downtime-deployment-kubernetes-jenkins/#rolling-update)。

## 其他常見的部屬策略

另外還有其他常見的部屬策略，像是：

* Recreate Deployment
    * 最簡單的部署方式，會一次性刪除所有舊版 Pod，然後再創建新版 Pod，也就代表在新的 Pod 啟動完成前，應用都會處於無法使用狀態。
* Canary Deployment
    * 先將新版本部署到部分 Pod，然後逐步擴展，以監測新版本的表現，例如：一開始讓 5% 的流量使用新版本，確保穩定後慢慢擴展到 20% → 50% → 100%。
* A/B Testing Deployment
    * 與 Canary Deployment 策略類似，但 A/B 測試會根據不同的使用者群體來分配新舊版本，例如：新版本只提供給 VIP 會員或特定地區的用戶，其餘用戶仍繼續使用舊版本。
* Shadow Deployment
    * 影子部署不會影響現有用戶，而是將生產環境的真實流量複製一份給新版本進行測試，通常是開發團隊需要驗證新版本的效能，而不會影響使用者體驗。
* Immutable Deployment
    * 每次部署時，都創建一個新的 Pod，而舊版本的 Pod 不會被修改，且每個版本的 Pod 都是獨立的，確保版本管理清晰，避免因手動變更而導致問題。

上述部屬方式各有優缺點，也適用於各種不同情境，不論是要追求零停機更新、漸進式發布，還是驗證新版本的效能，其實都可以透過 Kubernetes 的靈活部署機制有效地管理應用程式的升級過程，並且確保服務不中斷。

## 參考來源

* [從異世界歸來發現只剩自己不會 Kubernetes 系列](https://ithelp.ithome.com.tw/users/20149562/ironman/5366?page=2)
* [Zero-downtime Deployment in Kubernetes with Jenkins](https://kubernetes.io/blog/2018/04/30/zero-downtime-deployment-kubernetes-jenkins/)
* [部署策略簡介：藍綠部署 vs 金絲雀部署 vs 其他部署](https://codelove.tw/@tony/post/Zq42b3)