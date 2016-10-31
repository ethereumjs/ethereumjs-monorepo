/* 
At the address 0x0000....09, add a precompile that expects input in the following format:

<length of B, as a 32-byte-padded integer> <bytes of B> <length of E, as a 32-byte-padded integer> <bytes of E> <bytes of M>

This should return B**E % M, and the data should be returned in the same format as above. If M = 0, it returns zero. Gas cost GMODEXPBASE + GARITHWORD * ceil(<total length of input data> / 32) + <length of M> * <length of M> * <length of E> / GQUADDIVISOR.
 *
 */

const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR

const Gmodexpbase = 45
const Garithword = 6
const Gquaddivisor = 32

module.exports = function (opts) {
  var results = {}

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
