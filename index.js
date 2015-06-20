const BN = require('bn.js')
const rlp = require('rlp')
const ethUtil = require('ethereumjs-util')
const fees = require('ethereum-common').fees
const ecdsaOps = require('./ecdsaOps.js')

//give browser access to Buffers
global.Buffer = Buffer
global.ethUtil = ethUtil

/**
 * Represents a transaction
 * @constructor
 * @param {Buffer|Array} data raw data, deserialized
 */
var Transaction = module.exports = function(data) {
  var self = this
  //Define Properties
  const fields = [{
    name: 'nonce',
    word: true,
    noZero: true,
    default: new Buffer([])
  }, {
    name: 'gasPrice',
    word: true,
    default: new Buffer([])
  }, {
    name: 'gasLimit',
    word: true,
    default: new Buffer([])
  }, {
    name: 'to',
    empty: true,
    length: 20,
    default: new Buffer([])
  }, {
    name: 'value',
    empty: true,
    word: true,
    noZero: true,
    default: new Buffer([])
  }, {
    name: 'data',
    empty: true,
    default: new Buffer([0])
  }, {
    name: 'v',
    length: 1,
    default: new Buffer([0x1c])
  }, {
    name: 'r',
    pad: true,
    length: 32,
    default: ethUtil.zeros(32)
  }, {
    name: 's',
    pad: true,
    length: 32,
    default: ethUtil.zeros(32)
  }]

  Object.defineProperty(this, 'from', {
    enumerable: false,
    configurable: true,
    get: function() {
      if(this._from) 
        return this._from
      return this._from = this.getSenderAddress()
    },
    set: function(v) {
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
Transaction.prototype.serialize = function() {
  return rlp.encode(this.raw)
}

/**
 * Computes a sha3-256 hash of the tx
 * @method hash
 * @param {Boolean} [true] signature - whether or not to inculde the signature
 * @return {Buffer}
 */
Transaction.prototype.hash = function(signature) {
  var toHash

  if (typeof signature === 'undefined')
    signature = true

  if (signature) 
    toHash = this.raw
  else 
    toHash = this.raw.slice(0, 6)

  //create hash
  return ethUtil.sha3(rlp.encode(toHash))
}

/**
 * gets the senders address
 * @method getSenderAddress
 * @return {Buffer}
 */
Transaction.prototype.getSenderAddress = function() {
  const pubKey = this.getSenderPublicKey()
  return ethUtil.pubToAddress(pubKey)
}

/**
 * gets the senders public key
 * @method getSenderPublicKey
 * @return {Buffer}
 */
Transaction.prototype.getSenderPublicKey = ecdsaOps.txGetSenderPublicKey

/**
 * @method verifySignature
 * @return {Boolean}
 */
Transaction.prototype.verifySignature = ecdsaOps.txVerifySignature

/**
 * sign a transaction with a given a private key
 * @method sign
 * @param {Buffer} privateKey
 */
Transaction.prototype.sign = ecdsaOps.txSign

/**
 * The amount of gas paid for the data in this tx
 * @method getDataFee
 * @return {bn.js}
 */
Transaction.prototype.getDataFee = function() {
  const data = this.raw[5]
  var cost = new BN(0)
  for (var i = 0; i < data.length; i++) {
    if (data[i] === 0) 
      cost.iaddn(fees.txDataZeroGas.v)
    else
      cost.iaddn(fees.txDataNonZeroGas.v)
  }
  return cost
}

/**
 * the base amount of gas it takes to be a valid tx
 * @method getBaseFee
 * @return {bn.js}
 */
Transaction.prototype.getBaseFee = function() {
  return this.getDataFee().addn(fees.txGas.v)
}

/**
 * the up front amount that an account must have for this transaction to be valid
 * @method getUpfrontCost
 * @return {BN}
 */
Transaction.prototype.getUpfrontCost = function() {
  return new BN(this.gasLimit)
    .mul(new BN(this.gasPrice)) //there is no muln func yet
    .addn(this.value)
}

/**
 * validates the signature and checks to see if it has enough gas
 * @method validate
 * @return {Boolean}
 */
Transaction.prototype.validate = function() {
  return this.verifySignature() && (Number(this.getBaseFee().toString()) <= ethUtil.bufferToInt(this.gasLimit))
}
