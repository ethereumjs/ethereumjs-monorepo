import {
  BIGINT_0,
  bigIntToHex,
  bytesToBigInt,
  concatBytes,
  equalsBytes,
  padToEven,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { bls12_381 } from '@noble/curves/bls12-381'

import { ERROR, EvmError } from '../../exceptions.js'

import {
  BLS_FIELD_MODULUS,
  BLS_G1_INFINITY_POINT_BYTES,
  BLS_G1_POINT_BYTE_LENGTH,
  BLS_G2_INFINITY_POINT_BYTES,
  BLS_G2_POINT_BYTE_LENGTH,
  BLS_ONE_BUFFER,
  BLS_ZERO_BUFFER,
} from './constants.js'

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
 * @param verifyOrder Perform the subgroup check (defaults to true)
 * @returns MCL G1 point
 */
function BLS12_381_ToG1Point(input: Uint8Array) {
  const x = bytesToBigInt(input.subarray(16, BLS_G1_POINT_BYTE_LENGTH / 2))
  const y = bytesToBigInt(input.subarray(80, BLS_G1_POINT_BYTE_LENGTH))

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
function BLS12_381_FromG1Point(input: AffinePoint<bigint>): Uint8Array {
  const xval = padToEven(bigIntToHex(input.x).slice(2))
  const yval = padToEven(bigIntToHex(input.y).slice(2))

  const xBytes = concatBytes(new Uint8Array(64 - xval.length / 2), unprefixedHexToBytes(xval))
  const yBytes = concatBytes(new Uint8Array(64 - yval.length / 2), unprefixedHexToBytes(yval))

  return concatBytes(xBytes, yBytes)
}

/**
 * Converts an Uint8Array to a MCL G2 point. Raises errors if the point is not on the curve
 * and (if activated) if the point is in the subgroup / order check.
 * @param input Input Uint8Array. Should be 256 bytes
 * @param mcl MCL instance
 * @param verifyOrder Perform the subgroup check (defaults to true)
 * @returns MCL G2 point
 */
function BLS12_381_ToG2Point(input: Uint8Array) {
  const p_x_1 = input.subarray(0, 64)
  const p_x_2 = input.subarray(64, BLS_G2_POINT_BYTE_LENGTH / 2)
  const p_y_1 = input.subarray(128, 192)
  const p_y_2 = input.subarray(192, BLS_G2_POINT_BYTE_LENGTH)

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

  const Fp2X = BLS12_381_ToFp2Point(p_x_1, p_x_2)
  const Fp2Y = BLS12_381_ToFp2Point(p_y_1, p_y_2)

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

// input: a mcl G1 point
// output: a 128-byte Uint8Array
function BLS12_381_FromG2Point(input: AffinePoint<Fp2>): Uint8Array {
  const x_1 = padToEven(bigIntToHex(input.x.c0).slice(2))
  const x_2 = padToEven(bigIntToHex(input.x.c1).slice(2))
  const y_1 = padToEven(bigIntToHex(input.y.c0).slice(2))
  const y_2 = padToEven(bigIntToHex(input.y.c1).slice(2))

  const xBytes1 = concatBytes(new Uint8Array(64 - x_1.length / 2), unprefixedHexToBytes(x_1))
  const xBytes2 = concatBytes(new Uint8Array(64 - x_2.length / 2), unprefixedHexToBytes(x_2))
  const yBytes1 = concatBytes(new Uint8Array(64 - y_1.length / 2), unprefixedHexToBytes(y_1))
  const yBytes2 = concatBytes(new Uint8Array(64 - y_2.length / 2), unprefixedHexToBytes(y_2))

  return concatBytes(xBytes1, xBytes2, yBytes1, yBytes2)
}

// input: a 32-byte hex scalar Uint8Array
// output: a mcl Fr point

function BLS12_381_ToFrPoint(input: Uint8Array): bigint {
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

function BLS12_381_ToFpPoint(fpCoordinate: Uint8Array) {
  // check if point is in field
  if (bytesToBigInt(fpCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EvmError(ERROR.BLS_12_381_FP_NOT_IN_FIELD)
  }
  const FP = bls12_381.fields.Fp.fromBytes(fpCoordinate.slice(16))
  return FP
}

function BLS12_381_ToFp2Point(fpXCoordinate: Uint8Array, fpYCoordinate: Uint8Array) {
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
  addG1(input: Uint8Array): Uint8Array {
    const p1 = BLS12_381_ToG1Point(input.subarray(0, BLS_G1_POINT_BYTE_LENGTH))
    const p2 = BLS12_381_ToG1Point(
      input.subarray(BLS_G1_POINT_BYTE_LENGTH, BLS_G1_POINT_BYTE_LENGTH * 2)
    )

    const p = p1.add(p2)
    const result = BLS12_381_FromG1Point(p)

    return result
  }

  mulG1(input: Uint8Array): Uint8Array {
    // convert input to G1 points, add them, and convert the output to a Uint8Array.
    const p = BLS12_381_ToG1Point(input.subarray(0, BLS_G1_POINT_BYTE_LENGTH))
    const skalar = BLS12_381_ToFrPoint(input.subarray(BLS_G1_POINT_BYTE_LENGTH, 160))

    if (skalar === BIGINT_0) {
      return BLS_G1_INFINITY_POINT_BYTES
    }
    const result = p.multiply(skalar)
    return BLS12_381_FromG1Point(result)
  }

  addG2(input: Uint8Array): Uint8Array {
    const p1 = BLS12_381_ToG2Point(input.subarray(0, BLS_G2_POINT_BYTE_LENGTH))
    const p2 = BLS12_381_ToG2Point(
      input.subarray(BLS_G2_POINT_BYTE_LENGTH, BLS_G2_POINT_BYTE_LENGTH * 2)
    )
    const p = p1.add(p2)
    const result = BLS12_381_FromG2Point(p)

    return result
  }

  mulG2(input: Uint8Array): Uint8Array {
    // convert input to G2 point/Fr point, add them, and convert the output to a Uint8Array.
    const p = BLS12_381_ToG2Point(input.subarray(0, BLS_G2_POINT_BYTE_LENGTH))
    const skalar = BLS12_381_ToFrPoint(input.subarray(BLS_G2_POINT_BYTE_LENGTH, 288))

    if (skalar === BIGINT_0) {
      return BLS_G2_INFINITY_POINT_BYTES
    }
    const result = p.multiply(skalar)
    return BLS12_381_FromG2Point(result)
  }

  mapFPtoG1(input: Uint8Array): Uint8Array {
    // convert input to Fp1 point
    const FP = BLS12_381_ToFpPoint(input.subarray(0, 64))
    const result = bls12_381.G1.mapToCurve([FP]).toAffine()
    const resultBytes = BLS12_381_FromG1Point(result)
    return resultBytes
  }

  mapFP2toG2(input: Uint8Array): Uint8Array {
    // convert input to Fp2 point
    const Fp2Point = BLS12_381_ToFp2Point(input.subarray(0, 64), input.subarray(64, 128))
    const result = bls12_381.G2.mapToCurve([Fp2Point.c0, Fp2Point.c1]).toAffine()
    const resultBytes = BLS12_381_FromG2Point(result)
    return resultBytes
  }

  msmG1(input: Uint8Array): Uint8Array {
    // Note: This implementation is using the naive "algorithm" of just doing
    // p1G1*v1F1 + p2G1*v1F1 + ... while the EIP is suggesting to use an optimized
    // algorithm (Pippenger's algorithm, see https://eips.ethereum.org/EIPS/eip-2537#g1g2-msm).
    //
    // While this functionally works the approach is not "gas-cost-competitive" and an
    // optimization should be considered in the future.
    const pairLength = 160
    const numPairs = input.length / pairLength

    let pRes = bls12_381.G1.ProjectivePoint.ZERO
    for (let k = 0; k < numPairs; k++) {
      const pairStart = pairLength * k
      const G1 = BLS12_381_ToG1Point(
        input.subarray(pairStart, pairStart + BLS_G1_POINT_BYTE_LENGTH)
      )
      const Fr = BLS12_381_ToFrPoint(
        input.subarray(pairStart + BLS_G1_POINT_BYTE_LENGTH, pairStart + pairLength)
      )
      let pMul
      if (Fr === BIGINT_0) {
        pMul = bls12_381.G1.ProjectivePoint.ZERO
      } else {
        pMul = G1.multiply(Fr)
      }

      pRes = pRes.add(pMul)
    }

    return BLS12_381_FromG1Point(pRes)
  }

  msmG2(input: Uint8Array): Uint8Array {
    // Note: This implementation is using the naive "algorithm" of just doing
    // p1G1*v1F1 + p2G1*v1F1 + ... while the EIP is suggesting to use an optimized
    // algorithm (Pippenger's algorithm, see https://eips.ethereum.org/EIPS/eip-2537#g1g2-msm).
    //
    // While this functionally works the approach is not "gas-cost-competitive" and an
    // optimization should be considered in the future.
    const pairLength = 288
    const numPairs = input.length / pairLength

    let pRes = bls12_381.G2.ProjectivePoint.ZERO
    for (let k = 0; k < numPairs; k++) {
      const pairStart = pairLength * k
      const G2 = BLS12_381_ToG2Point(
        input.subarray(pairStart, pairStart + BLS_G2_POINT_BYTE_LENGTH)
      )
      const Fr = BLS12_381_ToFrPoint(
        input.subarray(pairStart + BLS_G2_POINT_BYTE_LENGTH, pairStart + pairLength)
      )
      let pMul
      if (Fr === BIGINT_0) {
        pMul = bls12_381.G2.ProjectivePoint.ZERO
      } else {
        pMul = G2.multiply(Fr)
      }

      pRes = pRes.add(pMul)
    }

    return BLS12_381_FromG2Point(pRes)
  }

  pairingCheck(input: Uint8Array): Uint8Array {
    const pairLength = 384
    const pairs = []
    for (let k = 0; k < input.length / pairLength; k++) {
      const pairStart = pairLength * k
      const G1 = BLS12_381_ToG1Point(
        input.subarray(pairStart, pairStart + BLS_G1_POINT_BYTE_LENGTH)
      )

      const g2start = pairStart + BLS_G1_POINT_BYTE_LENGTH
      const G2 = BLS12_381_ToG2Point(input.subarray(g2start, g2start + BLS_G2_POINT_BYTE_LENGTH))

      // EIP: "If any input is the infinity point, pairing result will be 1"
      if (G1 === bls12_381.G1.ProjectivePoint.ZERO || G2 === bls12_381.G2.ProjectivePoint.ZERO) {
        return BLS_ONE_BUFFER
      }

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
      return BLS_ONE_BUFFER
    } else {
      return BLS_ZERO_BUFFER
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
