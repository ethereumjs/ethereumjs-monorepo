import { KECCAK256_RLP } from '@ethereumjs/util'
import * as tape from 'tape'

import { Trie } from '../../src'

const crypto = require('crypto')

tape('Pruned trie tests', function (tester) {
  const it = tester.test

  it('should default to not prune the trie', async function (st) {
    const trie = new Trie()
    const key = Buffer.from('test')
    await trie.put(key, Buffer.from('1'))
    await trie.put(key, Buffer.from('2'))
    await trie.put(key, Buffer.from('3'))
    await trie.put(key, Buffer.from('4'))
    await trie.put(key, Buffer.from('5'))
    await trie.put(key, Buffer.from('6'))

    st.equals((<any>trie)._db.db._database.size, 6, 'DB size correct')
  })

  it('should prune simple trie', async function (st) {
    const trie = new Trie({ useNodePruning: true })
    const key = Buffer.from('test')
    await trie.put(key, Buffer.from('1'))
    await trie.put(key, Buffer.from('2'))
    await trie.put(key, Buffer.from('3'))
    await trie.put(key, Buffer.from('4'))
    await trie.put(key, Buffer.from('5'))
    await trie.put(key, Buffer.from('6'))

    st.equals((<any>trie)._db.db._database.size, 1, 'DB size correct')
  })

  it('should prune simple trie', async function (st) {
    const trie = new Trie({ useNodePruning: true })
    const key = Buffer.from('test')
    await trie.put(key, Buffer.from('1'))
    st.equals((<any>trie)._db.db._database.size, 1, 'DB size correct')

    await trie.del(key)
    st.equals((<any>trie)._db.db._database.size, 0, 'DB size correct')

    await trie.put(key, Buffer.from('1'))
    st.equals((<any>trie)._db.db._database.size, 1, 'DB size correct')
  })

  it('should prune trie with depth = 2', async function (st) {
    const trie = new Trie({ useNodePruning: true })
    // Create a Trie with
    const keys = ['01', '02', '0103', '0104', '0105']
    const values = ['00', '02', '03', '04', '05']

    for (let i = 0; i < keys.length; i++) {
      await trie.put(Buffer.from(keys[i], 'hex'), Buffer.from(values[i], 'hex'))
    }

    st.end()
  })

  it('should not prune if the same value is put twice', async function (st) {
    const trie = new Trie()
    const key = Buffer.from('01')
    const value = Buffer.from('02')

    await trie.put(key, value)
    await trie.put(key, value)
    const reported = await trie.get(key)
    st.ok(reported?.equals(value), 'value matches expected value')
  })

  it('should not throw if a key is either non-existent or deleted twice', async function (st) {
    const trie = new Trie()
    const key = Buffer.from('01')
    const value = Buffer.from('02')

    // key does not exist (empty trie)
    await trie.del(key)

    const key2 = Buffer.from('AA')
    const value2 = Buffer.from('ee')
    await trie.put(key2, value2)
    // key does not exist (non-empty trie)
    await trie.del(key)

    await trie.put(key, value)
    await trie.del(key)
    await trie.del(key)
    const reported = await trie.get(key)
    st.ok(reported === null, 'value is null')
    const reported2 = await trie.get(key2)
    st.ok(reported2?.equals(value2), 'value matches expected value')
  })

  it('should prune when keys are updated or deleted', async (st) => {
    for (let testID = 0; testID < 1; testID++) {
      const trie = new Trie({ useNodePruning: true })
      const keys: string[] = []
      for (let i = 0; i < 100; i++) {
        keys.push(crypto.randomBytes(32))
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
        await trie.put(Buffer.from(key), Buffer.from(values[i]))
      }

      st.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Randomly delete keys
      for (let i = 0; i < 20; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        await trie.del(Buffer.from(keys[idx]))
      }

      st.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Fill trie with items or randomly delete them
      for (let i = 0; i < keys.length; i++) {
        const idx = Math.floor(Math.random() * keys.length)
        const key = keys[idx]
        if (Math.random() < 0.5) {
          await trie.put(Buffer.from(key), Buffer.from(values[i]))
        } else {
          await trie.del(Buffer.from(key))
        }
      }

      st.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')

      // Delete all keys
      for (let idx = 0; idx < 100; idx++) {
        await trie.del(Buffer.from(keys[idx]))
      }

      st.ok(await trie.verifyPrunedIntegrity(), 'trie is correctly pruned')
      st.ok(trie.root().equals(KECCAK256_RLP), 'trie is empty')

      let dbKeys = 0
      for (const _dbkey of (<any>trie)._db.db._database.keys()) {
        dbKeys++
      }
      st.ok(dbKeys === 0, 'db is empty')
    }
  })

  it('verifyPrunedIntegrity() => should correctly report unpruned Tries', async (st) => {
    // Create empty Trie (is pruned)
    let trie = new Trie()
    // Create a new value (still is pruned)
    await trie.put(Buffer.from('aa', 'hex'), Buffer.from('bb', 'hex'))
    // Overwrite this value (trie is now not pruned anymore)
    await trie.put(Buffer.from('aa', 'hex'), Buffer.from('aa', 'hex'))
    st.ok(!(await trie.verifyPrunedIntegrity()), 'trie is not pruned')

    // Create new empty Trie (is pruned)
    trie = new Trie()
    // Create a new value raw in DB (is not pruned)
    await (<any>trie)._db.db.put(Buffer.from('aa', 'hex'))
    st.ok(!(await trie.verifyPrunedIntegrity()), 'trie is not pruned')
    await (<any>trie)._db.db.del(Buffer.from('aa', 'hex'))
    st.ok(await trie.verifyPrunedIntegrity(), 'trie is pruned')
    await trie.put(Buffer.from('aa', 'hex'), Buffer.from('bb', 'hex'))
    st.ok(await trie.verifyPrunedIntegrity(), 'trie is pruned')
    await (<any>trie)._db.db.put(Buffer.from('aa', 'hex'))
    st.ok(!(await trie.verifyPrunedIntegrity()), 'trie is not pruned')
  })
})
