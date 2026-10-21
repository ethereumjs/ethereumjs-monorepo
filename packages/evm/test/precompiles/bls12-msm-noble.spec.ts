import { bigIntToBytes, equalsBytes, setLengthLeft } from '@ethereumjs/util'
import { mulAddUnsafe } from '@noble/curves/abstract/curve.js'
import { bls12_381 } from '@noble/curves/bls12-381.js'
import { assert, describe, it } from 'vitest'

import {
  BLS12_381_FromG1Point,
  BLS12_381_FromG2Point,
  NobleBLS,
} from '../../src/precompiles/bls12_381/noble.ts'

const bls = new NobleBLS()

function scalarAt(index: number): bigint {
  return (1n << BigInt(index % 200)) + BigInt(index * 97 + 3)
}

function scalarBytes(scalar: bigint): Uint8Array {
  return setLengthLeft(bigIntToBytes(scalar), 32)
}

function encodePairs(pointBytes: Uint8Array[], scalars: bigint[], pointLength: number): Uint8Array {
  const out = new Uint8Array((pointLength + 32) * scalars.length)
  for (let i = 0; i < scalars.length; i++) {
    const offset = i * (pointLength + 32)
    out.set(pointBytes[i], offset)
    out.set(scalarBytes(scalars[i]), offset + pointLength)
  }
  return out
}

describe('[EVM/Precompile] Noble BLS12-381 MSM', () => {
  it('G1 matches scalar multiplication below the large-MSM cutoff and the other noble MSM above it', () => {
    const Point = bls12_381.G1.Point
    for (const count of [1, 8, 512]) {
      let point = Point.BASE
      const points = []
      const scalars = []
      for (let i = 0; i < count; i++) {
        points.push(i === 3 ? Point.ZERO : point)
        scalars.push(i === 5 ? 0n : scalarAt(i))
        point = point.add(Point.BASE)
      }

      const encodedPoints = points.map((p) => BLS12_381_FromG1Point(p.toAffine()))
      const got = bls.msmG1(encodePairs(encodedPoints, scalars, 128))

      let expectedPoint = Point.ZERO
      if (count < 512) {
        for (let i = 0; i < count; i++) {
          if (scalars[i] !== 0n)
            expectedPoint = expectedPoint.add(points[i].multiplyUnsafe(scalars[i]))
        }
      } else {
        expectedPoint = mulAddUnsafe(Point, points, scalars)
      }
      const expected = BLS12_381_FromG1Point(expectedPoint.toAffine())
      assert.ok(equalsBytes(got, expected), `G1 MSM mismatch at ${count} pairs`)
    }
  }, 20_000)

  it('G2 matches scalar multiplication below the large-MSM cutoff and the other noble MSM above it', () => {
    const Point = bls12_381.G2.Point
    for (const count of [1, 8, 512]) {
      let point = Point.BASE
      const points = []
      const scalars = []
      for (let i = 0; i < count; i++) {
        points.push(i === 3 ? Point.ZERO : point)
        scalars.push(i === 5 ? 0n : scalarAt(i))
        point = point.add(Point.BASE)
      }

      const encodedPoints = points.map((p) => BLS12_381_FromG2Point(p.toAffine()))
      const got = bls.msmG2(encodePairs(encodedPoints, scalars, 256))

      let expectedPoint = Point.ZERO
      if (count < 512) {
        for (let i = 0; i < count; i++) {
          if (scalars[i] !== 0n)
            expectedPoint = expectedPoint.add(points[i].multiplyUnsafe(scalars[i]))
        }
      } else {
        expectedPoint = mulAddUnsafe(Point, points, scalars)
      }
      const expected = BLS12_381_FromG2Point(expectedPoint.toAffine())
      assert.ok(equalsBytes(got, expected), `G2 MSM mismatch at ${count} pairs`)
    }
  }, 20_000)
})
