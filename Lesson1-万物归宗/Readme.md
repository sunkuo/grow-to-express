# 渐进式Express源码学习1-万物归宗

这是[**渐进式Express源码学习 | 小白也能懂源码**](https://github.com/sunkuo/grow-to-express)系列文章的第一篇。

请结合该节代码阅读[Lesson1-万物归宗](https://github.com/sunkuo/grow-to-express/tree/master/Lesson1-%E4%B8%87%E7%89%A9%E5%BD%92%E5%AE%97)

### 预期特性和预期用法
这篇文章我们实现一个最最基础的Web框架，功能包括

- 默认响应客户端请求
- 当请求到来时，返回给用户一个字符串

具体的用法如下（我们用my-express表示这个框架）

```javascript
const express = require('../index.js')
const app = express()
app.listen(3000)
```

### 源码及讲解

首先在Node中，和网络请求相关的模块是http，我们可以用http搭建一个简单的web服务器，如下代码

```javascript
const http = require('http')
const server = http.createServer(function (req,res) {
	res.end('Response From Server')
})
server.listen(3000)
```

上面的代码中，我们调用http模块的createServer函数，传入一个相应请求的函数。这个就是一个简单的Web服务，非常好理解。Node文档里对createServer函数有说明。

基于上面的代码，我们稍微做下调整，就是我们第一个Express的源码，如下

```javascript
const http = require('http')
const mixin = require('merge-descriptors')
module.exports = function createServer() {
  const app = function (req, res) {
    res.end('Response From Server')
  }
  mixin(app, proto, false)
  return app
}
const proto = Object.create(null)
proto.listen = function (port) {
  const server = http.createServer(this)
  return server.listen.apply(server, arguments)
}
```

代码开头，我们引入http模块和merge-descriptors模块。http模块是Node原生模块不多说，merge-descriptors是第三方模块，主要是通过descrptors合并对象，他的用法是

```javascript
var thing = {
  get name() {
    return 'jon'
  }
}

var animal = {
}

merge(animal, thing)

animal.name === 'jon'
```

更多关于merge-descriptors的实现可以看https://github.com/component/merge-descriptors

然后我们exports是一个函数，用户调用之后，会拿到一个对象，这个对象本身是一个函数，并且还有一个listen方法。当调用app.listen的时候，实际上就调用了http模块的createServer函数，然后把自己当做requestListener传入

### 动手实验
目前我们整个项目的文件结构是

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/10367651.jpg)

我们首先通过命令node example/index.js运行样例
然后我们通过下面命令来测试我们的程序是否正常工作

```shell
curl http://localhost:3000
```

结果如图

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/39940402.jpg)

所以我们的程序是正常工作了，我们第一个版本的Express也实现好了。现实的Express还有很多其他功能，我们一步一步添加。

### 本文总结
本文实现了一个最基础的Express，他能默认响应客户端的请求。本质上他是从http模块衍生来的，同样的，express也是从http衍生过来的。

你可以加我微信好友交流，**加我请备注公司和职务**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99218404.jpg)


