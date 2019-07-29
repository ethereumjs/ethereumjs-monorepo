const async = require('async')

/**
 * Take two or more functions and returns a function  that will execute all of
 * the given functions
 */
export function callTogether (...funcs: Function[]) {
  let length = funcs.length
  const index = length

  if (!length) {
    return function () {}
  }

  return function (this: any, ...args: any) {
    length = index

    while (length--) {
      const fn = funcs[length]
      if (typeof fn === 'function') {
        var result = funcs[length].apply(this, args)
      }
    }
    return result
  }
}

/**
 * Take a collection of async fns, call the cb on the first to return a truthy value.
 * If all run without a truthy result, return undefined
 */
export function asyncFirstSeries (array: any[], iterator: Function, cb: Function) {
  var didComplete = false
  async.eachSeries(array, function (item: any, next: Function) {
    if (didComplete) return next
    iterator(item, function (err: Error, result: any) {
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
