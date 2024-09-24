import { MapDB, bytesToHex, setLengthRight } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.js'

import type { LeafNode } from '../src/index.js'

describe('rust-verkle test vectors', () => {
  let verkleCrypto: Awaited<ReturnType<typeof loadVerkleCrypto>>
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('should produce the correct commitment', async () => {
    const rustKey = Uint8Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32,
    ])
    const trie = await createVerkleTree({ verkleCrypto, db: new MapDB() })
    await trie.put(rustKey.slice(0, 31), [rustKey[31]], [rustKey])

    assert.equal(
      bytesToHex(trie.root()),
      '0x029b6c4c8af9001f0ac76472766c6579f41eec84a73898da06eb97ebdab80a09',
    )

    // const values = new Array<Uint8Array>(256).fill(new Uint8Array(32))
    // const valLow = setLengthRight(rustKey.slice(0, 16), 32)
    // valLow[16] = 1
    // const valHigh = setLengthRight(rustKey.slice(16), 32)
    // const c = verkleCrypto.zeroCommitment
    // const c1 = verkleCrypto.updateCommitment(c, 64, new Uint8Array(32), valLow)
    // const c2 = verkleCrypto.updateCommitment(c1, 65, new Uint8Array(32), valHigh)

    // values[64] = valLow
    // values[65] = valHigh
    // // console.log(bytesToHex(verkleCrypto.hashCommitment(verkleCrypto.commitToScalars(values))))
    // // console.log(bytesToHex(verkleCrypto.hashCommitment(c2)))
  })
})
