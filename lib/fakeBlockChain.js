import {Buffer} from 'safe-buffer'
import utils from 'ethereumjs-util'

export default {
  getBlock: function (blockTag, cb) {
    var hash

    if (Buffer.isBuffer(blockTag)) {
      hash = utils.sha3(blockTag)
    } else if (Number.isInteger(blockTag)) {
      hash = utils.sha3('0x' + utils.toBuffer(blockTag).toString('hex'))
    } else {
      cb(new Error('Unknown blockTag type'))
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
  }
}
