const http = require('http')
const mixin = require('merge-descriptors')
const methods = require('methods')
const Router = require('./router/index.js')

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

}

proto.lazyrouter = function lazyrouter () {
  if (!this._router) {
    this._router = new Router({})
  }
}

proto.param = function () {
  this.lazyrouter()
  this._router.param.apply(this._router, slice.call(arguments))
  return this
}

proto.handle = function (req, res, callback) {
  const router = this._router
  router.handle(req, res)
}

methods.forEach(function (method) {
  proto[method] = function (path) {
    this.lazyrouter()
    const route = this._router.route(path)
    route[method].apply(route, slice.call(arguments, 1))
    return this
  }
})
