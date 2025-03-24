import { randomBytes } from 'crypto'
import { bigIntToBytes, bytesToBigInt } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { FieldContext } from '../../src/index.js'

function padBigIntBytes(val: bigint, byteLen: number): Uint8Array {
  const raw = bigIntToBytes(val)
  if (raw.length === byteLen) return raw
  const out = new Uint8Array(byteLen)
  out.set(raw, byteLen - raw.length)
  return out
}

function randomBigInt(size: number, limit: bigint): bigint {
  return bytesToBigInt(randomBytes(size)) % limit
}

function randomBinaryModulus(size: number): bigint {
  return 1n << BigInt(size * 8)
}

export function randomOddModulus(size: number): bigint {
  let num
  let bytes
  while (true) {
    bytes = randomBytes(size)
    num = bytesToBigInt(bytes)
    if (bytes[bytes.length - 1] % 2 !== 0) return num
  }
}

function testModulus(mod: bigint) {
  const modBytes = bigIntToBytes(mod)
  const fieldCtx = new FieldContext(modBytes, 256n)

  const xInt = randomBigInt(modBytes.length, mod)
  const yInt = randomBigInt(modBytes.length, mod)

  // convert operands to padded bytes for storing
  const elemByteLen = Number(fieldCtx.elemSize)
  const xBytes = padBigIntBytes(xInt, elemByteLen * 8)
  const yBytes = padBigIntBytes(yInt, elemByteLen * 8)
  const outBytes = new Uint8Array(elemByteLen * 8)

  fieldCtx.store(1, 1, xBytes)
  fieldCtx.store(2, 1, yBytes)

  fieldCtx.addM(0, 1, 1, 1, 2, 1, 1)
  fieldCtx.load(outBytes, 0, 1)
  const expectedAdd = (xInt + yInt) % mod
  const actualAdd = bytesToBigInt(outBytes)
  assert.deepEqual(actualAdd, expectedAdd)

  fieldCtx.subM(0, 1, 1, 1, 2, 1, 1)
  fieldCtx.load(outBytes, 0, 1)
  let expectedSub = (xInt - yInt) % mod
  if (expectedSub < 0n) expectedSub += mod
  const actualSub = bytesToBigInt(outBytes)
  assert.deepEqual(actualSub, expectedSub)

  fieldCtx.mulM(0, 1, 1, 1, 2, 1, 1)
  fieldCtx.load(outBytes, 0, 1)
  const expectedMul = (xInt * yInt) % mod
  const actualMul = bytesToBigInt(outBytes)
  assert.deepEqual(actualMul, expectedMul)
}

describe('FieldContext modular arithmetic', () => {
  for (let i = 1; i < 96; i++) {
    it(`should do add, sub, mul under a random modulus of size ${i} bytes`, () => {
      const binaryMod = randomBinaryModulus(i)
      testModulus(binaryMod)

      const oddMod = randomOddModulus(i)
      testModulus(oddMod)
    })
  }
})
