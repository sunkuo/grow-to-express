# 渐进式Express源码学习6-独孤求败

这是[**渐进式Express源码学习 | 小白也能懂源码**](https://github.com/sunkuo/grow-to-express)系列文章的第六篇。

请结合该节代码阅读[Lesson6-独孤求败](https://github.com/sunkuo/grow-to-express/tree/master/Lesson6-%E7%8B%AC%E5%AD%A4%E6%B1%82%E8%B4%A5)

### 目标特性和目标用法

这篇文章我们在第五篇文章的基础上，实现一个稍微加强版的Express，功能包括

- next可以向下传递错误对象
- 错误捕捉

这篇文章要实现的express的期望用法如下

```javascript

const express = require('../index.js')
const app = express()

app.get('/foo', function handle1 (req, res, next) {
  next(new Error('Bang!'))
}, function handle2 (req, res, next) {
  res.end('Will not go here')
}, function handle3 (err, req, res, next) {
  console.log(`Error Caught! Error message is ${err.message}`)
  next(err)
})

app.get('/foo', function (req, res, next) {
  res.end('Will not go here too')
})

app.use('/foo', function (req, res, next) {
  res.end('Will not go here too')
})

app.get('/foo', function (err, req, res, next) {
  console.log(err.name)
  res.end('Will not go here too')
})

app.use('/foo', function (err, req, res, next) {
  console.log(`Error Caught! Error message is ${err.message}`)
  res.end('Go here')
})

app.listen(3000)
```

在阅读这篇文章之前，请务必了解express错误处理，例如上面的例子中，你需要知道抛出的错误是在哪个环节捕捉的，否则阅读这个文章会吃力

### 源码及讲解

这一节，会引入两个概念，路由中间件和非路由中间件
新的章节，主要有3个变化

1. lib/route/layer.js
	1. 增加handle_error
2. lib/route/route.js
	1. 修改.dispatch函数
		1. 如果有error，调用layer.handle_error
		2. 如果没有error，调用layer.handle_request
3. lib/route/index.js
	1. 增加use函数
	2. 调整handle函数

首先要讲解，路由中间件和非路由中间件。路由中间件，通过app.verb添加，结构是处理函数挂载到layer上，layer推送到route上，route的dispatch函数又挂载到一个新的layer，这个layer再推送到Router的stack中。
结构类似这样

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/18947361.jpg)

而对于非路由中间件，直接挂载到layer上，然后推送到Router的stack
结构是这样的

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/39340308.jpg)

所以，二者结合后，结构是这样的

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/21611661.jpg)

理解了上面这些，我们看具体的代码
首先是lib/route/layer.js

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/3603314.jpg)

他们的区别是如果你的layer的fn是function(req, res, next) ,调用这个layer的handle_error会直接掉过，只有当这个layer的fn是function(err, req, res, next)才会有效

再看lib/route/route.js

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/84299019.jpg)

注意第44行到48行，route.dispatch函数会判断是否有error，如果有，调用layer的handler_error函数，这样正常的路由就会被跳过

再看lib/route/index.js

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/48858030.jpg)

首先是增加了一个use函数，这个函数用来增加非路由中间件，直接创建一个layer，绑定函数后推送到stack

最后，看Router.handle，我们聚焦在next函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/82980366.jpg)

看代码第55行，这个地方判断是否是路由中间件，如果layer有route属性，说明是路由中间件，否则不是。

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/69930094.jpg)

在process_params里也是，如果有错误，调用layer.handle_error，否则调用handle_request。

### 本文总结及预告

本文实现了一个加强的Express。到目前为止，一个基本的Express已经实现了。和真实的Express相比，只是一些细节差异

你可以加我微信好友交流，**加我请备注公司和职务**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99218404.jpg)