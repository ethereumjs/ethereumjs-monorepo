const utils = require('ethereumjs-util')
const BN = require('bn.js')
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
  function ecrecover(msgHash, v, r, s) {
    var sig = Buffer.concat([utils.pad(r, 32), utils.pad(s, 32)], 64)
    var recid = utils.bufferToInt(v) - 27
    var senderPubKey 
    try{
      senderPubKey = ecdsa.recover(msgHash, {
        signature: sig,
        recovery: recid
      }, false)
    }catch(e){}

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
    results.exceptionError = 'out of gas'
    return results
  }

  results.gasUsed = gasCost

  buf = new Buffer(128)
  buf.fill(0)
  data = Buffer.concat([opts.data, buf])

  msgHash = data.slice(0, 32)
  v = data.slice(32, 64)
  r = data.slice(64, 96)
  s = data.slice(96, 128)

  publicKey = ecrecover(msgHash, v, r, s)

  if (!publicKey)
    return results

  results.return = utils.pad(utils.pubToAddress(publicKey), 32)
  return results
}
