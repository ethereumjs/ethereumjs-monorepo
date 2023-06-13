import { Address } from '@ethereumjs/util'
import { equalsBytes, hexToBytes } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { CacheType, StorageCache } from '../../src/cache/index.js'

describe('Storage Cache: initialization', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    it(`should initialize`, async () => {
      const cache = new StorageCache({ size: 100, type })

      assert.equal(cache._checkpoints, 0, 'initializes given trie')
    })
  }
})

describe('Storage Cache: put and get account', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new StorageCache({ size: 100, type })

    const addr = new Address(hexToBytes('10'.repeat(20)))
    const key = hexToBytes('01')
    const value = hexToBytes('01')

    it('should return undefined for CacheElement if account not present in the cache', async () => {
      const elem = cache.get(addr, key)
      assert.ok(elem === undefined)
    })

    it(`should put storage value`, async () => {
      cache.put(addr, key, value)
      const elem = cache.get(addr, key)
      assert.ok(elem !== undefined && equalsBytes(elem, value))
    })

    it(`should flush`, async () => {
      const items = cache.flush()
      assert.equal(items.length, 1)
    })

    it(`should delete storage value from cache`, async () => {
      cache.del(addr, key)

      const elem = cache.get(addr, key)
      assert.ok(elem !== undefined && equalsBytes(elem, hexToBytes('80')))
    })
  }
})

describe('Storage Cache: checkpointing', () => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const addr = new Address(hexToBytes('10'.repeat(20)))
    const key = hexToBytes('01')
    const value = hexToBytes('01')

    const updatedValue = hexToBytes('02')

    it(`should revert to correct state`, async () => {
      const cache = new StorageCache({ size: 100, type })
      cache.put(addr, key, value)
      cache.checkpoint()
      cache.put(addr, key, updatedValue)

      let elem = cache.get(addr, key)
      assert.ok(elem !== undefined && equalsBytes(elem, updatedValue))

      cache.revert()

      elem = cache.get(addr, key)
      assert.ok(elem !== undefined && equalsBytes(elem, value))
    })

    it(`should use outer revert`, async () => {
      const cache = new StorageCache({ size: 100, type })

      cache.checkpoint()
      cache.put(addr, key, value)
      cache.checkpoint()
      cache.put(addr, key, value)
      cache.commit()
      cache.revert()

      const elem = cache.get(addr, key)
      assert.ok(elem === undefined)
    })

    it(`should revert to unknown if nonexistent in cache before`, async () => {
      const cache = new StorageCache({ size: 100, type })

      cache.checkpoint()
      cache.put(addr, key, value)

      let elem = cache.get(addr, key)
      assert.ok(elem !== undefined && equalsBytes(elem, value))

      cache.revert()

      elem = cache.get(addr, key)
      assert.ok(elem === undefined)
    })

    it(`cache clearing`, async () => {
      const cache = new StorageCache({ size: 100, type: CacheType.LRU })
      cache.put(addr, key, value)
      cache.clear()
      assert.equal(cache.size(), 0, 'should delete cache objects with clear=true')
    })
  }
})
