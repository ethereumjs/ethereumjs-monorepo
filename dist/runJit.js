'use strict';

module.exports = function (opts, cb) {
  // for precompiled
  var results;
  if (typeof opts.code === 'function') {
    opts._common = this._common;
    results = opts.code(opts);
    results.account = opts.account;
    cb(results.exceptionError, results);
  } else {
    var f = new Function('require', 'opts', opts.code.toString()); // eslint-disable-line
    results = f(require, opts);
    results.account = opts.account;
    cb(results.exceptionError, results);
  }
};