const Buffer = require('safe-buffer').Buffer
const utils = require('ethereumjs-util')

module.exports = {
  getBlock: function (n, cb) {
    // FIXME: this will fail on block numbers >53 bits
    var hash = utils.sha3(Buffer.from(utils.bufferToInt(n).toString(), 'utf8'))

    var block = {
      hash: function () {
        return hash
      }
    }

    cb(null, block)
  }
}
