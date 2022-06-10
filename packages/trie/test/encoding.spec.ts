import tape from 'tape'
import { toBuffer } from '@ethereumjs/util'
import { CheckpointTrie } from '../src'
import { MemoryDB, LevelDB } from '../src/db'

for (const DB of [MemoryDB, LevelDB]) {
  const trie = new CheckpointTrie({ db: new DB() })
  const trie2 = new CheckpointTrie({ db: new DB() })
  const hex = 'FF44A3B3'

  tape('encoding hex prefixes', async function (t) {
    await trie.put(Buffer.from(hex, 'hex'), Buffer.from('test'))
    await trie2.put(toBuffer(`0x${hex}`), Buffer.from('test'))
    t.equal(trie.root.toString('hex'), trie2.root.toString('hex'))
    t.end()
  })
}
