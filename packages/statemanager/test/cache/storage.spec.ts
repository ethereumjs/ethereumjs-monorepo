import { Address } from '@ethereumjs/util'
import { equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { CacheType, StorageCache } from '../../src/cache'

tape('Storage Cache: initialization', (t) => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    t.test('should initialize', async (st) => {
      const cache = new StorageCache({ size: 100, type })

      st.equal(cache._checkpoints, 0, 'initializes given trie')
      st.end()
    })
  }
})

tape('Storage Cache: put and get account', (t) => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new StorageCache({ size: 100, type })

    const addr = new Address(hexToBytes('10'.repeat(20)))
    const key = hexToBytes('01')
    const value = hexToBytes('01')

    t.test(
      'should return undefined for CacheElement if account not present in the cache',
      async (st) => {
        const elem = cache.get(addr, key)
        st.ok(elem === undefined)
        st.end()
      }
    )

    t.test('should put storage value', async (st) => {
      cache.put(addr, key, value)
      const elem = cache.get(addr, key)
      st.ok(elem !== undefined && equalsBytes(elem, value))
      st.end()
    })

    t.test('should flush', async (st) => {
      const items = cache.flush()
      st.equal(items.length, 1)
      st.end()
    })

    t.test('should delete storage value from cache', async (st) => {
      cache.del(addr, key)

      const elem = cache.get(addr, key)
      st.ok(elem !== undefined && equalsBytes(elem, hexToBytes('80')))
      st.end()
    })
  }
})

tape('Storage Cache: checkpointing', (t) => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const addr = new Address(hexToBytes('10'.repeat(20)))
    const key = hexToBytes('01')
    const value = hexToBytes('01')

    const updatedValue = hexToBytes('02')

    t.test('should revert to correct state', async (st) => {
      const cache = new StorageCache({ size: 100, type })
      cache.put(addr, key, value)
      cache.checkpoint()
      cache.put(addr, key, updatedValue)

      let elem = cache.get(addr, key)
      st.ok(elem !== undefined && equalsBytes(elem, updatedValue))

      cache.revert()

      elem = cache.get(addr, key)
      st.ok(elem !== undefined && equalsBytes(elem, value))

      st.end()
    })

    t.test('should use outer revert', async (st) => {
      const cache = new StorageCache({ size: 100, type })

      cache.checkpoint()
      cache.put(addr, key, value)
      cache.checkpoint()
      cache.put(addr, key, value)
      cache.commit()
      cache.revert()

      const elem = cache.get(addr, key)
      st.ok(elem === undefined)
    })

    t.test('should revert to unknown if nonexistent in cache before', async (st) => {
      const cache = new StorageCache({ size: 100, type })

      cache.checkpoint()
      cache.put(addr, key, value)

      let elem = cache.get(addr, key)
      st.ok(elem !== undefined && equalsBytes(elem, value))

      cache.revert()

      elem = cache.get(addr, key)
      st.ok(elem === undefined)

      st.end()
    })

    t.test('cache clearing', async (st) => {
      const cache = new StorageCache({ size: 100, type: CacheType.LRU })
      cache.put(addr, key, value)
      cache.clear()
      st.equal(cache.size(), 0, 'should delete cache objects with clear=true')

      st.end()
    })
  }
})
