const ethUtil = require('ethereumjs-util')
const fees = require('ethereum-common')
const ecdsa = require('secp256k1')
const BN = ethUtil.BN
const rlp = ethUtil.rlp

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

// give browser access to Buffers
global.Buffer = Buffer
global.ethUtil = ethUtil

/**
 * Represents a transaction
 * @constructor
 * @param {Buffer|Array} data raw data, deserialized
 */
var Transaction = module.exports = function (data) {
  // Define Properties
  const fields = [{
    name: 'nonce',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'gasPrice',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'gasLimit',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'to',
    allowZero: true,
    length: 20,
    default: new Buffer([])
  }, {
    name: 'value',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'data',
    allowZero: true,
    default: new Buffer([])
  }, {
    name: 'v',
    length: 1,
    default: new Buffer([0x1c])
  }, {
    name: 'r',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 's',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }]

  Object.defineProperty(this, 'from', {
    enumerable: false,
    configurable: true,
    get: function () {
      if (this._from) {
        return this._from
      }
      this._from = this.getSenderAddress()
      return this._from
    },
    set: function (v) {
      this._from = v
    }
  })

  ethUtil.defineProperties(this, fields, data)
}

/**
 * Returns the rlp encoding of the transaction
 * @method serialize
 * @return {Buffer}
 */
Transaction.prototype.serialize = function () {
  return rlp.encode(this.raw)
}

/**
 * Computes a sha3-256 hash of the tx
 * @method hash
 * @param {Boolean} [true] signature - whether or not to inculde the signature
 * @return {Buffer}
 */
Transaction.prototype.hash = function (signature) {
  var toHash

  if (typeof signature === 'undefined') {
    signature = true
  }

  if (signature) {
    toHash = this.raw
  } else {
    toHash = this.raw.slice(0, 6)
  }

  // create hash
  return ethUtil.rlphash(toHash)
}

/**
 * gets the senders address
 * @method getSenderAddress
 * @return {Buffer}
 */
Transaction.prototype.getSenderAddress = function () {
  var pubKey = this.getSenderPublicKey()
  pubKey = ecdsa.publicKeyConvert(pubKey, false)
  return ethUtil.pubToAddress(pubKey)
}

/**
 * gets the senders public key
 * @method getSenderPublicKey
 * @return {Buffer}
 */
Transaction.prototype.getSenderPublicKey = function () {
  if (!this._senderPubKey || !this._senderPubKey.length) {
    this.verifySignature()
  }

  return this._senderPubKey
}

/**
 * @method verifySignature
 * @return {Boolean}
 */
Transaction.prototype.verifySignature = function () {
  var msgHash = this.hash(false)

  // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
  if (!this._skipSValueCheck && new BN(this.s).cmp(N_DIV_2) === 1) {
    return false
  }

  var sig = {
    signature: Buffer.concat([ethUtil.pad(this.r, 32), ethUtil.pad(this.s, 32)], 64),
    recovery: ethUtil.bufferToInt(this.v) - 27
  }

  try {
    this._senderPubKey = ecdsa.recoverSync(msgHash, sig.signature, sig.recovery)
  } catch (e) {
    return false
  }

  if (!this._senderPubKey) {
    return false
  }

  // hack to force elliptic to verify
  if (process.browser) {
    var result = ecdsa.verifySync(msgHash, sig.signature, this._senderPubKey)
    if (!result) {
      this._senderPubKey = null
    }
  } else {
    result = !!this._senderPubKey
  }

  return result
}
/**
 * sign a transaction with a given a private key
 * @method sign
 * @param {Buffer} privateKey
 */
Transaction.prototype.sign = function (privateKey) {
  var msgHash = this.hash(false)
  var sig = ecdsa.signSync(msgHash, privateKey)

  this.r = sig.signature.slice(0, 32)
  this.s = sig.signature.slice(32, 64)
  this.v = sig.recovery + 27
}
/**
 * The amount of gas paid for the data in this tx
 * @method getDataFee
 * @return {bn.js}
 */
Transaction.prototype.getDataFee = function () {
  const data = this.raw[5]
  var cost = new BN(0)
  for (var i = 0; i < data.length; i++) {
    if (data[i] === 0) {
      cost.iaddn(fees.txDataZeroGas.v)
    } else {
      cost.iaddn(fees.txDataNonZeroGas.v)
    }
  }
  return cost
}

/**
 * the base amount of gas it takes to be a valid tx
 * @method getBaseFee
 * @return {bn.js}
 */
Transaction.prototype.getBaseFee = function () {
  return this.getDataFee().iaddn(fees.txGas.v)
}

/**
 * the up front amount that an account must have for this transaction to be valid
 * @method getUpfrontCost
 * @return {BN}
 */
Transaction.prototype.getUpfrontCost = function () {
  return new BN(this.gasLimit)
    .imul(new BN(this.gasPrice))
    .iadd(new BN(this.value))
}

/**
 * validates the signature and checks to see if it has enough gas
 * @method validate
 * @return {Boolean}
 */
Transaction.prototype.validate = function () {
  return this.verifySignature() && (this.getBaseFee().cmp(new BN(this.gasLimit)) <= 0)
}
