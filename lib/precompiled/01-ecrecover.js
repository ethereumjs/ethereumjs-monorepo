const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')
const ecdsa = require('secp256k1')
const gasCost = new BN(fees.ecrecoverGas.v)

module.exports = function (opts) {
  /**
   * ecrecover
   * @param  {Buffer} msgHash [description]
   * @param  {Buffer} v       [description]
   * @param  {Buffer} r       [description]
   * @param  {Buffer} s       [description]
   * @return {Buffer}         public key otherwise null
   */
  function ecrecover (msgHash, v, r, s) {
    var sig = Buffer.concat([utils.pad(r, 32), utils.pad(s, 32)], 64)
    var recid = utils.bufferToInt(v) - 27
    var senderPubKey
    try {
      senderPubKey = ecdsa.recoverSync(msgHash, sig, recid)
      senderPubKey = ecdsa.publicKeyConvert(senderPubKey, false)
    } catch (e) {}

    if (senderPubKey && senderPubKey.toString('hex') !== '') {
      return senderPubKey
    } else {
      return null
    }
  }

  var results = {}

  if (opts.gasLimit.cmp(gasCost) === -1) {
    results.gasUsed = opts.gasLimit
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    results.exceptionError = error.OUT_OF_GAS
    return results
  }

  results.gasUsed = gasCost

  var data = utils.rpad(opts.data, 128)

  var msgHash = data.slice(0, 32)
  var v = data.slice(32, 64)
  var r = data.slice(64, 96)
  var s = data.slice(96, 128)

  var publicKey = ecrecover(msgHash, v, r, s)

  if (!publicKey) {
    return results
  }

  results.return = utils.pad(utils.publicToAddress(publicKey), 32)
  return results
}
