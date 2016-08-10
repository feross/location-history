# location-history [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/feross/location-history/master.svg
[travis-url]: https://travis-ci.org/feross/location-history
[npm-image]: https://img.shields.io/npm/v/location-history.svg
[npm-url]: https://npmjs.org/package/location-history
[downloads-image]: https://img.shields.io/npm/dm/location-history.svg
[downloads-url]: https://npmjs.org/package/location-history

### Lightweight browser location history abstraction

[![Sauce Test Status](https://saucelabs.com/browser-matrix/location-history.svg)](https://saucelabs.com/u/location-history)

Works in the browser with [browserify](http://browserify.org/)! This module is used by [WebTorrent Desktop](http://webtorrent.io/desktop).

## install

```
npm install location-history
```

## usage

```js
var LocationHistory = require('location-history')

var location = new LocationHistory()

// Navigate to a page
location.go({ url: 'first-url', data: 'hi' })

console.log(location.current()) // { url: 'first-url', data: 'hi' }
console.log(location.url()) // 'first-url'

// Navigate to a second page
location.go({ url: 'second-url' })

console.log(location.url()) // 'second-url'

// Go back one page
location.back()

console.log(location.url()) // 'first-url'

// Go forward one page
location.forward()

console.log(location.url()) // 'second-url'
```

## api

### `location = LocationHistory()`

Create a new location history instance.

### `location.current()`

Returns the current page object.

### `location.url()`

Return the current page object's `url` property.

### `location.go(page, [callback])`

Navigate to a new page. `page` should be an object with a `url` property.

Optionally, specify a `setup` function property to be called before the page
becomes the current one. `setup` will be passed a `callback` function that should
be called with a `null` or `Error` object as the first property.

```js
location.go({
  url: 'my-url',
  setup: function (cb) {
    setTimeout(function () { // ... do any async operations
      cb(null)
    }, 100)
  }
})
```

Optionally, specify a `destroy` function property to be called after the page is
replaced with another one.

```js
location.go({
  url: 'my-url',
  destroy: function () {
    // ... do any cleanup operations
  }
})
```

### `location.back([callback])`

Navigate to the previous page. If there is no previous page, this does nothing.

Optionally, specify a `callback` function to be called after the next page is
loaded (in case it has a `setup` function).

### `location.forward([callback])`

Navigate to the forward page. If there is no forward page, this does nothing.

Optionally, specify a `callback` function to be called after the next page is
loaded (in case it has a `setup` function).

### `location.cancel([callback])`

Navigate to the previous page, and remove the current page from the history. If
there is no previous page, this does nothing.

If you want the current page to stay in history (accessible via `forward()`), see
`back()`.

Optionally, specify a `callback` function to be called after the next page is
loaded (in case it has a `setup` function).

### `location.hasBack()`

Returns `true` if there is a previous page, else `false`.

### `location.hasForward()`

Returns `true` if there is a forward page, else `false`.

### `location.backToFirst([callback])`

Navigate to the first page. Optionally, specify a `callback` function to be
called after the first page is loaded.

### `location.clearForward([url])`

Clear all forward pages. Useful in situations where the forward page no longer
exists in the app.

Optionally, specify a `url` and only pages with the given `url` will be removed.

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
