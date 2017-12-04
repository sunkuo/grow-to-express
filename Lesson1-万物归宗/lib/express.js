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