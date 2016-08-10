module.exports = LocationHistory

function LocationHistory () {
  if (!(this instanceof LocationHistory)) return new LocationHistory()
  this._back = []
  this._forward = []
  this._current = null
  this._pending = false
}

LocationHistory.prototype.current = function () {
  return this._current
}

LocationHistory.prototype.url = function () {
  return this.current() ? this.current().url : null
}

LocationHistory.prototype.go = function (page, cb) {
  if (!cb) cb = noop
  if (this._pending) return cb(null)
  if (!('url' in page)) throw new Error('Missing required `url` property')

  this.clearForward()
  go(this, page, cb)
}

LocationHistory.prototype.cancel = function (cb) {
  back(this, cb, true)
}

LocationHistory.prototype.back = function (cb) {
  back(this, cb, false)
}

// Goes back to the previous screen
// If 'cancel' is true, removes the current screen from history
// If 'cancel' if false, the user can return by going forward
function back (self, cb, cancel) {
  if (!cb) cb = noop
  if (self._back.length === 0 || self._pending) return cb(null)

  var previous = self._back.pop()
  var current = self.current()
  load(self, previous, done)

  function done (err) {
    if (err) return cb(err)
    if (!cancel) self._forward.push(current)
    self._current = previous
    unload(self, current)
    cb(null)
  }
}

LocationHistory.prototype.forward = function (cb) {
  if (!cb) cb = noop
  if (this._forward.length === 0 || this._pending) return cb(null)

  var page = this._forward.pop()
  go(this, page, cb)
}

LocationHistory.prototype.hasBack = function () {
  return this._back.length > 0
}

LocationHistory.prototype.hasForward = function () {
  return this._forward.length > 0
}

LocationHistory.prototype.clearForward = function (url) {
  if (url == null) {
    this._forward = []
  } else {
    this._forward = this._forward.filter(function (page) {
      return page.url !== url
    })
  }
}

LocationHistory.prototype.backToFirst = function (cb) {
  var self = this
  if (!cb) cb = noop
  if (self._back.length === 0) return cb(null)

  self.back(function (err) {
    if (err) return cb(err)
    self.backToFirst(cb)
  })
}

function go (self, page, cb) {
  if (!cb) cb = noop

  var current = self.current()
  load(self, page, done)

  function done (err) {
    if (err) return cb(err)
    if (current) self._back.push(current)
    self._current = page
    unload(self, current)
    cb(null)
  }
}

function load (self, page, cb) {
  self._pending = true

  if (page && typeof page.setup === 'function') page.setup(done)
  else done(null)

  function done (err) {
    self._pending = false
    cb(err)
  }
}

function unload (self, page) {
  self._pending = true
  if (page && typeof page.destroy === 'function') page.destroy()
  self._pending = false
}

function noop () {}
