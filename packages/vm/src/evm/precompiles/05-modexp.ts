import { setLengthRight, BN, bufferToHex } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
import { mod } from '../opcodes/util'
const assert = require('assert')

function multComplexity(x: bigint): bigint {
  let fac1
  let fac2
  if (x <= 64n) {
    return x ** 2n
  } else if (x <= 1024n) {
    // return Math.floor(Math.pow(x, 2) / 4) + 96 * x - 3072
    fac1 = x ** 2n / 4n
    fac2 = x * 96n
    return fac1 + fac2 - 3072n
  } else {
    // return Math.floor(Math.pow(x, 2) / 16) + 480 * x - 199680
    fac1 = x ** 2n / 16n
    fac2 = x * 480n
    return fac1 + fac2 - 199680n
  }
}

function multComplexityEIP2565(x: bigint): bigint {
  const words = (x + 7n) / 8n
  return words * words
}

function getAdjustedExponentLength(data: Buffer): bigint {
  let expBytesStart
  try {
    const baseLen = BigInt(bufferToHex(data.slice(0, 32)))
    expBytesStart = 96 + Number(baseLen) // 96 for base length, then exponent length, and modulus length, then baseLen for the base data, then exponent bytes start
  } catch (e: any) {
    expBytesStart = Number.MAX_SAFE_INTEGER - 32
  }
  const expLen = BigInt(bufferToHex(data.slice(32, 64)))
  let firstExpBytes = Buffer.from(data.slice(expBytesStart, expBytesStart + 32)) // first word of the exponent data
  firstExpBytes = setLengthRight(firstExpBytes, 32) // reading past the data reads virtual zeros
  let firstExpBigInt = BigInt(bufferToHex(firstExpBytes))
  let max32expLen = 0
  if (expLen < 32n) {
    max32expLen = 32 - Number(expLen)
  }
  firstExpBigInt = firstExpBigInt >> (8n * BigInt(Math.max(max32expLen, 0)))

  let bitLen = -1
  while (firstExpBigInt > 0n) {
    bitLen = bitLen + 1
    firstExpBigInt = firstExpBigInt >> 1n
  }
  let expLenMinus32OrZero = expLen - 32n
  if (expLenMinus32OrZero < 0n) {
    expLenMinus32OrZero = 0n
  }
  const eightTimesExpLenMinus32OrZero = expLenMinus32OrZero * 8n
  let adjustedExpLen = eightTimesExpLenMinus32OrZero
  if (bitLen > 0) {
    adjustedExpLen += BigInt(bitLen)
  }
  return adjustedExpLen
}

function expmod(B: bigint, E: bigint, M: bigint): bigint {
  if (E === 0n) return mod(1n, M)
  // Red asserts M > 1
  if (M <= 1n) return 0n
  const red = BN.red(M)
  const redB = B.toRed(red)
  const res = redB.redPow(E)
  return res.fromRed()
}

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let adjustedELen = getAdjustedExponentLength(data)
  if (adjustedELen.ltn(1)) {
    adjustedELen = new BN(1)
  }

  const bLen = new BN(data.slice(0, 32))
  const eLen = new BN(data.slice(32, 64))
  const mLen = new BN(data.slice(64, 96))

  let maxLen = bLen
  if (maxLen.lt(mLen)) {
    maxLen = mLen
  }
  const Gquaddivisor = opts._common.param('gasPrices', 'modexpGquaddivisor')
  let gasUsed

  const bStart = new BN(96)
  const bEnd = bStart.add(bLen)
  const eStart = bEnd
  const eEnd = eStart.add(eLen)
  const mStart = eEnd
  const mEnd = mStart.add(mLen)

  if (!opts._common.isActivatedEIP(2565)) {
    gasUsed = adjustedELen.mul(multComplexity(maxLen)).divn(Gquaddivisor)
  } else {
    gasUsed = adjustedELen.mul(multComplexityEIP2565(maxLen)).divn(Gquaddivisor)
    if (gasUsed.ltn(200)) {
      gasUsed = new BN(200)
    }
  }

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  if (bLen.isZero()) {
    return {
      gasUsed,
      returnValue: new BN(0).toArrayLike(Buffer, 'be', mLen.toNumber()),
    }
  }

  if (mLen.isZero()) {
    return {
      gasUsed,
      returnValue: Buffer.alloc(0),
    }
  }

  const maxInt = new BN(Number.MAX_SAFE_INTEGER)
  const maxSize = new BN(2147483647) // ethereumjs-util setLengthRight limitation

  if (bLen.gt(maxSize) || eLen.gt(maxSize) || mLen.gt(maxSize)) {
    return OOGResult(opts.gasLimit)
  }

  const B = new BN(setLengthRight(data.slice(bStart.toNumber(), bEnd.toNumber()), bLen.toNumber()))
  const E = new BN(setLengthRight(data.slice(eStart.toNumber(), eEnd.toNumber()), eLen.toNumber()))
  const M = new BN(setLengthRight(data.slice(mStart.toNumber(), mEnd.toNumber()), mLen.toNumber()))

  if (mEnd.gt(maxInt)) {
    return OOGResult(opts.gasLimit)
  }

  let R
  if (M.isZero()) {
    R = new BN(0)
  } else {
    R = expmod(B, E, M)
  }

  return {
    gasUsed,
    returnValue: R.toArrayLike(Buffer, 'be', mLen.toNumber()),
  }
}
