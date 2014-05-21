var Readable = require('stream').Readable,
  util = require('util'),
  internals = {};

exports = module.exports = internals.ReadStream = function (trie) {
  this.trie = trie;
  this.next = null;
  Readable.call(this);
};

util.inherits(internals.ReadStream, Readable);
internals.ReadStream.prototype._read = function () {
  var self = this;
  if (this.next) {
    this.next();
  } else if(!this.started) {
    this.started = true;
    this.trie._findAll(this.trie.root, function (val, onDone) {
      self.next = onDone;
      if(val){
        self.push(val.value);
      }
    }, function(){
      self.push(null);
    });
  }
};
