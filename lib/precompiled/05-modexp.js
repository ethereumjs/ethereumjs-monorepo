const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR

const Gquaddivisor = 100

function multComplexity (x) {
  if (x <= 64) {
    return Math.pow(x, 2)
  } else if (x <= 1024) {
    return Math.floor(Math.pow(x, 2) / 4) + 96 * x - 3072
  } else {
    return Math.floor(Math.pow(x, 2) / 16) + 480 * x - 199680
  }
}

function getAdjustedExponentLength (E, eLen) {
  E = E.toArrayLike(Buffer, 'be')
  if (eLen <= 32) {
    if (new BN(E).eqn(0)) {
      return 0
    }
    return new BN(E).toString(2).length - 1
  } else {
    var baseLen = 8 * (eLen - 32)
    return baseLen + new BN(E.slice(0, 32)).toString(2).length - 1
  }
}

// Taken from https://stackoverflow.com/a/1503019
function expmod (B, E, M) {
  if (E.eqn(0)) return new BN(1)
  var BM = B.mod(M)
  var R = expmod(BM, E.divn(2), M)
  R = (R.mul(R)).mod(M)
  if (E.mod(new BN(2)).eqn(0)) return R
  return (R.mul(BM)).mod(M)
}

function getOOGResults (opts, results) {
  results.gasUsed = opts.gasLimit
  results.exception = 0 // 0 means VM fail (in this case because of OOG)
  results.exceptionError = error.OUT_OF_GAS
  return results
}

module.exports = function (opts) {
  var results = {}
  var data = opts.data

  var bLen = new BN(data.slice(0, 32))
  var eLen = new BN(data.slice(32, 64))
  var mLen = new BN(data.slice(64, 96))

  var maxInt = new BN(Number.MAX_SAFE_INTEGER)
  var maxSize = new BN(2147483647) // ethereumjs-util setLengthRight limitation

  if (bLen.gt(maxSize) || eLen.gt(maxSize) || mLen.gt(maxSize)) {
    return getOOGResults(opts, results)
  }

  var bStart = new BN(96)
  var bEnd = bStart.add(bLen)
  var eStart = bEnd
  var eEnd = eStart.add(eLen)
  var mStart = eEnd
  var mEnd = mStart.add(mLen)

  if (mEnd.gt(maxInt)) {
    return getOOGResults(opts, results)
  }

  bLen = bLen.toNumber()
  eLen = eLen.toNumber()
  mLen = mLen.toNumber()

  var B = new BN(utils.setLengthRight(data.slice(bStart.toNumber(), bEnd.toNumber()), bLen))
  var E = new BN(utils.setLengthRight(data.slice(eStart.toNumber(), eEnd.toNumber()), eLen))
  var M = new BN(utils.setLengthRight(data.slice(mStart.toNumber(), mEnd.toNumber()), mLen))

  // console.log('MODEXP input')
  // console.log('B:', bLen, B)
  // console.log('E:', eLen, E)
  // console.log('M:', mLen, M)

  // Byzantium
  // floor(mult_complexity(max(length_of_MODULUS, length_of_BASE)) * max(ADJUSTED_EXPONENT_LENGTH, 1) / GQUADDIVISOR)
  var maxLen = Math.max(mLen, bLen)
  // console.log("multComplexity:", multComplexity(maxLen))
  // console.log("getAdjustedExponentLength:", getAdjustedExponentLength(E, eLen))
  results.gasUsed = new BN(Math.floor(multComplexity(maxLen) * Math.max(getAdjustedExponentLength(E, eLen), 1) / Gquaddivisor))
  // console.log("Gas used: " + results.gasUsed)
  // console.log("GasLimit: ", opts.gasLimit)

  if (opts.gasLimit.cmp(results.gasUsed) === -1) {
    return getOOGResults(opts, results)
  }

  var R
  if (M.eqn(0)) {
    R = new BN(0)
  } else {
    R = expmod(B, E, M)
  }
  var result = R.toArrayLike(Buffer, 'be', mLen)

  results.return = result
  results.exception = 1

  // console.log('MODEXP output', result)

  return results
}
