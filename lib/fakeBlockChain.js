var utils = require('ethereumjs-util')

module.exports = {
  getBlock: function (n, cb) {
    var hash = utils.sha3(new Buffer(utils.bufferToInt(n).toString()))

    var block = {
      hash: function () {
        return hash
      }
    }

    cb(null, block)
  }
}
