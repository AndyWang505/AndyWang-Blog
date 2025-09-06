---
title: '語言標籤手動控制測試'
description: '展示如何手動控制語言標籤的顯示'
pubDate: 'September 7 2025'
heroImage: '/ClaudeCode.png'
tags: ['test', 'terminal', 'code']
category: '測試'
---

# 語言標籤手動控制測試

## 預設行為（自動判斷）

### 終端機語言（預設不顯示標籤）
```bash
echo "bash 終端機 - 預設不顯示標籤"
```

```powershell
Write-Output "PowerShell 終端機 - 預設不顯示標籤"
```

### 程式語言（預設顯示標籤）
```javascript
console.log("JavaScript - 預設顯示標籤");
```

```python
print("Python - 預設顯示標籤")
```

## 手動控制：強制顯示標籤

使用 `badge="true"` 強制顯示語言標籤：

### 終端機語言 + 強制顯示標籤
```bash badge="true"
echo "bash 終端機 - 強制顯示標籤"
```

```powershell badge="true"
Write-Output "PowerShell 終端機 - 強制顯示標籤"
```

### 程式語言 + 強制顯示標籤
```javascript badge="true"
console.log("JavaScript - 強制顯示標籤");
```

## 手動控制：強制隱藏標籤

使用 `badge="false"` 強制隱藏語言標籤：

### 程式語言 + 強制隱藏標籤
```javascript badge="false"
console.log("JavaScript - 強制隱藏標籤");
```

```python badge="false"
print("Python - 強制隱藏標籤")
```

### 終端機語言 + 強制隱藏標籤
```bash badge="false"
echo "bash 終端機 - 強制隱藏標籤"
```

## 複合使用範例

### 有標題 + 強制顯示標籤
```javascript title="app.js" badge="true"
// 有標題通常不顯示標籤，但我們強制顯示
const express = require('express');
const app = express();
```

### 有標題 + 強制隱藏標籤
```python title="main.py" badge="false"
# 有標題 + 強制隱藏標籤
def main():
    print("Hello World")
```

### 覆蓋框架類型 + 控制標籤
```powershell frame="code" title="Profile.ps1" badge="true"
# PowerShell 當作程式碼框架 + 顯示標籤
function Watch-Tail { 
    Get-Content -Tail 20 -Wait $args 
}

```

## 新功能：頂部語言標籤

使用 `langTop="true"` 在程式碼區塊上方顯示語言標籤：

### 頂部語言標籤範例
```javascript langTop="true"
console.log("JavaScript - 頂部顯示語言標籤");
```

```python langTop="true"
print("Python - 頂部顯示語言標籤")
```

```bash langTop="true"
echo "bash 終端機 - 頂部顯示語言標籤"
```

### 組合使用：右上角 + 頂部
```typescript badge="true" langTop="true"
// 同時顯示右上角標籤和頂部標籤
interface Config {
  apiUrl: string;
  timeout: number;
}
```

### 頂部標籤 + 標題
```java title="Main.java" langTop="true" bage="true"
// 有標題 + 頂部語言標籤
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}

## 用法總結

- **無屬性**：使用預設行為（終端機語言隱藏，程式語言顯示）
- **`badge="true"`**：強制顯示語言標籤
- **`badge="false"`**：強制隱藏語言標籤
- **有 `title`**：預設不顯示標籤（除非用 `badge="true"` 強制顯示）