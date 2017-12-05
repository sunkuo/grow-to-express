# 渐进式Express源码学习5-全副武装

这是[**渐进式Express源码学习 | 小白也能懂源码**](https://github.com/sunkuo/grow-to-express)系列文章的第五篇。

请结合该节代码阅读[Lesson5-全副武装](https://github.com/sunkuo/grow-to-express/tree/master/Lesson5-%E5%BC%80%E5%A4%A9%E8%BE%9F%E5%9C%B0)

### 目标特性和目标用法
这篇文章我们在第四篇文章的基础上，实现一个稍微加强版的Express，功能包括

- 可以获取req.params
- 提供app.param能力

这篇文章要实现的express的期望用法如下

```javascript
const express = require('../index.js')
const app = express()

app.get('/user/:userId', function (req, res, next) {
  res.end(`Welcome, the user.id = ${req.params.userId} and the user.name is ${req.user.name}`)
})

app.param('userId', function (req, res, next, userId, key) {
  req.user = {
    id: userId,
    name: 'foo'
  }
  next()
})

app.get('/article/:title', function (req, res, next) {
  res.end(`Welcome, the article's title is ${req.params.title}`)
})

app.listen(3000)
```

如果你对app.param函数和req.params不熟，请在阅读这个文章之前，先看express文档，了解这两个东西的用法，否则不好理解这节课

### 源码及讲解

**核心实现：1. layer借助path-to-regexp提取params。 2.在Router.handle里面，process_params函数依次调用参数处理函数**

这节课里，和上一节课，主要的变化体现在2个方面，其他的文件的变化很好理解，这里不做解释

1. lib/route/layer.js
	1. 在match函数里面，获取到req对象的params值
2. lib/route/index.js
	1. 增加process_params
	2. 增加param函数
	3. handle
		1. 把layer的params复制req
		2. 调用process_params
		
首先我们看layer.match函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99829347.jpg)

还记得这个layer.match是在哪里调用的吗？是在请求到来的时候，Router.handle里面调用的，也就是说我们这个时候有了req，也有了req的path。

看第52行的keys，还记得这个keys是什么吗？没错，就是保存了参数对象的数组[{name: ‘userId’}]这样的。 52-61行做的事情，就是在path匹配的情况下，把path里面的参数值提取出来，放到layer.params里面

再看lib/route/index.js文件，先看Router.param函数，这个函数是我们在调用app.param函数的时候，底层调用的函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/64639282.jpg)

从图中我们可以看到，他其实什么也没做，只是把fn保存在了数组里
我们再看Router.process_params函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/1386472.jpg)

这个函数里面，有两层递归，分别是param()和paramCallback()。对这两个函数，简单的说，有几个参数就会调用几次param，计数器是keys.length（代码86行），例如

```javascript
app.get('/user/:userId')
// 这个只有一个参数userId，param()只会被调用一次
app.get('/order/:type/:state')
// 这个有两个参数，分别是type和state，param()会被调用两次
```

而paramCallback是当前参数有几个处理函数，就调用几次，计数器是paramIndex（代码101行），每个参数都会清空，例如

```javascript
app.param('userId', fn1)
// 这个userId只有一个处理函数，paramCallback只会调用一次
app.param('userId', fn1, fn2)
// 这个userId有两个处理函数，paramCallback会调用两次
```

我们可以通过例子具体讲解param()和paramCallback()的递归

```javascript
app.get('/user/:userId', fn)
app.param('userId', handle)
```

上面这个例子里，按时间顺序

- param调用，对应参数userId
- paramCallback调用，对应参数handle

```javascript
app.get('/order/:type/:state', fn)
app.param('type', handle1, handle2)
app.param('state', handle3)
```

上面这个例子里，按时间顺序

- param调用，对应参数type
- paramCallback调用，对应参数handle1
- paramCallback调用，对应参数handle2
- param调用，对应参数state
- paramCallback调用，对应参数handle3

具体实现可以看代码
### 本文总结
本文实现了一个加强的Express，拥有app.param能力，也可以获取req.params

你可以加我微信好友交流，**加我请备注公司和职务**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99218404.jpg)