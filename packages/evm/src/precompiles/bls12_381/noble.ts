import {
  BIGINT_0,
  bigIntToBytes,
  bytesToBigInt,
  concatBytes,
  equalsBytes,
  setLengthLeft,
} from '@ethereumjs/util'
// cspell:ignore pippenger
import { pippenger as largeMSM, mulAddUnsafe } from '@noble/curves/abstract/curve.js'
import { bls12_381 } from '@noble/curves/bls12-381.js'

import { EVMError } from '../../errors.ts'

import {
  BLS_FIELD_MODULUS,
  BLS_G1_INFINITY_POINT_BYTES,
  BLS_G1_POINT_BYTE_LENGTH,
  BLS_G2_INFINITY_POINT_BYTES,
  BLS_G2_POINT_BYTE_LENGTH,
  BLS_ONE_BUFFER,
  BLS_ZERO_BUFFER,
} from './constants.ts'

import type { Fp2 } from '@noble/curves/abstract/tower.js'
import type { AffinePoint } from '@noble/curves/abstract/weierstrass.js'
import type { EVMBLSInterface } from '../../types.ts'

const G1_ZERO = bls12_381.G1.Point.ZERO

const G2_ZERO = bls12_381.G2.Point.ZERO

function BLS12_381_ToFp2Point(fpXCoordinate: Uint8Array, fpYCoordinate: Uint8Array) {
  // check if the coordinates are in the field
  if (bytesToBigInt(fpXCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EVMError(EVMError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD)
  }
  if (bytesToBigInt(fpYCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EVMError(EVMError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD)
  }

  const fpBytes = concatBytes(fpXCoordinate.subarray(16), fpYCoordinate.subarray(16))

  const FP = bls12_381.fields.Fp2.fromBytes(fpBytes)
  return FP
}

/**
 * Decodes a 128-byte G1 point from precompile input.
 *
 * @param verifyOrder - When true, reject points outside the prime-order subgroup
 * @throws If the point is not on the BLS12-381 curve
 */
function BLS12_381_ToG1Point(input: Uint8Array, verifyOrder = true) {
  if (equalsBytes(input, BLS_G1_INFINITY_POINT_BYTES) === true) {
    return G1_ZERO
  }

  const x = bytesToBigInt(input.subarray(16, BLS_G1_POINT_BYTE_LENGTH / 2))
  const y = bytesToBigInt(input.subarray(80, BLS_G1_POINT_BYTE_LENGTH))

  const G1 = bls12_381.G1.Point.fromAffine({
    x,
    y,
  })

  try {
    G1.assertValidity()
  } catch (e) {
    if (verifyOrder || (e as Error).message !== 'bad point: not in prime-order subgroup')
      throw new EVMError(EVMError.errorMessages.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  return G1
}

// input: a Noble G1 point
// output: a 128-byte Uint8Array
function BLS12_381_FromG1Point(input: AffinePoint<bigint>): Uint8Array {
  const xBytes = setLengthLeft(bigIntToBytes(input.x), 64)
  const yBytes = setLengthLeft(bigIntToBytes(input.y), 64)

  return concatBytes(xBytes, yBytes)
}

/**
 * Decodes a 256-byte G2 point from precompile input.
 *
 * @param verifyOrder - When true, reject points outside the prime-order subgroup
 * @throws If the point is not on the BLS12-381 curve
 */
function BLS12_381_ToG2Point(input: Uint8Array, verifyOrder = true) {
  if (equalsBytes(input, BLS_G2_INFINITY_POINT_BYTES) === true) {
    return G2_ZERO
  }

  const p_x_1 = input.subarray(0, 64)
  const p_x_2 = input.subarray(64, BLS_G2_POINT_BYTE_LENGTH / 2)
  const p_y_1 = input.subarray(128, 192)
  const p_y_2 = input.subarray(192, BLS_G2_POINT_BYTE_LENGTH)

  const Fp2X = BLS12_381_ToFp2Point(p_x_1, p_x_2)
  const Fp2Y = BLS12_381_ToFp2Point(p_y_1, p_y_2)

  const pG2 = bls12_381.G2.Point.fromAffine({
    x: Fp2X,
    y: Fp2Y,
  })

  try {
    pG2.assertValidity()
  } catch (e) {
    if (verifyOrder || (e as Error).message !== 'bad point: not in prime-order subgroup')
      throw new EVMError(EVMError.errorMessages.BLS_12_381_POINT_NOT_ON_CURVE)
  }

  return pG2
}

// input: a Noble G1 point
// output: a 128-byte Uint8Array
function BLS12_381_FromG2Point(input: AffinePoint<Fp2>): Uint8Array {
  const xBytes1 = setLengthLeft(bigIntToBytes(input.x.c0), 64)
  const xBytes2 = setLengthLeft(bigIntToBytes(input.x.c1), 64)
  const yBytes1 = setLengthLeft(bigIntToBytes(input.y.c0), 64)
  const yBytes2 = setLengthLeft(bigIntToBytes(input.y.c1), 64)

  return concatBytes(xBytes1, xBytes2, yBytes1, yBytes2)
}

// input: a 32-byte hex scalar Uint8Array
// output: a Noble Fr point

function BLS12_381_ToFrPoint(input: Uint8Array): bigint {
  const Fr = bls12_381.fields.Fr.fromBytes(input)
  if (Fr >= bls12_381.fields.Fr.ORDER) {
    return bls12_381.fields.Fr.create(Fr % bls12_381.fields.Fr.ORDER)
  }
  return bls12_381.fields.Fr.create(Fr)
}

/**
 * Pair count where Pippenger's method beats interleaved multi-scalar multiplication.
 * Timed on G1 and G2: interleaved multiplication is faster through a few hundred
 * pairs, and Pippenger's method is faster from 512. A single pair stays a scalar
 * multiplication, which is faster than either multi-scalar method.
 */
const MSM_LARGE_MIN_PAIRS = 512

function multiScalarMultiply<P extends { multiplyUnsafe(scalar: bigint): P }>(
  zero: P,
  points: P[],
  scalars: bigint[],
  mulAdd: (points: P[], scalars: bigint[]) => P,
  largeMul: (points: P[], scalars: bigint[]) => P,
): P {
  const count = points.length
  if (count === 0) return zero
  if (count === 1) {
    return scalars[0] === BIGINT_0 ? zero : points[0].multiplyUnsafe(scalars[0])
  }
  if (count < MSM_LARGE_MIN_PAIRS) return mulAdd(points, scalars)
  return largeMul(points, scalars)
}

// input: a 64-byte buffer
// output: a Noble Fp point
function BLS12_381_ToFpPoint(fpCoordinate: Uint8Array) {
  // check if point is in field
  if (bytesToBigInt(fpCoordinate) >= BLS_FIELD_MODULUS) {
    throw new EVMError(EVMError.errorMessages.BLS_12_381_FP_NOT_IN_FIELD)
  }
  const FP = bls12_381.fields.Fp.fromBytes(fpCoordinate.slice(16))
  return FP
}

/**
 * Implementation of the `EVMBLSInterface` using the `ethereum-cryptography (`@noble/curves`)
 * JS library, see https://github.com/ethereum/js-ethereum-cryptography.
 *
 * This is the EVM default implementation.
 */
export class NobleBLS implements EVMBLSInterface {
  addG1(input: Uint8Array): Uint8Array {
    const p1 = BLS12_381_ToG1Point(input.subarray(0, BLS_G1_POINT_BYTE_LENGTH), false)
    const p2 = BLS12_381_ToG1Point(
      input.subarray(BLS_G1_POINT_BYTE_LENGTH, BLS_G1_POINT_BYTE_LENGTH * 2),
      false,
    )

    const p = p1.add(p2)
    const result = BLS12_381_FromG1Point(p.toAffine())

    return result
  }

  addG2(input: Uint8Array): Uint8Array {
    const p1 = BLS12_381_ToG2Point(input.subarray(0, BLS_G2_POINT_BYTE_LENGTH), false)
    const p2 = BLS12_381_ToG2Point(
      input.subarray(BLS_G2_POINT_BYTE_LENGTH, BLS_G2_POINT_BYTE_LENGTH * 2),
      false,
    )
    const p = p1.add(p2)
    const result = BLS12_381_FromG2Point(p.toAffine())

    return result
  }

  mapFPtoG1(input: Uint8Array): Uint8Array {
    // convert input to Fp1 point
    const FP = BLS12_381_ToFpPoint(input.subarray(0, 64))

    // @ts-expect-error - @noble/curves v2 type resolution mismatch
    const result = bls12_381.G1.mapToCurve(FP).toAffine()
    const resultBytes = BLS12_381_FromG1Point(result)
    return resultBytes
  }

  mapFP2toG2(input: Uint8Array): Uint8Array {
    // convert input to Fp2 point
    const Fp2Point = BLS12_381_ToFp2Point(input.subarray(0, 64), input.subarray(64, 128))

    // @ts-expect-error - @noble/curves v2 type resolution mismatch
    const result = bls12_381.G2.mapToCurve([Fp2Point.c0, Fp2Point.c1]).toAffine()
    const resultBytes = BLS12_381_FromG2Point(result)
    return resultBytes
  }

  msmG1(input: Uint8Array): Uint8Array {
    const pairLength = 160
    const numPairs = input.length / pairLength
    const points = []
    const scalars = []

    for (let k = 0; k < numPairs; k++) {
      const pairStart = pairLength * k
      points.push(
        BLS12_381_ToG1Point(input.subarray(pairStart, pairStart + BLS_G1_POINT_BYTE_LENGTH)),
      )
      scalars.push(
        BLS12_381_ToFrPoint(
          input.subarray(pairStart + BLS_G1_POINT_BYTE_LENGTH, pairStart + pairLength),
        ),
      )
    }

    const result = multiScalarMultiply(
      G1_ZERO,
      points,
      scalars,
      (curvePoints, curveScalars) => mulAddUnsafe(bls12_381.G1.Point, curvePoints, curveScalars),
      (curvePoints, curveScalars) => largeMSM(bls12_381.G1.Point, curvePoints, curveScalars),
    )
    return BLS12_381_FromG1Point(result.toAffine())
  }

  msmG2(input: Uint8Array): Uint8Array {
    const pairLength = 288
    const numPairs = input.length / pairLength
    const points = []
    const scalars = []

    for (let k = 0; k < numPairs; k++) {
      const pairStart = pairLength * k
      points.push(
        BLS12_381_ToG2Point(input.subarray(pairStart, pairStart + BLS_G2_POINT_BYTE_LENGTH)),
      )
      scalars.push(
        BLS12_381_ToFrPoint(
          input.subarray(pairStart + BLS_G2_POINT_BYTE_LENGTH, pairStart + pairLength),
        ),
      )
    }

    const result = multiScalarMultiply(
      G2_ZERO,
      points,
      scalars,
      (curvePoints, curveScalars) => mulAddUnsafe(bls12_381.G2.Point, curvePoints, curveScalars),
      (curvePoints, curveScalars) => largeMSM(bls12_381.G2.Point, curvePoints, curveScalars),
    )
    return BLS12_381_FromG2Point(result.toAffine())
  }

  pairingCheck(input: Uint8Array): Uint8Array {
    // Extract the pairs from the input
    const pairLength = 384
    const pairs = []
    for (let k = 0; k < input.length / pairLength; k++) {
      const pairStart = pairLength * k
      const G1 = BLS12_381_ToG1Point(
        input.subarray(pairStart, pairStart + BLS_G1_POINT_BYTE_LENGTH),
      )

      const g2start = pairStart + BLS_G1_POINT_BYTE_LENGTH
      const G2 = BLS12_381_ToG2Point(input.subarray(g2start, g2start + BLS_G2_POINT_BYTE_LENGTH))

      pairs.push({ g1: G1, g2: G2 })
    }

    // Filter out infinity pairs
    const filteredPairs = pairs.filter(
      (pair) => pair.g1.equals(G1_ZERO) === false && pair.g2.equals(G2_ZERO) === false,
    )

    const FP12 = bls12_381.pairingBatch(filteredPairs, true)

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
