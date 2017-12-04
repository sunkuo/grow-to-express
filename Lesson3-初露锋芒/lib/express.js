const http = require('http')
const mixin = require('merge-descriptors')
const methods = require('methods')
const Route = require('./router/route.js')

const slice = Array.prototype.slice

module.exports = function createServer () {
  const app = function (req, res) {
    app.handle(req, res)
  }
  mixin(app, proto, false)
  app.init()
  return app
}

const proto = Object.create(null)
proto.listen = function (port) {
  const server = http.createServer(this)
  return server.listen.apply(server, arguments)
}

proto.init = function () {
  this.route = new Route()
}

proto.handle = function () {
  // 对handles中的函数进行遍历
  this.route.dispatch.apply(this.route, slice.call(arguments))
}

methods.forEach(function (method) {
  proto[method] = function (fn) {
    this.route[method].apply(this.route, slice.call(arguments))
  }
})
