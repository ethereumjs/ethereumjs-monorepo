var Readable = require('stream').Readable,
  TrieNode = require('./trieNode'),
  util = require('util');

var internals = {};

exports = module.exports = internals.ReadStream = function (trie) {
  this.trie = trie;
  this.next = null;
  Readable.call(this, {
    objectMode: true
  });
};

util.inherits(internals.ReadStream, Readable);

internals.ReadStream.prototype._read = function () {
  var self = this;
  if (this.next && !this.started) {
    //unpause stream
    this.next();
  } else if (!this.started) {
    this.started = true;
    this.trie._findAll(this.trie.root, [], function (val, key, onDone) {
      key = TrieNode.nibblesToBuffer(key);
      self.next = onDone;
      self.started = self.push({
        key: key,
        value: val.value
      });

      if(self.started) onDone();
    }, function () {
      self.push(null);
    });
  }
};
