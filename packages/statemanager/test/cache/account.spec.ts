import { Account, Address, equalsBytes, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { AccountCache, CacheType } from '../../src/cache'
import { createAccount } from '../util'

tape('Account Cache: initialization', (t) => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    t.test('should initialize', async (st) => {
      const cache = new AccountCache({ size: 100, type })

      st.equal(cache._checkpoints, 0, 'initializes given trie')
      st.end()
    })
  }
})

tape('Account Cache: put and get account', (t) => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new AccountCache({ size: 100, type })

    const addr = new Address(hexStringToBytes('10'.repeat(20)))
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
      st.ok(elem !== undefined && elem.accountRLP && equalsBytes(elem.accountRLP, accRLP))
      st.end()
    })

    t.test('should flush', async (st) => {
      const items = cache.flush()
      st.equal(items.length, 1)
      st.end()
    })

    t.test('should delete account from cache', async (st) => {
      cache.del(addr)

      const elem = cache.get(addr)
      st.ok(elem !== undefined && elem.accountRLP === undefined)
      st.end()
    })
  }
})

tape('Account Cache: checkpointing', (t) => {
  for (const type of [CacheType.LRU, CacheType.ORDERED_MAP]) {
    const cache = new AccountCache({ size: 100, type })

    const addr = new Address(hexStringToBytes('10'.repeat(20)))
    const acc = createAccount(BigInt(1), BigInt(0xff11))
    const accRLP = acc.serialize()

    const updatedAcc = createAccount(BigInt(0x00), BigInt(0xff00))
    const updatedAccRLP = updatedAcc.serialize()

    t.test('should revert to correct state', async (st) => {
      cache.put(addr, acc)
      cache.checkpoint()
      cache.put(addr, updatedAcc)

      let elem = cache.get(addr)
      st.ok(elem !== undefined && elem.accountRLP && equalsBytes(elem.accountRLP, updatedAccRLP))

      cache.revert()

      elem = cache.get(addr)
      st.ok(elem !== undefined && elem.accountRLP && equalsBytes(elem.accountRLP, accRLP))

      st.end()
    })

    t.test('should use outer revert', async (st) => {
      const cache = new AccountCache({ size: 100, type: CacheType.LRU })

      const account1 = new Account(undefined, 1n)
      cache.checkpoint()
      cache.put(addr, account1)
      cache.checkpoint()
      cache.put(addr, account1)
      cache.commit()
      cache.revert()
      const accCmp = cache.get(addr)
      st.ok(accCmp === undefined)
    })

    t.test('cache clearing', async (st) => {
      const cache = new AccountCache({ size: 100, type: CacheType.LRU })
      cache.put(addr, acc)
      cache.clear()
      st.equal(cache.size(), 0, 'should delete cache objects with clear=true')

      st.end()
    })
  }
})
