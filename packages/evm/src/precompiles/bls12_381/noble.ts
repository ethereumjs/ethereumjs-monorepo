import {
  BIGINT_0,
  bigIntToHex,
  bytesToBigInt,
  bytesToHex,
  bytesToUnprefixedHex,
  concatBytes,
  equalsBytes,
  hexToBytes,
  padToEven,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { bls12_381 } from '@noble/curves/bls12-381'

import { ERROR, EvmError } from '../../exceptions.js'

import { BLS_FIELD_MODULUS } from './constants.js'

import type { EVMBLSInterface } from '../../types.js'
import type { AffinePoint, ProjPointType } from '@noble/curves/abstract/weierstrass.js'

// Copied from @noble/curves/bls12-381 (only local declaration)
type Fp2 = {
  c0: bigint
  c1: bigint
}

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

  const G1 = new mcl.G1()

  const ZeroString48Bytes = '0'.repeat(96)
  if (p_x === p_y && p_x === ZeroString48Bytes) {
    return G1
  }

  const Fp_X = new mcl.Fp()
  const Fp_Y = new mcl.Fp()
  const One = new mcl.Fp()

  Fp_X.setStr(p_x, 16)
  Fp_Y.setStr(p_y, 16)
  One.setStr('1', 16)

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

/**
 * Converts an Uint8Array to a MCL G1 point. Raises errors if the point is not on the curve
 * and (if activated) if the point is in the subgroup / order check.
 * @param input Input Uint8Array. Should be 128 bytes
 * @param verifyOrder Perform the subgroup check (defaults to true)
 * @returns MCL G1 point
 */
function BLS12_381_ToG1PointN(input: Uint8Array) {
  const x = bytesToBigInt(input.subarray(16, 64))
  const y = bytesToBigInt(input.subarray(80, 128))

  if (x === y && x === BIGINT_0) {
    return bls12_381.G1.ProjectivePoint.ZERO
  }

  const G1 = bls12_381.G1.ProjectivePoint.fromAffine({
    x,
    y,
  })

  // TODO: validate if these two checks are necessary and
  // how to transition to Noble
  /*mcl.verifyOrderG1(verifyOrder)
  if (verifyOrder && G1.isValidOrder() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  // Check if these coordinates are actually on the curve.
  if (G1.isValid() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }*/

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

// input: a mcl G1 point
// output: a 128-byte Uint8Array
function BLS12_381_FromG1PointN(input: AffinePoint<bigint>): Uint8Array {
  const xval = padToEven(bigIntToHex(input.x).slice(2))
  const yval = padToEven(bigIntToHex(input.y).slice(2))

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

/**
 * Converts an Uint8Array to a MCL G2 point. Raises errors if the point is not on the curve
 * and (if activated) if the point is in the subgroup / order check.
 * @param input Input Uint8Array. Should be 256 bytes
 * @param mcl MCL instance
 * @param verifyOrder Perform the subgroup check (defaults to true)
 * @returns MCL G2 point
 */
function BLS12_381_ToG2PointN(input: Uint8Array) {
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
    return bls12_381.G2.ProjectivePoint.ZERO
  }

  const Fp2X = BLS12_381_ToFp2PointN(p_x_1, p_x_2)
  const Fp2Y = BLS12_381_ToFp2PointN(p_y_1, p_y_2)

  const pG2 = bls12_381.G2.ProjectivePoint.fromAffine({
    x: Fp2X,
    y: Fp2Y,
  })

  /*mcl.verifyOrderG2(verifyOrder)
  if (verifyOrder && mclPoint.isValidOrder() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  if (mclPoint.isValid() === false) {
    throw new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE)
  }*/

  return pG2
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

// input: a mcl G1 point
// output: a 128-byte Uint8Array
function BLS12_381_FromG2PointN(input: AffinePoint<Fp2>): Uint8Array {
  const x_1 = padToEven(bigIntToHex(input.x.c0).slice(2))
  const x_2 = padToEven(bigIntToHex(input.x.c1).slice(2))
  const y_1 = padToEven(bigIntToHex(input.y.c0).slice(2))
  const y_2 = padToEven(bigIntToHex(input.y.c1).slice(2))

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

// input: a 32-byte hex scalar Uint8Array
// output: a mcl Fr point

function BLS12_381_ToFrPointN(input: Uint8Array): bigint {
  const Fr = bls12_381.fields.Fr.fromBytes(input)

  // TODO: This fixes the following two failing tests:
  // bls_g1mul_random*g1_unnormalized_scalar
  // bls_g1mul_random*p1_unnormalized_scalar
  // It should be nevertheless validated if this is (fully) correct,
  // especially if ">" or ">=" should be applied.
  //
  // Unfortunately the skalar in both test vectors is significantly
  // greater than the ORDER threshold, here are th values from both tests:
  //
  // Skalar / Order
  // 69732848789442042582239751384143889712113271203482973843852656394296700715236n
  // 52435875175126190479447740508185965837690552500527637822603658699938581184513n
  //
  // There should be 4 test cases added to the official test suite:
  // 1. bls_g1mul_random*g1_unnormalized_scalar within threshold (ORDER (?))
  // 2. bls_g1mul_random*g1_unnormalized_scalar outside threshold (ORDER + 1 (?))
  // 3. bls_g1mul_random*p1_unnormalized_scalar within threshold (ORDER (?))
  // 4. bls_g1mul_random*p1_unnormalized_scalar outside threshold (ORDER + 1 (?))
  //
  if (Fr > bls12_381.fields.Fr.ORDER) {
    return Fr - bls12_381.fields.Fr.ORDER
  }
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

// input: a 64-byte buffer
// output: a mcl Fp point

function BLS12_381_ToFpPointN(fpCoordinate: Uint8Array) {
  // check if point is in field
  if (bytesToBigInt(fpCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }
  const FP = bls12_381.fields.Fp.fromBytes(fpCoordinate.slice(16))
  return FP
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

function BLS12_381_ToFp2PointN(fpXCoordinate: Uint8Array, fpYCoordinate: Uint8Array) {
  // check if the coordinates are in the field
  if (bytesToBigInt(fpXCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }
  if (bytesToBigInt(fpYCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }

  const fpBytes = concatBytes(fpXCoordinate.subarray(16), fpYCoordinate.subarray(16))

  const FP = bls12_381.fields.Fp2.fromBytes(fpBytes)
  return FP
}

export class NobleBLS implements EVMBLSInterface {
  // TODO: Remove after transition
  protected readonly _mcl: any

  constructor(mcl: any) {
    this._mcl = mcl
  }

  addG1(input: Uint8Array): Uint8Array {
    const p1 = BLS12_381_ToG1PointN(input.subarray(0, 128))
    const p2 = BLS12_381_ToG1PointN(input.subarray(128, 256))

    const p = p1.add(p2)
    const result = BLS12_381_FromG1PointN(p)

    /*console.log('MCL (result):')
    console.log(bytesToHex(resultBytes))
    console.log('Noble (result):')
    console.log(bytesToHex(resultBytesN))*/

    return result
  }

  mulG1(input: Uint8Array): Uint8Array {
    // convert input to mcl G1 points, add them, and convert the output to a Uint8Array.
    const p = BLS12_381_ToG1PointN(input.subarray(0, 128))
    const skalar = BLS12_381_ToFrPointN(input.subarray(128, 160))

    if (skalar === BIGINT_0) {
      return new Uint8Array(128)
    }
    const result = p.multiply(skalar)
    return BLS12_381_FromG1PointN(result)
  }

  addG2(input: Uint8Array): Uint8Array {
    const p1 = BLS12_381_ToG2PointN(input.subarray(0, 256))
    const p2 = BLS12_381_ToG2PointN(input.subarray(256, 512))

    /*console.log('MCL:')
    console.log(result.getStr(16))
    console.log('Noble:')
    console.log(bigIntToHex(resultN.x))
    console.log(bigIntToHex(resultN.y))*/

    const p = p1.add(p2)

    const result = BLS12_381_FromG2PointN(p)
    //const mclResult = this._mcl.add(mclPoint1, mclPoint2)

    /*console.log('MCL (result):')
    console.log(bytesToHex(resultBytes))
    console.log('Noble (result):')
    console.log(bytesToHex(resultBytesN))*/

    return result
  }

  mulG2(input: Uint8Array): Uint8Array {
    // convert input to mcl G2 point/Fr point, add them, and convert the output to a Uint8Array.
    const p = BLS12_381_ToG2PointN(input.subarray(0, 256))
    const skalar = BLS12_381_ToFrPointN(input.subarray(256, 288))

    if (skalar === BIGINT_0) {
      return new Uint8Array(256)
    }
    const result = p.multiply(skalar)
    return BLS12_381_FromG2PointN(result)
  }

  mapFPtoG1(input: Uint8Array): Uint8Array {
    // convert input to mcl Fp1 point
    const FP = BLS12_381_ToFpPointN(input.subarray(0, 64))

    const result = bls12_381.G1.mapToCurve([FP]).toAffine()
    console.log('Direct result Noble (ProjectivePoint)')
    console.log(result)
    const resultBytes = BLS12_381_FromG1PointN(result)
    console.log('Serialized EVM byte result')
    console.log(bytesToHex(resultBytes))
    return resultBytes
  }

  mapFP2toG2(input: Uint8Array): Uint8Array {
    // convert input to mcl Fp2 point
    const Fp2Point = BLS12_381_ToFp2PointN(input.subarray(0, 64), input.subarray(64, 128))
    console.log(Fp2Point)
    const result = bls12_381.G2.mapToCurve([Fp2Point.c0, Fp2Point.c1]).toAffine()
    console.log('Direct result Noble (ProjectivePoint)')
    console.log(result)
    const resultBytes = BLS12_381_FromG2PointN(result)
    console.log('Serialized EVM byte result')
    console.log(bytesToHex(resultBytes))
    return resultBytes
  }

  msmG1(input: Uint8Array): Uint8Array {
    // Note: This implementation is using the naive "algorithm" of just doing
    // p1G1*v1F1 + p2G1*v1F1 + ... while the EIP is suggesting to use an optimized
    // algorithm (Pippenger's algorithm, see https://eips.ethereum.org/EIPS/eip-2537#g1g2-msm).
    //
    // While this functionally works the approach is not "gas-cost-competitive" and an
    // optimization should be considered in the future.
    const pointLength = 128
    const pairLength = 160
    const numPairs = input.length / pairLength

    let pRes = bls12_381.G1.ProjectivePoint.ZERO
    for (let k = 0; k < numPairs; k++) {
      const pairStart = pairLength * k
      const G1 = BLS12_381_ToG1PointN(input.subarray(pairStart, pairStart + pointLength))
      const Fr = BLS12_381_ToFrPointN(
        input.subarray(pairStart + pointLength, pairStart + pairLength)
      )

      pRes = pRes.add(G1.multiply(Fr))
    }

    return BLS12_381_FromG1PointN(pRes)
  }

  msmG2(input: Uint8Array): Uint8Array {
    // Note: This implementation is using the naive "algorithm" of just doing
    // p1G1*v1F1 + p2G1*v1F1 + ... while the EIP is suggesting to use an optimized
    // algorithm (Pippenger's algorithm, see https://eips.ethereum.org/EIPS/eip-2537#g1g2-msm).
    //
    // While this functionally works the approach is not "gas-cost-competitive" and an
    // optimization should be considered in the future.
    const pointLength = 256
    const pairLength = 288
    const numPairs = input.length / pairLength

    let pRes = bls12_381.G2.ProjectivePoint.ZERO
    for (let k = 0; k < numPairs; k++) {
      const pairStart = pairLength * k
      const G2 = BLS12_381_ToG2PointN(input.subarray(pairStart, pairStart + pointLength))
      const Fr = BLS12_381_ToFrPointN(
        input.subarray(pairStart + pointLength, pairStart + pairLength)
      )

      pRes = pRes.add(G2.multiply(Fr))
    }

    return BLS12_381_FromG2PointN(pRes)
  }

  pairingCheck(input: Uint8Array): Uint8Array {
    const ZERO_BUFFER = new Uint8Array(32)
    const ONE_BUFFER = concatBytes(new Uint8Array(31), hexToBytes('0x01'))
    const pairLength = 384
    const pairs = []
    for (let k = 0; k < input.length / pairLength; k++) {
      const pairStart = pairLength * k
      const G1 = BLS12_381_ToG1PointN(input.subarray(pairStart, pairStart + 128))

      const g2start = pairStart + 128
      const G2 = BLS12_381_ToG2PointN(input.subarray(g2start, g2start + 256))

      pairs.push([G1, G2])
    }

    // run the pairing check
    // reference (Nethermind): https://github.com/NethermindEth/nethermind/blob/374b036414722b9c8ad27e93d64840b8f63931b9/src/Nethermind/Nethermind.Evm/Precompiles/Bls/Mcl/PairingPrecompile.cs#L93
    let GT: any // Fp12 type not exported, eventually too complex
    for (let index = 0; index < pairs.length; index++) {
      const pair = pairs[index]
      const G1 = pair[0] as ProjPointType<bigint>
      const G2 = pair[1] as ProjPointType<Fp2>

      if (index === 0) {
        GT = bls12_381.pairing(G1, G2)
      } else {
        GT = bls12_381.fields.Fp12.mul(GT!, bls12_381.pairing(G1, G2))
      }
    }

    const FP12 = bls12_381.fields.Fp12.finalExponentiate(GT!)
    if (bls12_381.fields.Fp12.eql(FP12, bls12_381.fields.Fp12.ONE)) {
      return ONE_BUFFER
    } else {
      return ZERO_BUFFER
    }
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
