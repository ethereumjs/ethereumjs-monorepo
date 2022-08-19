import { toBuffer } from '@ethereumjs/util'
import * as tape from 'tape'

import { CheckpointTrie, MapDB } from '../src'

const trie = new CheckpointTrie({ db: new MapDB() })
const trie2 = new CheckpointTrie({ db: new MapDB() })
const hex = 'FF44A3B3'

tape('encoding hex prefixes', async function (t) {
  await trie.put(Buffer.from(hex, 'hex'), Buffer.from('test'))
  await trie2.put(toBuffer(`0x${hex}`), Buffer.from('test'))
  t.equal(trie.root.toString('hex'), trie2.root.toString('hex'))
  t.end()
})
