const ethUtil = require('ethereumjs-util')
const fees = require('ethereum-common')
const ecdsa = require('secp256k1')
const BN = ethUtil.BN
const rlp = ethUtil.rlp

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
  return ethUtil.sha3(rlp.encode(toHash))
}

/**
 * gets the senders address
 * @method getSenderAddress
 * @return {Buffer}
 */
Transaction.prototype.getSenderAddress = function () {
  const pubKey = this.getSenderPublicKey()
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
  var sig = {
    signature: Buffer.concat([ethUtil.pad(this.r, 32), ethUtil.pad(this.s, 32)], 64),
    recovery: ethUtil.bufferToInt(this.v) - 27
  }

  try {
    this._senderPubKey = ecdsa.recover(msgHash, sig, false)
  } catch (e) {
    return false
  }

  if (!this._senderPubKey) {
    return false
  }

  var result = ecdsa.verify(msgHash, sig, this._senderPubKey)
  if (!result) {
    this._senderPubKey = null
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
  var sig = ecdsa.sign(msgHash, privateKey)

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
  return this.getDataFee().addn(fees.txGas.v)
}

/**
 * the up front amount that an account must have for this transaction to be valid
 * @method getUpfrontCost
 * @return {BN}
 */
Transaction.prototype.getUpfrontCost = function () {
  return new BN(this.gasLimit)
    .mul(new BN(this.gasPrice))
    .add(new BN(this.value))
}

/**
 * validates the signature and checks to see if it has enough gas
 * @method validate
 * @return {Boolean}
 */
Transaction.prototype.validate = function () {
  return this.verifySignature() && (Number(this.getBaseFee().toString()) <= ethUtil.bufferToInt(this.gasLimit))
}
