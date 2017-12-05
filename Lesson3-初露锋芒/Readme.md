# 渐进式Express源码学习3-初露锋芒

这是[**渐进式Express源码学习 | 小白也能懂源码**](https://github.com/sunkuo/grow-to-express)系列文章的第三篇。

请结合该节代码阅读[Lesson3-初露锋芒](https://github.com/sunkuo/grow-to-express/tree/master/Lesson3-%E5%88%9D%E9%9C%B2%E9%94%8B%E8%8A%92)

### 目标特性和目标用法

这篇文章我们在第二篇文章的基础上，实现一个稍微加强版的Express，功能包括

- 可以给一个方法添加多个中间件
- 引入next参数

具体的用法如下

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/58000746.jpg)

### 源码及讲解
先展示下目前的项目结构

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/45257830.jpg)

和上篇文章不同的是，我们引入了route.js。目前源文件总共有三个，express.js, router/layer.js, router/route.js

**这篇中，我们实现的大概思路是每一个layer对应一个中间件，用Route对象来保存layer。当请求到来时，调用Route的dispatch函数进行处理**

上面的这个文字不理解没关系，看完代码就懂了，先看experss.js
和上篇文章相比，区别在两个函数，一个是init函数，一个是handle函数

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/22848156.jpg)

对比下上篇文章

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/27111899.jpg)

也就是说express.js里并没有接触Layer，而是初始化了一个Route，当请求到达是，调用route.dispatch进行处理。同样app.get等这些函数，也是调用Route对应的get函数。所以关键就是Route.js。先看下他的代码

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/48037041.jpg)

在Route的构造函数里，Route保存了一个stack，保存了一个methods数组。当我们调用app.get(fn1, fn2)时，实际上调用的是route.get(fn1, fn2)。这部分实现在34-43行。对每一个handler，我们的做法是创建一个layer，然后push到route.stack中。

**前方高能，重点是dispatch函数，这个地方要理解准确，实现很巧妙**

当请求到来时，触发Route.dispatch函数，在dispatch函数中（20-32行），我们看看他是怎么做的。
首先他定义了一个计数器idx，定义了一个next函数。进入next之后，首先触发fn1, 传入的参数分别是req, res, next。**注意最后这个next就是这个next函数**。以我们自己的example做讲解

```javascript
app.get(function (req, res, next) {
  req.user = {
    name: 'foo'
  }
  next()
})
```

上面代码中的next，其实就是dispatch的next函数。当我们在逻辑结尾调用next(), 其实也就是调用了dispatch中的next，从而idx 增加1 ，触发下一个layer的handle函数，直到我们不调用next(), 或者layer全部处理了

### 动手实验
我们首先通过命令node example/index.js运行样例
然后我们通过下面命令来测试我们的程序是否正常工作

```shell
curl -X GET http://localhost:3000
```

结果如图

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/33811335.jpg)

按我们的预期工作

### 本文总结及预告
本文实现了一个加强的Express，他能让用户在一个路由添加多个中间件，同事引入了next参数。

你可以加我微信好友交流，**加我请备注公司和职务**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99218404.jpg)