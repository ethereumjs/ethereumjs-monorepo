const Trie = require('./index.js');
const ethUtil = require('ethereumjs-util');
const inherits = require('util').inherits

const Secure = module.exports = function(){
  Trie.apply(this, arguments);
};

inherits(Secure, Trie);

Secure.prototype._get = Trie.prototype.get;
Secure.prototype._put = Trie.prototype.put;
Secure.prototype._del = Trie.prototype.del;

Secure.prototype.del = function(key, cb){
  var h = ethUtil.sha3(key);
  this._del(h, cb);
}

Secure.prototype.get = function(key, cb){
  var h = ethUtil.sha3(key);
  this._get(h, cb);
}

Secure.prototype.put = function(key, val, cb){
  if (!val || val === '') {
    this.del(key, cb);
  }else{ 
    var h = ethUtil.sha3(key);
    this._put(h, val, cb);
  }
}
