import { bytesToHex, hexStringToBytes, toBytes, utf8ToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Trie } from '../src'

const trie = new Trie()
const trie2 = new Trie()
const hex = 'FF44A3B3'

tape('encoding hex prefixes', async function (t) {
  await trie.put(hexStringToBytes(hex), utf8ToBytes('test'))
  await trie2.put(toBytes(`0x${hex}`), utf8ToBytes('test'))
  t.equal(bytesToHex(trie.root()), bytesToHex(trie2.root()))
  t.end()
})
