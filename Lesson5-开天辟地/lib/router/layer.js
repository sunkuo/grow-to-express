'use strict'
const pathRegexp = require('path-to-regexp')
const hasOwnProperty = Object.prototype.hasOwnProperty
module.exports = Layer

function Layer (path, options, fn) {
  const opts = options || {}
  this.handle = fn
  this.name = fn.name || '<anonymous>'

  this.params = undefined
  this.path = undefined

  this.regexp = pathRegexp(path, this.keys = [], opts)
  this.regexp.fast_star = path === '*'
  this.regexp.fast_slash = path === '/'
}

Layer.prototype.handle_request = function handleRequest (req, res, next) {
  const fn = this.handle
  try {
    fn(req, res, next)
  } catch (err) {
    throw err
  }
}

/**
 * Check if this route matches path, if so,
 * populate `.params`
 * @param  {String} path
 * @return {Boolean}
 */
Layer.prototype.match = function match (path) {
  let match
  if (path != null) {
    if (this.regexp.fast_slash) {
      this.prams = {}
      this.path = ''
      return true
    }
    match = this.regexp.exec(path)
  }
  if (!match) {
    this.params = undefined
    this.path = undefined
    return false
  }
  this.params = {}
  this.path = match[0]

  const keys = this.keys
  const params = this.params
  for (let i = 1; i < match.length; i++) {
    const key = keys[i - 1]
    const prop = key.name
    const val = match[i]
    if (val !== undefined || hasOwnProperty.call(params, prop)) {
      params[prop] = val
    }
  }
  return true
}
