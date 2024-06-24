import {
  bytesToBigInt,
  bytesToUnprefixedHex,
  concatBytes,
  equalsBytes,
  padToEven,
  unprefixedHexToBytes,
} from '@ethereumjs/util'

import { ERROR, EvmError } from '../../exceptions.js'

import { BLS_FIELD_MODULUS } from './constants.js'

import type { EVMBLSInterface } from '../../types.js'

/**
 * Converts an Uint8Array to a MCL G1 point. Raises errors if the point is not on the curve
 * and (if activated) if the point is in the subgroup / order check.
 * @param input Input Uint8Array. Should be 128 bytes
 * @param mcl MCL instance
 * @param verifyOrder Perform the subgroup check (defaults to true)
 * @returns MCL G1 point
 */
function BLS12_381_ToG1Point(input: Uint8Array, mcl: any, verifyOrder = true): any {
  const p_x = bytesToUnprefixedHex(input.subarray(16, 64))
  const p_y = bytesToUnprefixedHex(input.subarray(80, 128))

  const ZeroString48Bytes = '0'.repeat(96)
  if (p_x === p_y && p_x === ZeroString48Bytes) {
    return new mcl.G1()
  }

  const Fp_X = new mcl.Fp()
  const Fp_Y = new mcl.Fp()
  const One = new mcl.Fp()

  Fp_X.setStr(p_x, 16)
  Fp_Y.setStr(p_y, 16)
  One.setStr('1', 16)

  const G1 = new mcl.G1()

  G1.setX(Fp_X)
  G1.setY(Fp_Y)
  G1.setZ(One)

  mcl.verifyOrderG1(verifyOrder)
  if (verifyOrder && G1.isValidOrder() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  // Check if these coordinates are actually on the curve.
  if (G1.isValid() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  return G1
}

// input: a mcl G1 point
// output: a 128-byte Uint8Array
function BLS12_381_FromG1Point(input: any): Uint8Array {
  // TODO: figure out if there is a better way to decode these values.
  const decodeStr = input.getStr(16) //return a string of pattern "1 <x_coord> <y_coord>"
  const decoded = decodeStr.match(/"?[0-9a-f]+"?/g) // match above pattern.

  if (decodeStr === '0') {
    return new Uint8Array(128)
  }

  // note: decoded[0] === 1
  const xval = padToEven(decoded[1])
  const yval = padToEven(decoded[2])

  // convert to buffers.

  const xBuffer = concatBytes(new Uint8Array(64 - xval.length / 2), unprefixedHexToBytes(xval))
  const yBuffer = concatBytes(new Uint8Array(64 - yval.length / 2), unprefixedHexToBytes(yval))

  return concatBytes(xBuffer, yBuffer)
}

/**
 * Converts an Uint8Array to a MCL G2 point. Raises errors if the point is not on the curve
 * and (if activated) if the point is in the subgroup / order check.
 * @param input Input Uint8Array. Should be 256 bytes
 * @param mcl MCL instance
 * @param verifyOrder Perform the subgroup check (defaults to true)
 * @returns MCL G2 point
 */
function BLS12_381_ToG2Point(input: Uint8Array, mcl: any, verifyOrder = true): any {
  const p_x_1 = input.subarray(0, 64)
  const p_x_2 = input.subarray(64, 128)
  const p_y_1 = input.subarray(128, 192)
  const p_y_2 = input.subarray(192, 256)

  const ZeroBytes64 = new Uint8Array(64)
  // check if we have to do with a zero point
  if (
    equalsBytes(p_x_1, p_x_2) &&
    equalsBytes(p_x_1, p_y_1) &&
    equalsBytes(p_x_1, p_y_2) &&
    equalsBytes(p_x_1, ZeroBytes64)
  ) {
    return new mcl.G2()
  }

  const Fp2X = BLS12_381_ToFp2Point(p_x_1, p_x_2, mcl)
  const Fp2Y = BLS12_381_ToFp2Point(p_y_1, p_y_2, mcl)

  const FpOne = new mcl.Fp()
  FpOne.setStr('1', 16)

  const FpZero = new mcl.Fp()
  FpZero.setStr('0', 16)

  const Fp2One = new mcl.Fp2()

  Fp2One.set_a(FpOne)
  Fp2One.set_b(FpZero)

  const mclPoint = new mcl.G2()

  mclPoint.setX(Fp2X)
  mclPoint.setY(Fp2Y)
  mclPoint.setZ(Fp2One)

  mcl.verifyOrderG2(verifyOrder)
  if (verifyOrder && mclPoint.isValidOrder() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  if (mclPoint.isValid() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  return mclPoint
}

// input: a mcl G2 point
// output: a 256-byte Uint8Array
function BLS12_381_FromG2Point(input: any): Uint8Array {
  // TODO: figure out if there is a better way to decode these values.
  const decodeStr = input.getStr(16) //return a string of pattern "1 <x_coord_1> <x_coord_2> <y_coord_1> <y_coord_2>"
  if (decodeStr === '0') {
    return new Uint8Array(256)
  }
  const decoded = decodeStr.match(/"?[0-9a-f]+"?/g) // match above pattern.

  // note: decoded[0] === 1
  const x_1 = padToEven(decoded[1])
  const x_2 = padToEven(decoded[2])
  const y_1 = padToEven(decoded[3])
  const y_2 = padToEven(decoded[4])

  // convert to buffers.

  const xBuffer1 = concatBytes(new Uint8Array(64 - x_1.length / 2), unprefixedHexToBytes(x_1))
  const xBuffer2 = concatBytes(new Uint8Array(64 - x_2.length / 2), unprefixedHexToBytes(x_2))
  const yBuffer1 = concatBytes(new Uint8Array(64 - y_1.length / 2), unprefixedHexToBytes(y_1))
  const yBuffer2 = concatBytes(new Uint8Array(64 - y_2.length / 2), unprefixedHexToBytes(y_2))

  return concatBytes(xBuffer1, xBuffer2, yBuffer1, yBuffer2)
}

// input: a 32-byte hex scalar Uint8Array
// output: a mcl Fr point

function BLS12_381_ToFrPoint(input: Uint8Array, mcl: any): any {
  const mclHex = mcl.fromHexStr(bytesToUnprefixedHex(input))
  const Fr = new mcl.Fr()
  Fr.setBigEndianMod(mclHex)
  return Fr
}

// input: a 64-byte buffer
// output: a mcl Fp point

function BLS12_381_ToFpPoint(fpCoordinate: Uint8Array, mcl: any): any {
  // check if point is in field
  if (bytesToBigInt(fpCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }

  const fp = new mcl.Fp()

  fp.setBigEndianMod(mcl.fromHexStr(bytesToUnprefixedHex(fpCoordinate)))

  return fp
}

// input: two 64-byte buffers
// output: a mcl Fp2 point

function BLS12_381_ToFp2Point(fpXCoordinate: Uint8Array, fpYCoordinate: Uint8Array, mcl: any): any {
  // check if the coordinates are in the field
  if (bytesToBigInt(fpXCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }
  if (bytesToBigInt(fpYCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }

  const fp_x = new mcl.Fp()
  const fp_y = new mcl.Fp()

  const fp2 = new mcl.Fp2()
  fp_x.setStr(bytesToUnprefixedHex(fpXCoordinate.subarray(16)), 16)
  fp_y.setStr(bytesToUnprefixedHex(fpYCoordinate.subarray(16)), 16)

  fp2.set_a(fp_x)
  fp2.set_b(fp_y)

  return fp2
}

export class MCLBLS implements EVMBLSInterface {
  protected readonly _mcl: any

  constructor(mcl: any) {
    this._mcl = mcl
  }

  add(input: Uint8Array): Uint8Array {
    // convert input to mcl G1 points, add them, and convert the output to a Uint8Array.
    const mclPoint1 = BLS12_381_ToG1Point(input.subarray(0, 128), this._mcl, false)
    const mclPoint2 = BLS12_381_ToG1Point(input.subarray(128, 256), this._mcl, false)

    const result = this._mcl.add(mclPoint1, mclPoint2)

    return BLS12_381_FromG1Point(result)
  }
}

export {
  BLS12_381_FromG1Point,
  BLS12_381_FromG2Point,
  BLS12_381_ToFp2Point,
  BLS12_381_ToFpPoint,
  BLS12_381_ToFrPoint,
  BLS12_381_ToG1Point,
  BLS12_381_ToG2Point,
}
