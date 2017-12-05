# 渐进式Express源码学习4-如虎添翼

这是[**渐进式Express源码学习 | 小白也能懂源码**](https://github.com/sunkuo/grow-to-express)系列文章的第四篇。

请结合该节代码阅读[Lesson4-如虎添翼](https://github.com/sunkuo/grow-to-express/tree/master/Lesson4-%E5%A6%82%E8%99%8E%E6%B7%BB%E7%BF%BC)

### 目标特性和目标用法

这篇文章里，我们在第三篇文章的基础上，实现一个稍微加强版的Express，功能包括

- 引入path，即app.get(‘user’, handler)
- 不同path由不同的函数来处理

这篇文章要实现的express的期望用法如下

```javascript
const express = require('../index.js')
const app = express()

app.get('/foo', function (req, res, next) {
  res.end('Welcome to GET /foo')
})

app.get('/bar', function (req, res, next) {
  res.end('Welcome to GET /bar')
})

app.post('/foo', function (req, res, next) {
  res.end('Welcome to POST /foo')
})

app.listen(3000)
```

### 源码及讲解
** Path的验证，核心是由layer.match进行的路由判断**
为了实现这个功能，我们共需要作出4个改进

1. lib/layer.js
	1. 构造函数传入path
	2. 增加了match函数
2. lib/route.js
	1. 构造函数传入path
3. 新增lib/route/index.js文件
4. express.js
	1. 增加.lazyrouter函数

首先看下目前的项目结构

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/46220606.jpg)

从图中我们可以看出，我们把layer，route都放到了lib/route文件夹里，里面的index.js就是我们刚才说的新增的lib/route/index.js文件

##### 我们先来看layer文件的变化
主要的变化在两点，第一点是构造函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/76369542.jpg)

注意，构造函数传入了一个path，然后还调用了pathRegexp函数。而这个pathRegexp函数其实是从path-to-regexp模块来的，他的作用是解析路径做匹配，可以直接看一个例子

```javascript
const pathRegexp = require('path-to-regexp')
const keys = []
const result = pathRegexp('/foo/:bar', keys)
```
运行之后，keys和result分别是

```javascript
result = /^\/foo\/([^\/]+?)\/?$/i
keys = [{name: 'bar', prefix: '/'}]
```

也就是说，result是一个正则表达式，而keys保存了path中的参数

我们再看layer的第二个变化，就是新增了match函数，如下

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/70268056.jpg)

最后两句是关键，调用正则表达式匹配目标path是否和layer的path相符合，并返回布尔值
到这里，我们就清晰了，path是在layer的match函数里匹配的。那match函数是在哪里调用的呢？继续往下看

##### 我们再看lib/route/index.js文件
因为route.js几乎没什么变化，所以我们直接看lib/route/index.js文件
这个文件里，定义的是Router对象
我们的设计思路是：

- app.get app.post等这类app.verb，最后本质上调用的是Router.verb
- 当请求来临时，最后调用的是Router.handle
先看Router.verb

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/82741649.jpg)

也就是说，当我们调用app.get(path, fn)的时候，Router创建了一个route进行了处理，同时把这个route的dispatch挂载到一个新的layer上，然后把这个layer推送到自己的stack中，大概是这样的结构

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/56838078.jpg)

左边的三个layer的handle都是route.dispatch，右边的3个layer的handler才是我们传入app.get的函数

再看handle函数，当有请求时，这个函数会被调用
整体的流程是遍历stack中的layer，然后调用这个layer的handle_request，实际上是调用了layer对应的route的dispatch函数。他是通过一个next递归实现的。

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/93986174.jpg)

看36行的matchLayer函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/12290634.jpg)

到这里我们就明白了，layer的match函数是在这个地方被调用的
注意
### 本文总结及预告
本文实现了一个加强的Express，可以传入path，本质上是通过path-to-regexp来实现的路径的判断

你可以加我微信好友交流，**加我请备注公司和职务**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99218404.jpg)