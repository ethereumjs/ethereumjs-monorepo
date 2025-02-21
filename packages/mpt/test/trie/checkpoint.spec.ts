import {
  MapDB,
  bytesToHex,
  bytesToUtf8,
  equalsBytes,
  hexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { sha256 } from 'ethereum-cryptography/sha256.js'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie, ROOT_DB_KEY, createMPT } from '../../src/index.js'

describe('testing checkpoints', () => {
  let trie: MerklePatriciaTrie
  let trieCopy: MerklePatriciaTrie
  let preRoot: string
  let postRoot: string

  it('setup', async () => {
    trie = new MerklePatriciaTrie()
    await trie.put(utf8ToBytes('do'), utf8ToBytes('verb'))
    await trie.put(utf8ToBytes('doge'), utf8ToBytes('coin'))
    preRoot = bytesToHex(trie.root())
  })

  it('should copy trie and get value added to original trie', async () => {
    trieCopy = trie.shallowCopy()
    assert.equal(bytesToHex(trieCopy.root()), preRoot)
    const res = await trieCopy.get(utf8ToBytes('do'))
    assert.ok(equalsBytes(utf8ToBytes('verb'), res!))
  })

  it('should deactivate cache on copy()', async () => {
    const trie = new MerklePatriciaTrie({ cacheSize: 100 })
    trieCopy = trie.shallowCopy()
    assert.equal((trieCopy as any)._opts.cacheSize, 0)
  })

  it('should create a checkpoint', () => {
    trie.checkpoint()
    assert.ok(trie.hasCheckpoints())
  })

  it('should save to the cache', async () => {
    await trie.put(utf8ToBytes('test'), utf8ToBytes('something'))
    await trie.put(utf8ToBytes('love'), utf8ToBytes('emotion'))
    postRoot = bytesToHex(trie.root())
  })

  it('should copy trie and get upstream and cache values after checkpoint', async () => {
    trieCopy = trie.shallowCopy()
    assert.equal(bytesToHex(trieCopy.root()), postRoot)
    assert.equal(trieCopy['_db'].checkpoints.length, 1)
    assert.ok(trieCopy.hasCheckpoints())
    const res = await trieCopy.get(utf8ToBytes('do'))
    assert.ok(equalsBytes(utf8ToBytes('verb'), res!))
    const res2 = await trieCopy.get(utf8ToBytes('love'))
    assert.ok(equalsBytes(utf8ToBytes('emotion'), res2!))
  })

  it('should copy trie and use the correct hash function', async () => {
    const trie = new MerklePatriciaTrie({
      db: new MapDB(),
      useKeyHashing: true,
      useKeyHashingFunction: sha256,
    })

    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    trie.checkpoint()
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('value2'))
    const trieCopy = trie.shallowCopy()
    const value = await trieCopy.get(utf8ToBytes('key1'))
    assert.equal(bytesToUtf8(value!), 'value1')
  })

  /*
    In this educational example, it is shown how operations on a clone of a trie
    can be copied into the original trie. This also includes pruning.
    A practical use-case of this could be to take two clones of a trie
    and apply different operations on it. Based on the outcome, pick one.
    If this "checkpoint copy trick" (see test for this "trick") is not used,
    one has to keep track of what key/values are changed and then re-apply these
    on the trie again. However, by copying the checkpoint, one can immediately
    update the original trie (have to manually copy the root after applying the checkpoint, too).
    This test also implicitly checks that on copying a MerklePatriciaTrie, the checkpoints are deep-copied.
    If it would not deep copy, then some checks in this test will fail.
    See PR 2203 and 2236.
  */
  it('Checkpointing: nested checkpoints -> with pruning, verify that checkpoints are deep-copied', async () => {
    const KEY = utf8ToBytes('last_block_height')
    const KEY_ROOT = keccak256(ROOT_DB_KEY)

    // Initialize State
    const CommittedState = await createMPT({
      useKeyHashing: true,
      useNodePruning: true,
      useRootPersistence: true,
    })

    // Put some initial data
    await CommittedState.put(KEY, utf8ToBytes('1'))

    // Take a checkpoint to enable nested checkpoints
    // From this point, CommittedState will not write on disk
    CommittedState.checkpoint()

    // Copy CommittedState
    const MemoryState = CommittedState.shallowCopy()
    MemoryState.checkpoint()

    // Test changes on MemoryState
    await MemoryState.put(KEY, utf8ToBytes('2'))
    await MemoryState.commit()

    // The CommittedState should not change (not the key/value pairs, not the root, and not the root in DB)
    assert.equal(bytesToUtf8((await CommittedState.get(KEY))!), '1')
    assert.equal(
      bytesToHex((await CommittedState['_db'].get(KEY_ROOT))!),
      '0x77ddd505d2a5b76a2a6ee34b827a0d35ca19f8d358bee3d74a84eab59794487c',
    )
    assert.equal(
      bytesToHex(CommittedState.root()),
      '0x77ddd505d2a5b76a2a6ee34b827a0d35ca19f8d358bee3d74a84eab59794487c',
    )

    // From MemoryState, now take the final checkpoint
    const finalCheckpoint = MemoryState['_db'].checkpoints[0]
    // Insert this into CommittedState
    CommittedState['_db'].checkpoints.push(finalCheckpoint)

    // Now all operations done on MemoryState (including pruning) can be
    // committed into CommittedState
    await CommittedState.commit()
    // Flush items to disk
    await CommittedState.commit()
    // Update the root (this information is not fed via the checkpoint, have to do this manually)
    CommittedState.root(MemoryState.root())
    // Setting the root does not automatically persist the root, so persist it
    await CommittedState.persistRoot()

    // Make sure CommittedState looks like we expect (2 keys, last_block_height=2 + __root__)
    // I.e. the trie is pruned.
    assert.deepEqual(
      // @ts-expect-error
      [...CommittedState._db.db._database.values()].map((value) => value),
      [
        hexToBytes('0xd7eba6ee0f011acb031b79554d57001c42fbfabb150eb9fdd3b6d434f7b791eb'),
        hexToBytes('0xe3a1202418cf7414b1e6c2c8d92b4673eecdb4aac88f7f58623e3be903aefb2fd4655c32'),
      ],
    )
    // Verify that the key is updated
    assert.equal(bytesToUtf8((await CommittedState.get(KEY))!), '2')
  })
})
