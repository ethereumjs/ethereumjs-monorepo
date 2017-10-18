const utils = require('ethereumjs-util')
const BN = utils.BN
const error = require('../constants.js').ERROR
const fees = require('ethereum-common')
const assert = require('assert')

const Gquaddivisor = fees.modexpGquaddivisor.v

function multComplexity (x) {
  var fac1 = new BN(0)
  var fac2 = new BN(0)
  if (x.lten(64)) {
    return x.sqr()
  } else if (x.lten(1024)) {
    // return Math.floor(Math.pow(x, 2) / 4) + 96 * x - 3072
    fac1 = x.sqr().divn(4)
    fac2 = x.muln(96)
    return fac1.add(fac2).subn(3072)
  } else {
    // return Math.floor(Math.pow(x, 2) / 16) + 480 * x - 199680
    fac1 = x.sqr().divn(16)
    fac2 = x.muln(480)
    return fac1.add(fac2).subn(199680)
  }
}

function getAdjustedExponentLength (data) {
  var baseLen = new BN(data.slice(0, 32)).toNumber()
  var expLen = new BN(data.slice(32, 64))
  var expBytesStart = 96 + baseLen // 96 for base length, then exponent length, and modulus length, then baseLen for the base data, then exponent bytes start
  var firstExpBytes = Buffer.from(data.slice(expBytesStart, expBytesStart + 32)) // first word of the exponent data
  firstExpBytes = utils.setLengthRight(firstExpBytes, 32) // reading past the data reads virtual zeros
  firstExpBytes = new BN(firstExpBytes)
  var max32expLen = 0
  if (expLen.ltn(32)) {
    max32expLen = 32 - expLen.toNumber()
  }
  firstExpBytes = firstExpBytes.shrn(8 * Math.max(max32expLen, 0))

  var bitLen = -1
  while (firstExpBytes.gtn(0)) {
    bitLen = bitLen + 1
    firstExpBytes = firstExpBytes.ushrn(1)
  }
  var expLenMinus32OrZero = expLen.subn(32)
  if (expLenMinus32OrZero.ltn(0)) {
    expLenMinus32OrZero = new BN(0)
  }
  var eightTimesExpLenMinus32OrZero = expLenMinus32OrZero.muln(8)
  var adjustedExpLen = eightTimesExpLenMinus32OrZero
  if (bitLen > 0) {
    adjustedExpLen.iaddn(bitLen)
  }
  return adjustedExpLen
}

// Taken from https://stackoverflow.com/a/1503019
function expmod (B, E, M) {
  if (E.eqn(0)) return new BN(1).mod(M)
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
  assert(opts.data)

  var results = {}
  var data = opts.data

  var adjustedELen = getAdjustedExponentLength(data)
  if (adjustedELen.ltn(1)) {
    adjustedELen = new BN(1)
  }

  var bLen = new BN(data.slice(0, 32))
  var eLen = new BN(data.slice(32, 64))
  var mLen = new BN(data.slice(64, 96))

  var maxLen = bLen
  if (maxLen.lt(mLen)) {
    maxLen = mLen
  }
  var gasUsed = adjustedELen.mul(multComplexity(maxLen)).divn(Gquaddivisor)

  if (opts.gasLimit.lt(gasUsed)) {
    return getOOGResults(opts, results)
  }

  results.gasUsed = gasUsed

  var zeroR = new BN(0)
  if (bLen.eqn(0)) {
    results.return = zeroR.toArrayLike(Buffer, 'be', 1)
    results.exception = 1
    return results
  }

  if (mLen.eqn(0)) {
    results.return = Buffer.from([0])
    results.exception = 1
    return results
  }

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
