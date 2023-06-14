import { bytesToHex, hexStringToBytes, toBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Trie } from '../src/index.js'

const trie = new Trie()
const trie2 = new Trie()
const hex = 'FF44A3B3'

describe('encoding hex prefixes', () => {
  it('should work', async () => {
    await trie.put(hexStringToBytes(hex), utf8ToBytes('test'))
    await trie2.put(toBytes(`0x${hex}`), utf8ToBytes('test'))
    assert.equal(bytesToHex(trie.root()), bytesToHex(trie2.root()))
  })
})
