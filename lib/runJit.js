const fs = require('fs');

module.exports = function(opts, cb){
  var f = new Function('require', 'opts', opts.code.toString());
  var results = f(require, opts);
  results.account = opts.account;
  cb(null, results);
};
