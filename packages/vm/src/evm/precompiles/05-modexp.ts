import { setLengthRight, bufferToHex, toBuffer, setLengthLeft } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
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

export function expmod(a: bigint, power: bigint, modulo: bigint) {
  let res = 1n
  while (power > 0n) {
    if (power & 1n) res = (res * a) % modulo
    a = (a * a) % modulo
    power >>= 1n
  }
  return res
}

export default function (opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data

  let adjustedELen = getAdjustedExponentLength(data)
  if (adjustedELen < 1n) {
    adjustedELen = 1n
  }

  const bLen = BigInt(bufferToHex(data.slice(0, 32)))
  const eLen = BigInt(bufferToHex(data.slice(32, 64)))
  const mLen = BigInt(bufferToHex(data.slice(64, 96)))

  let maxLen = bLen
  if (maxLen < mLen) {
    maxLen = mLen
  }
  const Gquaddivisor = BigInt(opts._common.param('gasPrices', 'modexpGquaddivisor'))
  let gasUsed

  const bStart = 96n
  const bEnd = bStart + bLen
  const eStart = bEnd
  const eEnd = eStart + eLen
  const mStart = eEnd
  const mEnd = mStart + mLen

  if (!opts._common.isActivatedEIP(2565)) {
    gasUsed = (adjustedELen * multComplexity(maxLen)) / Gquaddivisor
  } else {
    gasUsed = (adjustedELen * multComplexityEIP2565(maxLen)) / Gquaddivisor
    if (gasUsed < 200n) {
      gasUsed = 200n
    }
  }

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  if (bLen === 0n) {
    return {
      gasUsed,
      returnValue: setLengthLeft(toBuffer('0x' + 0n.toString(16)), Number(mLen)),
    }
  }

  if (mLen === 0n) {
    return {
      gasUsed,
      returnValue: Buffer.alloc(0),
    }
  }

  const maxInt = BigInt(Number.MAX_SAFE_INTEGER)
  const maxSize = 2147483647n // ethereumjs-util setLengthRight limitation

  if (bLen > maxSize || eLen > maxSize || mLen > maxSize) {
    return OOGResult(opts.gasLimit)
  }

  const B = BigInt(
    bufferToHex(setLengthRight(data.slice(Number(bStart), Number(bEnd)), Number(bLen)))
  )
  const E = BigInt(
    bufferToHex(setLengthRight(data.slice(Number(eStart), Number(eEnd)), Number(eLen)))
  )
  const M = BigInt(
    bufferToHex(setLengthRight(data.slice(Number(mStart), Number(mEnd)), Number(mLen)))
  )

  if (mEnd > maxInt) {
    return OOGResult(opts.gasLimit)
  }

  let R
  if (M === 0n) {
    R = 0n
  } else {
    R = expmod(B, E, M)
  }

  return {
    gasUsed,
    returnValue: setLengthLeft(toBuffer('0x' + R.toString(16)), Number(mLen)),
  }
}
