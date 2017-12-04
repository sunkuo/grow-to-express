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
