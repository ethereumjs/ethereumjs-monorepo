import * as tape from 'tape'
import { CheckpointTrie } from '../dist'

const trie = new CheckpointTrie()
const trie2 = new CheckpointTrie()
const hex = 'FF44A3B3'

tape('encoding hexprefixes', async function (t) {
  await trie.put(Buffer.from(hex, 'hex'), Buffer.from('test'))
  await trie2.put(Buffer.from(`0x${hex}`), Buffer.from('test'))
  t.equal(trie.root.toString('hex'), trie2.root.toString('hex'))
  t.end()
})
