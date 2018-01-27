module.exports = function (opts, cb) {
  return new Promise(function(resolve, reject) {
    cb = cb || function(err, result) {err ? reject(err) : resolve(result)};

    // for precompiled
    var results
    if (typeof opts.code === 'function') {
      results = opts.code(opts)
      results.account = opts.account
      if (results.exception === undefined) {
        results.exception = 1
      }
      cb(results.exceptionError, results)
    } else {
      var f = new Function('require', 'opts', opts.code.toString()) // eslint-disable-line
      results = f(require, opts)
      results.account = opts.account
      cb(results.exceptionError, results)
    }
  });
}
