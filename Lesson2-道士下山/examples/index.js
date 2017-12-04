const express = require('../index.js')
const app = express()
app.get(function(req, res) {
  res.end('You send GET request')
})

app.post(function(req, res) {
  res.end('You send POST request')
})

app.put(function(req, res) {
  res.end('You send PUT request')
})

app.delete(function(req, res) {
  res.end('You send DELETE request')
})

app.listen(3000)
