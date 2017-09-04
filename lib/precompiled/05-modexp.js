const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR

const Gmodexpbase = 45
const Garithword = 6
const Gquaddivisor = 32

module.exports = function (opts) {
  var results = {}
  var data = opts.data

  var i = 0
  var Blen = new BN(data.slice(i, 32)).toNumber()
  i += 32
  var B = new BN(data.slice(i, i + Blen))
  i += Blen
  var Elen = new BN(data.slice(i, i + 32)).toNumber()
  i += 32
  var E = new BN(data.slice(i, Elen))
  i += Elen
  var Mlen = data.length - i
  var M = new BN(data.slice(i, Mlen))
  
  console.log('MODEXP input', Blen, B, Elen, E, Mlen, M)

  result.gasUsed = new BN(Gmodexpbase).addi(Math.ceil(data.length / 32) * Garithword).addi(Blen * Mlen * Elen / Gquaddivisor)

  if (opts.gasLimit.cmp(results.gasUsed) === -1) {
    results.gasUsed = opts.gasLimit
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    results.exceptionError = error.OUT_OF_GAS
    return results
  }

  // FIXME: use reduction contexts
  var R = B.pow(E).mod(M).toArrayLike(Buffer, 'be')
  var Rlen = new BN(R).toArrayLike(Buffer, 'be', 32)

  results.return = Buffer.concat(Rlen, R)
  results.exception = 1

  console.log('MODEXP output', Rlen, R)

  return results
}