const ecdsa = require('secp256k1');
const BN = require('bn.js');
const utils = require('ethereumjs-util');

/**
 * @method verifySignature
 * @return {Boolean}
 */
exports.txVerifySignature = function() {
  var msgHash = this.hash(false);
  var sig = Buffer.concat([utils.pad(this.r, 32), utils.pad(this.s, 32)], 64);

  this._senderPubKey = ecdsa.recoverCompact(msgHash, sig, utils.bufferToInt(this.v) - 27);
  if (this._senderPubKey && this._senderPubKey.toString('hex') !== '') {
    return true;
  } else {
    return false;
  }
};

/**
 * sign a transaction given a private key
 * @method sign
 * @param {Buffer} privateKey
 */
exports.txSign = function(privateKey) {
  var msgHash = this.hash(false),
    sig = ecdsa.signCompact(privateKey, msgHash);

  this.r = sig.r;
  this.s = sig.s;
  this.v = sig.recoveryId + 27;
};

/**
 * gets the senders public key
 * @method getSenderPublicKey
 * @return {Buffer}
 */
exports.txGetSenderPublicKey = function() {

  if (!this._senderPubKey || !this._senderPubKey.length) {
    this.verifySignature();
  }

  return this._senderPubKey;
};

/**
 * ecrecover
 * @param  {Buffer} msgHash [description]
 * @param  {Buffer} v       [description]
 * @param  {Buffer} r       [description]
 * @param  {Buffer} s       [description]
 * @return {Buffer}         public key otherwise null
 */
exports.ecrecover = function(msgHash, v, r, s) {
  var sig = Buffer.concat([utils.pad(r, 32), utils.pad(s, 32)], 64);
  var recid = utils.bufferToInt(v) - 27; 
  var senderPubKey = ecdsa.recoverCompact(msgHash, sig, recid);

  if (senderPubKey && senderPubKey.toString('hex') !== '') {
    return senderPubKey;
  } else {
    return null;
  }
};
