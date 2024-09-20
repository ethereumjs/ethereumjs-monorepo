import { MapDB, bytesToHex } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.js'

import type { LeafNode } from '../src/index.js'
import type { VerkleCrypto } from '@ethereumjs/util'

describe('rust-verkle test vectors', () => {
  let verkleCrypto: VerkleCrypto
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
    const node = await trie.findPath(rustKey.slice(0, 31))
    console.log(bytesToHex(verkleCrypto.hashCommitment((node.node as LeafNode)!.c1)))
    console.log(bytesToHex(verkleCrypto.hashCommitment((node.node as LeafNode)!.c2)))
    assert.equal(
      bytesToHex(trie.root()),
      '0x029b6c4c8af9001f0ac76472766c6579f41eec84a73898da06eb97ebdab80a09',
    )
  })
})
