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
 * Creates a new transaction object
 * @constructor
 * @class {Buffer|Array} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple. Or lastly an Object containing the Properties of the transaction like in the Usage example
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 * };
 * var tx = new Transaction(rawTx);
 * @prop {Buffer} raw The raw rlp decoded transaction
 * @prop {Buffer} nonce
 * @prop {Buffer} to the to address
 * @prop {Buffer} value the amount of ether sent
 * @prop {Buffer} data this will contain the data of the message or the init of a contract
 * @prop {Buffer} v EC signature parameter
 * @prop {Buffer} r EC signature parameter
 * @prop {Buffer} s EC recovery ID
 * @prop {Buffer} from If you are not planing on signing the tx you can set the from property. If you do sign it will be over written
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
 * Computes a sha3-256 hash of the serialized tx
 * @method hash
 * @param {Boolean} [signature=true] whether or not to inculde the signature
 * @return {Buffer}
 */
Transaction.prototype.hash = function (signature) {
  var toHash

  if (typeof signature === 'undefined') {
    signature = true
  }

  toHash = signature ? this.raw : this.raw.slice(0, 6)

  // create hash
  return ethUtil.rlphash(toHash)
}

/**
 * returns the sender`s address
 * @method getSenderAddress
 * @return {Buffer}
 */
Transaction.prototype.getSenderAddress = function () {
  var pubKey = this.getSenderPublicKey()
  pubKey = ecdsa.publicKeyConvert(pubKey, false)
  return ethUtil.pubToAddress(pubKey)
}

/**
 * returns the public key of the sender
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
 * Determines if the signature is valid
 * @method verifySignature
 * @return {Boolean}
 */
Transaction.prototype.verifySignature = function () {
  var msgHash = this.hash(false)
  var signature = Buffer.concat([ethUtil.pad(this.r, 32), ethUtil.pad(this.s, 32)], 64)
  var recovery = ethUtil.bufferToInt(this.v) - 27

  // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
  if (!this._skipSValueCheck && new BN(this.s).cmp(N_DIV_2) === 1) {
    return false
  }

  try {
    this._senderPubKey = ecdsa.recoverSync(msgHash, signature, recovery)
  } catch (e) {
    return false
  }

  if (!this._senderPubKey) {
    return false
  }

  //
  // In node-secp256k1, `recover` will fail on invalid inputs, but in
  // elliptic this is not enforced.
  //
  // Here we enable a pubkey based verification only in the case
  // of browserified output, where elliptic will be used, to workaround the issue.
  //
  // TODO: fix elliptic?
  if (process.browser) {
    var result = ecdsa.verifySync(msgHash, signature, this._senderPubKey)
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
 * @return {BN}
 */
Transaction.prototype.getDataFee = function () {
  const data = this.raw[5]
  var cost = new BN(0)
  for (var i = 0; i < data.length; i++) {
    data[i] === 0 ? cost.iaddn(fees.txDataZeroGas.v) : cost.iaddn(fees.txDataNonZeroGas.v)
  }
  return cost
}

/**
 * the minimum amount of gas the tx must have (DataFee + TxFee)
 * @method getBaseFee
 * @return {BN}
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
