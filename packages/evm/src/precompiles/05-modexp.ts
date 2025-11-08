import {
  BIGINT_0,
  BIGINT_1,
  BIGINT_2,
  BIGINT_7,
  BIGINT_8,
  BIGINT_32,
  BIGINT_64,
  BIGINT_96,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  setLengthLeft,
  setLengthRight,
} from '@ethereumjs/util'

import { OOGResult } from '../evm.ts'

import { getPrecompileName } from './index.ts'
import { gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

const BIGINT_4 = BigInt(4)
const BIGINT_16 = BigInt(16)
const BIGINT_480 = BigInt(480)
const BIGINT_200 = BigInt(200)
const BIGINT_500 = BigInt(500)
const BIGINT_1024 = BigInt(1024)
const BIGINT_3072 = BigInt(3072)
const BIGINT_199680 = BigInt(199680)
const BIGINT_2147483647 = BigInt(2147483647)

const maxInt = BigInt(Number.MAX_SAFE_INTEGER)

function multiplicationComplexity(x: bigint): bigint {
  let fac1
  let fac2
  if (x <= BIGINT_64) {
    return x ** BIGINT_2
  } else if (x <= BIGINT_1024) {
    // return Math.floor(Math.pow(x, 2) / 4) + 96 * x - 3072
    fac1 = x ** BIGINT_2 / BIGINT_4
    fac2 = x * BIGINT_96
    return fac1 + fac2 - BIGINT_3072
  } else {
    // return Math.floor(Math.pow(x, 2) / 16) + 480 * x - 199680
    fac1 = x ** BIGINT_2 / BIGINT_16
    fac2 = x * BIGINT_480
    return fac1 + fac2 - BIGINT_199680
  }
}

function getAdjustedExponentLength(data: Uint8Array, opts: PrecompileInput): bigint {
  let expBytesStart
  try {
    const baseLen = bytesToBigInt(data.subarray(0, 32))
    expBytesStart = 96 + Number(baseLen) // 96 for base length, then exponent length, and modulus length, then baseLen for the base data, then exponent bytes start
  } catch {
    expBytesStart = Number.MAX_SAFE_INTEGER - 32
  }
  const expLen = bytesToBigInt(data.subarray(32, 64))
  let firstExpBytes = data.subarray(expBytesStart, expBytesStart + 32) // first word of the exponent data
  firstExpBytes = setLengthRight(firstExpBytes, 32) // reading past the data reads virtual zeros
  let firstExpBigInt = bytesToBigInt(firstExpBytes)
  let max32expLen = 0
  if (expLen < BIGINT_32) {
    max32expLen = 32 - Number(expLen)
  }
  firstExpBigInt = firstExpBigInt >> (BIGINT_8 * BigInt(Math.max(max32expLen, 0)))

  let bitLen = -1
  while (firstExpBigInt > BIGINT_0) {
    bitLen = bitLen + 1
    firstExpBigInt = firstExpBigInt >> BIGINT_1
  }
  let expLenMinus32OrZero = expLen - BIGINT_32
  if (expLenMinus32OrZero < BIGINT_0) {
    expLenMinus32OrZero = BIGINT_0
  }
  let adjustedExpLen =
    expLenMinus32OrZero * (opts.common.isActivatedEIP(7883) === true ? BIGINT_16 : BIGINT_8)
  if (bitLen > 0) {
    adjustedExpLen += BigInt(bitLen)
  }
  return adjustedExpLen
}

export function expMod(a: bigint, power: bigint, modulo: bigint) {
  if (power === BIGINT_0) {
    return BIGINT_1 % modulo
  }
  let res = BIGINT_1
  while (power > BIGINT_0) {
    if (power & BIGINT_1) res = (res * a) % modulo
    a = (a * a) % modulo
    power >>= BIGINT_1
  }
  return res
}

export function precompile05(opts: PrecompileInput): ExecResult {
  const pName = getPrecompileName('05')
  const data = opts.data.length < 96 ? setLengthRight(opts.data, 96) : opts.data

  let adjustedELen = getAdjustedExponentLength(data, opts)
  if (adjustedELen < BIGINT_1) {
    adjustedELen = BIGINT_1
  }

  const bLen = bytesToBigInt(data.subarray(0, 32))
  const eLen = bytesToBigInt(data.subarray(32, 64))
  const mLen = bytesToBigInt(data.subarray(64, 96))

  let maxLen = bLen
  if (maxLen < mLen) {
    maxLen = mLen
  }
  const Gquaddivisor = opts.common.param('modexpGquaddivisorGas')
  let gasUsed

  const bStart = BIGINT_96
  const bEnd = bStart + bLen
  const eStart = bEnd
  const eEnd = eStart + eLen
  const mStart = eEnd
  const mEnd = mStart + mLen

  if (opts.common.isActivatedEIP(2565)) {
    const words = (maxLen + BIGINT_7) / BIGINT_8
    if (opts.common.isActivatedEIP(7883)) {
      gasUsed = adjustedELen * (maxLen > BIGINT_32 ? BIGINT_2 * words * words : BIGINT_16)
      if (gasUsed < BIGINT_500) {
        gasUsed = BIGINT_500
      }
    } else {
      gasUsed = (adjustedELen * words * words) / Gquaddivisor
      if (gasUsed < BIGINT_200) {
        gasUsed = BIGINT_200
      }
    }
  } else {
    gasUsed = (adjustedELen * multiplicationComplexity(maxLen)) / Gquaddivisor
  }

  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  // Upper bounds by EIP-7823 (Osaka and upwards) or otherwise
  // @ethereumjs/util setLengthRight limitation
  const maxSize = opts.common.isActivatedEIP(7823) ? BIGINT_1024 : BIGINT_2147483647

  if (opts._debug !== undefined) {
    // Lengths value debugging
    const total = BigInt(96) + bLen + eLen + mLen
    const data = BigInt(opts.data.length)
    let msg = `${pName} length values: maxSize(b/e/m)=${maxSize} bLen=${bLen} eLen=${eLen} mLen=${mLen} 96+b+e+m=${total} `
    msg += `data=${data} lengthMatch=${total === data}`
    opts._debug(msg)
  }

  // Optimization: do not compute for b and m being 0 but return early
  if (!opts.common.isActivatedEIP(7823) && bLen === BIGINT_0 && mLen === BIGINT_0) {
    return {
      executionGasUsed: gasUsed,
      returnValue: new Uint8Array(),
    }
  }

  if (bLen > maxSize || eLen > maxSize || mLen > maxSize) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: one or more input values too large`)
    }
    return OOGResult(opts.gasLimit)
  }

  if (mEnd > maxInt) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: total input too large`)
    }
    return OOGResult(opts.gasLimit)
  }

  const B = bytesToBigInt(setLengthRight(data.subarray(Number(bStart), Number(bEnd)), Number(bLen)))
  const E = bytesToBigInt(setLengthRight(data.subarray(Number(eStart), Number(eEnd)), Number(eLen)))
  const M = bytesToBigInt(setLengthRight(data.subarray(Number(mStart), Number(mEnd)), Number(mLen)))

  if (opts._debug !== undefined) {
    opts._debug(`${pName} input: B=${B} E=${E} M=${M}`)
  }

  let R
  if (M === BIGINT_0) {
    R = new Uint8Array()
  } else {
    R = expMod(B, E, M)
    if (R === BIGINT_0) {
      R = new Uint8Array()
    } else {
      R = bigIntToBytes(R)
    }
  }

  const res = setLengthLeft(R, Number(mLen))
  if (opts._debug !== undefined) {
    opts._debug(`${pName} return value=${bytesToHex(res)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: res,
  }
}
