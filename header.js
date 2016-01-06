const utils = require('ethereumjs-util')
const params = require('ethereum-common')
const BN = utils.BN
const rlp = utils.rlp
  /**
   * Represents a Block Header
   * @constructor
   * @param {Array} data raw data, deserialized
   */
var BlockHeader = module.exports = function (data) {
  var fields = [{
    name: 'parentHash',
    length: 32,
    default: utils.zeros(32)
  }, {
    name: 'uncleHash',
    default: utils.SHA3_RLP_ARRAY
  }, {
    name: 'coinbase',
    length: 20,
    default: utils.zeros(20)
  }, {
    name: 'stateRoot',
    length: 32,
    default: utils.zeros(32)
  }, {
    name: 'transactionsTrie',
    length: 32,
    default: utils.SHA3_RLP
  }, {
    name: 'receiptTrie',
    length: 32,
    default: utils.SHA3_RLP
  }, {
    name: 'bloom',
    default: utils.zeros(256)
  }, {
    name: 'difficulty',
    default: new Buffer([])
  }, {
    name: 'number',
    default: new Buffer([])
  }, {
    name: 'gasLimit',
    default: new Buffer([])
  }, {
    name: 'gasUsed',
    empty: true,
    default: new Buffer([])
  }, {
    name: 'timestamp',
    default: new Buffer([])
  }, {
    name: 'extraData',
    allowZero: true,
    empty: true,
    default: new Buffer([])
  }, {
    name: 'mixHash',
    default: utils.zeros(32)
      // length: 32
  }, {
    name: 'nonce',
    default: new Buffer([]) // sha3(42)
  }]
  utils.defineProperties(this, fields, data)
}

BlockHeader.prototype.canonicalDifficulty = function (parentBlock) {
  const blockTs = utils.bufferToInt(this.timestamp)
  const parentTs = utils.bufferToInt(parentBlock.header.timestamp)
  const parentDif = new BN(parentBlock.header.difficulty)

  var offset = parentDif.div(new BN(params.difficultyBoundDivisor.v))
  var dif
  if (blockTs < parentTs + params.durationLimit.v) {
    dif = offset.add(parentDif)
  } else {
    const minimumDifficulty = new BN(params.minimumDifficulty.v)
    if (new BN(this.difficulty).cmp(minimumDifficulty) === -1) {
      dif = minimumDifficulty
    } else {
      dif = parentDif.sub(offset)
    }
  }

  var exp = new BN(this.number).divn(100000).sub(new BN(2))
  if (!exp.isNeg()) {
    dif.iadd(new BN(2).pow(exp))
  }
  return dif
}

// check the block for the canical difficulty
BlockHeader.prototype.validateDifficulty = function (parentBlock) {
  const dif = this.canonicalDifficulty(parentBlock)
  return !Boolean(dif.cmp(new BN(this.difficulty)))
}

BlockHeader.prototype.validateGasLimit = function (parentBlock) {
  const pGasLimit = utils.bufferToInt(parentBlock.header.gasLimit)
  const gasLimit = utils.bufferToInt(this.gasLimit)
  const a = Math.floor(pGasLimit / params.gasLimitBoundDivisor.v)
  const maxGasLimit = pGasLimit + a
  const minGasLimit = pGasLimit - a

  return maxGasLimit > gasLimit && minGasLimit < gasLimit && params.minGasLimit.v < gasLimit
}

/**
 * Validates the entire block headers
 * @method validate
 * @param {Blockchain} blockChain the blockchain that this block is validating against
 * @param {Bignum} [height] if this is an uncle header, this is the height of the block that is including it
 * @param {Function} cb the callback function
 */
BlockHeader.prototype.validate = function (blockchain, height, cb) {
  var self = this
  if (arguments.length === 2) {
    cb = height
    height = false
  }

  if (this.isGenesis()) {
    return cb()
  }

  // find the blocks parent
  blockchain.getBlock(self.parentHash, function (err, parentBlock) {
    if (err) {
      return cb('could not find parent block')
    }

    self.parentBlock = parentBlock

    var number = new BN(self.number)
    if (number.cmp(new BN(parentBlock.header.number).addn(1)) !== 0) {
      return cb('invalid number')
    }

    if (height) {
      var dif = height.sub(new BN(parentBlock.header.number))
      if (!(dif.cmpn(8) === -1 && dif.cmpn(1) === 1)) {
        return cb('uncle block has a parent that is too old or to young')
      }
    }

    if (!self.validateDifficulty(parentBlock)) {
      return cb('invalid Difficulty')
    }

    if (!self.validateGasLimit(parentBlock)) {
      return cb('invalid gas limit')
    }

    if (utils.bufferToInt(parentBlock.header.number) + 1 !== utils.bufferToInt(self.number)) {
      return cb('invalid heigth')
    }

    if (utils.bufferToInt(self.timestamp) <= utils.bufferToInt(parentBlock.header.timestamp)) {
      return cb('invalid timestamp')
    }

    if (self.extraData.length > params.maximumExtraDataSize.v) {
      return cb('invalid amount of extra data')
    }

    cb()
  })
}

BlockHeader.prototype.hash = function () {
  return utils.rlphash(this.raw)
}

BlockHeader.prototype.isGenesis = function () {
  return this.number.toString('hex') === ''
}
