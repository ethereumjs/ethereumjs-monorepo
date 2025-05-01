import { type PrefixedHexString, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVerkleTree } from '../src/index.ts'
import { dumpLeafValues, dumpNodeHashes } from '../src/util.ts'

// Values taken from verkle fixtures
const values: PrefixedHexString[][] = [
  [
    '0x0365b079a274a1808d56484ce5bd97914629907d75767f51439102e22cd50d00',
    '0x00000000000000000000000000000001000000000000003635c9adc5de9ccbaa',
  ],
  [
    '0x0365b079a274a1808d56484ce5bd97914629907d75767f51439102e22cd50d01',
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  ],
  [
    '0x5b5fdfedd6a0e932da408ac7d772a36513d1eee9b9926e52620c43a433aad700',
    '0x0000000000000036000000000000000100000000000000000000000000000000',
  ],
  [
    '0x5b5fdfedd6a0e932da408ac7d772a36513d1eee9b9926e52620c43a433aad701',
    '0xdf61faef43babbb1ebde8fd82ab9cb4cb74c240d0025138521477e073f72080a',
  ],
  [
    '0x5b5fdfedd6a0e932da408ac7d772a36513d1eee9b9926e52620c43a433aad740',
    '0x00b2e892fbf04dcdbb33d71633d7cea0722aed27f8a9d0cf9912f97b34f9dadd',
  ],
  [
    '0x5b5fdfedd6a0e932da408ac7d772a36513d1eee9b9926e52620c43a433aad780',
    '0x0060203611603157600143035f35116029575f35612000014311602957612000',
  ],
  [
    '0x5b5fdfedd6a0e932da408ac7d772a36513d1eee9b9926e52620c43a433aad781',
    '0x005f3506545f5260205ff35b5f5f5260205ff35b5f5ffd000000000000000000',
  ],
  [
    '0x914ec5f0e0c27fe094862fbd89a6abe684939af6940434d8bf218cedb2d62400',
    '0x000000000000000000000000000000000000000000000000000000000000f618',
  ],
  [
    '0x914ec5f0e0c27fe094862fbd89a6abe684939af6940434d8bf218cedb2d62401',
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  ],
  [
    '0xecb505156708480caf702cd85124f67f3ed78ae4bc890a6dcb62574ba9a90c00',
    '0x0000000000000000000000000000000000000000000000000000000000000006',
  ],
  [
    '0xecb505156708480caf702cd85124f67f3ed78ae4bc890a6dcb62574ba9a90c01',
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  ],
]
describe('dump leaf values', () => {
  it('should produce a correct state root', async () => {
    const trie = await createVerkleTree()
    for (const [key, val] of values) {
      const treeKey = hexToBytes(key)
      const value = hexToBytes(val)
      await trie.put(treeKey.slice(0, 31), [treeKey[31]], [value])
    }
    assert.strictEqual(
      bytesToHex(trie.root()),
      '0x3a36cd08db733a2c1ef113142c754bd88bfea541cb56361ed1825d5883378e71',
    )
    const entries = await dumpLeafValues(trie, trie.root())
    assert.deepEqual(entries, values)
  }, 10000)
})

describe('dump node hashes', () => {
  it('should only contain the root node for an empty tree', async () => {
    const trie = await createVerkleTree()
    const entries = await dumpNodeHashes(trie, trie.root())
    assert.deepEqual(entries, [['0x', bytesToHex(trie.root())]])
  })
  it('should contain the paths and hashes of all nodes in the tree', async () => {
    const trie = await createVerkleTree()
    for (const [key, val] of values) {
      const treeKey = hexToBytes(key)
      const value = hexToBytes(val)
      await trie.put(treeKey.slice(0, 31), [treeKey[31]], [value])
    }
    const entries = await dumpNodeHashes(trie, trie.root())
    assert.strictEqual(entries?.length, 5)
    for (const entry of entries!.slice(1)) {
      assert.strictEqual(entry[0].length, 64)
    }
  })
})
