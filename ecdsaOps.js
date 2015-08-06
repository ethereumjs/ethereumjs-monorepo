const ecdsa = require('secp256k1')
const BN = require('bn.js')
const utils = require('ethereumjs-util')

/**
 * @method verifySignature
 * @return {Boolean}
 */
exports.txVerifySignature = function() {
  var msgHash = this.hash(false)
  var sig = {
    signature: Buffer.concat([utils.pad(this.r, 32), utils.pad(this.s, 32)], 64),
    recovery: utils.bufferToInt(this.v) - 27
  }

  try{
    this._senderPubKey = ecdsa.recover(msgHash, sig, false)
  }catch(e){
    return false 
  }

  if (this._senderPubKey && this._senderPubKey.toString('hex') !== '') 
    return true
  else 
    return false
}

/**
 * sign a transaction given a private key
 * @method sign
 * @param {Buffer} privateKey
 */
exports.txSign = function(privateKey) {
  var msgHash = this.hash(false)
  var sig = ecdsa.sign(msgHash, privateKey)

  this.r = sig.signature.slice(0, 32)
  this.s = sig.signature.slice(32, 64)
  this.v = sig.recovery + 27
}

/**
 * gets the senders public key
 * @method getSenderPublicKey
 * @return {Buffer}
 */
exports.txGetSenderPublicKey = function() {
  if (!this._senderPubKey || !this._senderPubKey.length)
    this.verifySignature()

  return this._senderPubKey
}

/**
 * ecrecover
 * @param  {Buffer} msgHash [description]
 * @param  {Buffer} v       [description]
 * @param  {Buffer} r       [description]
 * @param  {Buffer} s       [description]
 * @return {Buffer}         public key otherwise null
 */
exports.ecrecover = function(msgHash, v, r, s) {
  var sig = { 
    signature: Buffer.concat([utils.pad(r, 32), utils.pad(s, 32)], 64),
    recovery: utils.bufferToInt(v) - 27 
  }

  console.log('here!');
  var senderPubKey = ecdsa.recover(msgHash, sig, true)
  console.log(senderPubKey)

  if (senderPubKey && senderPubKey.toString('hex') !== '')
    return senderPubKey
  else 
    return null
}
