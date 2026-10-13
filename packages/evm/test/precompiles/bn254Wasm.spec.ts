import { setLengthRight } from '@ethereumjs/util'
import { initRustBN } from 'rustbn-wasm'
import { assert, describe, it } from 'vitest'

import { NobleBN254, RustBN254 } from '../../src/precompiles/bn254/index.ts'

describe('BN254 WASM backend', () => {
  it('add and mul match noble', async () => {
    const noble = new NobleBN254()
    const rustbn = await initRustBN()
    const wasm = new RustBN254(rustbn)

    const addInput = setLengthRight(new Uint8Array(0), 128)
    assert.deepEqual(wasm.add(addInput), noble.add(addInput))

    const mulInput = setLengthRight(new Uint8Array(0), 128)
    assert.deepEqual(wasm.mul(mulInput), noble.mul(mulInput))
  })
})
