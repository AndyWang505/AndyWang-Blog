---
title: 'MacOS 將 Docker 檢測為惡意軟體問題'
description: '近期在開發過程中，因為重新啟動了 MacOS 後一直跳出不明彈窗，顯示檢測到 Docker 包含惡意軟體，也因為這個東西搞了個大烏龍，算是個寶貴的經驗...，還是紀錄一下好了。'
pubDate: 'January 11 2025'
heroImage: '/Docker.png'
tags: ['Notes', 'Docker']
category: 'Docker'
---

前天在開發過程中，因為重新啟動了 MacOS 後一直跳出不明彈窗，顯示檢測到 Docker 包含惡意軟體，也因為這個東西搞了個大烏龍，算是個寶貴的經驗...，還是紀錄一下好了。

## 前言

感覺是我自己對於碰到這類問題還沒有太大的警覺心，因為 MacOS 一直判定 Docker 為惡意軟體，原本還好好的，而當下的我也沒有多想，想說應該是權限的問題吧，身邊同事或部門也還沒有人碰到類似問題，當下求助無門。

後來改了下權限和重啟 Docker 都沒有解決，也嘗試安裝了許多不同版本的 Docker，雖然不會再跳出檢測到惡意軟體的彈窗，但最終還是啟不了 Docker...

這時候我就急了，心想完了，啟不了 Docker 我要怎麼開發，難道我要自己動手架環境在 local 嗎？這會不會導致更多問題產生，最後又嘗試了很久，覺得沒有辦法了，可能只剩下重灌回復原廠預設...

我也不知道為何會有這種想法，重灌應該是最最最後，不得已的方法，總之，我後來就重灌了，我只求快點解決這個問題。

重灌後也確實解決了這個問題，但我搞出了一個超級麻煩的問題，就是我把 GitLab 的 SSH Key 也跟著清掉了，然後我也忘記了 Recovery Code，且我上次換手機也沒有重登 Authenticator...

所以我整個也是登不進 GitLab，Docker 是好了，但變成沒有 GitLab 還是不能開發 = =

後來還麻煩 IT 幫我重弄一個帳號加進 Project Members，讓我暫時可以先開發...

頭好痛，真的是一團糟...

後來同事也有碰到相同的問題，而他後來成功解掉了，所以來說說碰到 Docker 被檢測為惡意軟體怎麼辦吧...

## 解決方法

印象中當時是重啟之後，畫面是會不斷的跳出包含惡意軟體的訊息

![](/docker-issues.png)

猜測應該是 MacOS 更新到 15 後，才開始出現此問題的，在一般網路上好像都找不到類似的問題，大多都會說是權限的問題

不過到 GitHub Issues 繞一圈有看到關於 Docker 無法正常開啟，會一直被丟到垃圾桶

> [Docker is damaged and can’t be opened. You should move it to the Bin. #7531](https://github.com/docker/for-mac/issues/7531)

以及 macOS 將 Docker 誤判為惡意軟體，並無法正常啟動的問題

> [[Workaround in description] Mac is detecting Docker as a malware and keeping it from starting #7520](https://github.com/docker/for-mac/issues/7520)

後來解決方法是參考下面有個 Comment 有整理

What works for me (tested on two MacBooks):

1. `sudo pkill [dD]ocker`

    pkill [dD]ocker 強制終止正在運行的 Docker 進程。pkill 是用來終止進程的工具，[dD]ocker 用於匹配大小寫不敏感的 "Docker" 字串，確保終止所有 Docker 相關的進程。

2. `sudo rm /Library/PrivilegedHelperTools/com.docker.vmnetd`

    刪除 Docker 的一個輔助工具文件 `com.docker.vmnetd`，這是 Docker 用來管理網路虛擬化的進程，這個文件可能在更新或安裝過程中出了問題。

3. `sudo rm /Library/PrivilegedHelperTools/com.docker.socket`

    類似第3點，刪除一個名為 `com.docker.socket` 的輔助工具文件，這個文件負責處理 Docker 的交互訊息。

4. Download the fresh and up-to-date .dmg from the Docker website. Install it.

    到 Docker 官網重新下載最新版本的 `.dmg` 安裝檔，並重新安裝 Docker，這個步驟是為了保證安裝的是一個乾淨的、最新的 Docker 版本。

5. `sudo cp /Applications/Docker.app/Contents/Library/LaunchServices/com.docker.vmnetd /Library/PrivilegedHelperTools/`

    將 Docker 應用程式中所需的 `com.docker.vmnetd` 文件複製到 `PrivilegedHelperTools` 目錄中，這樣 Docker 就可以重新註冊該輔助工具並正常啟動了。

Now everything should be working, no reboots needed

## 參考來源

* [Docker desktop for mac os 15 beta issues](https://forums.docker.com/t/docker-desktop-for-mac-os-15-beta-issues/142631)
* [[Workaround in description] Mac is detecting Docker as a malware and keeping it from starting #7520](https://github.com/docker/for-mac/issues/7520)