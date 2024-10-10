import { utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createMPTFromProof, createMerkleProof, verifyMPTWithMerkleProof } from '../../src/index.js'
import { MerklePatriciaTrie } from '../../src/mpt.js'

describe('Run MerklePatriciaTrie script with DEBUG enabled', async () => {
  const trie_entries: [string, string | null][] = [
    ['do', 'verb'],
    ['ether', 'wookiedoo'], // cspell:disable-line
    ['doge', 'coin'],
    ['ether', null],
    ['dog', 'puppy'],
  ]
  process.env.DEBUG = 'ethjs'
  const trie = new MerklePatriciaTrie({
    useRootPersistence: true,
  })
  for (const [key, value] of trie_entries) {
    await trie.put(utf8ToBytes(key), value === null ? Uint8Array.from([]) : utf8ToBytes(value))
  }

  const proof = await createMerkleProof(trie, utf8ToBytes('doge'))
  const valid = await verifyMPTWithMerkleProof(trie, trie.root(), utf8ToBytes('doge'), proof)

  it('should be valid', async () => {
    assert.deepEqual(valid, utf8ToBytes('coin'))
  })

  trie.checkpoint()
  await trie.commit()
  trie.flushCheckpoints()
  trie.checkpoint()
  await trie.revert()
  process.env.DEBUG = ''
  const trie2 = await createMPTFromProof(proof)
  trie2['DEBUG'] = true
  it('tries should share root', async () => {
    assert.deepEqual(trie.root(), trie2.root())
  })
})
