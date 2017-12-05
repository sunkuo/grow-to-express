# 渐进式Express源码学习2-道士下山

这是[**渐进式Express源码学习 | 小白也能懂源码**](https://github.com/sunkuo/grow-to-express)系列文章的第二篇。

请结合该节代码阅读[Lesson2-道士下山](https://github.com/sunkuo/grow-to-express/tree/master/Lesson2-%E9%81%93%E5%A3%AB%E4%B8%8B%E5%B1%B1)

### 目标特性和目标用法

这篇文章我们在第一篇文章的基础上，实现一个稍微加强版的Express，功能包括

- 自定义处理用户的请求
- 区分请求方法，对不同请求方法由不同的函数处理，例如GET请求

具体的用法如下（我们用my-express表示这个框架）

```javascript
const express = require('../index.js')
const app = express()
// 处理GET请求
app.get(function(req, res) {
  res.end('You send GET request')
})
// 处理POST请求
app.post(function(req, res) {
  res.end('You send POST request')
})
// 处理PUT请求
app.put(function(req, res) {
  res.end('You send PUT request')
})
// 处理DELETE请求
app.delete(function(req, res) {
  res.end('You send DELETE request')
})

app.listen(3000)
```

### 源码及讲解
先展示下目前的项目结构

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/57201068.jpg)

也就直说，我们这篇文章要实现的express总共有两个源文件，一个是express，一个是router文件夹下的layer。

注意看下面的讲解时要对照代码，先上一下express.js的源码，然后一点点讲解

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/90066345.jpg)

**首先看第33行到37行**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/80124807.jpg)

既然我们对外提供get, post, put等方法，那我们就要给proto赋值，这个实现在33行。methods使我们引入的一个模块，他提供了http中常用的method，如GET, POST, PUT等，在33行到37行里，我们对app.get, app.post, app.put等进行了赋值。即创建了一个layer，然后push到 handles中

**再看6-12行**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/18049505.jpg)

对比下上篇文章的代码

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/92331096.jpg)

和上之前不同的是，这次的入口函数中，我们不是直接返回用户一个信息，而是调用自身的handle函数，那么handle函数也许就是关键。handle函数在25-31行

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/73966730.jpg)

很容易理解，在这里，我们把handles里面存储的layer全部拿出来，然后进行遍历调用。

**到这里，我们大概可以知道实现原理：当用户调用app.get的时候，我们把处理函数保存到handles里面，然后请求来的时候，我们就遍历调用这些函数。**

Layer封装了这些处理函数，如下是Layer的源码

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/96580952.jpg)

每个Layer保存了一个method，handle。他的handle_method函数来判断这个请求的方法是不是和自己一致的，如果一致，就调用handel去处理，如果不一致，就直接返回

### 动手实验
我们首先通过命令node example/index.js运行样例
然后我们通过下面命令来测试我们的程序是否正常工作

```shell
curl -X GET http://localhost:3000
curl -X POST http://localhost:3000
curl -X PUT http://localhost:3000
curl -X DELETE http://localhost:3000
```

结果如图

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/32335462.jpg)

### 本文总结及预告
本文实现了一个加强的Express，他能让用户自定义处理方法还能分辨Http请求方法。

你可以加我微信好友交流，**加我请备注公司和职务**

![](http://oyo14vy95.bkt.clouddn.com/17-12-4/99218404.jpg)