---
title: 'JavaScript 之 this 的運作'
description: '在 JavaScript 中，this 的指向通常是根據函數如何被調用來決定的。首先我們先觀察一個函式的參數包含哪些東西'
pubDate: 'July 10 2022'
heroImage: '/JS-Image1.jpg'
tags: ['JavaScript', 'Notes']
category: 'JavaScript'
---

在 JavaScript 中，this 的指向通常是根據函數如何被調用來決定的。

首先我們先觀察一個函式的參數包含哪些東西

## 一個 function 中包含的參數

```javascript
var a = '全域';
function fn(params){
    console.log(params, this, window, arguments);
    debugger;
}
fn(1,2,3);
```

![](https://i.imgur.com/LNEnFHC.png)

若開啟 console 可以看到 fn 這個 function 作用域中存在 arguments、params、this、windows 這四個參數

* arguments　把所有參數傳入，若有三個那就會傳入3個
![](https://i.imgur.com/dePFeY1.png)

* params 預設參數，因只有傳一個所以只有1
* this 目前是指向window，全域
* window 為瀏覽器本身存在的全域

## this 的指向

**重點：this 的指向只跟調用方式有關**

### simple call

```javascript
var a = '全域';
function callsomeone(){
    console.log(this.someone);
}
callsomeone(); //simple call(簡易呼叫)
```

因line:5 callsomeone目前沒有任何指向，所以this是指向全域的部分，稱為simple call

### 物件函式呼叫

#### Ex.1

```javascript
var obj =  {
    someone:'物件',
    callsomeone(){
        console.log(this.someone);
    }
}
obj.someone();
```

line:7 呼叫函式前若有物件，就會是this的指向，就是obj

#### Ex.2

```javascript
var someone = '全域';
function callsomeone(){
    console.log(this.someone);
}

var obj2 = {
    someone:'物件2',
    fn(){
        callsomeone();
    }
}
obj2.fn();
```

記得我們 this 的重點是，this 的指向只跟調用方法有關，所以 line:9 的 callsomeone 前沒有任何指向的物件，所以是這裡的 this 會是指向全域，也是 simple call 的一種

### 物件呼叫函式

```javascript
function callsomeone(){//3
    console.log(this.someone);//4
}
var wrapObj = {
    someone:'外層物件',
    callsomeone,
    innerObj:{//5
        someone:'內層物件',//6
        callsomeone,//2
    }
}
wrapObj.innerObj.callsomeone();//1
```

this 的指向為 innerObj 物件，結果為內層物件

### ES6箭頭函式

重點：箭頭函式沒有自己的 this

#### Ex.1 傳統函式

```javascript
var name = '全域';
const person = {
    name:'小明',
    callName: function(){
        console.log('1',this.name);//1小明
        setTimeout(function(){
            console.log('2',this.name);//2
            console.log('3',this);//3
        },10);
    }
}
person.callName();
```

line:5 指向 person 物件的 name 小明，setTimeout 大部分屬於 sample call，this 指向全域，line:8 指向 window

#### Ex.2 箭頭函式

```javascript
var name = '全域';
const person = {
    name:'小明',
    callName: function(){
        console.log('1',this.name);//1小明
        setTimeout(() => { //與外層函式作用域相同
            console.log('2',this.name);//2
            console.log('3',this);//3
        },10);
    }
}
person.callName();
```

箭頭函式 setTimeout 會跟 line:4 外層函式的作用域相同，外層指向哪裡，內層就相同，所以 1:小明、2:小明、3:person物件

#### Ex.3 箭頭函式

```javascript
var name = '全域';
const person = {
    name: '小明',
    callName:() => {
        console.log(this.name);
    }
}
person.callName();
```

若外層沒有函式，則指向全域，this 指向全域

### 實戰手法

實戰中有兩種方式避免 this 不如預期

* this 先指向其他變數
* 使用箭頭函式，相對精簡

#### this 先指向其他變數

```javascript
var someone = '全域';
var obj3 = {
    someone:'物件3',
    fn(){
        const vm = this;
        setTimeout(function(){ //callback function
            console.log(vm.someone);
        });
    }
}
obj3.fn();
```

可以確保 this 不受到函式的影響

#### 使用箭頭函式

```javascript
var someone = '全域';
var obj3 = {
    someone:'物件3',
    fn(){
        setTimeout(() => { //callback function
            console.log(this.someone);
        });
    }
}
obj3.fn();
```

透過這種方式可以讓內層的作用域與外層相同，this 的指向為全域

##### 以上皆為自己整理的筆記，僅供參考與複習使用。