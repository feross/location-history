const LocationHistory = require('../')
const test = require('tape')

const FIRST_URL = 'first-page'
const SECOND_URL = 'second-page'

test('LocationHistory.go() must have a `url` property', (t) => {
  t.plan(1)

  const location = new LocationHistory()

  t.throws(function () {
    location.go({ hi: 1 })
  })
})

test('LocationHistory.go() loads given page', (t) => {
  t.plan(3)

  const location = new LocationHistory()

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)
    })
  })
})

test('LocationHistory.go() loads given page (without new keyword)', (t) => {
  t.plan(3)

  const location = LocationHistory() // without `new`

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)
    })
  })
})

test('LocationHistory.go() loads page synchronously', (t) => {
  t.plan(3)

  const location = new LocationHistory()

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL })
  t.equal(location.url(), FIRST_URL)

  location.go({ url: SECOND_URL })
  t.equal(location.url(), SECOND_URL)
})

test('LocationHistory.go() loads page synchronously, even with callback', (t) => {
  t.plan(3)

  const location = new LocationHistory()

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)
  })
  t.equal(location.url(), FIRST_URL)
})

test('LocationHistory.go() calls setup before loading new page', (t) => {
  t.plan(8)

  const location = new LocationHistory()
  let called = false

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)
    t.notOk(called)

    location.go({ url: SECOND_URL, setup: setup }, () => {
      t.ok(called)
      t.equal(location.url(), SECOND_URL)
    })

    t.equal(location.url(), FIRST_URL)
  })

  t.equal(location.url(), FIRST_URL)

  function setup (cb) {
    called = true
    t.equal(location.url(), FIRST_URL)

    setTimeout(() => {
      t.equal(location.url(), FIRST_URL)
      cb()
    }, 100)
  }
})

test('LocationHistory.go() calls destroy after unloading current page', (t) => {
  t.plan(5)

  const location = new LocationHistory()
  let called = false

  location.go({ url: FIRST_URL, destroy: destroy }, () => {
    t.equal(location.url(), FIRST_URL)

    t.notOk(called)
    location.go({ url: SECOND_URL }, () => {
      t.ok(called)
      t.equal(location.url(), SECOND_URL)
    })
  })

  function destroy () {
    called = true
    t.equal(location.url(), SECOND_URL)
  }
})

test('LocationHistory.back() loads the previous page', (t) => {
  t.plan(3)

  const location = new LocationHistory()

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)
    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)
      location.back(() => {
        t.equal(location.url(), FIRST_URL)
      })
    })
  })
})

test('LocationHistory.back() loads the previous page synchronously', (t) => {
  t.plan(3)

  const location = new LocationHistory()

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)
    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)
      location.back()
      t.equal(location.url(), FIRST_URL)
    })
  })
})

test('LocationHistory.back() loads the previous page synchronously, even with callback', (t) => {
  t.plan(4)

  const location = new LocationHistory()

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)
    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)
      location.back(() => {
        t.equal(location.url(), FIRST_URL)
      })
      t.equal(location.url(), FIRST_URL)
    })
  })
})

test('LocationHistory.back() calls setup before loading previous page', (t) => {
  t.plan(13)

  const location = new LocationHistory()
  let called = 0

  t.equal(called, 0)
  location.go({ url: FIRST_URL, setup: setup }, () => {
    t.equal(location.url(), FIRST_URL)
    t.equal(called, 1)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)

      t.equal(called, 1)
      location.back(() => {
        t.equal(called, 2)
        t.equal(location.url(), FIRST_URL)
      })
    })

    t.equal(location.url(), SECOND_URL)
  })

  t.equal(location.url(), null)

  function setup (cb) {
    let expectedUrl = called === 0
      ? null
      : SECOND_URL

    t.equal(location.url(), expectedUrl)

    setTimeout(() => {
      t.equal(location.url(), expectedUrl)
      cb()
    }, 100)

    called += 1
  }
})

test('LocationHistory.back() calls destroy after unloading current page', (t) => {
  t.plan(6)

  const location = new LocationHistory()
  let called = false

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    location.go({ url: SECOND_URL, destroy: destroy }, () => {
      t.equal(location.url(), SECOND_URL)

      t.notOk(called)
      location.back(() => {
        t.equal(location.url(), FIRST_URL)
        t.ok(called)
      })
    })
  })

  function destroy () {
    called = true
    t.equal(location.url(), FIRST_URL)
  }
})

test('LocationHistory.forward() loads the next page', (t) => {
  t.plan(5)

  const location = new LocationHistory()

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)

      location.back(() => {
        t.equal(location.url(), FIRST_URL)

        location.forward(() => {
          t.equal(location.url(), SECOND_URL)
        })
      })
    })
  })
})

test('LocationHistory.forward() loads the next page synchronously', (t) => {
  t.plan(5)

  const location = new LocationHistory()

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)

      location.back(() => {
        t.equal(location.url(), FIRST_URL)

        location.forward()
        t.equal(location.url(), SECOND_URL)
      })
    })
  })
})

test('LocationHistory.forward() loads the next page synchronously, even with callback', (t) => {
  t.plan(6)

  const location = new LocationHistory()

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)

      location.back(() => {
        t.equal(location.url(), FIRST_URL)

        location.forward(() => {
          t.equal(location.url(), SECOND_URL)
        })
        t.equal(location.url(), SECOND_URL)
      })
    })
  })
})

test('LocationHistory.forward() calls setup before loading next page', (t) => {
  t.plan(13)

  const location = new LocationHistory()
  let called = 0

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL }, () => {
    t.equal(location.url(), FIRST_URL)

    t.equal(called, 0)
    location.go({ url: SECOND_URL, setup: setup }, () => {
      t.equal(location.url(), SECOND_URL)
      t.equal(called, 1)

      location.back(() => {
        t.equal(location.url(), FIRST_URL)

        t.equal(called, 1)
        location.forward(() => {
          t.equal(location.url(), SECOND_URL)
          t.equal(called, 2)
        })
      })
    })
  })

  function setup (cb) {
    t.equal(location.url(), FIRST_URL)
    setTimeout(() => {
      t.equal(location.url(), FIRST_URL)
      cb()
    }, 100)

    called += 1
  }
})

test('should call destroy after unloading the current page', (t) => {
  t.plan(11)

  const location = new LocationHistory()
  let called = 0

  t.equal(location.url(), null)

  location.go({ url: FIRST_URL, destroy: destroy }, () => {
    t.equal(location.url(), FIRST_URL)
    t.equal(called, 0)

    location.go({ url: SECOND_URL }, () => {
      t.equal(location.url(), SECOND_URL)
      t.equal(called, 1)

      location.back(() => {
        t.equal(location.url(), FIRST_URL)
        t.equal(called, 1)

        location.forward(() => {
          t.equal(location.url(), SECOND_URL)
          t.equal(called, 2)
        })
      })
    })
  })

  function destroy () {
    t.equal(location.url(), SECOND_URL)
    called += 1
  }
})
