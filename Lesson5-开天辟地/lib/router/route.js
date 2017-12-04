'use strict'
const flatten = require('array-flatten')
const Layer = require('./layer')
const methods = require('methods')

const slice = Array.prototype.slice

module.exports = Route

function Route (path) {
  this.path = path
  this.stack = []
  this.methods = {}
}

Route.prototype._handle_method = function (method) {
  const name = method.toLowerCase()
  return Boolean(this.methods[name])
}

Route.prototype.dispatch = function (req, res, done) {
  const method = req.method.toLowerCase()
  const stack = this.stack
  if (stack.length === 0) {
    return done()
  }
  let idx = 0
  next()
  function next () {
    const layer = stack[idx++]
    if (!layer) {
      return done()
    }
    if (layer.method && layer.method !== method) {
      return next()
    }
    layer.handle_request(req, res, next)
  }
}

methods.forEach(function (method) {
  Route.prototype[method] = function () {
    const handles = flatten(slice.call(arguments))
    for (let i = 0; i < handles.length; i++) {
      const layer = new Layer('/', {}, handles[i])
      layer.method = method
      this.methods[method] = true
      this.stack.push(layer)
    }
  }
})
