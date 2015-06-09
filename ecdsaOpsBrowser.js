const utils = require('ethereumjs-util');
const BN = require('bn.js');
const ec = require('elliptic').ec('secp256k1');

/**
 * @method verifySignature
 * @return {Boolean}
 */
exports.txVerifySignature = function() {
  var msgHash = this.hash(false);
  var pubKey = this.getSenderPublicKey();

  if (pubKey) {
    var sig = {
        r: new BN(this.r),
        s: new BN(this.s)
      };
    return ec.verify(new BN(msgHash), sig, ec.keyFromPublic(pubKey));
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
  var msgHash = this.hash(false);
  var sig = ec.sign(new BN(msgHash), new BN(privateKey));
  var key = ec.keyFromPrivate(new BN(privateKey));
  this.r = new Buffer(sig.r.toArray());
  this.s = new Buffer(sig.s.toArray());
  this.v = ec.calcPubKeyRecoveryParam(new BN(msgHash), sig, key.getPublic()) + 27;
};

/**
 * gets the senders public key
 * @method getSenderPublicKey
 * @return {Buffer}
 */
exports.txGetSenderPublicKey = function() {
  var msgHash = this.hash(false);
  var key = false;
  try {
    var r = ec.recoverPubKey(new BN(msgHash), {
      r: new BN(this.r),
      s: new BN(this.s)
    }, utils.bufferToInt(this.v) - 27);

    var rj = r.toJSON();
    key = Buffer.concat([new Buffer([4]), new Buffer(rj[0].toArray()), new Buffer(rj[1].toArray())]);
  } catch (e) {}

  return key;
};
