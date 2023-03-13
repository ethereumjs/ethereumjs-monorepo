import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { CacheType, StorageCache } from '../../src/cache'

tape('Storage Cache: initialization', (t) => {
  t.test('should initialize', async (st) => {
    const cache = new StorageCache({ size: 100, type: CacheType.LRU })

    st.equal(cache._checkpoints, 0, 'initializes given trie')
    st.end()
  })
})

tape('Storage Cache: put and get account', (t) => {
  const cache = new StorageCache({ size: 100, type: CacheType.LRU })

  const addr = new Address(Buffer.from('10'.repeat(20), 'hex'))
  const key = Buffer.from('01', 'hex')
  const value = Buffer.from('01', 'hex')

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
    st.ok(elem !== undefined && elem.equals(value))
    st.end()
  })

  t.test('should flush', async (st) => {
    const items = await cache.flush()
    st.equal(items.length, 1)
    st.end()
  })

  t.test('should delete storage value from cache', async (st) => {
    cache.del(addr, key)

    const elem = cache.get(addr, key)
    st.ok(elem !== undefined && elem.equals(Buffer.from('80', 'hex')))
    st.end()
  })
})

tape('Storage Cache: checkpointing', (t) => {
  const cache = new StorageCache({ size: 100, type: CacheType.LRU })

  const addr = new Address(Buffer.from('10'.repeat(20), 'hex'))
  const key = Buffer.from('01', 'hex')
  const value = Buffer.from('01', 'hex')

  const updatedValue = Buffer.from('02', 'hex')

  t.test('should revert to correct state', async (st) => {
    cache.put(addr, key, value)
    cache.checkpoint()
    cache.put(addr, key, updatedValue)

    let elem = cache.get(addr, key)
    st.ok(elem !== undefined && elem.equals(updatedValue))

    cache.revert()

    elem = cache.get(addr, key)
    st.ok(elem !== undefined && elem.equals(value))

    st.end()
  })

  t.test('cache clearing', async (st) => {
    const cache = new StorageCache({ size: 100, type: CacheType.LRU })
    cache.put(addr, key, value)
    cache.clear()
    st.equal(cache.size(), 0, 'should delete cache objects with clear=true')

    st.end()
  })
})
