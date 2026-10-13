import { Address, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CacheType, StorageCache } from '../../src/cache/index.ts'

describe('[StateManager/StorageCache]: initialization', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    it(`initializes`, async () => {
      const cache = new StorageCache({ size: 100, type })

      assert.strictEqual(cache._checkpoints, 0, 'initializes given trie')
    })
  }
})

describe('[StateManager/StorageCache]: put and get account', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new StorageCache({ size: 100, type })

    const addr = new Address(hexToBytes(`0x${'10'.repeat(20)}`))
    const key = hexToBytes('0x01')
    const value = hexToBytes('0x01')

    it('returns undefined for CacheElement if account not present in the cache', async () => {
      const elem = cache.get(addr, key)
      assert.isTrue(elem === undefined)
    })

    it(`puts storage value`, async () => {
      cache.put(addr, key, value)
      const elem = cache.get(addr, key)
      assert.isTrue(elem !== undefined && equalsBytes(elem, value))
    })

    it(`flushs`, async () => {
      const items = cache.flush()
      assert.strictEqual(items.length, 1)
    })

    it(`deletes storage value from cache`, async () => {
      cache.del(addr, key)

      const elem = cache.get(addr, key)
      assert.isTrue(elem !== undefined && equalsBytes(elem, hexToBytes('0x80')))
    })
  }
})

describe('[StateManager/StorageCache]: checkpointing', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const addr = new Address(hexToBytes(`0x${'10'.repeat(20)}`))
    const key = hexToBytes('0x01')
    const value = hexToBytes('0x01')

    const updatedValue = hexToBytes('0x02')

    it(`reverts to correct state`, async () => {
      const cache = new StorageCache({ size: 100, type })
      cache.put(addr, key, value)
      cache.checkpoint()
      cache.put(addr, key, updatedValue)

      let elem = cache.get(addr, key)
      assert.isTrue(elem !== undefined && equalsBytes(elem, updatedValue))

      cache.revert()

      elem = cache.get(addr, key)
      assert.isTrue(elem !== undefined && equalsBytes(elem, value))
    })

    it(`uses outer revert`, async () => {
      const cache = new StorageCache({ size: 100, type })

      cache.checkpoint()
      cache.put(addr, key, value)
      cache.checkpoint()
      cache.put(addr, key, value)
      cache.commit()
      cache.revert()

      const elem = cache.get(addr, key)
      assert.isTrue(elem === undefined)
    })

    it(`reverts to unknown if nonexistent in cache before`, async () => {
      const cache = new StorageCache({ size: 100, type })

      cache.checkpoint()
      cache.put(addr, key, value)

      let elem = cache.get(addr, key)
      assert.isTrue(elem !== undefined && equalsBytes(elem, value))

      cache.revert()

      elem = cache.get(addr, key)
      assert.isTrue(elem === undefined)
    })

    it(`cache clearing`, async () => {
      const cache = new StorageCache({ size: 100, type: CacheType.LRU })
      cache.put(addr, key, value)
      cache.clear()
      assert.strictEqual(cache.size(), 0, 'should delete cache objects with clear=true')
    })
  }
})
