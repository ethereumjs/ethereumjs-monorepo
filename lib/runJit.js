const fs = require('fs');

module.exports = function(opts, cb){
  //for precomiled
  if(typeof opts.code === 'function'){
    var results = opts.code(opts)
    results.account = opts.account;
    cb(null, results)
  }else{
    var f = new Function('require', 'opts', opts.code.toString());
    var results = f(require, opts);
    results.account = opts.account;
    cb(null, results);
  }
}
