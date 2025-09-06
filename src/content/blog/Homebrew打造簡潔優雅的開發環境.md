---
title: 'Homebrew 打造簡潔優雅的開發環境'
description: '近期工作換到 MacOS 上開發，也因此接觸到 Homebrew。除了是開源之外，Homebrew 也非常容易透過 CLI 來安裝各種 Package，當需要換開發環境時，也能夠整包匯出帶到新的環境。'
pubDate: 'October 5 2024'
heroImage: '/Web-Dev.jpg'
tags: ['Notes', 'Homebrew', 'Package']
category: 'Package'
---

近期工作換到 MacOS 上開發，也因此接觸到 Homebrew。除了是開源之外，Homebrew 也非常容易透過 CLI 來安裝各種 Package，當需要換開發環境時，也能夠整包匯出帶到新的環境。

## 為什麼需要套件管理工具

一般常見的 CLI 工具，如 `bash`、`pip`、`npm`、`git` 等等，通常需要單獨下載並安裝

每個工具的套件和版本管理也需要分別處理，這可能導致難以統一管理所有套件及其版本

假如你需要更換開發環境時，你也需要將所有套件移植到另一個環境上

而全部一一安裝非常耗時且麻煩，更別說還需要因應專案裝固定的版本，所以你會需要一個套件管理工具幫你做這些事情。

## Homebrew

Homebrew 是一個在 MacOS 和 Linux 上著名的套件管理工具，使用 Ruby 開發

它大大減化了軟體或套件安裝的流程，只需要靠一行簡單的指令即可安裝，同時它也自動幫你處理依賴關係，解決了 macOS 和 Linux 上自行編譯和維護開發環境的困難。

如果你需要換到另一個開發環境，Homebrew 也可以打包匯出直接帶到新的環境上，非常方便。

## 快速安裝

基本上安裝流程非常簡單且方便

直接在 terminal 輸入以下指令即可

```bash=
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

過程中會要你輸入電腦的密碼

安裝好後可以執行看看以下這段查看版本號，也可以確定是否已經安裝好

```bash=
brew --version
```

## 如何使用

有了 Homebrew 之後你就可以自由地安裝你想安裝的軟體或套件拉

像是做 web dev 需要不同的瀏覽器來做測試

那我就可以一併安裝 chrome、edge、brave、firefox

```bash=
brew install --cask google-chrome microsoft-edge brave-browser firefox
```

另外我也需要安裝一些開發用的 CLI，像是 git、pnpm、node

```bash=
brew install git pnpm node
```

## 指令集

還有一些常用的指令集

* help 查看有哪些指令可以使用

    ```bash=
    brew help
    ```
* update 更新 Homebrew 到最新版本

    ```bash=
    brew update
    ```

* search 查詢是否已有該軟體或套件

    ```bash=
    brew search <formula>
    ```

* install 安裝

    ```bash=
    brew install <formula>
    ```

* uninstall 移除

    ```bash=
    brew uninstall <formula>
    ```

* info 查看資訊

    ```bash=
    brew info <formula>
    ```

* list 列出目前已安裝哪些軟體或套件

    ```bash=
    brew list
    ```

* 以樹狀圖列出目前已安裝軟體或套件

    ```bash=
    brew deps --tree $(brew leaves)
    ```

* upgrade 更新軟體或套件

    ```bash=
    brew upgrade <formula>
    ```

* cleanup 刪除過期版本的暫存

    ```bash=
    brew cleanup
    ```

## 移植到新環境

首先，可以在舊的環境，輸入以下指令來生成已安裝的套件列表

```bash=
brew bundle dump --file=~/Brewfile
```

輸入完後會在根目錄中創建一個名為 Brewfile 的文件，裡面記錄了所有已安裝的 Homebrew 套件、casks，以及 taps

接著在新環境裝好 Homebrew 後，將剛剛打包的 Brewfile 複製到新環境

輸入以下指令，它就會根據 Brewfile 安裝所有套件

```bash=
brew bundle --file=~/Brewfile
```

## 參考來源

* [Homebrew](https://brew.sh/zh-tw/)
* [使用 Homebrew 管理 Mac 套件](https://ithelp.ithome.com.tw/articles/10231649)