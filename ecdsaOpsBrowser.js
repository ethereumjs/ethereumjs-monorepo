var utils = require('ethereumjs-util'),
  ecdsa = require('ecdsa'),
  BigInteger = require('bigi'),
  ecurve = require('ecurve');

var ecparams = ecurve.getECParams('secp256k1');

/**
 * @method verifySignature
 * @return {Boolean}
 */
exports.txVerifySignature = function() {
  var msgHash = this.hash(false),
    pubKey = this.getSenderPublicKey(),
    sig = {
      r: BigInteger.fromBuffer(this.r),
      s: BigInteger.fromBuffer(this.s),
      v: utils.bufferToInt(this.v) - 27
    };

  if (pubKey) {
    return ecdsa.verify(msgHash, sig, pubKey);
  } else {
    return false;
  }
};

/**
 * sign a transaction with a given a private key
 * @method sign
 * @param {Buffer} privateKey
 */
exports.txSign = function(privateKey) {
  var msgHash = this.hash(false),
    e = BigInteger.fromBuffer(msgHash),
    pKey = BigInteger.fromBuffer(privateKey),
    signature = ecdsa.sign(msgHash, pKey);

  this.r = signature.r.toBuffer();
  this.s = signature.s.toBuffer();

  var curvePt = ecparams.g.multiply(pKey);
  this.v = ecdsa.calcPubKeyRecoveryParam(e, signature, curvePt) + 27;
};

/**
 * gets the senders public key
 * @method getSenderPublicKey
 * @return {Buffer}
 */
exports.txGetSenderPublicKey = function() {

  var msgHash = this.hash(false),
    sig = {
      r: BigInteger.fromBuffer(this.r),
      s: BigInteger.fromBuffer(this.s),
      v: utils.bufferToInt(this.v) - 27
    },
    e = BigInteger.fromBuffer(msgHash);

  var key = false;
  try {
    key = ecdsa.recoverPubKey(e, sig, sig.v).getEncoded(false);
  } catch (e) {}

  return key;

};
