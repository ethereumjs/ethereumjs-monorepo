import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie } from '../../src/index.js'

// exhaustive testing of checkpoint, revert, flush, and commit functionality of trie, inspired by
// the statemanager checkpointing.*.spec.ts tests
describe('trie: checkpointing', () => {
  // Sample key-value pairs using Uint8Array
  const key = hexToBytes('0x11')
  const value1 = hexToBytes('0xaa')
  const value2 = hexToBytes('0xbb')
  const value3 = hexToBytes('0xcc')
  const value4 = hexToBytes('0xdd')
  const value5 = hexToBytes('0xee')
  const valueUndefined = null

  const kvs = [
    {
      v1: value1,
      v2: value2,
      v3: value3,
      v4: value4,
      v5: value5,
    },
    {
      v1: valueUndefined,
      v2: value2,
      v3: value3,
      v4: value4,
      v5: value5,
    },
    {
      v1: valueUndefined,
      v2: value2,
      v3: valueUndefined,
      v4: value4,
      v5: value5,
    },
    {
      v1: valueUndefined,
      v2: value2,
      v3: value3,
      v4: valueUndefined,
      v5: value5,
    },
    {
      v1: value1,
      v2: valueUndefined,
      v3: value3,
      v4: valueUndefined,
      v5: value5,
    },
    {
      v1: value1,
      v2: valueUndefined,
      v3: value3,
      v4: value4,
      v5: valueUndefined,
    },
    {
      v1: value1,
      v2: value2,
      v3: valueUndefined,
      v4: value4,
      v5: valueUndefined,
    },
  ]

  const trieEval = async (trie: MerklePatriciaTrie, value: any) => {
    const actualValue = await trie.get(key)
    const pass = actualValue === null ? value === null : equalsBytes(actualValue, value)
    return pass
  }

  for (const kv of kvs) {
    it('No CP -> V1 -> Flush() (-> V1)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v1))
    })
    it('CP -> V1 -> Commit -> Flush() (-> V1)', async () => {
      const trie = new MerklePatriciaTrie()

      trie.checkpoint()
      await trie.put(key, kv.v1)
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v1))
    })

    it('CP -> V1 -> Revert -> Flush() (-> Undefined)', async () => {
      const trie = new MerklePatriciaTrie()

      trie.checkpoint()
      await trie.put(key, kv.v1)
      await trie.revert()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, null))
    })

    it('V1 -> CP -> Commit -> Flush() (-> V1)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v1))
    })

    it('V1 -> CP -> Revert -> Flush() (-> V1)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.revert()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v1))
    })

    it('V1 -> CP -> V2 -> Commit -> Flush() (-> V2)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v2))
    })

    it('V1 -> CP -> V2 -> Commit -> V3 -> Flush() (-> V3)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      await trie.commit()
      await trie.put(key, kv.v3)
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v3))
    })

    it('V1 -> CP -> V2 -> V3 -> Commit -> Flush() (-> V3)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      await trie.put(key, kv.v3)
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v3))
    })

    it('CP -> V1 -> V2 -> Commit -> Flush() (-> V2)', async () => {
      const trie = new MerklePatriciaTrie()

      trie.checkpoint()
      await trie.put(key, kv.v1)
      await trie.put(key, kv.v2)
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v2))
    })

    it('CP -> V1 -> V2 -> Revert -> Flush() (-> Undefined)', async () => {
      const trie = new MerklePatriciaTrie()

      trie.checkpoint()
      await trie.put(key, kv.v1)

      await trie.put(key, kv.v2)
      await trie.revert()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, null))
    })

    it('V1 -> CP -> V2 -> Revert -> Flush() (-> V1)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      await trie.revert()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v1))
    })

    it('V1 -> CP -> V2 -> CP -> V3 -> Commit -> Commit -> Flush() (-> V3)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      trie.checkpoint()
      await trie.put(key, kv.v3)
      await trie.commit()
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v3))
    })

    it('V1 -> CP -> V2 -> CP -> V3 -> Commit -> Revert -> Flush() (-> V1)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      trie.checkpoint()
      await trie.put(key, kv.v3)
      await trie.commit()
      await trie.revert()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v1))
    })

    it('V1 -> CP -> V2 -> CP -> V3 -> Revert -> Commit -> Flush() (-> V2)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      trie.checkpoint()
      await trie.put(key, kv.v3)
      await trie.revert()
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v2))
    })

    it('V1 -> CP -> V2 -> CP -> V3 -> Revert -> V4 -> Commit -> Flush() (-> V4)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      trie.checkpoint()
      await trie.put(key, kv.v3)
      await trie.revert()
      await trie.put(key, kv.v4)
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v4))
    })

    it('V1 -> CP -> V2 -> CP -> V3 -> Revert -> V4 -> CP -> V5 -> Commit -> Commit -> Flush() (-> V5)', async () => {
      const trie = new MerklePatriciaTrie()

      await trie.put(key, kv.v1)
      trie.checkpoint()
      await trie.put(key, kv.v2)
      trie.checkpoint()
      await trie.put(key, kv.v3)
      await trie.revert()
      await trie.put(key, kv.v4)
      trie.checkpoint()
      await trie.put(key, kv.v5)
      await trie.commit()
      await trie.commit()
      trie.flushCheckpoints()

      assert.ok(await trieEval(trie, kv.v5))
    })
  }
})
