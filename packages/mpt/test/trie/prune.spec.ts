import { KECCAK256_RLP, equalsBytes, hexToBytes, randomBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie, createMPT, isRawMPTNode } from '../../src/index.ts'

import type { BranchMPTNode } from '../../src/index.ts'

describe('Pruned trie tests', () => {
  it('should default to not prune the trie', async () => {
    const trie = new MerklePatriciaTrie()
    const key = utf8ToBytes('test')
    await trie.put(key, utf8ToBytes('1'))
    await trie.put(key, utf8ToBytes('2'))
    await trie.put(key, utf8ToBytes('3'))
    await trie.put(key, utf8ToBytes('4'))
    await trie.put(key, utf8ToBytes('5'))
    await trie.put(key, utf8ToBytes('6'))

    assert.equal((<any>trie)._db.db._database.size, 6, 'DB size correct')
  })

  it('should prune simple trie', async () => {
    const trie = new MerklePatriciaTrie({ useNodePruning: true })
    const key = utf8ToBytes('test')
    await trie.put(key, utf8ToBytes('1'))
    await trie.put(key, utf8ToBytes('2'))
    await trie.put(key, utf8ToBytes('3'))
    await trie.put(key, utf8ToBytes('4'))
    await trie.put(key, utf8ToBytes('5'))
    await trie.put(key, utf8ToBytes('6'))

    assert.equal((<any>trie)._db.db._database.size, 1, 'DB size correct')
  })

  it('should prune simple trie', async () => {
    const trie = new MerklePatriciaTrie({ useNodePruning: true })
    const key = utf8ToBytes('test')
    await trie.put(key, utf8ToBytes('1'))
    assert.equal((<any>trie)._db.db._database.size, 1, 'DB size correct')

    await trie.del(key)
    assert.equal((<any>trie)._db.db._database.size, 0, 'DB size correct')

    await trie.put(key, utf8ToBytes('1'))
    assert.equal((<any>trie)._db.db._database.size, 1, 'DB size correct')
  })

  it('should prune trie with depth = 2', async () => {
    const trie = new MerklePatriciaTrie({ useNodePruning: true })
    // Create a MerklePatriciaTrie with
    const keys = ['01', '02', '0103', '0104', '0105']
    const values = ['00', '02', '03', '04', '05']

    for (let i = 0; i < keys.length; i++) {
      await trie.put(hexToBytes(`0x${keys[i]}`), hexToBytes(`0x${values[i]}`))
    }
  })

  it('should not prune if the same value is put twice', async () => {
    const trie = new MerklePatriciaTrie()
    const key = utf8ToBytes('01')
    const value = utf8ToBytes('02')

    await trie.put(key, value)
    await trie.put(key, value)
    const reported = await trie.get(key)
    assert.ok(equalsBytes(reported!, value), 'value matches expected value')
  })

  it('should not throw if a key is either non-existent or deleted twice', async () => {
    const trie = new MerklePatriciaTrie()
    const key = utf8ToBytes('01')
    const value = utf8ToBytes('02')

    // key does not exist (empty trie)
    await trie.del(key)

    const key2 = utf8ToBytes('AA')
    const value2 = utf8ToBytes('ee')
    await trie.put(key2, value2)
    // key does not exist (non-empty trie)
    await trie.del(key)

    await trie.put(key, value)
    await trie.del(key)
    await trie.del(key)
    const reported = await trie.get(key)
    assert.ok(reported === null, 'value is null')
    const reported2 = await trie.get(key2)
    assert.ok(equalsBytes(reported2!, value2), 'value matches expected value')
  })

  it('should prune when keys are updated or deleted', async () => {
    for (let testID = 0; testID < 1; testID++) {
      const trie = new MerklePatriciaTrie({ useNodePruning: true })
      const keys: Uint8Array[] = []
      for (let i = 0; i < 100; i++) {
        keys.push(randomBytes(32))
      }

      const values: string[] = []
      for (let i = 0; i < 1000; i++) {
        let val = Math.floor(Math.random() * 16384)
        while (values.includes(val.toString(16))) {
          val = Math.floor(Math.random() * 16384)
        }
        values.push(val.toString(16))
      }
      // Fill trie with items
      for (let i = 0; i < keys.length; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        const key = keys[idx]

        await trie.put(key, utf8ToBytes(values[i]))
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Randomly delete keys
      for (let i = 0; i < 20; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        await trie.del(keys[idx])
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Fill trie with items or randomly delete them
      for (let i = 0; i < keys.length; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        const key = keys[idx]
        if (Math.random() < 0.5) {
          await trie.put(key, utf8ToBytes(values[i]))
        } else {
          await trie.del(key)
        }
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Delete all keys
      for (let idx = 0; idx < 100; idx++) {
        await trie.del(keys[idx])
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')
      assert.ok(equalsBytes(trie.root(), KECCAK256_RLP), 'trie is empty')

      let dbKeys = 0
      for (const _dbkey of (<any>trie)._db.db._database.keys()) {
        dbKeys++
      }
      assert.ok(dbKeys === 0, 'db is empty')
    }
  })

  it('should successfully delete branch nodes that are <32 bytes length with node pruning', async () => {
    // This test case was added after issue #3333 uncovered a problem with pruning trie paths that reference
    // nodes with their unhashed values (occurs when nodes are less than <32 bytes).
    const trie = new MerklePatriciaTrie({
      useNodePruning: true,
    })

    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    const initialRoot = trie.root()

    await trie.put(utf8ToBytes('key2'), utf8ToBytes('value2'))

    // Because of the small values, the leaf nodes will be less than 32 bytes in length.
    // As per the MPT spec, they will therefore be referenced directly and not by their hash.
    // We should therefore expect two BranchMPTNode branches that reference these 2 leaf nodes directly, instead of by their hashes.
    // If a node is referenced directly, the item will be a RawNode (a Uint8Array[]). If it's referenced by its hash, it will be a Uint8Array
    const path = await trie.findPath(utf8ToBytes('key1'))
    const parentBranchMPTNode = path.stack[1] as BranchMPTNode
    // Hex ASCII value for for `1` is 31, and for `2` is 32. We should expect a branching out at indexes 1 an 2.
    assert.ok(isRawMPTNode(parentBranchMPTNode._branches[1]!), 'key1 node is not a rawNode')
    assert.ok(isRawMPTNode(parentBranchMPTNode._branches[2]!), 'key2 node is not a rawNode')

    assert.notOk(equalsBytes(trie.root(), initialRoot), 'Root should have changed')

    // Delete the branch node
    await trie.del(utf8ToBytes('key2'))

    assert.ok(equalsBytes(trie.root(), initialRoot), 'Root should be the same as the initial root')
  })

  it('verifyPrunedIntegrity() => should correctly report unpruned Tries', async () => {
    // Create empty MerklePatriciaTrie (is pruned)
    let trie = new MerklePatriciaTrie()
    // Create a new value (still is pruned)
    await trie.put(hexToBytes('0xaa'), hexToBytes('0xbb'))
    // Overwrite this value (trie is now not pruned anymore)
    await trie.put(hexToBytes('0xaa'), hexToBytes('0xaa'))
    assert.ok(!(await trie.verifyPrunedIntegrity()), 'trie is not pruned')

    // Create new empty MerklePatriciaTrie (is pruned)
    trie = new MerklePatriciaTrie()
    // Create a new value raw in DB (is not pruned)
    await (<any>trie)._db.db.put(utf8ToBytes('aa'))
    assert.ok(!(await trie.verifyPrunedIntegrity()), 'trie is not pruned')
    await (<any>trie)._db.db.del(utf8ToBytes('aa'))
    assert.ok(await trie.verifyPrunedIntegrity(), 'trie is pruned')
    await trie.put(utf8ToBytes('aa'), utf8ToBytes('bb'))
    assert.ok(await trie.verifyPrunedIntegrity(), 'trie is pruned')
    await (<any>trie)._db.db.put(utf8ToBytes('aa'))
    assert.ok(!(await trie.verifyPrunedIntegrity()), 'trie is not pruned')
  })

  it('should prune when keys are updated or deleted (with `useRootPersistence` enabled)', async () => {
    for (let testID = 0; testID < 1; testID++) {
      const trie = await createMPT({ useNodePruning: true, useRootPersistence: true })
      const keys: Uint8Array[] = []
      for (let i = 0; i < 100; i++) {
        keys.push(randomBytes(32))
      }
      const values: string[] = []
      for (let i = 0; i < 1000; i++) {
        let val = Math.floor(Math.random() * 16384)
        while (values.includes(val.toString(16))) {
          val = Math.floor(Math.random() * 16384)
        }
        values.push(val.toString(16))
      }
      // Fill trie with items
      for (let i = 0; i < keys.length; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        const key = keys[idx]
        await trie.put(key, utf8ToBytes(values[i]))
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Randomly delete keys
      for (let i = 0; i < 20; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        await trie.del(keys[idx])
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Fill trie with items or randomly delete them
      for (let i = 0; i < keys.length; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        const key = keys[idx]
        if (Math.random() < 0.5) {
          await trie.put(key, utf8ToBytes(values[i]))
        } else {
          await trie.del(key)
        }
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Delete all keys
      for (let idx = 0; idx < 100; idx++) {
        await trie.del(keys[idx])
      }

      assert.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')
      assert.ok(equalsBytes(trie.root(), KECCAK256_RLP), 'trie is empty')

      let dbKeys = 0
      for (const _dbkey of (<any>trie)._db.db._database.keys()) {
        dbKeys++
      }
      assert.ok(dbKeys === 1, 'db is empty')
    }
  })
})
