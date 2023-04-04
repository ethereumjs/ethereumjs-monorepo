import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { AccountCache, CacheType } from '../../src/cache'
import { createAccount } from '../util'

import type { Account } from '@ethereumjs/util'

tape('cache initialization', (t) => {
  t.test('should initialize', async (st) => {
    const cache = new AccountCache({ size: 100, type: CacheType.LRU })

    st.equal(cache._checkpoints, 0, 'initializes given trie')
    st.end()
  })
})

tape('cache put and get account', (t) => {
  const cache = new AccountCache({ size: 100, type: CacheType.LRU })

  const addr = new Address(Buffer.from('10'.repeat(20), 'hex'))
  const acc: Account = createAccount(BigInt(1), BigInt(0xff11))
  const accRLP = acc.serialize()

  t.test(
    'should return undefined for CacheElement if account not present in the cache',
    async (st) => {
      const elem = cache.get(addr)
      st.ok(elem === undefined)
      st.end()
    }
  )

  t.test('should put account', async (st) => {
    cache.put(addr, acc)
    const elem = cache.get(addr)
    st.ok(elem !== undefined && elem.accountRLP && elem.accountRLP.equals(accRLP))
    st.end()
  })

  t.test('should flush to trie', async (st) => {
    await cache.flush()
    st.end()
  })

  t.test('should delete account from cache', async (st) => {
    cache.del(addr)

    const elem = cache.get(addr)
    st.ok(elem !== undefined && elem.accountRLP === undefined)
    st.end()
  })
})

tape('cache checkpointing', (t) => {
  const cache = new AccountCache({ size: 100, type: CacheType.LRU })

  const addr = new Address(Buffer.from('10'.repeat(20), 'hex'))
  const acc = createAccount(BigInt(1), BigInt(0xff11))
  const accRLP = acc.serialize()

  const updatedAcc = createAccount(BigInt(0x00), BigInt(0xff00))
  const updatedAccRLP = updatedAcc.serialize()

  t.test('should revert to correct state', async (st) => {
    cache.put(addr, acc)
    cache.checkpoint()
    cache.put(addr, updatedAcc)

    let elem = cache.get(addr)
    st.ok(elem !== undefined && elem.accountRLP && elem.accountRLP.equals(updatedAccRLP))

    cache.revert()

    elem = cache.get(addr)
    st.ok(elem !== undefined && elem.accountRLP && elem.accountRLP.equals(accRLP))

    st.end()
  })

  t.test('cache clearing', async (st) => {
    const cache = new AccountCache({ size: 100, type: CacheType.LRU })
    cache.put(addr, acc)
    cache.clear()
    st.equal(cache.size(), 0, 'should delete cache objects with clear=true')

    st.end()
  })
})
