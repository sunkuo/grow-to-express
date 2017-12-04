/*
  support req.params
  support app.param api
 */

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
