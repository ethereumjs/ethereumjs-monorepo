import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { Trie } from '../../src/trie.js'

const trie_entries: [string, string | null][] = [
  ['do', 'verb'],
  ['ether', 'wookiedoo'],
  ['doge', 'coin'],
  ['ether', null],
  ['dog', 'puppy'],
]
const trie = new Trie({
  useNodePruning: true,
})
trie['DEBUG'] = true
for (const [key, value] of trie_entries) {
  await trie.put(utf8ToBytes(key), value === null ? Uint8Array.from([]) : utf8ToBytes(value))
}

const proof = await trie.createProof(utf8ToBytes('doge'))
const valid = await trie.verifyProof(trie.root(), utf8ToBytes('doge'), proof)

describe('Run Trie script with DEBUG enabled', async () => {
  it('should be valid', async () => {
    assert.deepEqual(valid, utf8ToBytes('coin'))
  })

  trie.checkpoint()
  await trie.commit()
  trie.flushCheckpoints()
})
