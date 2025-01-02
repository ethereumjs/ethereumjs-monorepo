import { bigIntToBytes, bytesToBigInt } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import { assert, describe, it } from 'vitest'

import { FieldContext } from '../../src/index.js'

/**
 * Helper: produce a random bigint < `mod`.
 */
function randomBigIntBelow(mod: bigint, size: number): bigint {
  while (true) {
    const buf = randomBytes(size)
    let val = bytesToBigInt(buf)
    val = val % mod

    return val
  }
}

function padBigIntBytes(val: bigint, byteLen: number): Uint8Array {
  const raw = bigIntToBytes(val)
  if (raw.length === byteLen) return raw
  const out = new Uint8Array(byteLen)
  out.set(raw, byteLen - raw.length)
  return out
}

describe('FieldContext (simplified tests)', () => {
  it('should do basic add, sub, mul under a random odd modulus', () => {
    // const mod = 2n ** 113n
    const mod = 256n
    const modBytes = bigIntToBytes(mod)
    const fieldCtx = new FieldContext(modBytes, 10n)

    for (let i = 0; i < 5; i++) {
      // generate x, y < mod
      const xInt = randomBigIntBelow(mod, 16)
      const yInt = randomBigIntBelow(mod, 16)

      // convert to padded bytes for storing
      const elemByteLen = Number(fieldCtx.elemSize)
      const xBytes = padBigIntBytes(xInt, elemByteLen)
      const yBytes = padBigIntBytes(yInt, elemByteLen)

      fieldCtx.store(1, 1, xBytes)
      fieldCtx.store(2, 1, yBytes)

      fieldCtx.addM(0, 1, 1, 1, 2, 1, 1)
      const expectedAdd = (xInt + yInt) % mod
      const outBytesAdd = new Uint8Array(elemByteLen)
      fieldCtx.Load(outBytesAdd, 0, 1)
      const gotAdd = bytesToBigInt(outBytesAdd)
      assert.isTrue(gotAdd === expectedAdd)

      fieldCtx.subM(0, 1, 1, 1, 2, 1, 1)
      let diff = xInt - yInt
      diff = diff % mod
      if (diff < 0n) diff += mod
      const outBytesSub = new Uint8Array(elemByteLen)
      fieldCtx.Load(outBytesSub, 0, 1)
      const gotSub = bytesToBigInt(outBytesSub)
      assert.isTrue(gotSub === diff)

      fieldCtx.mulM(0, 1, 1, 1, 2, 1, 1)
      const mul = (xInt * yInt) % mod
      const outBytesMul = new Uint8Array(elemByteLen)
      fieldCtx.Load(outBytesMul, 0, 1)
      const gotMul = bytesToBigInt(outBytesMul)
      assert.isTrue(gotMul === mul)
    }
  })
})
