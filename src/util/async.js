const async = require('async')

module.exports = {
  callTogether: callTogether,
  asyncFirstSeries: asyncFirstSeries
}

/**
 * Take two or more functions and returns a function  that will execute all of
 * the given functions
 */
function callTogether () {
  var funcs = arguments
  var length = funcs.length
  var index = length

  if (!length) {
    return function () {}
  }

  return function () {
    length = index

    while (length--) {
      var fn = funcs[length]
      if (typeof fn === 'function') {
        var result = funcs[length].apply(this, arguments)
      }
    }
    return result
  }
}

/**
 * Take a collection of async fns, call the cb on the first to return a truthy value.
 * If all run without a truthy result, return undefined
 */
function asyncFirstSeries (array, iterator, cb) {
  var didComplete = false
  async.eachSeries(array, function (item, next) {
    if (didComplete) return next
    iterator(item, function (err, result) {
      if (result) {
        didComplete = true
        process.nextTick(cb.bind(null, null, result))
      }
      next(err)
    })
  }, function () {
    if (!didComplete) {
      cb()
    }
  })
}
