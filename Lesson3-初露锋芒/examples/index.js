const express = require('../index.js')
const app = express()

app.get(function (req, res, next) {
  req.user = {
    name: 'foo'
  }
  next()
})

app.get(function (req, res, next) {
  req.article = {
    title: 'bar'
  }
  next()
}, function (req, res, next) {
  res.end(`User name is ${req.user.name} and Artitle title is ${req.article.title}`)
})

app.listen(3000)
