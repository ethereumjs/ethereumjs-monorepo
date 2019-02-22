const Buffer = require('safe-buffer').Buffer

module.exports = {
  fake: true,
  getBlock: function (blockTag, cb) {
    var hash

    if (Buffer.isBuffer(blockTag)) {
      hash = blockTag
    } else if (Number.isInteger(blockTag)) {
      return cb(new Error('fakeBlockChain can\'t return blocks by number'))
    } else {
      return cb(new Error('Unknown blockTag type'))
    }

    var block = {
      hash: function () {
        return hash
      }
    }

    cb(null, block)
  },

  delBlock: function (hash, cb) {
    cb(null)
  },

  iterator: function (name, onBlock, cb) {
    cb(null)
  }
}
